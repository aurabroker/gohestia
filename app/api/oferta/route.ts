import { Resend } from 'resend';
import { render } from '@react-email/components';
import * as React from 'react';
import { OfertaEmailTemplate } from '@/components/email/oferta-template';
import { AgentEmailTemplate } from '@/components/email/agent-template';
import { loadOfferDocuments } from '@/lib/attachments';
import { ofertaRequestSchema } from '@/lib/oferta-schema';
import { resolveOffer } from '@/lib/offer';
import { clientKey, isWithinRateLimit } from '@/lib/rate-limit';
import { getSiteUrl } from '@/lib/site-url';
import { verifyTurnstileToken } from '@/lib/turnstile';

/** Maksymalny rozmiar treści żądania. Poprawny formularz mieści się w ~1 KB. */
const MAX_BODY_BYTES = 16 * 1024;

/** Jedyne komunikaty, jakie endpoint zwraca klientowi przy błędzie. */
const ERRORS = {
  invalid:   'Nieprawidłowe dane formularza.',
  antiBot:   'Weryfikacja antybotowa nie powiodła się. Wykonaj ją ponownie i wyślij formularz jeszcze raz.',
  rateLimit: 'Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.',
  send:      'Nie udało się wysłać zapytania. Spróbuj ponownie później.',
} as const;

function json(body: unknown, status: number, headers?: Record<string, string>) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  });
}

const INVALID_BODY = Symbol('invalid-body');

/**
 * Czyta treść żądania jako JSON, przerywając po przekroczeniu limitu rozmiaru.
 * Zwraca `INVALID_BODY` dla treści zbyt dużej, nie-JSON albo o innym typie
 * niż `application/json`.
 */
async function readJsonBody(req: Request): Promise<unknown | typeof INVALID_BODY> {
  const mediaType = req.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  if (mediaType !== 'application/json') return INVALID_BODY;

  const declaredLength = Number(req.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return INVALID_BODY;
  if (!req.body) return INVALID_BODY;

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => undefined);
        return INVALID_BODY;
      }
      chunks.push(value);
    }
  } catch {
    return INVALID_BODY;
  }

  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) as unknown;
  } catch {
    return INVALID_BODY;
  }
}

/** Czas zgłoszenia w strefie Europe/Warsaw, np. „18.11.2026, 15:42". */
function formatWarsawTime(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  return `${part('day')}.${part('month')}.${part('year')}, ${part('hour')}:${part('minute')}`;
}

/**
 * Opis błędu do logów workera: wyłącznie nazwa i kod. Komunikat dostawcy
 * poczty bywa cytatem z żądania (adres, nazwisko), więc go nie logujemy.
 */
function describeError(err: unknown): string {
  if (typeof err !== 'object' || err === null) return 'nieznany błąd';
  const { name, statusCode } = err as { name?: unknown; statusCode?: unknown };
  return [
    typeof name === 'string' ? name.slice(0, 60) : 'Error',
    typeof statusCode === 'number' ? statusCode : '',
  ].filter(Boolean).join(' | ');
}

/**
 * Czy żądanie przyszło z innej strony niż nasz formularz. Przeglądarki
 * dołączają `Sec-Fetch-Site`; dodatkowo porównujemy `Origin` z hostem.
 * Klienty bez tych nagłówków przechodzą dalej — zatrzyma je Turnstile.
 */
function isCrossSite(req: Request): boolean {
  const site = req.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin') return true;

  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

export async function POST(req: Request) {
  // Formularz wysyła żądanie z tej samej strony; cudze strony odrzucamy od razu,
  // żeby nie zużywały limitu zgłoszeń odwiedzającego.
  if (isCrossSite(req)) return json({ error: ERRORS.invalid }, 403);

  const clientIp = req.headers.get('cf-connecting-ip');

  // Limit zgłoszeń na adres IP (tylko gdy worker ma binding limitera).
  if (!(await isWithinRateLimit('OFERTA_RATE_LIMITER', clientKey(clientIp)))) {
    return json({ error: ERRORS.rateLimit }, 429, { 'Retry-After': '60' });
  }

  // 1. Rozmiar i format treści.
  const body = await readJsonBody(req);
  if (body === INVALID_BODY) return json({ error: ERRORS.invalid }, 400);

  // 2. Walidacja pól (dane kontaktowe, wybory, komplet zgód, token).
  const parsed = ofertaRequestSchema.safeParse(body);
  if (!parsed.success) return json({ error: ERRORS.invalid }, 400);
  const { imie, nazwisko, email, telefon, region, zgody, turnstileToken } = parsed.data;

  // Konfiguracja wymagana do obsługi zgłoszenia — bez niej nic nie wysyłamy.
  const apiKey = process.env.RESEND_API_KEY;
  const agentEmail = process.env.AGENT_EMAIL;
  const missingConfig = [
    !process.env.TURNSTILE_SECRET_KEY && 'TURNSTILE_SECRET_KEY',
    !apiKey && 'RESEND_API_KEY',
    !agentEmail && 'AGENT_EMAIL',
  ].filter(Boolean);
  if (!apiKey || !agentEmail || missingConfig.length > 0) {
    console.error(`Brak konfiguracji: ${missingConfig.join(', ')}`);
    return json({ error: ERRORS.send }, 500);
  }

  // 3. Weryfikacja Turnstile — zawsze, przed renderowaniem maili, czytaniem
  //    załączników i jakimkolwiek wywołaniem Resend.
  if (!(await verifyTurnstileToken(turnstileToken, clientIp))) {
    return json({ error: ERRORS.antiBot }, 403);
  }

  // Limit maili na jednego adresata — liczony dopiero po udanej weryfikacji,
  // żeby nie dało się nim zablokować cudzego adresu bez ważnego tokenu.
  if (!(await isWithinRateLimit('OFERTA_RECIPIENT_LIMITER', `mail:${email.toLowerCase()}`))) {
    return json({ error: ERRORS.rateLimit }, 429, { 'Retry-After': '60' });
  }

  // 4. Oferta liczona po stronie serwera z taryfy. Klient przysyła tylko wybory.
  const oferta = resolveOffer(parsed.data.oferta);
  if (!oferta) return json({ error: ERRORS.invalid }, 400);

  // 5. Treść maili.
  const fromEmail = process.env.FROM_EMAIL ?? 'ergo@beautypolisa.eu';
  const from = `ERGO Razem Kalkulator <${fromEmail}>`;
  let ofertaHtml: string;
  let agentHtml: string;
  let attachments: Awaited<ReturnType<typeof loadOfferDocuments>>['attachments'];
  try {
    const documents = await loadOfferDocuments(req.url);
    attachments = documents.attachments;
    if (documents.missing.length > 0) {
      console.error(`Nie dołączono dokumentów: ${documents.missing.map((d) => d.file).join(', ')}`);
    }

    // Szablony renderujemy do HTML sami — przekazanie `react` do Resend
    // wymagałoby pakietu `@react-email/render`, którego nie ma w zależnościach.
    [ofertaHtml, agentHtml] = await Promise.all([
      render(React.createElement(OfertaEmailTemplate, {
        imie,
        nazwisko,
        oferta,
        attachedDocuments: documents.attached.map((d) => d.title),
        documentsComplete: documents.missing.length === 0,
        siteUrl:           getSiteUrl(),
      })),
      render(React.createElement(AgentEmailTemplate, {
        imie,
        nazwisko,
        email,
        telefon,
        region,
        oferta,
        // Komplet zgód obowiązkowych gwarantuje walidacja w kroku 2.
        zgody: {
          marketingElektroniczny: zgody.zgoda_7,
          marketingErgoHestia:    zgody.zgoda_8,
          marketingCpop:          zgody.zgoda_10,
        },
        submittedAt:      formatWarsawTime(new Date()),
        missingDocuments: documents.missing.map((d) => ({ title: d.title, required: d.required })),
      })),
    ]);
  } catch (err) {
    console.error('Nie udało się przygotować maili:', describeError(err));
    return json({ error: ERRORS.send }, 500);
  }

  // 6. Wysyłka. Najpierw mail do agenta — klient dostaje potwierdzenie dopiero
  //    wtedy, gdy zgłoszenie na pewno dotarło do agenta.
  try {
    const resend = new Resend(apiKey);

    const agentResult = await resend.emails.send({
      from,
      to:      agentEmail,
      subject: `Nowe zapytanie: ${imie} ${nazwisko} — ${oferta.productLabel} ${oferta.variantLabel}`,
      html:    agentHtml,
    });
    if (agentResult.error) {
      console.error('Resend odrzucił mail do agenta:', describeError(agentResult.error));
      return json({ error: ERRORS.send }, 502);
    }

    const customerResult = await resend.emails.send({
      from,
      to:      email,
      subject: 'Twoja oferta ERGO Razem — podsumowanie',
      html:    ofertaHtml,
      attachments, // dokumenty PDF dostaje klient
    });
    if (customerResult.error) {
      console.error('Resend odrzucił mail do klienta:', describeError(customerResult.error));
      return json({ error: ERRORS.send }, 502);
    }
  } catch (err) {
    console.error('Błąd wysyłki maili:', describeError(err));
    return json({ error: ERRORS.send }, 502);
  }

  return json({ ok: true }, 200);
}
