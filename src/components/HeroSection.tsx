import { useState } from 'react';
import { ArrowRight, UserCheck } from 'lucide-react';

interface HeroSectionProps {
  onExploreDashboard: () => void;
  onExploreRepos: () => void;
}

const PROOF_METRICS = [
  {
    value: '3',
    label: 'Sistemas próprios publicados',
    context: 'Fisiopulso, Luz & Letras e Ritmo Fit, todos em produção',
  },
  {
    value: '1.000+',
    label: 'Commits nos repositórios',
    context: 'Desenvolvimento contínuo e versionado no GitHub',
  },
  {
    value: 'SQL',
    label: 'Dados centralizados',
    context: 'PostgreSQL no Supabase com acesso isolado por empresa (RLS)',
  },
  {
    value: 'BI',
    label: 'Dashboards e automações',
    context: 'Power BI, Power Query e VBA aplicados na operação',
  },
];

export function HeroSection({ onExploreDashboard, onExploreRepos }: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="topo"
      className="relative overflow-hidden border-b border-slate-800/80 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.16),_transparent_55%),linear-gradient(180deg,_#060B16_0%,_#0A1120_100%)]"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="text-xs font-medium tracking-wide text-sky-400">
              Análise de Dados · Engenharia de Sistemas · Automação de Faturamento
            </p>

            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1] [text-wrap:balance]">
              Dashboards de desempenho e faturamento automatizado sob medida.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 tracking-[0.01em] sm:text-lg">
              Centralizo seus controles operacionais, organizo dados dispersos em banco SQL e automatizo a régua de cobranças para sua empresa enxergar margem real e escalar sem retrabalho.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreDashboard}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-500 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 cursor-pointer"
              >
                Explorar Painel ao Vivo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onExploreRepos}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-slate-100 transition-colors duration-150 hover:border-slate-500 hover:bg-slate-800 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 cursor-pointer"
              >
                Pré-visualizar Projetos GitHub
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[380px] overflow-hidden rounded-xl border border-slate-800 bg-[#050C24]">
              {!imgError ? (
                <img
                  src="/assets/aistudio/IMG_0150.JPG_6ab8c007.jpeg"
                  alt="Retrato profissional do analista de dados e desenvolvedor de sistemas"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-top lg:max-h-[470px]"
                />
              ) : (
                <div className="flex h-full min-h-[380px] flex-col items-center justify-center bg-slate-900 p-8 text-center">
                  <UserCheck className="h-12 w-12 text-blue-400" aria-hidden="true" />
                  <p className="mt-3 font-display text-base font-semibold text-white">
                    Analista de Dados &amp; Desenvolvedor de Sistemas
                  </p>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060B16] via-[#060B16]/80 to-transparent p-5">
                <p className="font-display text-sm font-semibold text-white">
                  Analista de Dados &amp; Desenvolvedor Full-Stack
                </p>
                <p className="mt-0.5 text-xs text-slate-300">
                  Sistemas de Gestão · Pipelines SQL · Deploy Vercel &amp; Supabase
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Faixa horizontal de métricas com largura total e alinhamento uniforme */}
        <div className="mt-12 grid grid-cols-1 divide-y divide-slate-800 rounded-xl border border-slate-800 bg-[#0B1221] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {PROOF_METRICS.map((item) => (
            <div key={item.label} className="p-5 sm:p-6">
              <p className="font-mono text-2xl font-semibold tracking-tight text-sky-400 tabular-nums whitespace-nowrap">
                {item.value}
              </p>
              <p className="mt-1.5 text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.context}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
