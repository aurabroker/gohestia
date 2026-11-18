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
    <div className="max-w-[40rem]">
      <h1>Zapytanie wysłane</h1>
      <p className="of-lead">
        Twoje dane kontaktowe i wybrana oferta zostały wysłane do agenta ERGO Hestia,
        który skontaktuje się z Tobą w ciągu <strong className="font-semibold">1–2 dni roboczych</strong>.
      </p>
      {email && (
        <p className="msg mt-5">
          Kopię podsumowania oferty wysłaliśmy na adres{' '}
          <strong className="break-all text-dlugopis">{email}</strong>.
        </p>
      )}
      <div className="mt-7 grid gap-3 sm:flex">
        <Link href="/" className="btn-2">Wróć na stronę główną</Link>
        <Link href="/kalkulator/wiek" className="btn-2">Sprawdź składkę jeszcze raz</Link>
      </div>
    </div>
  );
}
