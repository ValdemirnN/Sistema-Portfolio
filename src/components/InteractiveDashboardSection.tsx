import { useMemo, useState } from 'react';
import { ArrowUpRight, CheckCircle2, RotateCcw, Search } from 'lucide-react';
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

const COMPACT_MODULE_LABELS: Record<SystemModuleId, string> = {
  faturamento: 'Faturamento Automático',
  gestao: 'Gestão & SLA',
  dados: 'Dados & BI',
};

const COMPACT_NICHE_LABELS: Record<BusinessNicheId, string> = {
  servicos: 'Serviços B2B',
  clinicas: 'Clínicas',
  logistica: 'Logística',
  varejo: 'Varejo',
};

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
            automationNote: 'Conciliado em lote agora',
          }
        : rec
    );
  }, [records, reconciledIds]);

  const pendingCount = effectiveRecords.filter((r) => r.status === 'Pendente').length;
  const reconciledCount = effectiveRecords.length - pendingCount;
  const reconciliationPct = Math.round((reconciledCount / effectiveRecords.length) * 100);

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
        ? `${count} registros conciliados e atualizados no livro fiscal.`
        : 'Todos os lançamentos deste recorte já foram conciliados.'
    );
  };

  const handleResetSimulation = () => {
    setReconciledIds({});
    setBatchMessage(null);
  };

  // Geometria precisa do gráfico SVG
  const svgWidth = 660;
  const svgHeight = 230;
  const padLeft = 58;
  const padRight = 22;
  const padTop = 20;
  const padBottom = 34;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  const rawMax = Math.max(...chartSeries.map((pt) => Math.max(pt.automated, pt.baseline)), 1);
  const yMax = Math.ceil((rawMax * 1.15) / 10000) * 10000;

  const points = chartSeries.map((pt, idx) => {
    const stepX = chartSeries.length > 1 ? plotW / (chartSeries.length - 1) : plotW / 2;
    const x = chartSeries.length > 1 ? padLeft + idx * stepX : padLeft + plotW / 2;
    const yAuto = padTop + plotH - (pt.automated / yMax) * plotH;
    const yBase = padTop + plotH - (pt.baseline / yMax) * plotH;
    return { ...pt, x, yAuto, yBase, idx };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yAuto.toFixed(1)}`)
    .join(' ');
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`
      : '';
  const baselinePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yBase.toFixed(1)}`)
    .join(' ');

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;
  const ringRadius = 38;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference - (reconciliationPct / 100) * ringCircumference;

  return (
    <section id="painel" className="border-b border-slate-800/80 bg-[#090F1D] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-sky-400">
              01. Central Interativa de Dashboards
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl [text-wrap:balance]">
              Visualize seus resultados e teste a automação de faturamento ao vivo
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Alterne módulo, segmento e período para inspecionar métricas, curva comparativa e conciliação em lote em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-[#0F172A] p-1 self-start">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriodId(p.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  periodId === p.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Barra única alinhada sem quebra em 2 linhas no desktop */}
        <div className="mt-8 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div
            className="inline-flex items-center gap-1 overflow-x-auto rounded-lg border border-slate-800 bg-[#0F172A] p-1"
            role="tablist"
            aria-label="Módulos do sistema"
          >
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
                  className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  {COMPACT_MODULE_LABELS[mod.id]}
                </button>
              );
            })}
          </div>

          <div className="inline-flex items-center gap-1 overflow-x-auto rounded-lg border border-slate-800 bg-[#0F172A] p-1">
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
                  className={`rounded-md px-3 py-2 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                  }`}
                >
                  {COMPACT_NICHE_LABELS[n.id]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Superfície única do Dashboard */}
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-800 bg-[#0F172A]">
          {/* Cabeçalho interno */}
          <div className="flex flex-col justify-between gap-3 border-b border-slate-800 px-6 py-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-white">
                {activeModule.label} · {niche.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{niche.shortDesc}</p>
            </div>

            <button
              type="button"
              onClick={() =>
                onSelectForQuote({
                  nicheLabel: niche.label,
                  moduleLabel: activeModule.label,
                })
              }
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Adaptar este painel para minha empresa
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* 4 KPIs Tabulares */}
          <div className="grid grid-cols-1 divide-y divide-slate-800 border-b border-slate-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="px-6 py-5">
                <p className="text-xs font-medium text-slate-400">{kpi.label}</p>
                <p className="mt-1.5 font-mono text-2xl font-semibold tracking-tight text-white tabular-nums">
                  {kpi.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{kpi.detail}</p>
              </div>
            ))}
          </div>

          {/* Gráfico SVG de Área + Painel de Automação com Anel SVG */}
          <div className="grid grid-cols-1 divide-y divide-slate-800 border-b border-slate-800 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
            <div className="p-6 lg:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {activeModule.primaryChartTitle}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Passe o cursor sobre os pontos da curva para comparar os resultados
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-xs bg-sky-400" aria-hidden="true" />
                    {activeModule.automatedSeriesLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-0.5 w-3.5 border-t-2 border-dashed border-slate-400" aria-hidden="true" />
                    {activeModule.baselineSeriesLabel}
                  </span>
                </div>
              </div>

              <div className="relative mt-5">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="h-60 w-full overflow-visible"
                  role="img"
                  aria-label={activeModule.primaryChartTitle}
                >
                  <defs>
                    <linearGradient id="autoAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Linhas de grade horizontais + escala monetária */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = padTop + plotH - ratio * plotH;
                    const val = Math.round((yMax * ratio) / 1000);
                    return (
                      <g key={ratio}>
                        <line
                          x1={padLeft}
                          y1={y}
                          x2={svgWidth - padRight}
                          y2={y}
                          stroke="#1E293B"
                          strokeDasharray={ratio === 0 ? undefined : '4 4'}
                        />
                        <text
                          x={padLeft - 10}
                          y={y + 4}
                          textAnchor="end"
                          className="fill-slate-400 font-mono text-[10px]"
                        >
                          {val === 0 ? 'R$ 0' : `R$ ${val}k`}
                        </text>
                      </g>
                    );
                  })}

                  {/* Área e curva do sistema automatizado */}
                  {areaPath && <path d={areaPath} fill="url(#autoAreaGrad)" />}
                  {baselinePath && (
                    <path
                      d={baselinePath}
                      fill="none"
                      stroke="#64748B"
                      strokeWidth="2"
                      strokeDasharray="5 5"
                    />
                  )}
                  {linePath && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Guia vertical no ponto ativo */}
                  {hoveredPoint && (
                    <line
                      x1={hoveredPoint.x}
                      y1={padTop}
                      x2={hoveredPoint.x}
                      y2={padTop + plotH}
                      stroke="#38BDF8"
                      strokeOpacity="0.35"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Pontos, rótulos X e áreas de interação */}
                  {points.map((pt) => {
                    const isHover = hoveredIndex === pt.idx;
                    return (
                      <g key={pt.label}>
                        <circle
                          cx={pt.x}
                          cy={pt.yBase}
                          r={isHover ? 4.5 : 3}
                          fill="#94A3B8"
                        />
                        <circle
                          cx={pt.x}
                          cy={pt.yAuto}
                          r={isHover ? 6 : 4}
                          fill="#38BDF8"
                          stroke="#0F172A"
                          strokeWidth="2"
                        />
                        <text
                          x={pt.x}
                          y={svgHeight - 8}
                          textAnchor="middle"
                          className="fill-slate-300 font-mono text-[11px]"
                        >
                          {pt.label}
                        </text>
                        <rect
                          x={pt.x - 36}
                          y={padTop}
                          width={72}
                          height={plotH + 20}
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredIndex(pt.idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Readout dinâmico fixo/flutuante sem salto de layout */}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-[#0B1221] px-4 py-2.5 text-xs">
                  {hoveredPoint ? (
                    <>
                      <span className="font-semibold text-white">
                        {hoveredPoint.label} · Ganho de +{hoveredPoint.efficiencyGain}%
                      </span>
                      <div className="flex flex-wrap items-center gap-4 font-mono tabular-nums">
                        <span className="text-sky-400">
                          Sistema:{' '}
                          {hoveredPoint.automated.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            maximumFractionDigits: 0,
                          })}
                        </span>
                        <span className="text-slate-400">
                          Manual:{' '}
                          {hoveredPoint.baseline.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-slate-400">
                        Comparativo de performance acumulada no recorte selecionado
                      </span>
                      <span className="font-mono text-sky-400 tabular-nums">
                        Média de ganho: +
                        {Math.round(
                          chartSeries.reduce((a, b) => a + b.efficiencyGain, 0) /
                            chartSeries.length
                        )}
                        %
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Painel lateral com indicador circular SVG + Ação de Lote */}
            <div className="flex flex-col justify-between p-6 lg:col-span-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Motor de Conciliação Financeira
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                  Processe faturas pendentes em lote e acompanhe a taxa de fechamento automático em tempo real.
                </p>

                <div className="mt-5 flex items-center gap-5 border-y border-slate-800 py-5">
                  <svg width="92" height="92" viewBox="0 0 92 92" className="shrink-0">
                    <circle
                      cx="46"
                      cy="46"
                      r={ringRadius}
                      fill="none"
                      stroke="#1E293B"
                      strokeWidth="8"
                    />
                    <circle
                      cx="46"
                      cy="46"
                      r={ringRadius}
                      fill="none"
                      stroke={reconciliationPct === 100 ? '#10B981' : '#38BDF8'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringDashOffset}
                      transform="rotate(-90 46 46)"
                      className="transition-all duration-300"
                    />
                    <text
                      x="46"
                      y="50"
                      textAnchor="middle"
                      className="fill-white font-mono text-sm font-semibold"
                    >
                      {reconciliationPct}%
                    </text>
                  </svg>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-400">Conciliados</span>
                      <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                        {reconciledCount} / {effectiveRecords.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-400">Pendentes</span>
                      <span className="font-mono font-semibold text-amber-400 tabular-nums">
                        {pendingCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={handleBatchReconcile}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-blue-500 cursor-pointer"
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
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    Restaurar Simulação
                  </button>
                )}

                {batchMessage && (
                  <p className="text-xs font-medium text-emerald-400" role="status">
                    {batchMessage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Filtro + Tabela de alta densidade */}
          <div className="flex flex-col justify-between gap-3 border-b border-slate-800 px-6 py-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-xs">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cliente, código ou setor..."
                aria-label="Buscar registros na tabela"
                className="w-full rounded-lg border border-slate-700 bg-[#0B1221] py-1.5 pr-3 pl-9 text-xs text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-[#0B1221] p-1 self-start sm:self-auto">
              {(['Todos', 'Conciliado', 'Pendente'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    statusFilter === status
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-slate-200'
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
                <tr className="border-b border-slate-800 bg-[#0B1221] text-slate-400">
                  <th className="px-6 py-3 font-medium">Código</th>
                  <th className="px-4 py-3 font-medium">Operação / Lançamento</th>
                  <th className="px-4 py-3 font-medium">Setor</th>
                  <th className="px-4 py-3 font-medium">Automação Executada</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Situação</th>
                  <th className="px-6 py-3 text-right font-medium">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((rec) => (
                    <tr key={rec.id} className="h-11 transition-colors hover:bg-slate-800/40">
                      <td className="px-6 py-2.5 font-mono text-slate-400 tabular-nums whitespace-nowrap">
                        {rec.code}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-white">{rec.title}</td>
                      <td className="px-4 py-2.5 text-slate-300 whitespace-nowrap">
                        {rec.sector}
                      </td>
                      <td className="px-4 py-2.5 text-slate-300">{rec.automationNote}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400 tabular-nums whitespace-nowrap">
                        {rec.date}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`font-medium ${
                            rec.status === 'Conciliado'
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="px-6 py-2.5 text-right font-mono font-semibold text-white tabular-nums whitespace-nowrap">
                        {rec.amount.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-xs text-slate-400">
                      Nenhum registro encontrado para os filtros aplicados.{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('Todos');
                        }}
                        className="font-semibold text-sky-400 hover:underline cursor-pointer"
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
