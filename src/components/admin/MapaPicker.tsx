"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { SITE } from "@/lib/site";

type Ponto = { lat: number; lng: number } | null;

const icone = L.divIcon({
  html: '<div class="pino"><span>📍</span></div>',
  className: "",
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

// Mapa do cadastro: o pino vem do endereço, e dá pra arrastar ou tocar no lugar certo.
export default function MapaPicker({ ponto, aoMudar }: { ponto: Ponto; aoMudar: (lat: number, lng: number) => void }) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<L.Map | null>(null);
  const pinoRef = useRef<L.Marker | null>(null);
  const aoMudarRef = useRef(aoMudar);
  aoMudarRef.current = aoMudar;

  useEffect(() => {
    if (!divRef.current) return;
    const mapa = L.map(divRef.current).setView([SITE.centro.lat, SITE.centro.lng], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa);
    mapa.on("click", (ev: L.LeafletMouseEvent) => aoMudarRef.current(ev.latlng.lat, ev.latlng.lng));
    mapaRef.current = mapa;
    return () => {
      mapa.remove();
      mapaRef.current = null;
      pinoRef.current = null;
    };
  }, []);

  // Ponto mudou (endereço achado, clique ou arraste): move o pino.
  useEffect(() => {
    const mapa = mapaRef.current;
    if (!mapa || !ponto) return;
    if (!pinoRef.current) {
      pinoRef.current = L.marker([ponto.lat, ponto.lng], { icon: icone, draggable: true }).addTo(mapa);
      pinoRef.current.on("dragend", () => {
        const p = pinoRef.current!.getLatLng();
        aoMudarRef.current(p.lat, p.lng);
      });
      mapa.setView([ponto.lat, ponto.lng], 17);
    } else {
      const atual = pinoRef.current.getLatLng();
      if (atual.lat !== ponto.lat || atual.lng !== ponto.lng) {
        pinoRef.current.setLatLng([ponto.lat, ponto.lng]);
        if (!mapa.getBounds().contains([ponto.lat, ponto.lng])) mapa.setView([ponto.lat, ponto.lng], 17);
      }
    }
  }, [ponto]);

  return <div ref={divRef} className="mapa-picker" />;
}
