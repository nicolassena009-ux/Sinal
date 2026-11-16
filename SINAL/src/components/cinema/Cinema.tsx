import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import { ParticleField } from "@/components/home/ParticleField";

/** Palavra gigante com preenchimento em degradê e contorno deslocado (assinatura visual do Sinal). */
export function GiantWord({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span aria-hidden="true" className={`home-giant select-none ${className}`} style={style}>
      <span className="home-giant-fill">{children}</span>
      <span className="home-giant-stroke">{children}</span>
    </span>
  );
}

/** Fundo cinematográfico: degradê roxo, brilhos na cor de destaque, partículas e vinheta. */
export function CinemaBackdrop({
  accent = "var(--roxo)",
  particles = true,
  className = "",
}: {
  accent?: string | undefined;
  particles?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_0%,#2a1a63_0%,#150e33_55%,#0d0922_100%)]" />
      <span
        className="glow-orb left-[6%] top-[14%] h-96 w-96 opacity-50"
        style={{ backgroundColor: accent }}
      />
      <span className="glow-orb right-[4%] top-[40%] h-80 w-80 bg-[color:var(--azul)] opacity-35 [animation-delay:-6s]" />
      <span className="glow-orb bottom-[-12%] left-[38%] h-96 w-96 bg-[color:var(--rosa)] opacity-20 [animation-delay:-11s]" />
      {particles && <ParticleField className="absolute inset-0" />}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(13,9,34,0.7)_100%)]" />
    </div>
  );
}

/** Rótulo de capítulo: "01 — Título" em caixa alta espaçada. */
export function Eyebrow({
  children,
  color = "var(--amarelo)",
}: {
  children: ReactNode;
  color?: string | undefined;
}) {
  return (
    <p
      className="font-display text-xs font-bold uppercase tracking-[0.3em]"
      style={{ color: color ?? "var(--amarelo)" }}
    >
      {children}
    </p>
  );
}

/** Ao rolar para fora do hero, o conteúdo sobe mais devagar, encolhe e esmaece (profundidade). */
export function useHeroExit() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)));
      el.style.transform =
        p > 0
          ? `translate3d(0, ${(p * 90).toFixed(1)}px, 0) scale(${(1 - p * 0.06).toFixed(3)})`
          : "";
      el.style.opacity = p > 0 ? String(1 - p * 0.85) : "";
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

/** Versões claras das cores do método, legíveis sobre o fundo escuro. */
const COR_LEGIVEL: Record<string, string> = {
  "#2E7DD1": "#7fb6ff",
  "#6D3FC3": "#b99bff",
};
export const corLegivel = (cor: string) => COR_LEGIVEL[cor.toUpperCase()] ?? cor;

/** Envolve a narração (componente claro) para que o texto fique legível sobre o fundo escuro. */
export function NarracaoEscura({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`text-[color:var(--lilas)] ${className}`}
      style={
        {
          ...style,
          ["--foreground" as string]: "#f2f1ff",
          ["--color-foreground" as string]: "#f2f1ff",
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

/**
 * Hero cinematográfico das páginas internas: tela cheia, fundo com partículas,
 * entrada escalonada e palavra gigante ao fundo. `aside` ocupa a coluna da direita no desktop.
 */
export function CinemaHero({
  eyebrow,
  title,
  lead,
  giant,
  accent,
  narration,
  actions,
  aside,
  scrollTo,
  scrollLabel = "Rolar para explorar",
  full = true,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  lead: ReactNode;
  giant?: string;
  accent?: string;
  narration?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  scrollTo?: string;
  scrollLabel?: string;
  full?: boolean;
}) {
  const conteudoRef = useHeroExit();
  const ir = (e: React.MouseEvent) => {
    if (!scrollTo) return;
    e.preventDefault();
    document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <header
      className={`relative flex items-center overflow-hidden pb-24 pt-28 ${full ? "min-h-[100svh]" : "min-h-[78svh]"}`}
    >
      <CinemaBackdrop accent={accent} />
      {giant && (
        <div
          aria-hidden="true"
          className="cinema-giant pointer-events-none absolute -bottom-[0.2em] left-0 right-0 overflow-hidden whitespace-nowrap opacity-[0.09]"
        >
          <GiantWord>{giant}</GiantWord>
        </div>
      )}
      <div
        ref={conteudoRef}
        className={`hero-stagger relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-10 ${aside ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : ""}`}
      >
        <div className="max-w-2xl">
          <div style={{ "--i": 0 } as CSSProperties}>
            <Eyebrow color={accent ? corLegivel(accent) : undefined}>{eyebrow}</Eyebrow>
          </div>
          <h1
            style={{ "--i": 1 } as CSSProperties}
            className="cinema-title mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl"
          >
            {title}
          </h1>
          <p
            style={{ "--i": 2 } as CSSProperties}
            className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--lilas)]/80 sm:text-xl"
          >
            {lead}
          </p>
          {actions && (
            <div style={{ "--i": 3 } as CSSProperties} className="mt-8">
              {actions}
            </div>
          )}
          {narration && (
            <NarracaoEscura style={{ "--i": 4 } as CSSProperties} className="mt-7">
              {narration}
            </NarracaoEscura>
          )}
        </div>
        {aside && (
          <div style={{ "--i": 3 } as CSSProperties} className="relative">
            {aside}
          </div>
        )}
      </div>
      {scrollTo && (
        <a
          href={`#${scrollTo}`}
          onClick={ir}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--lilas)]/60 transition-colors hover:text-[color:var(--lilas)] md:flex"
        >
          {scrollLabel} <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
        </a>
      )}
    </header>
  );
}
