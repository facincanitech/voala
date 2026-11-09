import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SITE } from "@/lib/site";
import "./globals.css";

const fonte = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--fonte", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.nome} · Visitas por drone em ${SITE.cidade}`, template: `%s · ${SITE.nome}` },
  description: `Veja restaurantes, lojas e academias de ${SITE.cidade} de cima, em vídeos curtos gravados por drone.`,
  openGraph: { siteName: SITE.nome, locale: "pt_BR", type: "website" },
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
            <Link href="/anuncie">Quero minha empresa aqui</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
