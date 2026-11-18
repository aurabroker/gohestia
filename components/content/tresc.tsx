import type { ReactNode } from 'react';

/*
 * `prose` (wtyczka typography) trafia do warstwy utilities, a `.tresc` z globals.css
 * do warstwy components, więc w parze „prose tresc" wygrywa `prose`: tekst wychodzi
 * szary, 16 px i węższy, niż opisuje `.tresc`. Dopóki `.tresc` stoi w tej warstwie,
 * powtarzamy tu jego wartości klasami Tailwinda. Po przeniesieniu `.tresc` wyżej
 * wystarczy samo „prose tresc".
 */
const TRESC = [
  'prose tresc',
  'max-w-[44em] text-[17px] leading-[1.6]',
  '[--tw-prose-body:var(--color-druk)] [--tw-prose-headings:var(--color-druk)]',
  '[--tw-prose-links:var(--color-druk)] [--tw-prose-bold:var(--color-druk)]',
  '[--tw-prose-counters:var(--color-druk)] [--tw-prose-bullets:var(--color-druk)]',
  '[--tw-prose-hr:var(--color-druk)] [--tw-prose-quotes:var(--color-druk)]',
  '[--tw-prose-th-borders:var(--color-druk)] [--tw-prose-td-borders:var(--color-blankiet-2)]',
  'prose-h2:text-[24px] prose-h2:leading-[1.2]',
  'prose-h3:text-[20px] prose-h3:leading-[1.25]',
  'prose-a:font-normal prose-a:decoration-1',
].join(' ');

/** Długi tekst (strony prawne, opisy) w kolorach i rozmiarach druku. */
export function Tresc({ children }: { children: ReactNode }) {
  return <div className={TRESC}>{children}</div>;
}
