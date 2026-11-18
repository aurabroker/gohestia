/**
 * Dokumenty PDF dołączane do maila z ofertą wysyłanego do klienta.
 *
 * Aby dodać / usunąć dokument:
 *   1. Wrzuć plik PDF do `public/dokumenty/` (nazwa pliku małymi literami —
 *      na serwerze wielkość liter w ścieżce ma znaczenie).
 *   2. Dodaj wpis poniżej — `file` to ścieżka względem katalogu `public/`,
 *      `filename` to nazwa załącznika widoczna dla odbiorcy, `title` to nazwa
 *      dokumentu używana w treści maili.
 *
 * Jeśli pliku nie da się wczytać, maile i tak są wysyłane, ale agent dostaje
 * w swoim mailu ostrzeżenie z listą dokumentów, których klient NIE otrzymał.
 * `required: true` oznacza dokument, który klient musi dostać przed
 * przystąpieniem do umowy — jego brak agent musi uzupełnić samodzielnie.
 */
export interface OfferDocument {
  /** Ścieżka pliku względem katalogu `public/`, np. 'dokumenty/owu.pdf'. */
  file: string;
  /** Nazwa pliku widoczna dla odbiorcy maila. */
  filename: string;
  /** Nazwa dokumentu w treści maili. */
  title: string;
  /** Czy klient musi otrzymać ten dokument. */
  required: boolean;
}

export const OFFER_DOCUMENTS: OfferDocument[] = [
  {
    file: 'dokumenty/owu.pdf',
    filename: 'OWU_ERGO_Razem_ER_01-25.pdf',
    title: 'Ogólne Warunki Ubezpieczenia ERGO Razem (ER 01/25)',
    required: true,
  },
  {
    // Pliku nie ma jeszcze w repozytorium — do czasu jego dodania agent
    // dostaje w mailu ostrzeżenie, że tego dokumentu nie dołączono.
    file: 'dokumenty/informacja-o-dystrybutorze.pdf',
    filename: 'Informacja_o_dystrybutorze_Aura_Expert.pdf',
    title: 'Informacja o dystrybutorze (Aura Expert)',
    required: true,
  },
  // IPID — odkomentuj, jeśli jest osobnym plikiem
  // (czasem jest już zawarty w OWU, wtedy zostaw zakomentowane):
  // {
  //   file: 'dokumenty/ipid.pdf',
  //   filename: 'IPID_ERGO_Razem.pdf',
  //   title: 'IPID ERGO Razem',
  //   required: false,
  // },
];
