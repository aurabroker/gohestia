import type { Metadata } from 'next';
import { Fira_Sans, Fira_Sans_Condensed } from 'next/font/google';
import './globals.css';

// Fira Sans: tekst i nagłówki. Fira Sans Condensed: kwoty i nagłówki tabel
// (cztery kolumny kwot mieszczą się w 390 px bez przewijania w bok).
// `latin-ext` zawiera polskie znaki.
const fira = Fira_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fira',
  display: 'swap',
});
const firaCond = Fira_Sans_Condensed({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fira-cond',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ERGO Razem: ile kosztuje grupowe ubezpieczenie na życie | Aura Expert',
  description:
    'Sprawdź składkę grupowego ubezpieczenia na życie ERGO Razem dla swojego wieku. Kalkulator prowadzi Aura Expert sp. z o.o., agent ERGO Hestii.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${fira.variable} ${firaCond.variable}`}>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
