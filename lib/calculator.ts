import { differenceInYears } from 'date-fns';
import { PREMIUMS } from './data/premiums';
import { resolveOffer, type OfferAddons } from './offer';
import type { AgeGroup, ProductType, Variant } from '@/types';

export function getAgeGroup(birthDate: Date): AgeGroup | null {
  const age = differenceInYears(new Date(), birthDate);
  if (age < 18 || age >= 66) return null;
  if (age < 54) return 'A1';
  if (age < 60) return 'A2';
  return 'B';
}

export function getVariants(ageGroup: AgeGroup, product: ProductType) {
  return PREMIUMS[ageGroup][product];
}

/**
 * Łączna składka miesięczna dla wyboru użytkownika. Liczy ją `resolveOffer`
 * — to samo wyliczenie trafia do maili. Zwraca 0, gdy wariant nie jest
 * oferowany dla danej grupy wiekowej i produktu.
 */
export function calcMonthlyPremium(
  ageGroup: AgeGroup,
  product: ProductType,
  variant: Variant,
  addons: OfferAddons,
): number {
  return resolveOffer({ ageGroup, product, variant, addons })?.monthlyPremium ?? 0;
}

export function isGlobalDoctorsEligible(birthDate: Date): boolean {
  return differenceInYears(new Date(), birthDate) < 64;
}
