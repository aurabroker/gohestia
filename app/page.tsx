'use client';
import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ADDONS, PRODUCT_LABELS } from '@/lib/data/premiums';
import { AGE_RANGE, PRODUCT_WHO, getHomeRows, getPriceRanges } from '@/lib/benefit-rows';
import type { AgeGroup } from '@/types';

function groupForAge(age: number): AgeGroup | null {
  if (age >= 18 && age <= 53) return 'A1';
  if (age >= 54 && age <= 59) return 'A2';
  if (age >= 60 && age <= 65) return 'B';
  return null;
}

const STEPS = [
  { title: 'Wiek',    text: 'Podajesz datę urodzenia. Od wieku zależy składka.' },
  { title: 'Zdrowie', text: 'Pięć oświadczeń, bez badań lekarskich. Odpowiedzi zostają w Twojej przeglądarce.' },
  { title: 'Oferta',  text: 'Wybierasz produkt, wariant i dodatki. Widzisz dokładną składkę.' },
  { title: 'Kontakt', text: 'Zostawiasz telefon i e-mail. Agent oddzwania w ciągu 1–2 dni roboczych.' },
];

export default function Home() {
  const [age, setAge] = useState('');

  const ageNumber = age === '' ? null : Number(age);
  const typedGroup = ageNumber === null ? null : groupForAge(ageNumber);
  // Wiek jeszcze niewpisany albo spoza zakresu: pokazujemy tabelę dla 18–53 lat.
  const outOfRange = ageNumber !== null && age.length >= 2 && typedGroup === null;
  const group: AgeGroup = typedGroup ?? 'A1';

  const prices = getPriceRanges(group);
  const rows = getHomeRows(group);
  const cols = { '--n': 3 } as CSSProperties;

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <section className={`sheet${outOfRange ? ' is-out' : ''}`}>
          <div className="wrap hero hero-grid">
            <div>
              <div className="q">
                <label className="q-age">
                  <span>Mam</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    autoComplete="off"
                    placeholder="35"
                    aria-label="Twój wiek w latach"
                    aria-describedby="wiek-info"
                    value={age}
                    onChange={(e) => setAge(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  />
                  <span>lat.</span>
                </label>
                <h1>Ile kosztuje ubezpieczenie na życie ERGO Razem?</h1>
              </div>

              <div id="wiek-info" aria-live="polite">
                {outOfRange ? (
                  <p className="q-info msg">
                    Do ubezpieczenia ERGO Razem mogą przystąpić osoby w wieku 18–65 lat.{' '}
                    <Link href="/wykluczenie/wiek">Zobacz, co możesz zrobić</Link>. Obok składki dla
                    wieku {AGE_RANGE.A1}.
                  </p>
                ) : typedGroup === null ? (
                  <p className="q-info">
                    Wpisz swój wiek, a tabela pokaże Twoje składki. Teraz widzisz składki dla
                    wieku {AGE_RANGE.A1}.
                  </p>
                ) : null}
              </div>

              <div className="cta d">
                <Link href="/kalkulator/wiek" className="btn">Sprawdź składkę</Link>
                <p className="cta-n">
                  Cztery kroki, kilka minut, bez badań lekarskich.
                  <br />
                  Niczego nie kupujesz online: na końcu wysyłasz zapytanie do agenta.
                </p>
              </div>
            </div>

            <div className="hero-t">
              <div className="tab" style={cols} role="table" aria-label="Składka miesięczna według produktu">
                <div role="row">
                  <div className="corner" role="presentation" />
                  {prices.map(({ product }) => (
                    <div key={product} className="c ph" role="columnheader">
                      <b>{PRODUCT_LABELS[product]}</b>
                      <span>{PRODUCT_WHO[product]}</span>
                    </div>
                  ))}
                </div>
                <div role="row">
                  <div className="stub" role="rowheader">
                    Płacisz miesięcznie
                    <small>wiek {AGE_RANGE[group]}</small>
                  </div>
                  {prices.map(({ product, min, max }, i) => (
                    <div key={product} className="c pp" role="cell">
                      <small>od</small>
                      <strong>
                        <span key={group} className="swap" style={{ '--i': i } as CSSProperties}>{min} zł</span>
                      </strong>
                      <small>do {max} zł</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cta m">
                <Link href="/kalkulator/wiek" className="btn">Sprawdź składkę</Link>
                <p className="cta-n">Cztery kroki, kilka minut, bez badań lekarskich.</p>
              </div>

              <div className="pay">
                <h2 className="pay-h">
                  Ubezpieczenie wypłaca
                  <small>kwoty w najtańszym wariancie każdego produktu</small>
                </h2>
                <div className="tab" style={cols} role="table" aria-label="Kwoty wypłat w najtańszym wariancie każdego produktu">
                  <div role="row">
                    <div className="corner" role="presentation" />
                    {prices.map(({ product }) => (
                      <div key={product} className="colh" role="columnheader">{PRODUCT_LABELS[product]}</div>
                    ))}
                  </div>
                  {rows.map((row, r) => (
                    <div key={row.key} role="row">
                      <div className="stub" role="rowheader">
                        {row.label}
                        {row.note && <small>{row.note}</small>}
                      </div>
                      {row.values.map((value, i) => (
                        <div key={i} className={`c${value === null ? ' no' : ''}`} role="cell">
                          <span key={group} className="swap" style={{ '--i': 3 + r * 3 + i } as CSSProperties}>
                            {value ?? 'nie obejmuje'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="pay-n">
                  <p>
                    Wyższe warianty kosztują więcej i wypłacają więcej. W kalkulatorze zobaczysz je obok
                    siebie. Do każdego wariantu możesz dołączyć {ADDONS.mediplan.label} (+{ADDONS.mediplan.monthly} zł)
                    i {ADDONS.medical_assistance.label} (+{ADDONS.medical_assistance.monthly} zł miesięcznie).
                  </p>
                  <p>
                    Karencja to czas od początku ubezpieczenia, w którym dana ochrona jeszcze nie działa.
                    Szczegóły w OWU (kod ER 01/25).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap steps" aria-labelledby="kroki">
          <h2 id="kroki">Cztery kroki do rozmowy z agentem</h2>
          <ol className="stp">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="n" aria-hidden="true">{i + 1}</span>
                <div>
                  <b>{step.title}</b>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="cta">
            <Link href="/kalkulator/wiek" className="btn">Sprawdź składkę</Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
