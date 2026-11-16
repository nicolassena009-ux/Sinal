import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Footer } from "@/components/Footer";
import { AudioNarration } from "@/components/AudioNarration";
import { SiteHeader } from "@/components/SiteHeader";
import { CinemaHero, Eyebrow, corLegivel } from "@/components/cinema/Cinema";
import { vars } from "@/lib/motion";
import { METODO, temas } from "@/data/temas";
import { Sparkles, ArrowRight, Eye, Lightbulb, Hand, ShieldCheck } from "lucide-react";

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

const ICONES = [Eye, Lightbulb, Hand, ShieldCheck];
/** Posição de cada etapa na órbita (graus, começando no topo e girando no sentido horário). */
const ANGULOS = [-90, 0, 90, 180];

/**
 * As quatro etapas contadas pelo scroll: a seção fica presa na tela enquanto
 * a rolagem avança de etapa em etapa (palavra gigante, órbita e anel de progresso).
 */
function MetodoScroller() {
  const ref = useRef<HTMLElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const [step, setStep] = useState(0);
  const total = METODO.length;

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0;
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(1 - p);
      setStep(Math.min(total - 1, Math.floor(p * total)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [total]);

  const irPara = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / total) * range, behavior: "smooth" });
  };

  const etapa = METODO[step];
  const cor = corLegivel(etapa.cor);
  const Icone = ICONES[step];

  return (
    <section
      ref={ref}
      id="metodo"
      aria-labelledby="metodo-titulo"
      className="relative"
      style={{ height: `${total * 85 + 15}svh` }}
    >
      <h2 id="metodo-titulo" className="sr-only">
        As quatro etapas do método
      </h2>
      <ol className="sr-only">
        {METODO.map((m, i) => (
          <li key={m.titulo}>
            Etapa {i + 1}: {m.titulo}. {m.texto}
          </li>
        ))}
      </ol>

      <div aria-hidden="true" className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 transition-[background] duration-700"
          style={{
            background: `radial-gradient(60% 55% at 72% 50%, color-mix(in oklab, ${etapa.cor} 28%, transparent) 0%, transparent 70%)`,
          }}
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-5 pt-16 sm:px-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
          {/* Órbita */}
          <div className="relative mx-auto aspect-square w-[min(72vw,340px)] lg:order-2 lg:w-full lg:max-w-[460px]">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.6"
              />
              <circle
                ref={ringRef}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#metodo-grad)"
                strokeWidth="1.2"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                style={{ strokeDashoffset: 1 }}
              />
              <defs>
                <linearGradient id="metodo-grad" x1="0" y1="0" x2="1" y2="1">
                  {METODO.map((m, i) => (
                    <stop key={m.titulo} offset={i / (total - 1)} stopColor={corLegivel(m.cor)} />
                  ))}
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-[22%] flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md">
              <span
                key={step}
                className="home-metodo-text flex h-[46%] w-[46%] items-center justify-center rounded-full"
                style={{
                  backgroundColor: `color-mix(in oklab, ${etapa.cor} 22%, transparent)`,
                  color: cor,
                }}
              >
                <Icone className="h-1/2 w-1/2" strokeWidth={1.6} />
              </span>
            </div>
            {METODO.map((m, i) => {
              const a = (ANGULOS[i] * Math.PI) / 180;
              const ativo = i === step;
              const feito = i < step;
              return (
                <button
                  key={m.titulo}
                  type="button"
                  tabIndex={-1}
                  onClick={() => irPara(i)}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
                  style={{ left: `${50 + 40 * Math.cos(a)}%`, top: `${50 + 40 * Math.sin(a)}%` }}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full border font-display text-sm font-extrabold transition-all duration-500 sm:h-12 sm:w-12"
                    style={{
                      borderColor: ativo || feito ? corLegivel(m.cor) : "rgba(255,255,255,0.18)",
                      backgroundColor: ativo ? corLegivel(m.cor) : "#150e33",
                      color: ativo ? "#0d0922" : corLegivel(m.cor),
                      transform: ativo ? "scale(1.18)" : "scale(1)",
                      boxShadow: ativo
                        ? `0 0 0 8px color-mix(in oklab, ${m.cor} 20%, transparent)`
                        : "none",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Texto da etapa */}
          <div className="text-center lg:order-1 lg:text-left">
            <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-[color:var(--lilas)]/60">
              Etapa {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <p
              key={`w${step}`}
              className="home-metodo-word mt-2 font-display font-extrabold leading-[0.9] tracking-tight"
              style={{ color: cor }}
            >
              {etapa.titulo}
            </p>
            <p
              key={`t${step}`}
              className="home-metodo-text mx-auto mt-5 max-w-md text-lg leading-relaxed text-[color:var(--lilas)]/85 sm:text-xl lg:mx-0"
            >
              {etapa.texto}
            </p>
            <div className="mt-8 flex justify-center gap-2 lg:justify-start">
              {METODO.map((m, i) => (
                <span
                  key={m.titulo}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: i === step ? 40 : 14,
                    backgroundColor: i <= step ? corLegivel(m.cor) : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComoFunciona() {
  return (
    <div className="cinema-page relative bg-[#0d0922] text-[color:var(--lilas)]">
      <SiteHeader progress />

      <CinemaHero
        eyebrow="O método do Sinal"
        title={
          <>
            Como funciona
            <br />
            <span className="bg-[linear-gradient(90deg,var(--amarelo),var(--rosa),var(--aqua))] bg-clip-text text-transparent">
              o Sinal
            </span>
          </>
        }
        lead="Um caminho simples para transformar insegurança em atitude. Quatro etapas que se repetem em todos os temas."
        giant="Método"
        scrollTo="metodo"
        scrollLabel="Ver as 4 etapas"
        narration={
          <AudioNarration
            title="Ouvir as quatro etapas do método"
            text="O método do Sinal em quatro etapas fundamentais. Etapa 1: Reconhecer os sinais de perigo. Etapa 2: Entender a situação com clareza. Etapa 3: Agir com segurança, sem colocar ninguém em risco. Etapa 4: Proteger e saber quando ligar para o SAMU 192 ou Bombeiros 193."
          />
        }
        aside={
          <ol className="hidden gap-3 lg:grid">
            {METODO.map((m, i) => (
              <li
                key={m.titulo}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-md"
                style={vars({ "--i": 3 + i })}
              >
                <span
                  className="font-display text-3xl font-extrabold"
                  style={{ color: corLegivel(m.cor) }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-xl font-bold">{m.titulo}</span>
              </li>
            ))}
          </ol>
        }
      />

      <MetodoScroller />

      {/* Onde aplicar */}
      <section aria-labelledby="temas" className="relative border-t border-white/10 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-10">
          <div className="reveal-on-scroll max-w-2xl">
            <Eyebrow>Onde aplicar</Eyebrow>
            <h2
              id="temas"
              className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-6xl"
            >
              O mesmo método guia os cinco temas do Sinal.
            </h2>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {temas.map((tema, i) => (
              <li
                key={tema.slug}
                className={`reveal-on-scroll ${i === 0 ? "sm:col-span-2 lg:row-span-2" : ""} ${i === temas.length - 1 ? "lg:col-span-2" : ""}`}
                style={vars({ "--reveal-delay": `${(i % 3) * 80}ms` })}
              >
                <Link
                  to="/tema/$slug"
                  params={{ slug: tema.slug }}
                  className="spotlight spotlight-light tilt group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-3xl border border-white/10 bg-[#150e33] p-6"
                >
                  <img
                    src={tema.cardImage}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-55 transition-[transform,opacity] duration-700 group-hover:scale-105 group-hover:opacity-70"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, transparent 20%, color-mix(in oklab, ${tema.color} 30%, #0d0922) 75%, #0d0922 100%)`,
                    }}
                  />
                  <span
                    className="relative font-display text-xs font-bold uppercase tracking-[0.3em]"
                    style={{ color: tema.color }}
                  >
                    Tema {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`relative mt-2 font-display font-extrabold leading-tight ${i === 0 ? "text-4xl sm:text-5xl" : "text-2xl"}`}
                  >
                    {tema.nome}
                  </span>
                  <span className="relative mt-2 block max-w-md text-sm text-[color:var(--lilas)]/80">
                    {tema.resumo}
                  </span>
                  <span className="relative mt-4 inline-flex items-center gap-1 font-display text-sm font-bold opacity-80 transition-[opacity,gap] group-hover:gap-2 group-hover:opacity-100">
                    Abrir guia <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA para os jogos e simulação prática */}
      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-10">
          <div className="reveal-on-scroll spotlight relative overflow-hidden rounded-[2rem] bg-[image:var(--gradiente-sinal)] p-8 sm:p-14">
            <span
              aria-hidden="true"
              className="glow-orb -right-16 -top-16 h-72 w-72 bg-[color:var(--amarelo)] opacity-40"
            />
            <div className="relative grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
              <div>
                <span className="inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-[0.3em] text-[color:var(--amarelo)]">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Praticar o método
                </span>
                <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-5xl">
                  Coloque as 4 etapas em prática com o Teddy!
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-[color:var(--lilas)]/85">
                  Experimente nossas missões interativas com cenários para crianças e adolescentes.
                  Ganhe estrelas e desbloqueie seu certificado de conclusão.
                </p>
                <Link
                  to="/jogos"
                  className="press btn-shine group mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[color:var(--amarelo)] px-7 font-display font-extrabold text-[color:var(--tinta)] shadow-[0_14px_40px_-14px_rgba(255,192,68,0.8)] hover:-translate-y-0.5"
                >
                  Ir para os Jogos & Missões
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
              <img
                src="/teddy/3d/incentivando.webp"
                alt=""
                loading="lazy"
                className="teddy-poster-float mx-auto hidden w-48 drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)] md:block lg:w-60"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
