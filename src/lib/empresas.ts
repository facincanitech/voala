import "server-only";
import { cache } from "react";
import { planoEmDia, hojeBR } from "./datas";
import { EMPRESAS_DEMO } from "./demo";
import { supabasePublico } from "./supabase/publico";
import { temSupabase } from "./supabase/config";
import type { Empresa, EmpresaPublica } from "./tipos";

const COLUNAS = "id, nome, slug, categoria, descricao, endereco, lat, lng, telefone, whatsapp, instagram, youtube_id";

function paraPublica(e: Empresa): EmpresaPublica {
  const { ativo: _a, plano_vence_em: _p, criado_em: _c, ...resto } = e;
  return resto;
}

// O RLS já filtra, mas filtramos de novo aqui: se alguém mexer na policy,
// empresa vencida continua fora do site.
export const listarEmpresasPublicas = cache(async (): Promise<EmpresaPublica[]> => {
  if (!temSupabase) {
    return EMPRESAS_DEMO.filter((e) => e.ativo && planoEmDia(e.plano_vence_em))
      .map(paraPublica)
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }
  const { data, error } = await supabasePublico()
    .from("empresas")
    .select(COLUNAS)
    .eq("ativo", true)
    .gte("plano_vence_em", hojeBR())
    .order("nome");
  if (error) throw new Error(`Erro ao listar empresas: ${error.message}`);
  return data ?? [];
});

export const buscarEmpresaPorSlug = cache(async (slug: string): Promise<EmpresaPublica | null> => {
  if (!temSupabase) {
    const e = EMPRESAS_DEMO.find((x) => x.slug === slug && x.ativo && planoEmDia(x.plano_vence_em));
    return e ? paraPublica(e) : null;
  }
  const { data, error } = await supabasePublico()
    .from("empresas")
    .select(COLUNAS)
    .eq("slug", slug)
    .eq("ativo", true)
    .gte("plano_vence_em", hojeBR())
    .maybeSingle();
  if (error) throw new Error(`Erro ao buscar empresa: ${error.message}`);
  return data;
});
