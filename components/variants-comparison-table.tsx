'use client';
import { getBenefits } from '@/lib/data/benefits';
import type { AgeGroup, ProductType } from '@/types';

const VARIANTS_BY_PRODUCT: Record<ProductType, { key: string; label: string }[]> = {
  dla_mnie:    [
    { key: 'rozszerzony', label: 'Rozszerzony' },
    { key: 'komfort',     label: 'Komfort' },
    { key: 'premium',     label: 'Premium' },
    { key: 'prestiz',     label: 'Prestiż' },
  ],
  dla_nas:     [
    { key: 'rozszerzony', label: 'Rozszerzony' },
    { key: 'komfort',     label: 'Komfort' },
  ],
  dla_rodziny: [
    { key: 'podstawowy',  label: 'Podstawowy' },
    { key: 'rozszerzony', label: 'Rozszerzony' },
    { key: 'komfort',     label: 'Komfort' },
    { key: 'premium',     label: 'Premium' },
  ],
};

const CATEGORY_LABELS: Record<string, string> = {
  ubezpieczony: 'Pakiet ubezpieczonego',
  malzonek:     'Pakiet małżonek / partner',
  dziecko:      'Pakiet dziecko',
};

interface Props {
  product: ProductType;
  ageGroup?: AgeGroup;
}

export function VariantsComparisonTable({ product, ageGroup = 'A1' }: Props) {
  const variants = VARIANTS_BY_PRODUCT[product];
  const allBenefits = variants.map(v => getBenefits(ageGroup, product, v.key));

  // Collect unique benefit names in order (from first variant with most rows)
  const richest = allBenefits.reduce((a, b) => (b.length > a.length ? b : a), allBenefits[0]);
  const categories = Array.from(new Set(richest.map(r => r.category)));

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[200px]">Świadczenie</th>
            {variants.map(v => (
              <th key={v.key} className="px-4 py-3 text-center font-semibold text-[#E4002B] whitespace-nowrap min-w-[110px]">
                {v.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-semibold text-gray-500 whitespace-nowrap text-xs">Karencja</th>
          </tr>
        </thead>
        <tbody>
          {categories.flatMap(cat => {
            const catRows = richest.filter(r => r.category === cat);
            return [
              <tr key={`hdr-${cat}`} className="bg-[#E4002B]/5 border-b border-t border-gray-200">
                <td colSpan={variants.length + 2} className="px-4 py-2 font-semibold text-[#E4002B] text-xs uppercase tracking-wide">
                  {CATEGORY_LABELS[cat] ?? cat}
                </td>
              </tr>,
              ...catRows.map((row, i) => (
                <tr
                  key={`${cat}-${i}`}
                  className={[
                    'border-b border-gray-100 last:border-0',
                    row.highlight ? 'bg-yellow-50' : 'bg-white',
                  ].join(' ')}
                >
                  <td className="px-4 py-2 text-gray-700">{row.name}</td>
                  {allBenefits.map((vBenefits, vi) => {
                    const match = vBenefits.find(r => r.name === row.name && r.category === row.category);
                    const val = match?.value ?? '—';
                    return (
                      <td
                        key={vi}
                        className={[
                          'px-4 py-2 text-center font-medium whitespace-nowrap',
                          val === '—' ? 'text-gray-300' : 'text-gray-900',
                        ].join(' ')}
                      >
                        {val}
                      </td>
                    );
                  })}
                  <td className="px-4 py-2 text-right text-gray-400 whitespace-nowrap text-xs">
                    {row.karencja ?? '—'}
                  </td>
                </tr>
              )),
            ];
          })}
        </tbody>
      </table>
    </div>
  );
}
