'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculator-store';
import { getVariants, isGlobalDoctorsEligible, calcMonthlyPremium } from '@/lib/calculator';
import { ProductCard } from '@/components/product-card';
import { AddonToggle } from '@/components/addon-toggle';
import { PremiumCalculator } from '@/components/premium-calculator';
import { BenefitsTable } from '@/components/benefits-table';
import { getBenefits } from '@/lib/data/benefits';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ProductType, Variant } from '@/types';

const PRODUCTS: { type: ProductType; label: string; desc: string; icon: string }[] = [
  { type: 'dla_mnie',    label: 'Dla Mnie',    desc: 'Ubezpieczenie indywidualne (Ty)', icon: '👤' },
  { type: 'dla_nas',     label: 'Dla Nas',     desc: 'Ty + małżonek / partner',         icon: '👫' },
  { type: 'dla_rodziny', label: 'Dla Rodziny', desc: 'Ty + partner + dzieci + rodzice', icon: '👨‍👩‍👧‍👦' },
];

export default function ProduktPage() {
  const {
    ageGroup, birthDate, questionnaireComplete, turnstileVerified,
    selectedProduct, selectedVariant, addons,
    setProduct, setVariant, toggleAddon,
  } = useCalculatorStore();
  const router = useRouter();
  const [benefitsOpen, setBenefitsOpen] = useState(false);

  useEffect(() => {
    if (!ageGroup)               router.replace('/kalkulator/wiek');
    else if (!questionnaireComplete) router.replace('/kalkulator/ankieta');
    else if (!turnstileVerified) router.replace('/kalkulator/weryfikacja');
  }, [ageGroup, questionnaireComplete, turnstileVerified, router]);

  if (!ageGroup || !birthDate) return null;

  const variants = selectedProduct ? getVariants(ageGroup, selectedProduct) : [];
  const globalEligible = isGlobalDoctorsEligible(birthDate);

  const monthly = selectedProduct && selectedVariant
    ? calcMonthlyPremium(ageGroup, selectedProduct, selectedVariant as Variant, addons, birthDate)
    : 0;

  return (
    <div className="space-y-8">
      {/* Krok A: typ produktu */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Wybierz zakres ochrony</h2>
        <p className="text-gray-600 mb-4 text-sm">Kogo chcesz objąć ubezpieczeniem?</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRODUCTS.map(p => (
            <button
              key={p.type}
              onClick={() => setProduct(p.type)}
              className={`rounded-xl border-2 p-5 text-left transition-all ${
                selectedProduct === p.type
                  ? 'border-[#E4002B] bg-[#E4002B]/5 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="text-3xl mb-2">{p.icon}</div>
              <p className="font-semibold text-gray-900">{p.label}</p>
              <p className="text-xs text-gray-500 mt-1">{p.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Krok B: wariant */}
      {selectedProduct && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Wybierz wariant</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Dla grupy wiekowej <strong>{ageGroup}</strong> dostępne warianty:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {variants.map(v => (
              <ProductCard
                key={v.variant}
                entry={v}
                selected={selectedVariant === v.variant}
                onSelect={() => setVariant(v.variant as Variant)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Zakres świadczeń */}
      {selectedVariant && (
        <section>
          <button
            onClick={() => setBenefitsOpen(v => !v)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            {benefitsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Zobacz pełny zakres świadczeń
          </button>
          {benefitsOpen && (
            <div className="mt-4">
              <BenefitsTable
                benefits={getBenefits(ageGroup, selectedProduct!, selectedVariant)}
              />
            </div>
          )}
        </section>
      )}

      {/* Krok C: dodatki */}
      {selectedVariant && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Dodatki</h2>
          <p className="text-gray-600 mb-4 text-sm">Rozszerz ochronę o pakiety medyczne:</p>
          <div className="space-y-3">
            <AddonToggle
              label="MediPlan"
              price="+9 zł/mies."
              tooltip="Dostęp do lekarzy specjalistów, badań i rehabilitacji"
              checked={addons.mediplan}
              onToggle={() => toggleAddon('mediplan')}
            />
            <AddonToggle
              label="Medical Assistance"
              price="+6 zł/mies."
              tooltip="Pomoc medyczna 24/7, transport medyczny, wizyty domowe"
              checked={addons.medicalAssistance}
              onToggle={() => toggleAddon('medicalAssistance')}
            />
            <AddonToggle
              label="Global Doctors"
              price="wycena wg wieku"
              tooltip={globalEligible
                ? 'Dostęp do lekarzy na całym świecie (do 63 r.ż.)'
                : 'Niedostępne dla osób powyżej 63 r.ż.'}
              checked={addons.globalDoctors}
              disabled={!globalEligible}
              onToggle={() => toggleAddon('globalDoctors')}
            />
          </div>
        </section>
      )}

      {/* Kalkulator */}
      {selectedVariant && (
        <section className="space-y-4">
          <PremiumCalculator
            base={monthly}
            addonMediplan={addons.mediplan}
            addonMedicalAssistance={addons.medicalAssistance}
            addonGlobalDoctors={addons.globalDoctors}
          />
          <button
            onClick={() => router.push('/kalkulator/podsumowanie')}
            className="w-full rounded-lg bg-[#E4002B] py-4 font-semibold text-white hover:bg-[#c00025] transition-colors"
          >
            Przejdź do podsumowania →
          </button>
        </section>
      )}
    </div>
  );
}
