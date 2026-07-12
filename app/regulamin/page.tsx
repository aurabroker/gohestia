import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { PageHero } from '@/components/page-hero';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'Regulamin — Aura Expert sp. z o.o.',
};

export default function RegulaminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <PageHero
        eyebrow="Aura Expert sp. z o.o."
        title={<>Regulamin <span className="text-[#E4002B]">serwisu</span></>}
        description="Zasady korzystania z serwisu prezentującego ofertę grupowego ubezpieczenia ERGO Razem."
      />

      <main className="flex-1 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 prose prose-sm max-w-none">
          <p className="text-gray-500 text-sm">Ostatnia aktualizacja: 1 czerwca 2025 r.</p>

          <h2>§1. Postanowienia ogólne</h2>
          <ol>
            <li>
              Niniejszy regulamin określa zasady korzystania z serwisu internetowego
              dostępnego pod adresem domeny obsługiwanej przez <strong>Aura Expert sp. z o.o.</strong>
              (dalej: „Serwis").
            </li>
            <li>
              Serwis służy do prezentacji oferty grupowego ubezpieczenia na życie
              <strong> ERGO Razem Grupy Otwartej</strong> (kod produktu ER 01/25) dystrybuowanego
              przez Sopockie TU na Życie ERGO Hestia S.A. z siedzibą w Sopocie.
            </li>
            <li>
              Operatorem Serwisu jest:<br />
              <strong>Aura Expert sp. z o.o.</strong><br />
              Agent ubezpieczeniowy wpisany do rejestru agentów ubezpieczeniowych KNF<br />
              Kontakt: biuro@utratadochodu.com
            </li>
            <li>
              Korzystanie z Serwisu oznacza akceptację niniejszego Regulaminu.
            </li>
          </ol>

          <h2>§2. Charakter informacji</h2>
          <ol>
            <li>
              Wszystkie informacje prezentowane w Serwisie, w tym tabele świadczeń i wyliczenia
              składek, mają charakter <strong>informacyjny i pomocniczy</strong>.
            </li>
            <li>
              Przedstawione kwoty świadczeń i składek nie stanowią oferty w rozumieniu
              Kodeksu Cywilnego. Wiążąca oferta przedstawiana jest przez agenta ubezpieczeniowego.
            </li>
            <li>
              Szczegółowe warunki ubezpieczenia określają <strong>Ogólne Warunki Ubezpieczenia
              ERGO Razem (kod ER 01/25)</strong> dostępne na stronie ERGO Hestia.
            </li>
          </ol>

          <h2>§3. Kalkulator i ankieta medyczna</h2>
          <ol>
            <li>
              Kalkulator składek służy wyłącznie do orientacyjnego obliczenia miesięcznej składki
              na podstawie wybranych parametrów.
            </li>
            <li>
              Ankieta medyczna przetwarzana jest <strong>wyłącznie lokalnie w przeglądarce użytkownika</strong>.
              Odpowiedzi nie są przesyłane na serwer ani zapisywane.
            </li>
            <li>
              Wynik ankiety medycznej nie stanowi oceny ryzyka ubezpieczeniowego. Ostateczna
              decyzja o przyjęciu do ubezpieczenia należy do Towarzystwa Ubezpieczeniowego.
            </li>
          </ol>

          <h2>§4. Formularz kontaktowy</h2>
          <ol>
            <li>
              Wypełnienie formularza i przesłanie danych kontaktowych jest dobrowolne.
            </li>
            <li>
              Po wysłaniu formularza dane przekazywane są agentowi ubezpieczeniowemu
              Aura Expert sp. z o.o., który skontaktuje się z użytkownikiem w terminie
              do 2 dni roboczych.
            </li>
            <li>
              Przesłanie formularza nie jest równoznaczne z zawarciem umowy ubezpieczenia.
            </li>
          </ol>

          <h2>§5. Odpowiedzialność</h2>
          <ol>
            <li>
              Operator Serwisu nie ponosi odpowiedzialności za decyzje podjęte na podstawie
              informacji zawartych w Serwisie bez uprzedniej konsultacji z agentem.
            </li>
            <li>
              Operator dokłada starań, aby informacje w Serwisie były aktualne i zgodne
              z obowiązującymi OWU, jednak zastrzega prawo do błędów.
            </li>
          </ol>

          <h2>§6. Własność intelektualna</h2>
          <ol>
            <li>
              Wszelkie treści Serwisu, w tym teksty, tabele i kod źródłowy, są własnością
              Aura Expert sp. z o.o. lub zostały udostępnione na podstawie stosownych licencji.
            </li>
            <li>
              Nazwa i logo ERGO Hestia są zastrzeżonymi znakami towarowymi Sopockiego TU na Życie
              ERGO Hestia S.A.
            </li>
          </ol>

          <h2>§7. Postanowienia końcowe</h2>
          <ol>
            <li>
              W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy
              prawa polskiego, w szczególności Kodeksu Cywilnego i Ustawy o dystrybucji ubezpieczeń.
            </li>
            <li>
              Operator zastrzega prawo do zmiany Regulaminu. Zmiany wchodzą w życie z dniem
              opublikowania zaktualizowanej wersji w Serwisie.
            </li>
            <li>
              Wszelkie spory rozstrzygane będą przez sąd właściwy miejscowo dla siedziby Operatora.
            </li>
          </ol>
        </div>
      </div>
      </main>

      <SiteFooter />
    </div>
  );
}
