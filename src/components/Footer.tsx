export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#060B16] py-10">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-sm font-bold text-white">Vértice Sistemas</p>
          <p className="mt-1 text-xs text-slate-400">
            Dashboards de Desempenho · Organização de Dados · Automação de Faturamento
          </p>
        </div>

        <nav
          aria-label="Links do rodapé"
          className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-400"
        >
          <a href="#painel" className="hover:text-white">
            Dashboards
          </a>
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
          © {new Date().getFullYear()} Vértice Sistemas
        </p>
      </div>
    </footer>
  );
}
