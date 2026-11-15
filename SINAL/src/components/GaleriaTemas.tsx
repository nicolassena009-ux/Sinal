import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Chrome } from "@/components/Chrome";
import { Cursor } from "@/components/Cursor";
import { temas } from "@/data/temas";
import type { CardScreenInfo } from "@/webgl/GalleryScene";
import bgTeddy from "@/assets/sinal-bg.webp";

export function GaleriaTemas() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [activeSlug, setActiveSlug] = useState(temas[0].slug);
  const sceneRef = useRef<import("@/webgl/GalleryScene").GalleryScene | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene: import("@/webgl/GalleryScene").GalleryScene | null = null;
    let cancelled = false;
    let currentHover: string | null = null;

    import("@/webgl/GalleryScene").then(({ GalleryScene }) => {
      if (cancelled) return;
      scene = new GalleryScene(canvas, temas);
      sceneRef.current = scene;
      setReady(true);

      scene.onActive = (slug) => setActiveSlug(slug);
      scene.onFrame = (infos: CardScreenInfo[], hovered) => {
        for (const info of infos) {
          const el = labelRefs.current[info.slug];
          if (!el) continue;
          el.style.transform = `translate3d(${info.x}px, ${info.y}px, 0)`;
          el.style.opacity = String(info.opacity * (info.hovered ? 1 : 0.8));
        }
        const title = hovered?.title ?? null;
        if (title !== currentHover) {
          currentHover = title;
          setHoverLabel(title ? "Abrir" : null);
        }
      };

      scene.onSelect = (tema) => {
        navigate({ to: "/tema/$slug", params: { slug: tema.slug } });
      };
    }).catch(() => { if (!cancelled) { setFallback(true); setReady(true); } });

    return () => {
      cancelled = true;
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [navigate]);

  const activeTema = temas.find(tema => tema.slug === activeSlug) ?? temas[0];

  return (
    <div className="cena-3d fixed inset-0 overflow-hidden select-none grabbable">
      {/* Background harmonizado com o roxo oficial do site e o Teddy */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#150e33]" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, #2a1a63 0%, #150e33 55%, #0d0922 100%)",
          }}
        />
        <img
          src={bgTeddy}
          alt=""
          className="h-full w-full object-cover object-[15%_center] opacity-35 md:opacity-40 transition-opacity duration-700"
        />
      </div>

      <canvas ref={canvasRef} className="gallery-canvas block h-full w-full" aria-hidden="true" />

      {fallback && <div className="gallery-fallback" role="status">
        <p>Explore os temas pela lista abaixo.</p>
        {temas.map(tema => <Link key={tema.slug} to="/tema/$slug" params={{slug:tema.slug}} className="rounded-2xl bg-white/10 p-4 text-white">{tema.title}</Link>)}
      </div>}
      {!fallback && <div className="mobile-gallery-controls">
        <div className="flex items-center justify-between gap-3">
          <button aria-label="Tema anterior" onClick={() => sceneRef.current?.step(-1)}>←</button>
          <Link to="/tema/$slug" params={{slug:activeTema.slug}} className="min-w-0 flex-1 text-center">
            <strong className="block font-display text-lg" style={{color:activeTema.color}}>{activeTema.title}</strong>
            <span className="text-xs text-white/80">Toque para abrir o guia →</span>
          </Link>
          <button aria-label="Próximo tema" onClick={() => sceneRef.current?.step(1)}>→</button>
        </div>
      </div>}

      {/* Rótulos DOM posicionados a cada frame a partir da projeção dos cards 3D */}
      <div className="pointer-events-none fixed inset-0 z-30 hidden md:block" aria-hidden="true">
        {temas.map((tema) => (
          <div
            key={tema.slug}
            ref={(el) => {
              labelRefs.current[tema.slug] = el;
            }}
            className="absolute left-0 top-0 -translate-y-full whitespace-nowrap pb-3 pl-1 opacity-0 will-change-transform"
          >
            <span
              className="font-display text-base font-extrabold text-[color:var(--lilas)] [text-shadow:0_2px_14px_rgba(0,0,0,0.7)]"
              style={{ color: tema.color }}
            >
              {tema.title}
            </span>
            <span className="ml-2 text-xs text-[color:var(--lilas)]/80 [text-shadow:0_2px_10px_rgba(0,0,0,0.8)]">
              {tema.resumo}
            </span>
          </div>
        ))}
      </div>

      {/* Cabeçalho superior com instrução de arraste */}
      <div className="gallery-heading pointer-events-none fixed top-16 sm:top-20 inset-x-0 z-30 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-[color:var(--lilas)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
          Explorar os Temas
        </h1>
        <p className="mt-1 max-w-md text-xs sm:text-sm text-[color:var(--lilas)]/85 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] hidden sm:block">
          Clique em um card para abrir o guia de primeiros socorros
        </p>
        <div className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-1.5 backdrop-blur-md border border-white/20 shadow-md">
          <span className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-[0.18em] text-[color:var(--amarelo)]">
            ↔ Arraste para explorar os temas
          </span>
        </div>
      </div>

      {/* Lista acessível dos temas para leitores de tela */}
      <div className="sr-only">
        <ul>
          {temas.map((tema) => (
            <li key={tema.slug}>
              <Link to="/tema/$slug" params={{ slug: tema.slug }}>
                <span>{tema.title}</span>
                <span>{tema.resumo}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Chrome showThemePills={true} disclaimerPosition="none" />
      <Cursor label={hoverLabel} />

      <div
        className={`pointer-events-none fixed inset-0 z-50 superficie-cena transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
