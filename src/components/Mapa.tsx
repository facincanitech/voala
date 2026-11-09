"use client";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { caminho } from "@/lib/caminho";
import { emojiCategoria, rotuloCategoria } from "@/lib/categorias";
import { thumbYouTube } from "@/lib/contato";
import { SITE } from "@/lib/site";
import type { EmpresaPublica } from "@/lib/tipos";

// Popup é HTML cru do Leaflet: escapa tudo que vem do banco.
function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function htmlPopup(e: EmpresaPublica) {
  const capa = e.youtube_id ? `<img src="${thumbYouTube(e.youtube_id, "mq")}" alt="" loading="lazy">` : "";
  return `<div class="popup">${capa}<strong>${esc(e.nome)}</strong>
    <small>${emojiCategoria(e.categoria)} ${esc(rotuloCategoria(e.categoria))}</small>
    <a class="botao botao-primario botao-pequeno" href="${caminho(`/empresa/${e.slug}/`)}">Ver visita aérea</a></div>`;
}

export default function Mapa({ empresas }: { empresas: EmpresaPublica[] }) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<L.Map | null>(null);
  const grupoRef = useRef<L.MarkerClusterGroup | null>(null);

  // Cria o mapa uma vez.
  useEffect(() => {
    if (!divRef.current) return;
    const mapa = L.map(divRef.current, { zoomControl: false }).setView([SITE.centro.lat, SITE.centro.lng], 13);
    L.control.zoom({ position: "bottomright" }).addTo(mapa);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa);
    mapaRef.current = mapa;

    let cancelado = false;
    // O plugin de cluster espera o L global; por isso carrega depois.
    (window as unknown as { L: typeof L }).L = L;
    import("leaflet.markercluster").then(() => {
      if (cancelado) return;
      grupoRef.current = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        iconCreateFunction: (c) =>
          L.divIcon({ html: `<div class="grupo-pinos">${c.getChildCount()}</div>`, className: "", iconSize: [40, 40] }),
      }).addTo(mapa);
      mapa.fire("grupo-pronto");
    });
    return () => {
      cancelado = true;
      mapa.remove();
      mapaRef.current = null;
      grupoRef.current = null;
    };
  }, []);

  // Redesenha os pinos quando o filtro muda.
  useEffect(() => {
    const mapa = mapaRef.current;
    if (!mapa) return;
    const desenhar = () => {
      const grupo = grupoRef.current;
      if (!grupo) return;
      grupo.clearLayers();
      const pinos = empresas.map((e) =>
        L.marker([e.lat, e.lng], {
          title: e.nome,
          icon: L.divIcon({
            html: `<div class="pino"><span>${emojiCategoria(e.categoria)}</span></div>`,
            className: "",
            iconSize: [34, 34],
            iconAnchor: [17, 34],
            popupAnchor: [0, -30],
          }),
        }).bindPopup(htmlPopup(e)),
      );
      grupo.addLayers(pinos);
      if (pinos.length) mapa.fitBounds(grupo.getBounds(), { padding: [40, 40], maxZoom: 16 });
    };
    if (grupoRef.current) desenhar();
    else mapa.once("grupo-pronto", desenhar);
    return () => {
      mapa.off("grupo-pronto", desenhar);
    };
  }, [empresas]);

  return <div ref={divRef} className="mapa" />;
}
