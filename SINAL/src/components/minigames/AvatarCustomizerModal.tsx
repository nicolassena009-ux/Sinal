import { useEffect, useRef, useState } from "react";
import {
  usePlayerAvatar,
  DEFAULT_AVATAR,
  TEDDY_SHIRT_COLORS,
  TEDDY_CAP_COLORS,
  TEDDY_DECAL_OPTIONS,
} from "@/lib/avatarStore";
import type { AvatarConfig } from "@/types/minigame";
import type {
  TeddyShirtColor,
  TeddyCapColor,
  TeddyDecal,
} from "@/lib/teddyCustomTexture";
import { loadTeddySprite, drawTeddyOnCanvas } from "./TeddyPixelCanvas";
import { X, Sparkles, Check, RotateCcw, Play, Pause, Shirt, Crown, Palette } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AvatarCustomizerModal({ isOpen, onClose }: AvatarCustomizerModalProps) {
  const [currentAvatar, setSavedAvatar] = usePlayerAvatar();
  const [tempAvatar, setTempAvatar] = useState<AvatarConfig>(currentAvatar);
  const [direction, setDirection] = useState<"down" | "up" | "left" | "right">("down");
  const [isWalking, setIsWalking] = useState(true);
  const [frameIndex, setFrameIndex] = useState(0);
  const [saveWarning, setSaveWarning] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
  const [spriteImage, setSpriteImage] = useState<HTMLImageElement | null>(null);

  // Carrega o sprite canônico do Teddy
  useEffect(() => {
    let active = true;
    loadTeddySprite()
      .then((img) => {
        if (active) setSpriteImage(img);
      })
      .catch((err) => console.warn("Não foi possível carregar o sprite do Teddy:", err));
    return () => {
      active = false;
    };
  }, []);

  // Sincroniza estado ao abrir modal
  useEffect(() => {
    if (isOpen) {
      setTempAvatar(currentAvatar);
    }
  }, [isOpen, currentAvatar]);

  // Ciclo de passos da caminhada
  useEffect(() => {
    if (!isOpen || !isWalking) {
      setFrameIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev === 0 ? 1 : prev === 1 ? 2 : 0));
    }, 220);
    return () => clearInterval(interval);
  }, [isOpen, isWalking]);

  // Renderiza prévia 2D em tempo real no canvas
  useEffect(() => {
    if (!isOpen || !canvasElement) return;
    const canvas = canvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawTeddyOnCanvas(
      ctx,
      spriteImage,
      tempAvatar,
      direction,
      isWalking ? frameIndex : 0,
      canvas.width,
      canvas.height
    );
  }, [isOpen, tempAvatar, direction, isWalking, frameIndex, canvasElement, spriteImage]);

  if (!isOpen) return null;

  const handleSelectShirtColor = (corId: TeddyShirtColor) => {
    setTempAvatar((prev) => ({
      ...prev,
      corCamiseta: corId,
      roupaCor: corId as any,
    }));
  };

  const handleSelectDecal = (decalId: TeddyDecal) => {
    setTempAvatar((prev) => ({
      ...prev,
      estampa: decalId,
    }));
  };

  const handleSelectCapColor = (corId: TeddyCapColor) => {
    setTempAvatar((prev) => ({
      ...prev,
      corBone: corId,
      boneModelo: ("bone_" + corId) as any,
    }));
  };

  const handleSave = () => {
    const saved = setSavedAvatar(tempAvatar);
    setSaveWarning(!saved);
    if (saved) onClose();
  };

  const handleReset = () => {
    setTempAvatar(DEFAULT_AVATAR);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        onOpenAutoFocus={() => {
          returnFocus.current = document.activeElement as HTMLElement;
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          returnFocus.current?.focus();
        }}
        className="max-w-3xl w-[calc(100%_-_1rem)] p-0 border-0 bg-transparent [&>button]:hidden"
      >
        <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-gray-950/95 text-white shadow-2xl backdrop-blur-xl">
          {/* Topo do Modal */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--roxo)] text-white shadow-md">
                <Sparkles className="h-5 w-5 text-[color:var(--amarelo)]" />
              </span>
              <div>
                <DialogTitle
                  id="modal-avatar-title"
                  className="font-display text-lg sm:text-xl font-extrabold text-white"
                >
                  Personalização 2.0 do Teddy
                </DialogTitle>
                <p className="text-xs text-white/70">
                  Cores e estampas reais em pixel art — integradas nas 5 missões educativas do SINAL.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              aria-label="Fechar personalização"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Corpo: Prévia à esquerda, 3 Seções Principais à direita */}
          <div className="grid flex-1 gap-6 overflow-y-auto p-6 md:grid-cols-[220px_1fr]">
            {/* Coluna da Esquerda: Prévia em Pixel Art */}
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white/60">
                Prévia em Tempo Real
              </span>

              {/* Caixa do Canvas com moldura */}
              <div className="relative rounded-2xl border-2 border-[color:var(--roxo)]/60 bg-gradient-to-b from-indigo-950/80 to-purple-950/90 p-3 shadow-inner">
                <canvas
                  ref={setCanvasElement}
                  width={180}
                  height={210}
                  className="pixelated block rounded-xl"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>

              {/* Controles de Direção */}
              <div className="w-full">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                  Direção da Câmera
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {(
                    [
                      ["down", "Frente"],
                      ["up", "Costas"],
                      ["left", "Esquerda"],
                      ["right", "Direita"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={direction === value}
                      onClick={() => setDirection(value)}
                      className={`rounded-lg py-1.5 text-[11px] font-bold border transition-all cursor-pointer ${
                        direction === value
                          ? "bg-[color:var(--roxo)] border-white text-white shadow-xs"
                          : "border-white/15 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle de Passos */}
              <button
                type="button"
                onClick={() => setIsWalking(!isWalking)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-1.5 text-xs font-bold text-white/80 hover:bg-white/15 hover:text-white transition-all cursor-pointer"
              >
                {isWalking ? (
                  <>
                    <Pause className="h-3.5 w-3.5 text-[color:var(--amarelo)]" />
                    <span>Pausar Passos</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 text-[color:var(--amarelo)]" />
                    <span>Ver Caminhando</span>
                  </>
                )}
              </button>

              {/* Restaurar Padrão */}
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-transparent px-3 py-1 text-[11px] font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                title="Restaura Teddy clássico com boné roxo, camiseta roxa e sem estampa"
              >
                <RotateCcw className="h-3 w-3" />
                Restaurar Padrão
              </button>
            </div>

            {/* Coluna da Direita: As 3 Seções de Personalização 2.0 */}
            <div className="flex flex-col space-y-6">
              {/* SEÇÃO 1: COR DA CAMISETA */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Shirt className="h-4 w-4 text-[color:var(--amarelo)]" />
                  <label className="text-xs font-bold uppercase tracking-wider text-white">
                    1. Cor da Camiseta
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TEDDY_SHIRT_COLORS.map((c) => {
                    const isSelected = (tempAvatar.corCamiseta ?? "roxo") === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleSelectShirtColor(c.id)}
                        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "border-white bg-white/20 text-white shadow-md ring-2 ring-[color:var(--amarelo)]/60"
                            : "border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white"
                        }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full border-2 border-white/60 shrink-0 shadow-inner"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="truncate">{c.nome}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SEÇÃO 2: ESTAMPA NA CAMISETA */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-[color:var(--amarelo)]" />
                  <label className="text-xs font-bold uppercase tracking-wider text-white">
                    2. Estampa em Pixel Art
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TEDDY_DECAL_OPTIONS.map((d) => {
                    const isSelected = (tempAvatar.estampa ?? "lisa") === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleSelectDecal(d.id)}
                        className={`flex flex-col items-start rounded-xl border px-3 py-2 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-white bg-white/20 text-white shadow-md ring-2 ring-[color:var(--amarelo)]/60"
                            : "border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white"
                        }`}
                      >
                        <span className="text-xs font-bold">{d.nome}</span>
                        <span className="text-[10px] text-white/60">{d.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SEÇÃO 3: COR DO BONÉ */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-[color:var(--amarelo)]" />
                  <label className="text-xs font-bold uppercase tracking-wider text-white">
                    3. Cor do Boné
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TEDDY_CAP_COLORS.map((c) => {
                    const isSelected = (tempAvatar.corBone ?? "roxo") === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleSelectCapColor(c.id)}
                        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "border-white bg-white/20 text-white shadow-md ring-2 ring-[color:var(--amarelo)]/60"
                            : "border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white"
                        }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full border-2 border-white/60 shrink-0 shadow-inner"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="truncate">{c.nome}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {saveWarning && (
            <p role="status" className="px-6 py-2 text-sm text-amber-200 bg-amber-950/40 border-t border-amber-500/20">
              Aparência aplicada nesta sessão, mas não foi salva no armazenamento permanente. Você pode continuar jogando normalmente.
            </p>
          )}

          {/* Rodapé com Ações */}
          <div className="flex items-center justify-between border-t border-white/10 bg-black/40 px-6 py-4">
            <span className="text-xs text-white/50 hidden sm:inline">
              As alterações aparecem imediatamente em Engasgo, Queimaduras, Convulsão, PCR e Trauma.
            </span>
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-2 font-display text-xs font-bold text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--roxo)] px-6 py-2.5 font-display text-xs font-bold text-white shadow-md hover:bg-[color:var(--roxo)]/90 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Check className="h-4 w-4" />
                Salvar e Jogar com Teddy
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
