import { SectionTitle } from './SectionTitle';
import { EXPERIENCE, PROCESS, PROCESS_INTRO } from '../data/profile';

export function ExperienceSection() {
  return (
    <>
      <section id="trajetoria" className="border-b border-slate-800/80 bg-[#090F1D]/55 py-16 sm:py-20">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-12 2xl:px-16">
          <SectionTitle
            eyebrow="04. Trajetória profissional"
            title="Experiência real, aplicada em empresas"
            text="O que construí e entreguei em cada posição."
          />

          <ol className="mt-10 space-y-5">
            {EXPERIENCE.map((job) => (
              <li key={job.period + job.company} className="grid grid-cols-1 gap-4 rounded-xl border border-slate-800 bg-[#0F172A]/75 backdrop-blur-sm p-6 lg:grid-cols-12">
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

      <section id="processo" className="border-b border-slate-800/80 bg-[#060B16]/30 py-16 sm:py-20">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-12 2xl:px-16">
          <SectionTitle eyebrow="05. Como funciona" title={PROCESS_INTRO.title} text={PROCESS_INTRO.text} />
          <ol className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {PROCESS.map((step, i) => (
              <li key={step.title} className="relative">
                {i < PROCESS.length - 1 && (
                  <span className="absolute left-14 top-6 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-blue-500/60 to-transparent lg:block" aria-hidden="true" />
                )}
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 font-display text-lg font-extrabold text-white shadow-lg shadow-blue-600/30">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-300">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
