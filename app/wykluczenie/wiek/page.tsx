import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function WykluczenieWiekPage() {
  return (
    <>
      <SiteHeader />
      <main className="sheet flex-1">
        <div className="wrap of">
          <div className="max-w-[40rem]">
            <h1>Niestety, Twój wiek nie spełnia warunków</h1>
            <p className="of-lead">
              Grupowe ubezpieczenie ERGO Razem w trybie Grupy Otwartej jest dostępne
              dla osób w wieku od <strong className="font-semibold">18 do 65 lat</strong>.
            </p>
            <p className="of-lead">
              Jeśli masz inne pytania lub szukasz innego rodzaju ochrony, skontaktuj się
              z agentem ERGO Hestia.
            </p>
            <div className="mt-7 grid gap-3 sm:flex">
              <a href="https://www.ergohestia.pl/kontakt/" className="btn">Skontaktuj się z agentem</a>
              <Link href="/kalkulator/wiek" className="btn-2">Sprawdź ponownie</Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
