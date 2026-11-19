import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface LightboxItem {
  src: string;
  title: string;
}

interface Props {
  items: LightboxItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

/** Visualizador em tela cheia: Esc fecha, setas do teclado e botões navegam. */
export function ImageLightbox({ items, index, onIndex, onClose }: Props) {
  const item = items[index];
  const go = (d: number) => onIndex((index + d + items.length) % items.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onIndex((index + 1) % items.length);
      else if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, items.length, onClose, onIndex]);

  if (!item) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="animate-shot-fade fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        autoFocus
        className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      <img
        key={item.src}
        src={item.src}
        alt={item.title}
        onClick={(e) => e.stopPropagation()}
        className="animate-shot-fade max-h-[78vh] max-w-full rounded-2xl object-contain shadow-2xl shadow-black/60"
      />

      <div className="mt-4 flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Imagem anterior"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-white">{item.title}</p>
          <div className="mt-2 flex justify-center gap-1.5" aria-hidden="true">
            {items.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-cyan-300' : 'w-1.5 bg-white/30'}`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Próxima imagem"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>,
    document.body,
  );
}
