'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculator-store';
import { QuestionnaireComponent } from '@/components/questionnaire';

export default function AnkietaPage() {
  const { ageGroup } = useCalculatorStore();
  const router = useRouter();

  useEffect(() => {
    if (!ageGroup) router.replace('/kalkulator/wiek');
  }, [ageGroup, router]);

  if (!ageGroup) return null;

  return (
    <div className="max-w-[52rem]">
      <h1>Ankieta medyczna</h1>
      <p className="of-lead">
        Odpowiedz na 5 pytań. Są wymagane do oceny możliwości przystąpienia do Grupy Otwartej.
      </p>
      <QuestionnaireComponent />
    </div>
  );
}
