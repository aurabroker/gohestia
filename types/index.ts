export type AgeGroup = 'A1' | 'A2' | 'B';
// A1 = 18-53, A2 = 54-59, B = 60-65

export type ProductType = 'dla_mnie' | 'dla_nas' | 'dla_rodziny';

export type Variant =
  | 'podstawowy'
  | 'rozszerzony'
  | 'komfort'
  | 'premium'
  | 'prestiz';

export interface PremiumEntry {
  variant: Variant;
  monthly: number;
}

export interface OfertaData {
  ageGroup: AgeGroup;
  product: ProductType;
  variant: string;
  addons: string[];
  monthlyPremium: number;
}
