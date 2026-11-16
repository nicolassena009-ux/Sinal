import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Check,
  Eye,
  Gamepad2,
  Lightbulb,
  Phone,
  PlayCircle,
  X,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { PraticaInterativa } from "@/components/PraticaInterativa";
import { DemonstracaoExperiencia } from "@/components/DemonstracaoExperiencia";
import { AudioNarration } from "@/components/AudioNarration";
import { SiteHeader } from "@/components/SiteHeader";
import { CinemaBackdrop, Eyebrow, GiantWord } from "@/components/cinema/Cinema";
import { useTeddy } from "@/components/TeddyMascote";
import { temaBySlug, temas, type Tema } from "@/data/temas";
import { vars } from "@/lib/motion";

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

/* ==========================================================================
 * Página de tema — narrativa editorial em capítulos.
 * Conteúdo e ordem originais preservados: O que é → Reconhecer → Fazer →
 * Não fazer → Pedir ajuda → Praticar → Vídeos → Outros temas.
 * ========================================================================== */

/** Arte cinematográfica de cada tema (gerada com o Teddy de referência). */
const HERO_IMG: Record<string, string> = {};

const CAPITULOS = [
  { id: "o-que-e", label: "O que é" },
  { id: "reconhecer", label: "Reconhecer" },
  { id: "agir", label: "O que fazer" },
  { id: "ajuda", label: "Pedir ajuda" },
  { id: "praticar", label: "Praticar" },
] as const;

function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** Parallax leve do hero (arte desce mais devagar que o texto). */
function useHeroParallax() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = Math.min(window.scrollY, window.innerHeight);
        if (ref.current)
          ref.current.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(${1.04 + y / 6000})`;
      });
    };
    window.addEventListener("scroll", on, { passive: true });
    on();
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

function Capitulo({
  id,
  numero,
  eyebrow,
  titulo,
  cor,
  children,
}: {
  id: string;
  numero: string;
  eyebrow: string;
  titulo: string;
  cor: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="scroll-mt-32 border-t border-white/10 py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <div className="md:sticky md:top-36 md:self-start">
          <span
            className="reveal-on-scroll block font-display text-[88px] font-extrabold leading-none tracking-tight sm:text-[128px] tema-numeral"
            style={vars({ "--c": cor })}
          >
            {numero}
          </span>
          <div className="reveal-on-scroll" style={vars({ "--reveal-delay": "80ms" })}>
            <Eyebrow color={cor}>{eyebrow}</Eyebrow>
            <h2
              id={`${id}-titulo`}
              className="mt-2 font-display text-4xl font-extrabold leading-tight text-[color:var(--lilas)] sm:text-5xl"
            >
              {titulo}
            </h2>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function ItemLista({
  i,
  children,
  icon,
  cor,
}: {
  i: number;
  children: ReactNode;
  icon: ReactNode;
  cor: string;
}) {
  return (
    <li
      className="reveal-on-scroll spotlight spotlight-light group flex gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.07] sm:p-6"
      style={vars({ "--reveal-delay": `${i * 70}ms` })}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundColor: `color-mix(in oklab, ${cor} 22%, transparent)`, color: cor }}
      >
        {icon}
      </span>
      <span className="pt-1.5 text-base leading-relaxed text-[color:var(--lilas)]/85 sm:text-lg">
        {children}
      </span>
    </li>
  );
}

function ProximoTema({ atual }: { atual: Tema }) {
  const idx = temas.findIndex((t) => t.slug === atual.slug);
  const prox = temas[(idx + 1) % temas.length];
  return (
    <Link
      to="/tema/$slug"
      params={{ slug: prox.slug }}
      className="spotlight spotlight-light group relative block overflow-hidden rounded-[32px] border border-white/10 bg-[#150e33] p-8 text-[color:var(--lilas)] sm:p-12"
    >
      <span
        aria-hidden="true"
        className="glow-orb -right-10 -top-10 h-72 w-72 opacity-40"
        style={{ backgroundColor: prox.color }}
      />
      <span className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <span>
          <Eyebrow color={prox.color}>
            Próximo tema · {String(((idx + 1) % temas.length) + 1).padStart(2, "0")} / 05
          </Eyebrow>
          <span className="mt-3 block font-display text-5xl font-extrabold leading-none tracking-tight transition-transform duration-500 group-hover:translate-x-2 sm:text-7xl">
            {prox.nome}
          </span>
          <span className="mt-3 block max-w-lg text-[color:var(--lilas)]/75">{prox.resumo}</span>
        </span>
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 transition-[background-color,transform] duration-500 group-hover:rotate-[-45deg] group-hover:bg-white group-hover:text-[color:var(--tinta)]">
          <ArrowRight className="h-8 w-8" aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}

function TemaPage() {
  const { tema } = Route.useLoaderData();
  const { setEstado, calar } = useTeddy();
  useEffect(() => {
    calar();
    setEstado("explicando");
    return () => {
      calar();
      setEstado("idle");
    };
  }, [tema.slug, setEstado, calar]);

  const parallaxRef = useHeroParallax();
  const ativo = useScrollSpy(CAPITULOS.map((c) => c.id));
  const idx = temas.findIndex((t) => t.slug === tema.slug);
  const arte = HERO_IMG[tema.slug] ?? tema.cardImage ?? tema.image;
  const temArte = !!HERO_IMG[tema.slug];
  const tamanhoPalavra =
    tema.title.length > 12 ? "clamp(70px, 11vw, 200px)" : "clamp(90px, 16vw, 280px)";

  const irPara = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="tema-cinema cinema-page relative bg-[#0d0922] text-[color:var(--lilas)]">
      <SiteHeader progress />

      {/* HERO */}
      <header className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 sm:items-center sm:pb-20">
        <CinemaBackdrop accent={tema.color} />
        <div
          ref={parallaxRef}
          className="absolute inset-0 will-change-transform"
          aria-hidden="true"
        >
          <img
            src={arte}
            alt=""
            fetchPriority="high"
            className={`tema-hero-art absolute inset-0 h-full w-full object-cover ${temArte ? "object-[70%_center]" : "object-center opacity-60"}`}
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,#0d0922_0%,rgba(13,9,34,0.85)_35%,rgba(13,9,34,0.2)_70%,transparent_100%)] max-md:bg-[linear-gradient(0deg,#0d0922_0%,rgba(13,9,34,0.9)_45%,rgba(13,9,34,0.3)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d0922] to-transparent"
        />
        <div
          aria-hidden="true"
          className="tema-giant pointer-events-none absolute -bottom-[0.2em] left-0 right-0 overflow-hidden whitespace-nowrap opacity-[0.09]"
        >
          <GiantWord style={{ fontSize: tamanhoPalavra }}>{tema.title}</GiantWord>
        </div>

        <div className="hero-stagger relative mx-auto w-full max-w-6xl px-5 sm:px-10">
          <div className="max-w-xl">
            <div style={vars({ "--i": 0 })}>
              <Eyebrow color={tema.color}>
                Tema {String(idx + 1).padStart(2, "0")} / 05 · Guia de primeiros socorros
              </Eyebrow>
            </div>
            <h1
              style={vars({ "--i": 1 })}
              data-long={tema.nome.length > 12 || undefined}
              className={`tema-hero-title mt-3 font-display font-extrabold leading-[0.92] tracking-tight ${tema.nome.length > 12 ? "text-5xl sm:text-6xl lg:text-7xl" : "text-6xl sm:text-8xl"}`}
            >
              {tema.nome}
            </h1>
            <p
              style={vars({ "--i": 2 })}
              className="mt-5 max-w-md text-lg leading-relaxed text-[color:var(--lilas)]/85 sm:text-xl"
            >
              {tema.resumo}
            </p>
            <div
              style={vars({ "--i": 3, "--foreground": "#f2f1ff", "--color-foreground": "#f2f1ff" })}
              className="mt-6 text-[color:var(--lilas)]"
            >
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
            <div style={vars({ "--i": 4 })} className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/jogos"
                search={{ tema: tema.slug }}
                className="btn-shine press group inline-flex min-h-12 items-center gap-2 rounded-full bg-[color:var(--amarelo)] px-6 font-display font-extrabold text-[color:var(--tinta)] shadow-[0_14px_40px_-14px_rgba(255,192,68,0.8)] hover:-translate-y-0.5"
              >
                <Gamepad2 className="h-4 w-4" aria-hidden="true" />
                Hora de praticar
              </Link>
              <a
                href={`#demonstracao-${tema.slug}`}
                onClick={irPara(`demonstracao-${tema.slug}`)}
                className="press group inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 font-display font-bold backdrop-blur-md hover:border-white/50 hover:bg-white/20"
              >
                <PlayCircle
                  className="h-4 w-4 text-[color:var(--amarelo)] transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
                {tema.videoSrc ? "Assistir ao vídeo" : "Visualizar demonstração"}
              </a>
            </div>
          </div>
        </div>

        <a
          href="#o-que-e"
          onClick={irPara("o-que-e")}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--lilas)]/60 transition-colors hover:text-[color:var(--lilas)] md:flex"
        >
          Começar a leitura <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
        </a>
      </header>

      {/* Navegação por capítulos (scrollspy) */}
      <nav
        aria-label="Capítulos do tema"
        className="sticky top-16 z-30 border-y border-white/10 bg-[#0d0922]/80 backdrop-blur-xl"
      >
        <ol className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 py-2.5 [scrollbar-width:none] sm:px-10">
          {CAPITULOS.map((c, i) => (
            <li key={c.id} className="shrink-0">
              <a
                href={`#${c.id}`}
                onClick={irPara(c.id)}
                aria-current={ativo === c.id ? "true" : undefined}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 font-display text-sm font-bold transition-colors ${
                  ativo === c.id
                    ? "bg-white text-[color:var(--tinta)]"
                    : "text-[color:var(--lilas)]/70 hover:bg-white/10 hover:text-[color:var(--lilas)]"
                }`}
              >
                <span className="text-xs opacity-60">{String(i + 1).padStart(2, "0")}</span>
                {c.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <main>
        <Capitulo id="o-que-e" numero="01" eyebrow="Entender" titulo="O que é?" cor={tema.color}>
          <ol className="space-y-3">
            {tema.oQueE.map((item, i) => (
              <ItemLista
                key={item}
                i={i}
                cor={tema.color}
                icon={<Lightbulb className="h-5 w-5" aria-hidden="true" />}
              >
                {item}
              </ItemLista>
            ))}
          </ol>
        </Capitulo>

        <Capitulo
          id="reconhecer"
          numero="02"
          eyebrow="Reconhecer"
          titulo="Como reconhecer?"
          cor={tema.color}
        >
          <ul className="grid gap-3 sm:grid-cols-2">
            {tema.reconhecer.map((item, i) => (
              <ItemLista
                key={item}
                i={i}
                cor={tema.color}
                icon={<Eye className="h-5 w-5" aria-hidden="true" />}
              >
                {item}
              </ItemLista>
            ))}
          </ul>
        </Capitulo>

        <Capitulo
          id="agir"
          numero="03"
          eyebrow="Agir"
          titulo="O que fazer — e o que não fazer"
          cor={tema.color}
        >
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-6">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--aqua)]/15 px-4 py-1.5 font-display text-sm font-extrabold text-[color:var(--aqua)]">
                <Check className="h-4 w-4" aria-hidden="true" /> Faça
              </p>
              <ol className="space-y-3">
                {tema.fazer.map((item, i) => (
                  <ItemLista
                    key={item}
                    i={i}
                    cor="var(--aqua)"
                    icon={<span className="font-display text-base font-extrabold">{i + 1}</span>}
                  >
                    {item}
                  </ItemLista>
                ))}
              </ol>
            </div>
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--rosa)]/15 px-4 py-1.5 font-display text-sm font-extrabold text-[color:var(--rosa)]">
                <X className="h-4 w-4" aria-hidden="true" /> Não faça
              </p>
              <ul className="space-y-3">
                {tema.naoFazer.map((item, i) => (
                  <ItemLista
                    key={item}
                    i={i}
                    cor="var(--rosa)"
                    icon={<X className="h-5 w-5" aria-hidden="true" />}
                  >
                    {item}
                  </ItemLista>
                ))}
              </ul>
            </div>
          </div>
        </Capitulo>

        <Capitulo
          id="ajuda"
          numero="04"
          eyebrow="Proteger"
          titulo="Quando pedir ajuda?"
          cor={tema.color}
        >
          <div className="reveal-on-scroll relative overflow-hidden rounded-[32px] border border-[color:var(--rosa)]/30 bg-[linear-gradient(135deg,rgba(255,96,167,0.14),rgba(109,63,195,0.1))] p-6 sm:p-9">
            <ul className="space-y-3">
              {tema.ajuda.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-base text-[color:var(--lilas)]/90 sm:text-lg"
                >
                  <AlertTriangle
                    className="mt-1 h-5 w-5 shrink-0 text-[color:var(--amarelo)]"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              {tema.contatos.map((contato) => (
                <a
                  key={contato.numero}
                  href={`tel:${contato.numero}`}
                  className="press group inline-flex items-center gap-4 rounded-2xl bg-white/10 py-3 pl-3 pr-6 transition-colors hover:bg-white/20"
                >
                  <span className="call-pulse flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--rosa)] text-white">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-display text-3xl font-extrabold leading-none text-[color:var(--lilas)]">
                      {contato.numero}
                    </span>
                    <span className="text-sm font-semibold opacity-75">{contato.nome}</span>
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-6 text-xs text-[color:var(--lilas)]/60">
              Este conteúdo é educativo. Em uma emergência real, ligue e siga as orientações do
              serviço de atendimento.
            </p>
          </div>
        </Capitulo>

        {/* Prática e vídeos: folha clara para os componentes interativos existentes */}
        <div
          id="praticar"
          className="relative scroll-mt-32 rounded-t-[40px] bg-[color:var(--background)] text-[color:var(--foreground)] sm:rounded-t-[56px]"
        >
          <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-10 sm:pt-24">
            <div className="reveal-on-scroll mb-10 max-w-2xl">
              <Eyebrow color="var(--roxo)">05 · Praticar</Eyebrow>
              <h2 className="mt-2 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
                Coloque em prática com o Teddy
              </h2>
            </div>
            <PraticaInterativa slug={tema.slug} cor={tema.color} temaNome={tema.nome} />
            <DemonstracaoExperiencia tema={tema} />
          </div>
        </div>

        <section aria-label="Continue explorando" className="bg-[color:var(--background)] pb-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-10">
            <ProximoTema atual={tema} />
            <ul className="mt-6 flex flex-wrap gap-2">
              {temas
                .filter((t) => t.slug !== tema.slug)
                .map((t) => (
                  <li key={t.slug}>
                    <Link
                      to="/tema/$slug"
                      params={{ slug: t.slug }}
                      className="press inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 font-display text-sm font-bold text-[color:var(--tinta)] transition-colors hover:border-[color:var(--roxo)]"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                      {t.nome}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
