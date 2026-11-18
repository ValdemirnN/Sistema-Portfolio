import { useEffect, useState } from 'react';
import { CheckCircle2, Github, Linkedin, Loader2, Mail, MessageCircle } from 'lucide-react';
import { CONTACT, PROFILE, SERVICE_OPTIONS, whatsappLink } from '../data/profile';
import { notifyContact, trackClick } from '../lib/notify';

export function ContactSection({ reference }: { reference: string }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [website, setWebsite] = useState(''); // honeypot anti-spam (deve ficar vazio)
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    if (reference) setMessage(reference + '. ');
  }, [reference]);

  const buildText = () =>
    [
      'Olá, Valdemir! Vi seu portfólio e gostaria de um orçamento.',
      '',
      `Nome: ${name.trim()}`,
      contact.trim() ? `Contato: ${contact.trim()}` : '',
      company.trim() ? `Empresa: ${company.trim()}` : '',
      `Serviço: ${service}`,
      message.trim() ? `Sobre o projeto: ${message.trim()}` : '',
    ]
      .filter((l, i, arr) => l !== '' || arr[i - 1] !== '')
      .join('\n');

  const validate = () => {
    if (name.trim().length < 2) {
      setError('Informe seu nome.');
      return false;
    }
    setError(null);
    return true;
  };

  const sendWhatsApp = () => {
    if (!validate()) return;
    // avisa você mesmo que a pessoa desista de enviar no WhatsApp
    void notifyContact({ source: 'formulario-whatsapp', name, company, contact, service, message });
    window.open(whatsappLink(buildText()), '_blank', 'noopener');
  };

  // Envia para /api/contact: chega no seu e-mail e é salvo no banco (Supabase)
  const sendRequest = async () => {
    if (!validate()) return;
    if (contact.trim().length < 5) {
      setError('Informe seu WhatsApp ou e-mail para eu conseguir te responder.');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'formulario-email', name, company, contact, service, message, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Falha ao enviar.');
      setStatus('sent');
    } catch (e) {
      setStatus('idle');
      setError(
        (e instanceof Error ? e.message : 'Falha ao enviar.') +
          ' Tente pelo botão do WhatsApp.'
      );
    }
  };

  const input =
    'mt-1.5 w-full rounded-lg border border-slate-700 bg-[#060B16] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none';

  return (
    <section id="contato" className="bg-[#060B16]/30 py-16 sm:py-20">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-12 2xl:px-16">
        <div className="grid grid-cols-1 gap-8 rounded-xl border border-slate-800 bg-[#0F172A]/75 backdrop-blur-sm p-6 sm:p-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium tracking-wide text-sky-400">07. Contato</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl [text-wrap:balance]">{CONTACT.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{CONTACT.text}</p>

            <ul className="mt-6 space-y-3 border-t border-slate-800 pt-5 text-sm text-slate-200">
              <li>
                <a className="inline-flex items-center gap-2.5 hover:text-sky-400" href={whatsappLink()} onClick={() => trackClick('clique-whatsapp', 'Contato (lista)')} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 text-sky-400" aria-hidden="true" /> {PROFILE.phoneDisplay}
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2.5 hover:text-sky-400" href={`mailto:${PROFILE.email}`} onClick={() => trackClick('clique-email', 'Contato (lista)')}>
                  <Mail className="h-4 w-4 text-sky-400" aria-hidden="true" /> {PROFILE.email}
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2.5 hover:text-sky-400" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4 text-sky-400" aria-hidden="true" /> LinkedIn
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2.5 hover:text-sky-400" href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 text-sky-400" aria-hidden="true" /> GitHub
                </a>
              </li>
            </ul>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); void sendRequest(); }} noValidate className="space-y-4 rounded-xl border border-slate-800 bg-[#0B1221]/80 p-5 sm:p-6 lg:col-span-7">
            {status === 'sent' ? (
              <div role="status" className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-400" aria-hidden="true" />
                <p className="font-display text-xl font-bold text-white">Mensagem enviada!</p>
                <p className="max-w-sm text-sm text-slate-300">Recebi sua solicitação e respondo em breve pelo contato que você informou.</p>
                <button type="button" onClick={() => { setStatus('idle'); setName(''); setCompany(''); setContact(''); setMessage(''); }} className="mt-2 text-sm font-semibold text-sky-400 hover:underline cursor-pointer">Enviar outra mensagem</button>
              </div>
            ) : (
            <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="c-name" className="block text-xs font-medium text-slate-300">Seu nome</label>
                <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} className={input} placeholder="Como posso te chamar?" />
              </div>
              <div>
                <label htmlFor="c-company" className="block text-xs font-medium text-slate-300">Empresa (opcional)</label>
                <input id="c-company" value={company} onChange={(e) => setCompany(e.target.value)} className={input} placeholder="Nome da empresa" />
              </div>
            </div>

            <div>
              <label htmlFor="c-contact" className="block text-xs font-medium text-slate-300">Seu WhatsApp ou e-mail</label>
              <input id="c-contact" value={contact} onChange={(e) => setContact(e.target.value)} className={input} placeholder="Para eu te responder" autoComplete="email" inputMode="email" />
            </div>

            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="c-website">Não preencha</label>
              <input id="c-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>

            <div>
              <label htmlFor="c-service" className="block text-xs font-medium text-slate-300">O que você precisa?</label>
              <select id="c-service" value={service} onChange={(e) => setService(e.target.value)} className={input}>
                {SERVICE_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="c-msg" className="block text-xs font-medium text-slate-300">Conte rapidamente sobre o seu cenário</label>
              <textarea
                id="c-msg"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={input}
                placeholder="Ex.: hoje controlo o financeiro em várias planilhas e queria um painel único..."
              />
            </div>

            {error && <p role="alert" className="text-xs font-medium text-red-400">{error}</p>}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={sendWhatsApp} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 cursor-pointer">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Enviar pelo WhatsApp
              </button>
              <button type="submit" disabled={status === 'sending'} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-sky-400 disabled:opacity-60 cursor-pointer">
                {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Mail className="h-4 w-4" aria-hidden="true" />}
                {status === 'sending' ? 'Enviando...' : 'Enviar por e-mail'}
              </button>
            </div>
            </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
