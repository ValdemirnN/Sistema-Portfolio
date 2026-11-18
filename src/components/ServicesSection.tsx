import { SectionTitle } from './SectionTitle';
import { SERVICES, SERVICES_INTRO } from '../data/profile';

export function ServicesSection() {
  return (
    <section id="servicos" className="border-b border-slate-800/80 bg-[#090F1D] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="02. Serviços" title={SERVICES_INTRO.title} text={SERVICES_INTRO.text} />

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <article key={s.title} className="flex flex-col rounded-xl border border-slate-800 bg-[#0F172A] p-6">
              <p className="font-mono text-xs text-sky-400">0{i + 1}.</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.description}</p>

              <div className="mt-4 rounded-lg border border-slate-800 bg-[#0B1221] p-3.5">
                <p className="text-[11px] font-semibold text-sky-400">Já entreguei</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{s.example}</p>
              </div>

              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {s.tags.map((t) => (
                  <span key={t} className="rounded-md border border-slate-800 bg-[#060B16] px-2 py-1 font-mono text-[11px] text-sky-400">{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
