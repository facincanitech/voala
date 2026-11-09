import { Explorar } from "@/components/Explorar";
import { listarEmpresasPublicas } from "@/lib/empresas";
import { SITE } from "@/lib/site";
import { temSupabase } from "@/lib/supabase/config";

// Página gerada no build. O Actions refaz o build todo dia de madrugada (tira
// quem venceu) e quando o admin salva (gatilho no banco, ver supabase/migrations).

export default async function Home() {
  const empresas = await listarEmpresasPublicas();
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>
            {SITE.cidade} <em>vista de cima</em>
          </h1>
          <p>Escolha um lugar e assista a uma visita de 1 minuto gravada por drone, antes de sair de casa.</p>
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
    </main>
  );
}
