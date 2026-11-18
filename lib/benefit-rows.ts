import { getBenefits, type BenefitRow } from './data/benefits';
import { PREMIUMS } from './data/premiums';
import type { AgeGroup, ProductType, Variant } from '@/types';

/**
 * Wiersze skróconych tabel („Ubezpieczenie wypłaca") na stronie głównej
 * i przy wyborze wariantu. Kwoty zawsze pochodzą z `getBenefits`; tutaj są
 * tylko czytelne nazwy wierszy i reguła, które wiersze pokazać.
 */
interface RowDef {
  key: string;
  label: string;
  /** Dokładne nazwy wierszy w danych; kilka nazw = wiersz łączony (te same kwoty). */
  names?: string[];
  /** Początek nazwy wiersza w danych (dla nazw z liczbą w nawiasie). */
  prefix?: string;
  /** Końcówka kwoty przeniesiona do nazwy wiersza („60 zł/dzień" → „60 zł"). */
  strip?: string;
}

const ROWS: RowDef[] = [
  { key: 'zgon', label: 'Zgon', names: ['Zgon'] },
  { key: 'nw',   label: 'Zgon w nieszczęśliwym wypadku', names: ['Zgon NW'] },
  { key: 'pz',   label: 'Poważne zachorowanie', prefix: 'Poważne zachorowanie (' },
  { key: 'szp',  label: 'Dzień w szpitalu z powodu choroby', names: ['Leczenie szpitalne choroba'], strip: '/dzień' },
  { key: 'op',   label: 'Operacja chirurgiczna (grupa 1)', names: ['Operacja chirurgiczna Gr.1'] },
  { key: 'part', label: 'Zgon małżonka lub partnera', names: ['Zgon małżonka/partnera'] },
  { key: 'rodz', label: 'Zgon rodzica lub teścia', names: ['Zgon rodzica', 'Zgon teścia'] },
  { key: 'dz',   label: 'Urodzenie dziecka', names: ['Urodzenie dziecka'] },
];

const HOME_ROW_KEYS = ['zgon', 'nw', 'pz', 'szp', 'op', 'part', 'dz'];
const VARIANT_ROW_KEYS = ['zgon', 'nw', 'pz', 'szp', 'op', 'part', 'rodz'];

export const PRODUCT_ORDER: ProductType[] = ['dla_mnie', 'dla_nas', 'dla_rodziny'];

/** Kogo obejmuje produkt — krótki opis pod nazwą. */
export const PRODUCT_WHO: Record<ProductType, string> = {
  dla_mnie:    'tylko Ty',
  dla_nas:     'Ty i małżonek lub partner',
  dla_rodziny: 'Ty, partner i dzieci',
};

export const AGE_RANGE: Record<AgeGroup, string> = {
  A1: '18–53 lat',
  A2: '54–59 lat',
  B:  '60–65 lat',
};

export interface SummaryRow {
  key: string;
  label: string;
  /** Objaśnienie pod nazwą, np. „56 jednostek chorobowych, karencja 3 mies." */
  note: string;
  /** Kwota w każdej kolumnie; `null` = ta kolumna tego nie obejmuje. */
  values: (string | null)[];
}

function findRow(rows: BenefitRow[], def: RowDef): BenefitRow | undefined {
  if (def.prefix) {
    return rows.find((r) => r.category === 'ubezpieczony' && r.name.startsWith(def.prefix!));
  }
  const found = (def.names ?? [])
    .map((name) => rows.find((r) => r.name === name))
    .filter((r): r is BenefitRow => r !== undefined && r.value !== '—');
  // Wiersz łączony pokazujemy tylko wtedy, gdy wszystkie jego składniki mają tę samą kwotę.
  if (found.length === 0 || found.some((r) => r.value !== found[0].value)) return undefined;
  if (found.length !== (def.names ?? []).length) return undefined;
  return found[0];
}

function noteFor(def: RowDef, row: BenefitRow): string {
  const parts: string[] = [];
  if (def.key === 'pz') {
    const units = row.name.match(/\((\d+) j\.ch\.\)/);
    if (units) parts.push(`${units[1]} jednostek chorobowych`);
  }
  if (row.karencja) parts.push(`karencja ${row.karencja}`);
  return parts.join(', ');
}

function buildRows(keys: string[], columns: BenefitRow[][]): SummaryRow[] {
  return keys.flatMap((key) => {
    const def = ROWS.find((r) => r.key === key)!;
    let note = '';
    const values = columns.map((rows) => {
      const row = findRow(rows, def);
      if (!row || row.value === '—') return null;
      note ||= noteFor(def, row);
      // Jednostkę zdejmujemy tylko wtedy, gdy kwota rzeczywiście ją ma.
      return def.strip && row.value.endsWith(def.strip)
        ? row.value.slice(0, -def.strip.length)
        : row.value;
    });
    return values.some((v) => v !== null) ? [{ key, label: def.label, note, values }] : [];
  });
}

export interface ProductPriceRange {
  product: ProductType;
  min: number;
  max: number;
  cheapestVariant: Variant;
}

/** Najniższa i najwyższa składka każdego produktu w danej grupie wiekowej. */
export function getPriceRanges(ageGroup: AgeGroup): ProductPriceRange[] {
  return PRODUCT_ORDER.map((product) => {
    const entries = PREMIUMS[ageGroup][product];
    const cheapest = entries.reduce((a, b) => (b.monthly < a.monthly ? b : a));
    const priciest = entries.reduce((a, b) => (b.monthly > a.monthly ? b : a));
    return { product, min: cheapest.monthly, max: priciest.monthly, cheapestVariant: cheapest.variant };
  });
}

/**
 * Strona główna: kwoty wypłat w najtańszym wariancie każdego z trzech
 * produktów (kolumny w kolejności `PRODUCT_ORDER`).
 */
export function getHomeRows(ageGroup: AgeGroup): SummaryRow[] {
  const columns = getPriceRanges(ageGroup).map(({ product, cheapestVariant }) =>
    getBenefits(ageGroup, product, cheapestVariant),
  );
  return buildRows(HOME_ROW_KEYS, columns);
}

/**
 * Wybór wariantu: tylko te wiersze, których kwoty różnią się między
 * wariantami danego produktu (kolumny w kolejności wariantów z taryfy).
 */
export function getVariantRows(ageGroup: AgeGroup, product: ProductType): SummaryRow[] {
  const columns = PREMIUMS[ageGroup][product].map((entry) => getBenefits(ageGroup, product, entry.variant));
  return buildRows(VARIANT_ROW_KEYS, columns).filter((row) => new Set(row.values).size > 1);
}
