import { BASE_PATH } from "./caminho";

// URL pública completa do site, já com o subcaminho (no Pages: .../voala).
// Vem do ambiente porque o domínio muda quando sair do GitHub Pages.
const urlBase = (process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:3000${BASE_PATH}`).replace(/\/+$/, "");

// Tudo que identifica o site num lugar só: trocar o nome é mexer aqui.
export const SITE = {
  nome: "VoaLá",
  slogan: "Rio Preto e região vista de cima",
  cidade: "São José do Rio Preto",
  regiao: "São José do Rio Preto e região",
  uf: "SP",
  descricao: "Veja restaurantes, lojas e academias de São José do Rio Preto e região de cima, em vídeos curtos gravados por drone.",
  url: urlBase,
  // WhatsApp do VoaLá (só dígitos, com 55). Vazio = botões somem.
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, ""),
  // Centro do mapa: Praça Dom José Marcondes, centro de Rio Preto.
  centro: { lat: -20.8113, lng: -49.3758 },
  // Limite do mapa: Rio Preto e cidades vizinhas (Mirassol, Bady Bassitt,
  // Cedral, Guapiaçu, Ipiguá, Onda Verde, Nova Aliança, Potirendaba...).
  regiaoLimites: [
    [-21.15, -49.75],
    [-20.5, -49.05],
  ] as [[number, number], [number, number]],
};

// URL absoluta para canonical, og:url, og:image e sitemap.
// "/empresa/x/" -> "https://facincanitech.github.io/voala/empresa/x/"
export function urlAbsoluta(caminhoRelativo: string): string {
  return `${SITE.url}${caminhoRelativo.startsWith("/") ? "" : "/"}${caminhoRelativo}`;
}

export const OG_PADRAO = {
  url: urlAbsoluta("/og.png"),
  width: 1200,
  height: 630,
  alt: `${SITE.nome}: ${SITE.slogan}`,
};

// O openGraph de uma página substitui o do layout inteiro: por isso essa base.
export function openGraphBase() {
  return { siteName: SITE.nome, locale: "pt_BR", type: "website" as const };
}
