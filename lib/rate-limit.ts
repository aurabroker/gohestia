import { getCloudflareEnv } from './cloudflare-env';

/** Kształt bindingu Workers Rate Limiting (`ratelimits` w wrangler.jsonc). */
interface RateLimitBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

function isRateLimitBinding(value: unknown): value is RateLimitBinding {
  return typeof value === 'object' && value !== null
    && typeof (value as { limit?: unknown }).limit === 'function';
}

/**
 * Limit zgłoszeń na adres IP — binding `OFERTA_RATE_LIMITER`.
 *
 * Zwraca `false`, gdy limit dla danego klucza został przekroczony. Gdy bindingu
 * nie ma (`next dev`, `next start`) albo sam limiter zgłosi błąd, żądanie
 * przechodzi dalej.
 */
export async function isWithinRateLimit(clientIp: string | null): Promise<boolean> {
  const limiter = getCloudflareEnv()?.OFERTA_RATE_LIMITER;
  if (!isRateLimitBinding(limiter)) return true;

  try {
    const { success } = await limiter.limit({ key: clientIp ?? 'brak-ip' });
    return success;
  } catch (err) {
    console.error('Rate limiter: błąd bindingu', err instanceof Error ? err.name : '');
    return true;
  }
}
