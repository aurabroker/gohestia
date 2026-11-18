import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="ft">
      <div className="wrap ft-grid">
        <div className="ft-who">
          <p>
            <strong className="font-semibold">Aura Expert sp. z o.o.</strong> jest agentem ERGO Hestii
            i prowadzi ten kalkulator. Ubezpieczycielem jest Sopockie Towarzystwo Ubezpieczeń na Życie
            ERGO Hestia S.A.
          </p>
          <p>
            Szczegóły w OWU (kod ER 01/25). Obowiązuje od 2.06.2025 r.
            <br />
            © 2025 Aura Expert sp. z o.o.
          </p>
        </div>
        <nav aria-labelledby="ft-o">
          <h2 id="ft-o">O ubezpieczeniu</h2>
          <ul>
            <li><Link href="/faq">Pytania i odpowiedzi</Link></li>
            <li><Link href="/katalog-zachorowan">Katalog poważnych zachorowań</Link></li>
            <li><Link href="/ubezpieczenia-dodatkowe">MediPlan i Medical Assistance</Link></li>
            <li><Link href="/global-doctors">Global Doctors</Link></li>
            <li><Link href="/zglos-roszczenie">Zgłoś roszczenie</Link></li>
          </ul>
        </nav>
        <nav aria-labelledby="ft-d">
          <h2 id="ft-d">Dokumenty</h2>
          <ul>
            <li><Link href="/informacja-o-agencie">Informacja o agencie</Link></li>
            <li><Link href="/regulamin">Regulamin</Link></li>
            <li><Link href="/polityka-prywatnosci">Polityka prywatności</Link></li>
            <li><Link href="/rodo">RODO</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
