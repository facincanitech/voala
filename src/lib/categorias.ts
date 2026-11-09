// Lista fechada de categorias: o banco guarda a chave, a tela mostra o rótulo.
// Para criar uma nova, é só adicionar aqui.
export const CATEGORIAS = {
  restaurante: { rotulo: "Restaurante", emoji: "🍽️" },
  cafe: { rotulo: "Café e padaria", emoji: "☕" },
  bar: { rotulo: "Bar", emoji: "🍻" },
  loja: { rotulo: "Loja", emoji: "🛍️" },
  academia: { rotulo: "Academia", emoji: "🏋️" },
  saude: { rotulo: "Saúde", emoji: "🩺" },
  beleza: { rotulo: "Beleza", emoji: "💇" },
  hotel: { rotulo: "Hotel", emoji: "🏨" },
  eventos: { rotulo: "Eventos", emoji: "🎉" },
  educacao: { rotulo: "Educação", emoji: "🎓" },
  automotivo: { rotulo: "Automotivo", emoji: "🚗" },
  servicos: { rotulo: "Serviços", emoji: "🧰" },
  outros: { rotulo: "Outros", emoji: "📍" },
} as const;

export type Categoria = keyof typeof CATEGORIAS;

export function rotuloCategoria(chave: string): string {
  return CATEGORIAS[chave as Categoria]?.rotulo ?? "Outros";
}

export function emojiCategoria(chave: string): string {
  return CATEGORIAS[chave as Categoria]?.emoji ?? "📍";
}
