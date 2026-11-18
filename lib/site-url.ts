/**
 * Kanoniczny adres serwisu z konfiguracji (`SITE_URL`), bez końcowego ukośnika.
 * To jedyne źródło adresu dla linków umieszczanych w mailach — nagłówki żądania
 * nie są do tego używane. Zwraca `null`, gdy zmienna nie jest ustawiona albo
 * nie jest adresem http(s).
 */
export function getSiteUrl(): string | null {
  const raw = process.env.SITE_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return `${url.origin}${url.pathname.replace(/\/+$/, '')}`;
  } catch {
    return null;
  }
}
