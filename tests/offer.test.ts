import { describe, expect, it } from 'vitest';
import { calcMonthlyPremium } from '@/lib/calculator';
import { resolveOffer, type OfferAddons } from '@/lib/offer';
import type { AgeGroup, ProductType, Variant } from '@/types';

const NO_ADDONS: OfferAddons = { mediplan: false, medicalAssistance: false, globalDoctors: false };

const AGE_GROUPS: AgeGroup[] = ['A1', 'A2', 'B'];
const PRODUCTS: ProductType[] = ['dla_mnie', 'dla_nas', 'dla_rodziny'];
const VARIANTS: Variant[] = ['podstawowy', 'rozszerzony', 'komfort', 'premium', 'prestiz'];

// Taryfa zapisana niezależnie od lib/data/premiums.ts — test pilnuje, żeby
// przypadkowa zmiana danych nie przeszła niezauważona.
const TARIFF: Record<AgeGroup, Record<ProductType, Partial<Record<Variant, number>>>> = {
  A1: {
    dla_mnie:    { rozszerzony: 57, komfort: 75, premium: 106, prestiz: 150 },
    dla_nas:     { rozszerzony: 69, komfort: 98 },
    dla_rodziny: { podstawowy: 78, rozszerzony: 103, komfort: 147, premium: 194 },
  },
  A2: {
    dla_mnie:    { podstawowy: 50, rozszerzony: 89, komfort: 115, premium: 139 },
    dla_nas:     { podstawowy: 70, rozszerzony: 116, komfort: 152 },
    dla_rodziny: { podstawowy: 105, rozszerzony: 151, komfort: 210 },
  },
  B: {
    dla_mnie:    { podstawowy: 72, rozszerzony: 110, komfort: 146 },
    dla_nas:     { podstawowy: 99, rozszerzony: 159 },
    dla_rodziny: { podstawowy: 139, rozszerzony: 203 },
  },
};

const PRODUCT_LABEL: Record<ProductType, string> = {
  dla_mnie: 'Dla Mnie', dla_nas: 'Dla Nas', dla_rodziny: 'Dla Rodziny',
};
const VARIANT_LABEL: Record<Variant, string> = {
  podstawowy: 'Podstawowy', rozszerzony: 'Rozszerzony', komfort: 'Komfort', premium: 'Premium', prestiz: 'Prestiż',
};

describe('resolveOffer — taryfa', () => {
  for (const ageGroup of AGE_GROUPS) {
    for (const product of PRODUCTS) {
      for (const variant of VARIANTS) {
        const expected = TARIFF[ageGroup][product][variant];

        if (expected === undefined) {
          it(`${ageGroup} / ${product} / ${variant}: wariant nieoferowany → null`, () => {
            expect(resolveOffer({ ageGroup, product, variant, addons: NO_ADDONS })).toBeNull();
          });
          continue;
        }

        it(`${ageGroup} / ${product} / ${variant}: ${expected} zł`, () => {
          expect(resolveOffer({ ageGroup, product, variant, addons: NO_ADDONS })).toEqual({
            ageGroup,
            product,
            variant,
            productLabel:   PRODUCT_LABEL[product],
            variantLabel:   VARIANT_LABEL[variant],
            addonLabels:    [],
            monthlyPremium: expected,
          });
        });
      }
    }
  }

  it('każda grupa wiekowa i produkt ma co najmniej jeden wariant', () => {
    for (const ageGroup of AGE_GROUPS) {
      for (const product of PRODUCTS) {
        const offered = VARIANTS.filter(
          (variant) => resolveOffer({ ageGroup, product, variant, addons: NO_ADDONS }) !== null,
        );
        expect(offered.length, `${ageGroup}/${product}`).toBeGreaterThan(0);
      }
    }
  });
});

describe('resolveOffer — dodatki', () => {
  const base = { ageGroup: 'A1', product: 'dla_rodziny', variant: 'rozszerzony' } as const; // 103 zł

  it('MediPlan dolicza 9 zł', () => {
    const offer = resolveOffer({ ...base, addons: { ...NO_ADDONS, mediplan: true } });
    expect(offer?.monthlyPremium).toBe(112);
    expect(offer?.addonLabels).toEqual(['MediPlan']);
  });

  it('Medical Assistance dolicza 6 zł', () => {
    const offer = resolveOffer({ ...base, addons: { ...NO_ADDONS, medicalAssistance: true } });
    expect(offer?.monthlyPremium).toBe(109);
    expect(offer?.addonLabels).toEqual(['Medical Assistance']);
  });

  it('Global Doctors nie zmienia składki i ma etykietę z wyceną indywidualną', () => {
    const offer = resolveOffer({ ...base, addons: { ...NO_ADDONS, globalDoctors: true } });
    expect(offer?.monthlyPremium).toBe(103);
    expect(offer?.addonLabels).toEqual(['Global Doctors (wycena indywidualna)']);
  });

  it('wszystkie dodatki naraz: 103 + 9 + 6 + 0', () => {
    const offer = resolveOffer({
      ...base,
      addons: { mediplan: true, medicalAssistance: true, globalDoctors: true },
    });
    expect(offer?.monthlyPremium).toBe(118);
    expect(offer?.addonLabels).toEqual([
      'MediPlan',
      'Medical Assistance',
      'Global Doctors (wycena indywidualna)',
    ]);
  });

  it('dodatki nie „ratują" nieoferowanego wariantu', () => {
    expect(resolveOffer({
      ageGroup: 'B', product: 'dla_nas', variant: 'prestiz',
      addons: { mediplan: true, medicalAssistance: true, globalDoctors: true },
    })).toBeNull();
  });

  it('nie modyfikuje przekazanego wyboru', () => {
    const addons = { ...NO_ADDONS, mediplan: true };
    const selection = { ...base, addons };
    resolveOffer(selection);
    expect(selection).toEqual({ ...base, addons: { ...NO_ADDONS, mediplan: true } });
  });
});

describe('calcMonthlyPremium', () => {
  it('zwraca tę samą kwotę co resolveOffer', () => {
    const addons = { mediplan: true, medicalAssistance: false, globalDoctors: true };
    expect(calcMonthlyPremium('A2', 'dla_nas', 'komfort', addons)).toBe(
      resolveOffer({ ageGroup: 'A2', product: 'dla_nas', variant: 'komfort', addons })?.monthlyPremium,
    );
    expect(calcMonthlyPremium('A2', 'dla_nas', 'komfort', addons)).toBe(161);
  });

  it('zwraca 0 dla nieoferowanego wariantu', () => {
    expect(calcMonthlyPremium('B', 'dla_rodziny', 'premium', NO_ADDONS)).toBe(0);
  });
});
