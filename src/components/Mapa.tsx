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

type Props = {
  empresas: EmpresaPublica[];
  // Mapinha da página da empresa: centrado nela, zoom travado, sem cluster.
  fixo?: boolean;
  className?: string;
};

const ZOOM_FIXO = 16;

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

function pino(e: EmpresaPublica) {
  return L.marker([e.lat, e.lng], {
    title: e.nome,
    keyboard: false,
    icon: L.divIcon({
      html: `<div class="pino"><span>${emojiCategoria(e.categoria)}</span></div>`,
      className: "",
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -30],
    }),
  });
}

function camadaRuas() {
  return L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });
}

export default function Mapa({ empresas, fixo = false, className = "mapa" }: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<L.Map | null>(null);
  const grupoRef = useRef<L.MarkerClusterGroup | null>(null);

  // Cria o mapa uma vez.
  useEffect(() => {
    if (!divRef.current) return;

    if (fixo) {
      const e = empresas[0];
      if (!e) return;
      const mapa = L.map(divRef.current, {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,
        keyboard: false,
      }).setView([e.lat, e.lng], ZOOM_FIXO);
      camadaRuas().addTo(mapa);
      pino(e).addTo(mapa);
      return () => {
        mapa.remove();
      };
    }

    // Mapa principal: preso em Rio Preto e região, para ninguém se perder no oceano.
    const limites = L.latLngBounds(SITE.regiaoLimites);
    const mapa = L.map(divRef.current, {
      zoomControl: false,
      maxBounds: limites.pad(0.1),
      maxBoundsViscosity: 0.8,
      minZoom: 10,
    }).setView([SITE.centro.lat, SITE.centro.lng], 13);
    L.control.zoom({ position: "bottomright" }).addTo(mapa);
    camadaRuas().addTo(mapa);
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
  }, [fixo]);

  // Redesenha os pinos quando o filtro muda (só no mapa principal).
  useEffect(() => {
    const mapa = mapaRef.current;
    if (fixo || !mapa) return;
    const desenhar = () => {
      const grupo = grupoRef.current;
      if (!grupo) return;
      grupo.clearLayers();
      const pinos = empresas.map((e) => pino(e).bindPopup(htmlPopup(e)));
      grupo.addLayers(pinos);
      if (pinos.length) mapa.fitBounds(grupo.getBounds(), { padding: [40, 40], maxZoom: 16 });
      else mapa.setView([SITE.centro.lat, SITE.centro.lng], 12);
    };
    if (grupoRef.current) desenhar();
    else mapa.once("grupo-pronto", desenhar);
    return () => {
      mapa.off("grupo-pronto", desenhar);
    };
  }, [empresas, fixo]);

  return <div ref={divRef} className={className} />;
}
