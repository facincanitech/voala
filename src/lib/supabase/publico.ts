import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

// Cliente anônimo, sem cookie: assim as páginas públicas podem ser estáticas
// (cache/ISR) e o RLS garante que só sai empresa ativa e em dia.
export function supabasePublico() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
