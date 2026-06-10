import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ERGO Razem — Kalkulator Grupy Otwartej',
  description: 'Oblicz składkę grupowego ubezpieczenia na życie ERGO Razem. Sopockie TU na Życie ERGO Hestia S.A.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
