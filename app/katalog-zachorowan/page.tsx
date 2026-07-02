import type { Metadata } from 'next';
import { KatalogZachorowan } from './katalog';

export const metadata: Metadata = {
  title: 'Katalog Poważnych Zachorowań — ERGO Razem',
  description: 'Pełny katalog 57 poważnych zachorowań objętych ochroną ERGO Razem (WU ER 01/25) z definicjami ubezpieczeniowymi i zakresem dla każdego wariantu.',
};

export default function KatalogZachorowanPage() {
  return <KatalogZachorowan />;
}
