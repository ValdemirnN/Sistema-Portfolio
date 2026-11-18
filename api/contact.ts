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

/** Rótulos mostrados no e-mail e no Telegram (SOURCES acima continua sendo o que vai para o banco). */
const ORIGIN_LABELS: Record<string, string> = {
  'formulario-email': 'Formulário do site · prefere resposta por e-mail',
  'formulario-whatsapp': 'Formulário do site · prefere resposta por WhatsApp',
  'orcamento-solucoes': 'Pedido de orçamento de soluções',
  'clique-whatsapp': 'Clique no WhatsApp',
  'clique-email': 'Clique no e-mail',
};

const SITE_URL = (process.env.SITE_URL || 'https://valdemir-nunes.vercel.app').replace(/\/$/, '');

/** Transforma um telefone brasileiro digitado de qualquer jeito em link do WhatsApp (ou null). */
function whatsappFromContact(contact: string): string | null {
  const digits = contact.replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) return `https://wa.me/55${digits}`;
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) return `https://wa.me/${digits}`;
  return null;
}

interface MailData {
  origin: string;
  name: string;
  company: string;
  contact: string;
  service: string;
  message: string;
  isEmail: boolean;
}

function buildEmail(d: MailData) {
  const receivedAt = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Fortaleza',
    dateStyle: 'long',
    timeStyle: 'short',
  });
  const topic = d.service || 'Contato geral';
  const who = d.name || 'Visitante sem nome';
  const waLink = whatsappFromContact(d.contact);

  const subject = `📩 Novo contato no portfólio · ${topic} · ${who}`;

  const row = (label: string, value: string, last = false) => `
    <tr>
      <td style="padding:12px 0;${last ? '' : 'border-bottom:1px solid #E2E8F0;'}width:120px;vertical-align:top;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#64748B;">${label}</td>
      <td style="padding:12px 0;${last ? '' : 'border-bottom:1px solid #E2E8F0;'}vertical-align:top;font-size:15px;color:#0F172A;">${value}</td>
    </tr>`;

  const button = (href: string, label: string, bg: string) =>
    `<a href="${href}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;border-radius:10px;background:${bg};color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;">${label}</a>`;

  const buttons = [
    d.isEmail
      ? button(
          `mailto:${encodeURIComponent(d.contact).replace(/%40/g, '@')}?subject=${encodeURIComponent(`Re: ${topic}`)}`,
          'Responder por e-mail',
          '#2563EB'
        )
      : '',
    waLink
      ? button(
          `${waLink}?text=${encodeURIComponent(
            `Olá, ${d.name || 'tudo bem'}! Aqui é o Valdemir Nunes. Recebi seu contato pelo portfólio sobre "${topic}" e vim te responder.`
          )}`,
          'Chamar no WhatsApp',
          '#16A34A'
        )
      : '',
  ].join('');

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background:#F1F5F9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(who)} entrou em contato sobre ${esc(topic)}.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">
        <tr>
          <td style="background:#0B1221;padding:28px 32px;border-bottom:4px solid #38BDF8;">
            <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#38BDF8;">Portfólio · Valdemir Nunes</p>
            <h1 style="margin:0;font-size:24px;line-height:1.25;color:#FFFFFF;">Novo contato recebido</h1>
            <p style="margin:10px 0 0;font-size:14px;line-height:1.5;color:#94A3B8;">Esta é uma notificação automática: o sistema do seu portfólio registrou um novo contato.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 8px;">
            <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#64748B;">Assunto</p>
            <p style="margin:0 0 18px;font-size:20px;font-weight:700;color:#0F172A;">${esc(topic)}</p>
            <span style="display:inline-block;padding:6px 12px;border-radius:999px;background:#E0F2FE;color:#0369A1;font-size:12px;font-weight:700;">${esc(d.origin)}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 32px 4px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${row('Nome', esc(d.name) || '-')}
              ${row('Empresa', esc(d.company) || '-')}
              ${row('Contato', esc(d.contact) || '-', true)}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 8px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#64748B;">Mensagem</p>
            <div style="padding:16px 18px;border-radius:12px;background:#F8FAFC;border:1px solid #E2E8F0;border-left:4px solid #38BDF8;font-size:15px;line-height:1.6;color:#0F172A;">
              ${d.message ? esc(d.message).replace(/\n/g, '<br>') : '<span style="color:#94A3B8;">O visitante não escreveu uma mensagem.</span>'}
            </div>
          </td>
        </tr>
        ${buttons ? `<tr><td style="padding:20px 32px 8px;">${buttons}</td></tr>` : ''}
        <tr>
          <td style="padding:20px 32px 28px;">
            <p style="margin:0;padding-top:16px;border-top:1px solid #E2E8F0;font-size:12px;line-height:1.6;color:#94A3B8;">
              Enviado automaticamente pelo sistema do portfólio · <a href="${SITE_URL}" style="color:#64748B;">${SITE_URL.replace(/^https?:\/\//, '')}</a><br>
              Recebido em ${esc(receivedAt)} (horário de Brasília). Para responder ao visitante, use os botões acima.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    'NOVO CONTATO RECEBIDO - Portfólio Valdemir Nunes',
    '(Notificação automática enviada pelo sistema do portfólio)',
    '',
    `Assunto: ${topic}`,
    `Origem: ${d.origin}`,
    `Nome: ${d.name || '-'}`,
    `Empresa: ${d.company || '-'}`,
    `Contato: ${d.contact || '-'}`,
    '',
    'Mensagem:',
    d.message || '(o visitante não escreveu uma mensagem)',
    '',
    `Recebido em ${receivedAt} (horário de Brasília) · ${SITE_URL}`,
  ].join('\n');

  return { subject, html, text };
}

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

  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const tasks: Promise<boolean>[] = [];

  if (canEmail) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });
    const mail = buildEmail({
      origin: ORIGIN_LABELS[source],
      name,
      company,
      contact,
      service,
      message,
      isEmail: looksLikeEmail,
    });
    tasks.push(
      transporter
        .sendMail({
          from: `"Portfólio Valdemir Nunes" <${GMAIL_USER}>`,
          to: TO,
          subject: mail.subject,
          ...(looksLikeEmail ? { replyTo: contact } : {}),
          text: mail.text,
          html: mail.html,
        })
        .then(() => true)
        .catch(() => false)
    );
  }

  if (canTelegram) {
    const text = [
      `📩 Novo contato no portfólio\n${ORIGIN_LABELS[source]}`,
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
