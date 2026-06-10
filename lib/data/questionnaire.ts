export interface QuestionBlock {
  id: string;
  title: string;
  declaration: string;
  conditions: readonly string[];
  exceptions?: readonly string[];
}

export const QUESTIONNAIRE_BLOCKS: QuestionBlock[] = [
  {
    id: 'q1',
    title: 'Choroby z ostatnich 5 lat',
    declaration: 'Oświadczam, że w okresie ostatnich 5 lat nie rozpoznano u mnie, nie byłem(am) leczony(a) ani nie przebywałem(am) pod stałą opieką lekarską z powodu następujących schorzeń:',
    conditions: [
      'choroby niedokrwiennej serca, zawału serca, wady serca, zaburzeń rytmu serca, kardiomiopatii, miażdżycy, tętniaka',
      'cukrzycy (z wyjątkiem podwyższonego poziomu glukozy we krwi w okresie ciąży)',
      'nowotworu złośliwego, choroby krwi (niedokrwistości aplastycznej, białaczki, chłoniaka, szpiczaka, zespołu mielodysplastycznego, niedokrwistości sierpowatokrwinkowej, talasemii, hemofilii lub trombofilii), nowotworu łagodnego mózgu lub rdzenia kręgowego',
      'udaru mózgu, krwotoku śródmózgowego, porażenia (paraliżu), przewlekłej niewydolności oddechowej, niewydolności nerek, marskości wątroby, choroby alkoholowej lub uzależnienia od narkotyków, stwardnienia rozsianego, choroby Parkinsona, choroby Alzheimera, AIDS, zakażenia wirusem HIV lub innej choroby, w zakresie której zalecenie lekarskie obejmowało lub obejmuje wykonanie przeszczepu narządu',
    ],
  },
  {
    id: 'q2',
    title: 'Stan obecny',
    declaration: 'Oświadczam, że obecnie:',
    conditions: [
      'nie zamierzam zasięgać porady lekarskiej, nie oczekuję na wykonanie badań diagnostycznych, nie oczekuję na wyniki takich badań, ani nie zamierzam poddać się leczeniu, w tym leczeniu szpitalnemu z powodu chorób wymienionych w punkcie 1',
      'nie przebywam w szpitalu, hospicjum, domu pomocy społecznej, sanatorium ani na zwolnieniu lekarskim',
      'nie jestem uznany(a) za niezdolnego(ą) do pracy lub służby orzeczeniem właściwego organu, według przepisów o ubezpieczeniu społecznym lub zaopatrzeniu społecznym (nie dotyczy kategorii zdolności do odbywania lub pełnienia czynnej służby określanej podczas kwalifikacji wojskowej oraz orzeczenia WKL w procesie ubiegania się o powołanie do WOT)',
    ],
  },
  {
    id: 'q3',
    title: 'Ostatnie 12 miesięcy',
    declaration: 'Oświadczam, że w ciągu ostatnich 12 miesięcy:',
    conditions: [
      'nie byłem(am) hospitalizowany(a) przez okres dłuższy niż 30 dni',
      'nie przebywałem(am) na zwolnieniu lekarskim przez okres dłuższy niż 30 dni',
    ],
    exceptions: [
      'złamań / zwichnięć / skręceń / stłuczenia kończyn',
      'usunięcia wyrostka robaczkowego',
      'usunięcia migdałków podniebiennych',
      'usunięcia woreczka żółciowego (o ile powodem była kamica)',
      'ciąży (o ile w trakcie nie wystąpiły schorzenia leczone w dniu objęcia ochroną)',
      'porodu',
      'opieki nad osobą trzecią (zasiłek opiekuńczy, zwolnienie np. na dziecko/małżonka)',
      'przeprowadzenia artroskopii',
      'operacji: przepukliny brzusznej/pachwinowej, hemoroidów, zaćmy, przegrody nosa',
    ],
  },
  {
    id: 'q4',
    title: 'Wykluczony zawód',
    declaration: 'Oświadczam, że obecnie nie wykonuję żadnego z wymienionych zawodów:',
    conditions: [
      'górnika',
      'kaskadera',
      'konwojenta wartości pieniężnych',
      'członka personelu statku powietrznego (nie dotyczy personelu licencjonowanych linii lotniczych)',
      'policjanta',
      'ratownika górskiego',
      'ratownika wodnego',
      'robotnika rozbiórki budowli',
      'sportowca zawodowego',
      'strażaka zawodowego (nie dotyczy strażaka OSP)',
      'żołnierza zawodowego (nie dotyczy żołnierza WOT niebędącego żołnierzem zawodowym)',
    ],
  },
  {
    id: 'q5',
    title: 'Czynności niebezpieczne',
    declaration: 'Oświadczam, że obecnie wykonywany zawód nie jest związany z podejmowaniem czynności uznawanych za niebezpieczne:',
    conditions: [
      'praca pod ziemią',
      'praca pod wodą',
      'praca na wysokości powyżej 10 metrów',
      'praca z bronią palną',
      'praca z materiałami wybuchowymi lub radioaktywnymi bądź ich wytwarzanie',
      'praca na platformach wydobywczych lub przy ich obsłudze',
      'praca w służbach specjalnych',
      'wspinaczka wysokogórska',
      'udział w wyścigach/rajdach samochodowych lub motocyklowych',
    ],
  },
];
