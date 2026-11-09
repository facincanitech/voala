import type { Metadata } from "next";

// Painel interno: fora do Google.
export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return <main className="container admin">{children}</main>;
}
