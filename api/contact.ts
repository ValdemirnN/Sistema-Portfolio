/**
 * Função serverless da Vercel: POST /api/contact
 * 1) envia o pedido para o seu e-mail (Resend)
 * 2) salva no banco (Supabase), tabela public.contact_messages
 * Basta UM dos dois estar configurado para o envio funcionar.
 * As chaves ficam só no servidor (Environment Variables da Vercel).
 */

const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

  // honeypot: robôs preenchem, pessoas não
  if (clip(body.website, 200)) return res.status(200).json({ ok: true });

  const name = clip(body.name, 120);
  const company = clip(body.company, 120);
  const contact = clip(body.contact, 160);
  const service = clip(body.service, 120);
  const message = clip(body.message, 3000);

  if (name.length < 2 || contact.length < 5) {
    return res.status(400).json({ error: 'Preencha nome e um contato válido.' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TO = process.env.CONTACT_TO_EMAIL || 'nvaldemir76@gmail.com';
  const FROM = process.env.CONTACT_FROM_EMAIL || 'Portfólio <onboarding@resend.dev>';
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!RESEND_API_KEY && !(SUPABASE_URL && SUPABASE_KEY)) {
    return res.status(503).json({ error: 'Envio ainda não configurado no servidor.' });
  }

  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);

  const tasks: Promise<boolean>[] = [];

  if (RESEND_API_KEY) {
    tasks.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM,
          to: [TO],
          subject: `Novo contato do portfólio: ${service || 'orçamento'} (${name})`,
          ...(looksLikeEmail ? { reply_to: contact } : {}),
          html: `
            <h2>Novo contato pelo portfólio</h2>
            <p><b>Nome:</b> ${esc(name)}</p>
            <p><b>Empresa:</b> ${esc(company) || '-'}</p>
            <p><b>Contato:</b> ${esc(contact)}</p>
            <p><b>Serviço:</b> ${esc(service) || '-'}</p>
            <p><b>Mensagem:</b><br>${esc(message).replace(/\n/g, '<br>') || '-'}</p>`,
        }),
      })
        .then((r) => r.ok)
        .catch(() => false)
    );
  }

  if (SUPABASE_URL && SUPABASE_KEY) {
    tasks.push(
      fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ name, company: company || null, contact, service: service || null, message: message || null }),
      })
        .then((r) => r.ok)
        .catch(() => false)
    );
  }

  const results = await Promise.all(tasks);
  if (!results.some(Boolean)) {
    return res.status(502).json({ error: 'Não consegui enviar agora.' });
  }
  return res.status(200).json({ ok: true });
}
