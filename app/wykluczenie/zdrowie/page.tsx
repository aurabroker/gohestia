import Link from 'next/link';

export default function WykluczenieZdrowiePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
          <div className="text-5xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Niestety nie możesz przystąpić do Grupy Otwartej
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed text-center">
            Na podstawie udzielonych odpowiedzi nie spełniasz warunków przystąpienia
            do ubezpieczenia ERGO Razem w trybie Grupy Otwartej.
          </p>

          <div className="rounded-xl border-2 border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-center">
              Polisa indywidualna ERGO Hestia
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Możesz ubiegać się o indywidualną polisę na życie. Polisa indywidualna może:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                wymagać wypełnienia szczegółowej ankiety medycznej,
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                lub poddania się badaniom lekarskim na koszt ubezpieczyciela.
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              Zakres ochrony i składka ustalane są indywidualnie.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="https://www.ergohestia.pl/ubezpieczenie-na-zycie/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#E4002B] py-3 font-semibold text-white hover:bg-[#c00025] transition-colors text-center"
            >
              Wycen polisę indywidualną →
            </a>
            <a
              href="https://www.ergohestia.pl/kontakt/"
              className="rounded-lg border border-gray-300 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors text-center"
            >
              Skontaktuj się z agentem →
            </a>
            <Link
              href="/kalkulator/ankieta"
              className="text-center text-sm text-gray-400 hover:text-gray-600 py-2"
            >
              ← Wróć do ankiety
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
