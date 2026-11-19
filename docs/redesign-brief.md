# Brief redesignu: kalkulator ERGO Razem

Stan na 18.11.2026, commit `450ac52` na gałęzi `claude/admin-panel-u620pe`. Gałąź różni się od `main` jedną zmianą w mailu do agenta; interfejs jest identyczny.

Ten plik jest materiałem wejściowym dla sesji, która ma przeprojektować serwis z użyciem skilla `hallmark`. Powstał w sesji, w której tego skilla nie było, dlatego jego części mają różną wagę:

- **Sekcje 1–6 to fakty i ograniczenia.** Sprawdzone w kodzie i na lokalnie uruchomionej aplikacji. Obowiązują niezależnie od wybranego kierunku wizualnego.
- **Sekcja 7 to propozycja kierunku.** Można ją zmienić albo odrzucić. Jeśli `hallmark` ma własny proces (audyt, warianty do wyboru), przeprowadź go normalnie, a ten plik potraktuj jako dane.

Audyt bezpieczeństwa z tej samej sesji jest w osobnym pliku, poza repozytorium. Redesign go nie wymaga.

## 1. Cel

Właściciel poprosił o redesign, który nie wygląda jak szablon wygenerowany przez AI. To jedyne wymaganie podane wprost.

Drugi cel dopisała sesja audytowa na podstawie tego, co zobaczyła: więcej osób powinno dochodzić od strony głównej do przycisku „Wyślij zapytanie do agenta", zwłaszcza na telefonie. Kilka opisanych niżej problemów utrudnia to niezależnie od estetyki.

Proponowane kryteria odbioru:

- błędy z sekcji 5.1 są naprawione,
- na telefonie (390 px) cena dla podanego wieku jest widoczna na stronie głównej bez rozwijania czegokolwiek,
- na ekranie wyboru wariantu widać, czym warianty różnią się poza ceną,
- kolor ma jedno znaczenie w całym serwisie, a emoji nie pełnią roli ikon,
- teksty prawne i liczby są nietknięte (sekcja 6).

## 2. Co to za serwis

Kalkulator grupowego ubezpieczenia na życie ERGO Razem (Grupa Otwarta, OWU kod ER 01/25). Prowadzi go Aura Expert sp. z o.o., agent ERGO Hestii. To strona agenta, a nie ubezpieczyciela.

Odwiedzający ma 18–65 lat. Sprawdza cenę, składa oświadczenie o stanie zdrowia, wybiera produkt i wariant, zostawia dane kontaktowe. Agent oddzwania w ciągu 1–2 dni roboczych. Nie ma kont, płatności ani panelu administracyjnego; zapytanie trafia do agenta mailem.

Produkty: Dla Mnie, Dla Nas, Dla Rodziny. Warianty: Podstawowy, Rozszerzony, Komfort, Premium, Prestiż (dostępność zależy od grupy wiekowej i produktu). Grupy wiekowe: A1 (18–53), A2 (54–59), B (60–65). Dodatki: MediPlan (+9 zł), Medical Assistance (+6 zł), Global Doctors (wycena indywidualna, do 63 r.ż.).

## 3. Stack i mapa plików

Next.js 16 (App Router), React 19, Tailwind 4, zustand, react-hook-form z zod, ikony lucide-react. Hosting: Cloudflare przez OpenNext. **Push do `main` automatycznie wdraża na produkcję** (`.github/workflows/deploy.yml`), więc pracuj na gałęzi.

`AGENTS.md` każe czytać dokumentację w `node_modules/next/dist/docs/`. W tej instalacji taki katalog nie istnieje, więc trzymaj się konwencji widocznych w kodzie.

| Ścieżka | Co tam jest |
| --- | --- |
| `app/page.tsx` | Strona główna: hero, kafelki, akordeony produktów, „Jak to działa", kafelki z linkami, dolne CTA |
| `app/kalkulator/layout.tsx` | Osobny nagłówek kalkulatora i stepper |
| `app/kalkulator/wiek`, `ankieta`, `weryfikacja`, `produkt`, `podsumowanie`, `sukces` | Kolejne ekrany ścieżki |
| `app/wykluczenie/wiek`, `zdrowie` | Ekrany dla osób, które nie mogą przystąpić |
| `app/faq`, `katalog-zachorowan`, `ubezpieczenia-dodatkowe`, `global-doctors`, `zglos-roszczenie`, `informacja-o-agencie` | Strony treściowe, wspólny `components/page-hero.tsx` |
| `app/rodo`, `polityka-prywatnosci`, `regulamin` | Strony prawne |
| `components/` | `site-header`, `site-footer`, `stepper`, `product-card`, `addon-toggle`, `premium-calculator`, `benefits-table`, `variants-comparison-table`, `questionnaire/*`, `privacy-notice`, szablony maili w `email/` |
| `lib/data/premiums.ts` | Składki dla każdej grupy wiekowej, produktu i wariantu |
| `lib/data/benefits.ts` | Kwoty świadczeń; `getBenefits(ageGroup, product, variant)` |
| `lib/data/coverage.ts` | Listy nazw świadczeń używane na kartach wariantów |
| `lib/data/questionnaire.ts` | Treść pięciu oświadczeń zdrowotnych |
| `store/calculator-store.ts` | Stan ścieżki w pamięci, celowo bez zapisu do `localStorage` |
| `app/globals.css` | Zmienne kolorów, w tym blok trybu ciemnego |
| `public/` | Logo `ergo-hestia-logo.jpg`, zdjęcia `girl.jpg`, `para.jpg`, `family.jpg`, wideo `hero-family.mp4` (5,7 MB) |

## 4. Obecna ścieżka użytkownika

1. `/` — strona główna, wszystkie przyciski prowadzą do kroku 2.
2. `/kalkulator/wiek` — data urodzenia. Poza zakresem 18–65 lat: `/wykluczenie/wiek`.
3. `/kalkulator/ankieta` — pięć oświadczeń zdrowotnych, każde z przyciskami „NIE (spełniam warunek)" i „TAK". Jedno „TAK" otwiera okno z informacją o braku możliwości przystąpienia i linkiem do `/wykluczenie/zdrowie`.
4. `/kalkulator/weryfikacja` — sam widżet Cloudflare Turnstile.
5. `/kalkulator/produkt` — produkt, wariant, dodatki, łączna składka.
6. `/kalkulator/podsumowanie` — pełna tabela świadczeń, dane kontaktowe, 14 zgód i oświadczeń, wysyłka.
7. `/kalkulator/sukces` — potwierdzenie.

Każdy ekran kalkulatora przekierowuje wstecz, jeśli w pamięci brakuje stanu z poprzednich kroków. Odświeżenie strony zeruje ścieżkę.

## 5. Zweryfikowane problemy

Sprawdzone na buildzie produkcyjnym uruchomionym lokalnie, na zrzutach 1440×900 i 390×844, o ile nie zaznaczono inaczej.

### 5.1 Błędy

**Dodatki są na ekranie oferty liczone podwójnie.** Dla wariantu za 103 zł po włączeniu MediPlan (9 zł) i Medical Assistance (6 zł) ekran oferty pokazuje 133 zł, a podsumowanie i mail 118 zł. Przyczyna: `app/kalkulator/produkt/page.tsx:40-42` liczy składkę razem z dodatkami (`lib/calculator.ts:26-27`) i przekazuje ją jako `base` do `components/premium-calculator.tsx`, który w liniach 18–20 dolicza dodatki drugi raz. Poprawna jest kwota z podsumowania.

**Tryb ciemny psuje czytelność.** Przy systemowym trybie ciemnym na podsumowaniu nazwa produktu i wariantu jest prawie niewidoczna (jasny tekst na białej karcie), a tło stron kalkulatora robi się czarne. Przyczyna: `app/globals.css:16-21` ustawia w trybie ciemnym `--foreground: #ededed` i `--background: #0a0a0a`, a `body` ich używa (linie 24–25). Elementy bez własnej klasy koloru dziedziczą jasny tekst, na przykład `app/kalkulator/podsumowanie/page.tsx:190`, `194`, `199`. Serwis nie ma zaprojektowanego trybu ciemnego, więc najprostsza poprawka to usunięcie tego bloku. Innych miejsc z dziedziczonym kolorem nie szukano systematycznie.

**Przełącznik dodatku reaguje tylko na sam suwak.** W `components/addon-toggle.tsx` cały wiersz ma kursor wskaźnika i podświetlenie, ale kliknięcie w nazwę, opis albo cenę nic nie robi (sprawdzone). Suwak to `div` z `onClick`, bez roli i bez obsługi klawiatury, więc z klawiatury i czytnika ekranu dodatku nie da się włączyć.

### 5.2 Problemy użyteczności

**Karty wariantów nie pokazują różnic.** Każda karta ma te same cztery punkty: Śmierć ubezpieczonego, Śmierć w wyniku NW, Trwała niezdolność do pracy, Poważne zachorowanie. Wariant za 78 zł i za 194 zł wygląda więc identycznie poza ceną. `components/product-card.tsx:23` bierze pierwsze cztery pozycje z `COVERAGE`, a te są takie same dla wszystkich pięciu wariantów. Kwoty, które faktycznie się różnią, są w `lib/data/benefits.ts`.

**Na telefonie nie widać ceny.** Liczba „od 57 zł" istnieje tylko w nakładce na wideo, a panel wideo jest ukryty poniżej 768 px (`app/page.tsx:125`). Żeby zobaczyć jakąkolwiek składkę, trzeba przewinąć do sekcji produktów, wpisać wiek w małe pole (`app/page.tsx:183-201`) i rozwinąć akordeon.

**Strona główna jest długa.** Przy 390 px ma 6058 px wysokości, czyli około siedmiu ekranów. Dwie sekcje kafelków (linie 153–171 i 295–387) powtarzają informacje dostępne w tabelach i w stopce.

**Trzy nazwy na jedną akcję.** „Złóż wniosek" (`components/site-header.tsx:25`, `app/page.tsx:400`), „Oblicz składkę" (`app/page.tsx:114`), „Oblicz swoją składkę" (`:261`) prowadzą w to samo miejsce. Na końcu ścieżki przycisk nazywa się „Wyślij zapytanie do agenta" (`app/kalkulator/podsumowanie/page.tsx:442`). Żaden wniosek nie jest składany.

**Stepper ma sześć kroków, z czego dwa nie są zadaniami użytkownika.** „Weryfikacja" to sam captcha, „Gotowe" to potwierdzenie (`components/stepper.tsx:5-12`). Poniżej 640 px etykiety znikają (linia 38) i zostają same ponumerowane kółka.

**Podsumowanie jest ścianą.** Przy 390 px ma 4381 px. Przed formularzem kontaktowym stoi pełna tabela świadczeń (około 35 wierszy), a po nim 14 pól wyboru: 11 obowiązkowych i 3 dobrowolne, każde z rozwijaną treścią.

**Dwa różne nagłówki.** Strona główna i strony treściowe używają `components/site-header.tsx` (szerokość `max-w-5xl`, logo jest linkiem). Kalkulator ma własny nagłówek w `app/kalkulator/layout.tsx:7-23` (`max-w-3xl`, logo nie jest linkiem), więc z kalkulatora nie ma powrotu na stronę główną.

**Do sprawdzenia z właścicielem: „od 57 zł".** Najniższa składka w `lib/data/premiums.ts` to 50 zł (grupa A2, Dla Mnie, Podstawowy). 57 zł to najniższa składka w grupie A1.

### 5.3 Co wygląda na szablon

- Hero: różowy gradient, etykieta w kształcie pigułki nad nagłówkiem, nagłówek w dwóch kolorach, dwa przyciski ze strzałkami, wideo stockowe ze statystykami na ciemnym gradiencie (`app/page.tsx:96-151`). Ten sam gradient i pigułka wracają w `components/page-hero.tsx` i w dolnym CTA.
- Sześć jednakowych kafelków z ikoną w kolorowym kwadracie i ogólnym hasłem: „Ochrona 24/7", „Transparentne OWU" (`app/page.tsx:56-63`, `153-171`). Niżej cztery kolejne kafelki tego samego kroju (`295-387`).
- Trzy panele produktów w pastelach spoza marki: niebieski, różowy, zielony, ze zdjęciami stockowymi na zmianę z lewej i z prawej oraz „pigułkami" z ptaszkiem (`app/page.tsx:10-54`, `206-268`).
- Cztery czerwone kółka z numerami w sekcji „Jak to działa?" (`272-293`).
- Dolne CTA „Gotowy(-a) na ochronę?" na gradiencie (`389-403`).
- Emoji w roli ikon: 👤 👫 👨‍👩‍👧‍👦 przy wyborze produktu (`app/kalkulator/produkt/page.tsx:15-17`), ✅ na ekranie sukcesu (`app/kalkulator/sukces/page.tsx:23`), ⚠️ w oknie wykluczenia (`components/questionnaire/index.tsx:18`).
- Ramki wariantów w kolorach bez znaczenia: szary, niebieski, zielony, fioletowy, czerwony (`components/product-card.tsx:14-20`). Do tego niebieskie ramki informacyjne w ankiecie i na ekranie wieku.
- Wszystko jest zaokrągloną kartą z cieniem; jeden krój (Inter) w jednej skali.

### 5.4 Co działa i warto zachować

- Prawdziwe dane: `components/variants-comparison-table.tsx` i `components/benefits-table.tsx` pokazują konkretne kwoty. To najmocniejsza treść serwisu.
- Wpisanie wieku na stronie głównej przelicza tabele dla właściwej grupy.
- Informacja, że odpowiedzi zdrowotne zostają w przeglądarce (`components/privacy-notice.tsx`), i zgodne z nią zachowanie kodu.
- Ścieżki wykluczenia kierują do polisy indywidualnej zamiast kończyć się ślepo.
- Czerwień marki na głównych przyciskach.

## 6. Ograniczenia

**Teksty prawne zostają słowo w słowo.** Dotyczy treści oświadczeń zdrowotnych (`lib/data/questionnaire.ts`), pełnych treści zgód i oświadczeń w `app/kalkulator/podsumowanie/page.tsx` oraz stron `rodo`, `polityka-prywatnosci`, `regulamin`, `informacja-o-agencie`. Pochodzą od ubezpieczyciela albo regulują odpowiedzialność agenta. Układ, grupowanie i typografię można zmieniać. Dodanie „zaznacz wszystkie" przy zgodach to decyzja właściciela, bo zmienia sposób składania oświadczenia (sekcja 9).

**Odpowiedzi w ankiecie zdrowotnej zostają bez zmian.** Przyciski „NIE (spełniam warunek)" i „TAK" (`components/questionnaire/question-block.tsx:78`, `91`) oraz ich logika są poprawne. To decyzja właściciela z 18.11.2026: nie zmieniaj etykiet, kolejności ani znaczenia odpowiedzi.

**Liczby tylko z danych.** Składki i kwoty świadczeń bierz z `lib/data/`. Nie dopisuj statystyk, opinii klientów, liczby ubezpieczonych ani ocen, których nie ma w repozytorium.

**Dane zdrowotne nie opuszczają przeglądarki.** Odpowiedzi z ankiety nie mogą być wysyłane, logowane ani zapisywane, także w `localStorage`. Serwis obiecuje to wprost na ekranie ankiety i w podsumowaniu.

**Polityka CSP blokuje zasoby zewnętrzne.** `next.config.ts` ustawia `default-src 'self'` z wyjątkiem `challenges.cloudflare.com`. Czcionki działają przez `next/font`, bo są hostowane lokalnie. Zewnętrzne czcionki, obrazy, skrypty i analityka wymagałyby zmiany CSP, czyli osobnej decyzji.

**Turnstile zostanie przeniesiony na ostatni ekran.** To osobna, zaplanowana zmiana: widżet ma działać przy przycisku wysyłki, a osobny ekran „Weryfikacja" znika. Projektuj ścieżkę bez tego kroku i zostaw miejsce na widżet przy przycisku. Samej logiki weryfikacji nie zmieniaj w ramach redesignu.

**Marka.** Logo to `public/ergo-hestia-logo.jpg`, czerwień `#E4002B` (stan hover `#c00025`). Wytycznych marki ERGO Hestii w repozytorium nie ma. Serwis nie powinien udawać strony ubezpieczyciela: w nagłówku ma zostać widoczna nazwa agenta.

**Zdjęcia.** Są tylko trzy zdjęcia stockowe i jedno wideo. Zdjęć agencji ani zespołu nie ma.

## 7. Proponowany kierunek

Robocza nazwa: liczby zamiast ozdobników. Serwis ma jedną mocną treść, czyli konkretne składki i kwoty wypłat, a obecny projekt chowa ją za dekoracją. Propozycja: białe tło, jedna skala szarości, czerwień marki tylko dla głównej akcji i dla ceny, kwoty składane cyframi tabelarycznymi.

**Strona główna**

- Pole wieku przenieść do hero. Po wpisaniu wieku pod spodem pojawiają się trzy ceny „od", po jednej dla każdego produktu. Na telefonie to samo, bez wideo.
- Sześć kafelków zastąpić jedną tabelą „co dostajesz" z pięcioma lub sześcioma wierszami i kwotami dla podanego wieku.
- Trzy pastelowe akordeony zastąpić jedną tabelą porównawczą trzech produktów. Zdjęcia stockowe usunąć albo zostawić jedno.
- „Jak to działa" skrócić do jednej linii z czterema krokami i szacowanym czasem.
- Drugą sekcję kafelków usunąć; te same linki są w stopce.
- Dolne CTA bez gradientu, z tą samą nazwą akcji co w hero.

**Kalkulator**

- Wybór wariantu jako tabela z czterema lub pięcioma kwotami, które naprawdę różnią warianty, na przykład zgon, zgon w wypadku, poważne zachorowanie, dzień w szpitalu, operacja. Kolor oznacza wyłącznie wybrany wariant. Na telefonie kolumny przesuwane w poziomie albo wiersze ułożone jeden pod drugim.
- Wybór produktu bez emoji: nazwa, kogo obejmuje, cena „od".
- Cztery kroki: Wiek, Zdrowie, Oferta, Kontakt. Na telefonie zapis „Krok 2 z 4 · Zdrowie" zamiast kółek.
- Ankieta: etykiety i logika odpowiedzi bez zmian (sekcja 6). Przy zmianie wyglądu kart zachowaj wyraźny sygnał stanu po odpowiedzi (dziś zielona albo czerwona karta, `components/questionnaire/question-block.tsx:19-24`).
- Podsumowanie: skrót oferty (produkt, wariant, dodatki, składka) z linkiem do pełnej tabeli zamiast całej tabeli w treści. Zgody w trzech blokach: ochrona ubezpieczeniowa, oświadczenia, zgody dobrowolne.
- Jeden nagłówek w całym serwisie, z logo jako linkiem do strony głównej.
- Okno wykluczenia i ekran sukcesu bez emoji.

**Typografia**

Inter można zostawić albo zamienić na krój z wyraźnymi cyframi tabelarycznymi i pełnym zestawem polskich znaków, na przykład IBM Plex Sans. W obu przypadkach dodać podzbiór `latin-ext` do `next/font` (`app/layout.tsx:5`), żeby polskie znaki ładowały się razem z resztą.

## 8. Proponowana kolejność

1. Błędy z sekcji 5.1. Są małe i niezależne od kierunku.
2. Ekran wyboru produktu i wariantu. Tu zapada decyzja o cenie i tu obecny projekt pomaga najmniej.
3. Reszta ścieżki: stepper, ankieta, podsumowanie, wspólny nagłówek.
4. Strona główna i strony treściowe (`components/page-hero.tsx`).

## 9. Decyzje dla właściciela

- Jedna nazwa głównej akcji. Propozycja: „Sprawdź składkę" na wejściu i „Wyślij zapytanie do agenta" na końcu.
- „Zaznacz wszystkie obowiązkowe" przy zgodach. Wymaga opinii prawnej.
- Czy zostaje wideo i zdjęcia stockowe; czy są własne zdjęcia.
- Krój pisma i ewentualne wytyczne marki od ERGO Hestii.
- Czy „od 57 zł" to właściwa najniższa cena do pokazania (sekcja 5.2).

## 10. Jak uruchomić i obejrzeć

```bash
npm ci
npx next build && npx next start -p 3311
```

Bez zmiennych środowiskowych strony działają, ale `/api/turnstile` i `/api/oferta` zwracają 500, więc ręcznie nie da się przejść za krok „Weryfikacja" ani wysłać formularza. Do zrzutów dalszych ekranów wystarczy podstawić widżet i odpowiedź endpointu w Playwright:

```js
const STUB = `window.turnstile = {
  render(el, o) { setTimeout(() => o && o.callback && o.callback('stub'), 150); return 'w1'; },
  reset() {}, remove() {}, execute() {}, getResponse() { return 'stub'; },
  isExpired() { return false; }, ready(cb) { cb(); },
};
for (const k of Object.keys(window)) {
  if (/onload.*turnstile/i.test(k) && typeof window[k] === 'function') window[k]();
}`;
await page.route('**/challenges.cloudflare.com/**', r =>
  r.fulfill({ contentType: 'application/javascript', body: STUB }));
await page.route('**/api/turnstile', r =>
  r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
```

Dalej: wpisz datę w `#birthdate`, kliknij wszystkie przyciski zaczynające się od „NIE", potem „Przejdź dalej". Tryb ciemny sprawdzisz kontekstem przeglądarki z `colorScheme: 'dark'`. W sesjach chmurowych Claude Chromium i Playwright są już zainstalowane.

## 11. Czego nie sprawdzono

- Statystyk ruchu. Założenie, że większość wejść jest z telefonu, nie ma pokrycia w danych.
- Wersji produkcyjnej i prawdziwych urządzeń; wszystko oglądano w Chromium na buildzie lokalnym.
- Dostępności poza przypadkami opisanymi wyżej: kontrastu, pełnej obsługi klawiatury, czytników ekranu.
- Czy telefon pobiera ukryte wideo 5,7 MB.
- Stron treściowych poza ich wspólnym nagłówkiem.
- Działania skilla `hallmark`.
