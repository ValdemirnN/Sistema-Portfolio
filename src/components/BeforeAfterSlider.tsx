import { ArrowLeftRight, Expand } from 'lucide-react';
import { useEffect, useState } from 'react';
import { prefersReducedMotion, useInView } from './useReveal';

interface Props {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  systemName: string;
  onExpand?: () => void;
}

/** Tempo que cada lado fica parado na tela antes de a animação trocar para o outro. */
const HOLD_MS = 5000;
/** Duração do deslizar automático de um lado ao outro. */
const SWEEP_MS = 2000;
/** Depois que a pessoa mexe no comparador, a animação só volta após esse tempo parada. */
const RESUME_AFTER_MS = 9000;
/** Posições do divisor no autoplay (% mostrando "Antes"). */
const AUTO_BEFORE = 84;
const AUTO_AFTER = 16;

/** Comparador arrastável: a foto "Antes" é revelada sobre a "Depois". */
export function BeforeAfterSlider({ before, after, beforeLabel, afterLabel, systemName, onExpand }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const [pos, setPos] = useState(50); // % da largura mostrando "Antes"
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);
  const [auto, setAuto] = useState(false); // true enquanto o deslizar é automático (transição mais lenta)
  const [interactions, setInteractions] = useState(0);

  const markInteraction = () => {
    setTouched(true);
    setAuto(false);
    setInteractions((n) => n + 1);
  };

  // autoplay em loop: alterna Antes <-> Depois com pausa longa em cada lado.
  // Pausa se a seção sai da tela ou a pessoa está arrastando; retoma após RESUME_AFTER_MS sem interação.
  useEffect(() => {
    if (!inView || dragging || prefersReducedMotion()) return;
    let timer: number;
    const step = () => {
      setAuto(true);
      setPos((p) => (p >= 50 ? AUTO_AFTER : AUTO_BEFORE));
      timer = window.setTimeout(step, SWEEP_MS + HOLD_MS);
    };
    timer = window.setTimeout(step, interactions > 0 ? RESUME_AFTER_MS : 1200);
    return () => window.clearTimeout(timer);
  }, [inView, dragging, interactions]);

  const snap = (v: number) => {
    markInteraction();
    setPos(v);
  };

  return (
    <div ref={ref}>
      <div className="relative h-[430px] w-full select-none overflow-hidden rounded-2xl border border-emerald-400/40 bg-[#050A18] shadow-[0_0_60px_-15px_rgba(52,211,153,0.5)] sm:h-[520px] lg:h-[560px]">
        {/* DEPOIS (base) */}
        <img
          src={after}
          alt={`${systemName} — ${afterLabel}`}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '50% 30%' }}
        />
        {/* ANTES (revelado da esquerda) */}
        <img
          src={before}
          alt={`${systemName} — ${beforeLabel}`}
          draggable={false}
          className={`absolute inset-0 h-full w-full object-cover ${dragging ? '' : auto ? 'transition-[clip-path] duration-[2000ms] ease-in-out' : 'transition-[clip-path] duration-700 ease-out'}`}
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" aria-hidden="true" />

        {/* rótulos */}
        <span
          className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/15 bg-slate-800/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-100 backdrop-blur transition-opacity"
          style={{ opacity: pos < 14 ? 0 : 1 }}
        >
          Antes
        </span>
        <span
          className="pointer-events-none absolute right-3 top-3 rounded-full border border-emerald-300/50 bg-emerald-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white transition-opacity"
          style={{ opacity: pos > 86 ? 0 : 1 }}
        >
          Depois
        </span>
        <p className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-4 text-sm font-semibold text-white drop-shadow">
          {pos >= 50 ? beforeLabel : afterLabel}
        </p>

        {/* divisor + alça */}
        <div
          className={`pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_14px_rgba(255,255,255,0.8)] ${dragging ? '' : auto ? 'transition-[left] duration-[2000ms] ease-in-out' : 'transition-[left] duration-700 ease-out'}`}
          style={{ left: `${pos}%` }}
          aria-hidden="true"
        >
          <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#0B1221]/90 text-cyan-300 shadow-xl backdrop-blur">
            <ArrowLeftRight className="h-5 w-5" />
          </span>
        </div>

        {/* controle real (arrastar / teclado / leitor de tela) */}
        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          aria-label="Comparar antes e depois: arraste para revelar"
          onChange={(e) => {
            markInteraction();
            setPos(Number(e.target.value));
          }}
          onPointerDown={() => {
            markInteraction();
            setDragging(true);
          }}
          onPointerUp={() => {
            setDragging(false);
            setInteractions((n) => n + 1);
          }}
          onPointerCancel={() => setDragging(false)}
          onBlur={() => setDragging(false)}
          className="ba-range absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />

        {onExpand && (
          <button
            type="button"
            onClick={onExpand}
            aria-label="Ampliar fotos"
            className="absolute bottom-3 right-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur transition hover:bg-black/75"
          >
            <Expand className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* atalhos */}
      <div className="mt-3 flex items-center justify-center gap-2" role="group" aria-label="Atalhos do comparador">
        <button
          type="button"
          onClick={() => snap(100)}
          aria-pressed={pos >= 98}
          className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-bold transition ${
            pos >= 98 ? 'border-white/40 bg-white/15 text-white' : 'border-white/15 text-slate-300 hover:border-white/35'
          }`}
        >
          Antes
        </button>
        <span className={`flex items-center gap-1.5 text-xs text-slate-400 ${touched ? '' : 'animate-hint-nudge'}`}>
          <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" /> arraste para comparar
        </span>
        <button
          type="button"
          onClick={() => snap(0)}
          aria-pressed={pos <= 2}
          className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-bold transition ${
            pos <= 2
              ? 'border-emerald-300/60 bg-emerald-500 text-white'
              : 'border-emerald-400/30 text-emerald-300 hover:border-emerald-300/60'
          }`}
        >
          Depois
        </button>
      </div>
    </div>
  );
}
