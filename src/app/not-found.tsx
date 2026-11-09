import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <main className="container texto">
      <h1>Esse lugar saiu do mapa</h1>
      <p>A página não existe ou a empresa não está mais no ar.</p>
      <Link href="/" className="botao botao-ceu">
        Ver todos os lugares
      </Link>
    </main>
  );
}
