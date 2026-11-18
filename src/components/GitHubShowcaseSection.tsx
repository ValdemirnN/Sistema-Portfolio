import { useEffect, useMemo, useState } from 'react';
import {
  ExternalLink,
  Eye,
  FolderGit2,
  Loader2,
  RefreshCw,
  X,
  ArrowRight,
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

export function GitHubShowcaseSection({ onRequestFromRepo }: GitHubShowcaseSectionProps) {
  const envDefaultUser = (import.meta.env.VITE_GITHUB_USERNAME as string | undefined) || '';
  const initialUser = useMemo(() => {
    try {
      const saved = localStorage.getItem(GITHUB_USER_STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // ignora indisponibilidade de storage
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
    <section id="repositorios" className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-blue-700">
              03. Portfólio Conectado ao GitHub
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl [text-wrap:balance]">
              Pré-visualização de cada sistema por repositório
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Conecte seu usuário do GitHub para puxar automaticamente seus repositórios públicos e abrir a pré-visualização técnica e funcional de cada projeto sem sair desta página.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void loadUserRepos(githubInput);
            }}
            className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto"
          >
            <div className="relative flex-1 sm:w-60">
              <FolderGit2
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="text"
                value={githubInput}
                onChange={(e) => setGithubInput(e.target.value)}
                placeholder="Seu usuário no GitHub"
                aria-label="Nome de usuário do GitHub"
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loadingRepos}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {loadingRepos ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Carregar Repositórios
            </button>
          </form>
        </div>

        {/* Estado da conexão GitHub */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-200/70 p-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-600">
            {connectedUser ? (
              <span>
                Exibindo repositórios ao vivo de{' '}
                <strong className="font-mono text-slate-900">@{connectedUser}</strong> ·{' '}
                <button
                  type="button"
                  onClick={() => {
                    setGithubInput('');
                    void loadUserRepos('');
                  }}
                  className="font-medium text-blue-700 hover:underline cursor-pointer"
                >
                  Voltar aos modelos base
                </button>
              </span>
            ) : (
              <span>
                Exibindo 4 arquiteturas base · Digite seu usuário acima para listar seus repositórios reais
              </span>
            )}
          </div>
        </div>

        {repoError && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-800"
          >
            {repoError}
          </div>
        )}

        {/* Grade de repositórios */}
        {loadingRepos ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((skeleton) => (
              <div
                key={skeleton}
                className="h-56 animate-pulse rounded-xl border border-slate-200 bg-white p-6"
              />
            ))}
          </div>
        ) : filteredRepos.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredRepos.map((repo) => (
              <article
                key={repo.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 transition-colors duration-150 hover:border-slate-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
                    <span className="truncate font-mono text-slate-600">{repo.fullName}</span>
                    <span className="whitespace-nowrap shrink-0">
                      {repo.category} · {repo.language}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-semibold text-slate-900">
                    {repo.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {repo.description}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-slate-700">
                    <span className="font-semibold text-slate-900">Ganho para o cliente:</span>{' '}
                    {repo.businessValue}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-3 font-mono text-xs text-slate-500 tabular-nums">
                    <span>{repo.stars} stars</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      Atualizado{' '}
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
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap"
                      >
                        Demo
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => void openPreview(repo)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-900 transition-colors hover:border-blue-700 hover:text-blue-700 whitespace-nowrap shrink-0 cursor-pointer"
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
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-sm font-medium text-slate-900">
              Nenhum repositório encontrado na categoria "{categoryFilter}".
            </p>
            <button
              type="button"
              onClick={() => setCategoryFilter('Todos')}
              className="mt-3 text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
            >
              Exibir todas as categorias
            </button>
          </div>
        )}
      </div>

      {/* Gaveta / Modal de Pré-visualização do Repositório */}
      {selectedRepo && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="repo-preview-title"
          onClick={() => setSelectedRepo(null)}
        >
          <div
            className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div className="min-w-0">
                <p className="truncate font-mono text-xs text-slate-500">
                  {selectedRepo.fullName} · {selectedRepo.category}
                </p>
                <h3
                  id="repo-preview-title"
                  className="mt-1 font-display text-xl font-bold text-slate-900"
                >
                  {selectedRepo.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRepo(null)}
                aria-label="Fechar pré-visualização"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shrink-0 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-2.5">
              <div className="flex items-center gap-1 rounded-lg bg-slate-200/70 p-1">
                <button
                  type="button"
                  onClick={() => setInspectTab('preview')}
                  className={`rounded-md px-3 py-1 text-xs font-medium cursor-pointer ${
                    inspectTab === 'preview'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pré-visualização Funcional
                </button>
                <button
                  type="button"
                  onClick={() => setInspectTab('readme')}
                  className={`rounded-md px-3 py-1 text-xs font-medium cursor-pointer ${
                    inspectTab === 'readme'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Documentação &amp; Stack
                </button>
              </div>

              {selectedRepo.isLiveGitHub && (
                <a
                  href={selectedRepo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline whitespace-nowrap"
                >
                  Abrir no GitHub
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {inspectTab === 'preview' ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-semibold tracking-wide text-slate-500">
                      Resumo Executivo
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      {selectedRepo.description}
                    </p>
                  </div>

                  {/* Métricas de impacto da solução */}
                  <div className="grid grid-cols-1 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                    {selectedRepo.previewMetrics.map((m) => (
                      <div key={m.label} className="p-4">
                        <p className="text-xs text-slate-500">{m.label}</p>
                        <p className="mt-1 font-mono text-lg font-semibold text-slate-900 tabular-nums">
                          {m.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Arquitetura de fluxo */}
                  <div>
                    <h4 className="text-xs font-semibold tracking-wide text-slate-500">
                      Fluxo Automatizado do Sistema
                    </h4>
                    <ol className="mt-3 space-y-2.5">
                      {selectedRepo.previewWorkflow.map((step, i) => (
                        <li
                          key={step}
                          className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800"
                        >
                          <span className="font-mono text-xs font-semibold text-blue-700 tabular-nums mt-0.5">
                            0{i + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {selectedRepo.homepageUrl && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                      <p className="text-xs font-semibold text-slate-900">
                        Aplicação publicada em produção
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        Este repositório possui uma URL de demonstração configurada no GitHub.
                      </p>
                      <a
                        href={selectedRepo.homepageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline"
                      >
                        Acessar ambiente publicado ({selectedRepo.homepageUrl})
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {inspectLoading ? (
                    <div className="flex items-center gap-2 py-8 text-xs text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Consultando README e linguagens diretamente da API do GitHub...
                    </div>
                  ) : (
                    <>
                      {inspectData?.languages && inspectData.languages.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold tracking-wide text-slate-500">
                            Composição de Linguagens (GitHub API)
                          </h4>
                          <div className="mt-3 space-y-2">
                            {inspectData.languages.map((lang) => (
                              <div key={lang.name} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="font-medium text-slate-800">{lang.name}</span>
                                  <span className="font-mono text-slate-600 tabular-nums">
                                    {lang.percentage}%
                                  </span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className="h-full bg-blue-700"
                                    style={{ width: `${lang.percentage}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs font-semibold tracking-wide text-slate-500">
                          Documentação do Repositório (README)
                        </h4>
                        {inspectData?.readmeExcerpt ? (
                          <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800">
                            {inspectData.readmeExcerpt}
                          </pre>
                        ) : (
                          <p className="mt-2 text-xs leading-relaxed text-slate-600">
                            {selectedRepo.isLiveGitHub
                              ? 'Este repositório não possui um arquivo README.md público ou atingiu o limite temporário de leitura.'
                              : 'Arquitetura modelo pronta para implantação. Conecte seu usuário do GitHub acima para visualizar o README.md real dos seus repositórios.'}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4">
              <p className="text-xs text-slate-500">
                Implantável em Vercel + Supabase para sua empresa
              </p>
              <button
                type="button"
                onClick={() => {
                  const targetRepo = selectedRepo;
                  setSelectedRepo(null);
                  onRequestFromRepo(targetRepo);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-800 cursor-pointer"
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
