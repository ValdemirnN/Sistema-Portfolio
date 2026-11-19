import { ArrowRight, MessageCircle, Quote, Star, TrendingUp } from 'lucide-react';
import type { Testimonial } from '../data/profile';

interface Props {
  systemName: string;
  testimonial: Testimonial;
  before?: string;
  after?: string;
}

/** Depoimento com prova visual (antes/depois), exibido dentro do card do sistema. */
export function TestimonialBlock({ systemName, testimonial: t, before, after }: Props) {
  return (
    <div className="mt-2 border-t border-white/10 pt-8 lg:col-span-2">
      <p className="flex items-center gap-3 text-sm font-semibold text-cyan-300">
        <span className="h-px w-8 bg-gradient-to-r from-blue-500 to-cyan-300" aria-hidden="true" />
        Prova real de impacto
      </p>

      <div className="mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* fotos antes / depois */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { src: before, label: 'Antes', caption: t.beforeLabel, ring: 'ring-slate-400/40', badge: 'bg-slate-700/90 text-slate-100' },
              { src: after, label: 'Depois', caption: t.afterLabel, ring: 'ring-emerald-400/60', badge: 'bg-emerald-500/90 text-white' },
            ].map((p) =>
              p.src ? (
                <figure key={p.label} className={`relative overflow-hidden rounded-2xl ring-2 ${p.ring}`}>
                  <img
                    src={p.src}
                    alt={`${systemName} — ${p.caption}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur ${p.badge}`}>
                    {p.label}
                  </span>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-8 text-xs font-medium text-white">
                    {p.caption}
                  </figcaption>
                </figure>
              ) : null,
            )}
          </div>

          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/5 px-4 py-3">
            <TrendingUp className="h-6 w-6 shrink-0 text-emerald-300" aria-hidden="true" />
            <p className="font-display text-2xl font-extrabold text-emerald-300">{t.metric.value}</p>
            <p className="text-sm text-slate-300">{t.metric.label}</p>
            <ArrowRight className="ml-auto hidden h-4 w-4 text-cyan-300 sm:block" aria-hidden="true" />
          </div>
        </div>

        {/* citação */}
        <div>
          <Quote className="h-9 w-9 text-cyan-300/40" aria-hidden="true" />
          <blockquote className="mt-4 font-display text-xl font-bold leading-snug text-white sm:text-2xl">
            “{t.quote}”
          </blockquote>

          <div className="mt-6 flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 font-display text-lg font-extrabold text-white shadow-lg shadow-amber-400/30">
              {t.author.charAt(0)}
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{t.author}</p>
              <p className="text-xs text-slate-400">{t.role}</p>
              <div className="mt-1 flex gap-0.5" aria-label="Avaliação: 5 de 5 estrelas">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>
            </div>
          </div>

          <p className="mt-5 flex items-start gap-3 rounded-xl border border-white/10 bg-[#0B1221]/80 px-4 py-3 text-xs leading-relaxed text-slate-400">
            <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
            {t.source}
          </p>
        </div>
      </div>
    </div>
  );
}
