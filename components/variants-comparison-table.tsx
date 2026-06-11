'use client';
import { getBenefits } from '@/lib/data/benefits';
import { PREMIUMS } from '@/lib/data/premiums';
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

// Variants available per product per age group (some groups have fewer variants)
const VARIANTS_B: Record<ProductType, { key: string; label: string }[]> = {
  dla_mnie:    [
    { key: 'podstawowy',  label: 'Podstawowy' },
    { key: 'rozszerzony', label: 'Rozszerzony' },
    { key: 'komfort',     label: 'Komfort' },
  ],
  dla_nas:     [
    { key: 'podstawowy',  label: 'Podstawowy' },
    { key: 'rozszerzony', label: 'Rozszerzony' },
  ],
  dla_rodziny: [
    { key: 'podstawowy',  label: 'Podstawowy' },
    { key: 'rozszerzony', label: 'Rozszerzony' },
  ],
};

const CATEGORY_LABELS: Record<string, string> = {
  ubezpieczony: 'Pakiet ubezpieczonego',
  malzonek:     'Pakiet małżonek / partner',
  dziecko:      'Pakiet dziecko',
};

interface Props {
  product: ProductType;
  ageGroup: AgeGroup;
}

export function VariantsComparisonTable({ product, ageGroup }: Props) {
  const variants = ageGroup === 'B' ? VARIANTS_B[product] : VARIANTS_BY_PRODUCT[product];

  // Filter to only variants available for this age group
  const premiumEntries = PREMIUMS[ageGroup][product];
  const availableKeys = new Set(premiumEntries.map(e => e.variant));
  const filteredVariants = variants.filter(v => availableKeys.has(v.key));

  const allBenefits = filteredVariants.map(v => getBenefits(ageGroup, product, v.key));
  const richest = allBenefits.reduce((a, b) => (b.length > a.length ? b : a), allBenefits[0] ?? []);
  const categories = Array.from(new Set(richest.map(r => r.category)));

  if (filteredVariants.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[200px]">Świadczenie</th>
            {filteredVariants.map(v => {
              const entry = premiumEntries.find(e => e.variant === v.key);
              return (
                <th key={v.key} className="px-4 py-3 text-center min-w-[110px]">
                  <div className="font-semibold text-[#E4002B]">{v.label}</div>
                  {entry && (
                    <div className="text-xs font-bold text-gray-900 mt-0.5">
                      {entry.monthly} zł<span className="font-normal text-gray-400">/mies.</span>
                    </div>
                  )}
                </th>
              );
            })}
            <th className="px-4 py-3 text-right font-semibold text-gray-500 whitespace-nowrap text-xs">Karencja</th>
          </tr>
        </thead>
        <tbody>
          {categories.flatMap(cat => {
            const catRows = richest.filter(r => r.category === cat);
            return [
              <tr key={`hdr-${cat}`} className="bg-[#E4002B]/5 border-b border-t border-gray-200">
                <td colSpan={filteredVariants.length + 2} className="px-4 py-2 font-semibold text-[#E4002B] text-xs uppercase tracking-wide">
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
