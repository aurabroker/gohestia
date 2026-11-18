import { getCloudflareEnv } from './cloudflare-env';

/** Kształt bindingu Workers Rate Limiting (`ratelimits` w wrangler.jsonc). */
interface RateLimitBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

/** Nazwy bindingów limitera z wrangler.jsonc. */
export type RateLimiterName = 'OFERTA_RATE_LIMITER' | 'OFERTA_RECIPIENT_LIMITER';

function isRateLimitBinding(value: unknown): value is RateLimitBinding {
  return typeof value === 'object' && value !== null
    && typeof (value as { limit?: unknown }).limit === 'function';
}

/**
 * Klucz limitera dla adresu IP. Adresy IPv6 są liczone całą podsiecią /64
 * (jeden abonent dostaje zwykle cały taki blok), IPv4 pojedynczo.
 */
export function clientKey(clientIp: string | null): string {
  if (!clientIp) return 'brak-ip';
  if (!clientIp.includes(':')) return clientIp;

  const [head, tail = ''] = clientIp.toLowerCase().split('::');
  const headParts = head ? head.split(':') : [];
  const tailParts = tail ? tail.split(':') : [];
  const missing = Math.max(0, 8 - headParts.length - tailParts.length);
  const full = clientIp.includes('::')
    ? [...headParts, ...Array<string>(missing).fill('0'), ...tailParts]
    : headParts;
  return `${full.slice(0, 4).map((part) => part.replace(/^0+(?=.)/, '')).join(':')}::/64`;
}

/**
 * Sprawdza limit w podanym bindingu. Zwraca `false`, gdy limit dla klucza
 * został przekroczony. Gdy bindingu nie ma (`next dev`, `next start`) albo
 * sam limiter zgłosi błąd, żądanie przechodzi dalej.
 */
export async function isWithinRateLimit(name: RateLimiterName, key: string): Promise<boolean> {
  const limiter = getCloudflareEnv()?.[name];
  if (!isRateLimitBinding(limiter)) return true;

  try {
    const { success } = await limiter.limit({ key });
    return success;
  } catch (err) {
    console.error('Rate limiter: błąd bindingu', err instanceof Error ? err.name : '');
    return true;
  }
}
