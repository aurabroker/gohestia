import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LoadedDocuments } from '@/lib/attachments';

// Zależności zewnętrzne endpointu są podmienione: żaden test nie łączy się
// z Resend ani z Cloudflare.
const mocks = vi.hoisted(() => ({
  send:              vi.fn(),
  resendKeys:        [] as string[],
  loadOfferDocuments: vi.fn(),
  cloudflareEnv:     { current: null as Record<string, unknown> | null },
}));

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: mocks.send };
    constructor(key: string) {
      mocks.resendKeys.push(key);
    }
  },
}));

vi.mock('@/lib/attachments', () => ({
  loadOfferDocuments: mocks.loadOfferDocuments,
}));

vi.mock('@/lib/cloudflare-env', () => ({
  getCloudflareEnv: () => mocks.cloudflareEnv.current,
}));

import { POST } from '@/app/api/oferta/route';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const ENDPOINT = 'https://kalkulator.example.test/api/oferta';
const CLIENT_IP = '203.0.113.9';
const FROM_ADDRESS = 'nadawca@poczta.example.test';
const AGENT_ADDRESS = 'agent@biuro.example.test';

const OWU = {
  file: 'dokumenty/owu.pdf',
  filename: 'OWU_ERGO_Razem_ER_01-25.pdf',
  title: 'Ogólne Warunki Ubezpieczenia ERGO Razem (ER 01/25)',
  required: true,
};
const DYSTRYBUTOR = {
  file: 'dokumenty/informacja-o-dystrybutorze.pdf',
  filename: 'Informacja_o_dystrybutorze_Aura_Expert.pdf',
  title: 'Informacja o dystrybutorze (Aura Expert)',
  required: true,
};
const OWU_BASE64 = Buffer.from('%PDF-1.7 test').toString('base64');

const ALL_DOCUMENTS: LoadedDocuments = {
  attachments: [
    { filename: OWU.filename, content: OWU_BASE64, contentType: 'application/pdf' },
    { filename: DYSTRYBUTOR.filename, content: OWU_BASE64, contentType: 'application/pdf' },
  ],
  attached: [OWU, DYSTRYBUTOR],
  missing: [],
};
const OWU_ONLY: LoadedDocuments = {
  attachments: [{ filename: OWU.filename, content: OWU_BASE64, contentType: 'application/pdf' }],
  attached: [OWU],
  missing: [DYSTRYBUTOR],
};
const NO_DOCUMENTS: LoadedDocuments = { attachments: [], attached: [], missing: [OWU, DYSTRYBUTOR] };

const MANDATORY = [
  'zgoda_1', 'zgoda_2', 'zgoda_3', 'zgoda_4', 'zgoda_5', 'zgoda_6', 'zgoda_9',
  'oswiadczenie_1', 'oswiadczenie_2', 'oswiadczenie_3', 'oswiadczenie_4',
] as const;

function validBody() {
  return {
    imie: 'Żaneta',
    nazwisko: 'Nowak-Kowalska',
    email: 'zaneta.klientka@poczta.example.test',
    telefon: '+48 500 600 700',
    region: 'Kraków, woj. małopolskie',
    oferta: {
      ageGroup: 'A1',
      product: 'dla_rodziny',
      variant: 'rozszerzony', // 103 zł
      addons: { mediplan: true, medicalAssistance: true, globalDoctors: false }, // + 9 + 6
    },
    zgody: {
      ...Object.fromEntries(MANDATORY.map((key) => [key, true])),
      zgoda_7: true,
      zgoda_8: false,
      zgoda_10: false,
    } as Record<string, unknown>,
    turnstileToken: 'token-z-widgetu',
  };
}

function post(body: unknown, headers: Record<string, string> = {}) {
  return POST(new Request(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': CLIENT_IP, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }));
}

const fetchMock = vi.fn<typeof fetch>();

function siteverifyAnswers(payload: unknown) {
  fetchMock.mockImplementation(async () => new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  }));
}

/** Tekst maila bez znaczników — tak, jak zobaczy go odbiorca. */
function mailText(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
}

interface SentMail {
  from: string;
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: string }[];
}

function sentMails(): SentMail[] {
  return mocks.send.mock.calls.map((call) => call[0] as SentMail);
}
function mailTo(address: string): SentMail {
  const mail = sentMails().find((m) => m.to === address);
  if (!mail) throw new Error(`Nie wysłano maila na adres ${address}`);
  return mail;
}

let consoleError: ReturnType<typeof vi.spyOn>;
let consoleWarn: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-turnstile-secret');
  vi.stubEnv('RESEND_API_KEY', 're_test_fikcyjny_klucz');
  vi.stubEnv('AGENT_EMAIL', AGENT_ADDRESS);
  vi.stubEnv('FROM_EMAIL', FROM_ADDRESS);
  vi.stubEnv('SITE_URL', '');

  siteverifyAnswers({ success: true });
  mocks.send.mockResolvedValue({ data: { id: 'mail-id' }, error: null });
  mocks.loadOfferDocuments.mockResolvedValue(ALL_DOCUMENTS);
  mocks.cloudflareEnv.current = null;

  consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  fetchMock.mockReset();
  mocks.send.mockReset();
  mocks.loadOfferDocuments.mockReset();
  mocks.resendKeys.length = 0;
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

async function expectRejected(res: Response, status: number) {
  expect(res.status).toBe(status);
  const payload = await res.json() as Record<string, unknown>;
  // Odpowiedź błędu to wyłącznie jedno ogólne zdanie.
  expect(Object.keys(payload)).toEqual(['error']);
  expect(typeof payload.error).toBe('string');
  return payload.error as string;
}

function expectNothingSent() {
  expect(mocks.send).not.toHaveBeenCalled();
  expect(mocks.loadOfferDocuments).not.toHaveBeenCalled();
}

describe('POST /api/oferta — poprawne zgłoszenie', () => {
  it('200 { ok: true } i dokładnie dwa maile: do agenta i do klienta z załącznikami', async () => {
    const body = validBody();
    const res = await post(body);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(mocks.send).toHaveBeenCalledTimes(2);
    expect(mocks.resendKeys).toEqual(['re_test_fikcyjny_klucz']);

    const customer = mailTo(body.email);
    expect(customer.from).toBe(`ERGO Razem Kalkulator <${FROM_ADDRESS}>`);
    expect(customer.attachments).toEqual(ALL_DOCUMENTS.attachments);
    const customerText = mailText(customer.html);
    expect(customerText).toContain(OWU.title);
    expect(customerText).toContain(DYSTRYBUTOR.title);

    const agent = mailTo(AGENT_ADDRESS);
    expect(agent.attachments).toBeUndefined();
    expect(agent.subject).toBe('Nowe zapytanie: Żaneta Nowak-Kowalska — Dla Rodziny Rozszerzony');
    const agentText = mailText(agent.html);
    expect(agentText).toContain('Żaneta Nowak-Kowalska');
    expect(agentText).toContain(body.email);
    expect(agentText).toContain('+48 500 600 700');
    expect(agentText).toContain('Kraków, woj. małopolskie');
    expect(agentText).not.toContain('NIE otrzymał kompletu dokumentów');
  });

  it('token jest sprawdzany w siteverify (z adresem IP klienta) przed czytaniem załączników i wysyłką', async () => {
    await post(validBody());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(SITEVERIFY_URL);
    const params = init?.body as URLSearchParams;
    expect(params.get('secret')).toBe('test-turnstile-secret');
    expect(params.get('response')).toBe('token-z-widgetu');
    expect(params.get('remoteip')).toBe(CLIENT_IP);

    const verifiedAt = fetchMock.mock.invocationCallOrder[0];
    expect(verifiedAt).toBeLessThan(mocks.loadOfferDocuments.mock.invocationCallOrder[0]);
    expect(verifiedAt).toBeLessThan(mocks.send.mock.invocationCallOrder[0]);
  });

  it('mail do agenta wychodzi pierwszy; gdy się nie powiedzie, klient nie dostaje potwierdzenia', async () => {
    mocks.send.mockResolvedValueOnce({ data: null, error: { name: 'application_error', message: 'x', statusCode: 500 } });

    const res = await post(validBody());

    await expectRejected(res, 502);
    expect(mocks.send).toHaveBeenCalledTimes(1);
    expect(sentMails()[0].to).toBe(AGENT_ADDRESS);
  });

  it('oba maile pokazują składkę policzoną na serwerze; kwota przysłana przez klienta jest pomijana', async () => {
    const body = validBody();
    const tampered = {
      ...body,
      monthlyPremium: 7777,
      oferta: { ...body.oferta, monthlyPremium: 7777, price: 7777, addonLabels: ['Gratis 7777'] },
    };

    const res = await post(tampered);

    expect(res.status).toBe(200);
    for (const mail of sentMails()) {
      const text = mailText(mail.html);
      expect(text).toContain('118 zł / mies.'); // 103 + 9 + 6
      expect(text).toContain('MediPlan, Medical Assistance');
      expect(mail.html).not.toContain('7777');
    }
  });

  it('Global Doctors: etykieta z wyceną indywidualną, bez wpływu na składkę', async () => {
    const body = validBody();
    body.oferta.addons = { mediplan: false, medicalAssistance: false, globalDoctors: true };

    await post(body);

    for (const mail of sentMails()) {
      const text = mailText(mail.html);
      expect(text).toContain('Global Doctors (wycena indywidualna)');
      expect(text).toContain('103 zł / mies.');
    }
  });

  it('mail do agenta: komplet zgód obowiązkowych, trzy zgody dobrowolne i czas zgłoszenia (Europe/Warsaw)', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-07-01T21:30:00Z')); // 23:30 czasu letniego w Polsce

    await post(validBody());

    const text = mailText(mailTo(AGENT_ADDRESS).html);
    expect(text).toContain('Zgody obowiązkowe (wymagane do objęcia ochroną): TAK — komplet zaakceptowany');
    expect(text).toMatch(/Informacja handlowa drogą elektroniczną \(oferta na e-mail\) TAK/);
    expect(text).toMatch(/Działania marketingowe STU ERGO Hestia S\.A\. NIE/);
    expect(text).toMatch(/Informacja handlowa od CPOP NIE/);
    expect(text).toContain('Zgłoszono 01.07.2026, 23:30');
    expect(text).toContain('Dane medyczne (ankieta zdrowotna) nie są przekazywane.');
  });

  it('czas zgłoszenia zimą liczony w czasie zimowym', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-12-31T23:30:00Z'));

    await post(validBody());

    expect(mailText(mailTo(AGENT_ADDRESS).html)).toContain('Zgłoszono 01.01.2027, 00:30');
  });

  it('pola spoza schematu (np. odpowiedzi z ankiety) nie trafiają do żadnego maila ani do logów', async () => {
    const body = { ...validBody(), ankieta: ['ZNACZNIK-ANKIETY'], odpowiedzi: { pytanie_1: 'ZNACZNIK-ANKIETY' } };

    const res = await post(body);

    expect(res.status).toBe(200);
    for (const mail of sentMails()) {
      expect(JSON.stringify(mail)).not.toContain('ZNACZNIK-ANKIETY');
    }
    expect(JSON.stringify([...consoleError.mock.calls, ...consoleWarn.mock.calls])).not.toContain('ZNACZNIK-ANKIETY');
  });

  it('region jest opcjonalny', async () => {
    const { region: _region, ...body } = validBody();
    void _region;

    const res = await post(body);

    expect(res.status).toBe(200);
    expect(mailText(mailTo(AGENT_ADDRESS).html)).not.toContain('Region');
  });
});

describe('POST /api/oferta — dokumenty', () => {
  it('brak wymaganego dokumentu: maile wychodzą, agent dostaje ostrzeżenie z nazwą dokumentu', async () => {
    mocks.loadOfferDocuments.mockResolvedValue(OWU_ONLY);
    const body = validBody();

    const res = await post(body);

    expect(res.status).toBe(200);
    expect(mocks.send).toHaveBeenCalledTimes(2);

    const agentText = mailText(mailTo(AGENT_ADDRESS).html);
    expect(agentText).toContain('UWAGA: klient NIE otrzymał kompletu dokumentów');
    expect(agentText).toContain(`${DYSTRYBUTOR.title} — dokument wymagany`);
    expect(agentText).not.toContain(`${OWU.title} — dokument wymagany`);

    const customer = mailTo(body.email);
    expect(customer.attachments).toEqual(OWU_ONLY.attachments);
    const customerText = mailText(customer.html);
    expect(customerText).toContain(OWU.title);
    expect(customerText).not.toContain(DYSTRYBUTOR.title);
    expect(customerText).toContain('Pozostałe dokumenty przekaże agent przy kontakcie.');
  });

  it('żaden dokument niedostępny: maile nadal wychodzą, ostrzeżenie wymienia wszystkie', async () => {
    mocks.loadOfferDocuments.mockResolvedValue(NO_DOCUMENTS);
    const body = validBody();

    const res = await post(body);

    expect(res.status).toBe(200);
    expect(mocks.send).toHaveBeenCalledTimes(2);
    expect(mailTo(body.email).attachments).toEqual([]);

    const agentText = mailText(mailTo(AGENT_ADDRESS).html);
    expect(agentText).toContain(OWU.title);
    expect(agentText).toContain(DYSTRYBUTOR.title);
    expect(mailText(mailTo(body.email).html)).toContain('nie udało się dołączyć dokumentów');
  });

  it('linki w mailu klienta tylko z SITE_URL', async () => {
    vi.stubEnv('SITE_URL', 'https://www.serwis.example.test/');
    const body = validBody();

    await post(body);

    const html = mailTo(body.email).html;
    expect(html).toContain('href="https://www.serwis.example.test/dokumenty/owu.pdf"');
    expect(html).toContain('href="https://www.serwis.example.test/informacja-o-agencie"');
  });

  it('bez SITE_URL mail nie zawiera linków do serwisu — adres z żądania (Host) nie jest używany', async () => {
    const body = validBody();

    await post(body, { Host: 'inny-host.example.test', 'X-Forwarded-Host': 'inny-host.example.test' });

    for (const mail of sentMails()) {
      expect(mail.html).not.toContain('kalkulator.example.test');
      expect(mail.html).not.toContain('inny-host.example.test');
      expect(mail.html).not.toContain('/dokumenty/owu.pdf');
      expect(mail.html).not.toContain('/informacja-o-agencie');
    }
  });

  it.each([
    ['inny schemat', 'ftp://serwis.example.test'],
    ['brak schematu', 'serwis.example.test'],
  ])('SITE_URL, który nie jest adresem http(s) (%s), jest traktowany jak brak', async (_label, value) => {
    vi.stubEnv('SITE_URL', value);
    const body = validBody();

    await post(body);

    expect(mailTo(body.email).html).not.toContain('serwis.example.test');
    expect(mailTo(body.email).html).not.toContain('/dokumenty/owu.pdf');
  });
});

describe('POST /api/oferta — weryfikacja Turnstile', () => {
  it('brak tokenu → 400, bez pytania siteverify i bez wysyłki', async () => {
    const { turnstileToken: _token, ...body } = validBody();
    void _token;

    await expectRejected(await post(body), 400);
    expect(fetchMock).not.toHaveBeenCalled();
    expectNothingSent();
  });

  it.each([
    ['pusty', ''],
    ['dłuższy niż 2048 znaków', 'x'.repeat(2049)],
    ['nie-napis', 12345],
  ])('token %s → 400', async (_label, turnstileToken) => {
    await expectRejected(await post({ ...validBody(), turnstileToken }), 400);
    expect(fetchMock).not.toHaveBeenCalled();
    expectNothingSent();
  });

  it('siteverify odpowiada success: false → 403, Resend nie jest wywoływany', async () => {
    siteverifyAnswers({ success: false, 'error-codes': ['invalid-input-response'] });

    const message = await expectRejected(await post(validBody()), 403);

    expect(message).toMatch(/Weryfikacja antybotowa/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectNothingSent();
  });

  it('błąd sieci przy siteverify → 403, nic nie jest wysyłane', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));

    await expectRejected(await post(validBody()), 403);
    expectNothingSent();
  });

  it('siteverify zwraca coś innego niż JSON → 403', async () => {
    fetchMock.mockResolvedValue(new Response('<html>Bad gateway</html>', { status: 502 }));

    await expectRejected(await post(validBody()), 403);
    expectNothingSent();
  });

  it('żadna zmienna środowiskowa nie wyłącza weryfikacji', async () => {
    siteverifyAnswers({ success: false });
    for (const name of ['SKIP_TURNSTILE', 'TURNSTILE_SKIP', 'TURNSTILE_DISABLED', 'DISABLE_TURNSTILE']) {
      vi.stubEnv(name, 'true');
    }
    vi.stubEnv('NODE_ENV', 'development');

    await expectRejected(await post(validBody()), 403);
    expectNothingSent();
  });
});

describe('POST /api/oferta — walidacja danych', () => {
  it('wariant nieoferowany dla grupy wiekowej i produktu → 400', async () => {
    const body = validBody();
    body.oferta = { ...body.oferta, ageGroup: 'B', product: 'dla_nas', variant: 'prestiz' };

    await expectRejected(await post(body), 400);
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it.each([
    ['grupa wiekowa', { ageGroup: 'C' }],
    ['produkt', { product: 'dla_firmy' }],
    ['wariant', { variant: 'platynowy' }],
    ['dodatki jako lista', { addons: ['MediPlan'] }],
    ['flaga dodatku jako napis', { addons: { mediplan: 'true', medicalAssistance: false, globalDoctors: false } }],
  ])('nieznana wartość w ofercie (%s) → 400', async (_label, override) => {
    const body = validBody();

    await expectRejected(await post({ ...body, oferta: { ...body.oferta, ...override } }), 400);
    expect(fetchMock).not.toHaveBeenCalled();
    expectNothingSent();
  });

  it.each(MANDATORY)('brak zgody obowiązkowej %s → 400', async (consent) => {
    const refused = validBody();
    refused.zgody[consent] = false;
    await expectRejected(await post(refused), 400);

    const omitted = validBody();
    delete omitted.zgody[consent];
    await expectRejected(await post(omitted), 400);

    const notBoolean = validBody();
    notBoolean.zgody[consent] = 'true';
    await expectRejected(await post(notBoolean), 400);

    expect(fetchMock).not.toHaveBeenCalled();
    expectNothingSent();
  });

  it('zgody dobrowolne mogą być odrzucone, ale muszą być wartością logiczną', async () => {
    const declined = validBody();
    Object.assign(declined.zgody, { zgoda_7: false, zgoda_8: false, zgoda_10: false });
    expect((await post(declined)).status).toBe(200);

    const invalid = validBody();
    invalid.zgody.zgoda_8 = 'tak';
    await expectRejected(await post(invalid), 400);
  });

  it.each([
    ['adres strony', 'http://example.test'],
    ['domena', 'www.example.test'],
    ['tekst z ukośnikiem', 'Jan/Anna'],
    ['znaczniki HTML', '<b>Jan</b>'],
    ['cyfry', 'Jan 2'],
    ['nowa linia', 'Jan\nKowalski'],
    ['51 znaków', 'a'.repeat(51)],
    ['1 znak', 'J'],
    ['same spacje', '    '],
    ['liczba', 42],
  ])('imię lub nazwisko: %s → 400', async (_label, value) => {
    await expectRejected(await post({ ...validBody(), imie: value }), 400);
    await expectRejected(await post({ ...validBody(), nazwisko: value }), 400);
    expect(fetchMock).not.toHaveBeenCalled();
    expectNothingSent();
  });

  it.each([
    ['Łucja', 'Żółć-Gęślą'],
    ['Anna Maria', "O'Connor"],
    ['Jean-Luc', 'D’Arc'],
    ['Jan K.', 'van der Berg'],
    ['a'.repeat(50), 'Bo'],
  ])('przyjmuje imię „%s" i nazwisko „%s"', async (imie, nazwisko) => {
    expect((await post({ ...validBody(), imie, nazwisko })).status).toBe(200);
  });

  it.each([
    ['bez małpy', 'klientka.example.test'],
    ['z nową linią', 'a@example.test\nb@example.test'],
    ['dwa adresy', 'a@example.test, b@example.test'],
    ['dłuższy niż 254 znaki', `${'a'.repeat(250)}@example.test`],
  ])('e-mail %s → 400', async (_label, email) => {
    await expectRejected(await post({ ...validBody(), email }), 400);
    expectNothingSent();
  });

  it.each([
    ['za krótki', '12345'],
    ['z literami', '+48 500 600 abc'],
    ['za długi', '1'.repeat(16)],
  ])('telefon %s → 400', async (_label, telefon) => {
    await expectRejected(await post({ ...validBody(), telefon }), 400);
    expectNothingSent();
  });

  it.each([
    ['dłuższy niż 60 znaków', 'a'.repeat(61)],
    ['z adresem strony', 'https://example.test'],
    ['ze znacznikami', '<i>Kraków</i>'],
  ])('region %s → 400', async (_label, region) => {
    await expectRejected(await post({ ...validBody(), region }), 400);
    expectNothingSent();
  });

  it('odpowiedź 400 nie zdradza, które pole jest błędne', async () => {
    const res = await post({ ...validBody(), imie: 'http://example.test', email: 'zly' });
    const text = await res.clone().text();

    await expectRejected(res, 400);
    expect(text).not.toMatch(/imie|email|issues|path|expected|invalid_/i);
  });
});

describe('POST /api/oferta — treść żądania', () => {
  it('treść większa niż 16 KB → 400', async () => {
    const body = { ...validBody(), wypelniacz: 'x'.repeat(17 * 1024) };

    await expectRejected(await post(body), 400);
    expect(fetchMock).not.toHaveBeenCalled();
    expectNothingSent();
  });

  it('zadeklarowany Content-Length ponad limit → 400', async () => {
    await expectRejected(await post(validBody(), { 'Content-Length': String(64 * 1024) }), 400);
    expectNothingSent();
  });

  it('treść tuż poniżej limitu jest przyjmowana', async () => {
    const body = { ...validBody(), wypelniacz: '' };
    const room = 16 * 1024 - Buffer.byteLength(JSON.stringify(body));
    body.wypelniacz = 'x'.repeat(room);
    expect(Buffer.byteLength(JSON.stringify(body))).toBe(16 * 1024);

    expect((await post(body)).status).toBe(200);
  });

  it.each([
    ['nie-JSON', 'imie=Jan&nazwisko=Kowalski'],
    ['urwany JSON', '{"imie":"Jan"'],
    ['pusta treść', ''],
    ['JSON, który nie jest obiektem', '"tekst"'],
    ['null', 'null'],
    ['tablica', '[]'],
  ])('%s → 400', async (_label, raw) => {
    await expectRejected(await post(raw), 400);
    expect(fetchMock).not.toHaveBeenCalled();
    expectNothingSent();
  });

  it('typ treści inny niż application/json → 400', async () => {
    await expectRejected(await post(validBody(), { 'Content-Type': 'text/plain' }), 400);
    await expectRejected(await post(validBody(), { 'Content-Type': 'application/x-www-form-urlencoded' }), 400);
    expectNothingSent();
  });
});

describe('POST /api/oferta — błędy konfiguracji i wysyłki', () => {
  it.each(['TURNSTILE_SECRET_KEY', 'RESEND_API_KEY', 'AGENT_EMAIL'])(
    'brak %s → ogólne 500, nic nie jest wysyłane',
    async (name) => {
      vi.stubEnv(name, '');

      const res = await post(validBody());
      const text = await res.clone().text();
      const message = await expectRejected(res, 500);

      expect(message).toBe('Nie udało się wysłać zapytania. Spróbuj ponownie później.');
      expect(text).not.toContain(name);
      expect(text).not.toMatch(/true|false|has[A-Z]/);
      expect(fetchMock).not.toHaveBeenCalled();
      expectNothingSent();
      expect(mocks.resendKeys).toEqual([]);
      // Nazwa brakującej zmiennej trafia tylko do logów.
      expect(consoleError.mock.calls.flat().join(' ')).toContain(name);
    },
  );

  it('błąd zwrócony przez Resend → ogólne 502 bez adresu nadawcy i bez szczegółów dostawcy', async () => {
    mocks.send.mockResolvedValue({
      data: null,
      error: {
        name: 'validation_error',
        statusCode: 403,
        message: `The poczta.example.test domain is not verified. Sender ${FROM_ADDRESS} rejected (re_test_fikcyjny_klucz).`,
      },
    });

    const res = await post(validBody());
    const text = await res.clone().text();
    const message = await expectRejected(res, 502);

    expect(message).toBe('Nie udało się wysłać zapytania. Spróbuj ponownie później.');
    for (const secret of [FROM_ADDRESS, 'poczta.example.test', 'validation_error', 'not verified', 'Resend', 're_test', AGENT_ADDRESS, 'detail', 'statusCode']) {
      expect(text).not.toContain(secret);
    }
  });

  it('wyjątek z klienta Resend → ogólne 502', async () => {
    mocks.send.mockRejectedValue(new Error(`connect ECONNRESET api.resend.com from ${FROM_ADDRESS}`));

    const res = await post(validBody());
    const text = await res.clone().text();

    await expectRejected(res, 502);
    expect(text).not.toContain('ECONNRESET');
    expect(text).not.toContain('resend');
    expect(text).not.toContain(FROM_ADDRESS);
    expect(text).not.toMatch(/\bat .+:\d+:\d+/); // brak śladu stosu
  });

  it('błąd maila do klienta (po udanym mailu do agenta) → 502', async () => {
    mocks.send
      .mockResolvedValueOnce({ data: { id: 'agent' }, error: null })
      .mockResolvedValueOnce({ data: null, error: { name: 'rate_limit_exceeded', message: 'Too many requests', statusCode: 429 } });

    await expectRejected(await post(validBody()), 502);
    expect(mocks.send).toHaveBeenCalledTimes(2);
  });

  it('logi błędów nie zawierają imienia, nazwiska, e-maila ani telefonu klienta', async () => {
    const body = validBody();
    mocks.loadOfferDocuments.mockResolvedValue(OWU_ONLY);
    mocks.send.mockResolvedValue({
      data: null,
      error: { name: 'validation_error', statusCode: 422, message: `Invalid recipient ${body.email}` },
    });

    await post(body);
    siteverifyAnswers({ success: false, 'error-codes': ['invalid-input-response'] });
    await post(body);
    await post({ ...body, imie: 'http://example.test' });

    const logged = JSON.stringify([...consoleError.mock.calls, ...consoleWarn.mock.calls]);
    expect(consoleError).toHaveBeenCalled();
    for (const personal of [body.imie, body.nazwisko, body.email, body.telefon, '500 600 700']) {
      expect(logged).not.toContain(personal);
    }
  });
});

describe('POST /api/oferta — limit zgłoszeń', () => {
  it('bez bindingu limitera żądanie jest obsługiwane normalnie', async () => {
    mocks.cloudflareEnv.current = {};
    expect((await post(validBody())).status).toBe(200);

    mocks.cloudflareEnv.current = null;
    expect((await post(validBody())).status).toBe(200);
  });

  it('limit przekroczony → 429 przed weryfikacją Turnstile; kluczem jest adres IP klienta', async () => {
    const limit = vi.fn(async () => ({ success: false }));
    mocks.cloudflareEnv.current = { OFERTA_RATE_LIMITER: { limit } };

    const res = await post(validBody());

    const message = await expectRejected(res, 429);
    expect(message).toMatch(/Zbyt wiele prób/);
    expect(res.headers.get('Retry-After')).toBe('60');
    expect(limit).toHaveBeenCalledWith({ key: CLIENT_IP });
    expect(fetchMock).not.toHaveBeenCalled();
    expectNothingSent();
  });

  it('w limicie → zgłoszenie przechodzi dalej', async () => {
    const limit = vi.fn(async () => ({ success: true }));
    mocks.cloudflareEnv.current = { OFERTA_RATE_LIMITER: { limit } };

    expect((await post(validBody())).status).toBe(200);
    expect(limit).toHaveBeenCalledTimes(1);
  });

  it('awaria limitera nie blokuje zgłoszeń', async () => {
    const limit = vi.fn(async () => { throw new Error('limiter niedostępny'); });
    mocks.cloudflareEnv.current = { OFERTA_RATE_LIMITER: { limit } };

    expect((await post(validBody())).status).toBe(200);
  });
});

describe('POST /api/oferta — żądania z obcych stron', () => {
  it('Sec-Fetch-Site inne niż same-origin → 403 bez zużywania limitu i bez wysyłki', async () => {
    const limit = vi.fn(async () => ({ success: true }));
    mocks.cloudflareEnv.current = { OFERTA_RATE_LIMITER: { limit } };

    for (const site of ['cross-site', 'same-site', 'none']) {
      await expectRejected(await post(validBody(), { 'Sec-Fetch-Site': site }), 403);
    }

    expect(limit).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expectNothingSent();
  });

  it('Origin z innego hosta → 403', async () => {
    const res = await post(validBody(), { Host: 'kalkulator.example.test', Origin: 'https://inna-strona.example.org' });

    await expectRejected(res, 403);
    expectNothingSent();
  });

  it('formularz z tej samej strony przechodzi', async () => {
    const res = await post(validBody(), {
      Host: 'kalkulator.example.test',
      Origin: 'https://kalkulator.example.test',
      'Sec-Fetch-Site': 'same-origin',
    });

    expect(res.status).toBe(200);
  });

  it.each([
    'text/plain;x=application/json',
    'multipart/form-data; boundary=application/json',
    'application/jsonp',
  ])('typ treści „%s" nie jest traktowany jak JSON → 400', async (contentType) => {
    await expectRejected(await post(validBody(), { 'Content-Type': contentType }), 400);
    expectNothingSent();
  });

  it('application/json z parametrem charset jest przyjmowany', async () => {
    expect((await post(validBody(), { 'Content-Type': 'application/json; charset=utf-8' })).status).toBe(200);
  });
});

describe('POST /api/oferta — reguły pól (uzupełnienie)', () => {
  it.each([
    ['cyfry i tekst', 'Pilne. Zadzwon 700 800 900, haslo 1234'],
    ['sama domena', 'www.przyklad.pl'],
    ['kropka przed literą', 'bit.ly'],
  ])('region: %s → 400', async (_label, region) => {
    await expectRejected(await post({ ...validBody(), region }), 400);
    expectNothingSent();
  });

  it.each([
    ['same myślniki', '---------'],
    ['za mało cyfr', '+48 500 600'],
    ['podwójny odstęp', '500  600  700'],
    ['znak nowej linii w środku', '500 600\n700'],
  ])('telefon: %s → 400', async (_label, telefon) => {
    await expectRejected(await post({ ...validBody(), telefon }), 400);
  });

  it.each(['500600700', '500-600-700', '+48 500 600 700', '0048 500 600 700'])('telefon „%s" jest przyjmowany', async (telefon) => {
    expect((await post({ ...validBody(), telefon })).status).toBe(200);
  });

  it.each([
    ['niewidoczne znaki zamiast liter', 'ㅤㅤㅤ'],
    ['zdanie zamiast imienia', 'Prosimy pilnie oddzwonić w sprawie zwrotu'],
    ['inny alfabet niż łaciński i cyrylica', '李小龍'],
  ])('imię: %s → 400', async (_label, imie) => {
    await expectRejected(await post({ ...validBody(), imie }), 400);
    expectNothingSent();
  });

  it.each(['Anna Maria', "D'Angelo", 'Олена', 'Jan K.', 'Zoë'])('imię „%s" jest przyjmowane', async (imie) => {
    expect((await post({ ...validBody(), imie })).status).toBe(200);
  });
});

describe('POST /api/oferta — limity (uzupełnienie)', () => {
  it('adres IPv6 jest liczony całą podsiecią /64', async () => {
    const limit = vi.fn(async (options: { key: string }) => ({ success: options.key.length > 0 }));
    mocks.cloudflareEnv.current = { OFERTA_RATE_LIMITER: { limit } };

    await post(validBody(), { 'CF-Connecting-IP': '2001:db8:1:2::1' });
    await post(validBody(), { 'CF-Connecting-IP': '2001:0db8:0001:0002:aaaa:bbbb:cccc:dddd' });

    expect(limit.mock.calls.map(([options]) => options.key)).toEqual([
      '2001:db8:1:2::/64',
      '2001:db8:1:2::/64',
    ]);
  });

  it('limit na adresata: 429 dopiero po udanej weryfikacji, kluczem jest adres małymi literami', async () => {
    const perIp = vi.fn(async () => ({ success: true }));
    const perRecipient = vi.fn(async () => ({ success: false }));
    mocks.cloudflareEnv.current = {
      OFERTA_RATE_LIMITER: { limit: perIp },
      OFERTA_RECIPIENT_LIMITER: { limit: perRecipient },
    };

    const res = await post({ ...validBody(), email: 'Zaneta.Klientka@Poczta.Example.Test' });

    await expectRejected(res, 429);
    expect(fetchMock).toHaveBeenCalledTimes(1); // siteverify już się odbył
    expect(perRecipient).toHaveBeenCalledWith({ key: 'mail:zaneta.klientka@poczta.example.test' });
    expectNothingSent();
  });

  it('limit na adresata nie jest sprawdzany, gdy weryfikacja Turnstile się nie powiedzie', async () => {
    const perRecipient = vi.fn(async () => ({ success: true }));
    mocks.cloudflareEnv.current = { OFERTA_RECIPIENT_LIMITER: { limit: perRecipient } };
    siteverifyAnswers({ success: false, 'error-codes': ['invalid-input-response'] });

    await expectRejected(await post(validBody()), 403);
    expect(perRecipient).not.toHaveBeenCalled();
  });
});

describe('POST /api/oferta — logi (uzupełnienie)', () => {
  it('komunikat dostawcy poczty nie trafia do logów, nawet gdy cytuje adres z apostrofem', async () => {
    const email = "anna.kowalska'x@poczta.example.test";
    mocks.send.mockResolvedValue({
      data: null,
      error: { name: 'validation_error', statusCode: 422, message: `Invalid recipient ${email} (Anna Kowalska)` },
    });

    await expectRejected(await post({ ...validBody(), email }), 502);

    const logged = JSON.stringify([...consoleError.mock.calls, ...consoleWarn.mock.calls]);
    expect(logged).toContain('validation_error');
    expect(logged).toContain('422');
    expect(logged).not.toContain('anna.kowalska');
    expect(logged).not.toContain('Invalid recipient');
  });
});
