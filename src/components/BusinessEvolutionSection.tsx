import { ArrowRight } from 'lucide-react';

const COMPARISON_ROWS = [
  {
    dimension: 'Organização de Dados',
    before: 'Planilhas paralelas por setor, versões conflitantes e perda de histórico.',
    after: 'Base única no Supabase (PostgreSQL) com validação automática e acesso por perfil.',
  },
  {
    dimension: 'Faturamento & Cobranças',
    before: 'Emissão manual uma a uma e conferência lenta de extratos bancários.',
    after: 'Cobrança programada em lote, baixa automática via webhook e alerta de pendências.',
  },
  {
    dimension: 'Visibilidade de Margem',
    before: 'Diretoria percebe queda de lucro semanas após o fechamento do mês.',
    after: 'Painel executivo diário com receita líquida, metas e custo por centro de resultado.',
  },
  {
    dimension: 'Escala da Operação',
    before: 'Crescer obriga contratar mais gente apenas para digitar e conferir relatórios.',
    after: 'A operação cresce sem depender de mais digitação e conferência manual.',
  },
];

export function BusinessEvolutionSection() {
  return (
    <section id="evolucao" className="border-b border-slate-800/80 bg-[#060B16] py-16 sm:py-20">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-12 2xl:px-16">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-sky-400">
            02. Evolução Operacional &amp; Retorno
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl [text-wrap:balance]">
            Do controle manual ao sistema integrado
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Comparativo entre operar com planilhas dispersas e operar com dados centralizados, automatizados e acessíveis por perfil.
          </p>
        </div>

        {/* Tabela Antes vs Depois */}
        <div className="mt-10 overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0B1221] text-xs font-semibold text-slate-300">
                <th className="px-6 py-3.5 w-1/5">Área da Empresa</th>
                <th className="px-6 py-3.5 w-2/5">Operação Manual (Sem Sistema)</th>
                <th className="px-6 py-3.5 w-2/5 text-sky-400">
                  Operação Centralizada (Dashboard + Automação)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-[#0F172A] text-xs sm:text-sm">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.dimension}>
                  <td className="px-6 py-4 font-semibold text-white align-top">
                    {row.dimension}
                  </td>
                  <td className="px-6 py-4 text-slate-400 align-top leading-relaxed">
                    {row.before}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-100 align-top leading-relaxed bg-blue-950/20">
                    {row.after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
