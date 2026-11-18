import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface BusinessEvolutionSectionProps {
  onApplyEstimatedHours: (hoursSaved: number) => void;
}

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
    after: 'Equipe dobra o volume atendido mantendo o mesmo time administrativo.',
  },
];

export function BusinessEvolutionSection({
  onApplyEstimatedHours,
}: BusinessEvolutionSectionProps) {
  const [weeklyManualHours, setWeeklyManualHours] = useState(14);
  const [monthlyInvoices, setMonthlyInvoices] = useState(180);
  const [teamSize, setTeamSize] = useState(6);
  const [hourlyCost, setHourlyCost] = useState(48);

  const metrics = useMemo(() => {
    const monthlyManualHours = Math.round(weeklyManualHours * 4.33);
    const savedHoursPerMonth = Math.round(monthlyManualHours * 0.72);
    const residualHoursPerMonth = Math.max(2, monthlyManualHours - savedHoursPerMonth);
    const savedHoursPerYear = savedHoursPerMonth * 12;
    const laborSavingsYear = Math.round(savedHoursPerYear * hourlyCost);
    const billingErrorAvoidedYear = Math.round(monthlyInvoices * 12 * 6.5);
    const totalAnnualImpact = laborSavingsYear + billingErrorAvoidedYear;

    return {
      monthlyManualHours,
      savedHoursPerMonth,
      residualHoursPerMonth,
      totalAnnualImpact,
      recommendedTier:
        monthlyInvoices > 250 || teamSize > 10
          ? 'Sistema Sob Medida (Multi-Setor)'
          : 'Solução Pronta Adaptada ao Nicho',
    };
  }, [weeklyManualHours, monthlyInvoices, teamSize, hourlyCost]);

  return (
    <section id="evolucao" className="border-b border-slate-800/80 bg-[#060B16] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-sky-400">
            02. Evolução Operacional &amp; Retorno
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl [text-wrap:balance]">
            Quanto sua empresa ganha ao substituir controles manuais por sistema
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Ajuste os números da sua operação para estimar horas liberadas e economia anual com dados centralizados e faturamento automático.
          </p>
        </div>

        {/* Simulador ROI em dark slate */}
        <div className="mt-10 grid grid-cols-1 divide-y divide-slate-800 overflow-hidden rounded-xl border border-slate-800 bg-[#0F172A] lg:grid-cols-12 lg:divide-x lg:divide-y-0">
          <div className="space-y-6 p-6 sm:p-8 lg:col-span-7">
            <h3 className="font-display text-base font-semibold text-white">
              Parâmetros da Operação Atual
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="slider-hours" className="font-medium text-slate-300">
                    Horas/semana em planilhas
                  </label>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    {weeklyManualHours} h/sem
                  </span>
                </div>
                <input
                  id="slider-hours"
                  type="range"
                  min={4}
                  max={45}
                  value={weeklyManualHours}
                  onChange={(e) => setWeeklyManualHours(Number(e.target.value))}
                  className="mt-2.5 w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="slider-invoices" className="font-medium text-slate-300">
                    Cobranças / notas por mês
                  </label>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    {monthlyInvoices}/mês
                  </span>
                </div>
                <input
                  id="slider-invoices"
                  type="range"
                  min={20}
                  max={1000}
                  step={10}
                  value={monthlyInvoices}
                  onChange={(e) => setMonthlyInvoices(Number(e.target.value))}
                  className="mt-2.5 w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="slider-team" className="font-medium text-slate-300">
                    Pessoas usando relatórios
                  </label>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    {teamSize} usuários
                  </span>
                </div>
                <input
                  id="slider-team"
                  type="range"
                  min={1}
                  max={40}
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="mt-2.5 w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="slider-cost" className="font-medium text-slate-300">
                    Custo médio/hora da equipe
                  </label>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    R$ {hourlyCost}/h
                  </span>
                </div>
                <input
                  id="slider-cost"
                  type="range"
                  min={25}
                  max={150}
                  step={5}
                  value={hourlyCost}
                  onChange={(e) => setHourlyCost(Number(e.target.value))}
                  className="mt-2.5 w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Comparativo visual de carga horária Antes vs Depois */}
            <div className="space-y-3 border-t border-slate-800 pt-5">
              <p className="text-xs font-medium text-slate-400">
                Esforço operacional mensal estimado (horas dedicadas a rotinas administrativas)
              </p>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300">
                    <span>Hoje (processo manual)</span>
                    <span className="font-mono tabular-nums">{metrics.monthlyManualHours} h/mês</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-full bg-slate-500" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sky-400">
                    <span>Com sistema + automação</span>
                    <span className="font-mono tabular-nums">{metrics.residualHoursPerMonth} h/mês</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-sky-400 transition-all duration-200"
                      style={{
                        width: `${Math.round(
                          (metrics.residualHoursPerMonth / metrics.monthlyManualHours) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-[#0B1221] p-6 sm:p-8 lg:col-span-5">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Impacto financeiro estimado por ano
              </p>
              <p className="mt-2 font-mono text-3xl font-bold tracking-tight text-sky-400 tabular-nums sm:text-4xl">
                {metrics.totalAnnualImpact.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                somando horas recuperadas da equipe e redução de falhas em cobranças
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-5">
                <div>
                  <p className="text-xs text-slate-400">Horas liberadas/mês</p>
                  <p className="mt-1 font-mono text-xl font-semibold text-white tabular-nums">
                    {metrics.savedHoursPerMonth} h
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Indicação técnica</p>
                  <p className="mt-1 text-xs font-semibold text-white">
                    {metrics.recommendedTier}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onApplyEstimatedHours(metrics.savedHoursPerMonth)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-blue-500 cursor-pointer"
            >
              Solicitar Diagnóstico com Esta Estimativa
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
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
