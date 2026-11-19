import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function WykluczenieZdrowiePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="wrap of">
          <div className="max-w-[44rem]">
            <h1>Niestety nie możesz przystąpić do Grupy Otwartej</h1>
            <p className="of-lead">
              Na podstawie udzielonych odpowiedzi nie spełniasz warunków przystąpienia
              do ubezpieczenia ERGO Razem w trybie Grupy Otwartej.
            </p>

            <section className="qc mt-10" aria-labelledby="polisa-indywidualna">
              <h2 id="polisa-indywidualna">Polisa indywidualna ERGO Hestia</h2>
              <p className="qc-d">
                Możesz ubiegać się o indywidualną polisę na życie. Polisa indywidualna może:
              </p>
              <ul className="qc-l">
                <li>wymagać wypełnienia szczegółowej ankiety medycznej,</li>
                <li>lub poddania się badaniom lekarskim na koszt ubezpieczyciela.</li>
              </ul>
              <p className="hint mt-3">Zakres ochrony i składka ustalane są indywidualnie.</p>
            </section>

            <div className="mt-10 grid gap-2 min-[60rem]:flex min-[60rem]:flex-wrap">
              <a
                href="https://www.ergohestia.pl/ubezpieczenie-na-zycie/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                Wyceń polisę indywidualną
              </a>
              <a href="https://www.ergohestia.pl/kontakt/" className="btn-2">Skontaktuj się z agentem</a>
            </div>
            <Link href="/kalkulator/ankieta" className="back mt-4">Wróć do ankiety</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
