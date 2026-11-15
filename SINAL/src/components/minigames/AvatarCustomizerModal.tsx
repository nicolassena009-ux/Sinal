import { useEffect, useRef, useState } from "react";
import {
  usePlayerAvatar,
  DEFAULT_AVATAR,
  BONES_TEDDY,
  MODELOS_ROUPA,
  CORES_ROUPA,
  MOCHILAS_TEDDY,
  ACESSORIOS_TEDDY,
  PELAGEM_TEDDY,
} from "@/lib/avatarStore";
import type { AvatarConfig } from "@/types/minigame";
import { loadTeddySprite, drawTeddyOnCanvas } from "./TeddyPixelCanvas";
import { X, Sparkles, Check, RotateCcw, Play, Pause } from "lucide-react";
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
  const [activeCategory, setActiveCategory] = useState<"bone" | "roupa" | "mochila" | "acessorio" | "pelagem">("bone");

  // Carrega sprite do Teddy
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

  // Sincroniza estado ao abrir
  useEffect(() => {
    if (isOpen) {
      setTempAvatar(currentAvatar);
    }
  }, [isOpen, currentAvatar]);

  // Ciclo de animação de caminhada
  useEffect(() => {
    if (!isOpen || !isWalking) {
      setFrameIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev === 0 ? 1 : prev === 1 ? 0 : 2));
    }, 240);
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
                  Personalizar o Mascote Teddy
                </DialogTitle>
                <p className="text-xs text-white/70">
                  Teddy em pixel art real — mesma aparência exibida nas 5 missões educativas do SINAL.
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

          {/* Corpo com Grid: Prévia na esquerda e Opções na direita */}
          <div className="grid flex-1 gap-6 overflow-y-auto p-6 md:grid-cols-[220px_1fr]">
            {/* Coluna da Esquerda: Prévia do Teddy */}
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white/60">
                Prévia Oficial do Jogo
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

              {/* Botão de Toggle Parado / Caminhando */}
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

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-transparent px-3 py-1 text-[11px] font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                title="Restaura Teddy clássico com boné roxo, camiseta roxa e mochila amarela"
              >
                <RotateCcw className="h-3 w-3" />
                Restaurar Padrão
              </button>
            </div>

            {/* Coluna da Direita: Abas e Seletores */}
            <div className="flex flex-col space-y-5">
              {/* Navegação por Abas de Categoria */}
              <div className="flex flex-wrap gap-1.5 border-b border-white/10 pb-3">
                {(
                  [
                    ["bone", "🧢 Boné & Cabeça"],
                    ["roupa", "👕 Roupas & Coletes"],
                    ["mochila", "🎒 Mochilas"],
                    ["acessorio", "🏷️ Acessórios"],
                    ["pelagem", "🐻 Pelagem"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveCategory(id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      activeCategory === id
                        ? "bg-[color:var(--roxo)] text-white shadow-sm"
                        : "bg-white/5 text-white/60 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* CONTEÚDO DA ABA SELECIONADA */}

              {/* 1. ABA BONÉ & CABEÇA */}
              {activeCategory === "bone" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                      Escolha o Boné ou Item de Cabeça
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {BONES_TEDDY.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          aria-pressed={tempAvatar.boneModelo === b.id}
                          onClick={() => setTempAvatar({ ...tempAvatar, boneModelo: b.id as any })}
                          className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all cursor-pointer ${
                            tempAvatar.boneModelo === b.id
                              ? "border-[color:var(--roxo)] bg-[color:var(--roxo)] text-white shadow-md ring-2 ring-white/50"
                              : "border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white"
                          }`}
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-white/40 shrink-0"
                            style={{ backgroundColor: b.cor }}
                          />
                          <span>{b.nome}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                    💡 O <strong>Boné Roxo SINAL</strong> é o modelo oficial do mascote. Você também pode equipar a <strong>Faixa de Socorrista</strong> ou deixar o Teddy sem boné para exibir suas orelhas redondas.
                  </p>
                </div>
              )}

              {/* 2. ABA ROUPAS & COLETES */}
              {activeCategory === "roupa" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                      Modelo do Uniforme
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {MODELOS_ROUPA.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          aria-pressed={tempAvatar.roupaModelo === r.id}
                          onClick={() => setTempAvatar({ ...tempAvatar, roupaModelo: r.id as any })}
                          className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all cursor-pointer ${
                            tempAvatar.roupaModelo === r.id
                              ? "border-[color:var(--roxo)] bg-[color:var(--roxo)] text-white shadow-md ring-2 ring-white/50"
                              : "border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white"
                          }`}
                        >
                          {r.nome}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Seletor de Cores da Roupa */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                      Cor do Tecido
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CORES_ROUPA.map((cor) => (
                        <button
                          key={cor.id}
                          type="button"
                          aria-pressed={tempAvatar.roupaCor === cor.id}
                          onClick={() => setTempAvatar({ ...tempAvatar, roupaCor: cor.id as any })}
                          className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-semibold transition-transform hover:scale-105 cursor-pointer ${
                            tempAvatar.roupaCor === cor.id
                              ? "border-white ring-2 ring-[color:var(--amarelo)] bg-white/20 text-white"
                              : "border-transparent bg-white/5 text-white/70 hover:text-white"
                          }`}
                        >
                          <span
                            className="h-3 w-3 rounded-full border border-white/50"
                            style={{ backgroundColor: cor.hex }}
                          />
                          <span>{cor.nome}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. ABA MOCHILAS */}
              {activeCategory === "mochila" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                      Mochila de Equipamentos
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {MOCHILAS_TEDDY.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          aria-pressed={tempAvatar.mochilaModelo === m.id}
                          onClick={() => setTempAvatar({ ...tempAvatar, mochilaModelo: m.id as any })}
                          className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all cursor-pointer ${
                            tempAvatar.mochilaModelo === m.id
                              ? "border-[color:var(--roxo)] bg-[color:var(--roxo)] text-white shadow-md ring-2 ring-white/50"
                              : "border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white"
                          }`}
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-white/40 shrink-0"
                            style={{ backgroundColor: m.cor }}
                          />
                          <span>{m.nome}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                    💡 A <strong>Mochila Amarela SINAL</strong> é o modelo clássico do Teddy. Ao olhar o Teddy de costas, a mochila fica visível com todos os detalhes e zíperes; de frente, as alças passam sobre os ombros.
                  </p>
                </div>
              )}

              {/* 4. ABA ACESSÓRIOS EXTRAS */}
              {activeCategory === "acessorio" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                      Acessórios de Socorrista
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {ACESSORIOS_TEDDY.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          aria-pressed={tempAvatar.acessorio === a.id}
                          onClick={() => setTempAvatar({ ...tempAvatar, acessorio: a.id as any })}
                          className={`rounded-xl border px-3 py-2.5 text-center text-xs font-semibold transition-all cursor-pointer ${
                            tempAvatar.acessorio === a.id
                              ? "border-[color:var(--roxo)] bg-[color:var(--roxo)] text-white shadow-md ring-2 ring-white/50"
                              : "border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white"
                          }`}
                        >
                          {a.nome}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                    💡 O <strong>Crachá Oficial SINAL</strong> identifica o Teddy como socorristamirim capacitado em suporte inicial e emergência 192.
                  </p>
                </div>
              )}

              {/* 5. ABA PELAGEM DO URSO */}
              {activeCategory === "pelagem" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                      Tonalidade da Pelagem do Teddy
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PELAGEM_TEDDY.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          aria-pressed={tempAvatar.pelagemCor === p.id}
                          onClick={() => setTempAvatar({ ...tempAvatar, pelagemCor: p.id as any })}
                          className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all cursor-pointer ${
                            tempAvatar.pelagemCor === p.id
                              ? "border-[color:var(--roxo)] bg-[color:var(--roxo)] text-white shadow-md ring-2 ring-white/50"
                              : "border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white"
                          }`}
                        >
                          <span
                            className="h-4 w-4 rounded-full border-2 border-white/60 shrink-0"
                            style={{ backgroundColor: p.hex }}
                          />
                          <span>{p.nome}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                    🐻 A cor <strong>Caramelo SINAL</strong> é a pelagem canônica original criada para o mascote Teddy.
                  </p>
                </div>
              )}
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
