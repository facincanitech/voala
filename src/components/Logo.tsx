// Drone visto de cima: quatro hélices em volta do corpo.
export function Logo({ tamanho = 26 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 32 32" aria-hidden="true">
      <g stroke="#1680cf" strokeWidth="2.4" strokeLinecap="round">
        <path d="M8 8l16 16M24 8L8 24" />
      </g>
      <g fill="#b5ddff" stroke="#1680cf" strokeWidth="1.6">
        <circle cx="7" cy="7" r="4.5" />
        <circle cx="25" cy="7" r="4.5" />
        <circle cx="7" cy="25" r="4.5" />
        <circle cx="25" cy="25" r="4.5" />
      </g>
      <rect x="12" y="12" width="8" height="8" rx="2.5" fill="#ff7a3d" />
    </svg>
  );
}
