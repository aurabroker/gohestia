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
  bg: string;
  border: string;
  accent: string;
  pillBg: string;
  features: string[];
}[] = [
  {
    type: 'dla_mnie',
    label: 'Dla Mnie',
    desc: 'Ubezpieczenie indywidualne — kompleksowa ochrona tylko dla Ciebie',
    icon: '👤',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    accent: 'text-blue-700',
    pillBg: 'bg-blue-100 text-blue-700',
    features: ['Zgon z każdej przyczyny', 'Wypadki i NW', 'Leczenie szpitalne', 'Poważne zachorowania (56 jednostek)', 'Operacje chirurgiczne', 'Trwały uszczerbek'],
  },
  {
    type: 'dla_nas',
    label: 'Dla Nas',
    desc: 'Ty i Twój małżonek lub partner życiowy — ochrona dla dwojga',
    icon: '👫',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    accent: 'text-rose-700',
    pillBg: 'bg-rose-100 text-rose-700',
    features: ['Wszystko z pakietu "Dla Mnie"', 'Zgon małżonka / partnera', 'Trwałe inwalidztwo partnera', 'Poważne zachorowania partnera (12 jednostek)', 'Zgon rodziców i teściów'],
  },
  {
    type: 'dla_rodziny',
    label: 'Dla Rodziny',
    desc: 'Ty, partner, dzieci i rodzice — pełna ochrona całej rodziny',
    icon: '👨‍👩‍👧‍👦',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    accent: 'text-emerald-700',
    pillBg: 'bg-emerald-100 text-emerald-700',
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
  const [age, setAge] = useState('');

  function toggle(type: ProductType) {
    setOpen(prev => prev === type ? null : type);
  }

  const ageNum = parseInt(age, 10);
  const ageGroup: 'A1' | 'A2' | 'B' | null =
    !age || isNaN(ageNum) ? null :
    ageNum >= 18 && ageNum <= 53 ? 'A1' :
    ageNum >= 54 && ageNum <= 59 ? 'A2' :
    ageNum >= 60 && ageNum <= 65 ? 'B' : null;

  const ageGroupLabel =
    ageGroup === 'A1' ? '18–53 lat' :
    ageGroup === 'A2' ? '54–59 lat' :
    ageGroup === 'B'  ? '60–65 lat' : null;

  const ageError =
    age && (isNaN(ageNum) || ageNum < 18 || ageNum > 65)
      ? 'Ubezpieczenie dostępne dla osób w wieku 18–65 lat.'
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Aura Expert sp. z o.o.</p>
            <h1 className="text-base font-bold text-gray-800">
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
        <section className="bg-gradient-to-br from-white via-red-50 to-rose-100 border-b border-rose-100">
          <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-[#E4002B]/10 text-[#E4002B] px-4 py-1 text-sm font-medium">
                Sopockie TU na Życie ERGO Hestia S.A.
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                Grupowe ubezpieczenie na życie <span className="text-[#E4002B]">ERGO Razem</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Kompleksowa ochrona Ciebie i Twoich bliskich. Wypłaty nawet do <strong className="text-gray-900">500 000 zł</strong> — bez badań lekarskich, w kilka minut online.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/kalkulator/wiek"
                  className="rounded-lg bg-[#E4002B] px-8 py-4 font-semibold text-white hover:bg-[#c00025] transition-colors text-lg shadow-sm"
                >
                  Oblicz składkę →
                </Link>
                <a
                  href="#produkty"
                  className="rounded-lg bg-white border border-gray-200 px-8 py-4 font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-lg shadow-sm"
                >
                  Zobacz świadczenia ↓
                </a>
              </div>
            </div>
            {/* Video panel */}
            <div className="hidden md:block relative rounded-2xl overflow-hidden shadow-xl border border-rose-100" style={{aspectRatio:'16/9'}}>
              <video
                src="/hero-family.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Stat overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5 flex gap-4 text-white">
                <div>
                  <p className="text-2xl font-bold">500 000 zł</p>
                  <p className="text-xs text-white/70">maks. wypłata za zgon NW</p>
                </div>
                <div className="border-l border-white/30 pl-4">
                  <p className="text-2xl font-bold">od 57 zł</p>
                  <p className="text-xs text-white/70">składka miesięczna</p>
                </div>
                <div className="border-l border-white/30 pl-4">
                  <p className="text-2xl font-bold">56</p>
                  <p className="text-xs text-white/70">chorób objętych</p>
                </div>
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
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Wybierz zakres ochrony</h3>
                  <p className="text-gray-500 mt-1 text-sm">Kliknij produkt, aby zobaczyć pełną tabelę świadczeń i składek.</p>
                </div>
                <div className="shrink-0">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Twój wiek</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={18}
                      max={65}
                      placeholder="np. 35"
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
                    />
                    {ageGroupLabel && (
                      <span className="rounded-full bg-[#E4002B]/10 text-[#E4002B] text-xs font-semibold px-3 py-1">
                        Grupa {ageGroup} · {ageGroupLabel}
                      </span>
                    )}
                  </div>
                  {ageError && <p className="mt-1 text-xs text-red-500">{ageError}</p>}
                  {!age && <p className="mt-1 text-xs text-gray-400">Wpisz wiek, aby zobaczyć Twoje składki</p>}
                </div>
              </div>
            </div>

            {PRODUCTS.map(p => (
              <div key={p.type} className={`rounded-2xl border ${p.border} shadow-sm overflow-hidden`}>
                <button
                  onClick={() => toggle(p.type)}
                  className="w-full text-left"
                >
                  <div className={`${p.bg} p-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{p.icon}</span>
                        <div>
                          <h4 className={`text-xl font-bold ${p.accent}`}>{p.label}</h4>
                          <p className="text-gray-600 text-sm mt-0.5">{p.desc}</p>
                        </div>
                      </div>
                      <div className="shrink-0 ml-4">
                        {open === p.type
                          ? <ChevronUp className="h-6 w-6 text-gray-400" />
                          : <ChevronDown className="h-6 w-6 text-gray-400" />
                        }
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {p.features.map(f => (
                        <span key={f} className={`rounded-full ${p.pillBg} px-3 py-1 text-xs font-medium`}>
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>

                {open === p.type && (
                  <div className="p-4 md:p-6">
                    {ageGroupLabel && (
                      <p className="text-sm text-gray-500 mb-4">
                        Składki i świadczenia dla grupy wiekowej <strong>{ageGroupLabel}</strong>.
                      </p>
                    )}
                    <VariantsComparisonTable product={p.type} ageGroup={ageGroup ?? 'A1'} />
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
        <section className="bg-gradient-to-br from-rose-50 to-red-50 border-t border-rose-100 py-16">
          <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
            <h3 className="text-3xl font-bold text-gray-900">Gotowy(-a) na ochronę?</h3>
            <p className="text-gray-600 text-lg">
              Oblicz składkę w kilka minut. Bez zobowiązań, bez badań lekarskich.
            </p>
            <Link
              href="/kalkulator/wiek"
              className="inline-block rounded-lg bg-[#E4002B] text-white px-10 py-4 font-bold text-lg hover:bg-[#c00025] transition-colors shadow-sm"
            >
              Złóż wniosek →
            </Link>
          </div>
        </section>

      </main>

      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 space-y-3">
          <div className="flex justify-center">
            <Link
              href="/zglos-roszczenie"
              className="inline-flex items-center gap-2 rounded-lg bg-[#E4002B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c00025] transition-colors shadow-sm"
            >
              Zgłoś roszczenie →
            </Link>
          </div>
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
            <span className="text-gray-300">|</span>
            <a href="/informacja-o-agencie" className="text-gray-500 hover:text-[#E4002B] transition-colors">Informacja o agencie</a>
            <span className="text-gray-300">|</span>
            <a href="/katalog-zachorowan" className="text-gray-500 hover:text-[#E4002B] transition-colors">Katalog zachorowań</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
