import { useState } from 'react';
import { ArrowUpRight, MessageCircle, UserCheck } from 'lucide-react';
import { HERO, METRICS, PROFILE, whatsappLink } from '../data/profile';
import { trackClick } from '../lib/notify';

export function HeroSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="topo" className="relative overflow-hidden border-b border-white/10">
      <div className="mx-auto max-w-[90rem] px-4 pb-14 pt-12 sm:px-6 lg:px-12 2xl:px-16 lg:pb-20 lg:pt-20">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-400 sm:text-sm">
              {HERO.badge}
            </p>

            <h1 className="mt-6 font-display text-[2.25rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem] 2xl:text-[4rem] [text-wrap:balance]">
              <span className="block text-slate-400">{HERO.titleLead}</span>
              <span className="block text-white">{HERO.titleHighlight}</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">{HERO.text}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#sistemas"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-4 text-base font-bold text-white shadow-[0_10px_40px_-8px_rgba(59,91,255,0.75)] ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-cyan-500"
              >
                {HERO.cta}
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={whatsappLink()}
                onClick={() => trackClick('clique-whatsapp', 'Hero')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-base font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10 whitespace-nowrap"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                Pedir orçamento no WhatsApp
              </a>
            </div>

            <p className="mt-6 max-w-xl text-xs font-medium uppercase leading-relaxed tracking-wide text-slate-400">{HERO.tags}</p>
          </div>

          {/* retrato */}
          <div className="relative mx-auto w-full max-w-lg lg:col-span-6 lg:max-w-[40rem]">
            <div className="relative mx-auto w-full">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-600/40 via-cyan-400/10 to-transparent blur-2xl" aria-hidden="true" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#050C24] shadow-2xl">
                {!imgError ? (
                  <img
                    src={PROFILE.photoHero}
                    alt={`Retrato de ${PROFILE.fullName}`}
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-900">
                    <UserCheck className="h-12 w-12 text-blue-400" aria-hidden="true" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060B16] via-[#060B16]/70 to-transparent p-5 pt-16">
                  <p className="font-display text-sm font-bold text-white">{HERO.captionTitle}</p>
                  <p className="mt-0.5 text-xs text-slate-300">{HERO.captionSub}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-9 lg:grid-cols-4">
          {METRICS.map((item) => (
            <div key={item.label}>
              <dt className="font-display text-4xl font-extrabold tracking-tight text-white tabular-nums sm:text-5xl">{item.value}</dt>
              <dd className="mt-2 text-sm font-semibold text-cyan-300">{item.label}</dd>
              <dd className="mt-1 text-sm leading-relaxed text-slate-400">{item.context}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
