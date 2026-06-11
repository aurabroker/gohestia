'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Shield, Heart, Users, Star, Phone, FileText } from 'lucide-react';
import { VariantsComparisonTable } from '@/components/variants-comparison-table';
import type { ProductType } from '@/types';

const PRODUCTS: {
  type: ProductType;
  label: string;
  desc: string;
  icon: string;
  color: string;
  features: string[];
}[] = [
  {
    type: 'dla_mnie',
    label: 'Dla Mnie',
    desc: 'Ubezpieczenie indywidualne — kompleksowa ochrona tylko dla Ciebie',
    icon: '👤',
    color: 'from-blue-500 to-blue-700',
    features: ['Zgon z każdej przyczyny', 'Wypadki i NW', 'Leczenie szpitalne', 'Poważne zachorowania (56 jednostek)', 'Operacje chirurgiczne', 'Trwały uszczerbek'],
  },
  {
    type: 'dla_nas',
    label: 'Dla Nas',
    desc: 'Ty i Twój małżonek lub partner życiowy — ochrona dla dwojga',
    icon: '👫',
    color: 'from-rose-500 to-rose-700',
    features: ['Wszystko z pakietu "Dla Mnie"', 'Zgon małżonka / partnera', 'Trwałe inwalidztwo partnera', 'Poważne zachorowania partnera (12 jednostek)', 'Zgon rodziców i teściów'],
  },
  {
    type: 'dla_rodziny',
    label: 'Dla Rodziny',
    desc: 'Ty, partner, dzieci i rodzice — pełna ochrona całej rodziny',
    icon: '👨‍👩‍👧‍👦',
    color: 'from-emerald-500 to-emerald-700',
    features: ['Wszystko z pakietu "Dla Nas"', 'Zgon i inwalidztwo dziecka NW', 'Poważne zachorowania dziecka (18 jednostek)', 'Urodzenie dziecka / wada wrodzona', 'Osierocenie dziecka', 'Leczenie szpitalne dziecka'],
  },
];

const HIGHLIGHTS = [
  { icon: Shield, title: 'Ochrona 24/7', desc: 'Ubezpieczenie działa przez całą dobę, w Polsce i za granicą.' },
  { icon: Heart, title: '56 chorób objętych', desc: 'Poważne zachorowania — od zawału po nowotwory i udar mózgu.' },
  { icon: Star, title: 'Bez badań lekarskich', desc: 'Tylko ankieta medyczna wypełniana elektronicznie — szybko i prosto.' },
  { icon: Users, title: 'Ochrona całej rodziny', desc: 'Warianty obejmują partnera, dzieci oraz rodziców i teściów.' },
  { icon: Phone, title: 'Kontakt z agentem', desc: 'Dedykowany agent ERGO Hestia omówi szczegóły i pomoże wybrać wariant.' },
  { icon: FileText, title: 'Transparentne OWU', desc: 'Pełna dokumentacja dostępna — szczegóły w OWU kod ER 01/25.' },
];

export default function Home() {
  const [open, setOpen] = useState<ProductType | null>(null);

  function toggle(type: ProductType) {
    setOpen(prev => prev === type ? null : type);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Aura Expert sp. z o.o.</p>
            <h1 className="text-lg font-bold text-gray-900">
              ERGO Razem <span className="text-[#E4002B]">Kalkulator</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">Grupa Otwarta</p>
              <p className="text-xs text-gray-400">ER 01/25</p>
            </div>
            <Link
              href="/kalkulator/wiek"
              className="rounded-lg bg-[#E4002B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c00025] transition-colors"
            >
              Złóż wniosek →
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-[#8B0016] text-white">
          <div className="max-w-5xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium">
                Sopockie TU na Życie ERGO Hestia S.A.
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Grupowe ubezpieczenie na życie <span className="text-[#ff6b6b]">ERGO Razem</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Kompleksowa ochrona Ciebie i Twoich bliskich. Wypłaty nawet do <strong className="text-white">500 000 zł</strong> — bez badań lekarskich, w kilka minut online.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/kalkulator/wiek"
                  className="rounded-lg bg-[#E4002B] px-8 py-4 font-semibold text-white hover:bg-[#c00025] transition-colors text-lg"
                >
                  Oblicz składkę →
                </Link>
                <a
                  href="#produkty"
                  className="rounded-lg bg-white/10 px-8 py-4 font-semibold text-white hover:bg-white/20 transition-colors text-lg"
                >
                  Zobacz świadczenia ↓
                </a>
              </div>
            </div>
            {/* Visual panel */}
            <div className="hidden md:flex flex-col gap-4">
              <div className="rounded-2xl bg-white/10 backdrop-blur p-6 border border-white/20">
                <p className="text-sm text-gray-400 mb-1">Maksymalna wypłata za zgon NW</p>
                <p className="text-3xl font-bold">500 000 zł</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 backdrop-blur p-5 border border-white/20">
                  <p className="text-sm text-gray-400 mb-1">Poważne zachorowania</p>
                  <p className="text-2xl font-bold">56</p>
                  <p className="text-xs text-gray-400">jednostek chorobowych</p>
                </div>
                <div className="rounded-2xl bg-white/10 backdrop-blur p-5 border border-white/20">
                  <p className="text-sm text-gray-400 mb-1">Składka od</p>
                  <p className="text-2xl font-bold">57 zł</p>
                  <p className="text-xs text-gray-400">miesięcznie</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur p-5 border border-white/20">
                <p className="text-sm text-gray-400 mb-1">Leczenie szpitalne</p>
                <p className="text-xl font-bold">do 250 zł / dzień</p>
                <p className="text-xs text-gray-400">każdy dzień pobytu w szpitalu</p>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="bg-white border-b border-gray-100 py-14">
          <div className="max-w-5xl mx-auto px-4">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">Dlaczego ERGO Razem?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {HIGHLIGHTS.map(h => (
                <div key={h.title} className="flex gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-[#E4002B]/10 flex items-center justify-center">
                    <h.icon className="w-5 h-5 text-[#E4002B]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{h.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product accordions with full comparison tables */}
        <section id="produkty" className="py-14">
          <div className="max-w-5xl mx-auto px-4 space-y-6">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-gray-900">Wybierz zakres ochrony</h3>
              <p className="text-gray-500 mt-2">Kliknij, aby zobaczyć pełną tabelę świadczeń dla każdego wariantu</p>
            </div>

            {PRODUCTS.map(p => (
              <div key={p.type} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Accordion header */}
                <button
                  onClick={() => toggle(p.type)}
                  className="w-full text-left"
                >
                  <div className={`bg-gradient-to-r ${p.color} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{p.icon}</span>
                        <div>
                          <h4 className="text-xl font-bold">{p.label}</h4>
                          <p className="text-white/80 text-sm mt-0.5">{p.desc}</p>
                        </div>
                      </div>
                      <div className="shrink-0 ml-4">
                        {open === p.type
                          ? <ChevronUp className="h-6 w-6 text-white/70" />
                          : <ChevronDown className="h-6 w-6 text-white/70" />
                        }
                      </div>
                    </div>
                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {p.features.map(f => (
                        <span key={f} className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>

                {/* Expandable table */}
                {open === p.type && (
                  <div className="p-4 md:p-6">
                    <p className="text-sm text-gray-500 mb-4">
                      Pełna tabela świadczeń dla grupy wiekowej <strong>18–53 lat</strong>.
                      Kwoty dla pozostałych grup wiekowych (54–59 lat, 60–65 lat) mogą się różnić — sprawdź w kalkulatorze.
                    </p>
                    <VariantsComparisonTable product={p.type} ageGroup="A1" />
                    <div className="mt-6 flex justify-center">
                      <Link
                        href="/kalkulator/wiek"
                        className="rounded-lg bg-[#E4002B] px-8 py-3.5 font-semibold text-white hover:bg-[#c00025] transition-colors"
                      >
                        Oblicz swoją składkę →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white border-t border-gray-100 py-14">
          <div className="max-w-5xl mx-auto px-4">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">Jak to działa?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Podaj wiek', desc: 'Wpisz datę urodzenia — dopasujemy dostępne warianty.' },
                { step: '2', title: 'Ankieta', desc: 'Krótka ankieta medyczna — wypełniana tylko w przeglądarce, nic nie wysyłamy.' },
                { step: '3', title: 'Wybierz ofertę', desc: 'Porównaj warianty i skonfiguruj dodatki (MediPlan, Medical Assistance, Global Doctors).' },
                { step: '4', title: 'Agent oddzwoni', desc: 'Zostawiasz dane kontaktowe — agent ERGO Hestia skontaktuje się w 1–2 dni.' },
              ].map(s => (
                <div key={s.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#E4002B] text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">
                    {s.step}
                  </div>
                  <p className="font-semibold text-gray-900">{s.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[#E4002B] py-16">
          <div className="max-w-2xl mx-auto px-4 text-center text-white space-y-4">
            <h3 className="text-3xl font-bold">Gotowy(-a) na ochronę?</h3>
            <p className="text-white/80 text-lg">
              Oblicz składkę w kilka minut. Bez zobowiązań, bez badań lekarskich.
            </p>
            <Link
              href="/kalkulator/wiek"
              className="inline-block rounded-lg bg-white text-[#E4002B] px-10 py-4 font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Złóż wniosek →
            </Link>
          </div>
        </section>

      </main>

      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
            <p>© 2025 Aura Expert sp. z o.o. — Agent ERGO Hestia</p>
            <p>Szczegóły w OWU (kod ER 01/25). Obowiązuje od 2.06.2025 r.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a href="/polityka-prywatnosci" className="text-gray-500 hover:text-[#E4002B] transition-colors">Polityka prywatności</a>
            <span className="text-gray-300">|</span>
            <a href="/rodo" className="text-gray-500 hover:text-[#E4002B] transition-colors">RODO</a>
            <span className="text-gray-300">|</span>
            <a href="/regulamin" className="text-gray-500 hover:text-[#E4002B] transition-colors">Regulamin</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
