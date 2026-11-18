import { useState } from 'react';
import { UserCheck } from 'lucide-react';

const STACK_PILLARS = [
  {
    index: '01.',
    title: 'Frontend & Edge Delivery na Vercel',
    detail:
      'Painéis carregam instantaneamente na borda global com deploy contínuo direto do GitHub e zero manutenção de servidor.',
  },
  {
    index: '02.',
    title: 'Banco PostgreSQL Escalável no Supabase',
    detail:
      'Modelagem relacional limpa para faturamento, clientes e histórico, com autenticação integrada e Row-Level Security.',
  },
  {
    index: '03.',
    title: 'Automação de Dados & Cobranças',
    detail:
      'Rotinas programadas para conciliação financeira, higienização de planilhas e emissão de relatórios gerenciais confiáveis.',
  },
];

export function SpecialistAndStackSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="arquitetura" className="border-b border-slate-800/80 bg-[#060B16] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="h-full min-h-[340px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              {!imgError ? (
                <img
                  src="/assets/aistudio/_CHA7796.jpg_46f352b6.jpeg"
                  alt="Retrato executivo do analista de dados e desenvolvedor de sistemas"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-top lg:max-h-[480px]"
                />
              ) : (
                <div className="flex h-full min-h-[340px] flex-col items-center justify-center p-8 text-center">
                  <UserCheck className="h-12 w-12 text-sky-400" aria-hidden="true" />
                  <p className="mt-3 font-display text-base font-semibold text-white">
                    Especialista em Dados &amp; Sistemas
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="text-xs font-medium tracking-wide text-sky-400">
              04. Especialista &amp; Arquitetura de Produção
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl [text-wrap:balance]">
              Da análise dos seus dados até o sistema rodando em produção
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 tracking-[0.01em] sm:text-base">
              Como analista de dados e desenvolvedor de sistemas, traduzo regras reais de faturamento, estoque e operação em aplicações rápidas na Vercel com banco de dados PostgreSQL estruturado no Supabase.
            </p>

            <div className="mt-8 divide-y divide-slate-800 border-y border-slate-800">
              {STACK_PILLARS.map((item) => (
                <div key={item.index} className="py-4">
                  <h3 className="font-display text-sm font-semibold text-white sm:text-base">
                    <span className="mr-2 font-mono text-xs text-sky-400">{item.index}</span>
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
