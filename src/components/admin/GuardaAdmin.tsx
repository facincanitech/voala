"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { supabaseNavegador } from "@/lib/supabase/navegador";
import { temSupabase } from "@/lib/supabase/config";

type Estado = "carregando" | "deslogado" | "sem-permissao" | "ok";

// Envolve as telas do painel: sem login mostra o formulário de entrada,
// logado mas fora da tabela admins não entra. Quem barra de verdade é o RLS.
export function GuardaAdmin({ children }: { children: (email: string, sair: () => void) => ReactNode }) {
  const [estado, setEstado] = useState<Estado>("carregando");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!temSupabase) return;
    const sb = supabaseNavegador();

    async function checar(sessao: Session | null) {
      if (!sessao) {
        setEstado("deslogado");
        return;
      }
      setEmail(sessao.user.email ?? "");
      const { data } = await sb.from("admins").select("user_id").eq("user_id", sessao.user.id).maybeSingle();
      setEstado(data ? "ok" : "sem-permissao");
    }

    sb.auth.getSession().then(({ data }) => checar(data.session));
    // Consulta dentro do callback do auth pode travar: joga pro próximo tick.
    const { data } = sb.auth.onAuthStateChange((_evento, sessao) => {
      setTimeout(() => checar(sessao), 0);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const sair = () => {
    supabaseNavegador().auth.signOut();
  };

  if (!temSupabase) return <p className="aviso">Supabase não configurado neste build.</p>;
  if (estado === "carregando") return <p className="vazio">Carregando…</p>;
  if (estado === "deslogado") return <Login />;
  if (estado === "sem-permissao")
    return (
      <div className="login">
        <p className="erro">A conta {email} não tem acesso ao painel.</p>
        <button className="botao botao-claro" onClick={sair}>
          Sair
        </button>
      </div>
    );
  return <>{children(email, sair)}</>;
}

function Login() {
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const dados = new FormData(ev.currentTarget);
    setEnviando(true);
    setErro("");
    const { error } = await supabaseNavegador().auth.signInWithPassword({
      email: String(dados.get("email")).trim(),
      password: String(dados.get("senha")),
    });
    setEnviando(false);
    if (error) setErro("E-mail ou senha incorretos.");
  }

  return (
    <form className="login formulario" onSubmit={entrar}>
      <h1>Painel VoaLá</h1>
      <fieldset>
        <label className="campo">
          <span>E-mail</span>
          <input name="email" type="email" autoComplete="username" required />
        </label>
        <label className="campo">
          <span>Senha</span>
          <input name="senha" type="password" autoComplete="current-password" required />
        </label>
        {erro && <p className="erro">{erro}</p>}
        <button className="botao botao-ceu" disabled={enviando}>
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </fieldset>
    </form>
  );
}
