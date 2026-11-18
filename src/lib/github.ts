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
  isPrivate?: boolean;
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

export const DEFAULT_GITHUB_USER = 'ValdemirnN';

// Projetos reais em destaque. Repositórios privados não aparecem na API pública do GitHub,
// por isso os dados deles ficam aqui. Os públicos são atualizados ao vivo (estrelas, data, linguagens, README).
export const FEATURED_PROJECTS: ShowcaseRepository[] = [
  {
    id: 'featured-fisiopulso',
    name: 'Fisiopulso',
    fullName: 'ValdemirnN/Fisiopulso',
    owner: 'ValdemirnN',
    title: 'Fisiopulso — Gestão para Clínicas de Fisioterapia',
    category: 'Gestão',
    description:
      'SaaS multiempresa para fisioterapeutas, clínicas e studios de Pilates: pacientes, prontuários SOAP, agenda integrada, lembretes automatizados, controle financeiro e administração de assinaturas.',
    businessValue:
      'Centraliza atendimento, agenda e financeiro da clínica em um único sistema, com dados isolados por empresa.',
    language: 'TypeScript',
    topics: ['react', 'typescript', 'supabase', 'rls', 'vercel', 'tailwind'],
    stars: 0,
    forks: 0,
    updatedAt: '',
    htmlUrl: 'https://github.com/ValdemirnN/Fisiopulso',
    homepageUrl: 'https://fisio-cloud.vercel.app',
    isLiveGitHub: false,
    isPrivate: true,
    previewMetrics: [
      { label: 'Commits', value: '633' },
      { label: 'Banco', value: 'PostgreSQL + RLS' },
      { label: 'Deploy', value: 'Vercel' },
    ],
    previewWorkflow: [
      'Cadastro de pacientes e prontuários SOAP',
      'Agenda integrada com lembretes automatizados',
      'Controle financeiro e administração de assinaturas',
    ],
  },
  {
    id: 'featured-luz-letra',
    name: 'Luz-Letra',
    fullName: 'ValdemirnN/Luz-Letra',
    owner: 'ValdemirnN',
    title: 'Luz & Letras — Gestão para Locadoras de Eventos',
    category: 'Gestão',
    description:
      'SaaS multiempresa para locação de itens para eventos: estoque, agendamentos, orçamentos, recibos em PDF, fluxo de caixa e integrações com Google Calendar, Google Maps e Mercado Pago.',
    businessValue:
      'Unifica estoque, agenda e financeiro e automatiza orçamentos e recibos que antes dependiam de planilhas.',
    language: 'Python',
    topics: ['python', 'streamlit', 'supabase', 'pandas', 'plotly', 'github-actions'],
    stars: 0,
    forks: 0,
    updatedAt: '',
    htmlUrl: 'https://github.com/ValdemirnN/Luz-Letra',
    homepageUrl: 'https://luzeletras.streamlit.app',
    isLiveGitHub: true,
    previewMetrics: [
      { label: 'Commits', value: '363' },
      { label: 'Stack', value: 'Python + Streamlit' },
      { label: 'Banco', value: 'Supabase' },
    ],
    previewWorkflow: [
      'Controle de estoque e agenda de locações',
      'Orçamentos e recibos em PDF gerados automaticamente',
      'Fluxo de caixa com integração Mercado Pago e Google Calendar',
    ],
  },
  {
    id: 'featured-ritmo-fit',
    name: 'ritmo-fit',
    fullName: 'ValdemirnN/ritmo-fit',
    owner: 'ValdemirnN',
    title: 'Ritmo Fit — App Multiplataforma',
    category: 'Gestão',
    description:
      'Aplicativo em Flutter (Dart) com versões Android, iOS e web, backend em Supabase e versão web publicada na Vercel.',
    businessValue:
      'Mostra como um mesmo código entrega app mobile e web conectados a um banco centralizado.',
    language: 'Dart',
    topics: ['flutter', 'dart', 'supabase', 'vercel'],
    stars: 0,
    forks: 0,
    updatedAt: '',
    htmlUrl: 'https://github.com/ValdemirnN/ritmo-fit',
    homepageUrl: 'https://meutreino-app-br.vercel.app',
    isLiveGitHub: true,
    previewMetrics: [
      { label: 'Commits', value: '96' },
      { label: 'Plataformas', value: 'Android · iOS · Web' },
      { label: 'Banco', value: 'Supabase' },
    ],
    previewWorkflow: [
      'App Flutter com código único para mobile e web',
      'Dados centralizados no Supabase',
      'Deploy da versão web na Vercel',
    ],
  },
];

// Atualiza com dados reais do GitHub os projetos públicos (estrelas, forks, última atualização).
export async function enrichFeaturedProjects(
  projects: ShowcaseRepository[]
): Promise<ShowcaseRepository[]> {
  return Promise.all(
    projects.map(async (p) => {
      if (p.isPrivate) return p;
      try {
        const res = await fetch(`https://api.github.com/repos/${p.fullName}`, {
          headers: { Accept: 'application/vnd.github+json' },
        });
        if (!res.ok) return { ...p, isLiveGitHub: false };
        const r = (await res.json()) as GitHubApiRepo;
        return {
          ...p,
          stars: r.stargazers_count,
          forks: r.forks_count,
          updatedAt: r.updated_at,
          isLiveGitHub: true,
        };
      } catch {
        return { ...p, isLiveGitHub: false };
      }
    })
  );
}

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
