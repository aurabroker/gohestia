'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import type { QuestionBlock } from '@/lib/data/questionnaire';

interface Props {
  block: QuestionBlock;
  blockNumber: number;
  answer: boolean | null;
  onAnswer: (value: boolean) => void;
  disabled?: boolean;
}

export function QuestionBlockComponent({ block, blockNumber, answer, onAnswer, disabled }: Props) {
  const [exceptionsOpen, setExceptionsOpen] = useState(false);

  return (
    <div className={clsx(
      'rounded-xl border-2 p-6 transition-colors',
      answer === false && 'border-green-400 bg-green-50',
      answer === true  && 'border-red-400 bg-red-50',
      answer === null  && 'border-gray-200 bg-white'
    )}>
      <div className="mb-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Pytanie {blockNumber} z 5
        </span>
        <h3 className="mt-1 text-lg font-semibold text-gray-900">{block.title}</h3>
      </div>

      <p className="mb-4 text-sm text-gray-700 leading-relaxed">{block.declaration}</p>

      <ul className="mb-4 space-y-2">
        {block.conditions.map((c, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
            {c}
          </li>
        ))}
      </ul>

      {block.exceptions && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setExceptionsOpen(v => !v)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            {exceptionsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Wyjątki od tej reguły
          </button>
          {exceptionsOpen && (
            <ul className="mt-2 rounded-lg bg-blue-50 p-3 space-y-1">
              {block.exceptions.map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                  {e}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onAnswer(false)}
          className={clsx(
            'flex-1 rounded-lg border-2 py-3 font-semibold text-sm transition-all',
            answer === false
              ? 'border-green-500 bg-green-500 text-white'
              : 'border-gray-300 text-gray-700 hover:border-green-400 hover:bg-green-50'
          )}
        >
          NIE (spełniam warunek)
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onAnswer(true)}
          className={clsx(
            'flex-1 rounded-lg border-2 py-3 font-semibold text-sm transition-all',
            answer === true
              ? 'border-red-500 bg-red-500 text-white'
              : 'border-gray-300 text-gray-700 hover:border-red-400 hover:bg-red-50'
          )}
        >
          TAK
        </button>
      </div>
    </div>
  );
}
