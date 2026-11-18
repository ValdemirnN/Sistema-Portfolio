import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface SolutionRequestPayload {
  client_name: string;
  company_name: string;
  contact_channel: string;
  niche: string;
  solution_type: 'pronta' | 'personalizada' | 'repositorio';
  reference_project?: string;
  monthly_volume?: string;
  notes?: string;
  estimated_hours_saved?: number;
}

export interface SolutionRequestRecord extends SolutionRequestPayload {
  id: string;
  status: 'novo' | 'em_analise' | 'proposta_enviada' | 'contratado';
  created_at: string;
  storage_target: 'supabase' | 'local';
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('seu-projeto') &&
    !supabaseAnonKey.includes('sua-chave')
);

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

const LOCAL_STORAGE_KEY = 'vertice_solution_requests_v1';

export function getLocalSolutionRequests(): SolutionRequestRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function submitSolutionRequest(
  payload: SolutionRequestPayload
): Promise<{ ok: true; record: SolutionRequestRecord } | { ok: false; error: string }> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('solution_requests')
      .insert({
        client_name: payload.client_name,
        company_name: payload.company_name,
        contact_channel: payload.contact_channel,
        niche: payload.niche,
        solution_type: payload.solution_type,
        reference_project: payload.reference_project || null,
        monthly_volume: payload.monthly_volume || null,
        notes: payload.notes || null,
        estimated_hours_saved: payload.estimated_hours_saved ?? null,
      })
      .select('id, created_at, status')
      .single();

    if (error) {
      return {
        ok: false,
        error: `Erro ao registrar no Supabase: ${error.message}`,
      };
    }

    const record: SolutionRequestRecord = {
      ...payload,
      id: data?.id ?? crypto.randomUUID(),
      status: (data?.status as SolutionRequestRecord['status']) ?? 'novo',
      created_at: data?.created_at ?? new Date().toISOString(),
      storage_target: 'supabase',
    };
    return { ok: true, record };
  }

  const record: SolutionRequestRecord = {
    ...payload,
    id: crypto.randomUUID(),
    status: 'novo',
    created_at: new Date().toISOString(),
    storage_target: 'local',
  };

  try {
    const existing = getLocalSolutionRequests();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([record, ...existing].slice(0, 15)));
  } catch {
    // Ignora falha de quota em modo privado
  }

  return { ok: true, record };
}
