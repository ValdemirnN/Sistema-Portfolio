import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ExternalLink,
  Eye,
  FolderGit2,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  fetchGitHubRepoInspectData,
  fetchGitHubRepos,
  SYSTEM_BLUEPRINTS,
  type ShowcaseRepository,
} from '../lib/github';

interface GitHubShowcaseSectionProps {
  onRequestFromRepo: (repo: ShowcaseRepository) => void;
}

const CATEGORIES = ['Todos', 'Faturamento', 'Gestão', 'Dados & BI', 'Automação'] as const;
const GITHUB_USER_STORAGE_KEY = 'vertice_github_username_v1';

function MiniRepoSparkline({ category }: { category: ShowcaseRepository['category'] }) {
  const path =
    category === 'Faturamento'
      ? 'M 4 36 L 34 30 L 64 26 L 94 18 L 124 14 L 154 8'
      : category === 'Dados & BI'
        ? 'M 4 34 L 34 32 L 64 20 L 94 22 L 124 10 L 154 6'
        : category === 'Automação'
          ? 'M 4 38 L 34 26 L 64 24 L 94 14 L 124 12 L 154 9'
          : 'M 4 32 L 34 28 L 64 22 L 94 19 L 124 13 L 154 10';

  return (
    <div className="mt-4 rounded-lg border border-slate-800 bg-[#060B16] p-3">
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>Prévia de Interface · {category}</span>
        <span className="font-mono text-sky-400">SQL + Vercel</span>
      </div>
      <div className="mt-2.5 flex items-end justify-between gap-4">
        <div className="grid grid-cols-3 gap-3 text-[11px]">
          <div>
            <span className="block text-slate-500">Módulo</span>
            <span className="font-mono font-medium text-slate-200">{category}</span>
          </div>
          <div>
            <span className="block text-slate-500">Status</span>
            <span className="font-mono font-medium text-emerald-400">Ativo</span>
          </div>
          <div>
            <span className="block text-slate-500">Base</span>
            <span className="font-mono font-medium text-slate-200">Supabase</span>
          </div>
        </div>
        <svg viewBox="0 0 158 42" className="h-9 w-28 shrink-0" aria-hidden="true">
          <path d={path} fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

export function GitHubShowcaseSection({ onRequestFromRepo }: GitHubShowcaseSectionProps) {
  const envDefaultUser = (import.meta.env.VITE_GITHUB_USERNAME as string | undefined) || '';
  const initialUser = useMemo(() => {
    try {
      const saved = localStorage.getItem(GITHUB_USER_STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // ignora
    }
    return envDefaultUser && !envDefaultUser.includes('seu-usuario') ? envDefaultUser : '';
  }, [envDefaultUser]);

  const [githubInput, setGithubInput] = useState(initialUser);
  const [connectedUser, setConnectedUser] = useState(initialUser);
  const [repos, setRepos] = useState<ShowcaseRepository[]>(SYSTEM_BLUEPRINTS);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<(typeof CATEGORIES)[number]>('Todos');

  const [selectedRepo, setSelectedRepo] = useState<ShowcaseRepository | null>(null);
  const [inspectTab, setInspectTab] = useState<'preview' | 'readme'>('preview');
  const [inspectLoading, setInspectLoading] = useState(false);
  const [inspectData, setInspectData] = useState<{
    readmeExcerpt: string | null;
    languages: { name: string; percentage: number }[];
  } | null>(null);

  const loadUserRepos = async (username: string) => {
    const clean = username.trim().replace(/^@/, '');
    if (!clean) {
      setConnectedUser('');
      setRepos(SYSTEM_BLUEPRINTS);
      setRepoError(null);
      try {
        localStorage.removeItem(GITHUB_USER_STORAGE_KEY);
      } catch {
        // ignora
      }
      return;
    }

    setLoadingRepos(true);
    setRepoError(null);
    try {
      const result = await fetchGitHubRepos(clean);
      setRepos(result.repos.length > 0 ? result.repos : SYSTEM_BLUEPRINTS);
      setConnectedUser(clean);
      try {
        localStorage.setItem(GITHUB_USER_STORAGE_KEY, clean);
      } catch {
        // ignora
      }
    } catch (err) {
      setRepoError(
        err instanceof Error ? err.message : 'Erro ao consultar repositórios do GitHub.'
      );
    } finally {
      setLoadingRepos(false);
    }
  };

  useEffect(() => {
    if (initialUser) {
      void loadUserRepos(initialUser);
    }
  }, [initialUser]);

  const openPreview = async (repo: ShowcaseRepository) => {
    setSelectedRepo(repo);
    setInspectTab('preview');
    setInspectData(null);

    if (repo.isLiveGitHub) {
      setInspectLoading(true);
      try {
        const data = await fetchGitHubRepoInspectData(repo.owner, repo.name);
        setInspectData(data);
      } catch {
        setInspectData({ readmeExcerpt: null, languages: [] });
      } finally {
        setInspectLoading(false);
      }
    }
  };

  const filteredRepos = useMemo(() => {
    if (categoryFilter === 'Todos') return repos;
    return repos.filter((r) => r.category === categoryFilter);
  }, [repos, categoryFilter]);

  return (
    <section id="repositorios" className="border-b border-slate-800/80 bg-[#090F1D] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-sky-400">
              03. Projetos em Repositórios GitHub
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl [text-wrap:balance]">
              Pré-visualização interativa de cada repositório do seu GitHub
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Informe seu nome de usuário do GitHub para sincronizar todos os seus repositórios públicos e abrir a prévia de tela, arquitetura e documentação de cada projeto.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void loadUserRepos(githubInput);
            }}
            className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto"
          >
            <div className="relative flex-1 sm:w-64">
              <FolderGit2
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
              <input
                type="text"
                value={githubInput}
                onChange={(e) => setGithubInput(e.target.value)}
                placeholder="Seu usuário do GitHub"
                aria-label="Nome de usuário do GitHub"
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] py-2 pr-3 pl-9 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loadingRepos}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {loadingRepos ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Sincronizar GitHub
            </button>
          </form>
        </div>

        {/* Barra de categorias */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-800 bg-[#0F172A] p-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            {connectedUser ? (
              <span>
                Conectado ao GitHub:{' '}
                <strong className="font-mono text-white">@{connectedUser}</strong> ·{' '}
                <button
                  type="button"
                  onClick={() => {
                    setGithubInput('');
                    void loadUserRepos('');
                  }}
                  className="font-medium text-sky-400 hover:underline cursor-pointer"
                >
                  Restaurar modelos base
                </button>
              </span>
            ) : (
              <span>
                4 arquiteturas base exibidas · Conecte seu @usuario acima para listar seus repositórios ao vivo
              </span>
            )}
          </div>
        </div>

        {repoError && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-900/70 bg-red-950/50 px-4 py-3 text-xs font-medium text-red-300"
          >
            {repoError}
          </div>
        )}

        {/* Grade de Repositórios */}
        {loadingRepos ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((skeleton) => (
              <div
                key={skeleton}
                className="h-64 animate-pulse rounded-xl border border-slate-800 bg-[#0F172A] p-6"
              />
            ))}
          </div>
        ) : filteredRepos.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredRepos.map((repo) => (
              <article
                key={repo.id}
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#0F172A] p-6 transition-colors duration-150 hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 text-xs text-slate-400">
                    <span className="truncate font-mono text-slate-400">{repo.fullName}</span>
                    <span className="whitespace-nowrap shrink-0 text-sky-400">
                      {repo.category} · {repo.language}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-semibold text-white">
                    {repo.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {repo.description}
                  </p>

                  <MiniRepoSparkline category={repo.category} />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-3 font-mono text-xs text-slate-400 tabular-nums">
                    <span>{repo.stars} stars</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {new Date(repo.updatedAt).toLocaleDateString('pt-BR', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {repo.homepageUrl && (
                      <a
                        href={repo.homepageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white whitespace-nowrap"
                      >
                        Demo
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => void openPreview(repo)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#0B1221] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:border-blue-500 hover:text-sky-400 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      Pré-visualizar Projeto
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-slate-800 bg-[#0F172A] p-10 text-center">
            <p className="text-sm font-medium text-white">
              Nenhum repositório encontrado na categoria "{categoryFilter}".
            </p>
            <button
              type="button"
              onClick={() => setCategoryFilter('Todos')}
              className="mt-3 text-xs font-semibold text-sky-400 hover:underline cursor-pointer"
            >
              Exibir todas as categorias
            </button>
          </div>
        )}
      </div>

      {/* Gaveta de Pré-visualização com Simulação Visual de Tela */}
      {selectedRepo && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="repo-preview-title"
          onClick={() => setSelectedRepo(null)}
        >
          <div
            className="flex h-full w-full max-w-2xl flex-col border-l border-slate-800 bg-[#0B1221] text-slate-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-6 py-5">
              <div className="min-w-0">
                <p className="truncate font-mono text-xs text-sky-400">
                  {selectedRepo.fullName} · {selectedRepo.category}
                </p>
                <h3
                  id="repo-preview-title"
                  className="mt-1 font-display text-xl font-bold text-white"
                >
                  {selectedRepo.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRepo(null)}
                aria-label="Fechar pré-visualização"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white shrink-0 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 border-b border-slate-800 bg-[#060B16] px-6 py-2.5">
              <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-[#0F172A] p-1">
                <button
                  type="button"
                  onClick={() => setInspectTab('preview')}
                  className={`rounded-md px-3 py-1 text-xs font-medium cursor-pointer ${
                    inspectTab === 'preview'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Prévia Visual do Sistema
                </button>
                <button
                  type="button"
                  onClick={() => setInspectTab('readme')}
                  className={`rounded-md px-3 py-1 text-xs font-medium cursor-pointer ${
                    inspectTab === 'readme'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  README &amp; Stack
                </button>
              </div>

              {selectedRepo.isLiveGitHub && (
                <a
                  href={selectedRepo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:underline whitespace-nowrap"
                >
                  Abrir no GitHub
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {inspectTab === 'preview' ? (
                <div className="space-y-6">
                  {/* Simulação de janela de aplicação */}
                  <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#060B16]">
                    <div className="flex items-center justify-between border-b border-slate-800 bg-[#0F172A] px-4 py-2.5 text-[11px] text-slate-400">
                      <span className="font-mono truncate">
                        {selectedRepo.homepageUrl || `https://${selectedRepo.name}.vercel.app`}
                      </span>
                      <span className="font-mono text-emerald-400">Produção</span>
                    </div>

                    <div className="p-5">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {selectedRepo.previewMetrics.map((m) => (
                          <div
                            key={m.label}
                            className="rounded-lg border border-slate-800 bg-[#0F172A] p-3.5"
                          >
                            <p className="text-[11px] text-slate-400">{m.label}</p>
                            <p className="mt-1 font-mono text-base font-semibold text-white tabular-nums">
                              {m.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 rounded-lg border border-slate-800 bg-[#0F172A] p-4">
                        <p className="text-xs font-semibold text-white">
                          Impacto Operacional Entregue
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-300">
                          {selectedRepo.businessValue}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold tracking-wide text-slate-400">
                      Etapas Automatizadas no Sistema
                    </h4>
                    <ol className="mt-3 space-y-2.5">
                      {selectedRepo.previewWorkflow.map((step, i) => (
                        <li
                          key={step}
                          className="flex items-start gap-3 rounded-lg border border-slate-800 bg-[#0F172A] px-4 py-3 text-sm text-slate-200"
                        >
                          <span className="font-mono text-xs font-semibold text-sky-400 tabular-nums mt-0.5">
                            0{i + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {selectedRepo.homepageUrl && (
                    <div className="rounded-xl border border-blue-900/70 bg-blue-950/30 p-4">
                      <p className="text-xs font-semibold text-white">
                        Ambiente ao vivo publicado
                      </p>
                      <a
                        href={selectedRepo.homepageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:underline"
                      >
                        Abrir URL de demonstração ({selectedRepo.homepageUrl})
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {inspectLoading ? (
                    <div className="flex items-center gap-2 py-8 text-xs text-slate-400">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Consultando README e linguagens diretamente da API do GitHub...
                    </div>
                  ) : (
                    <>
                      {inspectData?.languages && inspectData.languages.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold tracking-wide text-slate-400">
                            Composição de Linguagens (GitHub API)
                          </h4>
                          <div className="mt-3 space-y-2">
                            {inspectData.languages.map((lang) => (
                              <div key={lang.name} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="font-medium text-slate-200">{lang.name}</span>
                                  <span className="font-mono text-slate-400 tabular-nums">
                                    {lang.percentage}%
                                  </span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                  <div
                                    className="h-full bg-sky-400"
                                    style={{ width: `${lang.percentage}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs font-semibold tracking-wide text-slate-400">
                          Documentação (README.md)
                        </h4>
                        {inspectData?.readmeExcerpt ? (
                          <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-[#060B16] p-4 font-mono text-xs leading-relaxed text-slate-200">
                            {inspectData.readmeExcerpt}
                          </pre>
                        ) : (
                          <p className="mt-2 text-xs leading-relaxed text-slate-400">
                            {selectedRepo.isLiveGitHub
                              ? 'Este repositório não possui um README.md público disponível.'
                              : 'Arquitetura modelo pronta para implantação. Conecte seu @usuario do GitHub acima para inspecionar o README real dos seus repositórios.'}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-[#060B16] px-6 py-4">
              <p className="text-xs text-slate-400">
                Pronto para deploy na Vercel + banco Supabase
              </p>
              <button
                type="button"
                onClick={() => {
                  const targetRepo = selectedRepo;
                  setSelectedRepo(null);
                  onRequestFromRepo(targetRepo);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500 cursor-pointer"
              >
                Solicitar Solução Baseada Neste Projeto
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
