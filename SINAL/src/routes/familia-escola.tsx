import { createFileRoute, Link } from "@tanstack/react-router";
import { useId, useRef, useState } from "react";
import { Footer } from "@/components/Footer";
import { CinemaHero, Eyebrow } from "@/components/cinema/Cinema";
import { AudioNarration } from "@/components/AudioNarration";
import { SiteHeader } from "@/components/SiteHeader";
import { vars } from "@/lib/motion";
import {
  Users,
  GraduationCap,
  Stethoscope,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
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

const PILARES = [
  {
    Icone: HeartHandshake,
    cor: "#b99bff",
    titulo: "Converse antes",
    texto:
      "Não espere uma emergência acontecer para falar sobre segurança. Em momentos de tranquilidade, ensine a criança a identificar onde ficam os telefones, quem são os adultos de referência e o endereço da casa.",
  },
  {
    Icone: GraduationCap,
    cor: "#7fb6ff",
    titulo: "Use em sala de aula",
    texto:
      "As simulações interativas do Sinal são excelentes disparadores de debate para aulas de ciências, educação física e cidadania. Trabalhe tomada de decisão ética, calma em situações de estresse e cooperação.",
  },
  {
    Icone: ShieldCheck,
    cor: "#53c6b6",
    titulo: "Segurança em primeiro lugar",
    texto:
      "Reforce sempre a regra de ouro: a criança nunca deve se colocar em risco para salvar ninguém. Tocar em fios com choque, entrar na água funda ou segurar uma pessoa em convulsão são atos perigosos que devem ser evitados.",
  },
];

const CONVERSAS = [
  {
    id: "criancas",
    rotulo: "Crianças",
    faixa: "4–12 anos",
    emoji: "🧸",
    cor: "var(--amarelo)",
    perguntas: [
      "Se você vir alguém engasgado no lanche, qual é o primeiro adulto que você chamaria?",
      "Por que não devemos tocar em panelas no fogo ou tentar tirar coisas da tomada?",
      "Você sabe de cor o número do SAMU (192) e dos Bombeiros (193)?",
    ],
  },
  {
    id: "adolescentes",
    rotulo: "Adolescentes",
    faixa: "13–18 anos",
    emoji: "⚡",
    cor: "var(--aqua)",
    perguntas: [
      "O que fazer se um colega torcer o pé no treino ou desmaiar na aula?",
      "Quais são os sinais de que alguém precisa de socorro médico urgente e não apenas repouso?",
      "Como manter a calma e passar referências claras de endereço ao ligar para o 192?",
    ],
  },
] as const;

/** Conversas por idade em abas acessíveis (setas do teclado trocam de aba). */
function ConversasPorIdade() {
  const [aba, setAba] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const atual = CONVERSAS[aba];

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (aba + (e.key === "ArrowRight" ? 1 : -1) + CONVERSAS.length) % CONVERSAS.length;
    setAba(n);
    tabs.current[n]?.focus();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div>
        <Eyebrow>Guia de conversa</Eyebrow>
        <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-6xl">
          Sugestões práticas de conversa
        </h2>
        <p className="mt-4 max-w-md text-lg text-[color:var(--lilas)]/75">
          Perguntas abertas para estimular o raciocínio sem gerar ansiedade:
        </p>
        <div
          role="tablist"
          aria-label="Faixa etária"
          className="mt-8 inline-flex rounded-full border border-white/15 bg-white/5 p-1.5"
          onKeyDown={onKey}
        >
          {CONVERSAS.map((c, i) => (
            <button
              key={c.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${c.id}`}
              aria-selected={aba === i}
              aria-controls={`${base}-painel`}
              tabIndex={aba === i ? 0 : -1}
              onClick={() => setAba(i)}
              className={`press min-h-11 rounded-full px-5 font-display text-sm font-bold transition-colors ${
                aba === i
                  ? "bg-[color:var(--lilas)] text-[color:var(--tinta)]"
                  : "text-[color:var(--lilas)]/75 hover:text-[color:var(--lilas)]"
              }`}
            >
              <span aria-hidden="true">{c.emoji}</span> {c.rotulo}{" "}
              <span className="opacity-60">({c.faixa})</span>
            </button>
          ))}
        </div>
      </div>

      <div
        id={`${base}-painel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${atual.id}`}
        className="relative rounded-[2rem] border border-white/10 bg-[#150e33] p-5 sm:p-8"
      >
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <img src="/teddy/teddy-3d-poster.webp" alt="" className="h-12 w-10 object-contain" />
          <div>
            <p className="font-display font-extrabold">Teddy</p>
            <p className="text-xs text-[color:var(--aqua)]">
              conversando com {atual.rotulo.toLowerCase()}
            </p>
          </div>
        </div>
        <ul key={atual.id} className="mt-6 space-y-4">
          {atual.perguntas.map((q, i) => (
            <li
              key={q}
              className="conversa-bolha max-w-[92%] rounded-3xl rounded-tl-md border border-white/10 bg-white/[0.06] px-5 py-4 text-lg leading-relaxed odd:ml-0 even:ml-auto even:rounded-tl-3xl even:rounded-tr-md"
              style={{ animationDelay: `${i * 160}ms`, borderLeft: `3px solid ${atual.cor}` }}
            >
              “{q}”
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FamiliaEscolaPage() {
  const narrationText =
    "Orientações para Família e Escola. Ensinar primeiros socorros não significa sobrecarregar crianças com responsabilidades de adultos. O foco do Sinal é a percepção precoce de perigos, a proteção individual e a rápida comunicação com quem pode agir.";

  return (
    <div className="cinema-page relative bg-[#0d0922] text-[color:var(--lilas)]">
      <SiteHeader subtitle="Família & Escola" progress />

      <CinemaHero
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <Users className="h-3.5 w-3.5" aria-hidden="true" /> Diálogo que protege
          </span>
        }
        title={
          <>
            Preparar{" "}
            <span className="bg-[linear-gradient(90deg,var(--amarelo),var(--rosa))] bg-clip-text text-transparent">
              sem assustar
            </span>
            : primeiros socorros em casa e na escola.
          </>
        }
        lead="Aprender a reconhecer emergências desenvolve autonomia, empatia e cuidado com o outro. Veja como integrar a experiência do Sinal na rotina pedagógica e familiar."
        giant="Família"
        accent="#53c6b6"
        scrollTo="pilares"
        scrollLabel="Ver orientações"
        narration={
          <AudioNarration title="Se preferir, escute as orientações" text={narrationText} />
        }
        aside={
          <div aria-hidden="true" className="relative mx-auto hidden max-w-sm lg:block">
            <span className="home-teddy-halo" />
            <img
              src="/teddy/teddy-3d-poster.webp"
              alt=""
              className="teddy-poster-float relative w-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)]"
            />
          </div>
        }
      />

      {/* Pilares */}
      <section
        id="pilares"
        aria-labelledby="pilares-titulo"
        className="relative scroll-mt-20 border-t border-white/10 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-10">
          <div className="reveal-on-scroll max-w-2xl">
            <Eyebrow>Orientações pedagógicas</Eyebrow>
            <h2
              id="pilares-titulo"
              className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-6xl"
            >
              Como abordar cada etapa
            </h2>
          </div>
          <ol className="mt-14 space-y-5">
            {PILARES.map(({ Icone, cor, titulo, texto }, i) => (
              <li
                key={titulo}
                className="reveal-on-scroll"
                style={vars({ "--reveal-delay": `${i * 90}ms` })}
              >
                <div className="spotlight spotlight-light group grid items-center gap-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.05] sm:p-10 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.4fr)] md:gap-10">
                  <span
                    className="tema-numeral font-display text-7xl font-extrabold leading-none sm:text-8xl"
                    style={vars({ "--c": cor })}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-4">
                    <span
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                      style={{
                        backgroundColor: `color-mix(in oklab, ${cor} 18%, transparent)`,
                        color: cor,
                      }}
                    >
                      <Icone className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-2xl font-extrabold sm:text-3xl">{titulo}</h3>
                  </div>
                  <p className="text-[color:var(--lilas)]/75 leading-relaxed sm:text-lg">{texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Conversa por idade */}
      <section
        aria-label="Sugestões práticas de conversa"
        className="relative border-t border-white/10 py-24 sm:py-32"
      >
        <div className="reveal-on-scroll mx-auto max-w-6xl px-5 sm:px-10">
          <ConversasPorIdade />
        </div>
      </section>

      {/* Validação clínica & contexto acadêmico */}
      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-10">
          <div className="reveal-on-scroll spotlight relative overflow-hidden rounded-[2rem] bg-[image:var(--gradiente-sinal)] p-8 sm:p-14">
            <span
              aria-hidden="true"
              className="glow-orb -right-20 -top-20 h-72 w-72 bg-[color:var(--rosa)] opacity-40"
            />
            <div className="relative max-w-3xl">
              <span className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.3em] text-[color:var(--amarelo)]">
                <Stethoscope className="h-4 w-4" aria-hidden="true" /> Validação de saúde
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-5xl">
                Contexto Acadêmico & Validação de Saúde
              </h2>
              <p className="mt-5 leading-relaxed text-[color:var(--lilas)]/85 sm:text-lg">
                O <strong>Sinal</strong> é um projeto digital interdisciplinar concebido na
                intersecção entre <em>Educação</em>, <em>Design de Interação</em> e{" "}
                <em>Ciências da Saúde</em>. Todo o material clínico relativo aos procedimentos de
                primeiros socorros é baseado nas diretrizes do Ministério da Saúde e do SAMU,
                sujeito à revisão e validação contínua da equipe de{" "}
                <strong>Enfermagem e Medicina de Emergência</strong>.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/jogos"
                  className="press btn-shine group inline-flex min-h-12 items-center gap-2 rounded-full bg-[color:var(--amarelo)] px-6 font-display font-extrabold text-[color:var(--tinta)] hover:-translate-y-0.5"
                >
                  Explorar missões práticas
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  to="/como-funciona"
                  className="press inline-flex min-h-12 items-center rounded-full border border-white/30 px-6 font-display font-bold hover:bg-white/10"
                >
                  Entender o método do Sinal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
