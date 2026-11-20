import { z } from 'zod';

// Zod sprawdza przy pierwszej walidacji, czy wolno mu kompilować kod przez
// `new Function`. Nasz nagłówek CSP tego zabrania, więc próba i tak się nie
// udawała, a przeglądarka zgłaszała ją w konsoli jako naruszenie. Tryb
// `jitless` pomija tę próbę; reguły walidacji są te same.
z.config({ jitless: true });

/**
 * Wspólne reguły pól formularza „Dane kontaktowe" — używane przez formularz
 * w przeglądarce i przez endpoint `/api/oferta`, żeby obie strony przyjmowały
 * dokładnie to samo.
 */

/**
 * Imię / nazwisko: litery łacińskie lub cyrylica, spacja, myślnik, apostrof
 * i kropka. Zaczyna się od litery; kropka nie może stać bezpośrednio przed
 * literą (dopuszczamy „Jan K.", ale nie „slowo.slowo"); najwyżej cztery
 * człony oddzielone spacjami.
 */
export const NAME_PATTERN =
  /^(?!.*\.\p{L})(?!(?:[^ ]* ){4})[\p{Script=Latin}\p{Script=Cyrillic}][\p{Script=Latin}\p{Script=Cyrillic} .'’-]*$/u;
export const NAME_MIN = 2;
export const NAME_MAX = 50;

export const EMAIL_MAX = 254;

/** Telefon: 9–15 cyfr, opcjonalny plus na początku, pojedyncze spacje lub myślniki między cyframi. */
export const PHONE_PATTERN = /^\+?[0-9](?:[ -]?[0-9]){8,14}$/;

/**
 * Region: nazwa miejscowości lub województwa — litery, spacja, przecinek,
 * kropka i myślnik. Bez cyfr; kropka nie może stać bezpośrednio przed literą.
 */
export const REGION_PATTERN = /^(?!.*\.\p{L})[\p{Script=Latin}\p{Script=Cyrillic} ,.-]*$/u;
export const REGION_MAX = 60;

/** Zgody i oświadczenia, bez których zapytanie nie może zostać wysłane. */
export const MANDATORY_CONSENTS = [
  'zgoda_1', 'zgoda_2', 'zgoda_3', 'zgoda_4', 'zgoda_5', 'zgoda_6', 'zgoda_9',
  'oswiadczenie_1', 'oswiadczenie_2', 'oswiadczenie_3', 'oswiadczenie_4',
] as const;

/** Zgody dobrowolne (marketingowe). */
export const OPTIONAL_CONSENTS = ['zgoda_7', 'zgoda_8', 'zgoda_10'] as const;

/** Token Turnstile ma najwyżej 2048 znaków. */
export const TURNSTILE_TOKEN_MAX = 2048;

const nameSchema = z.string().normalize('NFC').trim().min(NAME_MIN).max(NAME_MAX).regex(NAME_PATTERN);
const accepted = z.literal(true);

/**
 * Treść żądania POST /api/oferta. Klient przesyła wyłącznie wybory
 * (identyfikatory i flagi), dane kontaktowe, zgody i token — składkę i etykiety
 * serwer wylicza sam. Pola spoza schematu są pomijane.
 */
export const ofertaRequestSchema = z.object({
  imie:     nameSchema,
  nazwisko: nameSchema,
  email:    z.string().trim().max(EMAIL_MAX).pipe(z.email()),
  telefon:  z.string().trim().regex(PHONE_PATTERN),
  region:   z.string().trim().max(REGION_MAX).regex(REGION_PATTERN).optional(),
  oferta: z.object({
    ageGroup: z.enum(['A1', 'A2', 'B']),
    product:  z.enum(['dla_mnie', 'dla_nas', 'dla_rodziny']),
    variant:  z.enum(['podstawowy', 'rozszerzony', 'komfort', 'premium', 'prestiz']),
    addons: z.object({
      mediplan:          z.boolean(),
      medicalAssistance: z.boolean(),
      globalDoctors:     z.boolean(),
    }),
  }),
  zgody: z.object({
    zgoda_1:        accepted,
    zgoda_2:        accepted,
    zgoda_3:        accepted,
    zgoda_4:        accepted,
    zgoda_5:        accepted,
    zgoda_6:        accepted,
    zgoda_9:        accepted,
    oswiadczenie_1: accepted,
    oswiadczenie_2: accepted,
    oswiadczenie_3: accepted,
    oswiadczenie_4: accepted,
    zgoda_7:        z.boolean(),
    zgoda_8:        z.boolean(),
    zgoda_10:       z.boolean(),
  }),
  turnstileToken: z.string().min(1).max(TURNSTILE_TOKEN_MAX),
});

export type OfertaRequest = z.infer<typeof ofertaRequestSchema>;
