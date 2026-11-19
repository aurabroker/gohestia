import Link from 'next/link';

/**
 * Jeden nagłówek całego serwisu (strona główna, kalkulator, strony treściowe):
 * jasna tabliczka w podwójnej ramce. Logo prowadzi na stronę główną; obok stoi
 * nazwa agenta, bo to serwis agenta, a nie ubezpieczyciela.
 */
export function SiteHeader() {
  return (
    <header className="hd">
      <div className="wrap">
        <div className="hd-in">
        <Link href="/" className="brand" aria-label="Aura Expert sp. z o.o., agent ERGO Hestii. Strona główna">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ergo-hestia-logo.jpg" alt="ERGO Hestia" width={120} height={66} />
          <span className="brand-t">
            <b>Aura Expert sp. z o.o.</b>
            <span>agent ERGO Hestii</span>
          </span>
        </Link>
        <nav className="hd-nav" aria-label="Główne">
          <Link href="/faq">Pytania i odpowiedzi</Link>
          <Link href="/zglos-roszczenie">Zgłoś roszczenie</Link>
        </nav>
        </div>
      </div>
    </header>
  );
}
