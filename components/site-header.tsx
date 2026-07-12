import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/ergo-hestia-logo.jpg" alt="ERGO Hestia" className="h-9 w-auto" />
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Aura Expert sp. z o.o.</p>
            <h1 className="text-base font-bold text-gray-800">
              ERGO Razem <span className="text-[#E4002B]">Kalkulator</span>
            </h1>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500">Grupa Otwarta</p>
            <p className="text-xs text-gray-400">ER 01/25</p>
          </div>
          <Link
            href="/kalkulator/wiek"
            className="rounded-lg bg-[#E4002B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c00025] transition-colors"
          >
            Złóż wniosek →
          </Link>
        </div>
      </div>
    </header>
  );
}
