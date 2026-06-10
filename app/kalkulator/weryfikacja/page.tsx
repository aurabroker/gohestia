'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculator-store';
import { Turnstile } from '@marsidev/react-turnstile';

export default function WeryfikacjaPage() {
  const { ageGroup, questionnaireComplete, setTurnstileVerified } = useCalculatorStore();
  const router = useRouter();

  useEffect(() => {
    if (!ageGroup) router.replace('/kalkulator/wiek');
    else if (!questionnaireComplete) router.replace('/kalkulator/ankieta');
  }, [ageGroup, questionnaireComplete, router]);

  if (!ageGroup || !questionnaireComplete) return null;

  const handleSuccess = async (token: string) => {
    const res = await fetch('/api/turnstile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (res.ok) {
      setTurnstileVerified(true);
      router.push('/kalkulator/produkt');
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="mb-6">
            <div className="text-5xl mb-3">🛡️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Weryfikacja</h2>
            <p className="text-gray-600">
              Potwierdź, że jesteś człowiekiem, aby przejść do konfiguratora oferty.
            </p>
          </div>

          <div className="flex justify-center">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA'}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
