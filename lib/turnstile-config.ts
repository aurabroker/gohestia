// Publiczny klucz Cloudflare Turnstile (site key). Trafia do przeglądarki
// (jest widoczny w HTML), więc może być trzymany w repo — to NIE jest sekret.
// Sekretem jest tylko TURNSTILE_SECRET_KEY (weryfikacja po stronie serwera).
//
// Można nadpisać przez NEXT_PUBLIC_TURNSTILE_SITE_KEY (wstrzykiwane przy
// `next build`); w przeciwnym razie używana jest wartość poniżej.
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '0x4AAAAAADuBHGcNqabAz0mA';
