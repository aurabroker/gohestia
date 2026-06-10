import { differenceInYears } from 'date-fns';
import { PREMIUMS, ADDONS } from './data/premiums';
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

export function calcMonthlyPremium(
  ageGroup: AgeGroup,
  product: ProductType,
  variant: Variant,
  addons: { mediplan: boolean; medicalAssistance: boolean; globalDoctors: boolean },
  birthDate: Date
): number {
  const base = PREMIUMS[ageGroup][product].find(p => p.variant === variant)?.monthly ?? 0;
  let total = base;
  if (addons.mediplan)          total += ADDONS.mediplan.monthly;
  if (addons.medicalAssistance) total += ADDONS.medical_assistance.monthly;
  if (addons.globalDoctors) {
    const age = differenceInYears(new Date(), birthDate);
    if (age < 64) total += 0; // cena indywidualna
  }
  return total;
}

export function isGlobalDoctorsEligible(birthDate: Date): boolean {
  return differenceInYears(new Date(), birthDate) < 64;
}
