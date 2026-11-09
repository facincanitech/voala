import type { Metadata } from "next";
import { linkWhatsApp } from "@/lib/contato";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Anuncie sua empresa",
  description: `Mostre sua empresa de cima: gravamos um vídeo com drone e colocamos você no mapa de ${SITE.cidade}.`,
};

export default function Anuncie() {
  const wpp = linkWhatsApp(SITE.whatsappComercial, `Olá! Quero colocar minha empresa no ${SITE.nome}.`);
  return (
    <main className="container texto">
      <h1>Sua empresa vista de cima</h1>
      <p>
        Antes de visitar um lugar novo, as pessoas querem ver como ele é. No {SITE.nome}, quem procura um restaurante,
        loja ou academia em {SITE.cidade} assiste a um vídeo curto gravado por drone e já chega sabendo onde estacionar,
        o tamanho do espaço e o clima do lugar.
      </p>

      <h2>Como funciona</h2>
      <ol className="passos">
        <li>
          <strong>Você chama a gente no WhatsApp</strong>
          Combinamos o melhor dia e horário para a gravação.
        </li>
        <li>
          <strong>Gravamos com drone</strong>
          Fachada, entorno, estacionamento e, se quiser, o interior. O vídeo final tem de 1 a 2 minutos.
        </li>
        <li>
          <strong>Sua empresa entra no mapa</strong>
          Com página própria, vídeo, endereço, WhatsApp, Instagram e o botão “Como chegar”.
        </li>
      </ol>

      <h2>O que está incluso</h2>
      <ul>
        <li>Vídeo aéreo editado, que você também pode usar nas suas redes</li>
        <li>Página própria para compartilhar, que aparece no Google</li>
        <li>Pino no mapa da cidade e card na lista</li>
        <li>Botões diretos para WhatsApp e rota no Google Maps</li>
      </ul>

      <div className="cta-final">
        <h2>Vamos colocar você no mapa?</h2>
        <p>Mensalidade sem fidelidade. Fale com a gente e receba os valores.</p>
        <a className="botao botao-wpp" href={wpp} target="_blank" rel="noopener">
          Falar no WhatsApp
        </a>
      </div>
    </main>
  );
}
