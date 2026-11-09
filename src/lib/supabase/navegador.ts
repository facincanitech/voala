"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

// O painel roda todo no navegador (Pages não tem servidor). A chave anon é
// pública por natureza: quem barra escrita de estranho é o RLS do banco.
let cliente: SupabaseClient | null = null;

export function supabaseNavegador(): SupabaseClient {
  cliente ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return cliente;
}
