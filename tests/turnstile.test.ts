import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { verifyTurnstileToken } from '@/lib/turnstile';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const fetchMock = vi.fn<typeof fetch>();

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret');
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('verifyTurnstileToken', () => {
  it('wysyła secret, token i adres IP do siteverify; true tylko dla success === true', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ success: true }));

    await expect(verifyTurnstileToken('token-abc', '203.0.113.7')).resolves.toBe(true);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(SITEVERIFY_URL);
    expect(init?.method).toBe('POST');
    const body = init?.body as URLSearchParams;
    expect(body.get('secret')).toBe('test-secret');
    expect(body.get('response')).toBe('token-abc');
    expect(body.get('remoteip')).toBe('203.0.113.7');
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it('pomija remoteip, gdy adres IP nie jest znany', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ success: true }));

    await verifyTurnstileToken('token-abc', null);

    const body = fetchMock.mock.calls[0][1]?.body as URLSearchParams;
    expect(body.has('remoteip')).toBe(false);
  });

  it('false, gdy Cloudflare odrzuca token', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ success: false, 'error-codes': ['timeout-or-duplicate'] }));
    await expect(verifyTurnstileToken('token-abc')).resolves.toBe(false);
  });

  it.each([
    ['napis "true"', { success: 'true' }],
    ['liczba 1', { success: 1 }],
    ['brak pola', {}],
    ['null', null],
    ['tablica', [true]],
  ])('false, gdy success nie jest dokładnie true (%s)', async (_label, payload) => {
    fetchMock.mockResolvedValueOnce(jsonResponse(payload));
    await expect(verifyTurnstileToken('token-abc')).resolves.toBe(false);
  });

  it('false przy błędzie sieci', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    await expect(verifyTurnstileToken('token-abc')).resolves.toBe(false);
  });

  it('false, gdy odpowiedź nie jest JSON-em', async () => {
    fetchMock.mockResolvedValueOnce(new Response('<html>502 Bad Gateway</html>', { status: 502 }));
    await expect(verifyTurnstileToken('token-abc')).resolves.toBe(false);
  });

  it('false po przekroczeniu czasu (~5 s) — żądanie jest przerywane', async () => {
    vi.useFakeTimers();
    let aborted = false;
    fetchMock.mockImplementationOnce((_url, init) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => {
        aborted = true;
        reject(new DOMException('The operation was aborted.', 'AbortError'));
      });
    }));

    const pending = verifyTurnstileToken('token-abc');
    await vi.advanceTimersByTimeAsync(4999);
    expect(aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);

    await expect(pending).resolves.toBe(false);
    expect(aborted).toBe(true);
  });

  it('false i brak wywołania sieci, gdy nie ma TURNSTILE_SECRET_KEY', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', '');
    await expect(verifyTurnstileToken('token-abc')).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
