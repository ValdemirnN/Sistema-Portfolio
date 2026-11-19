import { ABOUT } from '../data/profile';

export function AboutSection() {
  return (
    <section id="sobre" className="border-b border-slate-800/80 bg-[#060B16]/30 py-20 sm:py-28">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-12 2xl:px-16">
        <div className="flex w-full flex-col justify-center">
          <p className="text-sm font-medium tracking-wide text-sky-400 sm:text-base">01. Sobre mim</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{ABOUT.title}</h2>
          {ABOUT.paragraphs.map((p) => (
            <p key={p} className="mt-6 max-w-6xl text-base leading-relaxed text-slate-300 sm:text-lg lg:text-xl">{p}</p>
          ))}

          <dl className="mt-12 divide-y divide-slate-800 border-y border-slate-800">
            {ABOUT.facts.map((f) => (
              <div key={f.label} className="grid grid-cols-1 gap-1 py-5 sm:grid-cols-4 sm:gap-6 lg:grid-cols-5">
                <dt className="font-mono text-sm text-sky-400 sm:text-base">{f.label}</dt>
                <dd className="text-base text-slate-200 sm:col-span-3 sm:text-lg lg:col-span-4 lg:text-xl">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
