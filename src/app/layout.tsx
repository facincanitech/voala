import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { linkWhatsApp } from "@/lib/contato";
import { OG_PADRAO, SITE, openGraphBase } from "@/lib/site";
import "./globals.css";

const fonte = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--fonte", display: "swap" });

// URLs absolutas saem de urlAbsoluta() (já com o /voala). O metadataBase com
// barra no fim é rede de segurança para alguma URL relativa que escape.
export const metadata: Metadata = {
  metadataBase: new URL(`${SITE.url}/`),
  title: { default: `${SITE.nome} · ${SITE.slogan}`, template: `%s · ${SITE.nome}` },
  description: SITE.descricao,
  openGraph: { ...openGraphBase(), images: [OG_PADRAO] },
  twitter: { card: "summary_large_image", images: [OG_PADRAO.url] },
};

export const viewport: Viewport = { themeColor: "#dcefff", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={fonte.variable}>
      <body>
        <header className="topo">
          <div className="container">
            <Link href="/" className="logo" aria-label={`${SITE.nome}, página inicial`}>
              <Logo />
              Voa<span>Lá</span>
            </Link>
            <nav>
              <Link href="/anuncie" className="botao botao-primario botao-pequeno">
                Anuncie aqui
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="rodape">
          <div className="container">
            <span>
              © {new Date().getFullYear()} {SITE.nome} · {SITE.cidade} - {SITE.uf}
            </span>
            <span style={{ display: "flex", gap: 16 }}>
              <Link href="/anuncie">Quero minha empresa aqui</Link>
              {SITE.whatsapp && (
                <a href={linkWhatsApp(SITE.whatsapp, `Olá! Vim pelo site do ${SITE.nome}.`)} target="_blank" rel="noopener">
                  WhatsApp
                </a>
              )}
              {/* Acesso ao painel: discreto, mas à mão. nofollow p/ o Google não seguir. */}
              <Link href="/admin/" rel="nofollow" className="link-painel">
                Entrar
              </Link>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
