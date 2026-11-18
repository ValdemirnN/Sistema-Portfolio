/**
 * Avisa o servidor (/api/contact) sempre que alguém entra em contato.
 * - notifyContact: mensagem de verdade (vai para e-mail + Telegram + banco)
 * - trackClick: só registra o clique no banco (não dispara e-mail, para não virar spam)
 * Nunca lança erro: se falhar, o visitante segue normalmente.
 */
export type ContactSource =
  | 'formulario-email'
  | 'formulario-whatsapp'
  | 'orcamento-solucoes'
  | 'clique-whatsapp'
  | 'clique-email';

interface NotifyPayload {
  source: ContactSource;
  name?: string;
  company?: string;
  contact?: string;
  service?: string;
  message?: string;
}

export async function notifyContact(payload: NotifyPayload): Promise<boolean> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function trackClick(source: 'clique-whatsapp' | 'clique-email', where: string) {
  try {
    const body = JSON.stringify({ source, message: `Clique em: ${where}` });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/contact', new Blob([body], { type: 'application/json' }));
    } else {
      void fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true });
    }
  } catch {
    /* ignora */
  }
}
