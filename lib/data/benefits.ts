import type { AgeGroup, ProductType } from '@/types';

export interface BenefitRow {
  name: string;
  value: string;
  karencja: string | null;
  category: 'ubezpieczony' | 'malzonek' | 'dziecko';
  highlight?: boolean;
}

// Column indices for A1/A2:
// 0:DM-podst 1:DM-rozs 2:DM-komf 3:DM-prem 4:DM-prest
// 5:DN-podst 6:DN-rozs 7:DN-komf
// 8:DR-podst 9:DR-rozs 10:DR-komf 11:DR-prem
const COL_A: Record<ProductType, Record<string, number>> = {
  dla_mnie: { podstawowy: 0, rozszerzony: 1, komfort: 2, premium: 3, prestiz: 4 },
  dla_nas:  { podstawowy: 5, rozszerzony: 6, komfort: 7 },
  dla_rodziny: { podstawowy: 8, rozszerzony: 9, komfort: 10, premium: 11 },
};

// Column indices for B:
// 0:DM-podst 1:DM-rozs 2:DM-komf
// 3:DN-podst 4:DN-rozs
// 5:DR-podst 6:DR-rozs
const COL_B: Record<ProductType, Record<string, number>> = {
  dla_mnie: { podstawowy: 0, rozszerzony: 1, komfort: 2 },
  dla_nas:  { podstawowy: 3, rozszerzony: 4 },
  dla_rodziny: { podstawowy: 5, rozszerzony: 6 },
};

type RawValue = number | string | null;

function fmtZl(v: RawValue): string {
  if (v === null) return '—';
  if (typeof v === 'string') return v;
  return v.toLocaleString('pl-PL') + ' zł';
}

function fmtZlPerDay(v: RawValue): string {
  if (v === null) return '—';
  if (typeof v === 'string') return v;
  return v.toLocaleString('pl-PL') + ' zł/dzień';
}

function fmtZlPer1pct(v: RawValue): string {
  if (v === null) return '—';
  if (typeof v === 'string') return v;
  return v.toLocaleString('pl-PL') + ' zł/1%';
}

function fmtDo(v: RawValue): string {
  if (v === null) return '—';
  if (typeof v === 'string') return 'do ' + v;
  return 'do ' + v.toLocaleString('pl-PL') + ' zł';
}

// ── A1 / A2 raw data (12 columns) ────────────────────────────────────────────

const A_UBEZPIECZONY: Array<{ name: string; values: RawValue[]; karencja: string | null; highlight?: boolean; fmt: (v: RawValue) => string }> = [
  { name: 'Zgon NW przy pracy — ruch lądowy/wodny/powietrzny', values: [100000,140000,220000,300000,500000, 120000,180000,260000, 160000,220000,350000,430000], karencja: null, highlight: true, fmt: fmtZl },
  { name: 'Zgon NW przy pracy', values: [60000,90000,150000,210000,360000, 75000,120000,180000, 100000,150000,240000,300000], karencja: null, fmt: fmtZl },
  { name: 'Zgon NW — ruch lądowy/wodny/powietrzny', values: [60000,90000,150000,210000,360000, 75000,120000,180000, 100000,150000,240000,300000], karencja: null, highlight: true, fmt: fmtZl },
  { name: 'Zgon NW', values: [40000,60000,100000,140000,240000, 50000,80000,120000, 70000,100000,160000,200000], karencja: null, fmt: fmtZl },
  { name: 'Zgon — zawał/udar', values: [25000,40000,65000,90000,160000, 35000,50000,80000, 45000,65000,100000,140000], karencja: null, fmt: fmtZl },
  { name: 'Zgon', values: [20000,30000,50000,70000,120000, 25000,40000,60000, 35000,50000,80000,100000], karencja: null, highlight: true, fmt: fmtZl },
  { name: 'Trwały uszczerbek NW — za 1%', values: [300,400,500,650,800, 350,450,500, 400,500,650,750], karencja: null, fmt: fmtZlPer1pct },
  { name: 'Trwały uszczerbek zawał/krwotok — za 1%', values: [200,300,500,600,600, 250,300,500, 300,400,500,600], karencja: null, fmt: fmtZlPer1pct },
  { name: 'Całkowita trwała niezdolność do pracy NW', values: [10000,25000,30000,40000,70000, 15000,30000,40000, 30000,40000,50000,70000], karencja: null, fmt: fmtZl },
  { name: 'Operacja chirurgiczna Gr.1', values: [null,1500,2000,3000,4000, null,2000,2500, 1500,2000,3000,3500], karencja: '6 mies.', highlight: true, fmt: fmtZl },
  { name: 'Operacja chirurgiczna Gr.2', values: [null,900,1200,1800,2400, null,1200,1500, 900,1200,1800,2100], karencja: '6 mies.', fmt: fmtZl },
  { name: 'Operacja chirurgiczna Gr.3', values: [300,400,600,800,null, null,400,500, 300,400,600,700], karencja: '6 mies.', fmt: fmtZl },
  { name: 'Poważne zachorowanie (56 j.ch.)', values: [3000,6000,12000,15000,20000, 4000,6000,10000, 7000,9000,12000,17000], karencja: '3 mies.', highlight: true, fmt: fmtZl },
  { name: 'Leczenie szpitalne NW', values: ['120/50 zł','160/60 zł','180/70 zł','200/90 zł','250/100 zł', '120/50 zł','140/60 zł','160/70 zł', '170/60 zł','180/70 zł','200/80 zł','220/100 zł'], karencja: '2 mies. (od 15. dnia)', fmt: fmtZl },
  { name: 'Leczenie szpitalne choroba', values: ['50 zł/dzień','60 zł/dzień','70 zł/dzień','90 zł/dzień','100 zł/dzień', '50 zł/dzień','60 zł/dzień','70 zł/dzień', '60 zł/dzień','70 zł/dzień','80 zł/dzień','100 zł/dzień'], karencja: '2 mies.', highlight: true, fmt: fmtZl },
  { name: 'Leczenie szpitalne NW — ruch lądowy/wodny/powietrzny', values: [220,310,330,350,400, 220,290,310, 320,330,350,400], karencja: null, fmt: fmtZlPerDay },
  { name: 'Leczenie szpitalne zawał/krwotok', values: [80,120,130,150,250, 80,120,130, 120,140,160,200], karencja: '2 mies.', fmt: fmtZlPerDay },
  { name: 'Leczenie specjalistyczne', values: [1500,2000,4000,5000,7000, 1500,2500,2500, 2000,2500,3000,5000], karencja: '3 mies.', highlight: true, fmt: fmtDo },
];

const A_MALZONEK: Array<{ name: string; values: RawValue[]; karencja: string | null; highlight?: boolean; fmt: (v: RawValue) => string }> = [
  { name: 'Zgon małżonka/partnera NW', values: [null,null,null,null,null, 14000,25000,24000, 20000,24000,30000,40000], karencja: null, highlight: true, fmt: fmtZl },
  { name: 'Zgon małżonka/partnera', values: [null,null,null,null,null, 7000,12000,12000, 10000,12000,15000,20000], karencja: '6 mies.', fmt: fmtZl },
  { name: 'Trwałe inwalidztwo małżonka/partnera NW', values: [null,null,null,null,null, 8000,10000,12000, 10000,10000,12000,12000], karencja: null, fmt: fmtDo },
  { name: 'Poważne zachorowanie małżonka/partnera (12 j.ch.)', values: [null,null,null,null,null, 2000,3000,3500, 2000,3000,4000,5000], karencja: '3 mies.', fmt: fmtZl },
  { name: 'Zgon rodzica', values: [null,null,null,null,null, null,null,1200, null,1600,2000,2200], karencja: '6 mies.', fmt: fmtZl },
  { name: 'Zgon teścia', values: [null,null,null,null,null, null,null,1200, null,1600,2000,2200], karencja: '6 mies.', fmt: fmtZl },
];

const A_DZIECKO: Array<{ name: string; values: RawValue[]; karencja: string | null; highlight?: boolean; fmt: (v: RawValue) => string }> = [
  { name: 'Osierocenie dziecka', values: [null,null,null,null,null,null,null,null, 3000,4000,5000,6000], karencja: null, fmt: fmtZl },
  { name: 'Zgon dziecka NW', values: [null,null,null,null,null,null,null,null, 8000,10000,12000,14000], karencja: null, highlight: true, fmt: fmtZl },
  { name: 'Zgon dziecka', values: [null,null,null,null,null,null,null,null, 4000,5000,6000,7000], karencja: '6 mies.', fmt: fmtZl },
  { name: 'Urodzenie dziecka', values: [null,null,null,null,null,null,null,null, 1300,1300,1500,1700], karencja: '9 mies.', fmt: fmtZl },
  { name: 'Urodzenie martwego noworodka', values: [null,null,null,null,null,null,null,null, 3000,3500,4000,5000], karencja: '9 mies.', fmt: fmtZl },
  { name: 'Trwałe inwalidztwo dziecka NW', values: [null,null,null,null,null,null,null,null, 10000,10000,10000,10000], karencja: null, fmt: fmtDo },
  { name: 'Wada wrodzona dziecka', values: [null,null,null,null,null,null,null,null, 2000,2500,3000,3500], karencja: '9 mies.', fmt: fmtZl },
  { name: 'Poważne zachorowanie dziecka (18 j.ch.)', values: [null,null,null,null,null,null,null,null, 4000,5000,6000,8000], karencja: '3 mies.', fmt: fmtZl },
  { name: 'Leczenie szpitalne dziecka', values: [null,null,null,null,null,null,null,null, 400,500,700,700], karencja: '2 mies.', fmt: fmtZlPerDay },
];

// ── B raw data (7 columns) ───────────────────────────────────────────────────

const B_UBEZPIECZONY: Array<{ name: string; values: RawValue[]; karencja: string | null; highlight?: boolean; fmt: (v: RawValue) => string }> = [
  { name: 'Zgon NW przy pracy — ruch lądowy', values: [100000,140000,220000, 120000,180000, 160000,220000], karencja: null, highlight: true, fmt: fmtZl },
  { name: 'Zgon NW przy pracy', values: [60000,90000,150000, 75000,120000, 100000,150000], karencja: null, fmt: fmtZl },
  { name: 'Zgon NW — ruch lądowy', values: [60000,90000,150000, 75000,120000, 100000,150000], karencja: null, highlight: true, fmt: fmtZl },
  { name: 'Zgon NW', values: [40000,60000,100000, 50000,80000, 70000,100000], karencja: null, fmt: fmtZl },
  { name: 'Zgon — zawał/udar', values: [25000,40000,65000, 35000,50000, 45000,65000], karencja: null, fmt: fmtZl },
  { name: 'Zgon', values: [20000,30000,50000, 25000,40000, 35000,50000], karencja: null, highlight: true, fmt: fmtZl },
  { name: 'Trwały uszczerbek NW — za 1%', values: [300,400,500, 350,450, 400,500], karencja: null, fmt: fmtZlPer1pct },
  { name: 'Trwały uszczerbek zawał/krwotok — za 1%', values: [200,300,500, 250,300, 300,400], karencja: null, fmt: fmtZlPer1pct },
  { name: 'Całkowita trwała niezdolność do pracy NW', values: [10000,25000,30000, 15000,30000, 30000,40000], karencja: null, fmt: fmtZl },
  { name: 'Operacja chirurgiczna Gr.1', values: [null,1500,2000, null,2000, 1500,2000], karencja: '6 mies.', highlight: true, fmt: fmtZl },
  { name: 'Operacja chirurgiczna Gr.2', values: [null,900,1200, null,1200, 900,1200], karencja: '6 mies.', fmt: fmtZl },
  { name: 'Operacja chirurgiczna Gr.3', values: [300,400,400, 300,400, 300,400], karencja: '6 mies.', fmt: fmtZl },
  { name: 'Poważne zachorowanie (34 j.ch.)', values: [3000,6000,12000, 4000,6000, 7000,9000], karencja: '3 mies.', highlight: true, fmt: fmtZl },
  { name: 'Leczenie szpitalne NW', values: ['120/50 zł','160/60 zł','180/70 zł', '120/50 zł','140/60 zł', '170/60 zł','180/70 zł'], karencja: '2 mies. (od 15. dnia)', fmt: fmtZl },
  { name: 'Leczenie szpitalne choroba', values: ['50 zł/dzień','60 zł/dzień','70 zł/dzień', '50 zł/dzień','60 zł/dzień', '60 zł/dzień','70 zł/dzień'], karencja: '2 mies.', highlight: true, fmt: fmtZl },
  { name: 'Leczenie szpitalne NW — ruch lądowy', values: [220,310,330, 220,290, 320,330], karencja: null, fmt: fmtZlPerDay },
  { name: 'Leczenie szpitalne zawał/krwotok', values: [80,120,130, 80,120, 120,140], karencja: '2 mies.', fmt: fmtZlPerDay },
  { name: 'Leczenie specjalistyczne', values: [1500,2000,4000, 1500,2500, 2000,2500], karencja: '3 mies.', highlight: true, fmt: fmtDo },
];

const B_MALZONEK: Array<{ name: string; values: RawValue[]; karencja: string | null; highlight?: boolean; fmt: (v: RawValue) => string }> = [
  { name: 'Zgon małżonka/partnera NW', values: [null,null,null, 14000,25000, 20000,24000], karencja: null, highlight: true, fmt: fmtZl },
  { name: 'Zgon małżonka/partnera', values: [null,null,null, 7000,12000, 10000,12000], karencja: '6 mies.', fmt: fmtZl },
  { name: 'Trwałe inwalidztwo małżonka/partnera NW', values: [null,null,null, 8000,10000, 10000,10000], karencja: null, fmt: fmtDo },
  { name: 'Poważne zachorowanie małżonka/partnera (12 j.ch.)', values: [null,null,null, 2000,3000, 2000,3000], karencja: '3 mies.', fmt: fmtZl },
  { name: 'Zgon rodzica', values: [null,null,null, null,null, null,1600], karencja: '6 mies.', fmt: fmtZl },
  { name: 'Zgon teścia', values: [null,null,null, null,null, null,1600], karencja: '6 mies.', fmt: fmtZl },
];

const B_DZIECKO: Array<{ name: string; values: RawValue[]; karencja: string | null; highlight?: boolean; fmt: (v: RawValue) => string }> = [
  { name: 'Osierocenie dziecka', values: [null,null,null,null,null, 3000,4000], karencja: null, fmt: fmtZl },
  { name: 'Zgon dziecka NW', values: [null,null,null,null,null, 8000,10000], karencja: null, highlight: true, fmt: fmtZl },
  { name: 'Zgon dziecka', values: [null,null,null,null,null, 4000,5000], karencja: '6 mies.', fmt: fmtZl },
  { name: 'Urodzenie dziecka', values: [null,null,null,null,null, 1300,1300], karencja: '9 mies.', fmt: fmtZl },
  { name: 'Urodzenie martwego noworodka', values: [null,null,null,null,null, 3000,3500], karencja: '9 mies.', fmt: fmtZl },
  { name: 'Trwałe inwalidztwo dziecka NW', values: [null,null,null,null,null, 10000,10000], karencja: null, fmt: fmtDo },
  { name: 'Wada wrodzona dziecka', values: [null,null,null,null,null, 2000,2500], karencja: '9 mies.', fmt: fmtZl },
  { name: 'Poważne zachorowanie dziecka (18 j.ch.)', values: [null,null,null,null,null, 4000,5000], karencja: '3 mies.', fmt: fmtZl },
  { name: 'Leczenie szpitalne dziecka', values: [null,null,null,null,null, 400,500], karencja: '2 mies.', fmt: fmtZlPerDay },
];

// ── Main function ─────────────────────────────────────────────────────────────

export function getBenefits(
  ageGroup: AgeGroup,
  product: ProductType,
  variant: string,
): BenefitRow[] {
  const isB = ageGroup === 'B';
  const colMap = isB ? COL_B : COL_A;
  const colIdx = colMap[product]?.[variant];
  if (colIdx === undefined) return [];

  const ubezpieczony = isB ? B_UBEZPIECZONY : A_UBEZPIECZONY;
  const malzonek = isB ? B_MALZONEK : A_MALZONEK;
  const dziecko = isB ? B_DZIECKO : A_DZIECKO;

  const rows: BenefitRow[] = [];

  for (const r of ubezpieczony) {
    const raw = r.values[colIdx] ?? null;
    rows.push({
      name: r.name,
      value: r.fmt(raw),
      karencja: r.karencja,
      category: 'ubezpieczony',
      highlight: r.highlight,
    });
  }

  if (product === 'dla_nas' || product === 'dla_rodziny') {
    for (const r of malzonek) {
      const raw = r.values[colIdx] ?? null;
      const v = r.fmt(raw);
      if (v === '—') continue;
      rows.push({
        name: r.name,
        value: v,
        karencja: r.karencja,
        category: 'malzonek',
        highlight: r.highlight,
      });
    }
  }

  if (product === 'dla_rodziny') {
    for (const r of dziecko) {
      const raw = r.values[colIdx] ?? null;
      const v = r.fmt(raw);
      if (v === '—') continue;
      rows.push({
        name: r.name,
        value: v,
        karencja: r.karencja,
        category: 'dziecko',
        highlight: r.highlight,
      });
    }
  }

  return rows;
}
