export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#060B16] py-10">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-sm font-bold text-white">Valdemir Nunes</p>
          <p className="mt-1 text-xs text-slate-400">
            Analista de Dados &amp; Desenvolvedor de Sistemas
          </p>
          <p className="mt-1 text-xs text-slate-400">
            <a href="mailto:nvaldemir76@gmail.com" className="hover:text-white">nvaldemir76@gmail.com</a>
            {' · '}
            <a href="https://wa.me/5584996071347" className="hover:text-white">(84) 99607-1347</a>
            {' · '}
            <a href="https://linkedin.com/in/valdemir-nunes-2b35a01a3" className="hover:text-white">LinkedIn</a>
          </p>
        </div>

        <nav
          aria-label="Links do rodapé"
          className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-400"
        >
          <a href="#evolucao" className="hover:text-white">
            Impacto &amp; ROI
          </a>
          <a href="#repositorios" className="hover:text-white">
            GitHub
          </a>
          <a href="#arquitetura" className="hover:text-white">
            Vercel + Supabase
          </a>
          <a href="#contato" className="hover:text-white">
            Solicitar Solução
          </a>
        </nav>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Valdemir Nunes Nicácio · Assu/RN
        </p>
      </div>
    </footer>
  );
}
