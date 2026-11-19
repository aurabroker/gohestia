# Dokumenty PDF dołączane do maila z ofertą

Pliki z tego katalogu są dołączane jako załączniki do maila wysyłanego do
klienta po kliknięciu „Wyślij zapytanie do agenta". Ten sam plik OWU jest też
podlinkowany na ekranie podsumowania (`/dokumenty/owu.pdf`), żeby klient mógł
go przeczytać przed złożeniem oświadczeń.

Lista dołączanych dokumentów jest zdefiniowana w `lib/data/documents.ts`.
Wrzuć tu pliki PDF o **dokładnie takich nazwach**, jak w tej konfiguracji.
Nazwy zapisuj **małymi literami** — na serwerze (Cloudflare, Linux) `OWU.pdf`
i `owu.pdf` to dwa różne pliki.

| Plik                                  | Dokument                                  | W repozytorium |
| ------------------------------------- | ----------------------------------------- | -------------- |
| `owu.pdf`                             | OWU ERGO Razem (kod ER 01/25)             | tak            |
| `informacja-o-dystrybutorze.pdf`      | Informacja o dystrybutorze (Aura Expert)  | tak            |
| `ipid.pdf` *(opcjonalnie)*            | IPID — tylko jeśli jest osobnym plikiem   | nie            |

## Uwagi

- Każdy wpis w `lib/data/documents.ts` ma pole `required`. Dokument z
  `required: true` klient musi otrzymać przed przystąpieniem do umowy.
- Jeśli któregoś pliku nie da się dołączyć (nie ma go tutaj albo nie jest
  poprawnym PDF-em), maile i tak zostaną wysłane, ale:
  - agent dostaje w swoim mailu wyraźne ostrzeżenie z listą dokumentów,
    których klient **nie** otrzymał — musi je przekazać samodzielnie,
  - klient dostaje w mailu listę faktycznie dołączonych dokumentów oraz
    (gdy ustawiono `SITE_URL`) linki do OWU i strony „Informacja o agencie",
  - w logach workera pojawia się wpis z nazwą brakującego pliku.
- Test `tests/documents.test.ts` pilnuje, żeby każdy plik z konfiguracji
  istniał tutaj pod dokładnie taką nazwą i był poprawnym PDF-em.
- Na Cloudflare pliki są czytane przez binding `ASSETS` (wrangler.jsonc);
  lokalnie (`next dev` / `next start`) pobierane po HTTP z `SITE_URL` albo
  z adresu bieżącego żądania.
- IPID bywa już zawarty w OWU — wtedy nie dodawaj `ipid.pdf` i zostaw wpis
  zakomentowany w `lib/data/documents.ts`.
- Łączny rozmiar maila (wszystkie załączniki) nie może przekroczyć **40 MB**
  (limit Resend). Trzymaj PDF-y możliwie lekkie.
- Aby dodać kolejny dokument: wrzuć PDF tutaj i dopisz wpis w
  `lib/data/documents.ts`.
