import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { AudioNarration } from "@/components/AudioNarration";
import { HighContrastToggle } from "@/components/HighContrastToggle";
import { METODO, temas } from "@/data/temas";
import { Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/como-funciona")({
  head: () => {
    const titulo = "Como funciona o Sinal — Reconhecer, Entender, Agir, Proteger";
    const desc =
      "O método do Sinal em quatro etapas: reconhecer os sinais, entender a situação, agir com segurança e proteger quem precisa de ajuda.";
    return {
      meta: [
        { title: titulo },
        { name: "description", content: desc },
        { property: "og:title", content: titulo },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ComoFunciona,
});

function ComoFunciona() {
  return (
    <div className="min-h-screen bg-transparent">
      <header className="bg-[image:var(--gradiente-sinal)] text-[color:var(--lilas)]">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-8 sm:px-10">
          <nav className="flex flex-wrap items-center justify-between gap-3 font-display text-sm font-semibold">
            <Link to="/" className="transition-opacity hover:opacity-70">
              ← Sinal
            </Link>
            <div className="flex items-center gap-2">
              <Link
                to="/temas"
                className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/15"
              >
                Temas
              </Link>
              <Link
                to="/jogos"
                className="rounded-full bg-[color:var(--amarelo)] px-3.5 py-1.5 text-[color:var(--tinta)] transition-transform hover:scale-105 font-bold"
              >
                🎮 Jogos & Missões
              </Link>
              <Link
                to="/familia-escola"
                className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/15 hidden sm:inline-block"
              >
                Família & Escola
              </Link>
              <Link
                to="/emergencia"
                className="rounded-full bg-white/20 px-3.5 py-1.5 transition-colors hover:bg-white/30"
              >
                Emergência
              </Link>
              <HighContrastToggle className="text-white" />
            </div>
          </nav>
          <h1 className="mt-14 max-w-3xl text-5xl sm:text-6xl">Como funciona o Sinal</h1>
          <p className="mt-4 max-w-xl text-lg opacity-90">
            Um caminho simples para transformar insegurança em atitude. Quatro etapas que se
            repetem em todos os temas.
          </p>

          <div className="mt-6">
            <AudioNarration
              title="Ouvir as quatro etapas do método"
              text="O método do Sinal em quatro etapas fundamentais. Etapa 1: Reconhecer os sinais de perigo. Etapa 2: Entender a situação com clareza. Etapa 3: Agir com segurança, sem colocar ninguém em risco. Etapa 4: Proteger e saber quando ligar para o SAMU 192 ou Bombeiros 193."
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <ol className="grid gap-6 md:grid-cols-2">
          {METODO.map((etapa, i) => (
            <li
              key={etapa.titulo}
              className="relative overflow-hidden rounded-3xl bg-card p-8 shadow-[var(--sombra-suave)]"
            >
              <span
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20"
                style={{ backgroundColor: etapa.cor }}
                aria-hidden="true"
              />
              <span
                className="font-display text-5xl font-extrabold"
                style={{ color: etapa.cor }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-2 text-2xl">{etapa.titulo}</h2>
              <p className="mt-2 text-[color:var(--muted-foreground)]">{etapa.texto}</p>
            </li>
          ))}
        </ol>

        {/* CTA para os jogos e simulação prática */}
        <section className="mt-16 rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-[var(--sombra-suave)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-[color:var(--roxo)]">
              <Sparkles className="h-4 w-4" />
              Praticar o método
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-foreground">
              Coloque as 4 etapas em prática com o Teddy!
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">
              Experimente nossas missões interativas com cenários para crianças e adolescentes.
              Ganhe estrelas e desbloqueie seu certificado de conclusão.
            </p>
          </div>

          <Link
            to="/jogos"
            className="shrink-0 inline-flex min-h-12 items-center gap-2 rounded-full bg-[color:var(--roxo)] px-7 py-3 font-display text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
          >
            Ir para os Jogos & Missões
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="mt-16" aria-labelledby="temas">
          <h2 id="temas" className="text-3xl">
            Onde aplicar
          </h2>
          <p className="mt-2 max-w-xl text-[color:var(--muted-foreground)]">
            O mesmo método guia os cinco temas do Sinal.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {temas.map((tema) => (
              <li key={tema.slug}>
                <Link
                  to="/tema/$slug"
                  params={{ slug: tema.slug }}
                  className="block h-full rounded-3xl p-6 text-[color:var(--lilas)] transition-transform hover:-translate-y-1"
                  style={{
                    background: `linear-gradient(135deg, ${tema.color} 0%, var(--roxo) 130%)`,
                  }}
                >
                  <span className="font-display text-2xl font-extrabold">{tema.nome}</span>
                  <span className="mt-2 block text-sm opacity-90">{tema.resumo}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
