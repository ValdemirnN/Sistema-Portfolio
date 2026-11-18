import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

export interface Shot {
  src: string;
  caption: string;
}

/**
 * Galeria de prints de um sistema: imagem principal + miniaturas,
 * e ao clicar abre em tela cheia (setas do teclado e Esc funcionam).
 */
export function SystemGallery({ name, shots }: { name: string; shots: Shot[] }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [portrait, setPortrait] = useState<Record<string, boolean>>({});

  const total = shots.length;
  const go = useCallback((delta: number) => setIndex((i) => (i + delta + total) % total), [total]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, go]);

  if (total === 0) return null;
  const current = shots[index];

  return (
    <div className="mb-5">
      <div className="group relative overflow-hidden rounded-lg border border-slate-800 bg-[#060B16]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block aspect-[16/10] w-full cursor-zoom-in"
          aria-label={`Ampliar imagem: ${current.caption}`}
        >
          <img
            src={current.src}
            alt={`${name}: ${current.caption}`}
            loading="lazy"
            onLoad={(e) => {
              const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
              setPortrait((p) => (p[current.src] === h > w ? p : { ...p, [current.src]: h > w }));
            }}
            className={`h-full w-full ${portrait[current.src] ? 'object-contain' : 'object-cover object-top'}`}
          />
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <Expand className="h-3 w-3" aria-hidden="true" /> Ampliar
          </span>
        </button>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Imagem anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima imagem"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="truncate text-xs text-slate-400">{current.caption}</p>
        {total > 1 && (
          <div className="flex shrink-0 gap-1.5" role="tablist" aria-label="Imagens do sistema">
            {shots.map((s, i) => (
              <button
                key={s.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={s.caption}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${i === index ? 'w-5 bg-sky-400' : 'w-1.5 bg-slate-600 hover:bg-slate-500'}`}
              />
            ))}
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagens do ${name}`}
          onClick={() => setOpen(false)}
        >
          <div className="mb-3 flex items-center justify-between text-white" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-medium">
              {name} <span className="text-slate-400">· {current.caption} ({index + 1}/{total})</span>
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20 cursor-pointer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center">
            <img
              src={current.src}
              alt={`${name}: ${current.caption}`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            />
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); go(-1); }}
                  aria-label="Imagem anterior"
                  className="absolute left-0 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 cursor-pointer"
                >
                  <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); go(1); }}
                  aria-label="Próxima imagem"
                  className="absolute right-0 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 cursor-pointer"
                >
                  <ChevronRight className="h-6 w-6" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
