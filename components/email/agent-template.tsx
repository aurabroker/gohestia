import * as React from 'react';
import type { OfertaData } from '@/types';
import { VARIANT_LABELS, PRODUCT_LABELS } from '@/lib/data/premiums';
import type { Variant, ProductType } from '@/types';

interface Props {
  imie: string;
  nazwisko: string;
  email: string;
  telefon: string;
  oferta: OfertaData;
}

export function AgentEmailTemplate({ imie, nazwisko, email, telefon, oferta }: Props) {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ background: '#1a1a2e', padding: '24px 32px' }}>
        <h1 style={{ color: '#fff', margin: 0, fontSize: 20 }}>
          Nowe zapytanie — ERGO Razem Kalkulator
        </h1>
      </div>
      <div style={{ padding: '32px', background: '#fff' }}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>Dane kontaktowe klienta</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 0', color: '#666', width: 130 }}>Imię i nazwisko</td>
              <td style={{ fontWeight: 600 }}>{imie} {nazwisko}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 0', color: '#666' }}>Email</td>
              <td><a href={`mailto:${email}`}>{email}</a></td>
            </tr>
            <tr>
              <td style={{ padding: '4px 0', color: '#666' }}>Telefon</td>
              <td>{telefon}</td>
            </tr>
          </tbody>
        </table>

        <h2 style={{ fontSize: 16 }}>Wybrana konfiguracja</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 0', color: '#666', width: 130 }}>Grupa wiekowa</td>
              <td style={{ fontWeight: 600 }}>{oferta.ageGroup}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 0', color: '#666' }}>Produkt</td>
              <td style={{ fontWeight: 600 }}>{PRODUCT_LABELS[oferta.product as ProductType]}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 0', color: '#666' }}>Wariant</td>
              <td style={{ fontWeight: 600 }}>{VARIANT_LABELS[oferta.variant as Variant] ?? oferta.variant}</td>
            </tr>
            {oferta.addons.length > 0 && (
              <tr>
                <td style={{ padding: '4px 0', color: '#666' }}>Dodatki</td>
                <td>{oferta.addons.join(', ')}</td>
              </tr>
            )}
            <tr>
              <td style={{ padding: '8px 0', color: '#666', fontSize: 16 }}>Składka</td>
              <td style={{ fontWeight: 700, fontSize: 20, color: '#E4002B' }}>
                {oferta.monthlyPremium} zł / mies.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
