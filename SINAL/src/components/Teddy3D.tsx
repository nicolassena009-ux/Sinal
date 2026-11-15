import { Teddy, type TeddyEstado } from "@/components/Teddy";
import { useTeddy } from "@/components/TeddyMascote";

export type TeddyAnimationMode = "idle" | "wave" | "celebrate" | "sad";

export interface Teddy3DProps {
  mode?: TeddyAnimationMode;
  allowLook?: boolean;
  cameraDistance?: number;
  cameraHeight?: number;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  modelUrl?: string;
  tamanho?: number;
}

export function Teddy3D({
  mode: propMode = "idle",
  allowLook = true,
  className = "",
  onClick,
  interactive = false,
  modelUrl,
  tamanho = 240,
}: Teddy3DProps) {
  let teddyCtx: ReturnType<typeof useTeddy> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    teddyCtx = useTeddy();
  } catch {
    // seguro caso usado fora de <TeddyProvider>
  }

  const estado: TeddyEstado =
    teddyCtx?.falando
      ? "explicando"
      : propMode === "celebrate"
      ? "comemorando"
      : propMode === "sad"
      ? "preocupado"
      : propMode === "wave"
      ? "acenando"
      : "idle";

  const handleClick = () => {
    if (teddyCtx?.narracaoAtiva) {
      teddyCtx.tocarNarracaoDaPagina();
    } else {
      teddyCtx?.falar("Oi! Posso ajudar? 💜", "feliz");
    }
    onClick?.();
  };

  return (
    <div className={`teddy-inline flex items-center justify-center ${className}`}>
      <Teddy
        estado={estado}
        seguirCursor={allowLook}
        tamanho={tamanho}
        modeloUrl={modelUrl}
        onClick={interactive || onClick ? handleClick : undefined}
      />
    </div>
  );
}
