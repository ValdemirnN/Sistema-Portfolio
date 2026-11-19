import { useEffect, useRef, useState } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Fica `true` (uma única vez) quando o elemento aparece na tela. */
export function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, seen] as const;
}

/** Fica `true` enquanto o elemento está visível e volta a `false` quando sai da tela (serve para pausar loops). */
export function useInViewLive<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, visible] as const;
}

/**
 * Conta de 0 até `target` quando `run` vira `true`.
 * Com `loopHoldMs`, depois de chegar ao valor espera esse tempo e recomeça do zero, em loop.
 */
export function useCountUp(target: number, run: boolean, ms = 1400, loopHoldMs = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let raf = 0;
    let timer = 0;
    const play = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / ms);
        setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
        else if (loopHoldMs > 0) timer = window.setTimeout(play, loopHoldMs);
      };
      raf = requestAnimationFrame(tick);
    };
    play();
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [target, run, ms, loopHoldMs]);

  return value;
}
