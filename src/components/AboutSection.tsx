import { useState } from 'react';
import { UserCheck } from 'lucide-react';
import { ABOUT, PROFILE } from '../data/profile';

export function AboutSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="sobre" className="border-b border-slate-800/80 bg-[#060B16]/30 py-16 sm:py-20">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-12 2xl:px-16">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="h-full min-h-[340px] max-h-[520px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              {!imgError ? (
                <img
                  src={PROFILE.photoAbout}
                  alt={`Retrato de ${PROFILE.fullName}`}
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full min-h-[340px] items-center justify-center">
                  <UserCheck className="h-12 w-12 text-sky-400" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-7">
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
      </div>
    </section>
  );
}
