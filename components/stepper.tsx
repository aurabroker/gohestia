'use client';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const STEPS = [
  { label: 'Wiek',         path: '/kalkulator/wiek' },
  { label: 'Ankieta',      path: '/kalkulator/ankieta' },
  { label: 'Weryfikacja',  path: '/kalkulator/weryfikacja' },
  { label: 'Oferta',       path: '/kalkulator/produkt' },
  { label: 'Podsumowanie', path: '/kalkulator/podsumowanie' },
  { label: 'Gotowe',       path: '/kalkulator/sukces' },
];

export function Stepper() {
  const pathname = usePathname();
  const currentIndex = STEPS.findIndex(s => s.path === pathname);

  return (
    <nav aria-label="Postęp" className="w-full">
      <ol className="flex items-center">
        {STEPS.map((step, i) => {
          const done    = i < currentIndex;
          const current = i === currentIndex;
          return (
            <li key={step.path} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors',
                    done    && 'bg-[#E4002B] border-[#E4002B] text-white',
                    current && 'bg-white border-[#E4002B] text-[#E4002B]',
                    !done && !current && 'bg-white border-gray-300 text-gray-400'
                  )}
                >
                  {done ? '✓' : i + 1}
                </div>
                <span className={clsx(
                  'mt-1 text-xs hidden sm:block',
                  current ? 'text-[#E4002B] font-medium' : 'text-gray-400'
                )}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={clsx(
                  'flex-1 h-0.5 mx-1 mb-4',
                  i < currentIndex ? 'bg-[#E4002B]' : 'bg-gray-200'
                )} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
