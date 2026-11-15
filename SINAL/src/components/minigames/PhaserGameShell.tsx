import { useEffect, useRef, useState } from "react";
import { type GameHandle, mountGame } from "@/phaser/game";
import { defaults, type GameEvent, type MissionId, type Accessory } from "@/phaser/integration/contract";
import { CORES_ROUPA, usePlayerAvatar } from "@/lib/avatarStore";
import { recordMissionCompletion } from "@/lib/gameProgress";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import "@/phaser/style.css";

interface PhaserGameShellProps {
  missionId: MissionId;
  onReturn?: () => void;
}

export function PhaserGameShell({ missionId, onReturn }: PhaserGameShellProps) {
  const [avatar] = usePlayerAvatar();
  const hostRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<GameHandle | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const container = hostRef.current;
    if (!container) return;

    // Destrói qualquer instância prévia
    if (handleRef.current) {
      handleRef.current.destroy();
      handleRef.current = null;
    }

    setLoading(true);
    setErrorMessage(null);

    // Mapeamento do avatar do site para os 5 jogos Phaser
    const roupaHex = CORES_ROUPA.find((c) => c.id === avatar.roupaCor)?.hex ?? "#6D3FC3";
    const accessories: Accessory[] = [];
    if (avatar.acessorio === "cracha") accessories.push("badge");
    else if (avatar.acessorio === "oculos") accessories.push("glasses");
    if (avatar.boneModelo && avatar.boneModelo !== "nenhum") accessories.push("cap");
    if (avatar.roupaModelo === "colete_socorrista") accessories.push("vest");

    const input = defaults("teens", missionId);
    input.avatar = {
      ...input.avatar,
      color: roupaHex,
      accessories,
      custom: {
        boneModelo: avatar.boneModelo ?? "bone_roxo",
        roupaModelo: avatar.roupaModelo ?? "camiseta_sinal",
        roupaCor: avatar.roupaCor ?? "roxo",
        mochilaModelo: avatar.mochilaModelo ?? "mochila_amarela",
        acessorio: avatar.acessorio ?? "cracha",
        pelagemCor: avatar.pelagemCor ?? "caramelo",
        corCamiseta: avatar.corCamiseta ?? (avatar.roupaCor as any) ?? "roxo",
        estampa: avatar.estampa ?? "lisa",
        corBone: avatar.corBone ?? "roxo",
      },
    };
    input.settings = {
      ...input.settings,
      reducedMotion: typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };

    const onEvent = (event: GameEvent) => {
      if (!active) return;
      if (event.type === "mission-completed") {
        recordMissionCompletion(event.missionId, event.result);
      }
      if (event.type === "return-menu") {
        onReturn?.();
      }
    };

    try {
      const handle = mountGame(container, input, onEvent);
      if (active) {
        handleRef.current = handle;
        setLoading(false);
      } else {
        handle.destroy();
      }
    } catch (err) {
      if (active) {
        setErrorMessage(`Não foi possível iniciar o jogo: ${String(err)}`);
        setLoading(false);
      }
    }

    return () => {
      active = false;
      if (handleRef.current) {
        handleRef.current.destroy();
        handleRef.current = null;
      }
    };
  }, [missionId, avatar, onReturn]);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-border/70 bg-card shadow-2xl">
      {/* Barra de utilidades superior */}
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/50 px-4 py-2.5 text-xs">
        <button
          type="button"
          onClick={onReturn}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 font-bold text-foreground transition-all hover:bg-muted active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar ao Quartel-General</span>
        </button>

        <div className="inline-flex items-center gap-2 text-muted-foreground font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--amarelo)]" />
          <span className="hidden sm:inline">Teddy personalizado ativo</span>
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CORES_ROUPA.find((c) => c.id === avatar.roupaCor)?.hex ?? "#6D3FC3" }} />
        </div>
      </div>

      {/* Área do jogo */}
      <div className="relative h-[680px] w-full min-h-[500px] max-h-[85vh] bg-[#1e1e2f]">
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-card/90 backdrop-blur-xs text-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-[color:var(--roxo)]" />
            <p className="font-display text-sm font-bold">Preparando o cenário interativo…</p>
          </div>
        )}

        {errorMessage && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-destructive/10 p-6 text-center">
            <p className="font-bold text-destructive">{errorMessage}</p>
            <button
              type="button"
              onClick={onReturn}
              className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              Voltar ao Quartel-General
            </button>
          </div>
        )}

        {/* Contêiner onde o canvas do Phaser é montado */}
        <div ref={hostRef} className="h-full w-full" />
      </div>
    </div>
  );
}
