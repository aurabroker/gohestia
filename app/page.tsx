'use client';
import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ADDONS, PRODUCT_LABELS } from '@/lib/data/premiums';
import { AGE_RANGE, PRODUCT_WHO, getHomeRows, getPriceRanges } from '@/lib/benefit-rows';
import type { AgeGroup, ProductType } from '@/types';

function groupForAge(age: number): AgeGroup | null {
  if (age >= 18 && age <= 53) return 'A1';
  if (age >= 54 && age <= 59) return 'A2';
  if (age >= 60 && age <= 65) return 'B';
  return null;
}

// Zdjęcia z pierwszej wersji serwisu, po jednym na produkt: kogo obejmuje ochrona.
// `at` to punkt kadru (object-position), żeby twarze zostały w wąskiej ramce.
const PRODUCT_PHOTO: Record<ProductType, { src: string; alt: string; at: string }> = {
  dla_mnie:    { src: '/zdjecia/dla-mnie.jpg',    alt: 'Uśmiechnięta kobieta w parku', at: '50% 28%' },
  dla_nas:     { src: '/zdjecia/dla-nas.jpg',     alt: 'Para: kobieta na plecach mężczyzny, oboje z rozłożonymi rękami', at: '50% 30%' },
  dla_rodziny: { src: '/zdjecia/dla-rodziny.jpg', alt: 'Rodzice z córką i psem biegną po plaży', at: '50% 62%' },
};

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
  // Wiek jeszcze niewpisany albo spoza zakresu: pokazujemy składki dla 18–53 lat.
  const outOfRange = ageNumber !== null && age.length >= 2 && typedGroup === null;
  const group: AgeGroup = typedGroup ?? 'A1';

  const prices = getPriceRanges(group);
  const rows = getHomeRows(group);
  const cols = { '--n': 3 } as CSSProperties;

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Pytanie, pole wieku i akcja po lewej; po prawej trzy karty produktów,
            których składki zmieniają się po wpisaniu wieku. */}
        <section className={`hero${outOfRange ? ' is-out' : ''}`}>
          <div className="wrap">
            <h1>Ile kosztuje ubezpieczenie na życie ERGO Razem?</h1>

            <div className="rate">
              <div className="ask">
                <label className="q-age">
                  <span>Mam</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    autoComplete="off"
                    aria-label="Twój wiek w latach"
                    aria-describedby="wiek-info"
                    value={age}
                    onChange={(e) => setAge(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  />
                  <span>lat.</span>
                </label>
                <div id="wiek-info" className="q-live" aria-live="polite">
                  {outOfRange ? (
                    <p className="q-info msg">
                      Do ubezpieczenia ERGO Razem mogą przystąpić osoby w wieku 18–65 lat.{' '}
                      <Link href="/wykluczenie/wiek">Zobacz, co możesz zrobić</Link>. Obok składki dla
                      wieku <span className="whitespace-nowrap">{AGE_RANGE.A1}</span>.
                    </p>
                  ) : typedGroup === null ? (
                    <p className="q-info">
                      Wpisz swój wiek, a tabela pokaże Twoje składki. Teraz widzisz składki dla
                      wieku <span className="whitespace-nowrap">{AGE_RANGE.A1}</span>.
                    </p>
                  ) : null}
                </div>
                <div className="cta">
                  <Link href="/kalkulator/wiek" className="btn">Sprawdź składkę</Link>
                  <p className="cta-n">
                    Cztery kroki, kilka minut, bez badań lekarskich.
                    <br />
                    Niczego nie kupujesz online: na końcu wysyłasz zapytanie do agenta.
                  </p>
                </div>
              </div>

              <div className="offer">
                <p className="rate-cap" id="rate-cap">
                  Płacisz miesięcznie
                  <small>wiek {AGE_RANGE[group]}</small>
                </p>
                <ul className="rate-l" aria-labelledby="rate-cap">
                  {prices.map(({ product, min, max }) => (
                    <li key={product} className="pr">
                      <figure className="plate">
                        <span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={PRODUCT_PHOTO[product].src}
                            alt={PRODUCT_PHOTO[product].alt}
                            width={720}
                            height={480}
                            style={{ objectPosition: PRODUCT_PHOTO[product].at }}
                          />
                        </span>
                      </figure>
                      <div className="ph">
                        <b>{PRODUCT_LABELS[product]}</b>
                        <span>{PRODUCT_WHO[product]}</span>
                      </div>
                      <p className="pp">
                        <small>od</small>
                        <strong>{min} zł</strong>
                        <small>do {max} zł</small>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>

        <section className="wrap pay" aria-labelledby="wyplaty">
          <h2 id="wyplaty">
            Ubezpieczenie wypłaca
            <small>kwoty w najtańszym wariancie każdego produktu</small>
          </h2>
          {/* Tabela leży na karcie papieru. */}
          <div className="sheet-card">
            <div className="tab" style={cols} role="table" aria-label="Kwoty wypłat w najtańszym wariancie każdego produktu">
              <div role="row">
                <div className="corner" role="presentation" />
                {prices.map(({ product }) => (
                  <div key={product} className="colh" role="columnheader">{PRODUCT_LABELS[product]}</div>
                ))}
              </div>
              {rows.map((row) => (
                <div key={row.key} role="row">
                  <div className="stub" role="rowheader">
                    {row.label}
                    {row.note && <small>{row.note}</small>}
                  </div>
                  {row.values.map((value, i) => (
                    <div key={i} className={`c${value === null ? ' no' : ''}`} role="cell">
                      {value ?? 'nie obejmuje'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
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
