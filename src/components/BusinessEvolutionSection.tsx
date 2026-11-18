import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface BusinessEvolutionSectionProps {
  onApplyEstimatedHours: (hoursSaved: number) => void;
}

const COMPARISON_ROWS = [
  {
    dimension: 'Organização de Dados',
    before: 'Planilhas paralelas por setor, versões conflitantes e risco de perda de histórico.',
    after: 'Base única no Supabase (PostgreSQL) com validação automática e acesso por usuário.',
  },
  {
    dimension: 'Faturamento & Cobranças',
    before: 'Emissão manual uma a uma, esquecimento de reajustes e conferência demorada de extratos.',
    after: 'Faturamento programado em lote, conciliação automática e alerta imediato de pendências.',
  },
  {
    dimension: 'Visibilidade de Resultados',
    before: 'Diretoria descobre queda de margem apenas semanas depois do fechamento do mês.',
    after: 'Painel executivo atualizado em tempo real com metas, ticket médio e custo por serviço.',
  },
  {
    dimension: 'Escala da Operação',
    before: 'Crescer exige contratar mais pessoas apenas para digitar e conferir relatórios.',
    after: 'Equipe opera o dobro do volume mantendo o mesmo time administrativo.',
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
    const monthlyManualHours = weeklyManualHours * 4.33;
    const automationRecoveryRate = 0.72;
    const savedHoursPerMonth = Math.round(monthlyManualHours * automationRecoveryRate);
    const savedHoursPerYear = savedHoursPerMonth * 12;
    const laborSavingsYear = Math.round(savedHoursPerYear * hourlyCost);
    const billingErrorAvoidedYear = Math.round(monthlyInvoices * 12 * 6.5);
    const totalAnnualImpact = laborSavingsYear + billingErrorAvoidedYear;

    return {
      savedHoursPerMonth,
      savedHoursPerYear,
      totalAnnualImpact,
      recommendedTier:
        monthlyInvoices > 250 || teamSize > 10
          ? 'Sistema Sob Medida (Multi-Setor)'
          : 'Solução Pronta Adaptada ao Nicho',
    };
  }, [weeklyManualHours, monthlyInvoices, teamSize, hourlyCost]);

  return (
    <section id="evolucao" className="border-b border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-blue-700">
            02. Evolução Operacional &amp; Retorno
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl [text-wrap:balance]">
            Por que centralizar seus sistemas acelera o crescimento da empresa
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Simule o impacto da automação no seu fluxo atual e compare a operação fragmentada com um sistema estruturado para o seu negócio.
          </p>
        </div>

        {/* Simulador de ROI interativo */}
        <div className="mt-10 grid grid-cols-1 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
          <div className="space-y-6 bg-white p-6 sm:p-8 lg:col-span-7">
            <h3 className="font-display text-base font-semibold text-slate-900">
              Simulador de Economia Operacional
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="slider-hours" className="font-medium text-slate-700">
                    Horas/semana em planilhas
                  </label>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
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
                  className="mt-2.5 w-full accent-blue-700 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="slider-invoices" className="font-medium text-slate-700">
                    Cobranças / notas por mês
                  </label>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
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
                  className="mt-2.5 w-full accent-blue-700 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="slider-team" className="font-medium text-slate-700">
                    Pessoas usando relatórios
                  </label>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
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
                  className="mt-2.5 w-full accent-blue-700 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="slider-cost" className="font-medium text-slate-700">
                    Custo médio/hora da equipe
                  </label>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
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
                  className="mt-2.5 w-full accent-blue-700 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Estimativa anual com automação
              </p>
              <p className="mt-2 font-mono text-3xl font-bold tracking-tight text-slate-900 tabular-nums sm:text-4xl">
                {metrics.totalAnnualImpact.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                entre horas operacionais recuperadas e falhas de faturamento evitadas
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200 pt-5">
                <div>
                  <p className="text-xs text-slate-500">Tempo liberado/mês</p>
                  <p className="mt-1 font-mono text-xl font-semibold text-blue-700 tabular-nums">
                    {metrics.savedHoursPerMonth} h
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Modelo indicado</p>
                  <p className="mt-1 text-xs font-semibold text-slate-900">
                    {metrics.recommendedTier}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onApplyEstimatedHours(metrics.savedHoursPerMonth)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-blue-800 cursor-pointer"
            >
              Solicitar Diagnóstico com Esta Estimativa
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Tabela comparativa Antes vs Depois */}
        <div className="mt-10 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                <th className="px-6 py-3.5 w-1/5">Área da Empresa</th>
                <th className="px-6 py-3.5 w-2/5">Operação Manual (Sem Sistema)</th>
                <th className="px-6 py-3.5 w-2/5 text-blue-800">
                  Operação Centralizada (Dashboard + Automação)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-xs sm:text-sm">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.dimension}>
                  <td className="px-6 py-4 font-semibold text-slate-900 align-top">
                    {row.dimension}
                  </td>
                  <td className="px-6 py-4 text-slate-600 align-top leading-relaxed">
                    {row.before}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 align-top leading-relaxed bg-blue-50/30">
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
