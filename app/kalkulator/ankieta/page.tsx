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
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Ankieta medyczna</h2>
      <p className="text-gray-600 mb-6">
        Odpowiedz na 5 pytań — są one wymagane do oceny możliwości przystąpienia do Grupy Otwartej.
      </p>
      <QuestionnaireComponent />
    </div>
  );
}
