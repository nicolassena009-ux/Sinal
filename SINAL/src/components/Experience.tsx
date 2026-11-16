import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, Gamepad2, Headphones, Phone, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { type TeddyEstado } from "@/components/Teddy";
import { SafeTeddy } from "@/components/cinema/SafeTeddy";
import { ParticleField } from "@/components/home/ParticleField";
import { GiantWord } from "@/components/cinema/Cinema";
import { METODO, temas } from "@/data/temas";
import { vars } from "@/lib/motion";

/* ==========================================================================
 * Home do Sinal: narrativa guiada pelo scroll.
 * Capítulos: 01 Sinal (hero) · 02 Situações (temas orbitando o Teddy) · 03 Método.
 * Um único palco "sticky" é animado por um progresso 0..1 suavizado (lerp),
 * aplicado direto nos estilos via refs: nenhum re-render por frame.
 * ========================================================================== */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** Tons claros do método para leitura sobre o fundo escuro. */
const COR_LEGIVEL: Record<string, string> = {
  "#2E7DD1": "#7fb6ff",
  "#6D3FC3": "#b99bff",
  "#FFC044": "#ffc044",
  "#53C6B6": "#6fe0cf",
};
const ESTADO_METODO: TeddyEstado[] = ["pensando", "explicando", "incentivando", "comemorando"];

/** Posições dos cards ao redor do Teddy (desktop): x em unidades do raio, y em fração da altura. */
const ORBITA = [
  { x: -1, y: -0.17 },
  { x: 1, y: -0.24 },
  { x: -1, y: 0.15 },
  { x: 1.04, y: 0.05 },
  { x: 1, y: 0.33 },
];

const DESTAQUES = [
  { icon: BookOpen, label: "5 temas guiados" },
  { icon: Gamepad2, label: "Missões jogáveis" },
  { icon: Headphones, label: "Narração em áudio" },
];

function useViewport() {
  const [vp, setVp] = useState(() => ({
    w: typeof window === "undefined" ? 1440 : window.innerWidth,
    h: typeof window === "undefined" ? 900 : window.innerHeight,
  }));
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVp({ w: window.innerWidth, h: window.innerHeight }));
    };
    window.addEventListener("resize", on, { passive: true });
    return () => {
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return vp;
}

/* ------------------------------ Peças ------------------------------ */

function HeroCopy() {
  return (
    <>
      <p className="font-display text-lg font-bold text-[color:var(--amarelo)] sm:text-2xl">
        Reconhecer também é proteger
      </p>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[color:var(--lilas)]/80 sm:text-base">
        Aprenda a reconhecer situações de emergência, entenda o que fazer e descubra como agir
        quando cada segundo importa.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/temas"
          className="btn-shine press group inline-flex min-h-12 items-center gap-2 rounded-full bg-[color:var(--amarelo)] px-7 font-display font-bold text-[color:var(--tinta)] shadow-[0_14px_40px_-14px_rgba(255,192,68,0.8)] hover:-translate-y-0.5"
        >
          Explorar os Temas
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
        <Link
          to="/jogos"
          className="btn-shine press inline-flex min-h-12 items-center gap-2 rounded-full bg-[color:var(--rosa)] px-6 font-display font-bold text-white shadow-[0_14px_40px_-14px_rgba(255,96,167,0.8)] hover:-translate-y-0.5"
        >
          <Gamepad2 className="h-4 w-4" aria-hidden="true" />
          Praticar com o Teddy
        </Link>
      </div>
      <ul
        aria-label="Destaques do Sinal"
        className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs font-semibold text-[color:var(--lilas)]/70 sm:text-sm"
      >
        {DESTAQUES.map(({ icon: Icon, label }) => (
          <li key={label} className="inline-flex items-center gap-1.5">
            <Icon className="h-4 w-4 text-[color:var(--amarelo)]" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </>
  );
}

function TemaCard({ tema, compact = false }: { tema: (typeof temas)[number]; compact?: boolean }) {
  return (
    <Link
      to="/tema/$slug"
      params={{ slug: tema.slug }}
      className={`home-tema-card spotlight spotlight-light group flex items-center gap-3 rounded-3xl border border-white/12 bg-white/[0.07] p-2.5 pr-4 text-left text-[color:var(--lilas)] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-colors hover:border-white/30 hover:bg-white/[0.12] ${
        compact ? "w-full" : "w-[290px]"
      }`}
    >
      <img
        src={tema.cardImage}
        alt=""
        width={84}
        height={64}
        loading="lazy"
        className="h-16 w-[84px] shrink-0 rounded-2xl object-cover ring-1 ring-white/15"
      />
      <span className="min-w-0">
        <span className="flex items-center gap-2 font-display text-base font-extrabold leading-tight">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: tema.color }} />
          {tema.title}
        </span>
        <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-[color:var(--lilas)]/70">
          {tema.resumo}
        </span>
      </span>
      <ArrowRight
        className="ml-auto h-4 w-4 shrink-0 opacity-50 transition-[opacity,transform] group-hover:translate-x-0.5 group-hover:opacity-100"
        aria-hidden="true"
      />
    </Link>
  );
}

function ScrollHint() {
  return (
    <div className="home-scroll-hint flex flex-col items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[color:var(--lilas)]/60">
      <span className="relative block h-9 w-[22px] rounded-full border-2 border-current">
        <span className="absolute left-1/2 top-1.5 h-2 w-1 -translate-x-1/2 rounded-full bg-[color:var(--amarelo)]" />
      </span>
      Role para descobrir
    </div>
  );
}

/* --------------------------- Narrativa animada --------------------------- */

function ScrollStory() {
  const { w, h } = useViewport();
  const mobile = w < 768;
  const teddySize = Math.round(mobile ? Math.min(h * 0.4, 290) : Math.min(h * 0.5, 470));
  const radius = Math.min(w * 0.31, teddySize * 0.5 + 250);

  const wrapRef = useRef<HTMLDivElement>(null);
  const heroWordRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const teddyRef = useRef<HTMLDivElement>(null);
  const temasHeadRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metodoRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const [chapter, setChapter] = useState(0);
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let raf = 0;
    let cur = 0;
    let first = true;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const wrap = wrapRef.current;
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (r.bottom < -50 || r.top > window.innerHeight + 50) return; // fora da tela
      const target = clamp01(-r.top / (span || 1));
      cur = first ? target : cur + (target - cur) * 0.14;
      first = false;
      if (Math.abs(target - cur) < 0.0002) cur = target;
      const p = cur;

      // 01 · Hero sai de cena
      const out = ease(seg(p, 0.02, 0.16));
      if (heroWordRef.current) {
        const s = heroWordRef.current.style;
        s.opacity = String(1 - out);
        s.transform = `translate3d(-50%, calc(-50% - ${out * 10}vh), 0) scale(${1 + out * 0.45})`;
        s.filter = out > 0.01 ? `blur(${out * 14}px)` : "none";
      }
      if (heroCopyRef.current) {
        const s = heroCopyRef.current.style;
        const o = clamp01(1 - out * 1.8);
        s.opacity = String(o);
        s.transform = `translate3d(0, ${-out * 50}px, 0)`;
        heroCopyRef.current.inert = o < 0.4;
      }

      // 02 · Situações
      const tIn = ease(seg(p, 0.15, 0.22));
      const tOut = ease(seg(p, 0.66, 0.71));
      if (temasHeadRef.current) {
        const s = temasHeadRef.current.style;
        s.opacity = String(tIn * (1 - tOut));
        s.transform = `translate3d(-50%, ${(1 - tIn) * 30 - tOut * 30}px, 0)`;
      }
      const act = Math.min(4, Math.max(0, Math.floor((p - 0.19) / 0.095)));
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const s = el.style;
        if (mobile) {
          const vis = (act === i ? 1 : 0) * tIn * (1 - tOut);
          s.opacity = String(vis);
          s.transform = `translate3d(-50%, ${act === i ? 0 : act > i ? -24 : 24}px, 0) scale(${0.96 + vis * 0.04})`;
          el.inert = vis < 0.5;
        } else {
          const t = ease(seg(p, 0.2 + i * 0.085, 0.27 + i * 0.085));
          const vis = t * (1 - tOut);
          const o = ORBITA[i];
          const dx = -o.x * radius * (1 - t) * 0.85 - o.x * tOut * 120;
          const dy = -o.y * h * (1 - t) * 0.6;
          s.opacity = String(vis);
          s.transform = `translate3d(calc(-50% + ${dx}px), calc(-50% + ${dy}px), 0) scale(${0.55 + 0.45 * t - tOut * 0.1})`;
          el.inert = vis < 0.5;
        }
      });

      // 03 · Método
      const mIn = ease(seg(p, 0.7, 0.76));
      if (metodoRef.current) {
        const s = metodoRef.current.style;
        s.opacity = String(mIn);
        s.transform = `translate3d(${mobile ? 0 : (1 - mIn) * -60}px, ${mobile ? (1 - mIn) * 40 : 0}px, 0)`;
        metodoRef.current.inert = mIn < 0.5;
      }
      const st = Math.min(3, Math.max(0, Math.floor((p - 0.74) / 0.06)));

      // Teddy: protagonista que atravessa os capítulos
      if (teddyRef.current) {
        const enter = ease(seg(p, 0, 0.16));
        const x = mobile ? 0 : mIn * w * 0.2;
        // No hero o Teddy sobe para abrir espaço ao texto; depois centraliza.
        const y = mobile
          ? -(1 - enter) * h * 0.115 - enter * h * 0.04 - mIn * h * 0.14
          : -(1 - enter) * h * 0.1 - enter * h * 0.01;
        const sc =
          (mobile ? 0.86 + enter * 0.1 : 0.92 - enter * 0.06) * (1 - mIn * (mobile ? 0.22 : 0.02));
        teddyRef.current.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${sc})`;
      }
      if (railRef.current) railRef.current.style.transform = `scaleY(${p})`;

      const ch = p < 0.15 ? 0 : p < 0.7 ? 1 : 2;
      setChapter(ch);
      setActive(act);
      setStep(st);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [mobile, radius, w, h]);

  const estado: TeddyEstado =
    chapter === 0 ? "acenando" : chapter === 1 ? "explicando" : ESTADO_METODO[step];
  const etapa = METODO[step];
  const cor = COR_LEGIVEL[etapa.cor] ?? etapa.cor;
  const capitulos = ["Sinal", "Situações", "Método"];

  return (
    <div ref={wrapRef} className="relative" style={{ height: mobile ? "620svh" : "600vh" }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Atmosfera */}
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_0%,#2a1a63_0%,#150e33_55%,#0d0922_100%)]" />
          <span className="glow-orb left-[8%] top-[18%] h-80 w-80 bg-[color:var(--roxo)] opacity-60" />
          <span className="glow-orb right-[6%] top-[38%] h-72 w-72 bg-[color:var(--azul)] opacity-40 [animation-delay:-6s]" />
          <span className="glow-orb bottom-[-10%] left-[35%] h-96 w-96 bg-[color:var(--rosa)] opacity-20 [animation-delay:-11s]" />
          <ParticleField className="absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(13,9,34,0.7)_100%)]" />
        </div>

        {/* 01 · Palavra gigante atrás do Teddy */}
        <div
          ref={heroWordRef}
          className="absolute left-1/2 top-[36%] will-change-transform md:top-[38%]"
          style={{ transform: "translate3d(-50%, -50%, 0)" }}
        >
          <GiantWord>SINAL</GiantWord>
        </div>
        <h1 className="sr-only">Sinal — Reconhecer também é proteger</h1>

        {/* 03 · Método (atrás do Teddy no celular, à esquerda no desktop) */}
        <div
          ref={metodoRef}
          className="absolute inset-x-5 bottom-[7svh] opacity-0 md:inset-x-auto md:bottom-auto md:left-[7vw] md:top-1/2 md:w-[50vw] md:max-w-[700px] md:-translate-y-1/2"
          aria-live="polite"
        >
          <p className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-[0.3em] text-[color:var(--lilas)]/60">
            <Sparkles className="h-4 w-4 text-[color:var(--amarelo)]" aria-hidden="true" />O método
            Sinal · {String(step + 1).padStart(2, "0")} / 04
          </p>
          <h2
            key={etapa.titulo}
            className="home-metodo-word mt-2 font-display font-extrabold leading-[0.9] tracking-tight"
            style={{ color: cor }}
          >
            {etapa.titulo}
          </h2>
          <p
            key={`t-${step}`}
            className="home-metodo-text mt-3 max-w-md text-base text-[color:var(--lilas)]/85 sm:text-lg"
          >
            {etapa.texto}
          </p>
          <ol className="mt-6 flex gap-2" aria-label="Etapas do método">
            {METODO.map((m, i) => (
              <li key={m.titulo} className="flex-1">
                <span
                  className="block h-1.5 rounded-full transition-[background-color,opacity] duration-500"
                  style={{
                    backgroundColor:
                      i <= step ? (COR_LEGIVEL[m.cor] ?? m.cor) : "rgba(255,255,255,0.15)",
                  }}
                />
                <span
                  className={`mt-2 block font-display text-[11px] font-bold uppercase tracking-wider transition-opacity sm:text-xs ${
                    i === step ? "opacity-100" : "opacity-45"
                  }`}
                >
                  {m.titulo}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Teddy 3D: protagonista */}
        <div
          ref={teddyRef}
          className="absolute left-1/2 top-[50%] will-change-transform md:top-[52%]"
          style={{ transform: "translate3d(-50%, -50%, 0)" }}
        >
          <div className="home-teddy-halo" aria-hidden="true" />
          <SafeTeddy estado={estado} tamanho={teddySize} />
        </div>

        {/* 01 · Texto do hero */}
        <div
          ref={heroCopyRef}
          className="absolute inset-x-0 bottom-[5svh] z-10 px-5 text-center md:bottom-[6vh]"
        >
          <HeroCopy />
          <div className="mt-6 hidden justify-center md:flex">
            <ScrollHint />
          </div>
        </div>

        {/* 02 · Situações */}
        <div
          ref={temasHeadRef}
          className="absolute left-1/2 top-[11svh] w-[min(92vw,720px)] text-center opacity-0 md:top-[13vh]"
        >
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-[color:var(--amarelo)]">
            Cinco situações
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-[color:var(--lilas)] sm:text-5xl">
            Saber agir começa por <span className="text-[color:var(--amarelo)]">reconhecer</span>.
          </h2>
        </div>
        {temas.map((tema, i) => (
          <div
            key={tema.slug}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute opacity-0 will-change-transform"
            style={
              mobile
                ? { left: "50%", bottom: "6svh", width: "min(92vw, 420px)" }
                : {
                    left: `calc(50% + ${ORBITA[i].x * radius}px)`,
                    top: `calc(52% + ${ORBITA[i].y * 100}%)`,
                  }
            }
          >
            <TemaCard tema={tema} compact={mobile} />
          </div>
        ))}
        {mobile && chapter === 1 && (
          <div
            className="absolute inset-x-0 bottom-[2.2svh] flex justify-center gap-1.5"
            aria-hidden="true"
          >
            {temas.map((t, i) => (
              <span
                key={t.slug}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 18 : 6,
                  backgroundColor: i === active ? t.color : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>
        )}

        {/* Indicador de capítulos */}
        <div
          className="absolute bottom-8 left-6 hidden items-end gap-4 md:flex lg:left-10"
          aria-hidden="true"
        >
          <div className="relative h-24 w-[2px] overflow-hidden rounded-full bg-white/15">
            <div
              ref={railRef}
              className="absolute inset-0 origin-top bg-[color:var(--amarelo)]"
              style={{ transform: "scaleY(0)" }}
            />
          </div>
          <div className="font-display">
            <p className="text-3xl font-extrabold leading-none text-[color:var(--lilas)]">
              {String(chapter + 1).padStart(2, "0")}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--lilas)]/60">
              {capitulos[chapter]}
            </p>
          </div>
        </div>
        <p className="absolute bottom-8 right-6 hidden max-w-[220px] text-right text-[11px] leading-snug text-[color:var(--lilas)]/55 lg:right-10 lg:block">
          Conteúdo educativo. Em emergências reais, acione o SAMU (192) ou Bombeiros (193).
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ Fechamento ------------------------------ */

const CAMINHOS = [
  {
    to: "/temas" as const,
    titulo: "Galeria 3D dos temas",
    texto: "Arraste pelos cinco guias e abra o que quiser estudar.",
    img: "/teddy/teddy-wave.webp",
    cor: "var(--amarelo)",
  },
  {
    to: "/jogos" as const,
    titulo: "Jogos & Missões",
    texto: "Pratique em cenários interativos, no seu ritmo.",
    img: "/teddy/teddy-thumbs.webp",
    cor: "var(--rosa)",
  },
  {
    to: "/familia-escola" as const,
    titulo: "Família & Escola",
    texto: "Como conversar sobre segurança sem assustar.",
    img: "/teddy/teddy-tres-quartos.webp",
    cor: "var(--aqua)",
  },
];

function Fechamento() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-24 sm:px-10" aria-labelledby="comecar">
      <p className="reveal-on-scroll font-display text-xs font-bold uppercase tracking-[0.3em] text-[color:var(--amarelo)]">
        Por onde começar
      </p>
      <h2
        id="comecar"
        className="reveal-on-scroll mt-2 max-w-2xl font-display text-4xl font-extrabold leading-tight text-[color:var(--lilas)] sm:text-6xl"
        style={vars({ "--reveal-delay": "80ms" })}
      >
        Pronto para fazer a diferença?
      </h2>
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {CAMINHOS.map((c, i) => (
          <li
            key={c.to}
            className="reveal-on-scroll"
            style={vars({ "--reveal-delay": `${120 + i * 90}ms` })}
          >
            <Link
              to={c.to}
              className="spotlight tilt group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] text-[color:var(--lilas)] transition-[border-color,background-color] hover:border-white/25 hover:bg-white/[0.07]"
              style={vars({ "--spot": "rgba(255,255,255,0.12)" })}
            >
              <span className="relative block aspect-[16/10] overflow-hidden bg-[#ecebf3] md:aspect-[4/3]">
                <img
                  src={c.img}
                  alt=""
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span
                  className="absolute inset-x-0 bottom-0 h-1.5"
                  style={{ backgroundColor: c.cor }}
                />
              </span>
              <span className="flex flex-1 flex-col p-6">
                <span className="font-display text-2xl font-extrabold">{c.titulo}</span>
                <span className="mt-1 text-sm opacity-75">{c.texto}</span>
                <span
                  className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-bold transition-[gap] group-hover:gap-2.5"
                  style={{ color: c.cor }}
                >
                  Começar <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="reveal-on-scroll mt-16 flex flex-col items-start justify-between gap-6 rounded-[28px] border border-[color:var(--rosa)]/30 bg-[linear-gradient(120deg,rgba(255,96,167,0.16),rgba(109,63,195,0.12))] p-7 sm:flex-row sm:items-center sm:p-10">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-[color:var(--rosa)]">
            Emergência real?
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-[color:var(--lilas)] sm:text-3xl">
            Ligue agora. Fale com calma e informe o endereço.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { n: "192", nome: "SAMU", cor: "var(--rosa)" },
            { n: "193", nome: "Bombeiros", cor: "var(--amarelo)" },
          ].map((c) => (
            <a
              key={c.n}
              href={`tel:${c.n}`}
              className="press group inline-flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 text-[color:var(--lilas)] transition-colors hover:bg-white/20"
            >
              <span
                className="call-pulse inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
                style={{ color: c.cor }}
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span
                  className="block font-display text-2xl font-extrabold leading-none"
                  style={{ color: c.cor }}
                >
                  {c.n}
                </span>
                <span className="text-xs font-semibold opacity-75">{c.nome}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <div className="sinal-home relative bg-[#150e33]">
      <SiteHeader />
      <main>
        <ScrollStory />
        <div className="relative bg-[linear-gradient(180deg,#0d0922_0%,#150e33_100%)]">
          <Fechamento />
        </div>
      </main>
      <Footer />
    </div>
  );
}
