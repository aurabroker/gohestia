# Dokumenty PDF dołączane do maila z ofertą

Pliki z tego katalogu są dołączane jako załączniki do maila wysyłanego do
klienta po kliknięciu „Wyślij zapytanie do Agenta".

Lista dołączanych dokumentów jest zdefiniowana w `lib/data/documents.ts`.
Wrzuć tu pliki PDF o **dokładnie takich nazwach**, jak w tej konfiguracji:

| Plik                                  | Dokument                                  |
| ------------------------------------- | ----------------------------------------- |
| `owu.pdf`                             | OWU ERGO Razem (kod ER 01/25)             |
| `informacja-o-dystrybutorze.pdf`      | Informacja o dystrybutorze (Aura Expert)  |
| `ipid.pdf` *(opcjonalnie)*            | IPID — tylko jeśli jest osobnym plikiem   |

## Uwagi

- Jeśli któregoś pliku tu nie ma, mail i tak zostanie wysłany — brakujący
  załącznik jest po prostu pomijany (z ostrzeżeniem w logach workera).
- IPID bywa już zawarty w OWU — wtedy nie dodawaj `ipid.pdf` i zostaw wpis
  zakomentowany w `lib/data/documents.ts`.
- Łączny rozmiar maila (wszystkie załączniki) nie może przekroczyć **40 MB**
  (limit Resend). Trzymaj PDF-y możliwie lekkie.
- Aby dodać kolejny dokument: wrzuć PDF tutaj i dopisz wpis w
  `lib/data/documents.ts`.
