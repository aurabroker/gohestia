import { Resend } from 'resend';
import { render } from '@react-email/components';
import { z } from 'zod';
import { OfertaEmailTemplate } from '@/components/email/oferta-template';
import { AgentEmailTemplate } from '@/components/email/agent-template';
import { OFFER_DOCUMENTS } from '@/lib/data/documents';
import * as React from 'react';

interface EmailAttachment {
  filename: string;
  content: string; // base64
}

/**
 * Pobiera dokumenty PDF (z `public/dokumenty/`) i koduje je do base64,
 * żeby dołączyć jako załączniki. Brakujący lub nieosiągalny plik jest
 * pomijany (z ostrzeżeniem w logach) — mail wyśle się bez niego, zamiast
 * kończyć się błędem 500.
 */
async function buildAttachments(baseUrl: string): Promise<EmailAttachment[]> {
  const attachments = await Promise.all(
    OFFER_DOCUMENTS.map(async ({ file, filename }) => {
      try {
        const res = await fetch(`${baseUrl}/${file}`);
        if (!res.ok) {
          console.warn(`Pominięto załącznik (HTTP ${res.status}): ${file}`);
          return null;
        }
        const content = Buffer.from(await res.arrayBuffer()).toString('base64');
        return { filename, content };
      } catch (err) {
        console.warn(`Nie udało się pobrać załącznika: ${file}`, err);
        return null;
      }
    }),
  );
  return attachments.filter((a): a is EmailAttachment => a !== null);
}

const bodySchema = z.object({
  imie:     z.string().min(1),
  nazwisko: z.string().min(1),
  email:    z.string().email(),
  telefon:  z.string(),
  oferta: z.object({
    ageGroup:       z.enum(['A1', 'A2', 'B']),
    product:        z.enum(['dla_mnie', 'dla_nas', 'dla_rodziny']),
    variant:        z.string(),
    addons:         z.array(z.string()),
    monthlyPremium: z.number(),
  }),
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Nieprawidłowe dane' }, 400);
  }

  const data = bodySchema.safeParse(body);
  if (!data.success) {
    return json({ error: 'Bad Request' }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const agentEmail = process.env.AGENT_EMAIL;
  if (!apiKey || !agentEmail) {
    console.error('Missing email configuration:', {
      hasApiKey: Boolean(apiKey),
      hasAgentEmail: Boolean(agentEmail),
    });
    return json({ error: 'Email configuration missing' }, 500);
  }

  const resend = new Resend(apiKey);
  const { imie, nazwisko, email, telefon, oferta } = data.data;
  const fromEmail = process.env.FROM_EMAIL ?? 'noreply@auraexpert.pl';
  // Kanoniczny adres strony (dla pobierania PDF-ów). Pozwól nadpisać przez
  // SITE_URL; w przeciwnym razie użyj originu bieżącego żądania.
  const baseUrl = process.env.SITE_URL ?? new URL(req.url).origin;

  try {
    // Render the templates to HTML ourselves. Passing `react` to Resend makes it
    // dynamically `import('@react-email/render')`, which is not a top-level
    // dependency here and fails to resolve at runtime. `render` from the
    // installed `@react-email/components` package does the same job reliably.
    const [ofertaHtml, agentHtml, attachments] = await Promise.all([
      render(React.createElement(OfertaEmailTemplate, { imie, nazwisko, oferta })),
      render(React.createElement(AgentEmailTemplate, { imie, nazwisko, email, telefon, oferta })),
      buildAttachments(baseUrl),
    ]);

    const results = await Promise.all([
      resend.emails.send({
        from:        `ERGO Razem Kalkulator <${fromEmail}>`,
        to:          email,
        subject:     'Twoja oferta ERGO Razem — podsumowanie',
        html:        ofertaHtml,
        attachments, // klient (User) dostaje dokumenty PDF
      }),
      resend.emails.send({
        from:    `ERGO Razem Kalkulator <${fromEmail}>`,
        to:      agentEmail,
        subject: `Nowe zapytanie: ${imie} ${nazwisko} — ${oferta.product} ${oferta.variant}`,
        html:    agentHtml,
      }),
    ]);

    const failed = results.find((r) => r.error);
    if (failed) {
      console.error('Resend API error:', failed.error);
      return json({ error: 'Email error' }, 500);
    }
  } catch (err) {
    console.error('Email send error:', err);
    return json({ error: 'Email error' }, 500);
  }

  return json({ ok: true }, 200);
}
