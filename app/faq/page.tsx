import type { Metadata } from 'next';
import { Faq } from './faq';

export const metadata: Metadata = {
  title: 'FAQ — Najczęściej zadawane pytania — ERGO Razem',
  description: 'Odpowiedzi na najczęściej zadawane pytania o grupowe ubezpieczenie na życie ERGO Razem: przystąpienie, ankietę medyczną, warianty, składki, dodatki i zgłaszanie roszczeń.',
};

export default function FaqPage() {
  return <Faq />;
}
