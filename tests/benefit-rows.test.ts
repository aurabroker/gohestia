import { describe, expect, it } from 'vitest';
import { getBenefits } from '@/lib/data/benefits';
import { PREMIUMS } from '@/lib/data/premiums';
import { PRODUCT_ORDER, getHomeRows, getPriceRanges, getVariantRows } from '@/lib/benefit-rows';
import type { AgeGroup } from '@/types';

const GROUPS: AgeGroup[] = ['A1', 'A2', 'B'];

describe('getPriceRanges', () => {
  it('najniższa i najwyższa składka każdego produktu pochodzą z taryfy', () => {
    for (const group of GROUPS) {
      for (const range of getPriceRanges(group)) {
        const prices = PREMIUMS[group][range.product].map((e) => e.monthly);
        expect(range.min).toBe(Math.min(...prices));
        expect(range.max).toBe(Math.max(...prices));
      }
    }
  });

  it('znane kwoty z taryfy: 57 zł (18–53, Dla Mnie) i 50 zł (54–59, Dla Mnie)', () => {
    expect(getPriceRanges('A1')[0]).toMatchObject({ product: 'dla_mnie', min: 57, cheapestVariant: 'rozszerzony' });
    expect(getPriceRanges('A2')[0]).toMatchObject({ product: 'dla_mnie', min: 50, cheapestVariant: 'podstawowy' });
  });
});

describe('getHomeRows', () => {
  it.each(GROUPS)('grupa %s: każda kwota istnieje w pełnej tabeli najtańszego wariantu', (group) => {
    const ranges = getPriceRanges(group);
    const rows = getHomeRows(group);
    expect(rows.length).toBeGreaterThanOrEqual(5);

    for (const row of rows) {
      expect(row.values).toHaveLength(PRODUCT_ORDER.length);
      row.values.forEach((value, i) => {
        if (value === null) return;
        const full = getBenefits(group, ranges[i].product, ranges[i].cheapestVariant).map((b) => b.value);
        // Kwota dzienna jest pokazywana bez końcówki „/dzień" (jednostka stoi w nazwie wiersza).
        expect(full.some((v) => v === value || v === `${value}/dzień`)).toBe(true);
      });
    }
  });

  it('produkt bez partnera i dzieci ma w tych wierszach brak kwoty', () => {
    const rows = getHomeRows('A1');
    expect(rows.find((r) => r.key === 'part')?.values[0]).toBeNull();
    expect(rows.find((r) => r.key === 'dz')?.values.slice(0, 2)).toEqual([null, null]);
  });
});

describe('getVariantRows', () => {
  it('pokazuje tylko wiersze, których kwoty różnią się między wariantami', () => {
    for (const group of GROUPS) {
      for (const product of PRODUCT_ORDER) {
        const variants = PREMIUMS[group][product];
        const rows = getVariantRows(group, product);
        expect(rows.length).toBeGreaterThanOrEqual(4);
        for (const row of rows) {
          expect(row.values).toHaveLength(variants.length);
          expect(new Set(row.values).size).toBeGreaterThan(1);
        }
      }
    }
  });

  it('Dla Rodziny 18–53: zgon 35 000 / 50 000 / 80 000 / 100 000 zł', () => {
    const zgon = getVariantRows('A1', 'dla_rodziny').find((r) => r.key === 'zgon');
    expect(zgon?.values.map((v) => v?.replace(/\s/g, ' '))).toEqual(['35 000 zł', '50 000 zł', '80 000 zł', '100 000 zł']);
  });
});
