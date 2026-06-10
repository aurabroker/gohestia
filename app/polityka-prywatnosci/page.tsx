import Link from 'next/link';

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/kalkulator/wiek" className="text-sm text-[#E4002B] hover:underline mb-6 inline-block">
          ← Wróć do kalkulatora
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 prose prose-sm max-w-none">
          <h1>Polityka Prywatności</h1>
          <p className="text-gray-500">Kalkulator ERGO Razem — Grupa Otwarta</p>

          <h2>Administrator danych</h2>
          <p>
            Sopockie Towarzystwo Ubezpieczeń na Życie ERGO Hestia S.A.<br />
            ul. Hestii 1, 81-731 Sopot
          </p>

          <h2>Cel przetwarzania</h2>
          <p>
            Dane osobowe (imię, nazwisko, email, telefon) są przetwarzane wyłącznie w celu
            przedstawienia oferty ubezpieczeniowej przez agenta ERGO Hestia.
          </p>

          <h2>Podstawa prawna</h2>
          <p>
            Art. 6 ust. 1 lit. a RODO — zgoda osoby, której dane dotyczą.
          </p>

          <h2>Dane medyczne</h2>
          <p>
            Odpowiedzi na pytania ankiety medycznej są przetwarzane <strong>wyłącznie
            lokalnie w przeglądarce użytkownika</strong>. Nie są przesyłane na żaden serwer
            ani nigdzie zapisywane.
          </p>

          <h2>Okres przechowywania</h2>
          <p>
            Dane kontaktowe nie są przechowywane przez administratora serwisu po wysłaniu
            emaila z ofertą do agenta.
          </p>

          <h2>Prawa użytkownika</h2>
          <p>
            Przysługuje Ci prawo dostępu, sprostowania, usunięcia i przeniesienia danych
            oraz prawo wniesienia sprzeciwu i skargi do UODO.
          </p>

          <h2>Pliki cookie i analityka</h2>
          <p>
            Serwis korzysta z Cloudflare Web Analytics — narzędzia privacy-first, które
            nie używa plików cookie ani nie śledzi użytkowników.
          </p>
        </div>
      </div>
    </div>
  );
}
