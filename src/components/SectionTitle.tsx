export function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  // a numeração "02." era só decoração; o rótulo fica limpo
  const label = eyebrow.replace(/^\d+\.\s*/, '');
  return (
    <div className="max-w-3xl">
      <p className="flex items-center gap-3 text-sm font-semibold text-cyan-300">
        <span className="h-px w-8 bg-gradient-to-r from-blue-500 to-cyan-300" aria-hidden="true" />
        {label}
      </p>
      <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.7rem] lg:leading-[1.1] [text-wrap:balance]">
        {title}
      </h2>
      {text && <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">{text}</p>}
    </div>
  );
}
