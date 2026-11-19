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
          <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
            {[
              {
                src: before,
                label: 'Antes',
                caption: t.beforeLabel,
                frame: 'border-slate-400/30 shadow-[0_0_40px_-12px_rgba(148,163,184,0.35)]',
                badge: 'bg-slate-800/90 text-slate-100 border border-white/15',
                tint: 'from-slate-900/10 via-transparent to-slate-950/70',
              },
              {
                src: after,
                label: 'Depois',
                caption: t.afterLabel,
                frame: 'border-emerald-400/60 shadow-[0_0_50px_-10px_rgba(52,211,153,0.55)]',
                badge: 'bg-emerald-500 text-white border border-emerald-300/50',
                tint: 'from-cyan-400/10 via-transparent to-[#050A18]/80',
              },
            ].map((p) =>
              p.src ? (
                <figure
                  key={p.label}
                  className={`group relative overflow-hidden rounded-2xl border bg-[#050A18] ${p.frame}`}
                >
                  {/* fundo desfocado da própria foto, para preencher sem cortar a imagem */}
                  <img
                    src={p.src}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl"
                  />
                  <img
                    src={p.src}
                    alt={`${systemName} — ${p.caption}`}
                    loading="lazy"
                    className="relative h-[360px] w-full object-contain saturate-[1.08] contrast-[1.04] transition-transform duration-700 group-hover:scale-[1.03] sm:h-[460px] lg:h-[500px]"
                  />
                  {/* camada de cor + brilho tecnológico */}
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${p.tint}`} aria-hidden="true" />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 3px)',
                    }}
                    aria-hidden="true"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" aria-hidden="true" />
                  <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur ${p.badge}`}
                  >
                    {p.label}
                  </span>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-3 pt-10 text-sm font-semibold text-white">
                    {p.caption}
                  </figcaption>
                </figure>
              ) : null,
            )}

            {/* seta central entre as fotos */}
            <span
              className="absolute left-1/2 top-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/50 bg-[#0B1221]/90 text-cyan-300 shadow-lg shadow-cyan-400/30 backdrop-blur sm:flex"
              aria-hidden="true"
            >
              <ArrowRight className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/5 px-4 py-3">
            <TrendingUp className="h-6 w-6 shrink-0 text-emerald-300" aria-hidden="true" />
            <p className="font-display text-2xl font-extrabold text-emerald-300">{t.metric.value}</p>
            <p className="text-sm text-slate-300">{t.metric.label}</p>
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
