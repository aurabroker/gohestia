import { ADDONS, PREMIUMS, PRODUCT_LABELS, VARIANT_LABELS } from './data/premiums';
import type { AgeGroup, ProductType, Variant } from '@/types';

export interface OfferAddons {
  mediplan:          boolean;
  medicalAssistance: boolean;
  globalDoctors:     boolean;
}

/** Wybór użytkownika — wyłącznie identyfikatory, bez żadnych kwot. */
export interface OfferSelection {
  ageGroup: AgeGroup;
  product:  ProductType;
  variant:  Variant;
  addons:   OfferAddons;
}

/** Oferta wyliczona z taryfy (`lib/data/premiums.ts`). */
export interface ResolvedOffer {
  ageGroup:       AgeGroup;
  product:        ProductType;
  variant:        Variant;
  productLabel:   string;
  variantLabel:   string;
  addonLabels:    string[];
  /** Łączna składka miesięczna w zł (wariant + dodatki o stałej cenie). */
  monthlyPremium: number;
}

/** Global Doctors nie ma stałej ceny — składkę ustala agent indywidualnie. */
export const GLOBAL_DOCTORS_LABEL = `${ADDONS.global_doctors.label} (wycena indywidualna)`;

/**
 * Jedyne miejsce, w którym z wyboru (grupa wiekowa, produkt, wariant, dodatki)
 * powstają etykiety i składka. Korzystają z niego zarówno strony kalkulatora,
 * jak i endpoint wysyłający maile, więc ekran i mail pokazują te same liczby.
 *
 * Zwraca `null`, gdy wariant nie jest oferowany dla danej grupy wiekowej
 * i produktu.
 */
export function resolveOffer({ ageGroup, product, variant, addons }: OfferSelection): ResolvedOffer | null {
  const entry = PREMIUMS[ageGroup]?.[product]?.find((p) => p.variant === variant);
  if (!entry) return null;

  let monthlyPremium = entry.monthly;
  const addonLabels: string[] = [];

  if (addons.mediplan) {
    monthlyPremium += ADDONS.mediplan.monthly;
    addonLabels.push(ADDONS.mediplan.label);
  }
  if (addons.medicalAssistance) {
    monthlyPremium += ADDONS.medical_assistance.monthly;
    addonLabels.push(ADDONS.medical_assistance.label);
  }
  if (addons.globalDoctors) {
    // Wycena indywidualna — do składki nie doliczamy nic.
    addonLabels.push(GLOBAL_DOCTORS_LABEL);
  }

  return {
    ageGroup,
    product,
    variant,
    productLabel: PRODUCT_LABELS[product],
    variantLabel: VARIANT_LABELS[variant],
    addonLabels,
    monthlyPremium,
  };
}
