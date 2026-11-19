'use client';
import clsx from 'clsx';
import type { QuestionBlock } from '@/lib/data/questionnaire';

interface Props {
  block: QuestionBlock;
  blockNumber: number;
  total: number;
  answer: boolean | null;
  onAnswer: (value: boolean) => void;
}

// Etykiety odpowiedzi są ustalone z właścicielem serwisu — nie zmieniać.
const ANSWERS = [
  { value: false, label: 'NIE (spełniam warunek)' },
  { value: true,  label: 'TAK' },
] as const;

export function QuestionBlockComponent({ block, blockNumber, total, answer, onAnswer }: Props) {
  const headingId = `${block.id}-tytul`;
  const answered = ANSWERS.find((a) => a.value === answer);

  return (
    <section className={clsx('qc', answered && 'is-ans')} aria-labelledby={headingId}>
      {/* Numer pytania stoi w nagłówku jako cyfra afisza; pełne „Pytanie 1 z 5"
          zostaje dla czytników ekranu. */}
      <h2 id={headingId}>
        <span className="qc-n" aria-hidden="true">{blockNumber}</span>
        <span>
          <span className="visually-hidden">Pytanie {blockNumber} z {total}: </span>
          {block.title}
        </span>
      </h2>

      <p className="qc-d">{block.declaration}</p>

      <ul className="qc-l">
        {block.conditions.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>

      {block.exceptions && (
        <details className="qc-ex">
          <summary>Wyjątki od tej reguły</summary>
          <ul className="qc-l">
            {block.exceptions.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </details>
      )}

      <div className="qc-a" role="group" aria-labelledby={headingId}>
        {ANSWERS.map(({ value, label }) => (
          <button
            key={label}
            type="button"
            aria-pressed={answer === value}
            onClick={() => onAnswer(value)}
            className={clsx('ans', answer === value && 'is-on')}
          >
            <span className="mark" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {answered && <p className="qc-y">Twoja odpowiedź: {answered.label}</p>}
    </section>
  );
}
