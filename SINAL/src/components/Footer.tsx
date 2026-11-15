import { Link } from "@tanstack/react-router";
import { temas } from "@/data/temas";

export function Footer() {
  return (
    <footer className="mt-24 bg-[color:var(--tinta)] text-[color:var(--lilas)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3 sm:px-10">
        <div>
          <p className="font-display text-3xl font-extrabold">Sinal</p>
          <p className="mt-1 font-display text-sm font-semibold text-[color:var(--amarelo)]">
            Reconhecer também é proteger
          </p>
          <p className="mt-4 max-w-xs text-sm opacity-75">
            Uma experiência educativa para aprender a reconhecer situações de emergência,
            entender o que está acontecendo e saber como agir.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
            <Link
              to="/jogos"
              className="rounded-full bg-white/10 px-3 py-1.5 transition-colors hover:bg-white/20 text-[color:var(--amarelo)]"
            >
              🎮 Jogos & Missões
            </Link>
            <Link
              to="/familia-escola"
              className="rounded-full bg-white/10 px-3 py-1.5 transition-colors hover:bg-white/20"
            >
              Família & Escola
            </Link>
          </div>
        </div>

        <nav aria-label="Temas">
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest opacity-60">
            Temas
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {temas.map((tema) => (
              <li key={tema.slug}>
                <Link
                  to="/tema/$slug"
                  params={{ slug: tema.slug }}
                  className="inline-flex min-h-11 items-center gap-2 transition-opacity hover:opacity-70"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: tema.color }}
                  />
                  {tema.nome}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/temas"
                className="inline-flex min-h-11 items-center gap-2 font-bold text-[color:var(--amarelo)] transition-opacity hover:opacity-80"
              >
                <span>✨ Explorar galeria 3D</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest opacity-60">
            Emergência
          </h2>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href="tel:192"
                className="flex min-h-11 items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 transition-colors hover:bg-white/20"
              >
                <span className="font-display text-2xl font-extrabold text-[color:var(--rosa)]">
                  192
                </span>
                <span className="text-sm">SAMU</span>
              </a>
            </li>
            <li>
              <a
                href="tel:193"
                className="flex min-h-11 items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 transition-colors hover:bg-white/20"
              >
                <span className="font-display text-2xl font-extrabold text-[color:var(--amarelo)]">
                  193
                </span>
                <span className="text-sm">Corpo de Bombeiros</span>
              </a>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              to="/emergencia"
              className="inline-block font-display text-sm font-semibold text-[color:var(--aqua)] hover:underline"
            >
              Ver contatos de emergência
            </Link>
            <Link
              to="/como-funciona"
              className="inline-block font-display text-sm font-semibold text-white/80 hover:underline"
            >
              Como funciona
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs opacity-60 sm:px-10">
        Projeto interdisciplinar • O Sinal tem finalidade educativa e não substitui
        avaliação ou atendimento profissional de saúde. Conteúdo clínico sujeito à validação da
        Enfermagem.
      </div>
    </footer>
  );
}
