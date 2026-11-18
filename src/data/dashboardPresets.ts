export type SystemModuleId = 'faturamento' | 'gestao' | 'dados';
export type BusinessNicheId = 'clinicas' | 'logistica' | 'varejo' | 'servicos';
export type PeriodId = '30d' | '90d' | '12m';

export interface ChartPoint {
  label: string;
  automated: number;
  baseline: number;
  efficiencyGain: number;
}

export interface LedgerRecord {
  id: string;
  code: string;
  title: string;
  sector: string;
  date: string;
  amount: number;
  status: 'Conciliado' | 'Pendente' | 'Em Revisão';
  automationNote: string;
}

export interface NichePreset {
  id: BusinessNicheId;
  label: string;
  shortDesc: string;
  scaleFactor: number;
  sampleEntities: {
    title: string;
    sector: string;
    note: string;
  }[];
}

export const NICHES: NichePreset[] = [
  {
    id: 'servicos',
    label: 'Serviços B2B',
    shortDesc: 'Contratos recorrentes, ordens técnicas e faturamento mensal por SLA.',
    scaleFactor: 1,
    sampleEntities: [
      { title: 'Contrato Mensal · Grupo Horizonte', sector: 'Recorrência', note: 'NF-e emitida automaticamente' },
      { title: 'Implantação ERP · Vanguarda Log', sector: 'Projetos', note: 'Parcela 2/4 via webhook PIX' },
      { title: 'Auditoria Trimestral · Atlas', sector: 'Consultoria', note: 'Aguardando retorno bancário' },
      { title: 'Manutenção Preventiva · Norte Sul', sector: 'SLA Ouro', note: 'Conciliado com extrato' },
      { title: 'Licença Corporativa · Prime Tech', sector: 'Assinaturas', note: 'Fatura agendada em lote' },
    ],
  },
  {
    id: 'clinicas',
    label: 'Clínicas & Saúde',
    shortDesc: 'Repasse médico, faturamento de convênios TISS e agenda sem faltas.',
    scaleFactor: 1.24,
    sampleEntities: [
      { title: 'Lote Convênio Unimed · #408', sector: 'Convênios', note: 'Glosas validadas antes do envio' },
      { title: 'Repasse Corpo Clínico · Outubro', sector: 'Repasse Médico', note: 'Rateio calculado por procedimento' },
      { title: 'Pacote Check-up Executivo', sector: 'Particular', note: 'Recibo e NF-e enviados no WhatsApp' },
      { title: 'Lote Bradesco Saúde · #411', sector: 'Convênios', note: 'Aguardando conferência XML' },
      { title: 'Exames Laboratoriais · Unidade Centro', sector: 'Diagnóstico', note: 'Baixa automática em caixa' },
    ],
  },
  {
    id: 'logistica',
    label: 'Logística & Frota',
    shortDesc: 'CT-e automatizado, custo por km rodado e margem por rota.',
    scaleFactor: 1.58,
    sampleEntities: [
      { title: 'Romaneio Carga Sul · #8821', sector: 'Frete Dedicado', note: 'CT-e vinculado à fatura do cliente' },
      { title: 'Faturamento Quinzenal · AgroVale', sector: 'Agronegócio', note: 'Conciliado com canhoto digital' },
      { title: 'Operação Cross-Docking SP-MG', sector: 'Transferência', note: 'Aguardando fechamento de pedágio' },
      { title: 'Coleta Expressa · Rede Farma', sector: 'Última Milha', note: 'Boleto emitido automaticamente' },
      { title: 'Contrato Frota Refrigerada', sector: 'Perecíveis', note: 'Margem líquida apurada por rota' },
    ],
  },
  {
    id: 'varejo',
    label: 'Varejo & Atacado',
    shortDesc: 'Giro de estoque, conciliação de cartões/PIX e ruptura zero.',
    scaleFactor: 1.38,
    sampleEntities: [
      { title: 'Fechamento Caixa Matriz + 3 Filiais', sector: 'PDV & PIX', note: 'Taxas de adquirente auditadas' },
      { title: 'Pedido Atacado · Mercado Central', sector: 'B2B Atacado', note: 'Boleto e estoque baixados em tempo real' },
      { title: 'Reposição Automática Curva A', sector: 'Compras', note: 'Aguardando aprovação de alçada' },
      { title: 'Conciliação Marketplace · Lote 19', sector: 'E-commerce', note: 'Repasse conferido centavo a centavo' },
      { title: 'Fatura Distribuidora Regional', sector: 'Atacado', note: 'NF-e e XML arquivados no Supabase' },
    ],
  },
];

export const MODULES: {
  id: SystemModuleId;
  label: string;
  subtitle: string;
  primaryChartTitle: string;
  automatedSeriesLabel: string;
  baselineSeriesLabel: string;
}[] = [
  {
    id: 'faturamento',
    label: 'Automação de Faturamento',
    subtitle: 'Emissão em lote, régua de cobrança e conciliação bancária em tempo real.',
    primaryChartTitle: 'Receita Conciliada vs. Processo Manual Anterior',
    automatedSeriesLabel: 'Com Automação',
    baselineSeriesLabel: 'Processo Manual',
  },
  {
    id: 'gestao',
    label: 'Gestão & Produtividade',
    subtitle: 'Controle de ordens de serviço, cumprimento de SLA e capacidade da equipe.',
    primaryChartTitle: 'Entregas no Prazo vs. Gargalo Operacional',
    automatedSeriesLabel: 'Fluxo Sistematizado',
    baselineSeriesLabel: 'Controle em Planilha',
  },
  {
    id: 'dados',
    label: 'Organização de Dados & BI',
    subtitle: 'Unificação de planilhas dispersas em base SQL auditável com margem real.',
    primaryChartTitle: 'Margem Líquida Apurada vs. Estimativa Histórica',
    automatedSeriesLabel: 'Base Unificada SQL',
    baselineSeriesLabel: 'Planilhas Isoladas',
  },
];

export const PERIODS: { id: PeriodId; label: string; multiplier: number }[] = [
  { id: '30d', label: '30 dias', multiplier: 1 },
  { id: '90d', label: 'Trimestre', multiplier: 2.9 },
  { id: '12m', label: '12 meses', multiplier: 11.4 },
];

export function buildDashboardData(
  moduleId: SystemModuleId,
  nicheId: BusinessNicheId,
  periodId: PeriodId
) {
  const niche = NICHES.find((n) => n.id === nicheId) ?? NICHES[0];
  const period = PERIODS.find((p) => p.id === periodId) ?? PERIODS[0];
  const scale = niche.scaleFactor * period.multiplier;

  const baseSeries: Record<PeriodId, { label: string; auto: number; base: number }[]> = {
    '30d': [
      { label: 'Sem 1', auto: 38400, base: 29100 },
      { label: 'Sem 2', auto: 44200, base: 31800 },
      { label: 'Sem 3', auto: 49800, base: 33400 },
      { label: 'Sem 4', auto: 56900, base: 35200 },
    ],
    '90d': [
      { label: 'Mês 1', auto: 148000, base: 112000 },
      { label: 'Mês 2', auto: 174500, base: 121000 },
      { label: 'Mês 3', auto: 204200, base: 128400 },
    ],
    '12m': [
      { label: 'Jan', auto: 128000, base: 102000 },
      { label: 'Mar', auto: 146000, base: 109000 },
      { label: 'Mai', auto: 162000, base: 114000 },
      { label: 'Jul', auto: 184000, base: 119000 },
      { label: 'Set', auto: 206000, base: 125000 },
      { label: 'Nov', auto: 229000, base: 131000 },
    ],
  };

  const chartSeries: ChartPoint[] = baseSeries[periodId].map((pt) => {
    const moduleFactor = moduleId === 'faturamento' ? 1 : moduleId === 'dados' ? 0.84 : 0.72;
    const automated = Math.round(pt.auto * niche.scaleFactor * moduleFactor);
    const baseline = Math.round(pt.base * niche.scaleFactor * moduleFactor);
    const efficiencyGain = Math.round(((automated - baseline) / baseline) * 100);
    return {
      label: pt.label,
      automated,
      baseline,
      efficiencyGain,
    };
  });

  const totalRevenue = chartSeries.reduce((acc, p) => acc + p.automated, 0);
  const hoursSaved = Math.round(38 * scale * (moduleId === 'dados' ? 1.15 : 1));
  const leakagePrevented = Math.round(totalRevenue * 0.064);

  const kpis =
    moduleId === 'faturamento'
      ? [
          {
            label: 'Faturamento Conciliado',
            value: totalRevenue.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 0,
            }),
            detail: '+28,4% sobre fluxo manual',
          },
          {
            label: 'Perdas / Glosas Evitadas',
            value: leakagePrevented.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 0,
            }),
            detail: 'Validação automática pré-emissão',
          },
          {
            label: 'Taxa de Conciliação',
            value: '99,4%',
            detail: 'PIX, boleto e retorno CNAB',
          },
          {
            label: 'Horas Poupadas',
            value: `${hoursSaved} h`,
            detail: 'Sem digitação manual no financeiro',
          },
        ]
      : moduleId === 'gestao'
        ? [
            {
              label: 'Ordens Concluídas no SLA',
              value: '96,2%',
              detail: '+21,8 p.p. após implantação',
            },
            {
              label: 'Tempo Médio de Execução',
              value: '3h 18m',
              detail: 'Redução de 44% no ciclo operacional',
            },
            {
              label: 'Receita Vinculada à OS',
              value: totalRevenue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0,
              }),
              detail: 'Zero serviço entregue sem cobrança',
            },
            {
              label: 'Horas de Gestão Poupadas',
              value: `${hoursSaved} h`,
              detail: 'Eliminação de follow-up manual',
            },
          ]
        : [
            {
              label: 'Margem Líquida Auditada',
              value: totalRevenue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0,
              }),
              detail: 'Cálculo real por centro de custo',
            },
            {
              label: 'Fontes Unificadas no SQL',
              value: '6 bases',
              detail: 'Planilhas, ERP e extratos no Supabase',
            },
            {
              label: 'Inconsistências Corrigidas',
              value: '99,8%',
              detail: 'Higienização automática na entrada',
            },
            {
              label: 'Horas de Análise Poupadas',
              value: `${hoursSaved} h`,
              detail: 'Relatórios gerados em segundos',
            },
          ];

  const baseAmounts = [14800, 9650, 7420, 18900, 11300];
  const statuses: LedgerRecord['status'][] = [
    'Conciliado',
    'Conciliado',
    'Pendente',
    'Conciliado',
    'Pendente',
  ];
  const dates = ['17/11/2026', '16/11/2026', '15/11/2026', '14/11/2026', '12/11/2026'];

  const records: LedgerRecord[] = niche.sampleEntities.map((entity, idx) => ({
    id: `${nicheId}-${moduleId}-${idx}`,
    code: `#${moduleId === 'faturamento' ? 'FAT' : moduleId === 'gestao' ? 'OS' : 'ETL'}-${410 + idx}`,
    title: entity.title,
    sector: entity.sector,
    date: dates[idx],
    amount: Math.round(baseAmounts[idx] * niche.scaleFactor),
    status: statuses[idx],
    automationNote: entity.note,
  }));

  return { kpis, chartSeries, records, niche };
}
