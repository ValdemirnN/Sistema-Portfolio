export interface ShowcaseRepository {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  title: string;
  category: 'Faturamento' | 'Gestão' | 'Dados & BI' | 'Automação';
  description: string;
  businessValue: string;
  language: string;
  topics: string[];
  stars: number;
  forks: number;
  updatedAt: string;
  htmlUrl: string;
  homepageUrl?: string;
  isLiveGitHub: boolean;
  previewMetrics: {
    label: string;
    value: string;
  }[];
  previewWorkflow: string[];
}

export interface GitHubApiRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

export const SYSTEM_BLUEPRINTS: ShowcaseRepository[] = [
  {
    id: 'blueprint-faturamento-nfe',
    name: 'automacao-faturamento-conciliacao',
    fullName: 'repositorio-modelo/automacao-faturamento-conciliacao',
    owner: 'repositorio-modelo',
    title: 'Motor de Faturamento & Conciliação Bancária',
    category: 'Faturamento',
    description:
      'Sistema de emissão automática de cobranças recorrentes, leitura de retornos bancários e conciliação direta com registros financeiros no PostgreSQL.',
    businessValue: 'Elimina lançamentos manuais de boletos/PIX e reduz inadimplência com régua de cobrança programada.',
    language: 'TypeScript',
    topics: ['faturamento', 'conciliacao', 'supabase', 'vercel', 'nf-e'],
    stars: 24,
    forks: 6,
    updatedAt: '2026-10-18T14:20:00Z',
    htmlUrl: 'https://github.com',
    isLiveGitHub: false,
    previewMetrics: [
      { label: 'Conciliação Automática', value: '99,4%' },
      { label: 'Tempo de Fechamento', value: '-68%' },
      { label: 'Latência de Consulta', value: '42 ms' },
    ],
    previewWorkflow: [
      'Importação de pedidos ou contratos ativos',
      'Geração em lote de faturas e links PIX/Boleto',
      'Baixa automática via webhook e atualização de DRE',
    ],
  },
  {
    id: 'blueprint-etl-organizador',
    name: 'pipeline-organizacao-dados-sql',
    fullName: 'repositorio-modelo/pipeline-organizacao-dados-sql',
    owner: 'repositorio-modelo',
    title: 'Centralizador & Higienização de Planilhas para SQL',
    category: 'Dados & BI',
    description:
      'Conversor de planilhas dispersas (CSV/XLSX) e ERPs legados em tabelas relacionais normalizadas, com validação de CPF/CNPJ e detecção de duplicidades.',
    businessValue: 'Transforma arquivos despadronizados de múltiplos setores em base única auditável para relatórios gerenciais.',
    language: 'Python',
    topics: ['etl', 'pandas', 'postgresql', 'data-quality', 'bi'],
    stars: 31,
    forks: 9,
    updatedAt: '2026-10-04T09:45:00Z',
    htmlUrl: 'https://github.com',
    isLiveGitHub: false,
    previewMetrics: [
      { label: 'Registros Validados/min', value: '18.500' },
      { label: 'Duplicidades Removidas', value: '14,2%' },
      { label: 'Confiabilidade da Base', value: '99,8%' },
    ],
    previewWorkflow: [
      'Upload ou sincronização agendada de planilhas do time',
      'Padronização de datas, moedas, documentos e categorias',
      'Carga incremental no Supabase com histórico de versões',
    ],
  },
  {
    id: 'blueprint-gestao-servicos',
    name: 'painel-gestao-ordens-sla',
    fullName: 'repositorio-modelo/painel-gestao-ordens-sla',
    owner: 'repositorio-modelo',
    title: 'Painel Gerencial de Ordens de Serviço & SLA',
    category: 'Gestão',
    description:
      'Controle operacional de atendimentos, alocação de técnicos/equipes, cronômetro de SLA e aprovação digital pelo cliente final.',
    businessValue: 'Dá visibilidade imediata de gargalos na operação e vincula cada serviço concluído direto ao faturamento.',
    language: 'TypeScript',
    topics: ['gestao', 'sla', 'operacoes', 'react', 'supabase'],
    stars: 19,
    forks: 4,
    updatedAt: '2026-09-27T18:10:00Z',
    htmlUrl: 'https://github.com',
    isLiveGitHub: false,
    previewMetrics: [
      { label: 'Cumprimento de SLA', value: '96,1%' },
      { label: 'Ordens por Operador', value: '+34%' },
      { label: 'Retrabalho Operacional', value: '-41%' },
    ],
    previewWorkflow: [
      'Abertura de chamado com prioridade e prazo automático',
      'Distribuição inteligente por capacidade da equipe',
      'Encerramento com checklist e disparo para faturamento',
    ],
  },
  {
    id: 'blueprint-bi-margem',
    name: 'dashboard-desempenho-comercial-margem',
    fullName: 'repositorio-modelo/dashboard-desempenho-comercial-margem',
    owner: 'repositorio-modelo',
    title: 'Dashboard Executivo de Margem, Ticket & Metas',
    category: 'Dados & BI',
    description:
      'Painel analítico interativo para diretoria acompanhar receita líquida, margem por produto/serviço, CAC e projeção de caixa em 90 dias.',
    businessValue: 'Permite decisões semanais baseadas em margem real, não apenas em faturamento bruto.',
    language: 'TypeScript',
    topics: ['analytics', 'dashboard', 'kpi', 'margem', 'nextjs'],
    stars: 28,
    forks: 7,
    updatedAt: '2026-09-12T11:30:00Z',
    htmlUrl: 'https://github.com',
    isLiveGitHub: false,
    previewMetrics: [
      { label: 'Visibilidade de Margem', value: 'Tempo real' },
      { label: 'Relatórios Automatizados', value: '12/mês' },
      { label: 'Economia de Análise', value: '22 h/mês' },
    ],
    previewWorkflow: [
      'Consolidação diária de vendas, impostos e custos diretos',
      'Cálculo de margem de contribuição por centro de custo',
      'Alertas de desvio de meta para gestores',
    ],
  },
];

function inferCategory(repo: GitHubApiRepo): ShowcaseRepository['category'] {
  const haystack = `${repo.name} ${repo.description ?? ''} ${(repo.topics ?? []).join(' ')}`.toLowerCase();
  if (/(fatur|billing|invoic|financ|pagament|cobranca|pix|nfe|dre)/.test(haystack)) {
    return 'Faturamento';
  }
  if (/(data|dados|etl|sql|bi|analyt|dashboard|kpi|python|pandas|powerbi)/.test(haystack)) {
    return 'Dados & BI';
  }
  if (/(automat|bot|script|webhook|cron|integr|api|sync)/.test(haystack)) {
    return 'Automação';
  }
  return 'Gestão';
}

function formatRepoTitle(name: string): string {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function fetchGitHubRepos(username: string): Promise<{
  repos: ShowcaseRepository[];
  profileUrl: string;
  avatarUrl?: string;
}> {
  const cleanUser = username.trim().replace(/^@/, '');
  if (!cleanUser) {
    throw new Error('Informe um nome de usuário válido do GitHub.');
  }

  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(cleanUser)}/repos?sort=updated&per_page=18`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    }
  );

  if (response.status === 404) {
    throw new Error(`Usuário "${cleanUser}" não encontrado no GitHub.`);
  }
  if (response.status === 403) {
    throw new Error('Limite temporário de consultas da API pública do GitHub atingido. Tente novamente em instantes.');
  }
  if (!response.ok) {
    throw new Error(`Não foi possível carregar repositórios (${response.status}).`);
  }

  const rawRepos = (await response.json()) as GitHubApiRepo[];
  const filtered = rawRepos.filter((r) => !r.fork && !r.archived);
  const selected = filtered.length > 0 ? filtered : rawRepos;

  const repos: ShowcaseRepository[] = selected.slice(0, 12).map((repo) => {
    const category = inferCategory(repo);
    return {
      id: `gh-${repo.id}`,
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.owner.login,
      title: formatRepoTitle(repo.name),
      category,
      description:
        repo.description?.trim() ||
        'Sistema estruturado no GitHub pronto para adaptação, integração com banco Supabase e implantação em produção.',
      businessValue:
        category === 'Faturamento'
          ? 'Automação de cobranças, conciliação financeira e redução de erros manuais.'
          : category === 'Dados & BI'
            ? 'Organização de dados brutos em indicadores claros para tomada de decisão.'
            : category === 'Automação'
              ? 'Eliminação de tarefas operacionais repetitivas via fluxos automatizados.'
              : 'Padronização de processos internos, controle de entregas e visibilidade gerencial.',
      language: repo.language || 'TypeScript',
      topics: repo.topics && repo.topics.length > 0 ? repo.topics : [category.toLowerCase()],
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: repo.updated_at,
      htmlUrl: repo.html_url,
      homepageUrl: repo.homepage && repo.homepage.trim() ? repo.homepage.trim() : undefined,
      isLiveGitHub: true,
      previewMetrics: [
        { label: 'Estrelas', value: String(repo.stargazers_count) },
        { label: 'Forks', value: String(repo.forks_count) },
        { label: 'Stack Principal', value: repo.language || 'Web / SQL' },
      ],
      previewWorkflow: [
        `Código-fonte versionado em ${repo.full_name}`,
        'Arquitetura modular compatível com deploy Vercel + Supabase',
        'Personalizável para regras de negócio e identidade do cliente',
      ],
    };
  });

  return {
    repos,
    profileUrl: `https://github.com/${cleanUser}`,
    avatarUrl: selected[0]?.owner.avatar_url,
  };
}

function decodeBase64Utf8(base64: string): string {
  const sanitized = base64.replace(/\n/g, '');
  const binary = atob(sanitized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
}

export async function fetchGitHubRepoInspectData(
  owner: string,
  repo: string
): Promise<{
  readmeExcerpt: string | null;
  languages: { name: string; percentage: number }[];
}> {
  const [readmeRes, langRes] = await Promise.allSettled([
    fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`, {
      headers: { Accept: 'application/vnd.github+json' },
    }),
    fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`, {
      headers: { Accept: 'application/vnd.github+json' },
    }),
  ]);

  let readmeExcerpt: string | null = null;
  if (readmeRes.status === 'fulfilled' && readmeRes.value.ok) {
    const data = (await readmeRes.value.json()) as { content?: string };
    if (data.content) {
      const decoded = decodeBase64Utf8(data.content);
      readmeExcerpt = decoded.slice(0, 2600);
    }
  }

  let languages: { name: string; percentage: number }[] = [];
  if (langRes.status === 'fulfilled' && langRes.value.ok) {
    const langMap = (await langRes.value.json()) as Record<string, number>;
    const total = Object.values(langMap).reduce((acc, val) => acc + val, 0);
    if (total > 0) {
      languages = Object.entries(langMap)
        .map(([name, bytes]) => ({
          name,
          percentage: Math.round((bytes / total) * 1000) / 10,
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);
    }
  }

  return { readmeExcerpt, languages };
}
