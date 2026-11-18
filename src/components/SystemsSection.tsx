import { ArrowRight, ExternalLink } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { INTERNAL_APPS, SYSTEMS, SYSTEMS_INTRO } from '../data/profile';
import { getShots } from '../data/systemShots';
import { SystemGallery } from './SystemGallery';

export function SystemsSection({ onRequest }: { onRequest: (reference: string) => void }) {
  return (
    <section id="sistemas" className="border-b border-slate-800/80 bg-[#060B16] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="03. Sistemas em produção" title={SYSTEMS_INTRO.title} text={SYSTEMS_INTRO.text} />

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SYSTEMS.map((s) => (
            <article key={s.id} className="flex flex-col rounded-xl border border-slate-800 bg-[#0F172A] p-6 transition-colors hover:border-slate-700">
              <SystemGallery name={s.name} shots={getShots(s.id)} />

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-sky-400">{s.category}</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                  No ar
                </span>
              </div>

              <h3 className="mt-3 font-display text-xl font-bold text-white">{s.name}</h3>
              <p className="text-sm font-medium text-slate-200">{s.tagline}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{s.description}</p>

              <ul className="mt-4 space-y-2 border-t border-slate-800 pt-4">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-300">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sky-400" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.stack.map((t) => (
                  <span key={t} className="rounded-md border border-slate-800 bg-[#060B16] px-2 py-1 font-mono text-[11px] text-sky-400">{t}</span>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-2.5 pt-6">
                <a
                  href={s.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
                >
                  {s.liveLabel}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={() => onRequest(`Quero um sistema parecido com o ${s.name}`)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-[#0B1221] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:border-blue-500 hover:text-sky-400 cursor-pointer"
                >
                  Quero algo parecido
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-slate-800 bg-[#0B1221] p-6">
          <h3 className="font-display text-base font-semibold text-white">{INTERNAL_APPS.title}</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {INTERNAL_APPS.items.map((a) => (
              <div key={a.name} className="rounded-lg border border-slate-800 bg-[#0F172A] p-4">
                <p className="font-mono text-sm font-semibold text-sky-400">{a.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
