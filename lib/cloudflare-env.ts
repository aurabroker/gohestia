import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Bindingi workera (`env`) albo `null`, gdy kod nie działa na Cloudflare
 * (`next dev`, `next start`, testy) i kontekst nie istnieje.
 */
export function getCloudflareEnv(): Record<string, unknown> | null {
  try {
    return getCloudflareContext().env as unknown as Record<string, unknown>;
  } catch {
    return null;
  }
}
