'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCalculatorStore } from '@/store/calculator-store';

export default function SukcesPage() {
  // Adres e-mail przychodzi z pamięci (store), nie z adresu URL. Odczytujemy
  // go raz, przy pierwszym renderze, bo zaraz potem store jest czyszczony.
  const [email] = useState(() => useCalculatorStore.getState().submittedEmail ?? '');
  const reset = useCalculatorStore((s) => s.reset);

  // Czyścimy dane kalkulatora dopiero tutaj — po dotarciu na stronę sukcesu.
  // (Reset na stronie podsumowania wywoływał wyścig ze strażnikiem trasy,
  // który wyrzucał użytkownika z powrotem na początek kalkulatora.)
  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Zapytanie wysłane!</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Twoje dane kontaktowe i wybrana oferta zostały wysłane do agenta ERGO Hestia,
            który skontaktuje się z Tobą w ciągu <strong>1–2 dni roboczych</strong>.
          </p>
          {email && (
            <p className="text-sm text-gray-500 mb-8">
              Kopię podsumowania oferty wysłaliśmy na adres{' '}
              <strong className="text-gray-700">{email}</strong>.
            </p>
          )}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Wróć na stronę główną
            </Link>
            <Link
              href="/kalkulator/wiek"
              className="rounded-lg bg-[#E4002B] py-3 text-sm font-semibold text-white hover:bg-[#c00025] transition-colors"
            >
              Oblicz nową ofertę
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
