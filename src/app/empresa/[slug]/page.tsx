import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoDrone } from "@/components/VideoDrone";
import { emojiCategoria, rotuloCategoria } from "@/lib/categorias";
import {
  formatarTelefone,
  linkComoChegar,
  linkInstagram,
  linkTelefone,
  linkWhatsApp,
  thumbYouTube,
} from "@/lib/contato";
import { buscarEmpresaPorSlug, listarEmpresasPublicas } from "@/lib/empresas";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// Export estático: só existe página para quem estava em dia no build.
export const dynamicParams = false;
const VAZIO = "_sem-empresas"; // o export não aceita lista vazia

export async function generateStaticParams() {
  const empresas = await listarEmpresasPublicas();
  return empresas.length ? empresas.map((e) => ({ slug: e.slug })) : [{ slug: VAZIO }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const e = await buscarEmpresaPorSlug(slug);
  if (!e) return { title: "Não encontrado", robots: { index: false } };
  const titulo = `${e.nome}: visita aérea por drone`;
  const descricao =
    e.descricao || `${rotuloCategoria(e.categoria)} em ${SITE.cidade}. Veja o lugar de cima antes de ir.`;
  const imagem = e.youtube_id ? [{ url: thumbYouTube(e.youtube_id, "hq"), width: 480, height: 360 }] : undefined;
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: `/empresa/${e.slug}/` },
    openGraph: { title: titulo, description: descricao, url: `/empresa/${e.slug}/`, images: imagem, type: "website" },
    twitter: { card: "summary_large_image", title: titulo, description: descricao, images: imagem?.map((i) => i.url) },
  };
}

export default async function PaginaEmpresa({ params }: Props) {
  const { slug } = await params;
  const e = await buscarEmpresaPorSlug(slug);
  if (!e) notFound();

  // Dados estruturados: ajuda o Google a mostrar endereço e telefone.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: e.nome,
    description: e.descricao || undefined,
    address: e.endereco
      ? {
          "@type": "PostalAddress",
          streetAddress: e.endereco,
          addressLocality: SITE.cidade,
          addressRegion: SITE.uf,
          addressCountry: "BR",
        }
      : undefined,
    geo: { "@type": "GeoCoordinates", latitude: e.lat, longitude: e.lng },
    telephone: e.telefone ? `+${e.telefone}` : undefined,
    image: e.youtube_id ? thumbYouTube(e.youtube_id, "hq") : undefined,
    sameAs: e.instagram ? [linkInstagram(e.instagram)] : undefined,
  };

  return (
    <main className="container empresa">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Link href="/" className="voltar">
        ← Todos os lugares
      </Link>
      <div className="empresa-grade">
        <div>
          {e.youtube_id ? (
            <VideoDrone id={e.youtube_id} titulo={`Visita aérea: ${e.nome}`} />
          ) : (
            <div className="sem-video">Vídeo em breve</div>
          )}
        </div>
        <aside className="painel">
          <span className="selo">
            {emojiCategoria(e.categoria)} {rotuloCategoria(e.categoria)}
          </span>
          <h1>{e.nome}</h1>
          {e.descricao && <p className="empresa-descricao">{e.descricao}</p>}

          <ul className="info" style={{ marginTop: 16 }}>
            {e.endereco && (
              <li>
                <span aria-hidden="true">📍</span>
                <span>{e.endereco}</span>
              </li>
            )}
            {e.telefone && (
              <li>
                <span aria-hidden="true">📞</span>
                <a href={linkTelefone(e.telefone)}>{formatarTelefone(e.telefone)}</a>
              </li>
            )}
            {e.instagram && (
              <li>
                <span aria-hidden="true">📸</span>
                <a href={linkInstagram(e.instagram)} target="_blank" rel="noopener">
                  @{e.instagram}
                </a>
              </li>
            )}
          </ul>

          <div className="acoes">
            {e.whatsapp && (
              <a
                className="botao botao-wpp"
                href={linkWhatsApp(e.whatsapp, `Olá! Vi vocês no ${SITE.nome}.`)}
                target="_blank"
                rel="noopener"
              >
                Chamar no WhatsApp
              </a>
            )}
            <a className="botao botao-ceu" href={linkComoChegar(e.lat, e.lng)} target="_blank" rel="noopener">
              Como chegar
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}
