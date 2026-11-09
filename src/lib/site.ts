// Tudo que identifica o site num lugar só: trocar o nome é mexer aqui.
export const SITE = {
  nome: "VoaLá",
  slogan: "Conheça Rio Preto de cima antes de ir",
  cidade: "São José do Rio Preto",
  uf: "SP",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // WhatsApp de quem vende os anúncios (só dígitos, com 55).
  whatsappComercial: process.env.NEXT_PUBLIC_WHATSAPP_COMERCIAL ?? "5517900000000",
  // Centro do mapa: Praça Dom José Marcondes, centro de Rio Preto.
  centro: { lat: -20.8113, lng: -49.3758 },
};
