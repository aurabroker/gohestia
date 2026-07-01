'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useCalculatorStore } from '@/store/calculator-store';
import { TURNSTILE_SITE_KEY } from '@/lib/turnstile-config';

export default function WeryfikacjaPage() {
  const { ageGroup, questionnaireComplete, setTurnstileVerified } = useCalculatorStore();
  const router = useRouter();
  const widgetRef = useRef<TurnstileInstance | null>(null);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'error'>('idle');

  useEffect(() => {
    if (!ageGroup) router.replace('/kalkulator/wiek');
    else if (!questionnaireComplete) router.replace('/kalkulator/ankieta');
  }, [ageGroup, questionnaireComplete, router]);

  // Błąd weryfikacji → RETRY: zresetuj widget, żeby wygenerował nowy token
  // (tokeny Turnstile są jednorazowe) i pozwól spróbować ponownie.
  const retry = () => {
    setStatus('error');
    widgetRef.current?.reset();
  };

  const handleSuccess = async (token: string) => {
    setStatus('verifying');
    try {
      const res = await fetch('/api/turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        setTurnstileVerified(true);
        router.push('/kalkulator/produkt');
        return;
      }
    } catch {
      // sieć/serwer padł — potraktuj jak błąd weryfikacji poniżej
    }
    retry();
  };

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <p className="text-sm text-gray-600">
        Potwierdź, że nie jesteś robotem, aby przejść dalej.
      </p>

      <Turnstile
        ref={widgetRef}
        siteKey={TURNSTILE_SITE_KEY}
        onSuccess={handleSuccess}
        onError={retry}
        onExpire={retry}
      />

      {status === 'verifying' && (
        <p className="text-sm text-gray-500">Weryfikacja…</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600">
          Weryfikacja nie powiodła się. Spróbuj ponownie.
        </p>
      )}
    </div>
  );
}
