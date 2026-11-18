'use client';
import { usePathname } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculator-store';
import { resolveOffer } from '@/lib/offer';

const AGE_RANGE = { A1: '18–53 lat', A2: '54–59 lat', B: '60–65 lat' } as const;

const STEPS = [
  { label: 'Wiek',    path: '/kalkulator/wiek',         todo: 'data urodzenia' },
  { label: 'Zdrowie', path: '/kalkulator/ankieta',      todo: 'pięć oświadczeń, bez badań' },
  { label: 'Oferta',  path: '/kalkulator/produkt',      todo: 'produkt, wariant i dodatki' },
  { label: 'Kontakt', path: '/kalkulator/podsumowanie', todo: 'dane i wysyłka zapytania do agenta' },
] as const;

/**
 * Cztery kroki kalkulatora. Ukończony krok jest niebieski i pokazuje to, co
 * zostało wpisane lub wybrane; bieżący jest czarny; kolejne są jeszcze puste.
 * Na telefonie zostaje zdanie „Krok 3 z 4: Oferta" i cztery kreski.
 */
export function Stepper() {
  const pathname = usePathname();
  const { ageGroup, selectedProduct, selectedVariant, addons } = useCalculatorStore();
  const finished = pathname === '/kalkulator/sukces';
  const currentIndex = finished ? STEPS.length : STEPS.findIndex((s) => s.path === pathname);
  if (currentIndex < 0) return null;

  const offer = ageGroup && selectedProduct && selectedVariant
    ? resolveOffer({ ageGroup, product: selectedProduct, variant: selectedVariant, addons })
    : null;
  const doneValue = [
    ageGroup ? `wiek ${AGE_RANGE[ageGroup]}` : 'podany',
    'oświadczenia złożone',
    offer ? `${offer.productLabel}, ${offer.variantLabel}, ${offer.monthlyPremium} zł` : 'wybrana',
    'zapytanie wysłane',
  ];

  return (
    <nav aria-label="Kroki kalkulatora" className="wrap prog">
      {!finished && (
        <p className="prog-m" aria-hidden="true">
          Krok {currentIndex + 1} z {STEPS.length}: <b>{STEPS[currentIndex].label}</b>
        </p>
      )}
      <ol>
        {STEPS.map((step, i) => {
          const state = i < currentIndex ? 'done' : i === currentIndex ? 'now' : 'next';
          return (
            <li key={step.path} className={state} aria-current={state === 'now' ? 'step' : undefined}>
              <span className="pn">
                <i>{i + 1}</i> {step.label}
              </span>
              <span className="pv">
                {state === 'done' ? doneValue[i] : state === 'now' ? 'wypełniasz teraz' : step.todo}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
