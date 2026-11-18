import { BarChart3, CheckCircle2, Cloud, Database, Globe, Smartphone, Workflow, type LucideIcon } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { SERVICES, SERVICES_INTRO } from '../data/profile';

// um ícone por serviço (mesma ordem de SERVICES) e larguras alternadas
const ICONS: LucideIcon[] = [BarChart3, Workflow, Globe, Smartphone, Database, Cloud];
const SPANS = ['lg:col-span-4', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-4', 'lg:col-span-3', 'lg:col-span-3'];

export function ServicesSection() {
  return (
    <section id="servicos" className="border-b border-white/10 bg-[#090F1D]/55 py-20 sm:py-24">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-12 2xl:px-16">
        <SectionTitle eyebrow="Serviços" title={SERVICES_INTRO.title} text={SERVICES_INTRO.text} />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[i] ?? BarChart3;
            const featured = i === 0 || i === 3;
            return (
              <article
                key={s.title}
                className={`card-lift group flex flex-col rounded-2xl border p-7 backdrop-blur-sm ${SPANS[i] ?? ''} ${
                  featured
                    ? 'border-blue-400/30 bg-gradient-to-br from-blue-600/25 via-[#0F172A]/80 to-[#0F172A]/80'
                    : 'border-white/10 bg-[#0F172A]/75'
                }`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-600/30">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-slate-300">{s.description}</p>

                <div className="mt-5 flex gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold text-emerald-300">Já entreguei</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-200">{s.example}</p>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">{t}</span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
