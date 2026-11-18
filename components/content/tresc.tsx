import type { ReactNode } from 'react';

/** Długi tekst (strony prawne, opisy) w kolorach i rozmiarach druku. */
export function Tresc({ children }: { children: ReactNode }) {
  return <div className="prose tresc">{children}</div>;
}
