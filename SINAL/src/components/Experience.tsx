import { Link } from "@tanstack/react-router";
import { Chrome } from "@/components/Chrome";
import bgTeddy from "@/assets/sinal-bg.webp";

export function Experience() {
  return (
    <div className="home-experience fixed inset-0 overflow-hidden select-none">
      {/* Background do Teddy harmonizado com o roxo oficial do site */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#150e33]" aria-hidden="true">
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
          className="h-full w-full object-cover object-[15%_center] opacity-35 md:opacity-40 transition-opacity duration-700"
        />
      </div>

      {/* Hero centralizado e limpo */}
      <div className="home-hero pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-4 sm:px-6">
        <div className="flex flex-col items-center text-[color:var(--lilas)] -translate-y-4 md:translate-y-0">
          <div className="max-w-2xl text-center">
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-extrabold drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)] tracking-tight">
              Sinal
            </h1>
            <p className="mt-2 md:mt-3 font-display text-lg sm:text-2xl font-bold text-[color:var(--amarelo)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
              Reconhecer também é proteger
            </p>
            <p className="mx-auto mt-3 md:mt-4 max-w-lg text-sm sm:text-base opacity-85 leading-relaxed">
              Aprenda a reconhecer situações de emergência, entenda o que fazer e descubra como
              agir quando cada segundo importa.
            </p>
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/temas"
                className="pointer-events-auto inline-flex min-h-11 sm:min-h-12 items-center justify-center rounded-full bg-[color:var(--amarelo)] px-6 sm:px-8 py-3 text-sm sm:text-base font-display font-bold text-[color:var(--tinta)] shadow-[var(--sombra-forte)] transition-all hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,192,68,0.45)]"
              >
                Explorar os Temas
              </Link>
              <Link
                to="/jogos"
                className="pointer-events-auto inline-flex min-h-11 sm:min-h-12 items-center justify-center rounded-full bg-[color:var(--rosa)] px-5 sm:px-7 py-3 text-sm sm:text-base font-display font-bold text-white shadow-[var(--sombra-suave)] transition-all hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,96,167,0.45)]"
              >
                🎮 Praticar com o Teddy
              </Link>
              <Link
                to="/como-funciona"
                className="pointer-events-auto hidden sm:inline-flex min-h-11 sm:min-h-12 items-center justify-center rounded-full border border-white/30 px-6 py-3 font-display font-semibold transition-all hover:bg-white/10 hover:border-white/60"
              >
                Como funciona
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Chrome com navegação e texto educativo posicionado no canto inferior esquerdo */}
      <Chrome showThemePills={false} disclaimerPosition="bottom-left" />
    </div>
  );
}
