export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
// Chave publishable (sb_publishable_...): pública por natureza, quem protege é o RLS.
// A secreta (sb_secret_...) NUNCA entra aqui: ela passa por cima do RLS.
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Sem as variáveis, o site roda com dados de demonstração (src/lib/demo.ts).
export const temSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
