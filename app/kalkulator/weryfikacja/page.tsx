'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculator-store';

export default function WeryfikacjaPage() {
  const { ageGroup, questionnaireComplete, setTurnstileVerified } = useCalculatorStore();
  const router = useRouter();

  useEffect(() => {
    if (!ageGroup) router.replace('/kalkulator/wiek');
    else if (!questionnaireComplete) router.replace('/kalkulator/ankieta');
  }, [ageGroup, questionnaireComplete, router]);

  useEffect(() => {
    // Turnstile wyłączone na etap testów
    setTurnstileVerified(true);
    router.push('/kalkulator/produkt');
  }, []);

  return null;
}
