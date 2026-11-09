import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// Imagem de compartilhamento 1200x630, gerada uma vez no build (vira out/og.png).
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "linear-gradient(180deg, #b5ddff 0%, #dcefff 55%, #fff1e6 100%)",
          color: "#0b2f52",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Sol de destaque no canto */}
        <div
          style={{
            position: "absolute",
            right: 110,
            top: 90,
            width: 170,
            height: 170,
            borderRadius: 999,
            background: "#ff7a3d",
            boxShadow: "0 0 0 40px #ffe1cc",
          }}
        />
        {/* Drone (mesmo desenho do logo) */}
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path d="M8 8l16 16M24 8L8 24" stroke="#1680cf" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="7" cy="7" r="4.5" fill="#ffffff" stroke="#1680cf" strokeWidth="1.6" />
          <circle cx="25" cy="7" r="4.5" fill="#ffffff" stroke="#1680cf" strokeWidth="1.6" />
          <circle cx="7" cy="25" r="4.5" fill="#ffffff" stroke="#1680cf" strokeWidth="1.6" />
          <circle cx="25" cy="25" r="4.5" fill="#ffffff" stroke="#1680cf" strokeWidth="1.6" />
          <rect x="12" y="12" width="8" height="8" rx="2.5" fill="#ff7a3d" />
        </svg>
        <div style={{ display: "flex", fontSize: 150, fontWeight: 800, letterSpacing: -6, marginTop: 20 }}>
          Voa<span style={{ color: "#ff7a3d" }}>Lá</span>
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, marginTop: 4 }}>{SITE.slogan}</div>
        <div style={{ fontSize: 32, color: "#0f63a6", marginTop: 24 }}>
          Visitas virtuais por drone às empresas da região
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
