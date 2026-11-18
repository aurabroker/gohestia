'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useCalculatorStore } from '@/store/calculator-store';
import { getVariants } from '@/lib/calculator';
import { ADDONS } from '@/lib/data/premiums';
import { resolveOffer } from '@/lib/offer';
import {
  EMAIL_MAX, MANDATORY_CONSENTS, NAME_MAX, NAME_MIN, NAME_PATTERN,
  OPTIONAL_CONSENTS, PHONE_PATTERN, REGION_MAX, REGION_PATTERN,
} from '@/lib/oferta-schema';
import { TURNSTILE_SITE_KEY } from '@/lib/turnstile-config';
import { getBenefits } from '@/lib/data/benefits';
import { BenefitsTable } from '@/components/benefits-table';

const req = z.literal(true, { message: 'Zaznacz to pole, żeby wysłać zapytanie.' });

// Te same reguły pól stosuje endpoint /api/oferta (lib/oferta-schema.ts).
const nameField = z.string().normalize('NFC').trim()
  .min(NAME_MIN, 'Wpisz co najmniej 2 litery.')
  .max(NAME_MAX, 'Najwyżej 50 znaków.')
  .regex(NAME_PATTERN, 'Użyj tylko liter, spacji, myślnika, apostrofu i kropki.');

const schema = z.object({
  imie:           nameField,
  nazwisko:       nameField,
  email:          z.string().trim().max(EMAIL_MAX, 'Podaj poprawny adres e-mail.').pipe(z.email('Podaj poprawny adres e-mail.')),
  telefon:        z.string().trim().regex(PHONE_PATTERN, 'Podaj numer telefonu: 9–15 cyfr, np. 500 600 700.'),
  agent_region:   z.string().trim()
    .max(REGION_MAX, 'Najwyżej 60 znaków.')
    .regex(REGION_PATTERN, 'Użyj tylko liter, spacji, przecinka, kropki i myślnika.')
    .optional(),
  // Zgody obowiązkowe
  zgoda_1:        req,
  zgoda_2:        req,
  zgoda_3:        req,
  zgoda_4:        req,
  zgoda_5:        req,
  zgoda_6:        req,
  zgoda_9:        req,
  oswiadczenie_1: req,
  oswiadczenie_2: req,
  oswiadczenie_3: req,
  oswiadczenie_4: req,
  // Zgody dobrowolne
  zgoda_7:        z.boolean().optional(),
  zgoda_8:        z.boolean().optional(),
  zgoda_10:       z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const CAPTCHA_REQUIRED_MESSAGE =
  'Dokończ weryfikację antybotową powyżej, a następnie wyślij formularz.';
const ANTI_BOT_FAILED_MESSAGE =
  'Weryfikacja antybotowa nie powiodła się. Wykonaj ją ponownie i wyślij formularz jeszcze raz.';
const SEND_FAILED_MESSAGE =
  'Nie udało się wysłać zapytania. Spróbuj ponownie za chwilę.';
const CAPTCHA_UNAVAILABLE_MESSAGE =
  'Nie udało się wczytać weryfikacji antybotowej. Odśwież stronę i spróbuj ponownie.';


function ConsentRow({ name, required, label, fullText, error, register }: {
  name: string;
  required?: boolean;
  label: string;
  fullText?: string;
  error?: string;
  register: ReturnType<typeof useForm<FormData>>['register'];
}) {
  const [open, setOpen] = useState(false);
  const fullId = `${name}-tresc`;
  const errorId = `${name}-blad`;
  return (
    <div className="cs-row">
      <label className="cs-lab">
        <input
          {...register(name as keyof FormData)}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <span className="mark sq" aria-hidden="true" />
        <span className="cs-txt">
          {label}
          {required && <span className="cs-req">wymagane</span>}
        </span>
      </label>
      {fullText && (
        <div className="cs-more">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={fullId}
            onClick={() => setOpen(v => !v)}
          >
            {open ? 'Zwiń pełną treść' : 'Pokaż pełną treść'}
          </button>
          {open && <div id={fullId} className="cs-full">{fullText}</div>}
        </div>
      )}
      {error && <p id={errorId} role="alert" className="err">{error}</p>}
    </div>
  );
}

export default function PodsumowaniePage() {
  const {
    ageGroup, questionnaireComplete,
    selectedProduct, selectedVariant, addons, setSubmittedEmail,
  } = useCalculatorStore();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  // Token Turnstile żyje tylko w stanie komponentu; serwer weryfikuje go przy wysyłce.
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [captchaMessage, setCaptchaMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  // Blokada drugiego kliknięcia, zanim przycisk zdąży się wyłączyć.
  const inFlight = useRef(false);

  // Etykiety i składka z tej samej funkcji, której używa serwer przy wysyłce maili.
  const offer = ageGroup && selectedProduct && selectedVariant
    ? resolveOffer({ ageGroup, product: selectedProduct, variant: selectedVariant, addons })
    : null;
  const offerAvailable = offer !== null;

  useEffect(() => {
    if (!ageGroup)                    router.replace('/kalkulator/wiek');
    else if (!questionnaireComplete)  router.replace('/kalkulator/ankieta');
    else if (!selectedProduct || !selectedVariant || !offerAvailable) router.replace('/kalkulator/produkt');
  }, [ageGroup, questionnaireComplete, selectedProduct, selectedVariant, offerAvailable, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!ageGroup || !selectedProduct || !selectedVariant || !offer) return null;

  const benefits = getBenefits(ageGroup, selectedProduct, selectedVariant);
  const basePremium = getVariants(ageGroup, selectedProduct).find((v) => v.variant === selectedVariant)?.monthly;

  // Tokeny Turnstile są jednorazowe — po nieudanej próbie widget musi wydać nowy.
  const failAttempt = (message: string) => {
    setTurnstileToken(null);
    turnstileRef.current?.reset();
    setSubmitError(message);
    setSubmitting(false);
    inFlight.current = false;
  };

  const onSubmit = async (data: FormData) => {
    if (inFlight.current) return;
    setSubmitError(null);
    // Bez tokenu nie wysyłamy nic — serwer i tak odrzuciłby takie zgłoszenie.
    if (!turnstileToken) {
      setCaptchaMessage(CAPTCHA_REQUIRED_MESSAGE);
      return;
    }
    setCaptchaMessage(null);
    inFlight.current = true;
    setSubmitting(true);
    try {
      const res = await fetch('/api/oferta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Wysyłamy wyłącznie wybory (bez kwot — składkę liczy serwer), dane
        // kontaktowe, status zgód i token. Odpowiedzi z ankiety zdrowotnej
        // nie opuszczają przeglądarki.
        body: JSON.stringify({
          imie:     data.imie,
          nazwisko: data.nazwisko,
          email:    data.email,
          telefon:  data.telefon,
          region:   data.agent_region || undefined,
          oferta: {
            ageGroup,
            product: selectedProduct,
            variant: selectedVariant,
            addons: {
              mediplan:          addons.mediplan,
              medicalAssistance: addons.medicalAssistance,
              globalDoctors:     addons.globalDoctors,
            },
          },
          zgody: Object.fromEntries(
            [...MANDATORY_CONSENTS, ...OPTIONAL_CONSENTS].map((key) => [key, Boolean(data[key])]),
          ),
          turnstileToken,
        }),
      });
      if (res.ok) {
        // Adres trafia do pamięci (store), nie do adresu URL strony sukcesu.
        setSubmittedEmail(data.email);
        router.push('/kalkulator/sukces');
        return;
      }
      failAttempt(res.status === 403 ? ANTI_BOT_FAILED_MESSAGE : SEND_FAILED_MESSAGE);
    } catch {
      failAttempt(SEND_FAILED_MESSAGE);
    }
  };

  return (
    <div className="of-grid kontakt">
      <div className="k-head">
        <h1>Dane kontaktowe i zgody</h1>
        <p className="of-lead">
          Dane kontaktowe i wybrana konfiguracja oferty zostaną przekazane agentowi
          ubezpieczeniowemu. <strong className="font-semibold">Nie przekazujemy danych medycznych.</strong>
        </p>
      </div>

      {/* Podsumowanie oferty */}
      <aside className="bill" aria-labelledby="h-oferta">
        <h2 id="h-oferta">Twoja oferta</h2>
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
        <details className="full">
          <summary>Pełna tabela świadczeń ({benefits.length} pozycji)</summary>
          <BenefitsTable
            benefits={benefits}
            caption={`Pełna tabela świadczeń: ${offer.productLabel}, wariant ${offer.variantLabel}`}
          />
        </details>
        <p className="bill-n">Szczegóły w OWU (kod ER 01/25). Obowiązuje od 2.06.2025 r.</p>
        <Link href="/kalkulator/produkt" className="back">Zmień ofertę</Link>
      </aside>

      {/* Formularz kontaktowy */}
      <form
        className="k-form"
        noValidate
        onSubmit={(event) => { void handleSubmit(onSubmit)(event); }}
      >
        <section className="sec" aria-labelledby="h-kontakt">
          <h2 id="h-kontakt">Dane kontaktowe</h2>
          <div className="flds two">
            <div>
              <label className="fld-l" htmlFor="f-imie">Imię</label>
              <input
                {...register('imie')}
                id="f-imie"
                className="inp"
                autoComplete="given-name"
                aria-invalid={errors.imie ? true : undefined}
                aria-describedby={errors.imie ? 'f-imie-blad' : undefined}
              />
              {errors.imie && <p id="f-imie-blad" role="alert" className="err">{errors.imie.message}</p>}
            </div>
            <div>
              <label className="fld-l" htmlFor="f-nazwisko">Nazwisko</label>
              <input
                {...register('nazwisko')}
                id="f-nazwisko"
                className="inp"
                autoComplete="family-name"
                aria-invalid={errors.nazwisko ? true : undefined}
                aria-describedby={errors.nazwisko ? 'f-nazwisko-blad' : undefined}
              />
              {errors.nazwisko && <p id="f-nazwisko-blad" role="alert" className="err">{errors.nazwisko.message}</p>}
            </div>
            <div>
              <label className="fld-l" htmlFor="f-email">E-mail</label>
              <input
                {...register('email')}
                id="f-email"
                type="email"
                className="inp"
                autoComplete="email"
                inputMode="email"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'f-email-blad' : undefined}
              />
              {errors.email && <p id="f-email-blad" role="alert" className="err">{errors.email.message}</p>}
            </div>
            <div>
              <label className="fld-l" htmlFor="f-telefon">Telefon</label>
              <input
                {...register('telefon')}
                id="f-telefon"
                type="tel"
                className="inp"
                autoComplete="tel"
                placeholder="+48 500 600 700"
                aria-invalid={errors.telefon ? true : undefined}
                aria-describedby={errors.telefon ? 'f-telefon-blad' : undefined}
              />
              {errors.telefon && <p id="f-telefon-blad" role="alert" className="err">{errors.telefon.message}</p>}
            </div>
            <div>
              <label className="fld-l" htmlFor="f-region">
                Region <small>(opcjonalnie)</small>
              </label>
              <input
                {...register('agent_region')}
                id="f-region"
                className="inp"
                autoComplete="address-level2"
                placeholder="np. Warszawa, Kraków"
                aria-invalid={errors.agent_region ? true : undefined}
                aria-describedby={errors.agent_region ? 'f-region-blad' : undefined}
              />
              {errors.agent_region && <p id="f-region-blad" role="alert" className="err">{errors.agent_region.message}</p>}
            </div>
          </div>
        </section>

        {/* Zgody obowiązkowe */}
        <section className="sec" aria-labelledby="h-zgody">
          <h2 id="h-zgody">Zgody obowiązkowe</h2>
          <p className="hint">Wymagane do objęcia ochroną.</p>
          <div className="cs">
            <ConsentRow
              name="zgoda_1"
              required
              register={register}
              label="Zgoda na objęcie grupowym ubezpieczeniem na życie"
              error={errors.zgoda_1?.message}
              fullText={`Wyrażam zgodę na objęcie mnie grupowym ubezpieczeniem na życie, zawartym przez wskazanego w niniejszym dokumencie Ubezpieczającego z Sopockim Towarzystwem Ubezpieczeń na Życie ERGO Hestia SA, zgodnie z treścią tej umowy i Warunkami Ubezpieczenia, które będą mnie obowiązywały jako Ubezpieczonego. Od wyrażenia zgody na powyższe uzależnia się objęcie ochroną ubezpieczeniową.`}
            />

            <ConsentRow
              name="zgoda_2"
              required
              register={register}
              label="Upoważnienie do uzyskania informacji od NFZ"
              error={errors.zgoda_2?.message}
              fullText={`Upoważniam ERGO Hestię do uzyskiwania, na podstawie art. 38 ust. 8 ustawy z dnia 11 września 2015 r. o działalności ubezpieczeniowej i reasekuracyjnej, od Narodowego Funduszu Zdrowia danych o nazwach i adresach świadczeniodawców, którzy udzielili mi świadczeń opieki zdrowotnej w związku z oceną ryzyka ubezpieczeniowego i weryfikacją podanych przeze mnie danych o moim stanie zdrowia, jak również w związku z wypadkiem lub zdarzeniem losowym, będącym podstawą ustalenia odpowiedzialności oraz wysokości odszkodowania lub świadczenia. Z uwagi na niezbędność niniejszego upoważnienia dla celów należytego wykonania umowy ubezpieczenia, tj. do ustalania odpowiedzialności ERGO Hestii i wypłaty świadczeń należnych z umowy ubezpieczenia powyższe upoważnienie jest nieodwołalne w okresie trwania ochrony ubezpieczeniowej oraz przez 3 lata od daty jej zakończenia i obowiązuje również po mojej śmierci. Od udzielenia niniejszego upoważnienia uzależnia się objęcie ochroną ubezpieczeniową.`}
            />

            <ConsentRow
              name="zgoda_3"
              required
              register={register}
              label="Upoważnienie do uzyskania informacji od podmiotów wykonujących działalność leczniczą"
              error={errors.zgoda_3?.message}
              fullText={`Upoważniam ERGO Hestię na podstawie art. 38 ust. 6 ustawy z dnia 11 września 2015 r. o działalności ubezpieczeniowej i reasekuracyjnej, do uzyskiwania, również po mojej śmierci, od każdego z podmiotów wykonujących działalność leczniczą, które udzielały mi świadczeń zdrowotnych, informacji o okolicznościach związanych z oceną ryzyka ubezpieczeniowego i weryfikacją podanych przeze mnie danych o moim stanie zdrowia, a w przypadku objęcia ochroną ubezpieczeniową, również ustaleniem mojego prawa do świadczenia z zawartej umowy ubezpieczenia i wysokością tego świadczenia. Zakres informacji obejmuje, z wyłączeniem wyników badań genetycznych, informacje o: przyczynach hospitalizacji, wykonywanych w jej trakcie badaniach diagnostycznych i ich wynikach, innych udzielonych świadczeniach zdrowotnych, wynikach leczenia oraz o wynikach sekcji zwłok, jeżeli zostanie przeprowadzona; przyczynach leczenia ambulatoryjnego, wykonywanych w jego trakcie badaniach diagnostycznych i ich wynikach, innych udzielonych świadczeniach zdrowotnych oraz wynikach leczenia; wynikach przeprowadzonych konsultacji; przyczynie śmierci. Z uwagi na niezbędność niniejszego upoważnienia dla celów należytego wykonania umowy ubezpieczenia, tj. do ustalania odpowiedzialności ERGO Hestii i wypłaty świadczeń należnych z umowy ubezpieczenia, powyższe upoważnienie jest nieodwołalne w okresie trwania ochrony ubezpieczeniowej oraz w ciągu 3 lat od daty jej zakończenia i obowiązuje również po mojej śmierci. Od udzielenia niniejszego upoważnienia uzależnia się objęcie ochroną ubezpieczeniową.`}
            />

            <ConsentRow
              name="zgoda_4"
              required
              register={register}
              label="Wniosek o komunikację za pomocą środków porozumiewania się na odległość"
              error={errors.zgoda_4?.message}
              fullText={`Wnioskuję o przesyłanie przez Sopockie Towarzystwo Ubezpieczeń na Życie ERGO Hestię SA korespondencji związanej z wykonywaniem czynności ubezpieczeniowych, w tym doręczenia certyfikatu uczestnictwa, za pomocą środków porozumiewania się na odległość w tym środków komunikacji elektronicznej (telefon, e-mail) na podane przeze mnie dane kontaktowe, a odpowiedzi na złożone reklamacje na wskazany w danych adres e-mail. Od wyrażenia zgody na powyższe uzależnia się objęcie ochroną ubezpieczeniową. Zobowiązuję się do aktualizacji danych.`}
            />

            <ConsentRow
              name="zgoda_5"
              required
              register={register}
              label="Zgoda na udostępnianie przez ERGO Hestię danych osobowych każdemu innemu zakładowi ubezpieczeń"
              error={errors.zgoda_5?.message}
              fullText={`Wyrażam zgodę na udostępnianie przez ERGO Hestię przetwarzanych przez ERGO Hestię moich danych osobowych każdemu innemu zakładowi ubezpieczeń, w zakresie potrzebnym do oceny ryzyka ubezpieczeniowego i weryfikacji podawanych przeze mnie danych, ustalenia mojego prawa do świadczenia z umowy ubezpieczenia i wysokości tego świadczenia, a także do udzielenia posiadanych przez ERGO Hestię informacji o przyczynie mojej śmierci lub informacji niezbędnych do ustalenia mojego prawa do świadczenia i jego wysokości. Od wyrażenia zgody na powyższe uzależnia się objęcie ochroną ubezpieczeniową.`}
            />

            <ConsentRow
              name="zgoda_6"
              required
              register={register}
              label="Zgoda na udostępnianie danych osobowych ERGO Hestii przez każdy inny zakład ubezpieczeń"
              error={errors.zgoda_6?.message}
              fullText={`Wyrażam zgodę na udostępnianie ERGO Hestii moich danych osobowych przetwarzanych przez każdy inny zakład ubezpieczeń, w którym jestem, byłem(am) lub będę ubezpieczony(a) bądź występowałem(am), występuję lub będę występował/a o ubezpieczenie w zakresie potrzebnym do oceny ryzyka ubezpieczeniowego i weryfikacji podawanych przeze mnie danych, ustalenia mojego prawa do świadczenia z umowy ubezpieczenia i wysokości tego świadczenia, a także do udzielenia ERGO Hestii posiadanych przez każdy inny zakład ubezpieczeń informacji o przyczynie mojej śmierci lub informacji niezbędnych do ustalenia mojego prawa do świadczenia i jego wysokości. Od wyrażenia zgody na powyższe uzależnia się objęcie ochroną ubezpieczeniową.`}
            />

            <ConsentRow
              name="zgoda_9"
              required
              register={register}
              label="Zgoda na finansowanie składki przez CPOP — Deklaracja przystąpienia do Grupy Otwartej ERGO Razem"
              error={errors.zgoda_9?.message}
              fullText={`DEKLARACJA FINANSOWANIA SKŁADKI UBEZPIECZENIOWEJ W GRUPIE OTWARTEJ ERGO RAZEM

1. MISJA CENTRUM POMOCY OSOBOM POSZKODOWANYM SP. Z O.O.
Celem społecznej misji Centrum Pomocy Osobom Poszkodowanym Sp. z o.o. z siedzibą w Gdańsku przy ul. Jelitkowskiej 49 (dalej: CPOP) jest kompleksowe wsparcie osób poszkodowanych w wypadkach w procesie rehabilitacji medycznej, społecznej i zawodowej. Spółka zdecydowała się zawrzeć z Sopockim Towarzystwem Ubezpieczeń na Życie ERGO Hestia S.A. umowę grupowego ubezpieczenia na życie ERGO Razem, aby ułatwić uzyskanie ochrony ubezpieczeniowej.

2. CZYM JEST GRUPA OTWARTA ERGO RAZEM
Grupa Otwarta ERGO Razem to Umowa grupowego ubezpieczenia na życie ERGO Razem zawarta w dniu 01.12.2023 r. przez CPOP jako Ubezpieczającym z ERGO Hestią.

3. CO JEST KONIECZNE, ABY ZOSTAĆ OBJĘTYM OCHRONĄ
Aby zostać Ubezpieczonym objętym ochroną w Grupie Otwartej ERGO Razem konieczne jest, oprócz zgody na objęcie ochroną przez ERGO Hestię, również wyrażenie CPOP zgody na finansowanie składki za udzielaną ochronę ubezpieczeniową.

4. DEKLARACJA
Zobowiązuję się wobec Centrum Pomocy Osobom Poszkodowanym Sp. z o.o. z siedzibą w Gdańsku do finansowania składki ubezpieczeniowej za udzielaną mi przez ERGO Hestię ochronę w Grupie Otwartej ERGO Razem, tj. do:
(1) wpłaty pierwszej składki do daty wskazanej w Certyfikacie Uczestnictwa oraz
(2) terminowego wpłacenia drugiej i następnych składek najpóźniej do 15 dnia miesiąca za kolejny miesiąc, na rachunek bankowy podany w Certyfikacie Uczestnictwa.

5. CO SIĘ STANIE W PRZYPADKU NIEOPŁACENIA SKŁADKI
W przypadku nieopłacenia składki w terminie zostanie Pan/Pani poinformowany o braku płatności i obowiązku zapłaty w dodatkowym terminie 7 dni pod rygorem uznania umowy za wypowiedzianą przez CPOP.

6. CZY UBEZPIECZAJĄCY OTRZYMUJE WYNAGRODZENIE
CPOP ani osoby działające na jej rzecz nie otrzymują wynagrodzenia ani innych korzyści w związku z oferowaniem możliwości skorzystania z ochrony.

INFORMACJA O PRZETWARZANIU DANYCH PRZEZ CPOP
Administratorem danych jest Centrum Pomocy Osobom Poszkodowanym Sp. z o.o., 80-342 Gdańsk, ul. Jelitkowska 49, email: ergorazem@cpop.pl. Inspektor Ochrony Danych: iod@cpop.pl. Dane przetwarzane są w celu objęcia ochroną ubezpieczeniową, dochodzenia roszczeń oraz (po wyrażeniu zgody) marketingu bezpośredniego. Masz prawo dostępu, sprostowania, usunięcia danych oraz wniesienia skargi do PUODO. Od wyrażenia zgody na finansowanie składki uzależnia się objęcie ochroną w Grupie Otwartej ERGO Razem.`}
            />

          </div>
        </section>

        {/* Oświadczenia */}
        <section className="sec" aria-labelledby="h-oswiadczenia">
          <h2 id="h-oswiadczenia">Oświadczenia</h2>
          <p className="hint">Dokumenty, których dotyczą oświadczenia (otwierają się w nowej karcie):</p>
          <ul className="docs">
            <li>
              <a href="/dokumenty/owu.pdf" target="_blank" rel="noopener noreferrer">
                Ogólne Warunki Ubezpieczenia ERGO Razem — OWU (PDF)
              </a>
            </li>
            <li>
              <a href="/informacja-o-agencie" target="_blank" rel="noopener noreferrer">
                Informacja o agencie (dystrybutorze)
              </a>
            </li>
          </ul>
          <div className="cs">
            <ConsentRow
              name="oswiadczenie_1"
              required
              register={register}
              label="Oświadczam, że przed przystąpieniem do umowy ubezpieczenia otrzymałem/am Warunki Ubezpieczenia, zapoznałem/am się z ich treścią i w pełni je akceptuję."
              error={errors.oswiadczenie_1?.message}
            />

            <ConsentRow
              name="oswiadczenie_2"
              required
              register={register}
              label="Oświadczam, że przed przystąpieniem do umowy ubezpieczenia nastąpiło zbadanie i określenie moich wymagań oraz potrzeb ubezpieczeniowych."
              error={errors.oswiadczenie_2?.message}
            />

            <ConsentRow
              name="oswiadczenie_3"
              required
              register={register}
              label="Oświadczam, że przed przystąpieniem do umowy ubezpieczenia nastąpiło udostępnienie dokumentu pełnomocnictwa udzielonego dystrybutorowi przez ubezpieczyciela oraz przekazanie wymaganych ustawą o dystrybucji informacji o dystrybutorze."
              error={errors.oswiadczenie_3?.message}
            />

            <ConsentRow
              name="oswiadczenie_4"
              required
              register={register}
              label="Oświadczam, że przed przystąpieniem do umowy ubezpieczenia nastąpiło przekazanie mi w zrozumiałej formie wymaganych ustawowo obiektywnych informacji o proponowanym produkcie ubezpieczeniowym."
              error={errors.oswiadczenie_4?.message}
            />
          </div>
        </section>

        {/* Zgody dobrowolne */}
        <section className="sec" aria-labelledby="h-dobrowolne">
          <h2 id="h-dobrowolne">Zgody dobrowolne</h2>
          <div className="cs">
            <ConsentRow
              name="zgoda_7"
              register={register}
              label="Zgoda na otrzymywanie informacji handlowej drogą elektroniczną (niezbędna do wysłania elektronicznej oferty na e-mail)"
              fullText={`Zgadzam się na otrzymywanie drogą elektroniczną informacji handlowej od Sopockiego Towarzystwa Ubezpieczeń na Życie ERGO Hestia SA w Sopocie, z wykorzystaniem środków porozumiewania się na odległość (telefon, e-mail) przy użyciu podanych przeze mnie danych kontaktowych. Zobowiązuję się do aktualizacji danych. Od wyrażenia zgody na powyższe nie uzależnia się objęcia ochroną ubezpieczeniową.`}
            />

            <ConsentRow
              name="zgoda_8"
              register={register}
              label="Zgoda na prowadzenie działań marketingowych przez STU ERGO Hestia S.A."
              fullText={`Wyrażam zgodę na przetwarzanie moich danych osobowych w celach marketingowych, w tym określenia preferencji i potrzeb ubezpieczeniowych, oraz na przesyłanie informacji handlowych przez Sopockie Towarzystwo Ubezpieczeń ERGO Hestia S.A. w Sopocie z wykorzystaniem:
• środków komunikacji elektronicznej (w szczególności na podany adres e-mail);
• telekomunikacyjnych urządzeń końcowych i automatycznych systemów wywołujących (w szczególności na podany numer telefonu).

Twoją zgodę przekażemy do Sopockiego Towarzystwa Ubezpieczeń ERGO Hestia S.A. w Sopocie. Od wyrażenia zgody nie uzależnia się objęcia ochroną ubezpieczeniową.`}
            />

            <ConsentRow
              name="zgoda_10"
              register={register}
              label="Zgoda dla CPOP na przekazywanie informacji handlowej (dobrowolna)"
              fullText={`Wyrażam zgodę na przekazywanie mi przez Centrum Pomocy Osobom Poszkodowanym sp. z o.o. z siedzibą w Gdańsku na podany przeze mnie adres email informacji handlowej o nowych wariantach ubezpieczenia w Grupie Otwartej ERGO Razem oferowanych przez ERGO Hestię, na podstawie której będę mógł/mogła dokonać zmiany warunków ochrony ubezpieczeniowej. Wyrażoną zgodę mogę cofnąć w każdym czasie i bez podawania przyczyny przesyłając oświadczenie na adres: iod@cpop.pl. Wycofanie zgody nie będzie mieć wpływu na zgodność z prawem przetwarzania przed jej cofnięciem. Zgoda jest dobrowolna — jej brak nie uzależnia objęcia ochroną.`}
            />
          </div>
        </section>

        <section className="sec" aria-label="Wysyłka zapytania">
          <p className="hint">
            Zgody i oświadczenia oznaczone „wymagane” są warunkiem objęcia ochroną ubezpieczeniową.
          </p>

          {/* Weryfikacja antybotowa — token trafia do stanu i jest wysyłany z formularzem */}
          <div className="mt-4 min-h-[65px]">
            <Turnstile
              ref={turnstileRef}
              siteKey={TURNSTILE_SITE_KEY}
              options={{ refreshExpired: 'auto', language: 'pl' }}
              onSuccess={(token) => { setTurnstileToken(token); setCaptchaMessage(null); }}
              onExpire={() => setTurnstileToken(null)}
              onError={() => { setTurnstileToken(null); setCaptchaMessage(CAPTCHA_UNAVAILABLE_MESSAGE); }}
            />
          </div>
          {captchaMessage && <p role="alert" className="err mt-3">{captchaMessage}</p>}
          {submitError && <p role="alert" className="err mt-3">{submitError}</p>}

          <div className="mt-5">
            <button type="submit" disabled={submitting} className="btn">
              {submitting ? 'Wysyłanie…' : 'Wyślij zapytanie do agenta'}
            </button>
          </div>
          <p className="hint mt-3">Agent oddzwoni w ciągu 1–2 dni roboczych.</p>
        </section>
      </form>
    </div>
  );
}