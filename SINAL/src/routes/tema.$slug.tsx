import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { PraticaInterativa } from "@/components/PraticaInterativa";
import { DemonstracaoExperiencia } from "@/components/DemonstracaoExperiencia";
import { AudioNarration } from "@/components/AudioNarration";
import { HighContrastToggle } from "@/components/HighContrastToggle";
import { temaBySlug, temas } from "@/data/temas";
import { useEffect } from "react";
import { useTeddy } from "@/components/TeddyMascote";
import { PlayCircle, ArrowDown, Gamepad2 } from "lucide-react";

export const Route = createFileRoute("/tema/$slug")({
  loader: ({ params }) => {
    const tema = temaBySlug(params.slug);
    if (!tema) throw notFound();
    return { tema };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Tema não encontrado — Sinal" }, { name: "robots", content: "noindex" }],
      };
    }
    const { tema } = loaderData;
    const titulo = `${tema.nome} — Sinal`;
    const desc = `${tema.resumo} Aprenda a reconhecer, entender, agir e saber quando pedir ajuda.`;
    return {
      meta: [
        { title: titulo },
        { name: "description", content: desc },
        { property: "og:title", content: titulo },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: TemaPage,
});

function Bloco({
  numero,
  titulo,
  cor,
  itens,
  variante = "neutro",
}: {
  numero: string;
  titulo: string;
  cor: string;
  itens: string[];
  variante?: "neutro" | "positivo" | "alerta";
}) {
  const marcador =
    variante === "positivo" ? "✓" : variante === "alerta" ? "✕" : "•";
  const corMarcador =
    variante === "positivo" ? "var(--aqua)" : variante === "alerta" ? "var(--rosa)" : cor;

  return (
    <section className="rounded-3xl bg-card p-7 shadow-[var(--sombra-suave)] sm:p-9">
      <p
        className="font-display text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: cor }}
      >
        {numero}
      </p>
      <h2 className="mt-1 text-2xl sm:text-3xl">{titulo}</h2>
      <ul className="mt-5 space-y-3">
        {itens.map((item) => (
          <li key={item} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 font-display font-extrabold"
              style={{ color: corMarcador }}
            >
              {marcador}
            </span>
            <span className="text-[color:var(--muted-foreground)]">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TemaPage() {
  const { tema } = Route.useLoaderData();
  const { setEstado, calar } = useTeddy();
  useEffect(() => {
    calar();
    setEstado("explicando");
    return () => { calar(); setEstado("idle"); };
  }, [tema.slug, setEstado, calar]);
  const outros = temas.filter((t) => t.slug !== tema.slug);

  return (
    <div className="min-h-screen bg-transparent">
      <header
        className="relative overflow-hidden text-[color:var(--lilas)]"
        style={{
          background: `linear-gradient(135deg, ${tema.color} 0%, var(--roxo) 100%)`,
        }}
      >
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-8 sm:px-10 sm:pb-20">
          <nav
            aria-label="Navegação"
            className="flex flex-wrap items-center justify-between gap-3 font-display text-sm font-semibold"
          >
            <Link to="/" className="transition-opacity hover:opacity-70">
              ← Sinal
            </Link>
            <div className="flex items-center gap-2">
              <Link
                to="/temas"
                className="rounded-full px-3 py-2 transition-colors hover:bg-white/15"
              >
                Temas
              </Link>
              <Link
                to="/como-funciona"
                className="rounded-full px-3 py-2 transition-colors hover:bg-white/15"
              >
                Como funciona
              </Link>
              <Link
                to="/jogos"
                className="rounded-full px-3 py-2 transition-colors hover:bg-white/15"
              >
                Jogos & Prática
              </Link>
              <Link
                to="/emergencia"
                className="rounded-full bg-white/20 px-4 py-2 transition-colors hover:bg-white/30"
              >
                Emergência
              </Link>
              <HighContrastToggle className="text-white" />
            </div>
          </nav>

          <div className="mt-12 grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
            <div className="animate-[reveal_0.7s_ease-out_both]">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] opacity-80">
                Tema do Sinal
              </p>
              <h1 className="mt-2 text-5xl sm:text-6xl">{tema.nome}</h1>
              <p className="mt-4 max-w-lg text-lg opacity-90">{tema.resumo}</p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <AudioNarration
                  title={`Ouvir sobre ${tema.nome}`}
                  {...(tema.audioSrc ? { audioSrc: tema.audioSrc } : {})}
                  legendas={tema.legendas}
                  text={
                    tema.legendas
                      ? tema.legendas.map((l) => l.texto).join(" ")
                      : `${tema.nome}: ${tema.resumo}. O que é: ${tema.oQueE.join(". ")}. Como reconhecer: ${tema.reconhecer.join(". ")}. O que fazer: ${tema.fazer.join(". ")}`
                  }
                />
              </div>

              {/* Ações: Praticar mini fase no jogos e Visualizar demonstração no final da página */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  to="/jogos"
                  search={{ tema: tema.slug }}
                  className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--amarelo)] px-5 py-2.5 font-display text-xs sm:text-sm font-extrabold text-[color:var(--tinta)] shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  title={`Praticar missões e mini fase 2D de ${tema.nome}`}
                >
                  <Gamepad2 className="h-4 w-4" />
                  <span>Hora de praticar</span>
                </Link>

                <a
                  href={`#demonstracao-${tema.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(`demonstracao-${tema.slug}`);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 font-display text-xs sm:text-sm font-bold text-white shadow-md backdrop-blur-md transition-all hover:bg-white/25 hover:border-white/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  title={
                    tema.videoSrc
                      ? `Assistir ao vídeo educativo de ${tema.nome}`
                      : `Visualizar demonstração da experiência de ${tema.nome}`
                  }
                  aria-label={
                    tema.videoSrc
                      ? `Assistir ao vídeo educativo de ${tema.nome}`
                      : `Visualizar demonstração da experiência de ${tema.nome}`
                  }
                >
                  <PlayCircle className="h-4 w-4 text-[color:var(--amarelo)] transition-transform group-hover:scale-110" />
                  <span>{tema.videoSrc ? "Assistir ao vídeo" : "Visualizar demonstração"}</span>
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 font-display text-xs font-semibold">
                {["Reconhecer", "Entender", "Agir", "Proteger"].map((etapa) => (
                  <span key={etapa} className="rounded-full bg-white/15 px-3 py-1.5">
                    {etapa}
                  </span>
                ))}
              </div>
            </div>
            <img
              src={tema.cardImage || tema.image}
              alt={`Ilustração representando ${tema.nome.toLowerCase()}`}
              width={1024}
              height={636}
              className="w-full rounded-3xl shadow-[var(--sombra-forte)] object-cover"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          <Bloco numero="01" titulo="O que é?" cor={tema.color} itens={tema.oQueE} />
          <Bloco
            numero="02"
            titulo="Como reconhecer?"
            cor={tema.color}
            itens={tema.reconhecer}
          />
          <Bloco
            numero="03"
            titulo="O que fazer?"
            cor={tema.color}
            itens={tema.fazer}
            variante="positivo"
          />
          <Bloco
            numero="04"
            titulo="O que não fazer?"
            cor={tema.color}
            itens={tema.naoFazer}
            variante="alerta"
          />
        </div>

        <section className="mt-6 rounded-3xl bg-[color:var(--tinta)] p-7 text-[color:var(--lilas)] sm:p-10">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--amarelo)]">
            05
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl">Quando pedir ajuda?</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {tema.ajuda.map((item) => (
              <li key={item} className="flex gap-3 text-sm opacity-90">
                <span aria-hidden="true" className="text-[color:var(--amarelo)]">
                  !
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            {tema.contatos.map((contato) => (
              <a
                key={contato.numero}
                href={`tel:${contato.numero}`}
                className="flex min-h-11 items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 transition-colors hover:bg-white/20"
              >
                <span className="font-display text-3xl font-extrabold text-[color:var(--rosa)]">
                  {contato.numero}
                </span>
                <span className="font-display text-sm font-semibold">{contato.nome}</span>
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs opacity-60">
            Este conteúdo é educativo. Em uma emergência real, ligue e siga as orientações do
            serviço de atendimento.
          </p>
        </section>

        <div className="mt-6">
          <PraticaInterativa slug={tema.slug} cor={tema.color} temaNome={tema.nome} />
        </div>

        {/* Área de demonstração em vídeo da mini experiência do tema */}
        <DemonstracaoExperiencia tema={tema} />

        <section className="mt-16" aria-labelledby="outros-temas">
          <h2 id="outros-temas" className="text-2xl">
            Continue explorando
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {outros.map((outro) => (
              <li key={outro.slug}>
                <Link
                  to="/tema/$slug"
                  params={{ slug: outro.slug }}
                  className="block h-full rounded-3xl border-2 border-transparent bg-card p-6 shadow-[var(--sombra-suave)] transition-transform hover:-translate-y-1"
                  style={{ borderColor: `${outro.color}44` }}
                >
                  <span
                    className="inline-block h-3 w-10 rounded-full"
                    style={{ backgroundColor: outro.color }}
                  />
                  <span className="mt-3 block font-display text-lg font-extrabold">
                    {outro.nome}
                  </span>
                  <span className="mt-1 block text-sm text-[color:var(--muted-foreground)]">
                    {outro.resumo}
                  </span>
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
