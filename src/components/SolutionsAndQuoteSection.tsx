import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import {
  getLocalSolutionRequests,
  isSupabaseConfigured,
  submitSolutionRequest,
  type SolutionRequestRecord,
} from '../lib/supabase';

export interface PreselectedQuoteContext {
  solutionType: 'pronta' | 'personalizada' | 'repositorio';
  niche?: string;
  referenceProject?: string;
  estimatedHoursSaved?: number;
}

interface SolutionsAndQuoteSectionProps {
  preselectedContext: PreselectedQuoteContext | null;
}

const SOLUTION_MODELS = [
  {
    id: 'pronta' as const,
    audience: 'Para empresas que buscam implantação rápida',
    title: 'Solução Pronta Adaptada',
    summary:
      'Implante um dos módulos validados (Faturamento Automático, Gestão de Serviços ou Centralizador SQL) configurado com sua identidade e regras básicas.',
    deliverables: [
      'Implantação completa na Vercel + banco Supabase dedicado',
      'Importação inicial de clientes, contratos e histórico de planilhas',
      'Painéis de receita, inadimplência e produtividade prontos para uso',
      'Treinamento operacional para sua equipe',
    ],
    cta: 'Adquirir Solução Pronta',
  },
  {
    id: 'personalizada' as const,
    audience: 'Para operações com fluxos específicos do nicho',
    title: 'Sistema Sob Medida para Seu Nicho',
    summary:
      'Arquitetura desenhada do zero para a realidade do seu setor (clínicas, transportadoras, distribuidoras, prestadores B2B), com integrações sob demanda.',
    deliverables: [
      'Levantamento de gargalos e modelagem exclusiva no PostgreSQL',
      'Automação de cobranças, comissões, repasses ou ordens de serviço',
      'Controle de permissões por nível de gestor e operador',
      'Evolução contínua via repositório GitHub dedicado',
    ],
    cta: 'Solicitar Sistema Personalizado',
  },
];

export function SolutionsAndQuoteSection({
  preselectedContext,
}: SolutionsAndQuoteSectionProps) {
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactChannel, setContactChannel] = useState('');
  const [niche, setNiche] = useState('Serviços B2B');
  const [solutionType, setSolutionType] = useState<'pronta' | 'personalizada' | 'repositorio'>(
    'personalizada'
  );
  const [referenceProject, setReferenceProject] = useState('');
  const [monthlyVolume, setMonthlyVolume] = useState('100 a 500 lançamentos/mês');
  const [notes, setNotes] = useState('');
  const [estimatedHoursSaved, setEstimatedHoursSaved] = useState<number | undefined>(undefined);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<SolutionRequestRecord | null>(null);
  const [recentHistory, setRecentHistory] = useState<SolutionRequestRecord[]>(() =>
    getLocalSolutionRequests()
  );

  useEffect(() => {
    if (!preselectedContext) return;
    setSolutionType(preselectedContext.solutionType);
    if (preselectedContext.niche) {
      setNiche(preselectedContext.niche);
    }
    if (preselectedContext.referenceProject) {
      setReferenceProject(preselectedContext.referenceProject);
    }
    if (preselectedContext.estimatedHoursSaved) {
      setEstimatedHoursSaved(preselectedContext.estimatedHoursSaved);
    }
    setSubmittedRecord(null);
  }, [preselectedContext]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (clientName.trim().length < 2) {
      setFormError('Informe seu nome completo.');
      return;
    }
    if (companyName.trim().length < 2) {
      setFormError('Informe o nome da sua empresa ou projeto.');
      return;
    }
    if (contactChannel.trim().length < 5) {
      setFormError('Informe um e-mail ou WhatsApp válido para retorno.');
      return;
    }

    setSubmitting(true);
    const result = await submitSolutionRequest({
      client_name: clientName.trim(),
      company_name: companyName.trim(),
      contact_channel: contactChannel.trim(),
      niche: niche.trim(),
      solution_type: solutionType,
      reference_project: referenceProject.trim() || undefined,
      monthly_volume: monthlyVolume,
      notes: notes.trim() || undefined,
      estimated_hours_saved: estimatedHoursSaved,
    });
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    setSubmittedRecord(result.record);
    setRecentHistory(getLocalSolutionRequests());
    setClientName('');
    setCompanyName('');
    setContactChannel('');
    setNotes('');
  };

  return (
    <section id="solucoes" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-blue-700">
            05. Contratação &amp; Escopo do Projeto
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl [text-wrap:balance]">
            Escolha um sistema pronto ou solicite uma solução sob medida
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Defina o modelo ideal para o momento da sua empresa e envie os dados do seu cenário para receber uma proposta técnica objetiva.
          </p>
        </div>

        {/* Opções de aquisição */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {SOLUTION_MODELS.map((model) => {
            const isSelected = solutionType === model.id;
            return (
              <div
                key={model.id}
                className={`flex flex-col justify-between rounded-xl border p-6 sm:p-8 transition-colors duration-150 ${
                  isSelected
                    ? 'border-blue-700 bg-blue-50/25'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <p className="text-xs font-medium text-blue-700">{model.audience}</p>
                  <h3 className="mt-2 font-display text-xl font-bold text-slate-900">
                    {model.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {model.summary}
                  </p>

                  <ul className="mt-6 space-y-2.5 border-t border-slate-200 pt-5 text-xs sm:text-sm text-slate-700">
                    {model.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-blue-700"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setSolutionType(model.id);
                      setSubmittedRecord(null);
                      document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-700 text-white hover:bg-blue-800'
                        : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {model.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Formulário de Solicitação */}
        <div
          id="contato"
          className="mt-12 grid grid-cols-1 gap-8 rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8 lg:grid-cols-12"
        >
          <div className="lg:col-span-5">
            <h3 className="font-display text-xl font-bold text-slate-900">
              Solicitar Diagnóstico ou Aquisição
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Descreva brevemente como sua empresa controla os dados e o faturamento hoje. Retorno com escopo, prazo de entrega e estrutura no Supabase.
            </p>

            <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-xs text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Destino dos registros:</span>{' '}
                {isSupabaseConfigured
                  ? 'Conectado diretamente ao PostgreSQL no Supabase'
                  : 'Modo de demonstração local (pronto para Supabase via .env)'}
              </p>
              {estimatedHoursSaved && (
                <p>
                  <span className="font-semibold text-slate-900">Economia simulada:</span>{' '}
                  <span className="font-mono font-semibold text-blue-700 tabular-nums">
                    {estimatedHoursSaved} h/mês
                  </span>
                </p>
              )}
            </div>

            {recentHistory.length > 0 && !isSupabaseConfigured && (
              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-xs font-semibold text-slate-800">
                  Solicitações registradas nesta sessão ({recentHistory.length})
                </p>
                <ul className="mt-2 space-y-2 text-xs text-slate-600">
                  {recentHistory.slice(0, 3).map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium text-slate-800">
                        {item.company_name} · {item.niche}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            {submittedRecord ? (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-white p-6 sm:p-8"
              >
                <p className="text-xs font-semibold text-emerald-700">
                  Solicitação registrada com sucesso
                </p>
                <h4 className="mt-2 font-display text-xl font-bold text-slate-900">
                  Recebemos o pedido de {submittedRecord.company_name}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  O protocolo{' '}
                  <span className="font-mono font-semibold text-slate-900">
                    {submittedRecord.id.slice(0, 8).toUpperCase()}
                  </span>{' '}
                  foi salvo ({submittedRecord.storage_target === 'supabase' ? 'Supabase PostgreSQL' : 'armazenamento de demonstração'}). Entraremos em contato via{' '}
                  <strong className="text-slate-900">{submittedRecord.contact_channel}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedRecord(null)}
                  className="mt-6 inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 cursor-pointer"
                >
                  Enviar Nova Solicitação
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="client-name"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Seu Nome
                    </label>
                    <input
                      id="client-name"
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ex.: Mariana Costa"
                      className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company-name"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Empresa
                    </label>
                    <input
                      id="company-name"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ex.: Clínica Vida Plena"
                      className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-channel"
                      className="block text-xs font-medium text-slate-700"
                    >
                      E-mail ou WhatsApp
                    </label>
                    <input
                      id="contact-channel"
                      type="text"
                      required
                      value={contactChannel}
                      onChange={(e) => setContactChannel(e.target.value)}
                      placeholder="contato@empresa.com.br ou (11) 99999-0000"
                      className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="niche" className="block text-xs font-medium text-slate-700">
                      Nicho de Serviço ou Produto
                    </label>
                    <input
                      id="niche"
                      type="text"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="Ex.: Transportadora, Clínica, Varejo"
                      className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="solution-type"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Tipo de Solução
                    </label>
                    <select
                      id="solution-type"
                      value={solutionType}
                      onChange={(e) =>
                        setSolutionType(
                          e.target.value as 'pronta' | 'personalizada' | 'repositorio'
                        )
                      }
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
                    >
                      <option value="pronta">Solução Pronta Adaptada</option>
                      <option value="personalizada">Sistema Sob Medida para Meu Nicho</option>
                      <option value="repositorio">Baseado em Projeto do GitHub</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="monthly-volume"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Volume Mensal Estimado
                    </label>
                    <select
                      id="monthly-volume"
                      value={monthlyVolume}
                      onChange={(e) => setMonthlyVolume(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none"
                    >
                      <option value="Até 100 lançamentos/mês">Até 100 lançamentos/mês</option>
                      <option value="100 a 500 lançamentos/mês">100 a 500 lançamentos/mês</option>
                      <option value="500 a 2.500 lançamentos/mês">
                        500 a 2.500 lançamentos/mês
                      </option>
                      <option value="Acima de 2.500 lançamentos/mês">
                        Acima de 2.500 lançamentos/mês
                      </option>
                    </select>
                  </div>
                </div>

                {referenceProject && (
                  <div>
                    <label
                      htmlFor="reference-project"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Projeto ou Módulo de Referência
                    </label>
                    <input
                      id="reference-project"
                      type="text"
                      value={referenceProject}
                      onChange={(e) => setReferenceProject(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-800 focus:border-blue-700 focus:bg-white focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="notes" className="block text-xs font-medium text-slate-700">
                    Objetivo Principal e Gargalos Atuais
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex.: Hoje controlamos faturamento e ordens de serviço em 4 planilhas separadas e perdemos 2 dias por semana consolidando..."
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none"
                  />
                </div>

                {formError && (
                  <p role="alert" className="text-xs font-medium text-red-700">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60 cursor-pointer"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {submitting ? 'Registrando Solicitação...' : 'Enviar Solicitação de Proposta'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
