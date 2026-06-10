export const runtime = 'edge';

import { Resend } from 'resend';
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

export async function POST(req: Request) {
  const body = await req.json();
  const data = bodySchema.safeParse(body);
  if (!data.success) {
    return new Response('Bad Request', { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { imie, nazwisko, email, telefon, oferta } = data.data;
  const fromEmail = process.env.FROM_EMAIL ?? 'noreply@auraexpert.pl';

  try {
    await Promise.all([
      resend.emails.send({
        from:    `ERGO Razem Kalkulator <${fromEmail}>`,
        to:      email,
        subject: 'Twoja oferta ERGO Razem — podsumowanie',
        react:   React.createElement(OfertaEmailTemplate, { imie, nazwisko, oferta }),
      }),
      resend.emails.send({
        from:    `ERGO Razem Kalkulator <${fromEmail}>`,
        to:      process.env.AGENT_EMAIL!,
        subject: `Nowe zapytanie: ${imie} ${nazwisko} — ${oferta.product} ${oferta.variant}`,
        react:   React.createElement(AgentEmailTemplate, { imie, nazwisko, email, telefon, oferta }),
      }),
    ]);
  } catch (err) {
    console.error('Email send error:', err);
    return new Response(JSON.stringify({ error: 'Email error' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
