// Espelho da tabela public.empresas.
export type Empresa = {
  id: string;
  nome: string;
  slug: string;
  categoria: string;
  descricao: string;
  endereco: string;
  lat: number;
  lng: number;
  telefone: string;
  whatsapp: string;
  instagram: string;
  youtube_id: string;
  ativo: boolean;
  plano_vence_em: string; // AAAA-MM-DD
  criado_em: string;
};

// O que o site público precisa (não manda vencimento nem status pro navegador).
export type EmpresaPublica = Omit<Empresa, "ativo" | "plano_vence_em" | "criado_em">;
