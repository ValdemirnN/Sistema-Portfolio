import { useState } from 'react';
import { ArrowRight, UserCheck } from 'lucide-react';

interface HeroSectionProps {
  onExploreDashboard: () => void;
  onExploreRepos: () => void;
}

const PROOF_METRICS = [
  {
    value: '-68%',
    label: 'Tempo de fechamento financeiro',
    context: 'Substituindo planilhas manuais por conciliação automática',
  },
  {
    value: '99,4%',
    label: 'Precisão no faturamento recorrente',
    context: 'Validação prévia de cadastros, impostos e retornos bancários',
  },
  {
    value: '100%',
    label: 'Dados centralizados em SQL',
    context: 'Base única no Supabase com permissões por perfil de acesso',
  },
  {
    value: 'Vercel + Supabase',
    label: 'Infraestrutura escalável em produção',
    context: 'Carregamento rápido na borda e banco PostgreSQL gerenciado',
  },
];

export function HeroSection({ onExploreDashboard, onExploreRepos }: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="topo" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="text-xs font-medium tracking-wide text-blue-700">
              Análise de Dados · Engenharia de Sistemas · Automação Financeira
            </p>

            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[3.15rem] lg:leading-[1.12] [text-wrap:balance]">
              Sistemas de gestão, organização de dados e faturamento automatizado.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Centralize controles dispersos em painéis interativos que mostram margem, cobranças e produtividade em tempo real. Adquira um sistema pronto ou encomende uma arquitetura sob medida para o seu nicho, rodando com alta disponibilidade na Vercel e Supabase.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreDashboard}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-800 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 cursor-pointer"
              >
                Testar Painel Interativo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onExploreRepos}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors duration-150 hover:bg-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 cursor-pointer"
              >
                Pré-visualizar Repositórios GitHub
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[360px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {!imgError ? (
                <img
                  src="/assets/aistudio/_CHA7796.jpg_46f352b6.jpeg"
                  alt="Retrato profissional do analista de dados e desenvolvedor de sistemas"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-top lg:max-h-[470px]"
                />
              ) : (
                <div className="flex h-full min-h-[360px] flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-8 text-center">
                  <UserCheck className="h-12 w-12 text-blue-700" aria-hidden="true" />
                  <p className="mt-3 font-display text-base font-semibold text-slate-900">
                    Analista de Dados &amp; Desenvolvedor de Sistemas
                  </p>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent p-5 text-white">
                <p className="font-display text-sm font-semibold">
                  Analista de Dados &amp; Desenvolvedor Full-Stack
                </p>
                <p className="mt-0.5 text-xs text-slate-200">
                  Sistemas de Gestão · Pipelines SQL · Automação de Cobranças
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {PROOF_METRICS.map((item) => (
            <div key={item.label} className="p-5 sm:p-6">
              <p className="font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {item.value}
              </p>
              <p className="mt-1.5 text-sm font-semibold text-slate-800">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.context}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
