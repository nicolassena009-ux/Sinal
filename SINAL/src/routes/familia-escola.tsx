import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { AudioNarration } from "@/components/AudioNarration";
import { HighContrastToggle } from "@/components/HighContrastToggle";
import {
  Users,
  GraduationCap,
  Stethoscope,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";

export const Route = createFileRoute("/familia-escola")({
  head: () => ({
    meta: [
      { title: "Família & Escola — Educação em Primeiros Socorros | Sinal" },
      {
        name: "description",
        content:
          "Orientações para pais, responsáveis e educadores: como ensinar crianças e adolescentes a reconhecer riscos e buscar ajuda sem gerar pânico.",
      },
      { property: "og:title", content: "Família & Escola — Sinal" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content:
          "Como transformar prevenção e primeiros socorros em diálogo contínuo em casa e na sala de aula.",
      },
    ],
  }),
  component: FamiliaEscolaPage,
});

function FamiliaEscolaPage() {
  const narrationText =
    "Orientações para Família e Escola. Ensinar primeiros socorros não significa sobrecarregar crianças com responsabilidades de adultos. O foco do Sinal é a percepção precoce de perigos, a proteção individual e a rápida comunicação com quem pode agir.";

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      {/* Header */}
      <header className="border-b border-border/80 bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
          <Link
            to="/"
            className="font-display text-xl font-extrabold tracking-tight text-[color:var(--roxo)] transition-opacity hover:opacity-75 sm:text-2xl"
          >
            Sinal
            <span className="ml-2 hidden text-xs font-semibold text-muted-foreground sm:inline">
              Família & Escola
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4 font-display text-xs font-semibold sm:text-sm">
            <Link
              to="/temas"
              className="rounded-full px-3 py-1.5 transition-colors hover:bg-muted"
            >
              Temas
            </Link>
            <Link
              to="/como-funciona"
              className="rounded-full px-3 py-1.5 transition-colors hover:bg-muted"
            >
              Como funciona
            </Link>
            <Link
              to="/jogos"
              className="rounded-full px-3 py-1.5 transition-colors hover:bg-muted"
            >
              Jogos & Missões
            </Link>
            <Link
              to="/emergencia"
              className="rounded-full bg-[color:var(--rosa)] px-3.5 py-1.5 text-white transition-transform hover:scale-105"
            >
              Emergência
            </Link>
            <HighContrastToggle />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10">
        {/* Hero */}
        <div className="rounded-3xl bg-[image:var(--gradiente-sinal)] p-8 sm:p-14 text-[color:var(--lilas)] shadow-[var(--sombra-forte)]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
            <Users className="h-3.5 w-3.5 text-[color:var(--amarelo)]" />
            Diálogo que protege
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl font-extrabold leading-tight max-w-3xl">
            Preparar sem assustar: primeiros socorros em casa e na escola.
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg opacity-90 leading-relaxed">
            Aprender a reconhecer emergências desenvolve autonomia, empatia e cuidado com o
            outro. Veja como integrar a experiência do Sinal na rotina pedagógica e familiar.
          </p>

          <div className="mt-7">
            <AudioNarration
              title="Se preferir, escute as orientações"
              text={narrationText}
            />
          </div>
        </div>

        {/* Pilares para Família e Educadores */}
        <section className="mt-14" aria-labelledby="pilares-titulo">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--roxo)]">
                Orientações Pedagógicas
              </p>
              <h2 id="pilares-titulo" className="mt-1 font-display text-3xl font-extrabold">
                Como abordar cada etapa
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-7 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--roxo)]/15 text-[color:var(--roxo)]">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-extrabold">Converse antes</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Não espere uma emergência acontecer para falar sobre segurança. Em momentos de
                tranquilidade, ensine a criança a identificar onde ficam os telefones, quem são
                os adultos de referência e o endereço da casa.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-7 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--azul)]/15 text-[color:var(--azul)]">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-extrabold">Use em sala de aula</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                As simulações interativas do Sinal são excelentes disparadores de debate para aulas
                de ciências, educação física e cidadania. Trabalhe tomada de decisão ética, calma
                em situações de estresse e cooperação.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-7 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--aqua)]/15 text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-extrabold">Segurança em primeiro lugar</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Reforce sempre a regra de ouro: a criança nunca deve se colocar em risco para
                salvar ninguém. Tocar em fios com choque, entrar na água funda ou segurar uma
                pessoa em convulsão são atos perigosos que devem ser evitados.
              </p>
            </div>
          </div>
        </section>

        {/* Guia Prático de Conversa por Idade */}
        <section className="mt-14 rounded-3xl border border-border bg-muted/30 p-8 sm:p-12">
          <h2 className="font-display text-3xl font-extrabold">
            Sugestões práticas de conversa
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Perguntas abertas para estimular o raciocínio sem gerar ansiedade:
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-[color:var(--roxo)]">
                🧸 Para Crianças (4–12 anos)
              </span>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-[color:var(--roxo)] font-bold">•</span>
                  "Se você vir alguém engasgado no lanche, qual é o primeiro adulto que você chamaria?"
                </li>
                <li className="flex gap-2">
                  <span className="text-[color:var(--roxo)] font-bold">•</span>
                  "Por que não devemos tocar em panelas no fogo ou tentar tirar coisas da tomada?"
                </li>
                <li className="flex gap-2">
                  <span className="text-[color:var(--roxo)] font-bold">•</span>
                  "Você sabe de cor o número do SAMU (192) e dos Bombeiros (193)?"
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-[color:var(--azul)]">
                ⚡ Para Adolescentes (13–18 anos)
              </span>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-[color:var(--azul)] font-bold">•</span>
                  "O que fazer se um colega torcer o pé no treino ou desmaiar na aula?"
                </li>
                <li className="flex gap-2">
                  <span className="text-[color:var(--azul)] font-bold">•</span>
                  "Quais são os sinais de que alguém precisa de socorro médico urgente e não apenas repouso?"
                </li>
                <li className="flex gap-2">
                  <span className="text-[color:var(--azul)] font-bold">•</span>
                  "Como manter a calma e passar referências claras de endereço ao ligar para o 192?"
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Validação Clínica & Contexto Acadêmico */}
        <section className="mt-14 rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-xs">
          <div className="flex items-center gap-3">
            <Stethoscope className="h-6 w-6 text-[color:var(--rosa)]" />
            <h2 className="font-display text-2xl font-extrabold">
              Contexto Acadêmico & Validação de Saúde
            </h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            O <strong>Sinal</strong> é um projeto digital interdisciplinar concebido na intersecção
            entre <em>Educação</em>, <em>Design de Interação</em> e <em>Ciências da Saúde</em>. Todo
            o material clínico relativo aos procedimentos de primeiros socorros é baseado nas
            diretrizes do Ministério da Saúde e do SAMU, sujeito à revisão e validação contínua da
            equipe de <strong>Enfermagem e Medicina de Emergência</strong>.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="/jogos"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[color:var(--roxo)] px-6 py-2.5 font-display text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
            >
              Explorar missões práticas
            </Link>
            <Link
              to="/como-funciona"
              className="inline-flex min-h-11 items-center rounded-full border border-border px-5 py-2.5 font-display text-sm font-semibold hover:bg-muted"
            >
              Entender o método do Sinal
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
