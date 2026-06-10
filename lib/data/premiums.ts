import type { AgeGroup, ProductType, PremiumEntry, Variant } from '@/types';

export const PREMIUMS: Record<AgeGroup, Record<ProductType, PremiumEntry[]>> = {
  A1: {
    dla_mnie: [
      { variant: 'rozszerzony', monthly: 57 },
      { variant: 'komfort',     monthly: 75 },
      { variant: 'premium',     monthly: 106 },
      { variant: 'prestiz',     monthly: 150 },
    ],
    dla_nas: [
      { variant: 'rozszerzony', monthly: 69 },
      { variant: 'komfort',     monthly: 98 },
    ],
    dla_rodziny: [
      { variant: 'podstawowy',  monthly: 78 },
      { variant: 'rozszerzony', monthly: 103 },
      { variant: 'komfort',     monthly: 147 },
      { variant: 'premium',     monthly: 194 },
    ],
  },
  A2: {
    dla_mnie: [
      { variant: 'podstawowy',  monthly: 50 },
      { variant: 'rozszerzony', monthly: 89 },
      { variant: 'komfort',     monthly: 115 },
      { variant: 'premium',     monthly: 139 },
    ],
    dla_nas: [
      { variant: 'podstawowy',  monthly: 70 },
      { variant: 'rozszerzony', monthly: 116 },
      { variant: 'komfort',     monthly: 152 },
    ],
    dla_rodziny: [
      { variant: 'podstawowy',  monthly: 105 },
      { variant: 'rozszerzony', monthly: 151 },
      { variant: 'komfort',     monthly: 210 },
    ],
  },
  B: {
    dla_mnie: [
      { variant: 'podstawowy',  monthly: 72 },
      { variant: 'rozszerzony', monthly: 110 },
      { variant: 'komfort',     monthly: 146 },
    ],
    dla_nas: [
      { variant: 'podstawowy',  monthly: 99 },
      { variant: 'rozszerzony', monthly: 159 },
    ],
    dla_rodziny: [
      { variant: 'podstawowy',  monthly: 139 },
      { variant: 'rozszerzony', monthly: 203 },
    ],
  },
};

export const ADDONS = {
  mediplan:           { label: 'MediPlan',           monthly: 9 },
  medical_assistance: { label: 'Medical Assistance', monthly: 6 },
  global_doctors:     { label: 'Global Doctors',     monthly: null, maxAge: 63,
                        note: 'Składka zależna od wieku — podana przy wycenie' },
} as const;

export const VARIANT_LABELS: Record<Variant, string> = {
  podstawowy:  'Podstawowy',
  rozszerzony: 'Rozszerzony',
  komfort:     'Komfort',
  premium:     'Premium',
  prestiz:     'Prestiż',
};

export const PRODUCT_LABELS: Record<ProductType, string> = {
  dla_mnie:    'Dla Mnie',
  dla_nas:     'Dla Nas',
  dla_rodziny: 'Dla Rodziny',
};
