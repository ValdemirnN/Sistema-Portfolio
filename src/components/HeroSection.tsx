import { useState } from 'react';
import { ArrowRight, MessageCircle, UserCheck } from 'lucide-react';
import { HERO, METRICS, PROFILE, whatsappLink } from '../data/profile';
import fisioShot from '../assets/systems/fisiopulso/01-painel-da-clinica.png';
import luzShot from '../assets/systems/luz-letras/01-dashboard-do-negocio.png';

export function HeroSection() {
  const [imgError, setImgError] = useState(false);
  // "Transformo planilhas e processos manuais" / "em dashboards e sistemas que funcionam."
  const [problem, solution] = HERO.title.split(' em ');

  return (
    <section id="topo" className="relative overflow-hidden border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-sm font-medium text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="wa-ping absolute inset-0 rounded-full bg-emerald-400" aria-hidden="true" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {METRICS[0].value} sistemas meus rodando em produção hoje
            </p>

            <h1 className="mt-6 font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem] [text-wrap:balance]">
              <span className="block text-slate-400">{problem}</span>
              <span className="block text-white">em {solution}</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">{HERO.text}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-4 text-base font-bold text-white shadow-[0_10px_40px_-8px_rgba(59,91,255,0.75)] ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-cyan-500 whitespace-nowrap"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Pedir orçamento no WhatsApp
              </a>
              <a
                href="#sistemas"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-base font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10 whitespace-nowrap"
              >
                Ver os sistemas no ar
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* retrato + prints reais dos sistemas */}
          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
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

            <figure className="float-slow absolute -left-3 bottom-24 w-[72%] overflow-hidden rounded-xl border border-white/20 bg-white shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] sm:-left-8">
              <img src={fisioShot} alt="Painel do Fisiopulso" className="w-full" loading="lazy" />
              <figcaption className="bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-sky-300">Fisiopulso · gestão de clínicas</figcaption>
            </figure>
            <figure className="float-slow-b absolute -right-2 top-8 hidden w-[46%] overflow-hidden rounded-xl border border-white/20 bg-white shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] sm:block lg:-right-6">
              <img src={luzShot} alt="Dashboard do Luz & Letras" className="w-full" loading="lazy" />
              <figcaption className="bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-sky-300">Luz &amp; Letras</figcaption>
            </figure>
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
