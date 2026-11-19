import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  cloudflareEnv: { current: null as Record<string, unknown> | null },
}));

vi.mock('@/lib/cloudflare-env', () => ({
  getCloudflareEnv: () => mocks.cloudflareEnv.current,
}));

import { loadOfferDocuments } from '@/lib/attachments';
import { OFFER_DOCUMENTS } from '@/lib/data/documents';

const REQUEST_URL = 'https://kalkulator.example.test/api/oferta';
const PDF_BYTES = new TextEncoder().encode('%PDF-1.7\n% plik testowy\n');
const PDF_BASE64 = Buffer.from(PDF_BYTES).toString('base64');

const pdf = () => new Response(PDF_BYTES, { status: 200, headers: { 'Content-Type': 'application/pdf' } });
const notFound = () => new Response('Not found', { status: 404 });

const fetchMock = vi.fn<typeof fetch>();

/** Serwuje PDF tylko pod ścieżką OWU — tak jak w repozytorium. */
function onlyOwu(input: URL | string | Request): Response {
  const { pathname } = new URL(String(input instanceof Request ? input.url : input));
  return pathname === '/dokumenty/owu.pdf' ? pdf() : notFound();
}

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('SITE_URL', '');
  mocks.cloudflareEnv.current = null;
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('konfiguracja dokumentów', () => {
  it('każdy wpis ma ścieżkę małymi literami w public/dokumenty, nazwę, tytuł i flagę required', () => {
    expect(OFFER_DOCUMENTS.length).toBeGreaterThan(0);
    for (const doc of OFFER_DOCUMENTS) {
      expect(doc.file).toMatch(/^dokumenty\/[a-z0-9-]+\.pdf$/);
      expect(doc.filename).toMatch(/\.pdf$/);
      expect(doc.title.length).toBeGreaterThan(0);
      expect(typeof doc.required).toBe('boolean');
    }
    expect(OFFER_DOCUMENTS.find((d) => d.file === 'dokumenty/owu.pdf')?.required).toBe(true);
  });
});

describe('loadOfferDocuments — Cloudflare (binding ASSETS)', () => {
  it('czyta pliki przez binding, bez wychodzenia do sieci', async () => {
    const assetsFetch = vi.fn(async (input: URL | string) => onlyOwu(input));
    mocks.cloudflareEnv.current = { ASSETS: { fetch: assetsFetch } };

    const result = await loadOfferDocuments(REQUEST_URL);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(assetsFetch).toHaveBeenCalledTimes(OFFER_DOCUMENTS.length);
    expect(assetsFetch.mock.calls.map(([input]) => new URL(String(input)).pathname)).toEqual(
      OFFER_DOCUMENTS.map((d) => `/${d.file}`),
    );

    expect(result.attachments).toEqual([
      { filename: 'OWU_ERGO_Razem_ER_01-25.pdf', content: PDF_BASE64, contentType: 'application/pdf' },
    ]);
    expect(result.attached.map((d) => d.file)).toEqual(['dokumenty/owu.pdf']);
    expect(result.missing.map((d) => d.file)).toEqual(['dokumenty/informacja-o-dystrybutorze.pdf']);
  });

  it('błąd bindingu nie przerywa — dokumenty trafiają na listę brakujących', async () => {
    mocks.cloudflareEnv.current = {
      ASSETS: { fetch: vi.fn(async () => { throw new Error('assets niedostępne'); }) },
    };

    const result = await loadOfferDocuments(REQUEST_URL);

    expect(result.attachments).toEqual([]);
    expect(result.missing).toEqual(OFFER_DOCUMENTS);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('loadOfferDocuments — poza Cloudflare (next dev / next start)', () => {
  it('pobiera z SITE_URL, gdy jest ustawiony', async () => {
    vi.stubEnv('SITE_URL', 'https://www.serwis.example.test/');
    fetchMock.mockImplementation(async (input) => onlyOwu(input as string));

    const result = await loadOfferDocuments(REQUEST_URL);

    expect(fetchMock.mock.calls.map(([input]) => String(input))).toEqual(
      OFFER_DOCUMENTS.map((d) => `https://www.serwis.example.test/${d.file}`),
    );
    expect(result.attached.map((d) => d.file)).toEqual(['dokumenty/owu.pdf']);
  });

  it('bez SITE_URL pobiera z originu bieżącego żądania', async () => {
    fetchMock.mockImplementation(async (input) => onlyOwu(input as string));

    await loadOfferDocuments(REQUEST_URL);

    expect(String(fetchMock.mock.calls[0][0])).toBe('https://kalkulator.example.test/dokumenty/owu.pdf');
  });

  it('odpowiedź 200, która nie jest plikiem PDF, nie zostaje załącznikiem', async () => {
    fetchMock.mockImplementation(async () => new Response('<!doctype html><title>Strona</title>', { status: 200 }));

    const result = await loadOfferDocuments(REQUEST_URL);

    expect(result.attachments).toEqual([]);
    expect(result.missing).toEqual(OFFER_DOCUMENTS);
  });

  it('błąd sieci nie przerywa — wszystkie dokumenty są zgłoszone jako brakujące', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));

    const result = await loadOfferDocuments(REQUEST_URL);

    expect(result.attachments).toEqual([]);
    expect(result.attached).toEqual([]);
    expect(result.missing).toEqual(OFFER_DOCUMENTS);
  });
});
