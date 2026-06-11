import * as React from 'react';
import type { OfertaData } from '@/types';
import { VARIANT_LABELS, PRODUCT_LABELS } from '@/lib/data/premiums';
import type { Variant, ProductType } from '@/types';

interface Props {
  imie: string;
  nazwisko: string;
  oferta: OfertaData;
}

export function OfertaEmailTemplate({ imie, nazwisko, oferta }: Props) {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ background: '#E4002B', padding: '24px 32px' }}>
        <h1 style={{ color: '#fff', margin: 0, fontSize: 22 }}>ERGO Razem — Twoja oferta</h1>
      </div>
      <div style={{ padding: '32px', background: '#fff' }}>
        <p>Szanowny(a) Panie/Pani <strong>{imie} {nazwisko}</strong>,</p>
        <p>Dziękujemy za skorzystanie z kalkulatora grupowego ubezpieczenia na życie ERGO Razem.</p>

        <div style={{ background: '#f9f9f9', borderRadius: 8, padding: 20, margin: '20px 0' }}>
          <h2 style={{ fontSize: 16, marginTop: 0 }}>Podsumowanie wybranej oferty</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '6px 0', color: '#666' }}>Produkt</td>
                <td style={{ padding: '6px 0', fontWeight: 600 }}>
                  {PRODUCT_LABELS[oferta.product as ProductType]}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '6px 0', color: '#666' }}>Wariant</td>
                <td style={{ padding: '6px 0', fontWeight: 600 }}>
                  {VARIANT_LABELS[oferta.variant as Variant] ?? oferta.variant}
                </td>
              </tr>
              {oferta.addons.length > 0 && (
                <tr>
                  <td style={{ padding: '6px 0', color: '#666' }}>Dodatki</td>
                  <td style={{ padding: '6px 0' }}>{oferta.addons.join(', ')}</td>
                </tr>
              )}
              <tr>
                <td style={{ padding: '8px 0', color: '#666', fontSize: 16 }}>Składka miesięczna</td>
                <td style={{ padding: '8px 0', fontWeight: 700, fontSize: 20, color: '#E4002B' }}>
                  {oferta.monthlyPremium} zł / mies.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: 13, color: '#666' }}>
          Agent ERGO Hestia skontaktuje się z Tobą w ciągu 1–2 dni roboczych, aby omówić szczegóły oferty.
        </p>
      </div>
      <div style={{ padding: '16px 32px', background: '#f3f3f3', fontSize: 11, color: '#999' }}>
        Szczegóły w OWU (kod ER 01/25). Obowiązuje od 2.06.2025 r.
      </div>
    </div>
  );
}
