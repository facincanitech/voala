import type { Empresa } from "./tipos";

// Empresas fictícias para ver o site sem Supabase configurado.
const daqui60dias = new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10);
const base = { telefone: "", ativo: true, plano_vence_em: daqui60dias, criado_em: "2026-01-01T00:00:00Z", youtube_id: "aqz-KE-bpKQ" };

export const EMPRESAS_DEMO: Empresa[] = [
  { ...base, id: "d1", nome: "Cantina do Vale", slug: "cantina-do-vale", categoria: "restaurante", descricao: "Massas artesanais e salão com vista para o jardim.", endereco: "Av. Alberto Andaló, 1000 - Centro", lat: -20.8113, lng: -49.3758, whatsapp: "5517900000001", instagram: "cantinadovale" },
  { ...base, id: "d2", nome: "Academia Altitude", slug: "academia-altitude", categoria: "academia", descricao: "Musculação, funcional e estacionamento próprio.", endereco: "Av. Bady Bassitt, 2000 - Boa Vista", lat: -20.8196, lng: -49.3842, whatsapp: "5517900000002", instagram: "academiaaltitude" },
  { ...base, id: "d3", nome: "Loja Horizonte", slug: "loja-horizonte", categoria: "loja", descricao: "Moda e acessórios, três andares.", endereco: "R. Bernardino de Campos, 300 - Centro", lat: -20.8139, lng: -49.379, whatsapp: "5517900000003", instagram: "lojahorizonte" },
  { ...base, id: "d4", nome: "Café Nuvem", slug: "cafe-nuvem", categoria: "cafe", descricao: "Café especial e terraço.", endereco: "Av. Juscelino K. de Oliveira, 500 - Jd. Tarraf", lat: -20.8325, lng: -49.4011, whatsapp: "5517900000004", instagram: "cafenuvem" },
  { ...base, id: "d5", nome: "Hotel Céu Aberto", slug: "hotel-ceu-aberto", categoria: "hotel", descricao: "Piscina na cobertura e café da manhã incluso.", endereco: "Av. Philadelpho Gouveia Netto, 800 - Vila Redentora", lat: -20.8052, lng: -49.3925, whatsapp: "5517900000005", instagram: "hotelceuaberto" },
  { ...base, id: "d6", nome: "Studio Brisa", slug: "studio-brisa", categoria: "beleza", descricao: "Salão e estética.", endereco: "R. Voluntários de São Paulo, 3500 - Centro", lat: -20.8165, lng: -49.3801, whatsapp: "5517900000006", instagram: "studiobrisa" },
  // Vencida de propósito: não pode aparecer.
  { ...base, id: "d7", nome: "Empresa Vencida", slug: "empresa-vencida", categoria: "outros", descricao: "", endereco: "", lat: -20.82, lng: -49.38, whatsapp: "", instagram: "", plano_vence_em: "2020-01-01" },
];
