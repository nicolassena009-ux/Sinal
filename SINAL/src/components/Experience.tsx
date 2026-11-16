import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ArrowRight, BookOpen, Gamepad2, Headphones } from "lucide-react";
import { Chrome } from "@/components/Chrome";
import { vars } from "@/lib/motion";
import bgTeddy from "@/assets/sinal-bg.webp";

const DESTAQUES = [
  { icon: BookOpen, label: "5 temas guiados" },
  { icon: Gamepad2, label: "Missões jogáveis" },
  { icon: Headphones, label: "Narração em áudio" },
];

/** Parallax suave do fundo seguindo o mouse (desligado em toque e movimento reduzido). */
function useParallax() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ok =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      x = (e.clientX / window.innerWidth) * 2 - 1;
      y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          el.style.setProperty("--px", x.toFixed(3));
          el.style.setProperty("--py", y.toFixed(3));
        });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

export function Experience() {
  const parallaxRef = useParallax();
  return (
    <div className="home-experience fixed inset-0 overflow-hidden select-none">
      {/* Background do Teddy harmonizado com o roxo oficial do site */}
      <div ref={parallaxRef} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#150e33]" aria-hidden="true">
        {/* Fundo roxo oficial do Sinal */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, #2a1a63 0%, #150e33 55%, #0d0922 100%)",
          }}
        />
        {/* Mascote Teddy suavemente integrado ao fundo */}
        <img
          src={bgTeddy}
          alt=""
          fetchPriority="high"
          className="parallax-layer h-full w-full object-cover object-[15%_center] opacity-35 md:opacity-40"
        />
        {/* Brilhos suaves nas cores da identidade */}
        <span className="glow-orb left-[55%] top-[12%] h-72 w-72 bg-[color:var(--rosa)] opacity-25" />
        <span className="glow-orb bottom-[8%] right-[10%] h-80 w-80 bg-[color:var(--amarelo)] opacity-15 [animation-delay:-5s]" />
        <span className="glow-orb bottom-[-6rem] left-[30%] h-96 w-96 bg-[color:var(--azul)] opacity-30 [animation-delay:-10s]" />
        {/* Vinheta para foco no centro */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(13,9,34,0.55)_100%)]" />
      </div>

      {/* Hero centralizado e limpo */}
      <div className="home-hero pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-4 sm:px-6">
        <div className="flex flex-col items-center text-[color:var(--lilas)] -translate-y-4 md:translate-y-0">
          <div className="hero-stagger max-w-2xl text-center">
            <h1 style={vars({ "--i": 0 })} className="font-display text-5xl sm:text-7xl md:text-8xl font-extrabold drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)] tracking-tight">
              <span className="hero-title-shine">Sinal</span>
            </h1>
            <p style={vars({ "--i": 1 })} className="mt-2 md:mt-3 font-display text-lg sm:text-2xl font-bold text-[color:var(--amarelo)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
              Reconhecer também é proteger
            </p>
            <p style={vars({ "--i": 2 })} className="mx-auto mt-3 md:mt-4 max-w-lg text-sm sm:text-base opacity-85 leading-relaxed">
              Aprenda a reconhecer situações de emergência, entenda o que fazer e descubra como
              agir quando cada segundo importa.
            </p>
            <div style={vars({ "--i": 3 })} className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/temas"
                className="btn-shine press group pointer-events-auto inline-flex min-h-11 sm:min-h-12 items-center justify-center gap-2 rounded-full bg-[color:var(--amarelo)] px-6 sm:px-8 py-3 text-sm sm:text-base font-display font-bold text-[color:var(--tinta)] shadow-[var(--sombra-forte)] hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(255,192,68,0.5)]"
              >
                Explorar os Temas
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                to="/jogos"
                className="btn-shine press pointer-events-auto inline-flex min-h-11 sm:min-h-12 items-center justify-center rounded-full bg-[color:var(--rosa)] px-5 sm:px-7 py-3 text-sm sm:text-base font-display font-bold text-white shadow-[var(--sombra-suave)] hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(255,96,167,0.5)]"
              >
                🎮 Praticar com o Teddy
              </Link>
              <Link
                to="/como-funciona"
                className="press pointer-events-auto hidden sm:inline-flex min-h-11 sm:min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 py-3 font-display font-semibold backdrop-blur-sm hover:bg-white/10 hover:border-white/60"
              >
                Como funciona
              </Link>
            </div>
            <ul
              style={vars({ "--i": 4 })}
              aria-label="Destaques do Sinal"
              className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs sm:text-sm font-semibold text-[color:var(--lilas)]/80"
            >
              {DESTAQUES.map(({ icon: Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-[color:var(--amarelo)]" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Chrome com navegação e texto educativo posicionado no canto inferior esquerdo */}
      <Chrome showThemePills={false} disclaimerPosition="bottom-left" />
    </div>
  );
}
