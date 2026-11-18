import { useState } from 'react';
import { ChevronDown, ExternalLink, FileText, Mail, MessageCircle } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { ACQUIRE, INTERNAL_APPS, SYSTEMS, SYSTEMS_INTRO, emailLink, whatsappLink } from '../data/profile';
import { getShots } from '../data/systemShots';
import { SystemGallery } from './SystemGallery';

export function SystemsSection({ onRequest }: { onRequest: (reference: string) => void }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="sistemas" className="border-b border-white/10 bg-[#060B16]/30 py-20 sm:py-24">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-12 2xl:px-16">
        <SectionTitle eyebrow="Sistemas em produção" title={SYSTEMS_INTRO.title} text={SYSTEMS_INTRO.text} />

        <div className="mt-12 space-y-8">
          {SYSTEMS.map((s, i) => {
            const reversed = i % 2 === 1; // imagem à esquerda, depois à direita, alternando
            return (
              <article
                key={s.id}
                className="card-lift grid grid-cols-1 items-center gap-8 rounded-3xl border border-white/10 bg-[#0F172A]/75 p-5 backdrop-blur-sm sm:p-8 lg:grid-cols-2 lg:gap-14 lg:p-10"
              >
                <div className={reversed ? 'lg:order-2' : ''}>
                  <SystemGallery name={s.name} shots={getShots(s.id)} />
                </div>

                <div className={reversed ? 'lg:order-1' : ''}>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-cyan-300">{s.category}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                      No ar
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">{s.name}</h3>
                  <p className="mt-1 text-lg font-medium text-slate-200">{s.tagline}</p>
                  <p className="mt-4 text-base leading-relaxed text-slate-300">{s.description}</p>

                  <ul className="mt-5 space-y-2.5">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-200">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.stack.map((t) => (
                      <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">{t}</span>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={s.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-cyan-500"
                    >
                      {s.liveLabel}
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setOpenId(openId === s.id ? null : s.id)}
                      aria-expanded={openId === s.id}
                      aria-controls={`adquirir-${s.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10 cursor-pointer"
                    >
                      {ACQUIRE.button}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${openId === s.id ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  {openId === s.id && (
                    <div
                      id={`adquirir-${s.id}`}
                      className="mt-4 rounded-2xl border border-white/10 bg-[#0B1221]/90 p-4"
                    >
                      <p className="text-sm font-semibold text-slate-200">{ACQUIRE.panelTitle}</p>
                      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                        <a
                          href={whatsappLink(ACQUIRE.whatsappMessage(s.name))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-400"
                        >
                          <MessageCircle className="h-4 w-4" aria-hidden="true" />
                          {ACQUIRE.whatsappLabel}
                        </a>
                        <a
                          href={emailLink(ACQUIRE.emailSubject(s.name), ACQUIRE.emailBody(s.name, s.tagline))}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
                        >
                          <Mail className="h-4 w-4" aria-hidden="true" />
                          {ACQUIRE.emailLabel}
                        </a>
                        <button
                          type="button"
                          onClick={() => onRequest(ACQUIRE.formReference(s.name))}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10 cursor-pointer"
                        >
                          <FileText className="h-4 w-4" aria-hidden="true" />
                          {ACQUIRE.formLabel}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-[#0B1221] p-6 sm:p-8">
          <h3 className="font-display text-lg font-bold text-white">{INTERNAL_APPS.title}</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {INTERNAL_APPS.items.map((a) => (
              <div key={a.name} className="rounded-xl border border-white/10 bg-[#0F172A]/75 p-5">
                <p className="font-display text-base font-bold text-cyan-300">{a.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
