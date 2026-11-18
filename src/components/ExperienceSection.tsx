import { SectionTitle } from './SectionTitle';
import { EXPERIENCE, PROCESS, PROCESS_INTRO } from '../data/profile';

export function ExperienceSection() {
  return (
    <>
      <section id="trajetoria" className="border-b border-slate-800/80 bg-[#090F1D] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="04. Trajetória profissional"
            title="Experiência real, aplicada em empresas"
            text="O que construí e entreguei em cada posição."
          />

          <ol className="mt-10 space-y-5">
            {EXPERIENCE.map((job) => (
              <li key={job.period + job.company} className="grid grid-cols-1 gap-4 rounded-xl border border-slate-800 bg-[#0F172A] p-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="font-mono text-xs text-sky-400">{job.period}</p>
                  <h3 className="mt-1.5 font-display text-lg font-semibold text-white">{job.role}</h3>
                  <p className="text-sm text-slate-400">{job.company}</p>
                </div>
                <ul className="space-y-2 lg:col-span-8">
                  {job.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-300">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-400" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="processo" className="border-b border-slate-800/80 bg-[#060B16] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="05. Como funciona" title={PROCESS_INTRO.title} text={PROCESS_INTRO.text} />
          <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step, i) => (
              <li key={step.title} className="rounded-xl border border-slate-800 bg-[#0F172A] p-5">
                <p className="font-mono text-xs font-semibold text-sky-400">0{i + 1}.</p>
                <h3 className="mt-2 font-display text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
