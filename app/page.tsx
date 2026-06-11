'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BenefitsTable } from '@/components/benefits-table';
import { getBenefits } from '@/lib/data/benefits';
import type { ProductType } from '@/types';

const PRODUCTS: { type: ProductType; label: string; desc: string; icon: string }[] = [
  { type: 'dla_mnie',    label: 'Dla Mnie',    desc: 'Ubezpieczenie indywidualne — tylko Ty', icon: '👤' },
  { type: 'dla_nas',     label: 'Dla Nas',     desc: 'Ty + małżonek lub partner życiowy',     icon: '👫' },
  { type: 'dla_rodziny', label: 'Dla Rodziny', desc: 'Ty + partner + dzieci + rodzice',       icon: '👨‍👩‍👧‍👦' },
];

export default function Home() {
  const [open, setOpen] = useState<ProductType | null>(null);

  function toggle(type: ProductType) {
    setOpen(prev => prev === type ? null : type);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Aura Expert</p>
            <h1 className="text-lg font-bold text-gray-900">
              ERGO Razem <span className="text-[#E4002B]">Kalkulator</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Grupa Otwarta</p>
            <p className="text-xs text-gray-400">ER 01/25</p>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10">
        <div className="max-w-3xl mx-auto px-4 space-y-10">

          {/* Hero */}
          <section className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Grupowe ubezpieczenie na życie</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Sprawdź zakres ochrony i oblicz składkę — bez zobowiązań, w kilka minut.
              Wybierz wariant dla siebie lub swoich bliskich.
            </p>
            <Link
              href="/kalkulator/wiek"
              className="inline-block rounded-lg bg-[#E4002B] px-8 py-4 font-semibold text-white hover:bg-[#c00025] transition-colors"
            >
              Złóż wniosek →
            </Link>
          </section>

          {/* Product accordions */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 text-center">Kogo chcesz objąć ochroną?</h3>
            {PRODUCTS.map(p => (
              <div key={p.type} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => toggle(p.type)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-3xl">{p.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{p.label}</p>
                    <p className="text-sm text-gray-500">{p.desc}</p>
                  </div>
                  {open === p.type
                    ? <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
                    : <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                  }
                </button>

                {open === p.type && (
                  <div className="border-t border-gray-100 p-4">
                    <BenefitsTable benefits={getBenefits('A1', p.type, 'podstawowy')} />
                    <p className="mt-4 text-xs text-gray-400">
                      Przykładowe świadczenia dla wariantu Podstawowy, grupy wiekowej 18–40 lat.
                      Pełen zakres wariantów dostępny po wybraniu oferty.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Bottom CTA */}
          <section className="text-center py-4">
            <p className="text-gray-600 mb-4">Gotowy(-a)? Oblicz dokładną składkę dla swojej sytuacji.</p>
            <Link
              href="/kalkulator/wiek"
              className="inline-block rounded-lg bg-[#E4002B] px-8 py-4 font-semibold text-white hover:bg-[#c00025] transition-colors"
            >
              Przejdź do kalkulatora →
            </Link>
          </section>

        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-4">
        <p className="text-center text-xs text-gray-400">
          Szczegóły w OWU (kod ER 01/25). Obowiązuje od 2.06.2025 r.
        </p>
      </footer>
    </div>
  );
}
