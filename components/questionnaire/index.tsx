'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUESTIONNAIRE_BLOCKS } from '@/lib/data/questionnaire';
import { QuestionBlockComponent } from './question-block';
import { PrivacyNotice } from '@/components/privacy-notice';
import { useCalculatorStore } from '@/store/calculator-store';

interface ExclusionModalProps {
  onClose: () => void;
}

function ExclusionModal({ onClose }: ExclusionModalProps) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-4 text-4xl text-center">⚠️</div>
        <h2 className="mb-3 text-xl font-bold text-gray-900 text-center">
          Niestety nie możesz przystąpić do Grupy Otwartej
        </h2>
        <p className="mb-6 text-sm text-gray-600 leading-relaxed text-center">
          Na podstawie udzielonej odpowiedzi nie spełniasz warunków przystąpienia
          do grupowego ubezpieczenia ERGO Razem w trybie Grupy Otwartej.
          <br /><br />
          Możesz jednak ubiegać się o indywidualną polisę na życie — może ona
          wymagać wypełnienia szczegółowej ankiety medycznej lub poddania się
          badaniom na koszt ubezpieczyciela.
        </p>
        <button
          onClick={() => router.push('/wykluczenie/zdrowie')}
          className="w-full rounded-lg bg-[#E4002B] py-3 font-semibold text-white hover:bg-[#c00025] transition-colors"
        >
          Sprawdź polisę indywidualną →
        </button>
        <button
          onClick={onClose}
          className="mt-2 w-full rounded-lg border border-gray-200 py-2 text-sm text-gray-500 hover:bg-gray-50"
        >
          Wróć do ankiety
        </button>
      </div>
    </div>
  );
}

export function QuestionnaireComponent() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    Array(QUESTIONNAIRE_BLOCKS.length).fill(null)
  );
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { setQuestionnaireComplete } = useCalculatorStore();

  const handleAnswer = (index: number, value: boolean) => {
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
    if (value === true) {
      setShowModal(true);
    }
  };

  const allNo = answers.every(a => a === false);

  const handleNext = () => {
    setQuestionnaireComplete(true);
    router.push('/kalkulator/weryfikacja');
  };

  return (
    <>
      {showModal && <ExclusionModal onClose={() => setShowModal(false)} />}

      <div className="space-y-4">
        <PrivacyNotice />

        <div className="space-y-4">
          {QUESTIONNAIRE_BLOCKS.map((block, i) => (
            <QuestionBlockComponent
              key={block.id}
              block={block}
              blockNumber={i + 1}
              answer={answers[i]}
              onAnswer={(v) => handleAnswer(i, v)}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!allNo}
          className="w-full rounded-lg bg-[#E4002B] py-4 font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#c00025] transition-colors"
        >
          Przejdź dalej →
        </button>
      </div>
    </>
  );
}
