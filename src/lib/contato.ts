// Links montados a partir do que está no banco (só dígitos / só o usuário).

export function linkWhatsApp(numero: string, texto?: string): string {
  const q = texto ? `?text=${encodeURIComponent(texto)}` : "";
  return `https://wa.me/${numero}${q}`;
}

export function linkInstagram(usuario: string): string {
  return `https://instagram.com/${usuario}`;
}

export function linkComoChegar(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function linkTelefone(tel: string): string {
  return `tel:+${tel.replace(/\D/g, "")}`;
}

// 5517999998888 -> (17) 99999-8888
export function formatarTelefone(digitos: string): string {
  const d = digitos.replace(/\D/g, "").replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return digitos;
}

export function thumbYouTube(id: string, qualidade: "mq" | "hq" = "hq"): string {
  return `https://img.youtube.com/vi/${id}/${qualidade}default.jpg`;
}
