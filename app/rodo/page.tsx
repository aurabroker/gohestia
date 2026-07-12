import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { PageHero } from '@/components/page-hero';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'Klauzula RODO — Aura Expert sp. z o.o.',
};

export default function RodoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <PageHero
        eyebrow="Aura Expert sp. z o.o."
        title={<>Klauzula Informacyjna <span className="text-[#E4002B]">RODO</span></>}
        description="Zgodnie z art. 13 Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO)."
      />

      <main className="flex-1 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 prose prose-sm max-w-none">
          <h2>1. Administrator danych</h2>
          <p>
            Administratorem Twoich danych osobowych jest:<br />
            <strong>Aura Expert sp. z o.o.</strong><br />
            Agent ubezpieczeniowy działający w imieniu<br />
            Sopockie TU na Życie ERGO Hestia S.A., ul. Hestii 1, 81-731 Sopot<br />
            Kontakt: <strong>biuro@utratadochodu.com</strong>
          </p>

          <h2>2. Cel przetwarzania</h2>
          <p>Twoje dane osobowe (imię, nazwisko, e-mail, telefon, opcjonalnie region) są przetwarzane w celu:</p>
          <ul>
            <li>przedstawienia indywidualnej oferty grupowego ubezpieczenia na życie ERGO Razem,</li>
            <li>nawiązania kontaktu przez agenta ubezpieczeniowego w celu omówienia oferty,</li>
            <li>przesyłania informacji marketingowych — wyłącznie po wyrażeniu odrębnej zgody.</li>
          </ul>

          <h2>3. Podstawa prawna</h2>
          <ul>
            <li>Art. 6 ust. 1 lit. <strong>a</strong> RODO — Twoja zgoda wyrażona w formularzu.</li>
          </ul>

          <h2>4. Co NIE jest przetwarzane</h2>
          <p>
            <strong>Dane wrażliwe z ankiety medycznej nie są przesyłane na żaden serwer.</strong>
            Odpowiedzi na pytania ankiety przetwarzane są wyłącznie lokalnie w Twojej przeglądarce
            i nie opuszczają Twojego urządzenia. Administratorowi przekazywana jest jedynie
            konfiguracja wybranej oferty (produkt, wariant, składka) — bez żadnych informacji
            o stanie zdrowia.
          </p>

          <h2>5. Odbiorcy danych</h2>
          <p>Dane mogą być przekazywane:</p>
          <ul>
            <li>agentowi ubezpieczeniowemu <strong>Aura Expert sp. z o.o.</strong>,</li>
            <li>dostawcy poczty e-mail <strong>Resend Inc.</strong> (transfer na podstawie SCC),</li>
            <li><strong>Cloudflare Inc.</strong> — infrastruktura hostingowa i CDN (transfer na podstawie SCC).</li>
          </ul>

          <h2>6. Okres przechowywania</h2>
          <p>
            Dane przechowywane są przez czas niezbędny do realizacji celu, tj. do zakończenia
            procesu przedstawienia oferty i nawiązania kontaktu — nie dłużej niż <strong>3 lata</strong>
            od daty wysłania formularza lub do cofnięcia zgody.
          </p>

          <h2>7. Twoje prawa</h2>
          <p>Masz prawo do:</p>
          <ul>
            <li><strong>dostępu</strong> do swoich danych (art. 15),</li>
            <li><strong>sprostowania</strong> danych (art. 16),</li>
            <li><strong>usunięcia</strong> danych (art. 17),</li>
            <li><strong>ograniczenia przetwarzania</strong> (art. 18),</li>
            <li><strong>przenoszenia danych</strong> (art. 20),</li>
            <li><strong>sprzeciwu</strong> (art. 21),</li>
            <li><strong>cofnięcia zgody</strong> w dowolnym momencie bez wpływu na zgodność z prawem
            przetwarzania przed cofnięciem,</li>
            <li><strong>wniesienia skargi</strong> do Prezesa Urzędu Ochrony Danych Osobowych
            (ul. Stawki 2, 00-193 Warszawa, www.uodo.gov.pl).</li>
          </ul>

          <h2>8. Dobrowolność podania danych</h2>
          <p>
            Podanie danych jest dobrowolne, jednak niezbędne do przedstawienia oferty ubezpieczeniowej
            i kontaktu przez agenta. Brak podania danych uniemożliwia realizację ww. celów.
          </p>

          <h2>9. Zautomatyzowane podejmowanie decyzji</h2>
          <p>
            Dane nie są wykorzystywane do zautomatyzowanego podejmowania decyzji ani profilowania
            w rozumieniu art. 22 RODO.
          </p>
        </div>
      </div>
      </main>

      <SiteFooter />
    </div>
  );
}
