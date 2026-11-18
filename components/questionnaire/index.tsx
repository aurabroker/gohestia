'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUESTIONNAIRE_BLOCKS } from '@/lib/data/questionnaire';
import { QuestionBlockComponent } from './question-block';
import { PrivacyNotice } from '@/components/privacy-notice';
import { useCalculatorStore } from '@/store/calculator-store';

function ExclusionModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const primaryRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    primaryRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      // Fokus krąży między dwoma przyciskami okna.
      if (e.key !== 'Tab') return;
      const first = primaryRef.current;
      const last = closeRef.current;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="modal-bg">
      <div className="modal" role="alertdialog" aria-modal="true" aria-labelledby="wykluczenie-tytul" aria-describedby="wykluczenie-opis">
        <h2 id="wykluczenie-tytul">Niestety nie możesz przystąpić do Grupy Otwartej</h2>
        <div id="wykluczenie-opis">
          <p>
            Na podstawie udzielonej odpowiedzi nie spełniasz warunków przystąpienia
            do grupowego ubezpieczenia ERGO Razem w trybie Grupy Otwartej.
          </p>
          <p>
            Możesz jednak ubiegać się o indywidualną polisę na życie — może ona
            wymagać wypełnienia szczegółowej ankiety medycznej lub poddania się
            badaniom na koszt ubezpieczyciela.
          </p>
        </div>
        <div className="acts">
          <button ref={primaryRef} type="button" className="btn full-w" onClick={() => router.push('/wykluczenie/zdrowie')}>
            Sprawdź polisę indywidualną
          </button>
          <button ref={closeRef} type="button" className="btn-2 full-w" onClick={onClose}>
            Wróć do ankiety
          </button>
        </div>
      </div>
    </div>
  );
}

export function QuestionnaireComponent() {
  // Odpowiedzi żyją wyłącznie w stanie tego komponentu: nie są wysyłane,
  // logowane ani zapisywane.
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    Array(QUESTIONNAIRE_BLOCKS.length).fill(null)
  );
  const [showModal, setShowModal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const router = useRouter();
  const { setQuestionnaireComplete } = useCalculatorStore();

  const handleAnswer = (index: number, value: boolean) => {
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
    setShowHint(false);
    if (value === true) {
      setShowModal(true);
    }
  };

  const allNo = answers.every(a => a === false);
  const unanswered = answers.filter(a => a === null).length;

  const handleNext = () => {
    if (!allNo) { setShowHint(true); return; }
    setQuestionnaireComplete(true);
    router.push('/kalkulator/produkt');
  };

  return (
    <>
      {showModal && <ExclusionModal onClose={() => setShowModal(false)} />}

      <div className="sec">
        <PrivacyNotice />

        <div className="mt-4">
          {QUESTIONNAIRE_BLOCKS.map((block, i) => (
            <QuestionBlockComponent
              key={block.id}
              block={block}
              blockNumber={i + 1}
              total={QUESTIONNAIRE_BLOCKS.length}
              answer={answers[i]}
              onAnswer={(v) => handleAnswer(i, v)}
            />
          ))}
        </div>

        <div className="mt-6">
          <button type="button" onClick={handleNext} aria-disabled={!allNo} className="btn">
            Dalej: oferta
          </button>
          {showHint && (
            <p role="alert" className="err mt-3">
              {unanswered > 0
                ? `Odpowiedz na wszystkie pytania. Zostało: ${unanswered}.`
                : 'Przy odpowiedzi „TAK” nie można przystąpić do Grupy Otwartej.'}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
