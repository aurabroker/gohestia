import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { PageHero } from '@/components/page-hero';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'Global Doctors — Ubezpieczenie Dodatkowe ERGO Razem',
  description: 'Global Doctors (kod GD 02/24) — dodatkowe ubezpieczenie dające dostęp do konsultacji z lekarzami specjalistami na świecie w przypadku poważnej diagnozy. Dostępne do 63. roku życia.',
};

export default function GlobalDoctorsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <PageHero
        eyebrow="Dodatkowe ubezpieczenie · kod GD 02/24"
        title={<>Global <span className="text-[#E4002B]">Doctors</span></>}
        description="Dostęp do konsultacji z lekarzami specjalistami na świecie, gdy diagnoza wymaga drugiej opinii. Dostępne dla Ubezpieczonych do 63. roku życia."
      />

      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 prose prose-sm max-w-none">
            <h2>Czym jest Global Doctors?</h2>
            <p>
              Global Doctors to dodatkowe ubezpieczenie do umowy grupowego ubezpieczenia na życie
              ERGO Razem, oznaczone kodem <strong>GD 02/24</strong>. W przypadku poważnej diagnozy
              medycznej daje ono Ubezpieczonemu dostęp do konsultacji i drugiej opinii lekarzy
              specjalistów spoza Polski — pomagając potwierdzić rozpoznanie i zweryfikować
              proponowany sposób leczenia.
            </p>

            <h2>Dla kogo</h2>
            <ul>
              <li>Dodatek dostępny jest dla Ubezpieczonych w wieku <strong>do 63 lat</strong> w dniu przystąpienia.</li>
              <li>
                Wysokość składki ustalana jest indywidualnie w zależności od wieku — orientacyjną
                kwotę zobaczysz przy konfigurowaniu oferty w{' '}
                <Link href="/kalkulator/wiek" className="text-[#E4002B] font-semibold hover:underline">
                  kalkulatorze
                </Link>
                .
              </li>
            </ul>

            <h2>Jak to działa</h2>
            <p>
              Ubezpieczenie realizowane jest na podstawie umowy zawartej pomiędzy ERGO Hestią
              a podmiotem organizującym świadczenia — Centrum Pomocy Osobom Poszkodowanym sp. z o.o.
              w Gdańsku. Po zgłoszeniu przypadku organizator kompletuje dokumentację medyczną
              i organizuje kontakt z odpowiednim specjalistą za granicą.
            </p>

            <h2>Jak zgłosić skorzystanie z Global Doctors</h2>
            <ul>
              <li>telefonicznie pod numerem <a href="tel:801107107">801 107 107</a> lub <a href="tel:+48585555555">(58) 555 55 55</a>,</li>
              <li>
                przez formularz na stronie{' '}
                <a href="https://zgloszenieroszczenia.ergohestia.pl" target="_blank" rel="noopener noreferrer">
                  zgloszenieroszczenia.ergohestia.pl
                </a>
                .
              </li>
            </ul>
            <p>
              Pełny opis trybu zgłaszania roszczeń, także dla pozostałych pakietów dodatkowych,
              znajdziesz na stronie{' '}
              <Link href="/zglos-roszczenie" className="text-[#E4002B] font-semibold hover:underline">
                Zgłoś roszczenie
              </Link>
              .
            </p>

            <h2>Pełne warunki ubezpieczenia</h2>
            <p>
              Szczegółowy zakres świadczeń, wyłączenia i procedurę korzystania z Global Doctors
              określają <strong>Warunki Dodatkowego Ubezpieczenia Global Doctors (kod GD 02/24)</strong>.
              Pełną treść dokumentu oraz odpowiedzi na dodatkowe pytania uzyskasz u swojego agenta
              ERGO Hestia — <a href="mailto:biuro@utratadochodu.com">biuro@utratadochodu.com</a>.
            </p>

            <div className="not-prose mt-8 flex justify-center">
              <Link
                href="/kalkulator/wiek"
                className="rounded-lg bg-[#E4002B] text-white px-8 py-3.5 font-semibold hover:bg-[#c00025] transition-colors shadow-sm"
              >
                Dodaj Global Doctors do oferty →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
