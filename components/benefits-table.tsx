import type { BenefitRow } from '@/lib/data/benefits';

interface Props {
  benefits: BenefitRow[];
  caption?: string;
}

const CATEGORY_LABELS: Record<BenefitRow['category'], string> = {
  ubezpieczony: 'Pakiet ubezpieczonego',
  malzonek: 'Pakiet małżonek/partner',
  dziecko: 'Pakiet dziecko',
};

/** Pełna tabela świadczeń jednego wariantu: świadczenie, kwota, karencja. */
export function BenefitsTable({ benefits, caption }: Props) {
  if (benefits.length === 0) return null;

  const categories = Array.from(new Set(benefits.map((r) => r.category)));

  return (
    <div className="overflow-x-auto">
      <table className="ft-t">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            <th scope="col">Świadczenie</th>
            <th scope="col">Kwota</th>
            <th scope="col">Karencja</th>
          </tr>
        </thead>
        {categories.map((cat) => (
          <tbody key={cat}>
            <tr>
              <th colSpan={3} scope="colgroup" className="!bg-transparent !pt-4 !font-bold">
                {CATEGORY_LABELS[cat]}
              </th>
            </tr>
            {benefits.filter((r) => r.category === cat).map((row) => (
              <tr key={row.name}>
                <th scope="row">{row.name}</th>
                {row.value === '—'
                  ? <td className="no">nie obejmuje</td>
                  : <td>{row.value}</td>}
                <td className="k">{row.karencja ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
