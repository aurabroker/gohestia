import type { Variant } from '@/types';

export interface Benefit {
  name: string;
  description: string;
}

export const COVERAGE: Record<Variant, Benefit[]> = {
  podstawowy: [
    { name: 'Śmierć ubezpieczonego', description: 'Świadczenie dla uposażonych' },
    { name: 'Śmierć w wyniku NW', description: 'Dodatkowe świadczenie przy wypadku' },
    { name: 'Trwała niezdolność do pracy', description: 'Renta miesięczna' },
    { name: 'Poważne zachorowanie', description: '20 chorób objętych ochroną' },
  ],
  rozszerzony: [
    { name: 'Śmierć ubezpieczonego', description: 'Świadczenie dla uposażonych' },
    { name: 'Śmierć w wyniku NW', description: 'Dodatkowe świadczenie przy wypadku' },
    { name: 'Trwała niezdolność do pracy', description: 'Renta miesięczna' },
    { name: 'Poważne zachorowanie', description: '25 chorób objętych ochroną' },
    { name: 'Pobyt w szpitalu', description: 'Świadczenie dzienne' },
    { name: 'Operacja chirurgiczna', description: 'Zwrot kosztów' },
  ],
  komfort: [
    { name: 'Śmierć ubezpieczonego', description: 'Świadczenie dla uposażonych' },
    { name: 'Śmierć w wyniku NW', description: 'Dodatkowe świadczenie przy wypadku' },
    { name: 'Trwała niezdolność do pracy', description: 'Renta miesięczna' },
    { name: 'Poważne zachorowanie', description: '30 chorób objętych ochroną' },
    { name: 'Pobyt w szpitalu', description: 'Wyższe świadczenie dzienne' },
    { name: 'Operacja chirurgiczna', description: 'Zwrot kosztów' },
    { name: 'Specjalista', description: 'Konsultacje medyczne' },
    { name: 'Ochrona rodziny', description: 'Partner i dzieci objęci ochroną' },
  ],
  premium: [
    { name: 'Śmierć ubezpieczonego', description: 'Wysokie świadczenie dla uposażonych' },
    { name: 'Śmierć w wyniku NW', description: 'Dodatkowe świadczenie przy wypadku' },
    { name: 'Trwała niezdolność do pracy', description: 'Wysoka renta miesięczna' },
    { name: 'Poważne zachorowanie', description: '35 chorób objętych ochroną' },
    { name: 'Pobyt w szpitalu', description: 'Wysokie świadczenie dzienne' },
    { name: 'Operacja chirurgiczna', description: 'Pełny zwrot kosztów' },
    { name: 'Specjalista', description: 'Konsultacje + rehabilitacja' },
    { name: 'Ochrona rodziny', description: 'Pełna ochrona rodziny' },
  ],
  prestiz: [
    { name: 'Śmierć ubezpieczonego', description: 'Maksymalne świadczenie' },
    { name: 'Śmierć w wyniku NW', description: 'Podwójne świadczenie przy wypadku' },
    { name: 'Trwała niezdolność do pracy', description: 'Najwyższa renta miesięczna' },
    { name: 'Poważne zachorowanie', description: '40 chorób objętych ochroną' },
    { name: 'Pobyt w szpitalu', description: 'Najwyższe świadczenie dzienne' },
    { name: 'Operacja chirurgiczna', description: 'Pełny zwrot + rekonwalescencja' },
    { name: 'Specjalista', description: 'Nieograniczone konsultacje' },
    { name: 'Ochrona rodziny', description: 'Pełna ochrona + rozszerzenia' },
  ],
};

export const WAITING_PERIODS: Record<string, string> = {
  'Operacja chirurgiczna':    '6 miesięcy',
  'Poważne zachorowanie':     '3 miesiące',
  'Pobyt w szpitalu':         '2 miesiące (0 przy NW)',
  'Specjalista':              '3 miesiące',
  'Śmierć współmałżonka':    '6 miesięcy',
  'Urodzenie dziecka':        '9 miesięcy',
};
