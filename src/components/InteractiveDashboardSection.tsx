import { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw, Search, ArrowUpRight } from 'lucide-react';
import {
  buildDashboardData,
  MODULES,
  NICHES,
  PERIODS,
  type BusinessNicheId,
  type PeriodId,
  type SystemModuleId,
} from '../data/dashboardPresets';

interface InteractiveDashboardSectionProps {
  onSelectForQuote: (context: { nicheLabel: string; moduleLabel: string }) => void;
}

export function InteractiveDashboardSection({
  onSelectForQuote,
}: InteractiveDashboardSectionProps) {
  const [moduleId, setModuleId] = useState<SystemModuleId>('faturamento');
  const [nicheId, setNicheId] = useState<BusinessNicheId>('servicos');
  const [periodId, setPeriodId] = useState<PeriodId>('30d');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Conciliado' | 'Pendente'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [reconciledIds, setReconciledIds] = useState<Record<string, boolean>>({});
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [batchMessage, setBatchMessage] = useState<string | null>(null);

  const activeModule = MODULES.find((m) => m.id === moduleId) ?? MODULES[0];
  const { kpis, chartSeries, records, niche } = useMemo(
    () => buildDashboardData(moduleId, nicheId, periodId),
    [moduleId, nicheId, periodId]
  );

  const effectiveRecords = useMemo(() => {
    return records.map((rec) =>
      reconciledIds[rec.id]
        ? {
            ...rec,
            status: 'Conciliado' as const,
            automationNote: 'Conciliado agora via execução em lote',
          }
        : rec
    );
  }, [records, reconciledIds]);

  const pendingCount = effectiveRecords.filter((r) => r.status === 'Pendente').length;

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return effectiveRecords.filter((rec) => {
      const matchesStatus = statusFilter === 'Todos' || rec.status === statusFilter;
      const matchesQuery =
        !q ||
        rec.title.toLowerCase().includes(q) ||
        rec.code.toLowerCase().includes(q) ||
        rec.sector.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [effectiveRecords, statusFilter, searchQuery]);

  const handleBatchReconcile = () => {
    const updates: Record<string, boolean> = { ...reconciledIds };
    let count = 0;
    for (const rec of effectiveRecords) {
      if (rec.status === 'Pendente') {
        updates[rec.id] = true;
        count += 1;
      }
    }
    setReconciledIds(updates);
    setBatchMessage(
      count > 0
        ? `${count} registros pendentes conciliados e enviados para o livro fiscal.`
        : 'Todos os registros deste recorte já estão conciliados.'
    );
  };

  const handleResetSimulation = () => {
    setReconciledIds({});
    setBatchMessage(null);
  };

  const maxChartValue = Math.max(
    ...chartSeries.map((pt) => Math.max(pt.automated, pt.baseline)),
    1
  );

  return (
    <section id="painel" className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-blue-700">
              01. Demonstração Interativa do Sistema
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl [text-wrap:balance]">
              Veja na prática como seus dados e cobranças operam em um único painel
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Alterne entre módulos, nichos de mercado e períodos para explorar os indicadores reais que entrego aos clientes. Você também pode executar uma conciliação em lote abaixo.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 self-start">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriodId(p.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  periodId === p.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Barra de seleção de módulo e nicho */}
        <div className="mt-8 flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Módulos do sistema">
            {MODULES.map((mod) => {
              const active = moduleId === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setModuleId(mod.id);
                    setBatchMessage(null);
                  }}
                  className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-blue-700 bg-blue-700 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {mod.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-medium text-slate-500">Nicho:</span>
            {NICHES.map((n) => {
              const active = nicheId === n.id;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    setNicheId(n.id);
                    setBatchMessage(null);
                  }}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                  }`}
                >
                  {n.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Superfície principal do painel (elevação única, sem cards aninhados) */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {/* Sub-cabeçalho contextual */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {activeModule.label} · {niche.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{niche.shortDesc}</p>
            </div>

            <button
              type="button"
              onClick={() =>
                onSelectForQuote({
                  nicheLabel: niche.label,
                  moduleLabel: activeModule.label,
                })
              }
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Quero este painel para minha empresa
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Linha de 4 KPIs com divisores hairline */}
          <div className="grid grid-cols-1 divide-y divide-slate-200 border-b border-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="px-6 py-5">
                <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
                <p className="mt-1.5 font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
                  {kpi.value}
                </p>
                <p className="mt-1 text-xs text-slate-600">{kpi.detail}</p>
              </div>
            ))}
          </div>

          {/* Gráfico comparativo SVG interativo + Resumo operacional */}
          <div className="grid grid-cols-1 divide-y divide-slate-200 border-b border-slate-200 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
            <div className="p-6 lg:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {activeModule.primaryChartTitle}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Passe o cursor sobre cada período para comparar os valores exatos
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-xs bg-blue-700" aria-hidden="true" />
                    {activeModule.automatedSeriesLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-xs bg-slate-300" aria-hidden="true" />
                    {activeModule.baselineSeriesLabel}
                  </span>
                </div>
              </div>

              <div className="relative mt-6">
                <div className="grid h-56 items-end gap-4 pt-6" style={{ gridTemplateColumns: `repeat(${chartSeries.length}, minmax(0, 1fr))` }}>
                  {chartSeries.map((point, idx) => {
                    const autoPct = Math.max(12, Math.round((point.automated / maxChartValue) * 100));
                    const basePct = Math.max(10, Math.round((point.baseline / maxChartValue) * 100));
                    const isHovered = hoveredIndex === idx;

                    return (
                      <div
                        key={point.label}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onFocus={() => setHoveredIndex(idx)}
                        onBlur={() => setHoveredIndex(null)}
                        tabIndex={0}
                        className="group relative flex h-full flex-col justify-end focus:outline-none"
                      >
                        {isHovered && (
                          <div className="absolute -top-2 left-1/2 z-10 w-44 -translate-x-1/2 rounded-lg border border-slate-200 bg-slate-900 px-3 py-2 text-xs text-white shadow-md pointer-events-none">
                            <p className="font-semibold text-slate-100">
                              {point.label} · +{point.efficiencyGain}% ganho
                            </p>
                            <p className="mt-1 font-mono tabular-nums text-blue-300">
                              Sistema: {point.automated.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                            </p>
                            <p className="font-mono tabular-nums text-slate-300">
                              Manual: {point.baseline.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                            </p>
                          </div>
                        )}

                        <div className="flex h-44 items-end justify-center gap-2 border-b border-slate-200 px-1 pb-0.5">
                          <div
                            className="w-full max-w-8 rounded-t bg-slate-200 transition-opacity duration-150 group-hover:opacity-80"
                            style={{ height: `${basePct}%` }}
                            title={`${activeModule.baselineSeriesLabel}: ${point.baseline.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}`}
                          />
                          <div
                            className="w-full max-w-8 rounded-t bg-blue-700 transition-colors duration-150 group-hover:bg-blue-800"
                            style={{ height: `${autoPct}%` }}
                            title={`${activeModule.automatedSeriesLabel}: ${point.automated.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}`}
                          />
                        </div>

                        <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                          <span className="font-medium">{point.label}</span>
                          <span className="font-mono text-[11px] font-medium text-blue-700 tabular-nums">
                            +{point.efficiencyGain}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Painel lateral de automação de faturamento */}
            <div className="flex flex-col justify-between p-6 lg:col-span-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Automação de Fluxo Financeiro
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  Em vez de conferir planilhas e boletos manualmente, o sistema valida os lançamentos e concilia os recebimentos em uma única ação.
                </p>

                <div className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Registros no recorte</span>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {effectiveRecords.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Já conciliados</span>
                    <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                      {effectiveRecords.length - pendingCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Aguardando lote</span>
                    <span className="font-mono font-semibold text-amber-700 tabular-nums">
                      {pendingCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={handleBatchReconcile}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-slate-800 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {pendingCount > 0
                    ? `Conciliar ${pendingCount} Pendentes em Lote`
                    : 'Todos os Lançamentos Conciliados'}
                </button>

                {Object.keys(reconciledIds).length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetSimulation}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    Restaurar Estado Inicial
                  </button>
                )}

                {batchMessage && (
                  <p className="text-xs font-medium text-emerald-700" role="status">
                    {batchMessage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Barra de filtro da tabela + Tabela de alta densidade */}
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-xs">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cliente, código ou setor..."
                aria-label="Buscar registros na tabela"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 self-start sm:self-auto">
              {(['Todos', 'Conciliado', 'Pendente'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    statusFilter === status
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-6 py-3 font-medium">Código</th>
                  <th className="px-4 py-3 font-medium">Operação / Lançamento</th>
                  <th className="px-4 py-3 font-medium">Setor</th>
                  <th className="px-4 py-3 font-medium">Automação Executada</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Situação</th>
                  <th className="px-6 py-3 text-right font-medium">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((rec) => (
                    <tr key={rec.id} className="h-11 transition-colors hover:bg-slate-50">
                      <td className="px-6 py-2.5 font-mono text-slate-600 tabular-nums whitespace-nowrap">
                        {rec.code}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-slate-900">
                        {rec.title}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">
                        {rec.sector}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">{rec.automationNote}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-500 tabular-nums whitespace-nowrap">
                        {rec.date}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`font-medium ${
                            rec.status === 'Conciliado'
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="px-6 py-2.5 text-right font-mono font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                        {rec.amount.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-xs text-slate-500">
                      Nenhum registro encontrado para os filtros aplicados.{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('Todos');
                        }}
                        className="font-semibold text-blue-700 hover:underline cursor-pointer"
                      >
                        Limpar filtros
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
