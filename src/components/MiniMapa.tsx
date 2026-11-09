"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { EmpresaPublica } from "@/lib/tipos";

// Reaproveita o Mapa principal em modo fixo. Só baixa o Leaflet quando o
// mapinha chega perto da tela (no celular ele fica lá embaixo).
const Mapa = dynamic(() => import("./Mapa"), {
  ssr: false,
  loading: () => <div className="mapinha mapa-carregando">Carregando mapa…</div>,
});

export function MiniMapa({ empresa }: { empresa: EmpresaPublica }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="mapinha-caixa" aria-label={`Mapa com a localização de ${empresa.nome}`}>
      {visivel ? <Mapa empresas={[empresa]} fixo className="mapinha" /> : <div className="mapinha" />}
    </div>
  );
}
