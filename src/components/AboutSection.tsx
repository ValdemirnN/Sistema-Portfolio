import { ABOUT } from '../data/profile';

export function AboutSection() {
  return (
    <section id="sobre" className="border-b border-slate-800/80 bg-[#060B16]/30 py-16 sm:py-20">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-12 2xl:px-16">
        <div className="mx-auto flex max-w-4xl flex-col justify-center">
          <p className="text-xs font-medium tracking-wide text-sky-400">01. Sobre mim</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{ABOUT.title}</h2>
          {ABOUT.paragraphs.map((p) => (
            <p key={p} className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{p}</p>
          ))}

          <dl className="mt-8 divide-y divide-slate-800 border-y border-slate-800">
            {ABOUT.facts.map((f) => (
              <div key={f.label} className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-4 sm:gap-4">
                <dt className="font-mono text-xs text-sky-400">{f.label}</dt>
                <dd className="text-sm text-slate-200 sm:col-span-3">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
