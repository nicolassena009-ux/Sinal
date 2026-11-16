import { Component, useEffect, useState, type ReactNode } from "react";
import { useProgress } from "@react-three/drei";
import { Teddy, type TeddyProps } from "@/components/Teddy";

const POSTER = "/teddy/teddy-3d-poster.webp";

function hasWebGL() {
  if (typeof document === "undefined") return true;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

class Boundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch(error: unknown) {
    console.warn("[Sinal] Teddy 3D indisponível, exibindo imagem.", error);
  }
  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Teddy 3D com rede de segurança:
 * - Pôster (render do próprio teddy.glb) aparece enquanto o modelo carrega e some quando ele está pronto.
 * - Sem WebGL, ou se o 3D falhar, o pôster fica no lugar (com leve flutuação).
 */
export function SafeTeddy(props: TeddyProps & { tamanho: number }) {
  const { tamanho, onClick } = props;
  const [webgl] = useState(hasWebGL);
  const { active, total, loaded } = useProgress();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!active && total > 0 && loaded >= total) {
      const t = setTimeout(() => setReady(true), 250);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [active, total, loaded]);

  const poster = (still: boolean) => (
    <img
      src={POSTER}
      alt={still ? "Teddy, o mascote do Sinal" : ""}
      aria-hidden={still ? undefined : true}
      width={tamanho}
      height={Math.round(tamanho * 1.25)}
      className={`pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${
        still ? "teddy-poster-float" : ""
      }`}
      style={{ opacity: still || !ready ? 1 : 0 }}
      draggable={false}
    />
  );

  return (
    <div
      className="relative"
      style={{ width: tamanho, height: Math.round(tamanho * 1.25) }}
      onClick={!webgl ? onClick : undefined}
    >
      {webgl ? (
        <Boundary fallback={poster(true)}>
          {poster(false)}
          <div
            className="relative h-full w-full transition-opacity duration-700"
            style={{ opacity: ready ? 1 : 0 }}
          >
            <Teddy {...props} style={{ ...props.style, width: "100%", height: "100%" }} />
          </div>
        </Boundary>
      ) : (
        poster(true)
      )}
    </div>
  );
}
