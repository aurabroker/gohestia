export async function POST(request: Request) {
  let token: string | undefined;
  try {
    ({ token } = (await request.json()) as { token?: string });
  } catch {
    return new Response(JSON.stringify({ error: 'Nieprawidłowe dane' }), { status: 400 });
  }
  if (!token) {
    return new Response(JSON.stringify({ error: 'Brak tokenu' }), { status: 400 });
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('Missing TURNSTILE_SECRET_KEY');
    return new Response(JSON.stringify({ error: 'Konfiguracja Turnstile' }), { status: 500 });
  }

  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);

  const result = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body: formData }
  );
  const outcome = await result.json() as { success: boolean };

  if (!outcome.success) {
    return new Response(JSON.stringify({ error: 'Weryfikacja nieudana' }), { status: 403 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
