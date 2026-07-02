import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Informacja o agencie ubezpieczeniowym — Aura Expert sp. z o.o.',
};

const ZAKLADY = [
  'UNUM Życie Towarzystwo Ubezpieczeń i Reasekuracji Spółka Akcyjna',
  'Generali Życie Towarzystwo Ubezpieczeń Spółka Akcyjna',
  'UNIQA Towarzystwo Ubezpieczeń na Życie Spółka Akcyjna',
  "Lloyd's Insurance Company SA/NV",
  'SALTUS Towarzystwo Ubezpieczeń na Życie Spółka Akcyjna',
  'SALTUS Towarzystwo Ubezpieczeń Wzajemnych',
  'Sopockie Towarzystwo Ubezpieczeń ERGO Hestia Spółka Akcyjna',
  'Sopockie Towarzystwo Ubezpieczeń na Życie ERGO Hestia Spółka Akcyjna',
  'Towarzystwo Ubezpieczeń na Życie WARTA Spółka Akcyjna',
  'Colonnade Insurance Societe Anonyme Oddział w Polsce',
];

export default function InformacjaOAgenciePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/" className="text-sm text-[#E4002B] hover:underline mb-6 inline-block">
          ← Powrót do strony głównej
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 prose prose-sm max-w-none">
          <h1 className="text-2xl font-bold text-gray-900">
            Informacja o agencie ubezpieczeniowym
          </h1>

          <p>
            Działając na podstawie art. 22 ust. 1 pkt 2–6 oraz ust. 2–4 ustawy z dnia
            15 grudnia 2017 r. o dystrybucji ubezpieczeń (Dz.U. z 2017 r., poz. 2486 ze zm.)
            (dalej „Ustawa”) niniejszym przekazujemy następujące informacje dotyczące
            Aura Expert spółka z ograniczoną odpowiedzialnością („Agent”):
          </p>

          <ol>
            <li>Agent jest agentem ubezpieczeniowym w rozumieniu Ustawy.</li>

            <li>Agent wykonuje działalność agencyjną pod firmą: Aura Expert sp. z o.o.</li>

            <li>Adres siedziby Agenta: ul. Bolkowska 2A/28, 01-466 Warszawa</li>

            <li>
              Adres korespondencyjny Agenta: ul. Bolkowska 2A/28, 01-466 Warszawa<br />
              Adres poczty elektronicznej:{' '}
              <a href="mailto:zarzad@auraexpert.pl">zarzad@auraexpert.pl</a><br />
              Kontakt pod nr telefonu: <a href="tel:+48504400901">+48 504 400 901</a>
            </li>

            <li>
              Agent jest wpisany do rejestru przedsiębiorców Krajowego Rejestru Sądowego
              prowadzonego przez Sąd Rejonowy dla m.st. Warszawy w Warszawie, XIII Wydział
              Gospodarczy Krajowego Rejestru Sądowego pod nr KRS 0000599840, NIP 5242793544,
              nr REGON 363673048, a wysokość kapitału zakładowego Agenta wynosi 5.000 zł.
            </li>

            <li>
              Agent jest wpisany do rejestru agentów prowadzonego przez Komisję Nadzoru
              Finansowego (dalej „KNF”) pod nr 11229690/A. Rejestr agentów dostępny jest
              na stronie internetowej KNF pod adresem:{' '}
              <a href="https://rpu.knf.gov.pl" target="_blank" rel="noopener noreferrer">
                https://rpu.knf.gov.pl
              </a>
              . Wpis do rejestru agentów można sprawdzić:
              <ol type="a">
                <li>
                  na stronie internetowej KNF pod adresem:{' '}
                  <a href="https://rpu.knf.gov.pl" target="_blank" rel="noopener noreferrer">
                    https://rpu.knf.gov.pl
                  </a>
                </li>
                <li>
                  telefonicznie – z Departamentem Licencji Ubezpieczeniowych pod numerem
                  22 262 49 76
                </li>
                <li>
                  pisemnie – adres korespondencyjny KNF: Komisja Nadzoru Finansowego,
                  ul. Piękna 20, skr. poczt. 419, 00-549 Warszawa
                </li>
              </ol>
            </li>

            <li>
              Agent nie posiada akcji ani udziałów żadnego zakładu ubezpieczeń
              uprawniających co najmniej do 10% głosów na walnym zgromadzeniu. Żaden
              zakład ubezpieczeń nie posiada udziałów Agenta uprawniających co najmniej
              do 10% głosów na zgromadzeniu wspólników Agenta.
            </li>

            <li>
              Agent działa na rzecz wielu zakładów ubezpieczeń. Agent wykonuje działalność
              agencyjną na rzecz następujących zakładów ubezpieczeń:
              <ol>
                {ZAKLADY.map((z) => (
                  <li key={z}>{z}</li>
                ))}
              </ol>
            </li>

            <li>
              W związku z proponowanym zawarciem umowy ubezpieczenia Agent otrzymuje
              od zakładu ubezpieczeń prowizję uwzględnioną w kwocie składki ubezpieczeniowej.
              Agent może otrzymywać od zakładu ubezpieczeń również inny rodzaj wynagrodzenia.
            </li>

            <li>
              Klient Agenta będący osobą fizyczną lub osobą prawną albo spółką
              nieposiadającą osobowości prawnej może złożyć reklamację na działalność
              Agenta w zakresie niezwiązanym z udzielaną ochroną ubezpieczeniową.
              Reklamację można złożyć:
              <ol type="a">
                <li>
                  w formie pisemnej – osobiście, w jednostce Agenta obsługującej klientów,
                  albo przesyłką pocztową na adres: Aura Expert sp. z o.o.,
                  ul. Bolkowska 2A/28, 01-466 Warszawa
                </li>
                <li>
                  ustnie – telefonicznie pod numerem telefonu{' '}
                  <a href="tel:+48504400901">+48 504 400 901</a> albo osobiście do
                  protokołu podczas wizyty klienta w jednostce Agenta obsługującej klientów;
                </li>
                <li>
                  e-mailem na adres:{' '}
                  <a href="mailto:reklamacje@auraexpert.pl">reklamacje@auraexpert.pl</a>
                </li>
              </ol>
              Poza reklamacjami, wszyscy klienci Agenta mają możliwość złożenia skargi.
            </li>

            <li>
              Spór pomiędzy osobą fizyczną będącą klientem Agenta a Agentem w zakresie
              niezwiązanym z udzielaną ochroną ubezpieczeniową może być zakończony
              w drodze pozasądowego postępowania w sprawie rozwiązywania sporów
              prowadzonego przed Rzecznikiem Finansowym jako podmiotem uprawnionym
              w rozumieniu ustawy z dnia 23 września 2016 r. o pozasądowym rozpatrywaniu
              sporów konsumenckich. Udział Agenta w takim postępowaniu jest obowiązkowy
              zgodnie z art. 37 ustawy z dnia 5 sierpnia 2015 r. o rozpatrywaniu reklamacji
              przez podmioty rynku finansowego i o Rzeczniku Finansowym. Strona internetowa
              Rzecznika Finansowego dostępna jest pod adresem{' '}
              <a href="https://www.rf.gov.pl" target="_blank" rel="noopener noreferrer">
                www.rf.gov.pl
              </a>
              .
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
