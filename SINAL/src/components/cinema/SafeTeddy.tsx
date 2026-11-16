import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { TeddyEstado } from "@/components/Teddy";

/**
 * Teddy oficial (moletom roxo com a mão e o coração).
 *
 * - Mostra na hora uma imagem do próprio modelo 3D na pose do estado (sem salto de layout).
 * - Em seguida carrega o Teddy 3D animado e troca com um fade quando o primeiro quadro fica pronto.
 * - Sem WebGL, com "reduzir movimento" ou economia de dados, fica só a imagem.
 */
export type TeddyPose = "frente" | "tres-quartos" | "acenando" | "joinha" | "oi" | "preocupado";

const ESTADO_DA_POSE: Record<TeddyPose, TeddyEstado> = {
  frente: "idle",
  "tres-quartos": "pensando",
  acenando: "acenando",
  joinha: "incentivando",
  oi: "feliz",
  preocupado: "preocupado",
};

export const teddyImagem = (e: TeddyEstado) => `/teddy/3d/${e}.webp`;
export const poseSrc = (p: TeddyPose) => teddyImagem(ESTADO_DA_POSE[p]);

const Teddy3DReal = lazy(() => import("@/components/Teddy").then((m) => ({ default: m.Teddy })));

let suporte3D: boolean | null = null;
function pode3D() {
  if (suporte3D !== null) return suporte3D;
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || nav.connection?.saveData) {
    return (suporte3D = false);
  }
  try {
    const c = document.createElement("canvas");
    suporte3D = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    suporte3D = false;
  }
  return suporte3D;
}

class Protecao extends Component<{ children: ReactNode; onErro: () => void }, { erro: boolean }> {
  override state = { erro: false };
  static getDerivedStateFromError() {
    return { erro: true };
  }
  override componentDidCatch() {
    this.props.onErro();
  }
  override render() {
    return this.state.erro ? null : this.props.children;
  }
}

export interface SafeTeddyProps {
  estado?: TeddyEstado | undefined;
  pose?: TeddyPose | undefined;
  tamanho: number;
  seguirCursor?: boolean | undefined;
  onClick?: (() => void) | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  modeloUrl?: string | undefined;
  /** Ignorados (compatibilidade). */
  enquadramento?: string | undefined;
  sombra?: boolean | undefined;
}

export function SafeTeddy({
  estado = "idle",
  pose,
  tamanho,
  seguirCursor = true,
  onClick,
  className = "",
  style,
  modeloUrl,
}: SafeTeddyProps) {
  const atual: TeddyEstado = pose ? ESTADO_DA_POSE[pose] : estado;
  const [usar3D, setUsar3D] = useState(false);
  const [pronto, setPronto] = useState(false);
  const [pulo, setPulo] = useState(0);

  useEffect(() => {
    setUsar3D(pode3D());
  }, []);

  const clicar = () => {
    setPulo((n) => n + 1);
    onClick?.();
  };

  return (
    <div
      className={`teddy-oficial relative select-none ${className}`}
      style={{ width: tamanho, height: Math.round(tamanho * 1.25), ...style }}
      role={onClick ? "button" : "img"}
      tabIndex={onClick ? 0 : undefined}
      aria-label="Teddy, o mascote do Sinal"
      onClick={onClick ? clicar : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          clicar();
        }
      }}
    >
      <span aria-hidden="true" className="teddy-oficial-sombra" />
      <img
        src={teddyImagem(atual)}
        alt=""
        draggable={false}
        decoding="async"
        width={tamanho}
        height={Math.round(tamanho * 1.25)}
        className="teddy-oficial-img"
        data-oculta={pronto || undefined}
      />
      {usar3D && (
        <Protecao onErro={() => setUsar3D(false)}>
          <Suspense fallback={null}>
            <Teddy3DReal
              estado={atual}
              tamanho={tamanho}
              seguirCursor={seguirCursor}
              modeloUrl={modeloUrl}
              pulo={pulo}
              onPronto={() => setPronto(true)}
              className="teddy-oficial-3d"
              style={{ opacity: pronto ? 1 : 0 }}
            />
          </Suspense>
        </Protecao>
      )}
    </div>
  );
}
