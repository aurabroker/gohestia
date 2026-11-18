'use client';
import { useState, useMemo } from 'react';
import { SiteHeader } from '@/components/site-header';
import { PageHero } from '@/components/page-hero';
import { SiteFooter } from '@/components/site-footer';

const illnesses = [
  {
    lp: 1,
    name: "Bakteryjne zapalenie opon mózgowych",
    ubezpieczony_max: false,
    ubezpieczony_komfort: false,
    malzonek: false,
    dziecko: true,
    category: "infekcyjne",
    definition: "Ostra choroba zakaźna wywołana przez bakterie, rozpoznana na podstawie badania płynu mózgowo-rdzeniowego oraz dodatniego posiewu tego płynu, wymagająca leczenia szpitalnego."
  },
  {
    lp: 2,
    name: "Bąblowiec mózgu",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "infekcyjne",
    definition: "Choroba zakaźna spowodowana przez tasiemca bąblowcowego z zajęciem mózgu, wymagająca chirurgicznego usunięcia zmian powstałych w mózgu."
  },
  {
    lp: 3,
    name: "Cholera",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "infekcyjne",
    definition: "Choroba wywołana przez przecinkowce cholery (Vibrio cholerae), potwierdzona charakterystycznym obrazem klinicznym oraz pozytywnym wynikiem badania mikrobiologicznego lub immunologicznego."
  },
  {
    lp: 4,
    name: "Choroba Alzheimera",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "neurologiczne",
    definition: "Postępująca choroba zwyrodnieniowa mózgu z rozlanymi zmianami zanikowymi kory mózgowej. Odpowiedzialność istnieje, gdy: potwierdzone jest trwałe i nieodwracalne uszkodzenie funkcji mózgu, obniżona jest sprawność umysłowa i funkcje poznawcze, a Ubezpieczony wymaga stałego nadzoru osób trzecich."
  },
  {
    lp: 5,
    name: "Choroba Creutzfeldta-Jakoba",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "neurologiczne",
    definition: "Encefalopatia gąbczasta z objawami dysfunkcji mózgu, ciężką postępującą demencją, niekontrolowanymi skurczami mięśni, drżeniem i atetozą. Rozpoznanie potwierdzone przez neurologa."
  },
  {
    lp: 6,
    name: "Choroba Crohna",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "gastroenterologiczne",
    definition: "Przewlekłe nieswoiste zapalenie ziarninujące jelita. Odpowiedzialność dotyczy wyłącznie postaci powikłanej licznymi przetokami, niedrożnością lub perforacją jelita. Rozpoznanie potwierdzone badaniem histologicznym."
  },
  {
    lp: 7,
    name: "Choroba Heinego-Medina",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "infekcyjne",
    definition: "Zakażenie wirusem polio prowadzące do porażenia mięśni kończyn lub dróg oddechowych, utrzymującego się przez co najmniej 3 miesiące. Rozpoznanie potwierdzone przez neurologa."
  },
  {
    lp: 8,
    name: "Choroba Huntingtona (pląsawica Huntingtona)",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "neurologiczne",
    definition: "Postępująca choroba genetyczna OUN z niekontrolowanymi ruchami i postępującym otępieniem. Musi powodować co najmniej jeden z objawów: zaburzenia motoryczne, zaburzenia nastroju lub zaburzenia poznawcze."
  },
  {
    lp: 9,
    name: "Choroba neuronu ruchowego",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "neurologiczne",
    definition: "Postępujące zwyrodnienie dróg korowo-rdzeniowych (SMA, PBP, ALS, PLS). Świadczenie należne, gdy choroba powoduje trwałą i nieodwracalną niezdolność do samodzielnego poruszania się lub spożywania posiłków."
  },
  {
    lp: 10,
    name: "Choroba Parkinsona",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "neurologiczne",
    definition: "Powoli postępująca choroba zwyrodnieniowa OUN. Warunki: nie poddaje się leczeniu farmakologicznemu, ma charakter postępujący i powoduje trwałą niezdolność do samodzielnego poruszania się między pomieszczeniami."
  },
  {
    lp: 11,
    name: "Ciężki uraz głowy (następstwo wypadku)",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "urazowe",
    definition: "Martwica tkanki mózgowej w wyniku urazu, powodująca trwałą i nieodwracalną niezdolność do wykonywania co najmniej jednej z 6 Czynności Dnia Codziennego. Potwierdzone MRI lub CT, ocena po min. 3 miesiącach od urazu."
  },
  {
    lp: 12,
    name: "Cukrzyca typu I",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "metaboliczne",
    definition: "Przewlekłe zaburzenie metabolizmu wynikające z niedoboru insuliny. Potwierdzone przez diabetologa z dowodem konieczności przyjmowania insuliny egzogennej przez co najmniej 3 miesiące."
  },
  {
    lp: 13,
    name: "Dur brzuszny",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "infekcyjne",
    definition: "Wywoływany przez Salmonella typhi. Potwierdzony charakterystycznymi objawami i wynikami badań bakteriologicznych, histopatologicznych lub immunologicznych. Wyłączone bezobjawowe nosicielstwo."
  },
  {
    lp: 14,
    name: "Dystrofia mięśniowa",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: true,
    category: "genetyczne",
    definition: "Genetycznie uwarunkowane miopatie zwyrodnieniowe z osłabieniem i zanikiem mięśni. Świadczenie należne, gdy powoduje trwałą niezdolność do samodzielnego poruszania się między pomieszczeniami."
  },
  {
    lp: 15,
    name: "Gorączka denga",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "infekcyjne",
    definition: "Choroba wywołana wirusem dengi z wysoką gorączką, bólami głowy, mięśni, stawów, wysypką i krwotokami. Rozpoznanie potwierdzone izolacją wirusa, PCR, wykryciem antygenów lub 4-krotnym wzrostem miana przeciwciał IgM/IgG."
  },
  {
    lp: 16,
    name: "Gorączka zachodniego Nilu",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "infekcyjne",
    definition: "Wywołana wirusem zachodniego Nilu, przebiegająca z wysoką gorączką, nudnościami, wymiotami, trudnościami w połykaniu. Rozpoznanie potwierdzone charakterystycznym obrazem klinicznym i poziomem przeciwciał klasy IgM."
  },
  {
    lp: 17,
    name: "Kardiomiopatia",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "kardiologiczne",
    definition: "Wyłącznie pierwotna postać choroby serca. Warunki: klasa IV NYHA i frakcja wyrzutowa lewej komory (EF) poniżej 30% przez co najmniej 3 miesiące. Wyłączone wtórne uszkodzenie serca (nadciśnienie, choroba wieńcowa, wady zastawek)."
  },
  {
    lp: 18,
    name: "Łagodny guz mózgu",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: true,
    category: "onkologiczne",
    definition: "Zagrażający życiu niezłośliwy guz mózgu z objawami wzmożonego ciśnienia śródczaszkowego (obrzęk tarczy nerwu wzrokowego, napady padaczkowe lub ubytki neurologiczne). Wyłączone: torbiele, wady naczyniowe, krwiaki, guzy przysadki."
  },
  {
    lp: 19,
    name: "Łagodny guz rdzenia kręgowego",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "onkologiczne",
    definition: "Niezłośliwy, ale zagrażający życiu nowotwór rdzenia kręgowego. Warunki: potwierdzony MRI/CT, poważne objawy motoryczne lub sensoryczne, wymagający operacji, chemioterapii/radioterapii lub jedynie opieki paliatywnej. Wyłączone naczyniaki."
  },
  {
    lp: 20,
    name: "Malaria",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "infekcyjne",
    definition: "Wywołana przez pierwotniaka z gatunku Plasmodium. Rozpoznana na podstawie charakterystycznych objawów klinicznych, potwierdzona pozytywnymi wynikami badań mikrobiologicznych, mikroskopowych i immunologicznych."
  },
  {
    lp: 21,
    name: "Miastenia",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "neurologiczne",
    definition: "Nabyte autoimmunologiczne zaburzenie przewodnictwa nerwowomięśniowego. Warunki: osłabienie mięśni co najmniej Grupy III wg klinicznego podziału miastenii, potwierdzone przez neurologa."
  },
  {
    lp: 22,
    name: "Neuroborelioza",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: true,
    category: "infekcyjne",
    definition: "Bakteryjna choroba zakaźna przenoszona przez kleszcze. Warunki: konieczność leczenia szpitalnego, trwała i nieodwracalna niezdolność do min. jednej z 6 Czynności Dnia Codziennego. Rozpoznanie potwierdzone przez specjalistę chorób zakaźnych."
  },
  {
    lp: 23,
    name: "Niedokrwistość aplastyczna",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "hematologiczne",
    definition: "Nieodwracalne uszkodzenie szpiku kostnego (niedokrwistość, neutropenia, trombocytopenia). Potwierdzone badaniem szpiku kostnego z co najmniej 2 z 3 warunków: neutrofile ≤500/mm³, retikulocyty ≤20 000/mm³, płytki ≤20 000/mm³."
  },
  {
    lp: 24,
    name: "Niewydolność nerek",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: true,
    dziecko: true,
    category: "nefrologiczne",
    definition: "Końcowe stadium niewydolności nerek – nieodwracalne upośledzenie czynności obu nerek wymagające stałego stosowania dializ lub zabiegu przeszczepienia nerki."
  },
  {
    lp: 25,
    name: "Nowotwór złośliwy",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: true,
    dziecko: true,
    category: "onkologiczne",
    definition: "Każda choroba złośliwa z niekontrolowanym wzrostem komórek. Wyłączone: nowotwory in situ, raki skóry inne niż czerniak naciekający, rak prostaty <T2N0M0, rak brodawkowaty tarczycy <T2N0M0, chłoniak Hodgkina/nieziarniczy <Stopień 2 (Ann Arbor), białaczka bez istotnej niedokrwistości."
  },
  {
    lp: 26,
    name: "Operacja aorty",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: true,
    dziecko: false,
    category: "kardiologiczne",
    definition: "Leczenie operacyjne choroby aorty piersiowej lub brzusznej polegające na wycięciu i chirurgicznej wymianie zmienionego chorobowo odcinka z użyciem przeszczepu. Wyłączone urazowe uszkodzenie aorty."
  },
  {
    lp: 27,
    name: "Operacja mózgu",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "neurologiczne",
    definition: "Operacja mózgu metodą kraniotomii lub laparoskopową w celu leczenia ciężkiej choroby lub następstw urazu, wykonana przez neurochirurga. Wyłączone operacje niewymagające chirurgicznego nacięcia czaszki."
  },
  {
    lp: 28,
    name: "Operacyjne wykonanie pomostów naczyniowych (by-pass)",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: true,
    dziecko: false,
    category: "kardiologiczne",
    definition: "Zabieg kardiochirurgiczny polegający na wytworzeniu pomostów naczyniowych w celu ominięcia zwężonej lub całkowicie zamkniętej co najmniej jednej tętnicy wieńcowej. Wyłączone inne zabiegi na naczyniach wieńcowych, w tym angioplastyka."
  },
  {
    lp: 29,
    name: "Paraliż",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: true,
    dziecko: true,
    category: "neurologiczne",
    definition: "Całkowita i nieodwracalna utrata władzy w co najmniej dwóch kończynach, w wyniku porażenia spowodowanego wypadkiem lub chorobą. Potwierdzone dokumentacją medyczną z co najmniej 3 miesięcy przed zgłoszeniem."
  },
  {
    lp: 30,
    name: "Pierwotne nadciśnienie płucne",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "kardiologiczne",
    definition: "Choroba ze wzrostem ciśnienia w tętnicy płucnej na tle pierwotnych zmian naczyniowych, powikłana istotnym powiększeniem prawej komory serca i niewydolnością krążenia klasy IV wg NYHA."
  },
  {
    lp: 31,
    name: "Piorunujące wirusowe zapalenie wątroby",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: true,
    category: "gastroenterologiczne",
    definition: "Martwica wątroby spowodowana zakażeniem wirusem zapalenia wątroby. Warunki: encefalopatia wątrobowa i żółtaczka, albumina ≤3,5 g/dl, INR >2,2. Potwierdzone wynikiem badania serologicznego."
  },
  {
    lp: 32,
    name: "Poparzenie",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: true,
    dziecko: true,
    category: "urazowe",
    definition: "Oparzenie III stopnia obejmujące co najmniej 15% powierzchni ciała. Klasyfikacja wg tablicy Lunda i Browdera (dzieci do 15 lat) lub Reguły dziewiątek (powyżej 15 lat). Wymagana karta z leczenia szpitalnego."
  },
  {
    lp: 33,
    name: "Posocznica (sepsa)",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: true,
    category: "infekcyjne",
    definition: "Uogólnione zakażenie dwoinką zapalenia opon mózgowo-rdzeniowych (meningokok) lub zakażenie paciorkowcem zapalenia płuc (pneumokok), przebiegające z niewydolnością wielonarządową (co najmniej 2 narządy)."
  },
  {
    lp: 34,
    name: "Postępująca twardzina układowa",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "reumatologiczne",
    definition: "Ogólnoustrojowa choroba naczyń kolagenowych z postępującym włóknieniem skóry, naczyń i narządów trzewnych. Musi zajmować serce, płuco lub nerkę. Wyłączone: twardzina miejscowa, zapalenie powięzi eozynofilowe, zespół CREST."
  },
  {
    lp: 35,
    name: "Przeszczep narządu",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: true,
    dziecko: true,
    category: "operacje",
    definition: "Przeszczepienie jednego lub kilku z następujących narządów/tkanek: serce, płuco, wątroba, trzustka, nerka, jelito cienkie lub szpik kostny. Zabieg wykonany w Polsce lub za granicą na podstawie decyzji uprawnionej instytucji."
  },
  {
    lp: 36,
    name: "Przeszczep zastawki serca",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: true,
    dziecko: false,
    category: "kardiologiczne",
    definition: "Chirurgiczna wymiana jednej lub więcej zastawek serca (aortalna, mitralna, płucna lub trójdzielna). Wyłączone: walwuloplastyka, walwulotomia, komisurotomia."
  },
  {
    lp: 37,
    name: "Przewlekła niewydolność oddechowa",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "pulmonologiczne",
    definition: "Trwała i nieodwracalna utrata czynności płuc. Warunki przez min. 3 miesiące: terapia tlenowa ≥15 godz./dobę, ciśnienie parcjalne tlenu we krwi <55 mmHg/7,33 kPa. Potwierdzone przez pulmonologa."
  },
  {
    lp: 38,
    name: "Schistosomatoza",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "infekcyjne",
    definition: "Wywoływana przez przywry krwi z rodzaju Schistosoma z objawami zapalenia płuc, wątroby lub choroby nerek. Potwierdzona wynikiem badania parazytologicznego, serologicznego, immunologicznego lub histopatologicznego."
  },
  {
    lp: 39,
    name: "Schyłkowa niewydolność wątroby",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "gastroenterologiczne",
    definition: "Trwała i nieodwracalna utrata funkcji wątroby. Warunki: wodobrzusze, albumina ≤3,5 g/dl, INR >2,2. Wyłączone: niewydolność wskutek nadużywania alkoholu lub narkotyków."
  },
  {
    lp: 40,
    name: "Stwardnienie rozsiane",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: true,
    dziecko: false,
    category: "neurologiczne",
    definition: "Rozpoznane przez neurologa z typowymi objawami demielinizacyjnymi i zmianami w MRI. Odpowiedzialność istnieje gdy: zaburzenia neurologiczne nieprzerwanie przez ≥6 miesięcy, lub ≥2 hospitalizacje, lub ≥1 hospitalizacja ze specyficznymi zmianami w PMR i MRI."
  },
  {
    lp: 41,
    name: "Śpiączka",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: true,
    category: "neurologiczne",
    definition: "Stan głębokiej utraty świadomości bez reakcji na bodźce, utrzymujący się nieprzerwanie przez co najmniej 96 godzin, wymagający sprzętu podtrzymującego funkcje życiowe. Lub śpiączka bez sprzętu trwająca co najmniej 2 miesiące."
  },
  {
    lp: 42,
    name: "Tężec",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "infekcyjne",
    definition: "Wywołany neurotoksyną Clostridium tetani, przebiegający w postaci uogólnionej, wymagający leczenia szpitalnego."
  },
  {
    lp: 43,
    name: "Toczniowe zapalenie nerek",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "nefrologiczne",
    definition: "Zapalenie nerek będące następstwem tocznia rumieniowatego układowego. Warunki: postać proliferacyjna (≥klasa III wg ISN/RPS), eGFR <60 ml/min, rozpoznanie potwierdzone przez nefrologa."
  },
  {
    lp: 44,
    name: "Udar mózgu",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: true,
    dziecko: false,
    category: "neurologiczne",
    definition: "Martwica mózgu spowodowana ostrym nieurazowym krwotokiem lub niedokrwieniem z trwałym ubytkiem neurologicznym. Potwierdzone MRI lub CT. Wyłączone: TIA, udar bez określonej daty, oparty tylko na biomarkerach, z objawami wyłącznie węchowymi/przedsionkowymi/wzrokowymi."
  },
  {
    lp: 45,
    name: "Uraz wielonarządowy",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "urazowe",
    definition: "Równoczesne obrażenia różnych części ciała, gdzie co najmniej jedno zagraża życiu. Warunki: wskaźnik ISS ≥16 punktów i co najmniej 2 obszary anatomiczne wg klasyfikacji ISS."
  },
  {
    lp: 46,
    name: "Usunięcie płuca",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "pulmonologiczne",
    definition: "Całkowite chirurgiczne usunięcie całego prawego lub całego lewego płuca w wyniku choroby lub wypadku. Wyłączone usunięcie części płuca."
  },
  {
    lp: 47,
    name: "Utrata kończyn",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: true,
    category: "urazowe",
    definition: "Całkowita i trwała utrata funkcji lub całkowita fizyczna utrata dwóch lub więcej kończyn powyżej nadgarstka lub stawu skokowego w wyniku wypadku lub choroby."
  },
  {
    lp: 48,
    name: "Utrata mowy",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: true,
    category: "neurologiczne",
    definition: "Całkowita i nieodwracalna utrata mowy wskutek choroby lub wypadku, trwająca nieprzerwanie przez co najmniej 12 miesięcy. Świadczenie nie przysługuje, jeśli jakiekolwiek leczenie lub wszczep może przywrócić mowę."
  },
  {
    lp: 49,
    name: "Utrata możliwości samodzielnej egzystencji",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "inne",
    definition: "Stan zdrowia (choroba lub wypadek), gdzie Ubezpieczony przez co najmniej 6 miesięcy nie jest zdolny do wykonania 3 z 6 Czynności Dnia Codziennego. Stan musi mieć charakter trwały."
  },
  {
    lp: 50,
    name: "Utrata słuchu",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: true,
    category: "inne",
    definition: "Nieodwracalna utrata słuchu w obu uszach (próg słyszalności powyżej 90 decybeli) w wyniku choroby lub wypadku. Świadczenie nie przysługuje, jeśli jakakolwiek pomoc lub wszczep może przywrócić słuch."
  },
  {
    lp: 51,
    name: "Utrata wzroku",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: true,
    dziecko: true,
    category: "inne",
    definition: "Potwierdzone klinicznie nieodwracalne zaburzenie widzenia w obu oczach, gdzie skorygowana ostrość wzroku lepszego oka jest mniejsza niż 6/60 lub pole widzenia ograniczone do mniej niż 20° w każdym oku."
  },
  {
    lp: 52,
    name: "Wścieklizna",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "infekcyjne",
    definition: "Wywołana wirusem Lyssavirus rabies, przebiegająca jako ostre zapalenie mózgu i rdzenia. Rozpoznana na podstawie objawów klinicznych i wykrycia wirusa lub przeciwciał. Wymagane leczenie szpitalne."
  },
  {
    lp: 53,
    name: "Zakażenie wirusem HIV w wyniku transfuzji krwi",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: true,
    category: "infekcyjne",
    definition: "Zakażenie HIV wyłącznie w wyniku uzasadnionego medycznie przetaczania krwi po objęciu ochroną. Wyłączone: zakażenia przez aktywność seksualną, dożylne użycie narkotyków, hemofilia lub choroby wymagające cyklicznego przetaczania krwi."
  },
  {
    lp: 54,
    name: "Zapalenie mózgu",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: true,
    category: "infekcyjne",
    definition: "Ostre zapalenie mózgu wywołane przez bakterie lub wirusy z trwałą i nieodwracalną niezdolnością do co najmniej jednej z 6 Czynności Dnia Codziennego lub komunikacji werbalnej, lub wynik testu MMSE ≤15 pkt."
  },
  {
    lp: 55,
    name: "Zawał mięśnia sercowego",
    ubezpieczony_max: true,
    ubezpieczony_komfort: true,
    malzonek: true,
    dziecko: false,
    category: "kardiologiczne",
    definition: "Martwica mięśnia sercowego z powodu niedrożności tętnic wieńcowych. Potwierdzone wzrostem troponiny T/I lub CK-MB oraz co najmniej jednym z: typowe objawy, nowe zmiany EKG, zaburzenia ruchomości ściany, zakrzep w angiografii. Wyłączone: podwyższenie biomarkerów po angiografii/angioplastyce."
  },
  {
    lp: 56,
    name: "Zgorzel gazowa",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "infekcyjne",
    definition: "Ciężkie zakażenie przyranne bakteriami z rodzaju Clostridium (C. perfringens, C. novyi, C. septicum i in.) z wytwarzaniem gazu w tkankach, obrzękiem, martwicą tkanek i objawami toksemii. Wymagane leczenie szpitalne."
  },
  {
    lp: 57,
    name: "Żółta gorączka",
    ubezpieczony_max: false,
    ubezpieczony_komfort: true,
    malzonek: false,
    dziecko: false,
    category: "infekcyjne",
    definition: "Wywołana wirusem z rodziny Flaviviridae. Rozpoznanie na podstawie pobytu w regionie endemicznym, charakterystycznych objawów klinicznych i potwierdzenia wynikami badań wirusologicznych lub immunologicznych."
  }
];

const categories: Record<string, string> = {
  infekcyjne: "Choroby infekcyjne",
  neurologiczne: "Neurologiczne",
  kardiologiczne: "Kardiologiczne",
  onkologiczne: "Onkologiczne",
  gastroenterologiczne: "Gastroenterologiczne",
  urazowe: "Urazowe",
  nefrologiczne: "Nefrologiczne",
  hematologiczne: "Hematologiczne",
  metaboliczne: "Metaboliczne",
  reumatologiczne: "Reumatologiczne",
  genetyczne: "Genetyczne",
  pulmonologiczne: "Pulmonologiczne",
  operacje: "Operacje/Przeszczepy",
  inne: "Inne",
};

type Illness = (typeof illnesses)[number];

// Zakresy w kolejności z warunków ubezpieczenia; `short` to skrót pokazywany na liście.
const SCOPES: { key: "ubezpieczony_max" | "ubezpieczony_komfort" | "malzonek" | "dziecko"; label: string; short?: string }[] = [
  { key: "ubezpieczony_max", label: "Ubezpieczony – Maksymalny", short: "MAX" },
  { key: "ubezpieczony_komfort", label: "Ubezpieczony – Komfort" },
  { key: "malzonek", label: "Małżonek – Rozszerzony", short: "MŁŻ" },
  { key: "dziecko", label: "Dziecko", short: "DZI" },
];

// Kolumny skrótów na szerokim ekranie: stałe miejsce dla każdego zakresu.
const SHORT_COL = ["min-[900px]:col-start-4", "min-[900px]:col-start-5", "min-[900px]:col-start-6"];

function IllnessEntry({ ill }: { ill: Illness }) {
  const shorts = SCOPES.filter(s => s.short);
  return (
    <details className="acc">
      <summary>
        <span className="grid min-w-0 flex-1 grid-cols-[2.1rem_minmax(0,1fr)] gap-x-2 min-[900px]:grid-cols-[2.6rem_minmax(0,1fr)_13rem_2.8rem_2.8rem_2.8rem] min-[900px]:items-baseline min-[900px]:gap-x-3">
          <span className="font-normal tabular-nums text-druk-2">{ill.lp}.</span>
          <span>{ill.name}</span>
          <span className="col-start-2 mt-[2px] flex flex-wrap gap-x-3 text-[16px] font-normal leading-[1.35] min-[900px]:contents">
            <span className="text-druk-2 min-[900px]:col-start-3 min-[900px]:row-start-1">{categories[ill.category]}</span>
            {shorts.map((s, i) => ill[s.key] && (
              <span key={s.key} title={s.label} className={`font-cond font-semibold min-[900px]:row-start-1 ${SHORT_COL[i]}`}>
                {s.short}
              </span>
            ))}
          </span>
        </span>
      </summary>
      <div className="acc-b break-words min-[900px]:pl-[calc(2.6rem+0.75rem)]">
        <div className="bg-blankiet px-[10px] pb-[8px] pt-[4px]">
          <table className="ft-t">
            <tbody>
              {SCOPES.map(s => (
                <tr key={s.key}>
                  <th scope="row">{s.label}</th>
                  <td className={ill[s.key] ? "w-[4.5rem]" : "no w-[4.5rem]"}>
                    <span aria-hidden="true">{ill[s.key] ? "✓" : "–"}</span>
                    <span className="sr-only">{ill[s.key] ? "obejmuje" : "nie obejmuje"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          <strong className="block font-semibold">Definicja ubezpieczeniowa</strong>
          {ill.definition}
        </p>
        <p className="mt-3 text-[16px] leading-[1.4] text-druk-2">
          Źródło: WU ER 01/25, Załącznik 1 – Definicje poważnych zachorowań, poz. {ill.lp}
        </p>
      </div>
    </details>
  );
}

export function KatalogZachorowan() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedScope, setSelectedScope] = useState("all");
  const [sortBy, setSortBy] = useState("lp");

  const filtered = useMemo(() => {
    let result = illnesses.filter(ill => {
      const matchSearch =
        ill.name.toLowerCase().includes(search.toLowerCase()) ||
        ill.definition.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === "all" || ill.category === selectedCategory;
      const matchScope =
        selectedScope === "all" ||
        (selectedScope === "max" && ill.ubezpieczony_max) ||
        (selectedScope === "komfort" && ill.ubezpieczony_komfort) ||
        (selectedScope === "malzonek" && ill.malzonek) ||
        (selectedScope === "dziecko" && ill.dziecko);
      return matchSearch && matchCategory && matchScope;
    });

    if (sortBy === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name, "pl"));
    return result;
  }, [search, selectedCategory, selectedScope, sortBy]);

  const stats = useMemo(() => ({
    total: illnesses.length,
    max: illnesses.filter(i => i.ubezpieczony_max).length,
    komfort: illnesses.filter(i => i.ubezpieczony_komfort).length,
    malzonek: illnesses.filter(i => i.malzonek).length,
    dziecko: illnesses.filter(i => i.dziecko).length,
  }), []);

  // Niebieski druk w polu wyboru dopiero wtedy, gdy odwiedzający coś w nim wybrał.
  const selectClass = (chosen: boolean) => (chosen ? "inp text-[17px]" : "inp text-[17px] text-druk");

  return (
    <>
      <SiteHeader />

      <PageHero
        title="Katalog Poważnych Zachorowań"
        description="Pełna lista poważnych zachorowań objętych ochroną ERGO Razem — z definicjami i zakresem dla każdego wariantu. Obowiązuje od 13.02.2026."
        note="WU/ER 01/25, Załącznik 1"
      />

      <main className="flex-1">
        <section className="sheet">
          <div className="wrap pb-8 min-[900px]:pb-12">
            {/* Stats */}
            <dl className="grid grid-cols-2 gap-[2px] min-[900px]:grid-cols-5">
              {[
                { label: "Wszystkich zachorowań", value: stats.total },
                { label: "Zakres MAKSYMALNY", value: stats.max },
                { label: "Zakres KOMFORT", value: stats.komfort },
                { label: "Małżonek (rozszerzony)", value: stats.malzonek },
                { label: "Dziecko", value: stats.dziecko },
              ].map(s => (
                <div
                  key={s.label}
                  className="flex flex-col-reverse justify-end bg-pole px-3 py-[10px] first:col-span-2 min-[900px]:px-4 min-[900px]:py-3 min-[900px]:first:col-span-1"
                >
                  <dt className="text-[16px] leading-[1.3] text-druk-2">{s.label}</dt>
                  <dd className="font-cond text-[32px] font-bold leading-[1.05] tabular-nums min-[900px]:text-[40px]">{s.value}</dd>
                </div>
              ))}
            </dl>

            {/* Filters */}
            <div role="search" className="mt-6 grid gap-[10px] min-[900px]:grid-cols-2 min-[900px]:gap-3 min-[1280px]:grid-cols-[1.5fr_0.95fr_1.15fr_1fr]">
              <input
                type="search"
                aria-label="Szukaj zachorowania lub słów kluczowych"
                placeholder="Szukaj zachorowania lub słów kluczowych..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="inp text-[17px] placeholder:text-[16px]"
              />
              <select
                aria-label="Kategoria"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className={selectClass(selectedCategory !== "all")}
              >
                <option value="all">Wszystkie kategorie</option>
                {Object.entries(categories).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
              <select
                aria-label="Zakres"
                value={selectedScope}
                onChange={e => setSelectedScope(e.target.value)}
                className={selectClass(selectedScope !== "all")}
              >
                <option value="all">Wszystkie zakresy</option>
                <option value="max">Ubezpieczony – Maksymalny</option>
                <option value="komfort">Ubezpieczony – Komfort</option>
                <option value="malzonek">Małżonek – Rozszerzony</option>
                <option value="dziecko">Dziecko</option>
              </select>
              <select
                aria-label="Sortowanie"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className={selectClass(sortBy !== "lp")}
              >
                <option value="lp">Sortuj: LP (domyślnie)</option>
                <option value="name">Sortuj: Alfabetycznie</option>
              </select>
            </div>
          </div>
        </section>

        <div className="wrap page">
          {/* Results count */}
          <p aria-live="polite">
            Wyświetlono <strong>{filtered.length}</strong> z <strong>{illnesses.length}</strong> zachorowań
          </p>

          {/* Illness list */}
          {filtered.length > 0 && (
            <div className="mt-3 border-b-2 border-druk">
              {filtered.map(ill => (
                <IllnessEntry key={ill.lp} ill={ill} />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <p className="msg mt-3">Nie znaleziono zachorowań pasujących do kryteriów wyszukiwania.</p>
          )}

          <p className="hint mt-8 max-w-none">
            Warunki Grupowego Ubezpieczenia na Życie ERGO Razem, kod ER 01/25, ERGO Hestia S.A.
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
