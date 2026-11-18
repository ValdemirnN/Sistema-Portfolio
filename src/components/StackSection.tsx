import { SectionTitle } from './SectionTitle';
import { STACK_GROUPS } from '../data/profile';

export function StackSection() {
  return (
    <section id="stack" className="border-b border-slate-800/80 bg-[#090F1D] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="06. Competências" title="Tecnologias e ferramentas que eu domino" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STACK_GROUPS.map((g) => (
            <div key={g.title} className="rounded-xl border border-slate-800 bg-[#0F172A] p-5">
              <h3 className="font-display text-sm font-semibold text-white">{g.title}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {g.items.map((i) => (
                  <span key={i} className="rounded-md border border-slate-800 bg-[#060B16] px-2.5 py-1 text-xs text-slate-200">{i}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
