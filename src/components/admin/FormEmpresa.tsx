"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { CATEGORIAS, type Categoria } from "@/lib/categorias";
import { thumbYouTube } from "@/lib/contato";
import { hojeBR } from "@/lib/datas";
import { geocodificar } from "@/lib/geocodificar";
import { extrairYouTubeId, gerarSlug, normalizarInstagram, normalizarTelefone } from "@/lib/normalizar";
import { supabaseNavegador } from "@/lib/supabase/navegador";
import type { Empresa } from "@/lib/tipos";

const MapaPicker = dynamic(() => import("./MapaPicker"), {
  ssr: false,
  loading: () => <div className="mapa-picker mapa-carregando">Carregando mapa…</div>,
});

type Campos = {
  youtube: string;
  nome: string;
  endereco: string;
  lat: number | null;
  lng: number | null;
  categoria: string;
  plano_vence_em: string;
  ativo: boolean;
  descricao: string;
  whatsapp: string;
  telefone: string;
  instagram: string;
};

// Plano novo: 30 dias a partir de hoje (em Rio Preto).
function daqui30Dias() {
  const [a, m, d] = hojeBR().split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d + 30)).toISOString().slice(0, 10);
}

const VAZIO: Campos = {
  youtube: "",
  nome: "",
  endereco: "",
  lat: null,
  lng: null,
  categoria: "outros",
  plano_vence_em: "",
  ativo: true,
  descricao: "",
  whatsapp: "",
  telefone: "",
  instagram: "",
};

export function FormEmpresa() {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [c, setC] = useState<Campos>(VAZIO);
  const [carregando, setCarregando] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [avisoMapa, setAvisoMapa] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const mudar = <K extends keyof Campos>(campo: K, valor: Campos[K]) => setC((ant) => ({ ...ant, [campo]: valor }));

  // Editar: carrega a empresa do ?id=.
  useEffect(() => {
    const idUrl = new URLSearchParams(location.search).get("id");
    if (!idUrl) {
      setC({ ...VAZIO, plano_vence_em: daqui30Dias() });
      setCarregando(false);
      return;
    }
    setId(idUrl);
    supabaseNavegador()
      .from("empresas")
      .select("*")
      .eq("id", idUrl)
      .maybeSingle<Empresa>()
      .then(({ data, error }) => {
        if (error || !data) setErro("Empresa não encontrada.");
        else
          setC({
            youtube: data.youtube_id ? `https://youtu.be/${data.youtube_id}` : "",
            nome: data.nome,
            endereco: data.endereco,
            lat: data.lat,
            lng: data.lng,
            categoria: data.categoria,
            plano_vence_em: data.plano_vence_em,
            ativo: data.ativo,
            descricao: data.descricao,
            whatsapp: data.whatsapp,
            telefone: data.telefone,
            instagram: data.instagram,
          });
        setCarregando(false);
      });
  }, []);

  async function acharNoMapa() {
    if (!c.endereco.trim()) return;
    setBuscando(true);
    setAvisoMapa("");
    try {
      const achado = await geocodificar(c.endereco);
      if (achado) {
        setC((ant) => ({ ...ant, lat: achado.lat, lng: achado.lng }));
        setAvisoMapa(`Achei: ${achado.descricao}. Se o pino não estiver certinho, arraste ou toque no lugar certo.`);
      } else {
        setAvisoMapa("Não achei esse endereço. Toque no mapa para marcar o local.");
      }
    } catch {
      setAvisoMapa("Busca indisponível agora. Toque no mapa para marcar o local.");
    }
    setBuscando(false);
  }

  async function salvar(ev: FormEvent) {
    ev.preventDefault();
    setErro("");
    const youtubeId = extrairYouTubeId(c.youtube);
    if (youtubeId === null) return setErro("Link do YouTube inválido. Cole o link do vídeo (youtube.com ou youtu.be).");
    if (c.lat === null || c.lng === null) return setErro("Marque o local no mapa (botão “Achar no mapa” ou toque no mapa).");

    const dados = {
      nome: c.nome.trim(),
      categoria: c.categoria,
      descricao: c.descricao.trim(),
      endereco: c.endereco.trim(),
      lat: c.lat,
      lng: c.lng,
      telefone: normalizarTelefone(c.telefone),
      whatsapp: normalizarTelefone(c.whatsapp),
      instagram: normalizarInstagram(c.instagram),
      youtube_id: youtubeId,
      ativo: c.ativo,
      plano_vence_em: c.plano_vence_em,
    };

    setSalvando(true);
    const sb = supabaseNavegador();
    let error;
    if (id) {
      // O slug não muda na edição: links já compartilhados continuam valendo.
      ({ error } = await sb.from("empresas").update(dados).eq("id", id));
    } else {
      // Slug a partir do nome; se já existir, tenta -2, -3...
      const base = gerarSlug(dados.nome) || "empresa";
      for (let n = 1; n <= 20; n++) {
        const slug = n === 1 ? base : `${base}-${n}`;
        ({ error } = await sb.from("empresas").insert({ ...dados, slug }));
        if (!error || error.code !== "23505") break;
      }
    }
    setSalvando(false);
    if (error) return setErro(`Não foi possível salvar: ${error.message}`);
    router.push("/admin/?salvo=1");
  }

  if (carregando) return <p className="vazio">Carregando…</p>;

  const youtubeId = extrairYouTubeId(c.youtube);
  const ponto = c.lat !== null && c.lng !== null ? { lat: c.lat, lng: c.lng } : null;

  return (
    <form className="formulario" onSubmit={salvar}>
      <div className="admin-topo">
        <h1>{id ? "Editar empresa" : "Novo vídeo"}</h1>
        <Link href="/admin/" className="botao botao-link">
          ← Voltar
        </Link>
      </div>

      <fieldset>
        <label className="campo">
          <span>Link do YouTube</span>
          <input
            value={c.youtube}
            onChange={(e) => mudar("youtube", e.target.value)}
            placeholder="https://youtu.be/..."
            inputMode="url"
            required
          />
          <small>Pode ser vídeo “não listado”. Guardamos só o código do vídeo.</small>
        </label>
        {youtubeId && <img className="previa-thumb" src={thumbYouTube(youtubeId, "mq")} alt="Capa do vídeo" />}
        {youtubeId === null && <p className="erro">Esse link não parece ser de um vídeo do YouTube.</p>}

        <label className="campo">
          <span>Nome da empresa</span>
          <input value={c.nome} onChange={(e) => mudar("nome", e.target.value)} required maxLength={120} />
        </label>

        <label className="campo">
          <span>Endereço</span>
          <div className="linha-endereco">
            <input
              value={c.endereco}
              onChange={(e) => mudar("endereco", e.target.value)}
              onBlur={() => !ponto && acharNoMapa()}
              placeholder="Av. Alberto Andaló, 1000, Rio Preto"
              required
            />
            <button type="button" className="botao botao-claro" onClick={acharNoMapa} disabled={buscando}>
              {buscando ? "Buscando…" : "Achar no mapa"}
            </button>
          </div>
          <small>Coloque a cidade se não for Rio Preto (ex.: “..., Mirassol”).</small>
        </label>
        <MapaPicker ponto={ponto} aoMudar={(lat, lng) => setC((ant) => ({ ...ant, lat, lng }))} />
        {avisoMapa && <small className="dica-mapa">{avisoMapa}</small>}

        <div className="duas-colunas">
          <label className="campo">
            <span>Categoria</span>
            <select value={c.categoria} onChange={(e) => mudar("categoria", e.target.value)}>
              {(Object.keys(CATEGORIAS) as Categoria[]).map((k) => (
                <option key={k} value={k}>
                  {CATEGORIAS[k].emoji} {CATEGORIAS[k].rotulo}
                </option>
              ))}
            </select>
          </label>
          <label className="campo">
            <span>Plano vence em</span>
            <input
              type="date"
              value={c.plano_vence_em}
              onChange={(e) => mudar("plano_vence_em", e.target.value)}
              required
            />
            <small>Depois dessa data a empresa sai do site sozinha.</small>
          </label>
        </div>

        <label className="campo-check">
          <input type="checkbox" checked={c.ativo} onChange={(e) => mudar("ativo", e.target.checked)} />
          No ar (desmarque para esconder do site sem apagar)
        </label>
      </fieldset>

      <details className="mais-detalhes" open={Boolean(id && (c.descricao || c.whatsapp || c.telefone || c.instagram))}>
        <summary>Mais detalhes (opcional)</summary>
        <fieldset>
          <label className="campo">
            <span>Descrição curta</span>
            <textarea
              value={c.descricao}
              onChange={(e) => mudar("descricao", e.target.value)}
              rows={2}
              maxLength={200}
              placeholder="Ex.: Massas artesanais e salão com vista para o jardim."
            />
          </label>
          <div className="duas-colunas">
            <label className="campo">
              <span>WhatsApp</span>
              <input
                value={c.whatsapp}
                onChange={(e) => mudar("whatsapp", e.target.value)}
                inputMode="tel"
                placeholder="(17) 99999-9999"
              />
            </label>
            <label className="campo">
              <span>Telefone</span>
              <input
                value={c.telefone}
                onChange={(e) => mudar("telefone", e.target.value)}
                inputMode="tel"
                placeholder="(17) 3222-2222"
              />
            </label>
          </div>
          <label className="campo">
            <span>Instagram</span>
            <input value={c.instagram} onChange={(e) => mudar("instagram", e.target.value)} placeholder="@empresa" />
          </label>
        </fieldset>
      </details>

      {erro && <p className="erro">{erro}</p>}
      <div className="rodape-form">
        <Link href="/admin/" className="botao botao-claro">
          Cancelar
        </Link>
        <button className="botao botao-primario" disabled={salvando}>
          {salvando ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </form>
  );
}
