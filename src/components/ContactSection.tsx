import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { CONTACT, PROFILE, SERVICE_OPTIONS } from '../data/profile';

export function ContactSection({ reference }: { reference: string }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reference) setMessage(reference + '. ');
  }, [reference]);

  const buildText = () =>
    [
      'Olá, Valdemir! Vi seu portfólio e gostaria de um orçamento.',
      '',
      `Nome: ${name.trim()}`,
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
    window.open(`https://wa.me/${PROFILE.whatsapp}?text=${encodeURIComponent(buildText())}`, '_blank', 'noopener');
  };

  const sendEmail = () => {
    if (!validate()) return;
    window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent('Orçamento - ' + service)}&body=${encodeURIComponent(buildText())}`;
  };

  const input =
    'mt-1.5 w-full rounded-lg border border-slate-700 bg-[#060B16] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none';

  return (
    <section id="contato" className="bg-[#060B16] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 rounded-xl border border-slate-800 bg-[#0F172A] p-6 sm:p-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium tracking-wide text-sky-400">07. Contato</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl [text-wrap:balance]">{CONTACT.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{CONTACT.text}</p>

            <ul className="mt-6 space-y-3 border-t border-slate-800 pt-5 text-sm text-slate-200">
              <li>
                <a className="inline-flex items-center gap-2.5 hover:text-sky-400" href={`https://wa.me/${PROFILE.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 text-sky-400" aria-hidden="true" /> {PROFILE.phoneDisplay}
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2.5 hover:text-sky-400" href={`mailto:${PROFILE.email}`}>
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

          <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-4 rounded-xl border border-slate-800 bg-[#0B1221] p-6 lg:col-span-7">
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
              <button type="button" onClick={sendEmail} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-slate-500 cursor-pointer">
                <Mail className="h-4 w-4" aria-hidden="true" /> Enviar por e-mail
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
