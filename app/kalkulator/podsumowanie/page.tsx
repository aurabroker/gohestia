'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCalculatorStore } from '@/store/calculator-store';
import { calcMonthlyPremium } from '@/lib/calculator';
import { VARIANT_LABELS, PRODUCT_LABELS, ADDONS } from '@/lib/data/premiums';
import { getBenefits } from '@/lib/data/benefits';
import { BenefitsTable } from '@/components/benefits-table';
import type { Variant, ProductType } from '@/types';

const req = z.literal(true, { message: 'Wymagana zgoda' });

const schema = z.object({
  imie:           z.string().min(2, 'Min. 2 znaki').max(50),
  nazwisko:       z.string().min(2, 'Min. 2 znaki').max(50),
  email:          z.string().email('Nieprawidłowy adres email'),
  telefon:        z.string().regex(/^\+?[0-9\s\-]{9,15}$/, 'Nieprawidłowy numer telefonu'),
  agent_region:   z.string().optional(),
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

function ExpandableConsent({ label, required, children }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-xs text-gray-600">
      <span>{required && <strong>* </strong>}{label}</span>
      {' '}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-0.5 text-[#E4002B] hover:underline font-medium"
      >
        {open ? 'zwiń' : 'czytaj całość'}
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (
        <div className="mt-2 rounded-lg bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
          {children}
        </div>
      )}
    </div>
  );
}

function ConsentRow({ name, required, label, fullText, error, register }: {
  name: string;
  required?: boolean;
  label: string;
  fullText?: string;
  error?: string;
  register: ReturnType<typeof useForm<FormData>>['register'];
}) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          {...register(name as keyof FormData)}
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-[#E4002B]"
        />
        {fullText ? (
          <ExpandableConsent label={label} required={required}>
            {fullText}
          </ExpandableConsent>
        ) : (
          <span className="text-xs text-gray-600">
            {required && <strong>* </strong>}{label}
          </span>
        )}
      </label>
      {error && <p className="mt-1 text-xs text-red-600 ml-7">{error}</p>}
    </div>
  );
}

export default function PodsumowaniePage() {
  const {
    ageGroup, birthDate, questionnaireComplete, turnstileVerified,
    selectedProduct, selectedVariant, addons,
  } = useCalculatorStore();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!ageGroup)                    router.replace('/kalkulator/wiek');
    else if (!questionnaireComplete)  router.replace('/kalkulator/ankieta');
    else if (!turnstileVerified)      router.replace('/kalkulator/weryfikacja');
    else if (!selectedProduct || !selectedVariant) router.replace('/kalkulator/produkt');
  }, [ageGroup, questionnaireComplete, turnstileVerified, selectedProduct, selectedVariant, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!ageGroup || !birthDate || !selectedProduct || !selectedVariant) return null;

  const monthly = calcMonthlyPremium(
    ageGroup, selectedProduct, selectedVariant as Variant, addons, birthDate
  );

  const activeAddons: string[] = [];
  if (addons.mediplan)          activeAddons.push(ADDONS.mediplan.label);
  if (addons.medicalAssistance) activeAddons.push(ADDONS.medical_assistance.label);
  if (addons.globalDoctors)     activeAddons.push(ADDONS.global_doctors.label);

  const benefits = getBenefits(ageGroup, selectedProduct as ProductType, selectedVariant);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/oferta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imie:     data.imie,
          nazwisko: data.nazwisko,
          email:    data.email,
          telefon:  data.telefon,
          oferta: {
            ageGroup,
            product:        selectedProduct,
            variant:        selectedVariant,
            addons:         activeAddons,
            monthlyPremium: monthly,
          },
        }),
      });
      if (res.ok) {
        router.push(`/kalkulator/sukces?email=${encodeURIComponent(data.email)}`);
      } else {
        let detail = '';
        try {
          detail = JSON.stringify(await res.json());
        } catch {
          detail = await res.text().catch(() => '');
        }
        console.error('Błąd wysyłki /api/oferta:', res.status, detail);
        alert('Nie udało się wysłać zapytania. Spróbuj ponownie za chwilę.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Podsumowanie oferty */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Twoja oferta</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-500">Produkt</p>
            <p className="font-semibold">{PRODUCT_LABELS[selectedProduct as ProductType]}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Wariant</p>
            <p className="font-semibold">{VARIANT_LABELS[selectedVariant as Variant]}</p>
          </div>
          {activeAddons.length > 0 && (
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Dodatki</p>
              <p className="font-semibold">{activeAddons.join(', ')}</p>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-[#E4002B]/5 border border-[#E4002B]/20 p-4 text-center mb-6">
          <p className="text-sm text-gray-600">Składka miesięczna</p>
          <p className="text-4xl font-bold text-[#E4002B]">{monthly} zł<span className="text-lg font-normal text-gray-500">/mies.</span></p>
        </div>

        <h3 className="font-semibold text-gray-900 mb-3">Pełny zakres świadczeń</h3>
        <div className="mb-4">
          <BenefitsTable benefits={benefits} />
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Szczegóły w OWU (kod ER 01/25). Obowiązuje od 2.06.2025 r.
        </p>
      </section>

      {/* Formularz kontaktowy */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Dane kontaktowe</h2>
        <p className="text-sm text-gray-600 mb-6">
          Dane kontaktowe i wybrana konfiguracja oferty zostaną przekazane agentowi
          ubezpieczeniowemu. <strong>Nie przekazujemy danych medycznych.</strong>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imię *</label>
              <input
                {...register('imie')}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
              />
              {errors.imie && <p className="mt-1 text-xs text-red-600">{errors.imie.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nazwisko *</label>
              <input
                {...register('nazwisko')}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
              />
              {errors.nazwisko && <p className="mt-1 text-xs text-red-600">{errors.nazwisko.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              {...register('email')}
              type="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
            <input
              {...register('telefon')}
              type="tel"
              placeholder="+48 500 600 700"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
            />
            {errors.telefon && <p className="mt-1 text-xs text-red-600">{errors.telefon.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region (opcjonalnie)</label>
            <input
              {...register('agent_region')}
              placeholder="np. Warszawa, Kraków..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
            />
          </div>

          {/* Zgody i oświadczenia obowiązkowe */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4 mt-2">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Zgody obowiązkowe — wymagane do objęcia ochroną
            </p>

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

            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide pt-2">
              Oświadczenia
            </p>

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

          {/* Zgody dobrowolne */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-4">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Zgody dobrowolne
            </p>

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

          <p className="text-xs text-gray-400">* Pola i zgody obowiązkowe wymagane do objęcia ochroną ubezpieczeniową.</p>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#E4002B] py-4 font-semibold text-white hover:bg-[#c00025] transition-colors disabled:opacity-60"
          >
            {submitting ? 'Wysyłanie...' : 'Wyślij zapytanie do agenta →'}
          </button>
        </form>
      </section>
    </div>
  );
}
