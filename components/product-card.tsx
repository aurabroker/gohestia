'use client';
import clsx from 'clsx';
import type { PremiumEntry } from '@/types';
import { VARIANT_LABELS } from '@/lib/data/premiums';
import { COVERAGE } from '@/lib/data/coverage';
import type { Variant } from '@/types';

interface Props {
  entry: PremiumEntry;
  selected: boolean;
  onSelect: () => void;
}

const VARIANT_COLORS: Record<Variant, string> = {
  podstawowy:  'border-gray-300',
  rozszerzony: 'border-blue-300',
  komfort:     'border-green-400',
  premium:     'border-purple-400',
  prestiz:     'border-[#E4002B]',
};

export function ProductCard({ entry, selected, onSelect }: Props) {
  const benefits = COVERAGE[entry.variant]?.slice(0, 4) ?? [];
  const borderColor = VARIANT_COLORS[entry.variant];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        'w-full rounded-xl border-2 p-5 text-left transition-all',
        selected
          ? 'border-[#E4002B] bg-[#E4002B]/5 shadow-md'
          : `${borderColor} bg-white hover:shadow-sm`
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="font-semibold text-gray-900">{VARIANT_LABELS[entry.variant]}</span>
        {selected && (
          <span className="rounded-full bg-[#E4002B] px-2 py-0.5 text-xs text-white font-medium">
            Wybrany
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-[#E4002B] mb-3">
        {entry.monthly} <span className="text-base font-normal text-gray-600">zł/mies.</span>
      </p>
      <ul className="space-y-1">
        {benefits.map((b, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-green-500 font-bold">✓</span>
            {b.name}
          </li>
        ))}
      </ul>
    </button>
  );
}
