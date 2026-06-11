'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCalculatorStore } from '@/store/calculator-store';
import { calcMonthlyPremium } from '@/lib/calculator';
import { VARIANT_LABELS, PRODUCT_LABELS, ADDONS } from '@/lib/data/premiums';
import { WAITING_PERIODS } from '@/lib/data/coverage';
import { BenefitsTable } from '@/components/benefits-table';
import type { Variant, ProductType } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

const schema = z.object({
  imie:          z.string().min(2, 'Min. 2 znaki').max(50),
  nazwisko:      z.string().min(2, 'Min. 2 znaki').max(50),
  email:         z.string().email('Nieprawidłowy adres email'),
  telefon:       z.string().regex(/^\+?[0-9\s\-]{9,15}$/, 'Nieprawidłowy numer telefonu'),
  agent_region:  z.string().optional(),
  zgoda_rodo:    z.literal(true, { message: 'Wymagana zgoda' }),
  zgoda_kontakt: z.literal(true, { message: 'Wymagana zgoda' }),
  zgoda_marketing: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function PodsumowaniePage() {
  const {
    ageGroup, birthDate, questionnaireComplete, turnstileVerified,
    selectedProduct, selectedVariant, addons, reset,
  } = useCalculatorStore();
  const router = useRouter();
  const [waitingOpen, setWaitingOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!ageGroup)                    router.replace('/kalkulator/wiek');
    else if (!questionnaireComplete)  router.replace('/kalkulator/ankieta');
    else if (!turnstileVerified)      router.replace('/kalkulator/weryfikacja');
    else if (!selectedProduct || !selectedVariant) router.replace('/kalkulator/produkt');
  }, [ageGroup, questionnaireComplete, turnstileVerified, selectedProduct, selectedVariant, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!ageGroup || !birthDate || !selectedProduct || !selectedVariant) return null;

  const monthly = calcMonthlyPremium(
    ageGroup, selectedProduct, selectedVariant as Variant, addons, birthDate
  );

  const activeAddons: string[] = [];
  if (addons.mediplan)          activeAddons.push(ADDONS.mediplan.label);
  if (addons.medicalAssistance) activeAddons.push(ADDONS.medical_assistance.label);
  if (addons.globalDoctors)     activeAddons.push(ADDONS.global_doctors.label);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/oferta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imie:     data.imie,
          nazwisko: data.nazwisko,
          email:    data.email,
          telefon:  data.telefon,
          oferta: {
            ageGroup,
            product:        selectedProduct,
            variant:        selectedVariant,
            addons:         activeAddons,
            monthlyPremium: monthly,
          },
        }),
      });
      if (res.ok) {
        reset();
        router.push(`/kalkulator/sukces?email=${encodeURIComponent(data.email)}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Podsumowanie oferty */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Twoja oferta</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-500">Produkt</p>
            <p className="font-semibold">{PRODUCT_LABELS[selectedProduct as ProductType]}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Wariant</p>
            <p className="font-semibold">{VARIANT_LABELS[selectedVariant as Variant]}</p>
          </div>
          {activeAddons.length > 0 && (
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Dodatki</p>
              <p className="font-semibold">{activeAddons.join(', ')}</p>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-[#E4002B]/5 border border-[#E4002B]/20 p-4 text-center mb-6">
          <p className="text-sm text-gray-600">Składka miesięczna</p>
          <p className="text-4xl font-bold text-[#E4002B]">{monthly} zł<span className="text-lg font-normal text-gray-500">/mies.</span></p>
        </div>

        <h3 className="font-semibold text-gray-900 mb-3">Pełny zakres świadczeń</h3>
        <div className="mb-4">
          <BenefitsTable
            ageGroup={ageGroup}
            product={selectedProduct as ProductType}
            variant={selectedVariant}
          />
        </div>

        <button
          onClick={() => setWaitingOpen(v => !v)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          {waitingOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Okresy karencji
        </button>
        {waitingOpen && (
          <div className="mt-3 rounded-lg bg-gray-50 p-4">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(WAITING_PERIODS).map(([k, v]) => (
                  <tr key={k} className="border-b border-gray-100 last:border-0">
                    <td className="py-1 text-gray-600">{k}</td>
                    <td className="py-1 text-right font-medium">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-xs text-gray-400">
          Materiał marketingowy. Szczegóły w OWU (kod ER 01/25).
        </p>
      </section>

      {/* Formularz kontaktowy */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Dane kontaktowe</h2>
        <p className="text-sm text-gray-600 mb-6">
          Dane kontaktowe i wybrana konfiguracja oferty zostaną przekazane agentowi
          ubezpieczeniowemu. <strong>Nie przekazujemy danych medycznych.</strong>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imię *</label>
              <input
                {...register('imie')}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
              />
              {errors.imie && <p className="mt-1 text-xs text-red-600">{errors.imie.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nazwisko *</label>
              <input
                {...register('nazwisko')}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
              />
              {errors.nazwisko && <p className="mt-1 text-xs text-red-600">{errors.nazwisko.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              {...register('email')}
              type="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
            <input
              {...register('telefon')}
              type="tel"
              placeholder="+48 500 600 700"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
            />
            {errors.telefon && <p className="mt-1 text-xs text-red-600">{errors.telefon.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region (opcjonalnie)</label>
            <input
              {...register('agent_region')}
              placeholder="np. Warszawa, Kraków..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                {...register('zgoda_rodo')}
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#E4002B]"
              />
              <span className="text-xs text-gray-600">
                <strong>*</strong> Wyrażam zgodę na przetwarzanie danych osobowych w celu
                przedstawienia oferty ubezpieczeniowej przez agenta ERGO Hestia (Sopockie TU na
                Życie ERGO Hestia S.A.).
              </span>
            </label>
            {errors.zgoda_rodo && <p className="text-xs text-red-600 ml-7">{errors.zgoda_rodo.message}</p>}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                {...register('zgoda_kontakt')}
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#E4002B]"
              />
              <span className="text-xs text-gray-600">
                <strong>*</strong> Wyrażam zgodę na kontakt telefoniczny lub email w celu omówienia oferty.
              </span>
            </label>
            {errors.zgoda_kontakt && <p className="text-xs text-red-600 ml-7">{errors.zgoda_kontakt.message}</p>}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                {...register('zgoda_marketing')}
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#E4002B]"
              />
              <span className="text-xs text-gray-600">
                Wyrażam zgodę na otrzymywanie informacji marketingowych.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#E4002B] py-4 font-semibold text-white hover:bg-[#c00025] transition-colors disabled:opacity-60"
          >
            {submitting ? 'Wysyłanie...' : 'Wyślij zapytanie do agenta →'}
          </button>
        </form>
      </section>
    </div>
  );
}
