import { CheckCheck, Expand, Heart, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Testimonial } from '../data/profile';
import { prefersReducedMotion, useInView } from './useReveal';

interface Props {
  testimonial: Testimonial;
  before?: string;
  after?: string;
  onOpenPhoto: (which: 'before' | 'after') => void;
  onOpenPrints?: () => void;
}

interface Msg {
  id: string;
  time: string;
  text?: string;
  photo?: 'before' | 'after';
  highlight?: boolean;
}

/** Conversa real do WhatsApp "recortada" em balões, que se reproduz quando aparece na tela. */
export function ChatReplay({ testimonial: t, before, after, onOpenPhoto, onOpenPrints }: Props) {
  const messages: Msg[] = [
    { id: 'm1', time: '09:31', photo: 'before', text: 'Meu estoque e agendamento ANTES' },
    { id: 'm2', time: '09:32', photo: 'after', text: 'Meu estoque e agendamento HOJE' },
    { id: 'm3', time: '09:33', text: t.quote, highlight: true },
  ];

  const [rootRef, inView] = useInView<HTMLDivElement>(0.35);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [runId, setRunId] = useState(0);
  const [liked, setLiked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // sequência: "digitando…" → mensagem, três vezes
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setShown(messages.length);
      return;
    }
    setShown(0);
    const timers: number[] = [];
    const typingFor = [700, 1500, 1700];
    let at = 0;
    typingFor.forEach((d, i) => {
      timers.push(window.setTimeout(() => setTyping(true), at));
      at += d;
      timers.push(
        window.setTimeout(() => {
          setTyping(false);
          setShown(i + 1);
        }, at),
      );
      at += 300;
    });
    return () => timers.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, runId]);

  // mantém a última mensagem visível dentro da janela do chat (sem rolar a página)
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [shown, typing]);

  const replay = () => {
    setLiked(false);
    setShown(0);
    setRunId((n) => n + 1);
  };

  const srcFor = (p?: 'before' | 'after') => (p === 'before' ? before : p === 'after' ? after : undefined);

  return (
    <div
      ref={rootRef}
      className="mx-auto flex h-[560px] w-full max-w-[400px] flex-col overflow-hidden rounded-[28px] border border-white/15 bg-[#0b141a] shadow-[0_30px_80px_-30px_rgba(16,185,129,0.45)]"
    >
      {/* cabeçalho do chat */}
      <div className="flex items-center gap-3 bg-[#1f2c34] px-4 py-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 font-display text-sm font-extrabold text-white">
          LL
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#e9edef]">{t.author}</p>
          <p className={`text-xs transition-colors ${typing ? 'text-emerald-400' : 'text-[#8696a0]'}`} aria-live="polite">
            {typing ? 'digitando…' : 'online'}
          </p>
        </div>
        <button
          type="button"
          onClick={replay}
          aria-label="Rever a conversa"
          title="Rever a conversa"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#8696a0] transition hover:bg-white/10 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* mensagens */}
      <div
        ref={scrollRef}
        role="log"
        aria-label="Conversa com a cliente"
        className="flex-1 space-y-2.5 overflow-y-auto px-3 py-4"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      >
        <p className="mx-auto w-fit rounded-lg bg-[#1f2c34] px-3 py-1 text-[11px] font-medium text-[#8696a0]">
          Mensagens reais da cliente
        </p>

        {messages.slice(0, shown).map((m) => {
          const src = srcFor(m.photo);
          return (
            <div key={m.id} className="animate-bubble-in flex flex-col items-start">
              <div
                className={`max-w-[88%] rounded-xl rounded-tl-sm bg-[#1f2c34] p-1.5 text-[#e9edef] ${
                  m.highlight ? 'ring-1 ring-emerald-400/60 shadow-[0_0_30px_-8px_rgba(52,211,153,0.6)]' : ''
                }`}
              >
                {src && (
                  <button
                    type="button"
                    onClick={() => onOpenPhoto(m.photo!)}
                    aria-label={`Ampliar foto: ${m.text}`}
                    className="group relative block cursor-zoom-in overflow-hidden rounded-lg"
                  >
                    <img
                      src={src}
                      alt={m.text}
                      loading="lazy"
                      className="aspect-[4/5] w-[210px] object-cover transition-transform duration-500 group-hover:scale-105 sm:w-[230px]"
                      style={{ objectPosition: m.photo === 'after' ? '50% 32%' : '50% 50%' }}
                    />
                    <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100">
                      <Expand className="h-3.5 w-3.5" />
                    </span>
                  </button>
                )}
                <p
                  className={`px-2 pb-1 pt-1.5 leading-snug ${
                    m.highlight ? 'text-[15px] font-medium' : 'text-sm'
                  } ${m.photo ? '' : 'pt-1'}`}
                >
                  {m.text}
                </p>
                <p className="flex justify-end px-2 pb-0.5 text-[11px] text-[#8696a0]">{m.time}</p>
              </div>

              {m.highlight && (
                <button
                  type="button"
                  onClick={() => setLiked((v) => !v)}
                  aria-pressed={liked}
                  aria-label={liked ? 'Remover reação' : 'Reagir com coração'}
                  className={`mt-1.5 ml-2 flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    liked
                      ? 'border-rose-400/50 bg-rose-500/15 text-rose-200'
                      : 'border-white/15 bg-white/5 text-[#8696a0] hover:border-white/30 hover:text-white'
                  }`}
                >
                  <Heart
                    key={String(liked)}
                    className={`h-3.5 w-3.5 ${liked ? 'animate-heart-pop fill-rose-400 text-rose-400' : ''}`}
                    aria-hidden="true"
                  />
                  {liked ? 'Valeu, Luz e Letras!' : 'Reagir'}
                </button>
              )}
            </div>
          );
        })}

        {typing && (
          <div className="animate-bubble-in flex w-fit items-center gap-1 rounded-xl rounded-tl-sm bg-[#1f2c34] px-4 py-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="typing-dot h-1.5 w-1.5 rounded-full bg-[#8696a0]"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* rodapé */}
      <div className="flex items-center justify-between gap-3 bg-[#1f2c34] px-4 py-2.5">
        <p className="flex items-center gap-1.5 text-[11px] text-[#8696a0]">
          <CheckCheck className="h-4 w-4 text-sky-400" aria-hidden="true" />
          Enviado pelo WhatsApp da cliente
        </p>
        {onOpenPrints && (
          <button
            type="button"
            onClick={onOpenPrints}
            className="cursor-pointer text-xs font-semibold text-cyan-300 underline-offset-4 transition hover:text-cyan-200 hover:underline"
          >
            Ver prints originais
          </button>
        )}
      </div>
    </div>
  );
}
