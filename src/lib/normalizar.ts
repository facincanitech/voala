// Limpa o que o admin digita antes de gravar. Testado em normalizar.test.ts.

export function gerarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " e ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

// Aceita o ID puro ou qualquer link do YouTube (watch, youtu.be, shorts, embed).
export function extrairYouTubeId(entrada: string): string | null {
  const s = entrada.trim();
  if (!s) return "";
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// Telefone/WhatsApp vira só dígitos com 55 na frente (o admin digita do jeito que quiser).
export function normalizarTelefone(entrada: string): string {
  let d = entrada.replace(/\D/g, "");
  if (!d) return "";
  if (d.length === 10 || d.length === 11) d = "55" + d;
  return d;
}

// "@fulano", "instagram.com/fulano/" ou "fulano" -> "fulano"
export function normalizarInstagram(entrada: string): string {
  const s = entrada.trim();
  const m = s.match(/instagram\.com\/([A-Za-z0-9._]+)/i);
  return (m ? m[1] : s.replace(/^@/, "")).replace(/\/+$/, "");
}
