'use client';
import { useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useCalculatorStore } from '@/store/calculator-store';
import { getVariants, isGlobalDoctorsEligible } from '@/lib/calculator';
import { resolveOffer } from '@/lib/offer';
import { getBenefits } from '@/lib/data/benefits';
import { ADDONS, PRODUCT_LABELS, VARIANT_LABELS } from '@/lib/data/premiums';
import { AGE_RANGE, PRODUCT_ORDER, PRODUCT_WHO, getPriceRanges, getVariantRows } from '@/lib/benefit-rows';
import { BenefitsTable } from '@/components/benefits-table';

export default function ProduktPage() {
  const {
    ageGroup, birthDate, questionnaireComplete,
    selectedProduct, selectedVariant, addons,
    setProduct, setVariant, toggleAddon,
  } = useCalculatorStore();
  const router = useRouter();

  useEffect(() => {
    if (!ageGroup)                   router.replace('/kalkulator/wiek');
    else if (!questionnaireComplete) router.replace('/kalkulator/ankieta');
  }, [ageGroup, questionnaireComplete, router]);

  if (!ageGroup || !birthDate || !questionnaireComplete) return null;

  const priceRanges = getPriceRanges(ageGroup);
  const variants = selectedProduct ? getVariants(ageGroup, selectedProduct) : [];
  const variantRows = selectedProduct ? getVariantRows(ageGroup, selectedProduct) : [];
  const globalEligible = isGlobalDoctorsEligible(birthDate);

  // Ta sama funkcja liczy składkę w mailach — ekran i mail pokazują tę samą kwotę.
  const offer = selectedProduct && selectedVariant
    ? resolveOffer({ ageGroup, product: selectedProduct, variant: selectedVariant, addons })
    : null;
  const basePremium = variants.find((v) => v.variant === selectedVariant)?.monthly;
  const fullBenefits = selectedProduct && selectedVariant
    ? getBenefits(ageGroup, selectedProduct, selectedVariant)
    : [];

  const selectedCol = variants.findIndex((v) => v.variant === selectedVariant);
  const colClass = (i: number, edge?: 'first' | 'last') =>
    i === selectedCol ? clsx('is-sel', edge) : undefined;

  const goNext = () => {
    if (offer) router.push('/kalkulator/podsumowanie');
  };

  return (
    <div className="of-grid">
      <div>
        <h1>Wybierz ofertę</h1>
        <p className="of-lead">Składki dla wieku {AGE_RANGE[ageGroup]}.</p>

        {/* Produkt */}
        <section className="sec" aria-labelledby="h-produkt">
          <h2 id="h-produkt">Kogo obejmuje ubezpieczenie?</h2>
          <div className="opts row" role="radiogroup" aria-labelledby="h-produkt">
            {PRODUCT_ORDER.map((product) => {
              const range = priceRanges.find((r) => r.product === product)!;
              const on = selectedProduct === product;
              return (
                <label key={product} className={clsx('opt', on && 'is-on')}>
                  <input
                    type="radio"
                    name="produkt"
                    checked={on}
                    onChange={() => setProduct(product)}
                  />
                  <span className="mark" aria-hidden="true" />
                  <span className="opt-t">
                    <b>{PRODUCT_LABELS[product]}</b>
                    <span>{PRODUCT_WHO[product]}</span>
                  </span>
                  <span className="opt-p"><small>od </small>{range.min} zł</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Wariant */}
        {selectedProduct && (
          <section className="sec" aria-labelledby="h-wariant">
            <h2 id="h-wariant">Który wariant?</h2>
            <p className="hint">
              Warianty różnią się składką i wysokością wypłat. Poniżej tylko te kwoty, które są różne.
            </p>
            <div
              className={clsx('tab vt', variants.length >= 4 && 'n4')}
              style={{ '--n': variants.length } as CSSProperties}
              role="table"
              aria-label={`Warianty produktu ${PRODUCT_LABELS[selectedProduct]}`}
            >
              <div role="row">
                <div className="corner" role="presentation" />
                {variants.map((v, i) => (
                  <label
                    key={v.variant}
                    role="columnheader"
                    className={clsx('c vh', i === selectedCol && 'is-on', colClass(i, 'first'))}
                  >
                    <input
                      type="radio"
                      name="wariant"
                      checked={i === selectedCol}
                      onChange={() => setVariant(v.variant)}
                    />
                    <span className="mark" aria-hidden="true" />
                    <b>{VARIANT_LABELS[v.variant]}</b>
                  </label>
                ))}
              </div>
              <div role="row">
                <div className="stub" role="rowheader">Płacisz miesięcznie</div>
                {variants.map((v, i) => (
                  <div
                    key={v.variant}
                    role="cell"
                    data-v={v.variant}
                    onClick={() => setVariant(v.variant)}
                    className={clsx('c vp', colClass(i, variantRows.length === 0 ? 'last' : undefined))}
                  >
                    {v.monthly} zł
                  </div>
                ))}
              </div>
              {variantRows.length > 0 && (
                <div role="row">
                  <div className="stub grp" role="rowheader">Ubezpieczenie wypłaca</div>
                  {variants.map((v, i) => (
                    <div key={v.variant} role="presentation" className={clsx('sp', colClass(i))} />
                  ))}
                </div>
              )}
              {variantRows.map((row, r) => (
                <div key={row.key} role="row">
                  <div className="stub" role="rowheader">
                    {row.label}
                    {row.note && <small>{row.note}</small>}
                  </div>
                  {row.values.map((value, i) => (
                    <div
                      key={variants[i].variant}
                      role="cell"
                      data-v={variants[i].variant}
                      onClick={() => setVariant(variants[i].variant)}
                      className={clsx(
                        'c',
                        value === null && 'no',
                        colClass(i, r === variantRows.length - 1 ? 'last' : undefined),
                      )}
                    >
                      {value ?? 'nie obejmuje'}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {selectedVariant && (
              <details className="full">
                <summary>
                  Pełna tabela świadczeń: {PRODUCT_LABELS[selectedProduct]}, wariant{' '}
                  {VARIANT_LABELS[selectedVariant]} ({fullBenefits.length} pozycji)
                </summary>
                <BenefitsTable
                  benefits={fullBenefits}
                  caption={`Pełna tabela świadczeń: ${PRODUCT_LABELS[selectedProduct]}, wariant ${VARIANT_LABELS[selectedVariant]}`}
                />
              </details>
            )}
          </section>
        )}

        {/* Dodatki */}
        {selectedVariant && (
          <section className="sec" aria-labelledby="h-dodatki">
            <h2 id="h-dodatki">Dodatki</h2>
            <p className="hint">Pakiety medyczne, które możesz dołączyć do każdego wariantu.</p>
            <div className="opts">
              <label className={clsx('opt', addons.mediplan && 'is-on')}>
                <input type="checkbox" checked={addons.mediplan} onChange={() => toggleAddon('mediplan')} />
                <span className="mark sq" aria-hidden="true" />
                <span className="opt-t">
                  <b>{ADDONS.mediplan.label}</b>
                  <span>Dostęp do lekarzy specjalistów, badań i rehabilitacji</span>
                </span>
                <span className="opt-p">+{ADDONS.mediplan.monthly} zł</span>
              </label>
              <label className={clsx('opt', addons.medicalAssistance && 'is-on')}>
                <input
                  type="checkbox"
                  checked={addons.medicalAssistance}
                  onChange={() => toggleAddon('medicalAssistance')}
                />
                <span className="mark sq" aria-hidden="true" />
                <span className="opt-t">
                  <b>{ADDONS.medical_assistance.label}</b>
                  <span>Pomoc medyczna 24/7, transport medyczny, wizyty domowe</span>
                </span>
                <span className="opt-p">+{ADDONS.medical_assistance.monthly} zł</span>
              </label>
              <label className={clsx('opt', addons.globalDoctors && globalEligible && 'is-on', !globalEligible && 'is-dis')}>
                <input
                  type="checkbox"
                  checked={addons.globalDoctors && globalEligible}
                  disabled={!globalEligible}
                  onChange={() => toggleAddon('globalDoctors')}
                />
                <span className="mark sq" aria-hidden="true" />
                <span className="opt-t">
                  <b>{ADDONS.global_doctors.label}</b>
                  <span>
                    {globalEligible
                      ? `Dostęp do lekarzy na całym świecie. Składka zależy od wieku, agent poda ją przy wycenie. Dostępne do ${ADDONS.global_doctors.maxAge}. roku życia.`
                      : `Niedostępne dla osób powyżej ${ADDONS.global_doctors.maxAge} r.ż.`}
                  </span>
                </span>
                <span className="opt-p txt">{globalEligible ? 'wycena indywidualna' : 'niedostępne'}</span>
              </label>
            </div>
            <p className="hint mt-3">
              Co obejmują dodatki:{' '}
              <Link href="/ubezpieczenia-dodatkowe" target="_blank">MediPlan i Medical Assistance</Link>,{' '}
              <Link href="/global-doctors" target="_blank">Global Doctors</Link> (otwierają się w nowej karcie).
            </p>
          </section>
        )}
      </div>

      {/* Składka */}
      <aside className="bill" aria-labelledby="h-skladka">
        <h2 id="h-skladka">Twoja składka</h2>
        {offer && basePremium !== undefined ? (
          <div aria-live="polite">
            <dl className="bill-l">
              <div>
                <dt>{offer.productLabel}, wariant {offer.variantLabel}</dt>
                <dd>{basePremium} zł</dd>
              </div>
              {addons.mediplan && (
                <div>
                  <dt>{ADDONS.mediplan.label}</dt>
                  <dd>{ADDONS.mediplan.monthly} zł</dd>
                </div>
              )}
              {addons.medicalAssistance && (
                <div>
                  <dt>{ADDONS.medical_assistance.label}</dt>
                  <dd>{ADDONS.medical_assistance.monthly} zł</dd>
                </div>
              )}
              {addons.globalDoctors && (
                <div>
                  <dt>{ADDONS.global_doctors.label}</dt>
                  <dd className="txt">wycena indywidualna</dd>
                </div>
              )}
            </dl>
            <p className="bill-sum">
              <span>Razem miesięcznie</span>
              <strong>{offer.monthlyPremium} zł</strong>
            </p>
            {addons.globalDoctors && (
              <p className="bill-x">Składkę za Global Doctors agent poda osobno.</p>
            )}
          </div>
        ) : (
          <p className="bill-empty">
            {selectedProduct ? 'Wybierz wariant, a pokażemy składkę.' : 'Wybierz produkt i wariant, a pokażemy składkę.'}
          </p>
        )}
        <button type="button" className="btn full-w" aria-disabled={!offer} onClick={goNext}>
          Dalej: dane kontaktowe
        </button>
        <p className="bill-n">
          Niczego jeszcze nie wysyłasz. Zapytanie do agenta wyślesz w następnym kroku.
        </p>
        <Link href="/kalkulator/ankieta" className="back">Wróć do pytań o zdrowie</Link>
      </aside>
    </div>
  );
}
