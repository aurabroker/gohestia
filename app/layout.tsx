import type { Metadata } from 'next';
import { Archivo_Narrow, Bevan, Six_Caps } from 'next/font/google';
import './globals.css';

// Trzy kroje jednego afisza: Six Caps na wielkie wiersze i kwoty, Bevan na
// nagłówki sekcji i nazwy, Archivo Narrow na wszystko, co się czyta.
// `latin-ext` zawiera polskie znaki.
const sixCaps = Six_Caps({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  variable: '--font-six-caps',
  display: 'swap',
});
const bevan = Bevan({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  variable: '--font-bevan',
  display: 'swap',
});
const archivoNarrow = Archivo_Narrow({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-archivo-narrow',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ERGO Razem: ile kosztuje grupowe ubezpieczenie na życie | Aura Expert',
  description:
    'Sprawdź składkę grupowego ubezpieczenia na życie ERGO Razem dla swojego wieku. Kalkulator prowadzi Aura Expert sp. z o.o., agent ERGO Hestii.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${sixCaps.variable} ${bevan.variable} ${archivoNarrow.variable}`}>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
