import { MessageCircle, Quote, Star, TrendingUp } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { Testimonial } from '../data/profile';
import type { TestimonialShots } from '../data/testimonialShots';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { ChatReplay } from './ChatReplay';
import { ImageLightbox, type LightboxItem } from './ImageLightbox';
import { useCountUp, useInViewLive } from './useReveal';

/** Quanto tempo o número fica parado no valor final antes de recontar. */
const METRIC_HOLD_MS = 8000;

interface Props extends TestimonialShots {
  systemName: string;
  testimonial: Testimonial;
}

/** Depoimento interativo: conversa do WhatsApp + comparador antes/depois + citação em destaque. */
export function TestimonialBlock({ systemName, testimonial: t, before, after, printTop, printBottom }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const [metricRef, metricSeen] = useInViewLive<HTMLDivElement>(0.5);

  const metricMatch = /^(\d+)(.*)$/.exec(t.metric.value);
  // conta até o valor, fica parado e recomeça (loop), só enquanto o card está na tela
  const counted = useCountUp(metricMatch ? Number(metricMatch[1]) : 0, metricSeen, 2200, METRIC_HOLD_MS);
  const metricText = metricMatch ? `${counted}${metricMatch[2]}` : t.metric.value;

  // galeria do visualizador (só entra o que existe)
  const items: (LightboxItem & { key: string })[] = [
    before && { key: 'before', src: before, title: `Antes — ${t.beforeLabel}` },
    after && { key: 'after', src: after, title: `Hoje — ${t.afterLabel}` },
    printTop && { key: 'print-1', src: printTop, title: 'Print original da conversa (1/2)' },
    printBottom && { key: 'print-2', src: printBottom, title: 'Print original da conversa (2/2)' },
  ].filter(Boolean) as (LightboxItem & { key: string })[];
  const openKey = (key: string) => {
    const i = items.findIndex((it) => it.key === key);
    if (i >= 0) setLightbox(i);
  };

  const hasPhotos = Boolean(before && after);

  return (
    <div className="mt-2 border-t border-white/10 pt-8 lg:col-span-2">
      <p className="flex items-center gap-3 text-sm font-semibold text-cyan-300">
        <span className="h-px w-8 bg-gradient-to-r from-blue-500 to-cyan-300" aria-hidden="true" />
        Prova real de impacto
      </p>
      <h4 className="mt-3 font-display text-2xl font-extrabold text-white sm:text-3xl">
        O que a cliente disse, nas palavras dela
      </h4>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
        Conversa de verdade, enviada espontaneamente. Veja o chat acontecer, arraste para comparar o antes e o depois, ou
        toque nas fotos para ampliar.
      </p>

      {hasPhotos && (
        <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12">
          <ChatReplay
            testimonial={t}
            before={before}
            after={after}
            onOpenPhoto={openKey}
            onOpenPrints={printTop || printBottom ? () => openKey(printTop ? 'print-1' : 'print-2') : undefined}
          />
          <BeforeAfterSlider
            before={before!}
            after={after!}
            beforeLabel={t.beforeLabel}
            afterLabel={t.afterLabel}
            systemName={systemName}
            onExpand={() => openKey('before')}
          />
        </div>
      )}

      {/* resultado + citação */}
      <div className="mt-10 grid grid-cols-1 items-center gap-8 rounded-3xl border border-white/10 bg-[#0B1221]/80 p-6 sm:p-8 lg:grid-cols-[auto_1fr] lg:gap-12">
        <div ref={metricRef} className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-2">
          <TrendingUp className="h-7 w-7 text-emerald-300" aria-hidden="true" />
          <p className="font-display text-5xl font-extrabold tabular-nums text-emerald-300 sm:text-6xl" aria-label={t.metric.value}>
            {metricText}
          </p>
          <p className="max-w-[16rem] text-sm text-slate-300">{t.metric.label}</p>
        </div>

        <div>
          <Quote className="h-9 w-9 text-cyan-300/40" aria-hidden="true" />
          <blockquote className="mt-3 font-display text-xl font-bold leading-snug text-white sm:text-2xl">
            “{t.quote}”
          </blockquote>

          <div className="mt-5 flex flex-wrap items-center gap-4">
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

          <p className="mt-5 flex items-start gap-3 rounded-xl border border-white/10 bg-[#050A18]/70 px-4 py-3 text-xs leading-relaxed text-slate-400">
            <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
            {t.source}
          </p>
        </div>
      </div>

      {lightbox !== null && (
        <ImageLightbox items={items} index={lightbox} onIndex={setLightbox} onClose={closeLightbox} />
      )}
    </div>
  );
}
