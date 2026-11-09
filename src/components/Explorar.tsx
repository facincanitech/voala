"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIAS, emojiCategoria, rotuloCategoria, type Categoria } from "@/lib/categorias";
import { thumbYouTube } from "@/lib/contato";
import type { EmpresaPublica } from "@/lib/tipos";

// O Leaflet (~45 KB) só baixa quando a pessoa abre o mapa.
const Mapa = dynamic(() => import("./Mapa"), {
  ssr: false,
  loading: () => <div className="mapa mapa-carregando">Carregando mapa…</div>,
});

type Visao = "lista" | "mapa";

// "Café" acha "cafe" e vice-versa.
function semAcento(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function Explorar({ empresas }: { empresas: EmpresaPublica[] }) {
  const [visao, setVisao] = useState<Visao>("lista");
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<string>("");

  // Estado vai na URL: voltar da página da empresa cai no mesmo mapa/filtro.
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (p.get("v") === "mapa") setVisao("mapa");
    setBusca(p.get("q") ?? "");
    setCategoria(p.get("cat") ?? "");
  }, []);
  useEffect(() => {
    const p = new URLSearchParams();
    if (visao === "mapa") p.set("v", "mapa");
    if (busca) p.set("q", busca);
    if (categoria) p.set("cat", categoria);
    const qs = p.toString();
    history.replaceState(history.state, "", qs ? `?${qs}` : location.pathname);
  }, [visao, busca, categoria]);

  // Só mostra chip de categoria que tem alguém.
  const categoriasUsadas = useMemo(() => {
    const usadas = new Set(empresas.map((e) => e.categoria));
    return (Object.keys(CATEGORIAS) as Categoria[]).filter((c) => usadas.has(c));
  }, [empresas]);

  const filtradas = useMemo(() => {
    const termo = semAcento(busca.trim());
    return empresas.filter(
      (e) =>
        (!categoria || e.categoria === categoria) &&
        (!termo || semAcento(`${e.nome} ${e.endereco}`).includes(termo)),
    );
  }, [empresas, busca, categoria]);

  return (
    <>
      <div className="barra-busca">
        <div className="linha-busca">
          <label className="visualmente-oculto" htmlFor="busca">
            Buscar empresa
          </label>
          <input
            id="busca"
            className="campo-busca"
            type="search"
            placeholder="Buscar por nome ou bairro"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            autoComplete="off"
            enterKeyHint="search"
          />
          <div className="abas" role="group" aria-label="Modo de visualização">
            <button type="button" aria-pressed={visao === "lista"} onClick={() => setVisao("lista")}>
              Lista
            </button>
            <button type="button" aria-pressed={visao === "mapa"} onClick={() => setVisao("mapa")}>
              Mapa
            </button>
          </div>
        </div>
        {categoriasUsadas.length > 1 && (
          <div className="chips" role="group" aria-label="Filtrar por categoria">
            <button type="button" className="chip" aria-pressed={!categoria} onClick={() => setCategoria("")}>
              Todas
            </button>
            {categoriasUsadas.map((c) => (
              <button
                key={c}
                type="button"
                className="chip"
                aria-pressed={categoria === c}
                onClick={() => setCategoria(categoria === c ? "" : c)}
              >
                {CATEGORIAS[c].emoji} {CATEGORIAS[c].rotulo}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="contagem" aria-live="polite">
        {filtradas.length === 1 ? "1 lugar" : `${filtradas.length} lugares`}
      </p>

      {visao === "mapa" ? (
        <Mapa empresas={filtradas} />
      ) : empresas.length === 0 ? (
        <p className="vazio">
          As primeiras visitas aéreas estão sendo gravadas. Volte em breve!
        </p>
      ) : filtradas.length === 0 ? (
        <p className="vazio">Nada encontrado. Tente outro nome ou categoria.</p>
      ) : (
        <ul className="grade">
          {filtradas.map((e, i) => (
            <li key={e.id}>
              <Link href={`/empresa/${e.slug}`} className="card">
                <div className="card-capa">
                  {e.youtube_id && (
                    // Primeiras capas sem lazy: são as que aparecem de cara no celular.
                    <img src={thumbYouTube(e.youtube_id, "mq")} alt="" loading={i < 2 ? "eager" : "lazy"} width={320} height={180} />
                  )}
                  {e.youtube_id && (
                    <span className="card-play">
                      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
                      </svg>
                      Visita aérea
                    </span>
                  )}
                </div>
                <div className="card-corpo">
                  <span className="selo">
                    {emojiCategoria(e.categoria)} {rotuloCategoria(e.categoria)}
                  </span>
                  <h2>{e.nome}</h2>
                  {e.endereco && <p className="card-endereco">{e.endereco}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
