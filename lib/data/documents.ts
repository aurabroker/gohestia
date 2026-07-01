/**
 * Dokumenty PDF dołączane do maila z ofertą wysyłanego do klienta.
 *
 * Aby dodać / usunąć dokument:
 *   1. Wrzuć plik PDF do `public/dokumenty/`.
 *   2. Dodaj wpis poniżej — `file` to ścieżka względem katalogu `public/`,
 *      a `filename` to nazwa, którą odbiorca zobaczy w mailu.
 *
 * Jeśli danego pliku nie ma jeszcze w `public/dokumenty/`, wpis jest po prostu
 * pomijany (mail wyśle się bez tego załącznika) — nic się nie wywali.
 */
export interface OfferDocument {
  /** Ścieżka pliku względem katalogu `public/`, np. 'dokumenty/owu.pdf'. */
  file: string;
  /** Nazwa pliku widoczna dla odbiorcy maila. */
  filename: string;
}

export const OFFER_DOCUMENTS: OfferDocument[] = [
  {
    file: 'dokumenty/owu.pdf',
    filename: 'OWU_ERGO_Razem_ER_01-25.pdf',
  },
  {
    file: 'dokumenty/informacja-o-dystrybutorze.pdf',
    filename: 'Informacja_o_dystrybutorze_Aura_Expert.pdf',
  },
  // IPID — odkomentuj, jeśli jest osobnym plikiem
  // (czasem jest już zawarty w OWU, wtedy zostaw zakomentowane):
  // {
  //   file: 'dokumenty/ipid.pdf',
  //   filename: 'IPID_ERGO_Razem.pdf',
  // },
];
