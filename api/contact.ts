/**
 * Função serverless da Vercel: POST /api/contact
 * Recebe TODO contato do site e:
 *  1) manda e-mail para você (Gmail, via SMTP)    -> só para mensagens reais
 *  2) manda push no seu celular (Telegram)       -> só para mensagens reais (opcional)
 *  3) salva no Supabase (public.contact_messages) -> mensagens reais e cliques
 * Basta UM destino configurado. As chaves ficam só no servidor (Environment Variables da Vercel).
 */

import nodemailer from 'nodemailer';

const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

const SOURCES: Record<string, string> = {
  'formulario-email': 'Formulário (e-mail)',
  'formulario-whatsapp': 'Formulário (WhatsApp)',
  'orcamento-solucoes': 'Orçamento de soluções',
  'clique-whatsapp': 'Clique no WhatsApp',
  'clique-email': 'Clique no e-mail',
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  let body: any = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  } catch {
    return res.status(400).json({ error: 'Requisição inválida.' });
  }

  // honeypot: robôs preenchem, pessoas não
  if (clip(body.website, 200)) return res.status(200).json({ ok: true });

  const source = clip(body.source, 40) in SOURCES ? clip(body.source, 40) : 'formulario-email';
  const isClick = source.startsWith('clique-');

  const name = clip(body.name, 120);
  const company = clip(body.company, 120);
  const contact = clip(body.contact, 160);
  const service = clip(body.service, 160);
  const message = clip(body.message, 3000);

  // Mensagens reais precisam de nome + contato. Cliques não.
  if (!isClick && (name.length < 2 || (source !== 'formulario-whatsapp' && contact.length < 5))) {
    return res.status(400).json({ error: 'Preencha nome e um contato válido.' });
  }

  const GMAIL_USER = process.env.GMAIL_USER; // ex.: nvaldemir76@gmail.com
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD; // senha de app de 16 letras
  const TO = process.env.CONTACT_TO_EMAIL || GMAIL_USER || 'nvaldemir76@gmail.com';
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TG_CHAT = process.env.TELEGRAM_CHAT_ID;

  const canEmail = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD) && !isClick;
  const canTelegram = Boolean(TG_TOKEN && TG_CHAT) && !isClick;
  const canDb = Boolean(SUPABASE_URL && SUPABASE_KEY);

  if (!canEmail && !canTelegram && !canDb) {
    // cliques sem banco configurado: nada a fazer, não é erro para o visitante
    if (isClick) return res.status(204).end();
    return res.status(503).json({ error: 'Envio ainda não configurado no servidor.' });
  }

  const origem = SOURCES[source];
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const tasks: Promise<boolean>[] = [];

  if (canEmail) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });
    tasks.push(
      transporter
        .sendMail({
          from: `Portfólio <${GMAIL_USER}>`,
          to: TO,
          subject: `[${origem}] ${service || 'novo contato'} - ${name || 'sem nome'}`,
          ...(looksLikeEmail ? { replyTo: contact } : {}),
          html: `
            <h2>Novo contato pelo portfólio</h2>
            <p><b>Origem:</b> ${esc(origem)}</p>
            <p><b>Nome:</b> ${esc(name) || '-'}</p>
            <p><b>Empresa:</b> ${esc(company) || '-'}</p>
            <p><b>Contato:</b> ${esc(contact) || '-'}</p>
            <p><b>Assunto:</b> ${esc(service) || '-'}</p>
            <p><b>Mensagem:</b><br>${esc(message).replace(/\n/g, '<br>') || '-'}</p>`,
        })
        .then(() => true)
        .catch(() => false)
    );
  }

  if (canTelegram) {
    const text = [
      `📩 Novo contato (${origem})`,
      `Nome: ${name || '-'}`,
      company ? `Empresa: ${company}` : '',
      `Contato: ${contact || '-'}`,
      service ? `Assunto: ${service}` : '',
      message ? `\n${message.slice(0, 900)}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    tasks.push(
      fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT, text }),
      })
        .then((r) => r.ok)
        .catch(() => false)
    );
  }

  if (canDb) {
    tasks.push(
      fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY as string,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          name: name || '(clique)',
          company: company || null,
          contact: contact || '-',
          service: service || null,
          message: message || null,
          source,
        }),
      })
        .then((r) => r.ok)
        .catch(() => false)
    );
  }

  const results = await Promise.all(tasks);
  if (!results.some(Boolean)) {
    if (isClick) return res.status(204).end();
    return res.status(502).json({ error: 'Não consegui enviar agora.' });
  }
  return res.status(200).json({ ok: true });
}
