import type { Metadata } from 'next';
import { Hanken_Grotesk } from 'next/font/google';
import './globals.css';

// Jeden krój w całym serwisie: Hanken Grotesk (tekst, nagłówki, kwoty).
// Motyw nazywa General Sans; Hanken Grotesk to jego wolny odpowiednik, który
// można trzymać na własnym serwerze. `latin-ext` zawiera polskie znaki.
const hanken = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-hanken',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ERGO Razem: ile kosztuje grupowe ubezpieczenie na życie | Aura Expert',
  description:
    'Sprawdź składkę grupowego ubezpieczenia na życie ERGO Razem dla swojego wieku. Kalkulator prowadzi Aura Expert sp. z o.o., agent ERGO Hestii.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={hanken.variable}>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
