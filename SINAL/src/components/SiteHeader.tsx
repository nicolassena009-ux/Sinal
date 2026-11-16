import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { HighContrastToggle } from "@/components/HighContrastToggle";

/**
 * Cabeçalho unificado das páginas internas.
 *
 * - `tone="hero"`: transparente sobre o hero colorido e vira vidro escuro ao rolar.
 *   Ocupa espaço zero no fluxo (margem negativa), então o hero continua por trás.
 * - `tone="light"`: vidro claro, para páginas com cabeçalho sobre fundo lilás.
 * - `progress`: barra fina de leitura na base do cabeçalho.
 */
export interface SiteHeaderProps {
  tone?: "hero" | "light";
  subtitle?: string;
  progress?: boolean;
}

const LINKS = [
  { to: "/temas", label: "Temas" },
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/jogos", label: "Jogos & Missões" },
  { to: "/familia-escola", label: "Família & Escola" },
] as const;

export function SiteHeader({ tone = "hero", subtitle, progress = false }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Estado de rolagem + barra de leitura, atualizados no máximo uma vez por frame.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 12);
      if (barRef.current) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Fecha o menu ao trocar de página.
  useEffect(() => setOpen(false), [pathname]);

  // Menu móvel: Esc fecha e devolve o foco; clique fora fecha.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const light = tone === "light";
  const solid = scrolled || open;

  return (
    <header
      data-tone={tone}
      data-scrolled={solid || undefined}
      className={`site-header sticky top-0 z-40 print:hidden ${light ? "" : "-mb-16"}`}
    >
      <div
        className={`site-header-bar relative transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ${
          light
            ? "border-b border-[color:var(--border)]/80 bg-white/70 text-[color:var(--tinta)] backdrop-blur-xl"
            : solid
              ? "border-b border-white/10 bg-[#150e33]/80 text-[color:var(--lilas)] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)] backdrop-blur-xl"
              : "border-b border-transparent text-[color:var(--lilas)]"
        } ${light && solid ? "shadow-[0_10px_30px_-20px_rgba(109,63,195,0.45)]" : ""}`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-10">
          <Link
            to="/"
            className="group flex items-baseline gap-2 font-display text-xl font-extrabold tracking-tight sm:text-2xl"
          >
            <span className={`transition-colors ${light ? "text-[color:var(--roxo)]" : ""}`}>
              Sinal
            </span>
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--amarelo)] transition-transform duration-300 group-hover:scale-150"
            />
            {subtitle && (
              <span className="hidden text-xs font-semibold opacity-70 sm:inline">{subtitle}</span>
            )}
          </Link>

          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-1 font-display text-sm font-semibold lg:flex"
          >
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="nav-link rounded-full px-3.5 py-2"
                activeProps={{ "aria-current": "page", className: "is-active" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/emergencia"
              className="press ml-2 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--rosa)] px-4 py-2 text-white shadow-[0_8px_24px_-10px_rgba(255,96,167,0.9)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-10px_rgba(255,96,167,1)]"
              activeProps={{ "aria-current": "page" }}
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              Emergência
            </Link>
            <HighContrastToggle className="ml-1" tone={light ? "light" : "dark"} />
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/emergencia"
              className="press inline-flex h-11 items-center gap-1.5 rounded-full bg-[color:var(--rosa)] px-3.5 font-display text-sm font-bold text-white"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span>192</span>
              <span className="sr-only">Emergência</span>
            </Link>
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
              className={`press inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                light ? "border-[color:var(--border)] bg-white/80" : "border-white/25 bg-white/10"
              }`}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {progress && (
          <div
            ref={barRef}
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-[linear-gradient(90deg,var(--amarelo),var(--rosa),var(--aqua))]"
            style={{ transform: "scaleX(0)" }}
          />
        )}
      </div>

      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="mobile-menu-panel absolute inset-x-3 top-[70px] rounded-3xl border border-white/15 bg-[#1d1342]/95 p-3 text-[color:var(--lilas)] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl lg:hidden"
      >
        <nav
          aria-label="Navegação no celular"
          className="flex flex-col font-display text-base font-bold"
        >
          <Link
            to="/"
            className="mobile-menu-link"
            activeOptions={{ exact: true }}
            activeProps={{ "aria-current": "page" }}
          >
            Início
          </Link>
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="mobile-menu-link"
              activeProps={{ "aria-current": "page" }}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-white/10 px-3 pt-3">
            <span className="text-sm font-semibold opacity-80">Alto contraste</span>
            <HighContrastToggle tone="dark" />
          </div>
        </nav>
      </div>
    </header>
  );
}
