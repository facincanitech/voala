"use client";

import { useState } from "react";
import { thumbYouTube } from "@/lib/contato";

// Mostra só a capa; o iframe do YouTube (~1 MB de JS) entra no clique.
export function VideoDrone({ id, titulo }: { id: string; titulo: string }) {
  const [tocando, setTocando] = useState(false);

  if (tocando) {
    return (
      <div className="video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={titulo}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="video">
      <img src={thumbYouTube(id, "hq")} alt="" width={480} height={360} fetchPriority="high" />
      <button type="button" onClick={() => setTocando(true)} aria-label={`Assistir: ${titulo}`}>
        <span className="video-play">
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" fill="#fff" />
          </svg>
        </span>
        <span className="video-rotulo">Visita aérea</span>
      </button>
    </div>
  );
}
