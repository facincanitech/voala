import { SITE } from "./site";

export type Achado = { lat: number; lng: number; descricao: string };

async function buscar(q: string): Promise<Achado | null> {
  const [[latS, lngO], [latN, lngL]] = SITE.regiaoLimites;
  const params = new URLSearchParams({
    q,
    format: "jsonv2",
    limit: "1",
    countrycodes: "br",
    viewbox: `${lngO},${latN},${lngL},${latS}`,
    bounded: "1",
    "accept-language": "pt-BR",
  });
  const resp = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
  if (!resp.ok) return null;
  const lista = (await resp.json()) as { lat: string; lon: string; display_name: string }[];
  if (!lista.length) return null;
  return { lat: Number(lista[0].lat), lng: Number(lista[0].lon), descricao: lista[0].display_name };
}

// Endereço -> coordenadas pelo Nominatim (OpenStreetMap). Grátis, mas pede uso
// leve: só chamamos quando o admin pede, nunca a cada tecla.
// A busca fica presa em Rio Preto e região, senão "Rua XV" cai em outro estado.
// Muita rua daqui não tem número cadastrado no OSM: se falhar, tenta sem o número.
export async function geocodificar(endereco: string): Promise<Achado | null> {
  const achado = await buscar(endereco);
  if (achado) return achado;
  const semNumero = endereco.replace(/,?\s*(n[º°o.]?\s*)?\d+[a-z]?\b/gi, "").trim();
  if (semNumero && semNumero !== endereco) {
    await new Promise((r) => setTimeout(r, 1100)); // limite do Nominatim: 1 por segundo
    return buscar(semNumero);
  }
  return null;
}
