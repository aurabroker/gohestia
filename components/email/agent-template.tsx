import * as React from 'react';
import type { ResolvedOffer } from '@/lib/offer';

/** Status zgód dobrowolnych (marketingowych) udzielonych przez klienta. */
export interface OptionalConsents {
  marketingElektroniczny: boolean;
  marketingErgoHestia:    boolean;
  marketingCpop:          boolean;
}

export interface MissingDocument {
  title:    string;
  required: boolean;
}

interface Props {
  imie: string;
  nazwisko: string;
  email: string;
  telefon: string;
  region?: string;
  /** Oferta wyliczona na serwerze z taryfy. */
  oferta: ResolvedOffer;
  zgody: OptionalConsents;
  /** Czas przyjęcia zgłoszenia, sformatowany w strefie Europe/Warsaw. */
  submittedAt: string;
  /** Dokumenty, których NIE dołączono do maila klienta. */
  missingDocuments: MissingDocument[];
}

/** Etykiety zgód dobrowolnych w kolejności prezentacji w mailu. */
const OPTIONAL_CONSENTS: { key: keyof OptionalConsents; label: string }[] = [
  { key: 'marketingElektroniczny', label: 'Informacja handlowa drogą elektroniczną (oferta na e-mail)' },
  { key: 'marketingErgoHestia',    label: 'Działania marketingowe STU ERGO Hestia S.A.' },
  { key: 'marketingCpop',          label: 'Informacja handlowa od CPOP' },
];

function StatusBadge({ granted }: { granted: boolean }) {
  return (
    <span style={{ fontWeight: 700, color: granted ? '#0a7d33' : '#999' }}>
      {granted ? 'TAK' : 'NIE'}
    </span>
  );
}

export function AgentEmailTemplate({
  imie, nazwisko, email, telefon, region, oferta, zgody, submittedAt, missingDocuments,
}: Props) {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ background: '#1a1a2e', padding: '24px 32px' }}>
        <h1 style={{ color: '#fff', margin: 0, fontSize: 20 }}>
          Nowe zapytanie — ERGO Razem Kalkulator
        </h1>
      </div>
      <div style={{ padding: '32px', background: '#fff' }}>
        {missingDocuments.length > 0 && (
          <div
            style={{
              border: '2px solid #b45309',
              background: '#fff7ed',
              borderRadius: 8,
              padding: '16px 20px',
              marginBottom: 24,
            }}
          >
            <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: 15, color: '#9a3412' }}>
              UWAGA: klient NIE otrzymał kompletu dokumentów
            </p>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: '#7c2d12' }}>
              Do maila wysłanego do klienta nie udało się dołączyć:
            </p>
            <ul style={{ margin: '0 0 8px', paddingLeft: 20, fontSize: 13, color: '#7c2d12' }}>
              {missingDocuments.map((doc) => (
                <li key={doc.title}>
                  <strong>{doc.title}</strong>
                  {doc.required ? ' — dokument wymagany' : ''}
                </li>
              ))}
            </ul>
            <p style={{ margin: 0, fontSize: 13, color: '#7c2d12' }}>
              Przekaż te dokumenty klientowi samodzielnie przed przystąpieniem do umowy.
            </p>
          </div>
        )}

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
            {region && region.trim() !== '' && (
              <tr>
                <td style={{ padding: '4px 0', color: '#666' }}>Region</td>
                <td style={{ fontWeight: 600 }}>{region}</td>
              </tr>
            )}
            <tr>
              <td style={{ padding: '4px 0', color: '#666' }}>Zgłoszono</td>
              <td>{submittedAt}</td>
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
              <td style={{ fontWeight: 600 }}>{oferta.productLabel}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 0', color: '#666' }}>Wariant</td>
              <td style={{ fontWeight: 600 }}>{oferta.variantLabel}</td>
            </tr>
            {oferta.addonLabels.length > 0 && (
              <tr>
                <td style={{ padding: '4px 0', color: '#666' }}>Dodatki</td>
                <td>{oferta.addonLabels.join(', ')}</td>
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

        <h2 style={{ fontSize: 16, marginTop: 24 }}>Zgody klienta</h2>
        <p style={{ margin: '0 0 12px', color: '#666', fontSize: 13 }}>
          Zgody obowiązkowe (wymagane do objęcia ochroną):{' '}
          <StatusBadge granted />
          {' — komplet zaakceptowany'}
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {OPTIONAL_CONSENTS.map(({ key, label }) => (
              <tr key={key}>
                <td style={{ padding: '4px 0', color: '#666' }}>{label}</td>
                <td style={{ width: 50, textAlign: 'right' }}>
                  <StatusBadge granted={zgody[key]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ margin: '12px 0 0', color: '#999', fontSize: 12 }}>
          Dane medyczne (ankieta zdrowotna) nie są przekazywane.
        </p>
      </div>
    </div>
  );
}
