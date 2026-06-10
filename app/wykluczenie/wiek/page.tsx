import Link from 'next/link';

export default function WykluczenieWiekPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Niestety, Twój wiek nie spełnia warunków
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Grupowe ubezpieczenie ERGO Razem w trybie Grupy Otwartej jest dostępne
            dla osób w wieku od <strong>18 do 65 lat</strong>.
          </p>
          <p className="text-gray-600 mb-8">
            Jeśli masz inne pytania lub szukasz innego rodzaju ochrony, skontaktuj się
            z agentem ERGO Hestia.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="https://www.ergohestia.pl/kontakt/"
              className="rounded-lg bg-[#E4002B] py-3 font-semibold text-white hover:bg-[#c00025] transition-colors"
            >
              Skontaktuj się z agentem →
            </a>
            <Link
              href="/kalkulator/wiek"
              className="rounded-lg border border-gray-300 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Sprawdź ponownie
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
