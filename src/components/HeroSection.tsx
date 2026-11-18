import { useState } from 'react';
import { ArrowRight, MessageCircle, UserCheck } from 'lucide-react';
import { HERO, METRICS, PROFILE } from '../data/profile';

export function HeroSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="topo"
      className="relative overflow-hidden border-b border-slate-800/80 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.16),_transparent_55%),linear-gradient(180deg,_#060B16_0%,_#0A1120_100%)]"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="text-xs font-medium tracking-wide text-sky-400">{HERO.eyebrow}</p>

            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[3.1rem] lg:leading-[1.1] [text-wrap:balance]">
              {HERO.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">{HERO.text}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#sistemas"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 whitespace-nowrap"
              >
                Ver sistemas no ar
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={`https://wa.me/${PROFILE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-slate-500 hover:bg-slate-800 whitespace-nowrap"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[380px] overflow-hidden rounded-xl border border-slate-800 bg-[#050C24]">
              {!imgError ? (
                <img
                  src={PROFILE.photoHero}
                  alt={`Retrato de ${PROFILE.fullName}`}
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-top lg:max-h-[470px]"
                />
              ) : (
                <div className="flex h-full min-h-[380px] items-center justify-center bg-slate-900">
                  <UserCheck className="h-12 w-12 text-blue-400" aria-hidden="true" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060B16] via-[#060B16]/80 to-transparent p-5">
                <p className="font-display text-sm font-semibold text-white">{HERO.captionTitle}</p>
                <p className="mt-0.5 text-xs text-slate-300">{HERO.captionSub}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 divide-y divide-slate-800 rounded-xl border border-slate-800 bg-[#0B1221] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {METRICS.map((item) => (
            <div key={item.label} className="p-5 sm:p-6">
              <p className="font-mono text-2xl font-semibold tracking-tight text-sky-400 tabular-nums whitespace-nowrap">{item.value}</p>
              <p className="mt-1.5 text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.context}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
