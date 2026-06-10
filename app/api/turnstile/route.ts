export const runtime = 'edge';

export async function POST(request: Request) {
  const { token } = await request.json() as { token: string };

  const formData = new FormData();
  formData.append('secret', process.env.TURNSTILE_SECRET_KEY!);
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
