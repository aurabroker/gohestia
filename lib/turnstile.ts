const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const SITEVERIFY_TIMEOUT_MS = 5000;

/**
 * Sprawdza token Turnstile w Cloudflare (siteverify).
 *
 * Zwraca `true` wyłącznie wtedy, gdy odpowiedź JSON zawiera `success === true`.
 * Brak sekretu, błąd sieci, przekroczenie czasu albo odpowiedź, która nie jest
 * poprawnym JSON-em, dają `false`.
 *
 * @param token    token z widgetu (pole `turnstileToken` formularza)
 * @param remoteIp adres IP klienta z nagłówka `CF-Connecting-IP`, jeśli jest
 */
export async function verifyTurnstileToken(token: string, remoteIp?: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('Turnstile: brak TURNSTILE_SECRET_KEY');
    return false;
  }

  const params = new URLSearchParams({ secret, response: token });
  if (remoteIp) params.set('remoteip', remoteIp);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SITEVERIFY_TIMEOUT_MS);

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      body:   params,
      signal: controller.signal,
    });
    const outcome: unknown = await res.json();
    if (typeof outcome !== 'object' || outcome === null) return false;

    const { success, 'error-codes': errorCodes } = outcome as Record<string, unknown>;
    if (success === true) return true;

    console.warn('Turnstile: token odrzucony', Array.isArray(errorCodes) ? errorCodes.join(',') : '');
    return false;
  } catch (err) {
    console.error('Turnstile: siteverify nieosiągalne', err instanceof Error ? err.name : 'nieznany błąd');
    return false;
  } finally {
    clearTimeout(timer);
  }
}
