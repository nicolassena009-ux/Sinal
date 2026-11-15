import { useEffect, useRef, useState } from "react";
import {
  usePlayerAvatar,
  DEFAULT_AVATAR,
  TONS_PELE,
  ESTILOS_CABELO,
  CORES_CABELO,
  MODELOS_ROUPA,
  CORES_ROUPA,
  CORES_CALCADO,
  ACESSORIOS,
} from "@/lib/avatarStore";
import { PixelRenderer } from "./PixelRenderer";
import type { AvatarConfig } from "@/types/minigame";
import { X, Sparkles, Check, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AvatarCustomizerModal({ isOpen, onClose }: AvatarCustomizerModalProps) {
  const [currentAvatar, setSavedAvatar] = usePlayerAvatar();
  const [tempAvatar, setTempAvatar] = useState<AvatarConfig>(currentAvatar);
  const [direction, setDirection] = useState<"down" | "up" | "left" | "right">("down");
  const [saveWarning, setSaveWarning] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);

  // Sincroniza estado ao abrir
  useEffect(() => {
    if (isOpen) {
      setTempAvatar(currentAvatar);
    }
  }, [isOpen, currentAvatar]);

  // Renderiza prévia 2D em tempo real no canvas
  useEffect(() => {
    if (!isOpen || !canvasElement) return;
    const canvas = canvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    // Fundo da cabine de personalização
    ctx.fillStyle = "#1E1B4B";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Brilho suave
    const rad = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      10,
      canvas.width / 2,
      canvas.height / 2,
      50,
    );
    rad.addColorStop(0, "rgba(109, 63, 195, 0.4)");
    rad.addColorStop(1, "transparent");
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Renderiza avatar centralizado com escala 2.5x
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2 + 10);
    ctx.scale(2.2, 2.2);
    PixelRenderer.drawPlayer(ctx, tempAvatar, 0, 0, direction, 0, false, false);
    ctx.restore();
  }, [isOpen, tempAvatar, direction, canvasElement]);

  if (!isOpen) return null;

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
        className="max-w-2xl w-[calc(100%_-_1rem)] p-0 border-0 bg-transparent [&>button]:hidden"
      >
        <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-gray-950/95 text-white shadow-2xl">
          {/* Topo do Modal */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--roxo)] text-white">
                <Sparkles className="h-4 w-4 text-[color:var(--amarelo)]" />
              </span>
              <div>
                <DialogTitle
                  id="modal-avatar-title"
                  className="font-display text-lg font-extrabold"
                >
                  Personalize seu Personagem 2D
                </DialogTitle>
                <p className="text-xs text-white/70">
                  Seu personagem acompanhará você em todas as 10 fases do Sinal.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Fechar personalização"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Corpo com Grid: Prévia na esquerda e Opções na direita */}
          <div className="grid flex-1 gap-6 overflow-y-auto p-6 md:grid-cols-[180px_1fr]">
            {/* Prévia do Avatar */}
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/60">
                Prévia 2D
              </span>
              <div className="relative rounded-2xl border-2 border-[color:var(--roxo)]/60 bg-black/60 p-2 shadow-inner">
                <canvas
                  ref={setCanvasElement}
                  width={120}
                  height={140}
                  className="pixelated block rounded-xl"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
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
                    className={`rounded-lg p-2 text-xs border ${direction === value ? "bg-violet-700 border-white" : "border-white/20"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-white/70 leading-tight">
                Aparência compartilhada em todos os mini jogos.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/80 hover:bg-white/15 hover:text-white transition-all"
              >
                <RotateCcw className="h-3 w-3" />
                Restaurar Padrão
              </button>
            </div>

            {/* Abas e Seletores de Customização */}
            <div className="space-y-4">
              {/* 1. Tom de Pele */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                  Tom de Pele
                </label>
                <div className="flex flex-wrap gap-2">
                  {TONS_PELE.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={tempAvatar.tomPele === t.id}
                      onClick={() => setTempAvatar({ ...tempAvatar, tomPele: t.id })}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 ${
                        tempAvatar.tomPele === t.id
                          ? "border-white ring-2 ring-[color:var(--amarelo)] scale-105"
                          : "border-transparent opacity-85 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: t.cor }}
                      title={t.nome}
                      aria-label={t.nome}
                    />
                  ))}
                </div>
              </div>

              {/* 2. Cabelo (Estilo e Cor) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                  Cabelo
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-2.5">
                  {ESTILOS_CABELO.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={tempAvatar.cabeloEstilo === c.id}
                      onClick={() => setTempAvatar({ ...tempAvatar, cabeloEstilo: c.id })}
                      className={`rounded-xl border px-2.5 py-1.5 text-left text-xs font-semibold transition-all ${
                        tempAvatar.cabeloEstilo === c.id
                          ? "border-[color:var(--roxo)] bg-[color:var(--roxo)] text-white shadow-xs"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      {c.nome}
                    </button>
                  ))}
                </div>

                {/* Cores de Cabelo */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-white/60 font-semibold">Cor:</span>
                  {CORES_CABELO.map((cor) => (
                    <button
                      key={cor.id}
                      type="button"
                      aria-pressed={tempAvatar.cabeloCor === cor.id}
                      onClick={() => setTempAvatar({ ...tempAvatar, cabeloCor: cor.id })}
                      className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                        tempAvatar.cabeloCor === cor.id
                          ? "border-white ring-2 ring-[color:var(--amarelo)] scale-105"
                          : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: cor.hex }}
                      title={cor.nome}
                      aria-label={`Cabelo ${cor.nome}`}
                    />
                  ))}
                </div>
              </div>

              {/* 3. Roupa / Uniforme */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                  Roupa & Cor
                </label>
                <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                  {MODELOS_ROUPA.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      aria-pressed={tempAvatar.roupaModelo === r.id}
                      onClick={() => setTempAvatar({ ...tempAvatar, roupaModelo: r.id })}
                      className={`rounded-xl border px-2.5 py-1.5 text-left text-xs font-semibold transition-all ${
                        tempAvatar.roupaModelo === r.id
                          ? "border-[color:var(--roxo)] bg-[color:var(--roxo)] text-white shadow-xs"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      {r.nome}
                    </button>
                  ))}
                </div>

                {/* Cores da Roupa */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-white/60 font-semibold">Cor:</span>
                  {CORES_ROUPA.map((cor) => (
                    <button
                      key={cor.id}
                      type="button"
                      aria-pressed={tempAvatar.roupaCor === cor.id}
                      onClick={() => setTempAvatar({ ...tempAvatar, roupaCor: cor.id })}
                      className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                        tempAvatar.roupaCor === cor.id
                          ? "border-white ring-2 ring-[color:var(--amarelo)] scale-105"
                          : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: cor.hex }}
                      title={cor.nome}
                      aria-label={`Roupa ${cor.nome}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase">Calçados</p>
                <div className="flex flex-wrap gap-2">
                  {CORES_CALCADO.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={tempAvatar.calcadoCor === c.id}
                      onClick={() => setTempAvatar({ ...tempAvatar, calcadoCor: c.id })}
                      className={`rounded-lg border px-3 py-2 text-xs ${tempAvatar.calcadoCor === c.id ? "border-white bg-violet-700" : "border-white/20"}`}
                    >
                      <span
                        style={{ background: c.hex }}
                        className="mr-1 inline-block h-3 w-3 rounded-full"
                      />
                      {c.nome}
                    </button>
                  ))}
                </div>
              </div>
              {/* 4. Acessório */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                  Acessório
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {ACESSORIOS.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      aria-pressed={tempAvatar.acessorio === a.id}
                      onClick={() => setTempAvatar({ ...tempAvatar, acessorio: a.id })}
                      className={`rounded-xl border px-2.5 py-1.5 text-left text-xs font-semibold transition-all ${
                        tempAvatar.acessorio === a.id
                          ? "border-[color:var(--roxo)] bg-[color:var(--roxo)] text-white shadow-xs"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      {a.nome}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {saveWarning && (
            <p role="status" className="px-6 py-2 text-sm text-amber-200">
              Aparência aplicada nesta sessão, mas não foi salva no navegador. Você pode fechar e
              continuar jogando.
            </p>
          )}
          {/* Rodapé com Ações */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-black/40 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 font-display text-xs font-bold text-white/80 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--roxo)] px-6 py-2.5 font-display text-xs font-bold text-white shadow-md hover:bg-[color:var(--roxo)]/90 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Check className="h-4 w-4" />
              Salvar Personagem
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
