import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="max-w-5xl mx-auto px-4 space-y-3">
        <div className="flex justify-center">
          <Link
            href="/zglos-roszczenie"
            className="inline-flex items-center gap-2 rounded-lg bg-[#E4002B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c00025] transition-colors shadow-sm"
          >
            Zgłoś roszczenie →
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© 2025 Aura Expert sp. z o.o. — Agent ERGO Hestia</p>
          <p>Szczegóły w OWU (kod ER 01/25). Obowiązuje od 2.06.2025 r.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <a href="/faq" className="text-gray-500 hover:text-[#E4002B] transition-colors">FAQ</a>
          <span className="text-gray-300">|</span>
          <a href="/polityka-prywatnosci" className="text-gray-500 hover:text-[#E4002B] transition-colors">Polityka prywatności</a>
          <span className="text-gray-300">|</span>
          <a href="/rodo" className="text-gray-500 hover:text-[#E4002B] transition-colors">RODO</a>
          <span className="text-gray-300">|</span>
          <a href="/regulamin" className="text-gray-500 hover:text-[#E4002B] transition-colors">Regulamin</a>
          <span className="text-gray-300">|</span>
          <a href="/informacja-o-agencie" className="text-gray-500 hover:text-[#E4002B] transition-colors">Informacja o agencie</a>
          <span className="text-gray-300">|</span>
          <a href="/katalog-zachorowan" className="text-gray-500 hover:text-[#E4002B] transition-colors">Katalog zachorowań</a>
          <span className="text-gray-300">|</span>
          <a href="/ubezpieczenia-dodatkowe" className="text-gray-500 hover:text-[#E4002B] transition-colors">MediPlan / Medical Assistance</a>
          <span className="text-gray-300">|</span>
          <a href="/global-doctors" className="text-gray-500 hover:text-[#E4002B] transition-colors">Global Doctors</a>
        </div>
      </div>
    </footer>
  );
}
