export function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium tracking-wide text-sky-400">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl [text-wrap:balance]">{title}</h2>
      {text && <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">{text}</p>}
    </div>
  );
}
