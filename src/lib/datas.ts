// "Hoje" em Rio Preto (AAAA-MM-DD), igual à função hoje_br() do banco.
export function hojeBR(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
}

export function planoEmDia(venceEm: string): boolean {
  return venceEm >= hojeBR();
}

export function formatarData(iso: string): string {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}
