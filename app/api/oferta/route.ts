import { Resend } from 'resend';
import { render } from '@react-email/components';
import { z } from 'zod';
import { OfertaEmailTemplate } from '@/components/email/oferta-template';
import { AgentEmailTemplate } from '@/components/email/agent-template';
import * as React from 'react';

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

  try {
    // Render the templates to HTML ourselves. Passing `react` to Resend makes it
    // dynamically `import('@react-email/render')`, which is not a top-level
    // dependency here and fails to resolve at runtime. `render` from the
    // installed `@react-email/components` package does the same job reliably.
    const [ofertaHtml, agentHtml] = await Promise.all([
      render(React.createElement(OfertaEmailTemplate, { imie, nazwisko, oferta })),
      render(React.createElement(AgentEmailTemplate, { imie, nazwisko, email, telefon, oferta })),
    ]);

    const results = await Promise.all([
      resend.emails.send({
        from:    `ERGO Razem Kalkulator <${fromEmail}>`,
        to:      email,
        subject: 'Twoja oferta ERGO Razem — podsumowanie',
        html:    ofertaHtml,
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
