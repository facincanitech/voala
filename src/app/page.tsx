import { BotaoWhats } from "@/components/BotaoWhats";
import { Explorar } from "@/components/Explorar";
import { listarEmpresasPublicas } from "@/lib/empresas";
import type { Metadata } from "next";
import { OG_PADRAO, SITE, openGraphBase, urlAbsoluta } from "@/lib/site";
import { temSupabase } from "@/lib/supabase/config";

// Página gerada no build. O Actions refaz o build todo dia de madrugada (tira
// quem venceu) e quando o admin salva (gatilho no banco, ver supabase/migrations).

export const metadata: Metadata = {
  alternates: { canonical: urlAbsoluta("/") },
  openGraph: {
    ...openGraphBase(),
    title: `${SITE.nome} · ${SITE.slogan}`,
    description: SITE.descricao,
    url: urlAbsoluta("/"),
    images: [OG_PADRAO],
  },
};

export default async function Home() {
  const empresas = await listarEmpresasPublicas();
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>
            {SITE.cidade} <em>vista de cima</em>
          </h1>
          <p>
            Rio Preto e região: escolha um lugar e assista a uma visita de 1 minuto gravada por drone, antes de sair de
            casa.
          </p>
        </div>
      </section>
      <div className="container explorar">
        {!temSupabase && (
          <p className="aviso" style={{ marginTop: 12 }}>
            Site em construção: as empresas abaixo são fictícias, só para demonstração.
          </p>
        )}
        <Explorar empresas={empresas} />
      </div>
      <BotaoWhats mensagem={`Olá! Vim pelo site do ${SITE.nome}.`} />
    </main>
  );
}
