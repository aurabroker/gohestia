import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polityka Prywatności — Aura Expert sp. z o.o.',
};

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/" className="text-sm text-[#E4002B] hover:underline mb-6 inline-block">
          ← Powrót do strony głównej
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 prose prose-sm max-w-none">
          <h1 className="text-2xl font-bold text-gray-900">Polityka Prywatności</h1>
          <p className="text-gray-500 text-sm">Ostatnia aktualizacja: 1 czerwca 2025 r.</p>

          <h2>1. Administrator danych osobowych</h2>
          <p>
            Administratorem danych osobowych zbieranych za pośrednictwem niniejszego serwisu jest:<br />
            <strong>Aura Expert sp. z o.o.</strong><br />
            Agent ubezpieczeniowy ERGO Hestia<br />
            e-mail: biuro@utratadochodu.com
          </p>
          <p>
            Ubezpieczycielem jest:<br />
            <strong>Sopockie Towarzystwo Ubezpieczeń na Życie ERGO Hestia S.A.</strong><br />
            ul. Hestii 1, 81-731 Sopot<br />
            KRS: 0000040562
          </p>

          <h2>2. Cele i podstawy prawne przetwarzania danych</h2>
          <p>Dane osobowe przetwarzamy w następujących celach:</p>
          <ul>
            <li>
              <strong>Przedstawienie oferty ubezpieczeniowej</strong> — imię, nazwisko, adres e-mail, numer telefonu,
              preferowany region — na podstawie art. 6 ust. 1 lit. a RODO (zgoda osoby, której dane dotyczą).
            </li>
            <li>
              <strong>Kontakt telefoniczny lub e-mailowy</strong> w celu omówienia oferty — na podstawie wyrażonej zgody
              (art. 6 ust. 1 lit. a RODO).
            </li>
            <li>
              <strong>Marketing usług ubezpieczeniowych</strong> — wyłącznie po wyrażeniu odrębnej zgody marketingowej
              (art. 6 ust. 1 lit. a RODO).
            </li>
          </ul>

          <h2>3. Dane medyczne — przetwarzanie wyłącznie lokalnie</h2>
          <p>
            Odpowiedzi na pytania ankiety medycznej są przetwarzane <strong>wyłącznie lokalnie
            w przeglądarce użytkownika (JavaScript po stronie klienta)</strong>. Żadne odpowiedzi
            z ankiety nie są przesyłane na serwer, zapisywane w bazie danych ani logowane.
            Do naszych serwerów trafia jedynie: dane kontaktowe, wybrana konfiguracja oferty
            (produkt, wariant, dodatki, składka) oraz token weryfikacji Cloudflare Turnstile.
          </p>

          <h2>4. Odbiorcy danych</h2>
          <p>Dane kontaktowe oraz wybrana konfiguracja oferty są przekazywane:</p>
          <ul>
            <li>Agentowi ubezpieczeniowemu <strong>Aura Expert sp. z o.o.</strong> w celu nawiązania kontaktu.</li>
            <li>Dostawcy usługi poczty e-mail <strong>Resend Inc.</strong> (przetwarzanie w celu wysyłki wiadomości e-mail).</li>
            <li><strong>Cloudflare Inc.</strong> — hosting, CDN, weryfikacja Turnstile.</li>
          </ul>

          <h2>5. Okres przechowywania danych</h2>
          <p>
            Dane kontaktowe przesłane przez formularz są przekazywane agentowi w formie wiadomości e-mail
            i nie są przechowywane przez serwis w żadnej bazie danych. Kopie e-maili mogą być
            przechowywane przez agenta przez czas niezbędny do realizacji celu kontaktu,
            nie dłużej niż 3 lata lub do odwołania zgody.
          </p>

          <h2>6. Prawa osoby, której dane dotyczą</h2>
          <p>Przysługują Ci następujące prawa:</p>
          <ul>
            <li><strong>Prawo dostępu</strong> do swoich danych (art. 15 RODO)</li>
            <li><strong>Prawo sprostowania</strong> danych (art. 16 RODO)</li>
            <li><strong>Prawo do usunięcia</strong> danych („prawo do bycia zapomnianym") (art. 17 RODO)</li>
            <li><strong>Prawo do ograniczenia przetwarzania</strong> (art. 18 RODO)</li>
            <li><strong>Prawo do przenoszenia danych</strong> (art. 20 RODO)</li>
            <li><strong>Prawo sprzeciwu</strong> wobec przetwarzania (art. 21 RODO)</li>
            <li><strong>Prawo do cofnięcia zgody</strong> w dowolnym momencie — bez wpływu na zgodność z prawem
            przetwarzania przed jej cofnięciem</li>
            <li><strong>Prawo wniesienia skargi</strong> do organu nadzorczego — Prezesa Urzędu Ochrony Danych
            Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa</li>
          </ul>
          <p>
            W celu realizacji praw skontaktuj się z nami pod adresem: <strong>biuro@utratadochodu.com</strong>
          </p>

          <h2>7. Pliki cookie i analityka</h2>
          <p>
            Serwis korzysta z <strong>Cloudflare Web Analytics</strong> — narzędzia privacy-first, które
            nie używa plików cookie ani nie śledzi użytkowników między stronami. Nie stosujemy
            plików cookie do celów marketingowych ani profilowania.
          </p>

          <h2>8. Przekazywanie danych poza EOG</h2>
          <p>
            Dane mogą być przekazywane do Resend Inc. i Cloudflare Inc. z siedzibą w USA.
            Transfer odbywa się na podstawie standardowych klauzul umownych (SCC) zatwierdzonych
            przez Komisję Europejską.
          </p>

          <h2>9. Zmiany polityki</h2>
          <p>
            Zastrzegamy prawo do zmiany niniejszej polityki. O istotnych zmianach poinformujemy
            poprzez aktualizację daty na początku dokumentu.
          </p>
        </div>
      </div>
    </div>
  );
}
