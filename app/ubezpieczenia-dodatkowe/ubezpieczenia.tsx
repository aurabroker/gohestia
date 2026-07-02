'use client';
import { useState, type ReactNode } from "react";
import Link from "next/link";

const BLUE_MID = "#1565C0";
const BLUE_LIGHT = "#E3F2FD";
const TEAL = "#00695C";
const TEAL_LIGHT = "#E0F2F1";
const GRAY = "#546E7A";
const BORDER = "#CFD8DC";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface BenefitEntry {
  name: string;
  detail: string;
  limit: string;
}

interface BenefitGroup {
  group: string;
  color: string;
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
  accentColor: string;
  lightColor: string;
  icon: string;
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
  accentColor: BLUE_MID,
  lightColor: BLUE_LIGHT,
  icon: "🏥",
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
      color: "#1565C0",
      items: [
        { name: "Telefoniczna informacja medyczna", detail: "Ogólna informacja o stanach nagłych, jednostkach chorobowych, zachowaniach prozdrowotnych, dietach, lekach, szczepieniach, ukąszeniach, wynikach badań, telefonach zaufania, danych placówek medycznych i aptek na terenie Polski. Możliwość telefonicznej konsultacji z lekarzem Centrum Alarmowego (informacje mają charakter ogólny, nie stanowią porady medycznej).", limit: "bez limitu" },
        { name: "Infolinia szpitalna", detail: "Informacje o szpitalach w sieci Centrum Alarmowego: dostępność, specjalności, numery telefonów, średnie ceny usług. Wskazówki co zabrać do szpitala, na co zwrócić uwagę, czego spodziewać się podczas leczenia.", limit: "bez limitu" },
      ]
    },
    {
      group: "Pomoc medyczna (maks. 20 świadczeń na zdarzenie)",
      color: "#00695C",
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
  accentColor: TEAL,
  lightColor: TEAL_LIGHT,
  icon: "🚑",
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
      color: TEAL,
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
      color: "#6A1B9A",
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
      color: "#1565C0",
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

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Section({ title, children, icon }: { title: string; children: ReactNode; icon?: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: 0.8 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function BenefitItem({ item, accentColor }: { item: BenefitEntry; accentColor: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, marginBottom: 4, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px 12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A237E", flex: 1 }}>{item.name}</span>
        <span style={{
          padding: "2px 10px",
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 700,
          background: accentColor + "18",
          color: accentColor,
          whiteSpace: "nowrap",
          border: `1px solid ${accentColor}44`,
        }}>{item.limit}</span>
        <span style={{ fontSize: 14, color: "#90A4AE", transform: open ? "rotate(180deg)" : "none", transition: "0.15s" }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: "4px 12px 12px 12px", borderTop: `1px solid #F5F5F5`, background: "#FAFAFA", fontSize: 13, color: "#37474F", lineHeight: 1.7 }}>
          {item.detail}
        </div>
      )}
    </div>
  );
}

function ProductPanel({ data }: { data: ProductData }) {
  const [tab, setTab] = useState("świadczenia");
  const tabs = ["świadczenia", "limity", "wyłączenia", "jak skorzystać", "definicje"];

  return (
    <div style={{ background: "#fff", border: `2px solid ${data.accentColor}`, borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
      {/* Header */}
      <div style={{ background: data.accentColor, padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>{data.icon}</span>
          <div>
            <h2 style={{ margin: 0, color: "#fff", fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>{data.title}</h2>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{data.subtitle}</span>
          </div>
        </div>
        <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.92)", fontSize: 13, lineHeight: 1.6 }}>{data.summary}</p>
        <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(255,255,255,0.12)", borderRadius: 6, fontSize: 12, color: "#fff" }}>
          <strong>Zdarzenie objęte ochroną:</strong> {data.trigger}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, background: "#F8F9FA", overflowX: "auto" }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "10px 16px",
              border: "none",
              borderBottom: tab === t ? `3px solid ${data.accentColor}` : "3px solid transparent",
              background: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: tab === t ? 700 : 500,
              color: tab === t ? data.accentColor : GRAY,
              whiteSpace: "nowrap",
              transition: "0.12s",
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: "16px 20px" }}>

        {tab === "świadczenia" && (
          <div>
            {data.benefits.map(group => (
              <Section key={group.group} title={group.group} icon="✦">
                {group.items.map(item => (
                  <BenefitItem key={item.name} item={item} accentColor={group.color} />
                ))}
              </Section>
            ))}
          </div>
        )}

        {tab === "limity" && (
          <Section title="Limity i sumy ubezpieczenia" icon="💰">
            <div style={{ display: "grid", gap: 8 }}>
              {data.limits.map(l => (
                <div key={l.label} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "10px 14px",
                  background: "#F8F9FA",
                  borderRadius: 6,
                  border: `1px solid ${BORDER}`,
                  gap: 12,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#1A237E", fontWeight: 600 }}>{l.label}</div>
                    {l.note && <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>{l.note}</div>}
                  </div>
                  <span style={{
                    padding: "3px 12px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 800,
                    background: data.lightColor,
                    color: data.accentColor,
                    whiteSpace: "nowrap",
                  }}>{l.value}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {tab === "wyłączenia" && (
          <Section title="Wyłączenia odpowiedzialności ERGO Hestii" icon="🚫">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {data.exclusions.map((e, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: 10,
                  padding: "8px 12px",
                  background: "#FFF8F8",
                  borderRadius: 6,
                  border: "1px solid #FFCDD2",
                  fontSize: 13,
                  color: "#37474F",
                  lineHeight: 1.6,
                }}>
                  <span style={{ color: "#C62828", fontWeight: 700, minWidth: 16 }}>✕</span>
                  <span>{e}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {tab === "jak skorzystać" && (
          <Section title="Jak skorzystać ze świadczeń" icon="📋">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.procedure.map((step, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: 12,
                  padding: "10px 14px",
                  background: data.lightColor,
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#1A237E",
                  lineHeight: 1.6,
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: data.accentColor, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, flexShrink: 0,
                  }}>{i + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "12px 14px", background: "#FFF9C4", border: "1px solid #F9A825", borderRadius: 8, fontSize: 13, color: "#4E342E" }}>
              ⚠️ <strong>Ważne:</strong> Świadczenia MUSZĄ być zorganizowane przez Centrum Alarmowe. ERGO Hestia nie zwraca kosztów poniesionych samodzielnie bez wcześniejszego uzgodnienia.
            </div>
          </Section>
        )}

        {tab === "definicje" && (
          <Section title="Kluczowe definicje" icon="📖">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.definitions.map(d => (
                <div key={d.term} style={{ padding: "10px 14px", background: "#F8F9FA", borderRadius: 6, border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: data.accentColor, marginBottom: 4 }}>{d.term}</div>
                  <div style={{ fontSize: 13, color: "#37474F", lineHeight: 1.6 }}>{d.def}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

      </div>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export function UbezpieczeniaDodatkowe() {
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: 860, margin: "0 auto", padding: "20px 14px", background: "#F0F4F8", minHeight: "100vh" }}>
      {/* Back link */}
      <Link href="/" style={{ display: "inline-block", marginBottom: 16, fontSize: 13, fontWeight: 600, color: "#1565C0", textDecoration: "none" }}>
        ← Powrót do strony głównej
      </Link>

      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, color: "#1A237E" }}>Ubezpieczenia Dodatkowe</h1>
        <p style={{ margin: 0, fontSize: 13, color: GRAY }}>WU ER 01/25 · ERGO Hestia · Obowiązuje od 13.02.2026</p>
      </div>

      {/* Comparison header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { icon: "🏥", name: "MediPlan", desc: "Specjalistyczna pomoc medyczna", limit: "10 000 zł", color: BLUE_MID, who: "Ubezpieczony", trigger: "Nieszczęśliwy wypadek" },
          { icon: "🚑", name: "Medical Assistance", desc: "Pomoc opiekuńczo-medyczna", limit: "3 000 zł / rok", color: TEAL, who: "Ubezpieczony + współubezpieczeni (rodzina)", trigger: "Wypadek lub nagłe zachorowanie" },
        ].map(p => (
          <div key={p.name} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{p.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: p.color }}>{p.name}</div>
            <div style={{ fontSize: 12, color: GRAY, marginBottom: 8 }}>{p.desc}</div>
            <div style={{ fontSize: 12, color: "#37474F" }}><strong>Limit:</strong> <span style={{ color: p.color, fontWeight: 700 }}>{p.limit}</span></div>
            <div style={{ fontSize: 12, color: "#37474F" }}><strong>Dla kogo:</strong> {p.who}</div>
            <div style={{ fontSize: 12, color: "#37474F" }}><strong>Trigger:</strong> {p.trigger}</div>
          </div>
        ))}
      </div>

      <ProductPanel data={mediplanData} />
      <ProductPanel data={medicalAssistanceData} />

      {/* Key difference */}
      <div style={{ background: "#fff", border: "1px solid #E8EAF6", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: 0.8 }}>⚡ Kluczowe różnice</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12 }}>
          {[
            ["Trigger", "tylko nieszczęśliwy wypadek", "wypadek LUB nagłe zachorowanie"],
            ["Co pokrywa", "konsultacje specjalistów, zabiegi, badania diagnostyczne (RTG, USG, CT, MRI), rehabilitacja", "wizyta lekarza I kontaktu, pielęgniarka, transport, opieka nad dziećmi/zwierzętami, dostawa artykułów"],
            ["Dla kogo", "tylko Ubezpieczony", "Ubezpieczony + współubezpieczeni (rodzina)"],
            ["Suma ubezpieczenia", "10 000 zł (bez odnowienia w roku)", "3 000 zł / rok (odnawia się rocznie)"],
            ["Jak działa", "Centrum Alarmowe organizuje po weryfikacji dokumentów medycznych", "Centrum Alarmowe organizuje po jednym telefonie – od razu"],
            ["Czas reakcji", "3–5 dni roboczych", "natychmiast po kontakcie telefonicznym"],
          ].map(([label, a, b]) => (
            <div key={label} style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "120px 1fr 1fr", gap: 10, padding: "8px 0", borderBottom: `1px solid #F5F5F5` }}>
              <span style={{ fontWeight: 700, color: GRAY, fontSize: 11, textTransform: "uppercase" }}>{label}</span>
              <span style={{ background: BLUE_LIGHT, color: BLUE_MID, padding: "4px 8px", borderRadius: 4 }}><strong>MediPlan:</strong> {a}</span>
              <span style={{ background: TEAL_LIGHT, color: TEAL, padding: "4px 8px", borderRadius: 4 }}><strong>Medical Assist.:</strong> {b}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: 11, color: "#B0BEC5", margin: 0 }}>
        Warunki Grupowego Ubezpieczenia na Życie ERGO Razem · kod ER 01/25 · rozdz. XXVII–XXVIII · ERGO Hestia S.A.
      </p>
    </div>
  );
}
