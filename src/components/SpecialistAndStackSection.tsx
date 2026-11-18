import { useState } from 'react';
import { UserCheck } from 'lucide-react';

const STACK_PILLARS = [
  {
    index: '01.',
    title: 'Frontend & API Edge na Vercel',
    detail:
      'Entrega global com carregamento instantâneo de gráficos e tabelas, atualizações contínuas direto do GitHub e zero configuração de servidor manual.',
  },
  {
    index: '02.',
    title: 'Banco Relacional no Supabase (PostgreSQL)',
    detail:
      'Estrutura SQL sólida para faturamento, clientes e auditoria, com autenticação nativa e Row-Level Security garantindo que cada usuário veja apenas seus dados.',
  },
  {
    index: '03.',
    title: 'Sincronização & Automação Contínua',
    detail:
      'Rotinas programadas de conciliação, geração de relatórios gerenciais e webhooks financeiros integrados sem planilhas intermediárias.',
  },
];

export function SpecialistAndStackSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="arquitetura" className="border-b border-slate-800 bg-slate-900 py-16 text-slate-100 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="h-full min-h-[340px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              {!imgError ? (
                <img
                  src="/assets/aistudio/IMG_0150.JPG_6ab8c007.jpeg"
                  alt="Foto de perfil do analista de dados e desenvolvedor de sistemas"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-top lg:max-h-[480px]"
                />
              ) : (
                <div className="flex h-full min-h-[340px] flex-col items-center justify-center p-8 text-center">
                  <UserCheck className="h-12 w-12 text-blue-400" aria-hidden="true" />
                  <p className="mt-3 font-display text-base font-semibold text-white">
                    Especialista em Dados &amp; Sistemas
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="text-xs font-medium tracking-wide text-blue-400">
              04. Quem Desenvolve &amp; Arquitetura de Produção
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl [text-wrap:balance]">
              Análise de dados aplicada à engenharia de sistemas escaláveis
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              Como analista de dados e desenvolvedor, uno a leitura precisa dos indicadores do seu negócio com código de produção limpo. Cada dashboard nasce modelado sobre regras reais de faturamento, estoque e operação — sem ferramentas engessadas.
            </p>

            <div className="mt-8 divide-y divide-slate-800 border-y border-slate-800">
              {STACK_PILLARS.map((item) => (
                <div key={item.index} className="py-4 first:pt-4 last:pb-4">
                  <h3 className="font-display text-sm font-semibold text-white sm:text-base">
                    <span className="mr-2 font-mono text-xs text-blue-400">{item.index}</span>
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
