'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { PageHero } from '@/components/page-hero';
import { SiteFooter } from '@/components/site-footer';

interface FaqItem {
  q: string;
  a: React.ReactNode;
}

interface FaqGroup {
  title: string;
  items: FaqItem[];
}

const GROUPS: FaqGroup[] = [
  {
    title: 'Przystąpienie i ankieta medyczna',
    items: [
      {
        q: 'Kto może przystąpić do ERGO Razem?',
        a: 'Osoby w wieku 18–65 lat, w ramach Grupy Otwartej. Wiek w dniu przystąpienia decyduje o przypisaniu do grupy taryfowej: A1 (18–53 lat), A2 (54–59 lat) lub B (60–65 lat).',
      },
      {
        q: 'Czy muszę przechodzić badania lekarskie?',
        a: 'Nie. Wystarczy wypełnić krótką ankietę medyczną online. Ankieta jest przetwarzana wyłącznie lokalnie w Twojej przeglądarce i nigdzie nie jest wysyłana ani zapisywana.',
      },
      {
        q: 'Ile trwa cały proces?',
        a: 'Wybór wariantu i wyliczenie orientacyjnej składki zajmuje kilka minut online. Po zostawieniu danych kontaktowych agent ERGO Hestia oddzwania zwykle w ciągu 1–2 dni roboczych, aby dopiąć formalności.',
      },
      {
        q: 'Mam mniej niż 18 lub więcej niż 65 lat — czy mogę przystąpić?',
        a: 'Niestety nie — w trybie Grupy Otwartej ERGO Razem jest dostępne wyłącznie dla osób w wieku 18–65 lat.',
      },
    ],
  },
  {
    title: 'Warianty i zakres ochrony',
    items: [
      {
        q: 'Jakie warianty produktu są dostępne?',
        a: 'Dla Mnie (ochrona indywidualna), Dla Nas (Ty i małżonek lub partner) oraz Dla Rodziny (Ty, partner, dzieci, rodzice i teściowie). W ramach każdego z nich dostępnych jest kilka wariantów składkowych — Podstawowy, Rozszerzony, Komfort i Premium/Prestiż — a ich dostępność zależy od produktu i grupy wiekowej.',
      },
      {
        q: 'Ile poważnych zachorowań obejmuje ochrona?',
        a: (
          <>
            Pełny katalog obejmuje kilkadziesiąt jednostek chorobowych — dokładna liczba zależy od wybranego wariantu i osoby ubezpieczonej. Szczegółową listę z definicjami znajdziesz w{' '}
            <Link href="/katalog-zachorowan" className="text-[#E4002B] font-semibold hover:underline">
              Katalogu poważnych zachorowań
            </Link>
            .
          </>
        ),
      },
      {
        q: 'Czy ochrona obejmuje też rodzinę?',
        a: 'Tak. W wariantach Dla Nas i Dla Rodziny ochroną można objąć małżonka lub partnera życiowego, dzieci oraz rodziców i teściów — dokładny zakres różni się w zależności od wybranego wariantu.',
      },
      {
        q: 'Gdzie i kiedy działa ubezpieczenie?',
        a: 'Ochrona obowiązuje 24 godziny na dobę, zarówno w Polsce, jak i za granicą.',
      },
    ],
  },
  {
    title: 'Składki i płatności',
    items: [
      {
        q: 'Ile kosztuje ubezpieczenie?',
        a: 'Składki zaczynają się od 57 zł miesięcznie i zależą od wybranego produktu, wariantu, grupy wiekowej oraz dodatków. Dokładną, orientacyjną kwotę poznasz w kalkulatorze składek.',
      },
      {
        q: 'Czy wysokość składki zmienia się z wiekiem?',
        a: 'Składka zależy od grupy wiekowej, do której należysz w momencie przystąpienia (18–53, 54–59 lub 60–65 lat) — nie zmienia się automatycznie w trakcie trwania umowy z powodu upływu czasu w ramach tej samej grupy.',
      },
      {
        q: 'Czy wyliczenie w kalkulatorze jest wiążącą ofertą?',
        a: 'Nie. Kalkulator służy wyłącznie do orientacyjnego wyliczenia składki. Wiążącą ofertę i szczegóły płatności przedstawia agent ubezpieczeniowy po kontakcie.',
      },
    ],
  },
  {
    title: 'Ubezpieczenia dodatkowe',
    items: [
      {
        q: 'Czym jest MediPlan?',
        a: (
          <>
            To dodatek pokrywający koszty specjalistycznej pomocy medycznej po nieszczęśliwym wypadku (m.in. konsultacje specjalistów, badania diagnostyczne, rehabilitację) do sumy 10 000 zł. Zobacz{' '}
            <Link href="/ubezpieczenia-dodatkowe" className="text-[#E4002B] font-semibold hover:underline">
              pełne szczegóły MediPlan
            </Link>
            .
          </>
        ),
      },
      {
        q: 'Czym jest Medical Assistance?',
        a: (
          <>
            To pomoc opiekuńczo-medyczna dla Ubezpieczonego i najbliższych (m.in. wizyta lekarza, pielęgniarka, transport medyczny, opieka nad dziećmi lub zwierzętami) do 3 000 zł rocznie. Zobacz{' '}
            <Link href="/ubezpieczenia-dodatkowe" className="text-[#E4002B] font-semibold hover:underline">
              pełne szczegóły Medical Assistance
            </Link>
            .
          </>
        ),
      },
      {
        q: 'Czym jest Global Doctors?',
        a: (
          <>
            To dodatkowe ubezpieczenie (kod GD 02/24) dające dostęp do konsultacji z lekarzami specjalistami za granicą w przypadku poważnej diagnozy. Zobacz{' '}
            <Link href="/global-doctors" className="text-[#E4002B] font-semibold hover:underline">
              szczegóły Global Doctors
            </Link>
            .
          </>
        ),
      },
      {
        q: 'Czy dodatki są obowiązkowe?',
        a: 'Nie. MediPlan, Medical Assistance i Global Doctors to opcjonalne pakiety, które możesz włączyć lub pominąć podczas konfigurowania oferty w kalkulatorze.',
      },
    ],
  },
  {
    title: 'Roszczenia i rezygnacja',
    items: [
      {
        q: 'Jak zgłosić roszczenie?',
        a: (
          <>
            Roszczenie z podstawowej ochrony zgłaszasz przez Platformę Zgłaszania Roszczeń, podczas wizyty u agenta lub listownie. Roszczenia z MediPlan i Medical Assistance zgłasza się przez Centrum Alarmowe, a z Global Doctors — telefonicznie lub przez formularz online. Pełne instrukcje znajdziesz na stronie{' '}
            <Link href="/zglos-roszczenie" className="text-[#E4002B] font-semibold hover:underline">
              Zgłoś roszczenie
            </Link>
            .
          </>
        ),
      },
      {
        q: 'Czy mogę zrezygnować z ubezpieczenia?',
        a: 'Tak. Zgodę na przetwarzanie danych oraz udział w ubezpieczeniu możesz wycofać w dowolnym momencie, kontaktując się z agentem — bez wpływu na zgodność z prawem wcześniejszego przetwarzania.',
      },
      {
        q: 'Czy przesłanie formularza w kalkulatorze zobowiązuje mnie do zawarcia umowy?',
        a: 'Nie. Formularz służy wyłącznie do przedstawienia oferty — umowę zawierasz dopiero po kontakcie i weryfikacji z agentem.',
      },
    ],
  },
  {
    title: 'Dokumenty i kontakt',
    items: [
      {
        q: 'Kto jest ubezpieczycielem?',
        a: 'Sopockie Towarzystwo Ubezpieczeń na Życie ERGO Hestia S.A. z siedzibą w Sopocie.',
      },
      {
        q: 'Kto pośredniczy w sprzedaży?',
        a: (
          <>
            Aura Expert sp. z o.o. — agent ubezpieczeniowy działający na rzecz wielu towarzystw ubezpieczeń, w tym ERGO Hestii. Pełne informacje znajdziesz na stronie{' '}
            <Link href="/informacja-o-agencie" className="text-[#E4002B] font-semibold hover:underline">
              Informacja o agencie
            </Link>
            .
          </>
        ),
      },
      {
        q: 'Jak się z Wami skontaktować?',
        a: (
          <>
            Napisz na <a href="mailto:biuro@utratadochodu.com" className="text-[#E4002B] font-semibold hover:underline">biuro@utratadochodu.com</a> lub zostaw dane kontaktowe w{' '}
            <Link href="/kalkulator/wiek" className="text-[#E4002B] font-semibold hover:underline">
              kalkulatorze
            </Link>{' '}
            — agent oddzwoni w ciągu 1–2 dni roboczych.
          </>
        ),
      },
    ],
  },
];

export function Faq() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  function toggle(key: string) {
    setOpenKey(prev => (prev === key ? null : key));
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <PageHero
        eyebrow="Pytania i odpowiedzi"
        title={<>Najczęściej zadawane <span className="text-[#E4002B]">pytania</span></>}
        description="Wszystko, co warto wiedzieć o przystąpieniu, wariantach, składkach, dodatkach i zgłaszaniu roszczeń w ERGO Razem."
      />

      <main className="flex-1 py-14">
        <div className="max-w-3xl mx-auto px-4 space-y-10">
          {GROUPS.map(group => (
            <div key={group.title}>
              <h2 className="text-lg font-bold text-gray-900 mb-4">{group.title}</h2>
              <div className="space-y-3">
                {group.items.map(item => {
                  const key = `${group.title}__${item.q}`;
                  const open = openKey === key;
                  return (
                    <div
                      key={key}
                      className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                    >
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                      >
                        <span className="font-semibold text-gray-900">{item.q}</span>
                        {open
                          ? <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
                          : <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                        }
                      </button>
                      {open && (
                        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 border border-rose-100 p-8 text-center space-y-3">
            <h3 className="text-xl font-bold text-gray-900">Nie znalazłeś odpowiedzi?</h3>
            <p className="text-gray-600">Skontaktuj się z nami — agent ERGO Hestia odpowie na wszystkie pytania.</p>
            <Link
              href="/kalkulator/wiek"
              className="inline-block rounded-lg bg-[#E4002B] text-white px-8 py-3.5 font-semibold hover:bg-[#c00025] transition-colors shadow-sm"
            >
              Złóż wniosek →
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
