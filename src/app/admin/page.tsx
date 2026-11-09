"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GuardaAdmin } from "@/components/admin/GuardaAdmin";
import { formatarData, hojeBR } from "@/lib/datas";
import { supabaseNavegador } from "@/lib/supabase/navegador";

type Linha = { id: string; nome: string; slug: string; criado_em: string; plano_vence_em: string; ativo: boolean };

export default function PaginaAdmin() {
  return (
    <GuardaAdmin>
      {(email, sair) => (
        <>
          <div className="admin-topo">
            <h1>Empresas</h1>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <Link href="/admin/empresa/" className="botao botao-primario">
                + Novo vídeo
              </Link>
              <button className="botao botao-link" onClick={sair} title={email}>
                Sair
              </button>
            </div>
          </div>
          <ListaEmpresas />
        </>
      )}
    </GuardaAdmin>
  );
}

// Data do cadastro no fuso de Rio Preto.
function dataCadastro(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

function ListaEmpresas() {
  const [linhas, setLinhas] = useState<Linha[] | null>(null);
  const [erro, setErro] = useState("");
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(location.search).has("salvo")) {
      setSalvo(true);
      history.replaceState(null, "", location.pathname);
    }
    supabaseNavegador()
      .from("empresas")
      .select("id, nome, slug, criado_em, plano_vence_em, ativo")
      .order("criado_em", { ascending: false })
      .then(({ data, error }) => {
        if (error) setErro(error.message);
        else setLinhas(data);
      });
  }, []);

  if (erro) return <p className="erro">Erro ao carregar: {erro}</p>;
  if (!linhas) return <p className="vazio">Carregando…</p>;
  if (linhas.length === 0)
    return <p className="vazio">Nenhuma empresa ainda. Clique em “Novo vídeo” para cadastrar a primeira.</p>;

  const hoje = hojeBR();
  return (
    <>
    {salvo && <p className="salvo">Salvo! O site público atualiza em uns 2 minutos.</p>}
    <table className="tabela">
      <thead>
        <tr>
          <th>Cadastro</th>
          <th>Nome</th>
          <th>Vencimento</th>
          <th>Situação</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {linhas.map((l) => {
          const situacao = !l.ativo ? "inativo" : l.plano_vence_em < hoje ? "vencido" : "ok";
          return (
            <tr key={l.id}>
              <td className="col-cat">{dataCadastro(l.criado_em)}</td>
              <td>
                <strong>{l.nome}</strong>
              </td>
              <td className="col-vence">{formatarData(l.plano_vence_em)}</td>
              <td>
                <span className={`status status-${situacao}`}>
                  {situacao === "ok" ? "No ar" : situacao === "vencido" ? "Vencido" : "Desativado"}
                </span>
              </td>
              <td className="col-acoes">
                <div className="acoes-linha">
                  <Link href={`/admin/empresa/?id=${l.id}`} className="botao botao-claro botao-pequeno">
                    Editar
                  </Link>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </>
  );
}
