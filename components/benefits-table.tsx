'use client';
import type { BenefitRow } from '@/lib/data/benefits';

interface Props {
  benefits: BenefitRow[];
}

const CATEGORY_LABELS: Record<BenefitRow['category'], string> = {
  ubezpieczony: 'Pakiet ubezpieczonego',
  malzonek: 'Pakiet małżonek/partner',
  dziecko: 'Pakiet dziecko',
};

export function BenefitsTable({ benefits }: Props) {
  if (benefits.length === 0) return null;

  const categories = Array.from(
    new Set(benefits.map(r => r.category))
  ) as BenefitRow['category'][];

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left font-semibold text-gray-700 w-full">Świadczenie</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">Kwota</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">Karencja</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => {
            const catRows = benefits.filter(r => r.category === cat);
            return (
              <tbody key={cat}>
                <tr className="bg-[#E4002B]/5 border-b border-gray-100">
                  <td colSpan={3} className="px-4 py-2 font-semibold text-[#E4002B] text-xs uppercase tracking-wide">
                    {CATEGORY_LABELS[cat]}
                  </td>
                </tr>
                {catRows.map((row, i) => (
                  <tr
                    key={i}
                    className={[
                      'border-b border-gray-100 last:border-0',
                      row.highlight ? 'bg-yellow-50' : 'bg-white',
                    ].join(' ')}
                  >
                    <td className="px-4 py-2 text-gray-700">{row.name}</td>
                    <td className={[
                      'px-4 py-2 text-right font-medium whitespace-nowrap',
                      row.value === '—' ? 'text-gray-400' : 'text-gray-900',
                    ].join(' ')}>{row.value}</td>
                    <td className="px-4 py-2 text-right text-gray-400 whitespace-nowrap text-xs">
                      {row.karencja ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
