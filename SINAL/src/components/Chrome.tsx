import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { temas } from "@/data/temas";
import { HighContrastToggle } from "@/components/HighContrastToggle";

/**
 * Chrome fixo da experiência 3D: marca, navegação dos temas e acesso rápido
 * de emergência. Sobrepõe o canvas sem bloquear o arraste (pointer-events).
 */
export interface ChromeProps {
  children?: ReactNode;
  showThemePills?: boolean;
  disclaimerPosition?: "bottom-left" | "none";
}

/**
 * Chrome fixo da experiência: marca, navegação e acesso rápido.
 * Sobrepõe o canvas sem bloquear o arraste (pointer-events).
 */
export function Chrome({
  children,
  showThemePills = false,
  disclaimerPosition = "none",
}: ChromeProps) {
  return (
    <div className="experience-chrome pointer-events-none fixed inset-0 z-40 flex flex-col justify-between px-5 py-5 text-[color:var(--lilas)] sm:px-10 sm:py-8">
      <div className="experience-nav flex items-start justify-between gap-4">
        <Link
          to="/"
          className="pointer-events-auto font-display text-xl font-extrabold tracking-tight transition-opacity hover:opacity-70 sm:text-2xl"
        >
          Sinal
          <span className="ml-2 hidden text-xs font-semibold opacity-60 sm:inline">
            Reconhecer também é proteger
          </span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="desktop-nav pointer-events-auto flex items-center gap-1.5 font-display text-xs font-semibold sm:gap-2.5 sm:text-sm"
        >
          <Link
            to="/temas"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10"
            activeProps={{ className: "bg-white/15" }}
          >
            Temas
          </Link>
          <Link
            to="/como-funciona"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10 hidden sm:inline-block"
            activeProps={{ className: "bg-white/15" }}
          >
            Como funciona
          </Link>
          <Link
            to="/jogos"
            className="rounded-full bg-[color:var(--amarelo)] px-3.5 py-1.5 text-[color:var(--tinta)] transition-transform hover:scale-105"
            activeProps={{ className: "ring-2 ring-white" }}
          >
            🎮 Jogos & Missões
          </Link>
          <Link
            to="/familia-escola"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10 hidden md:inline-block"
            activeProps={{ className: "bg-white/15" }}
          >
            Família & Escola
          </Link>
          <Link
            to="/emergencia"
            className="rounded-full bg-[color:var(--rosa)] px-3.5 py-1.5 text-white transition-transform hover:scale-105"
          >
            Emergência
          </Link>
          <HighContrastToggle />
        </nav>
        <details className="mobile-nav pointer-events-auto font-display">
          <summary className="rounded-full border border-white/30 bg-[#241649] px-4 py-3 text-sm font-bold">Menu</summary>
          <nav aria-label="Navegação no celular" className="mobile-nav-panel">
            <Link to="/">Início</Link><Link to="/temas">Temas</Link>
            <Link to="/como-funciona">Como funciona</Link><Link to="/jogos">🎮 Jogos & Missões</Link>
            <Link to="/familia-escola">Família & Escola</Link>
            <Link to="/emergencia" className="text-[color:var(--rosa)]">Emergência</Link><HighContrastToggle />
          </nav>
        </details>
      </div>

      {children}

      <div className="experience-bottom flex flex-wrap items-end justify-start gap-3 w-full max-w-[calc(100%-150px)] sm:max-w-2xl md:max-w-3xl">
        {disclaimerPosition === "bottom-left" && (
          <p className="pointer-events-auto max-w-xs text-left text-[11px] sm:text-xs leading-snug opacity-75">
            Conteúdo educativo. Em emergências reais, acione o SAMU (192) ou Bombeiros (193).
          </p>
        )}

        {showThemePills && (
          <nav
            aria-label="Temas do Sinal"
            className="theme-pills pointer-events-auto flex flex-wrap gap-2 font-display text-xs font-semibold sm:text-sm"
          >
            {temas.map((tema) => (
              <Link
                key={tema.slug}
                to="/tema/$slug"
                params={{ slug: tema.slug }}
                className="min-h-11 rounded-full border border-white/20 px-3 py-2 backdrop-blur-sm transition-colors hover:border-white/50"
                style={{ backgroundColor: `${tema.color}22` }}
              >
                <span
                  className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
                  style={{ backgroundColor: tema.color }}
                />
                {tema.title}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
