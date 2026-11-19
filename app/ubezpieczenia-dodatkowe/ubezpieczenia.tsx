'use client';
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface BenefitEntry {
  name: string;
  detail: string;
  limit: string;
}

interface BenefitGroup {
  group: string;
  items: BenefitEntry[];
}

interface LimitEntry {
  label: string;
  value: string;
  note: string;
}

interface Definition {
  term: string;
  def: string;
}

interface ProductData {
  title: string;
  subtitle: string;
  summary: string;
  trigger: string;
  definitions: Definition[];
  limits: LimitEntry[];
  benefits: BenefitGroup[];
  exclusions: string[];
  procedure: string[];
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const mediplanData: ProductData = {
  title: "MediPlan",
  subtitle: "§ 62–66 WU ER 01/25",
  summary: "Organizacja i pokrycie kosztów specjalistycznej pomocy medycznej po nieszczęśliwym wypadku na terytorium Polski. Suma ubezpieczenia: 10 000 zł. Telefon Centrum Alarmowego: 22 522 29 94",
  trigger: "Nieszczęśliwy wypadek skutkujący: pęknięciem/złamaniem kości, zwichnięciem/skręceniem stawu, urazem kręgosłupa, urazem głowy (wstrząśnienie, pęknięcie czaszki), urazem narządów wewnętrznych lub urazem oka.",
  definitions: [
    { term: "Nieszczęśliwy wypadek", def: "Nagłe zdarzenie wywołane przyczyną zewnętrzną, w następstwie którego Ubezpieczony – niezależnie od woli i stanu zdrowia – doznał uszkodzenia ciała skutkującego złamaniem, zwichnięciem, urazem kręgosłupa, głowy, narządów wewnętrznych lub oka." },
    { term: "Centrum Alarmowe", def: "Podmiot organizujący i świadczący usługi assistance w imieniu ERGO Hestii. Tel: 22 522 29 94." },
    { term: "Lekarz prowadzący", def: "Lekarz przydzielony do opieki nad Ubezpieczonym w placówce medycznej, w której leczono następstwa wypadku." },
    { term: "Placówka medyczna", def: "Podmiot prowadzący działalność leczniczą na terytorium Polski. Nie są nią: ośrodki opieki społecznej, hospicja, ośrodki leczenia uzależnień, sanatoria, SPA." },
  ],
  limits: [
    { label: "Suma ubezpieczenia łączna", value: "10 000 zł", note: "" },
    { label: "Maks. liczba świadczeń na jedno zdarzenie", value: "20", note: "Każde zrealizowane świadczenie pomniejsza pula" },
    { label: "Rehabilitacja", value: "maks. 40 zabiegów", note: "Liczone jako 1 świadczenie" },
    { label: "Tomografia komputerowa", value: "1 badanie / zdarzenie", note: "" },
    { label: "Rezonans magnetyczny", value: "1 badanie / zdarzenie", note: "" },
    { label: "Termin zgłoszenia", value: "30 dni", note: "Od daty zdarzenia, tel. 22 522 29 94" },
    { label: "Czas realizacji – specjalista", value: "do 5 dni roboczych", note: "Od decyzji o uznaniu" },
    { label: "Czas realizacji – pozostałe", value: "do 3 dni roboczych", note: "Od decyzji o uznaniu" },
  ],
  benefits: [
    {
      group: "Informacyjno-organizacyjne",
      items: [
        { name: "Telefoniczna informacja medyczna", detail: "Ogólna informacja o stanach nagłych, jednostkach chorobowych, zachowaniach prozdrowotnych, dietach, lekach, szczepieniach, ukąszeniach, wynikach badań, telefonach zaufania, danych placówek medycznych i aptek na terenie Polski. Możliwość telefonicznej konsultacji z lekarzem Centrum Alarmowego (informacje mają charakter ogólny, nie stanowią porady medycznej).", limit: "bez limitu" },
        { name: "Infolinia szpitalna", detail: "Informacje o szpitalach w sieci Centrum Alarmowego: dostępność, specjalności, numery telefonów, średnie ceny usług. Wskazówki co zabrać do szpitala, na co zwrócić uwagę, czego spodziewać się podczas leczenia.", limit: "bez limitu" },
      ]
    },
    {
      group: "Pomoc medyczna (maks. 20 świadczeń na zdarzenie)",
      items: [
        { name: "Konsultacja chirurga", detail: "Centrum Alarmowe zorganizuje i pokryje koszty wizyty na podstawie pisemnego zalecenia lekarza prowadzącego.", limit: "z puli 20 świadczeń" },
        { name: "Konsultacja okulisty", detail: "Centrum Alarmowe zorganizuje i pokryje koszty wizyty na podstawie pisemnego zalecenia lekarza prowadzącego.", limit: "z puli 20 świadczeń" },
        { name: "Konsultacja otolaryngologa", detail: "Centrum Alarmowe zorganizuje i pokryje koszty wizyty na podstawie pisemnego zalecenia lekarza prowadzącego.", limit: "z puli 20 świadczeń" },
        { name: "Konsultacja ortopedy", detail: "Centrum Alarmowe zorganizuje i pokryje koszty wizyty na podstawie pisemnego zalecenia lekarza prowadzącego.", limit: "z puli 20 świadczeń" },
        { name: "Konsultacja kardiologa", detail: "Centrum Alarmowe zorganizuje i pokryje koszty wizyty na podstawie pisemnego zalecenia lekarza prowadzącego.", limit: "z puli 20 świadczeń" },
        { name: "Konsultacja neurologa", detail: "Centrum Alarmowe zorganizuje i pokryje koszty wizyty na podstawie pisemnego zalecenia lekarza prowadzącego.", limit: "z puli 20 świadczeń" },
        { name: "Konsultacja pulmonologa", detail: "Centrum Alarmowe zorganizuje i pokryje koszty wizyty na podstawie pisemnego zalecenia lekarza prowadzącego.", limit: "z puli 20 świadczeń" },
        { name: "Konsultacja lekarza rehabilitacji", detail: "Centrum Alarmowe zorganizuje i pokryje koszty wizyty na podstawie pisemnego zalecenia lekarza prowadzącego.", limit: "z puli 20 świadczeń" },
        { name: "Konsultacja neurochirurga", detail: "Centrum Alarmowe zorganizuje i pokryje koszty wizyty na podstawie pisemnego zalecenia lekarza prowadzącego.", limit: "z puli 20 świadczeń" },
        { name: "Konsultacja psychologa", detail: "Centrum Alarmowe zorganizuje i pokryje koszty wizyty na podstawie pisemnego zalecenia lekarza prowadzącego.", limit: "z puli 20 świadczeń" },
        { name: "Zabiegi ambulatoryjne", detail: "Zabiegi chirurgiczne, laryngologiczne, okulistyczne, ortopedyczne według wykazu procedur medycznych z Załącznika 4 OWU (m.in. nacięcia, drenaże, nastawienie zwichnięć, opatrunki gipsowe, usunięcie ciał obcych).", limit: "z puli 20 świadczeń" },
        { name: "Badania laboratoryjne", detail: "Morfologia krwi obwodowej (kompletna, z rozmazem, z retikulocytami), OB. Na podstawie pisemnego zalecenia lekarza prowadzącego. Traktowane jako 1 świadczenie niezależnie od liczby zleconych badań.", limit: "1 świadczenie z puli 20" },
        { name: "Badania radiologiczne", detail: "Pełen wykaz zdjęć RTG: czaszka, klatka piersiowa, kręgosłup (szyjny, piersiowy, lędźwiowy), miednica, kończyny górne i dolne, biodro, kolano, staw skokowy, stopa i inne. Na podstawie pisemnego zalecenia lekarza prowadzącego.", limit: "z puli 20 świadczeń" },
        { name: "Ultrasonografia", detail: "USG: klatka piersiowa, jama brzuszna, miednica, moszna i jej zawartość, kończyny (naczyniowe i nienaczyniowe). Na podstawie pisemnego zalecenia lekarza prowadzącego.", limit: "z puli 20 świadczeń" },
        { name: "Rehabilitacja", detail: "Wizyta fizjoterapeuty w miejscu pobytu lub wizyta w poradni rehabilitacyjnej. Obejmuje ćwiczenia indywidualne i grupowe, terapię manualną, wyciągi, kinesiotaping, fizykoterapię (diatermia, podczerwień, UV, ultradźwięki, jonoforeza, galwanizacja, elektrostymulacja, prądy TENS, Traberta, Kotza, diadynamiczne, interferencyjne, pole magnetyczne, laseroterapia, krioterapia, okłady).", limit: "maks. 40 zabiegów = 1 świadczenie" },
        { name: "Tomografia komputerowa", detail: "CT głowy/mózgu, oczodołu, tkanek miękkich szyi, klatki piersiowej, kręgosłupa (szyjny, piersiowy, lędźwiowy), miednicy, kończyn, jamy brzusznej – bez kontrastu i z kontrastem. Na podstawie pisemnego zalecenia lekarza prowadzącego.", limit: "1 badanie na zdarzenie" },
        { name: "Rezonans magnetyczny (MRI)", detail: "MRI oczodołu/twarzy/szyi, mózgu, klatki piersiowej, kanału kręgowego (szyjny, piersiowy, lędźwiowy), miednicy, kończyn górnych i dolnych, stawów, jamy brzusznej – bez kontrastu i z kontrastem. Na podstawie pisemnego zalecenia lekarza prowadzącego.", limit: "1 badanie na zdarzenie" },
      ]
    }
  ],
  exclusions: [
    "Obrażenia niemające normalnego związku przyczynowego ze zdarzeniem ubezpieczeniowym",
    "Brak zgody Ubezpieczonego na udostępnienie dokumentacji medycznej (gdy wymagana)",
    "Powódź, huragan, pożar, działania wojenne, zamieszki, strajki, terroryzm, trzęsienie ziemi, energii jądrowej",
    "Działanie w stanie po spożyciu alkoholu, narkotyków, leków psychotropowych",
    "Zaburzenia psychiczne zdiagnozowane lub leczone w ciągu 3 lat przed objęciem ubezpieczeniem",
    "Prowadzenie pojazdu bez wymaganych uprawnień",
    "Uczestnictwo w bójce (z wyłączeniem obrony koniecznej)",
    "Umyślne działanie Ubezpieczonego lub osoby ze wspólnego gospodarstwa domowego",
    "Rażące niedbalstwo Ubezpieczonego",
    "Wyczynowe uprawianie sportu",
    "Amatorskie uprawianie sportów wysokiego ryzyka: powietrznych, motorowych, motorowodnych, speleologii, wspinaczki z sprzętem asekuracyjnym, raftingu, nurkowania ze sprzętem specjalistycznym, heliskiingu, heliboardingu, skoków na gumowej linie",
    "ERGO Hestia nie odpowiada za przebieg i skutki organizowanej terapii, leczenia ani badań",
    "Skutki braku zastosowania się do zaleceń lekarza Centrum Alarmowego",
  ],
  procedure: [
    "Zadzwoń do Centrum Alarmowego pod numer 22 522 29 94 — niezwłocznie, max. 30 dni od zdarzenia",
    "Podaj: imię i nazwisko, PESEL, adres zamieszkania, datę zdarzenia, telefon kontaktowy, opis zdarzenia",
    "Wypełnij i przekaż „Wniosek o realizację świadczeń” z kopią skierowania lekarza prowadzącego i dokumentacją medyczną potwierdzającą związek obrażeń z wypadkiem",
    "Centrum Alarmowe w ciągu 3 dni roboczych poinformuje o decyzji lekarza Centrum Alarmowego",
    "Przy każdym kolejnym świadczeniu: przekaż kopię skierowania/zalecenia lekarza prowadzącego",
    "Świadczenia realizowane są wyłącznie w placówkach należących do sieci Centrum Alarmowego",
    "Koszty pokrywane są bezpośrednio na rzecz placówki medycznej (nie refundacja!)",
    "Dokumenty wysyłaj na adres: pmu.szkody@mondial-assistance.pl",
  ]
};

const medicalAssistanceData: ProductData = {
  title: "Medical Assistance",
  subtitle: "§ 67–71 WU ER 01/25",
  summary: "Organizacja i pokrycie kosztów pomocy opiekuńczo-medycznej po nieszczęśliwym wypadku lub nagłym zachorowaniu na terytorium Polski. Łączny roczny limit: 3 000 zł. Telefon Centrum Alarmowego: (22) 522 29 94.",
  trigger: "Uszkodzenie ciała lub rozstrój zdrowia wskutek nieszczęśliwego wypadku lub nagłego zachorowania (nagłe stany wymagające natychmiastowej pomocy medycznej) na terytorium Polski.",
  definitions: [
    { term: "Nagłe zachorowanie", def: "Stan chorobowy powstały w sposób nagły, wymagający natychmiastowej pomocy medycznej." },
    { term: "Współubezpieczony", def: "Osoba bliska Ubezpieczonego, wspólnie z nim zamieszkująca." },
    { term: "Centrum Alarmowe", def: "Podmiot organizujący i świadczący usługi assistance w imieniu ERGO Hestii. Tel: (22) 522 29 94." },
    { term: "Rok polisowy", def: "Okres od dnia wskazanego w certyfikacie jako data rozpoczęcia ochrony do dnia poprzedzającego pierwszą lub kolejną rocznicę polisy." },
    { term: "Siła wyższa", def: "Zdarzenie zewnętrzne, niemożliwe do przewidzenia, którego skutkom nie można było zapobiec." },
  ],
  limits: [
    { label: "Łączny roczny limit na wszystkie świadczenia", value: "3 000 zł", note: "Dotyczy łącznie Ubezpieczonego i współubezpieczonych" },
    { label: "Wizyta lekarza I kontaktu Centrum Alarmowego", value: "500 zł / rok", note: "" },
    { label: "Dostawa artykułów żywnościowych / higienicznych / leków", value: "300 zł / rok", note: "Koszt zakupu ponosi Ubezpieczony, pokrywane są koszty dostawy" },
    { label: "Transport medyczny", value: "bez limitu", note: "" },
    { label: "Wizyta pielęgniarki", value: "1 000 zł / rok", note: "" },
    { label: "Opieka nad dziećmi lub osobami niesamodzielnymi", value: "450 zł / rok", note: "Po min. 3 dobach hospitalizacji" },
    { label: "Transport opiekuna do dzieci / osób niesamodzielnych", value: "200 zł / rok", note: "Po min. 3 dobach hospitalizacji" },
    { label: "Opieka nad zwierzętami domowymi", value: "300 zł / rok", note: "Po min. 3 dobach hospitalizacji" },
    { label: "Powiadamianie rodziny", value: "bez limitu", note: "" },
    { label: "Infolinia medyczna", value: "bez limitu", note: "" },
    { label: "Opieka domowa po hospitalizacji", value: "400 zł / rok", note: "Po hospitalizacji trwającej powyżej 7 dni" },
    { label: "Organizacja wizyty u lekarza specjalisty", value: "bez limitu", note: "Koszt wizyty ponosi Ubezpieczony" },
    { label: "Wizyta fizykoterapeuty / poradnia rehabilitacyjna", value: "500 zł / rok", note: "Wyłącznie po wypadku" },
    { label: "Dostawa sprzętu rehabilitacyjnego", value: "300 zł / rok", note: "Wyłącznie po wypadku" },
    { label: "Wizyta u psychologa", value: "1 000 zł / rok", note: "Wyłącznie po trwałym inwalidztwie z wypadku" },
    { label: "Serwis Tele-Maluch", value: "bez limitu", note: "Informacje dla rodziców" },
  ],
  benefits: [
    {
      group: "Pomoc medyczna i pielęgniarska",
      items: [
        { name: "Pokrycie kosztów wizyty lekarza I kontaktu Centrum Alarmowego", detail: "Organizacja i pokrycie kosztów pierwszej wizyty lekarza pierwszego kontaktu w miejscu pobytu Ubezpieczonego lub współubezpieczonego (dojazd i honorarium lekarza). Zdarzenie: nieszczęśliwy wypadek lub nagłe zachorowanie.", limit: "500 zł / rok" },
        { name: "Transport medyczny", detail: "Organizacja i pokrycie kosztów transportu Ubezpieczonego lub współubezpieczonego z miejsca pobytu do szpitala lub innej placówki medycznej, zgodnie z zaleceniami lekarza Centrum Alarmowego.", limit: "bez limitu" },
        { name: "Pokrycie kosztów wizyty pielęgniarki", detail: "Organizacja i pokrycie kosztów wizyty pielęgniarki w miejscu pobytu Ubezpieczonego lub współubezpieczonego, zgodnie z zaleceniami lekarza Centrum Alarmowego.", limit: "1 000 zł / rok" },
        { name: "Opieka domowa po hospitalizacji", detail: "Organizacja i pokrycie kosztów opieki domowej po zakończonej hospitalizacji trwającej powyżej 7 dni, zgodnie z zaleceniami lekarza prowadzącego.", limit: "400 zł / rok" },
        { name: "Organizacja wizyty u lekarza specjalisty", detail: "Organizacja wizyty u lekarza specjalisty w terminie wskazanym przez Ubezpieczonego, jeżeli lekarz Centrum Alarmowego zaleci taką wizytę. Koszt wizyty pokrywa Ubezpieczony.", limit: "bez limitu (org.); koszt = Ubezpieczony" },
        { name: "Pokrycie kosztów wizyty fizykoterapeuty / poradni rehabilitacyjnej", detail: "Organizacja i pokrycie kosztów pracy rehabilitanta lub wizyty w poradni, jeżeli po wypadku lekarz zalecił zabiegi rehabilitacyjne w celu przywrócenia lub poprawy sprawności. Dotyczy wyłącznie wypadku.", limit: "500 zł / rok" },
        { name: "Dostawa sprzętu rehabilitacyjnego", detail: "Organizacja i pokrycie kosztów transportu sprzętu rehabilitacyjnego do Ubezpieczonego lub współubezpieczonego, jeżeli wypadek spowodował konieczność użycia takiego sprzętu zgodnie z zaleceniem lekarza.", limit: "300 zł / rok" },
        { name: "Pokrycie kosztów wizyty u psychologa", detail: "Organizacja i pokrycie kosztów wizyty lub wizyt u psychologa, jeżeli wypadek spowodował trwałe inwalidztwo Ubezpieczonego lub współubezpieczonego. Wyłącznie po trwałym inwalidztwie z wypadku.", limit: "1 000 zł / rok" },
      ]
    },
    {
      group: "Pomoc opiekuńcza i logistyczna",
      items: [
        { name: "Dostawa podstawowych artykułów żywnościowych, higienicznych i leków", detail: "Organizacja i pokrycie kosztów dostarczenia leków lub artykułów żywnościowych i higienicznych do miejsca pobytu, gdy Ubezpieczony lub współubezpieczony nie może opuszczać miejsca pobytu wg zaleceń lekarza. Koszt zakupu ponosi Ubezpieczony — pokrywane są jedynie koszty dostawy.", limit: "300 zł / rok" },
        { name: "Opieka nad dziećmi lub osobami niesamodzielnymi", detail: "Organizacja i pokrycie kosztów opieki nad dziećmi lub osobami niesamodzielnymi w miejscu zamieszkania, jeżeli Ubezpieczony lub współubezpieczony przebywa w szpitalu przez co najmniej 3 dni po wypadku i nie ma innej osoby mogącej zapewnić opiekę. Wymagana pisemna zgoda Ubezpieczonego.", limit: "450 zł / rok" },
        { name: "Transport opiekuna do dzieci lub osób niesamodzielnych", detail: "Organizacja i pokrycie kosztów przejazdu (pociąg lub autobus, dla odległości < 20 km — taksówka) w obie strony osoby wyznaczonej do opieki z miejsca jej pobytu do miejsca zamieszkania Ubezpieczonego. Warunek: hospitalizacja min. 3 dni po wypadku.", limit: "200 zł / rok" },
        { name: "Opieka nad zwierzętami domowymi", detail: "Organizacja i pokrycie kosztów opieki nad zwierzętami domowymi w miejscu zamieszkania Ubezpieczonego lub współubezpieczonego, gdy przebywają w szpitalu przez co najmniej 3 dni po wypadku.", limit: "300 zł / rok" },
        { name: "Powiadamianie rodziny", detail: "Centrum Alarmowe, na życzenie Ubezpieczonego lub współubezpieczonego, przekazuje wiadomości między nim a rodziną, gdy przebywa on w szpitalu po wypadku.", limit: "bez limitu" },
      ]
    },
    {
      group: "Informacyjne",
      items: [
        { name: "Infolinia medyczna", detail: "Ogólna informacja o: działaniu leków (stosowanie, odpowiedniki, skutki uboczne, interakcje, ciąża), lokalizacji i godzinach pracy aptek, przychodni i szpitali, badaniach kontrolnych dla grup ryzyka, grupach wsparcia i telefonach zaufania (alkohol, narkotyki, depresja, przemoc domowa, ciężkie choroby), placówkach rehabilitacyjnych i sanatoryjnych.", limit: "bez limitu" },
        { name: "Serwis informacyjny dla rodziców „Tele-Maluch”", detail: "Informacje o szkołach rodzenia, pielęgnacji w czasie ciąży i po porodzie, pielęgnacji noworodka, szczepieniach dzieci, przedszkolach, szkołach, uczelniach, ośrodkach kolonijnych, schroniskach i ośrodkach sportowo-rekreacyjnych na terenie kraju.", limit: "bez limitu" },
      ]
    }
  ],
  exclusions: [
    "Zdarzenia i świadczenia poza terytorium Polski",
    "Koszty poniesione samodzielnie bez wcześniejszego uzgodnienia z Centrum Alarmowym",
    "Działanie po użyciu alkoholu lub w stanie nietrzeźwości",
    "Uszkodzenia trzustki lub wątroby spowodowane spożywaniem alkoholu",
    "Zaburzenia psychiczne, uzależnienia lub choroby układu nerwowego zdiagnozowane lub leczone w ciągu 3 lat przed objęciem ubezpieczeniem",
    "Próba samobójcza Ubezpieczonego lub współubezpieczonego",
    "Działania wojenne, zamieszki, powstania, akty terroryzmu",
    "Choroby zdiagnozowane, leczone lub wymagające stałej kontroli w ciągu 3 lat przed objęciem ubezpieczeniem",
    "Rekonwalescencja (świadczenia opiekuńcze po wyleczeniu)",
    "Schorzenia w trakcie leczenia, które jeszcze nie zostały wyleczone",
  ],
  procedure: [
    "Zadzwoń do Centrum Alarmowego pod numer (22) 522 29 94 — niezwłocznie po zajściu zdarzenia",
    "Centrum Alarmowe zorganizuje odpowiednie świadczenia i pokryje koszty bezpośrednio",
    "Nie ponoś kosztów samodzielnie bez wcześniejszego uzgodnienia z Centrum Alarmowym — brak refundacji poniesionych samodzielnie wydatków",
    "Pamiętaj: sumy ubezpieczenia są wspólne dla Ubezpieczonego i wszystkich współubezpieczonych",
    "Sumy ubezpieczenia odnawiają się z początkiem każdego roku polisowego",
    "Łączny limit roczny dla wszystkich świadczeń wynosi 3 000 zł",
  ]
};

const PRODUCTS = [
  { name: "MediPlan", desc: "Specjalistyczna pomoc medyczna", limit: "10 000 zł", who: "Ubezpieczony", trigger: "Nieszczęśliwy wypadek" },
  { name: "Medical Assistance", desc: "Pomoc opiekuńczo-medyczna", limit: "3 000 zł / rok", who: "Ubezpieczony + współubezpieczeni (rodzina)", trigger: "Wypadek lub nagłe zachorowanie" },
];

const DIFFERENCES = [
  ["Trigger", "tylko nieszczęśliwy wypadek", "wypadek LUB nagłe zachorowanie"],
  ["Co pokrywa", "konsultacje specjalistów, zabiegi, badania diagnostyczne (RTG, USG, CT, MRI), rehabilitacja", "wizyta lekarza I kontaktu, pielęgniarka, transport, opieka nad dziećmi/zwierzętami, dostawa artykułów"],
  ["Dla kogo", "tylko Ubezpieczony", "Ubezpieczony + współubezpieczeni (rodzina)"],
  ["Suma ubezpieczenia", "10 000 zł (bez odnowienia w roku)", "3 000 zł / rok (odnawia się rocznie)"],
  ["Jak działa", "Centrum Alarmowe organizuje po weryfikacji dokumentów medycznych", "Centrum Alarmowe organizuje po jednym telefonie – od razu"],
  ["Czas reakcji", "3–5 dni roboczych", "natychmiast po kontakcie telefonicznym"],
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const TWO_COLS = { "--n": 2 } as CSSProperties;

// Komórka z tekstem (nie z kwotą): zwykła grubość, zdania mogą się łamać.
const TEXT_CELL = "c break-words font-normal";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <h3 className="mb-2">{title}</h3>
      {children}
    </div>
  );
}

function BenefitItem({ item }: { item: BenefitEntry }) {
  return (
    <details className="acc">
      <summary>
        <span className="grid min-w-0 flex-1 gap-x-6 gap-y-1 min-[60rem]:grid-cols-[minmax(0,1fr)_19rem] min-[60rem]:items-baseline">
          <span>{item.name}</span>
          <span className="font-semibold tabular-nums">{item.limit}</span>
        </span>
      </summary>
      <div className="acc-b break-words">{item.detail}</div>
    </details>
  );
}

const TABS = ["świadczenia", "limity", "wyłączenia", "jak skorzystać", "definicje"];

function ProductPanel({ data }: { data: ProductData }) {
  const [tab, setTab] = useState("świadczenia");
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onTabKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const current = TABS.indexOf(tab);
    let next = -1;
    if (e.key === "ArrowRight") next = (current + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (current - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setTab(TABS[next]);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className="psec" aria-labelledby={`${id}-h`}>
      <div className="wrap">
        {/* Nagłówek produktu */}
        <div className="max-w-[44em]">
          <h2 id={`${id}-h`}>{data.title}</h2>
          <p className="label mt-2">{data.subtitle}</p>
          <p className="mt-4">{data.summary}</p>
          <p className="mt-3">
            <strong className="font-semibold">Zdarzenie objęte ochroną:</strong> {data.trigger}
          </p>
        </div>

        <div className="mt-10 max-w-[60rem]">
          {/* Zakładki: rowek w papierze, wybrana zakładka to karta */}
          <div
            role="tablist"
            aria-labelledby={`${id}-h`}
            onKeyDown={onTabKeyDown}
            className="seg"
          >
            {TABS.map((t, i) => {
              const on = tab === t;
              return (
                <button
                  key={t}
                  ref={el => { tabRefs.current[i] = el; }}
                  type="button"
                  role="tab"
                  id={`${id}-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`${id}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              );
            })}
          </div>

          {/* Treść zakładki leży na karcie papieru */}
          <div
            role="tabpanel"
            id={`${id}-panel`}
            aria-labelledby={`${id}-tab-${TABS.indexOf(tab)}`}
            tabIndex={0}
            className="sheet-card mt-4 pt-6"
          >

            {tab === "świadczenia" && (
              <div>
                {data.benefits.map(group => (
                  <Section key={group.group} title={group.group}>
                    <div>
                      {group.items.map(item => (
                        <BenefitItem key={item.name} item={item} />
                      ))}
                    </div>
                  </Section>
                ))}
              </div>
            )}

            {tab === "limity" && (
              <Section title="Limity i sumy ubezpieczenia">
                <table className="ft-t">
                  <tbody>
                    {data.limits.map(l => (
                      <tr key={l.label}>
                        <th scope="row">
                          {l.label}
                          {l.note && <small className="mt-1 block text-md text-muted">{l.note}</small>}
                        </th>
                        <td className="min-[60rem]:w-[22rem]">{l.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            )}

            {tab === "wyłączenia" && (
              <Section title="Wyłączenia odpowiedzialności ERGO Hestii">
                <ul>
                  {data.exclusions.map((e, i) => (
                    <li key={i} className="border-t border-rule py-3">
                      {e}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {tab === "jak skorzystać" && (
              <Section title="Jak skorzystać ze świadczeń">
                <ol>
                  {data.procedure.map((step, i) => (
                    <li key={i} className="grid grid-cols-[2rem_minmax(0,1fr)] border-t border-rule py-3">
                      <span className="font-semibold tabular-nums text-muted">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="msg mt-4">
                  <strong>Ważne:</strong> Świadczenia MUSZĄ być zorganizowane przez Centrum Alarmowe. ERGO Hestia nie zwraca kosztów poniesionych samodzielnie bez wcześniejszego uzgodnienia.
                </p>
              </Section>
            )}

            {tab === "definicje" && (
              <Section title="Kluczowe definicje">
                <dl>
                  {data.definitions.map(d => (
                    <div key={d.term} className="border-t border-rule py-3">
                      <dt className="font-semibold">{d.term}</dt>
                      <dd className="mt-1">{d.def}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export function UbezpieczeniaDodatkowe() {
  return (
    <>
      <SiteHeader />

      <PageHero
        title="Ubezpieczenia Dodatkowe"
        description="MediPlan i Medical Assistance — specjalistyczna pomoc medyczna po wypadku oraz pomoc opiekuńczo-medyczna dla całej rodziny. Obowiązuje od 13.02.2026."
        note="WU ER 01/25"
      />

      <main className="flex-1">
        {/* Porównanie dwóch dodatków na karcie papieru */}
        <section>
          <div className="wrap">
            <div className="sheet-card max-w-[60rem]">
              <div className="tab" style={TWO_COLS} role="table" aria-label="MediPlan i Medical Assistance">
                <div role="row">
                  <div className="corner" role="presentation" />
                  {PRODUCTS.map(p => (
                    <div key={p.name} className="colh" role="columnheader">
                      <b>{p.name}</b>
                      <span>{p.desc}</span>
                    </div>
                  ))}
                </div>
                <div role="row">
                  <div className="stub" role="rowheader">Limit</div>
                  {PRODUCTS.map(p => (
                    <div key={p.name} className="c" role="cell">{p.limit}</div>
                  ))}
                </div>
                <div role="row">
                  <div className="stub" role="rowheader">Dla kogo</div>
                  {PRODUCTS.map(p => (
                    <div key={p.name} className={TEXT_CELL} role="cell">{p.who}</div>
                  ))}
                </div>
                <div role="row">
                  <div className="stub" role="rowheader">Trigger</div>
                  {PRODUCTS.map(p => (
                    <div key={p.name} className={TEXT_CELL} role="cell">{p.trigger}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProductPanel data={mediplanData} />
        <ProductPanel data={medicalAssistanceData} />

        {/* Kluczowe różnice */}
        <section className="psec" aria-labelledby="kluczowe-roznice">
          <div className="wrap">
            <h2 id="kluczowe-roznice">Kluczowe różnice</h2>
            <div className="sheet-card max-w-[60rem]">
              <div className="tab" style={TWO_COLS} role="table" aria-labelledby="kluczowe-roznice">
                <div role="row">
                  <div className="corner" role="presentation" />
                  <div className="colh" role="columnheader"><b>MediPlan</b></div>
                  <div className="colh" role="columnheader"><b>Medical Assist.</b></div>
                </div>
                {DIFFERENCES.map(([label, a, b]) => (
                  <div key={label} role="row">
                    <div className="stub" role="rowheader">{label}</div>
                    <div className={TEXT_CELL} role="cell">{a}</div>
                    <div className={TEXT_CELL} role="cell">{b}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="wrap page">
          <p className="hint max-w-none">
            Warunki Grupowego Ubezpieczenia na Życie ERGO Razem, kod ER 01/25, rozdz. XXVII–XXVIII, ERGO Hestia S.A.
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
