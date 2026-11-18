import * as React from 'react';
import type { ResolvedOffer } from '@/lib/offer';

interface Props {
  imie: string;
  nazwisko: string;
  /** Oferta wyliczona na serwerze z taryfy. */
  oferta: ResolvedOffer;
  /** Nazwy dokumentów faktycznie dołączonych do tej wiadomości. */
  attachedDocuments: string[];
  /** `false`, gdy któregoś dokumentu z konfiguracji nie udało się dołączyć. */
  documentsComplete: boolean;
  /** Adres serwisu z konfiguracji (`SITE_URL`) albo `null` — wtedy bez linków. */
  siteUrl: string | null;
}

export function OfertaEmailTemplate({
  imie, nazwisko, oferta, attachedDocuments, documentsComplete, siteUrl,
}: Props) {
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
                <td style={{ padding: '6px 0', fontWeight: 600 }}>{oferta.productLabel}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 0', color: '#666' }}>Wariant</td>
                <td style={{ padding: '6px 0', fontWeight: 600 }}>{oferta.variantLabel}</td>
              </tr>
              {oferta.addonLabels.length > 0 && (
                <tr>
                  <td style={{ padding: '6px 0', color: '#666' }}>Dodatki</td>
                  <td style={{ padding: '6px 0' }}>{oferta.addonLabels.join(', ')}</td>
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

        {(attachedDocuments.length > 0 || !documentsComplete || siteUrl) && (
          <h2 style={{ fontSize: 16 }}>Dokumenty</h2>
        )}
        {attachedDocuments.length > 0 && (
          <>
            <p style={{ fontSize: 13, color: '#444', margin: '0 0 6px' }}>
              W załączniku do tej wiadomości:
            </p>
            <ul style={{ fontSize: 13, color: '#444', margin: '0 0 8px', paddingLeft: 20 }}>
              {attachedDocuments.map((title) => (
                <li key={title}>{title}</li>
              ))}
            </ul>
          </>
        )}
        {!documentsComplete && (
          <p style={{ fontSize: 13, color: '#444', margin: '0 0 8px' }}>
            {attachedDocuments.length > 0
              ? 'Pozostałe dokumenty przekaże agent przy kontakcie.'
              : 'Do tej wiadomości nie udało się dołączyć dokumentów — przekaże je agent przy kontakcie.'}
          </p>
        )}
        {siteUrl && (
          <p style={{ fontSize: 13, color: '#444', margin: '0 0 8px' }}>
            Dokumenty są też dostępne na stronie:{' '}
            <a href={`${siteUrl}/dokumenty/owu.pdf`}>Ogólne Warunki Ubezpieczenia (PDF)</a>
            {' · '}
            <a href={`${siteUrl}/informacja-o-agencie`}>Informacja o agencie</a>
          </p>
        )}

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
