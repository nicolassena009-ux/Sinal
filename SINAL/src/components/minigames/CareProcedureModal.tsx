import { useState, useEffect } from "react";
import type { AvatarConfig } from "@/types/minigame";
import {
  Apple,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export interface CareProcedureProps {
  themeSlug: string;
  levelNumber: number;
  track: "kids" | "teens";
  avatar: AvatarConfig;
  onComplete: () => void;
  onCancel: () => void;
}

export function CareProcedureModal({
  themeSlug,
  levelNumber,
  track,
  onComplete,
  onCancel,
}: CareProcedureProps) {
  // Passos do procedimento de engasgo
  // Fase 1: Obstrução Parcial (Tosse Eficaz)
  // Fase 2: Obstrução Grave (Tosse Ineficaz / Ausente -> Manobra de Desobstrução e 192)
  const isSevere = levelNumber === 2;

  const [stepIndex, setStepIndex] = useState(0);
  const [compressionsCount, setCompressionsCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string>("");

  const requiredCompressions = 5;

  // Feedback de áudio/vibração tátil quando suportado
  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(50);
      } catch {}
    }
  };

  // 1. AÇÃO: Incentivar a tosse (Fase 1)
  const handleIncentivarTosse = () => {
    setIsAnimating(true);
    triggerHaptic();
    setActionFeedback("Teddy: 'Força Lucas! Continue tossindo firme!'");
    setTimeout(() => {
      setIsAnimating(false);
      setStepIndex(1);
    }, 900);
  };

  // 2. AÇÃO: Chamar professora / adulto (Fase 1 e Fase 2)
  const handleChamarAdulto = () => {
    setIsAnimating(true);
    triggerHaptic();
    setActionFeedback(
      track === "kids"
        ? "Você chamou a professora! Ela já está ao lado para acompanhar."
        : "Professora avisada e prestando suporte imediato ao atendimento.",
    );
    setTimeout(() => {
      setIsAnimating(false);
      setStepIndex((prev) => prev + 1);
    }, 900);
  };

  // 3. AÇÃO: Ligar para SAMU 192 no viva-voz (Fase 2)
  const handleAcionar192 = () => {
    setIsAnimating(true);
    triggerHaptic();
    setActionFeedback("192 acionado no viva-voz! O atendente do SAMU está orientando as manobras.");
    setTimeout(() => {
      setIsAnimating(false);
      setStepIndex(1);
    }, 1000);
  };

  // 4. AÇÃO: Posicionar as mãos para manobra de Heimlich (Fase 2)
  const handlePosicionarMaos = () => {
    setIsAnimating(true);
    triggerHaptic();
    setActionFeedback(
      track === "kids"
        ? "Teddy e a professora posicionam o apoio com calma, mantendo a postura correta."
        : "Mão fechada com polegar acima do umbigo e abaixo do peito. Outra mão sobreposta firme.",
    );
    setTimeout(() => {
      setIsAnimating(false);
      setStepIndex(2);
    }, 900);
  };

  // 5. AÇÃO: Executar compressão abdominal em J (Fase 2)
  const handleExecutarCompressao = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    triggerHaptic();

    const nextCount = compressionsCount + 1;
    setCompressionsCount(nextCount);
    setActionFeedback(`Impulso rápido para dentro e para cima (${nextCount}/${requiredCompressions})!`);

    setTimeout(() => {
      setIsAnimating(false);
      if (nextCount >= requiredCompressions) {
        setStepIndex(3); // Desobstruído com sucesso!
      }
    }, 350);
  };

  // 6. Conclusão com sucesso
  const handleFinalizar = () => {
    onComplete();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="care-title"
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#090E1A]/95 backdrop-blur-md p-4 select-none animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg rounded-3xl border-2 border-[color:var(--azul)]/50 bg-[#111A2E] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between max-h-[92vh] overflow-y-auto">
        {/* Cabeçalho do Procedimento */}
        <div className="border-b border-white/10 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--azul)] text-white shadow-xs">
              <Apple className="h-5 w-5" />
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[color:var(--amarelo)] block">
                {isSevere ? "Obstrução Total (Grave)" : "Obstrução Parcial (Tosse Forte)"} •{" "}
                {track === "kids" ? "Sinal Kids" : "Sinal Teens"}
              </span>
              <h2 id="care-title" className="font-display text-lg sm:text-xl font-extrabold text-white">
                Socorro a Lucas no Refeitório
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80 hover:bg-white/20 transition-colors"
          >
            Voltar
          </button>
        </div>

        {/* Palco Visual do Atendimento em Close-up 2.5D */}
        <div className="my-4 rounded-2xl border border-white/15 bg-gradient-to-b from-[#1E293B]/70 to-[#0F172A]/90 p-4 text-center relative overflow-hidden">
          {/* Luz de foco no atendimento */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-32 w-48 rounded-full bg-[color:var(--azul)]/20 blur-2xl pointer-events-none" />

          {/* Ilustração animada dos personagens */}
          <div className="relative h-28 flex items-center justify-center gap-6">
            {/* Teddy */}
            <div
              className={`flex flex-col items-center transition-transform duration-200 ${
                isAnimating ? "scale-105 -translate-y-1" : ""
              }`}
            >
              <div className="relative h-16 w-16 flex items-center justify-center">
                {/* Visual do Teddy prestando socorro */}
                <span className="text-5xl drop-shadow-md">🧸</span>
                {isAnimating && (
                  <span className="absolute -top-2 -right-1 text-xs animate-bounce font-bold text-[color:var(--amarelo)]">
                    ✦
                  </span>
                )}
              </div>
              <span className="text-[11px] font-extrabold text-white/90">Teddy</span>
            </div>

            {/* Lucas (Vítima) */}
            <div
              className={`flex flex-col items-center transition-transform duration-200 ${
                isAnimating ? "translate-x-0.5" : ""
              }`}
            >
              <div className="relative h-16 w-16 flex items-center justify-center">
                {/* Lucas com expressão conforme o estágio */}
                {stepIndex === 3 || (!isSevere && stepIndex === 2) ? (
                  <span className="text-5xl drop-shadow-md">😊</span>
                ) : isSevere ? (
                  <span className="text-5xl drop-shadow-md">😨</span>
                ) : (
                  <span className="text-5xl drop-shadow-md">😣</span>
                )}

                {/* Partículas de tosse ou alimento expelido */}
                {isAnimating && (
                  <span className="absolute -right-4 top-2 text-xs font-bold text-[color:var(--aqua)] animate-ping">
                    💨
                  </span>
                )}
              </div>
              <span className="text-[11px] font-extrabold text-white/90">Lucas</span>
            </div>
          </div>

          {/* Feedback dinâmico da ação */}
          <div className="mt-2 min-h-[24px]">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[color:var(--amarelo)]">
              {actionFeedback ||
                (isSevere
                  ? "Lucas não consegue tossir nem falar! A passagem de ar está bloqueada."
                  : "Lucas está tossindo forte com as mãos no pescoço.")}
            </span>
          </div>
        </div>

        {/* =========================================================================
            FLUXO DA FASE 1: OBSTRUÇÃO PARCIAL (TOSSE EFICAZ)
           ========================================================================= */}
        {!isSevere && (
          <div className="space-y-3">
            {stepIndex === 0 && (
              <div className="space-y-3">
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-3 text-xs text-blue-200 leading-relaxed">
                  <strong>Protocolo Médico (AHA/PALS):</strong> Quando a pessoa consegue tossir com
                  força e emitir som, a tosse espontânea é o melhor mecanismo do corpo. Nunca dê água
                  ou pão e nunca bata nas costas às cegas.
                </div>
                <button
                  type="button"
                  onClick={handleIncentivarTosse}
                  disabled={isAnimating}
                  className="w-full rounded-2xl bg-[color:var(--azul)] py-3 font-display text-sm font-extrabold text-white shadow-md hover:bg-blue-600 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-[color:var(--amarelo)]" />
                  <span>1. Incentivar Lucas a continuar tossindo forte</span>
                </button>
              </div>
            )}

            {stepIndex === 1 && (
              <div className="space-y-3">
                <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 p-3 text-xs text-purple-200 leading-relaxed">
                  {track === "kids"
                    ? "Excelente! Agora, chame a professora na hora para ficar junto e acompanhar até passar."
                    : "Lucas continua tossindo. Chame o adulto responsável pelo refeitório para suporte e monitoramento."}
                </div>
                <button
                  type="button"
                  onClick={handleChamarAdulto}
                  disabled={isAnimating}
                  className="w-full rounded-2xl bg-[color:var(--roxo)] py-3 font-display text-sm font-extrabold text-white shadow-md hover:bg-purple-700 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>2. Avisar a Professora do Refeitório</span>
                </button>
              </div>
            )}

            {stepIndex === 2 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/40 p-3.5 text-xs text-emerald-200 leading-relaxed">
                  <div className="flex items-center gap-2 font-display text-sm font-extrabold text-emerald-300 mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Engasgo Resolvido com Segurança!</span>
                  </div>
                  Lucas conseguiu expelir o alimento tossindo com força ao lado da professora e do
                  Teddy. A via aérea está livre e ele respira aliviado.
                </div>
                <button
                  type="button"
                  onClick={handleFinalizar}
                  className="w-full rounded-2xl bg-emerald-500 py-3 font-display text-sm font-extrabold text-white shadow-md hover:bg-emerald-600 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Concluir Missão e Celebrar 🎉</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            FLUXO DA FASE 2: OBSTRUÇÃO TOTAL (MANOBRA DE HEIMLICH E 192)
           ========================================================================= */}
        {isSevere && (
          <div className="space-y-3">
            {stepIndex === 0 && (
              <div className="space-y-3">
                <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 p-3 text-xs text-rose-200 leading-relaxed">
                  <strong>Emergência Crítica (Lei Lucas / AHA):</strong> A tosse parou completamente!
                  Lucas não emite som algum e leva as mãos ao pescoço. Primeiro passo: pedir socorro e
                  acionar o 192 no viva-voz imediatamente.
                </div>
                <button
                  type="button"
                  onClick={handleAcionar192}
                  disabled={isAnimating}
                  className="w-full rounded-2xl bg-[color:var(--rosa)] py-3 font-display text-sm font-extrabold text-white shadow-md hover:bg-rose-600 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>1. Acionar SAMU 192 no Viva-Voz e Chamar Adulto</span>
                </button>
              </div>
            )}

            {stepIndex === 1 && (
              <div className="space-y-3">
                <div className="rounded-xl bg-amber-500/15 border border-amber-500/30 p-3 text-xs text-amber-200 leading-relaxed">
                  <strong>Posicionamento da Manobra de Heimlich:</strong> Ficar atrás da pessoa,
                  fechar uma das mãos com o polegar acima do umbigo e bem abaixo do tórax, abraçando
                  com a outra mão.
                </div>
                <button
                  type="button"
                  onClick={handlePosicionarMaos}
                  disabled={isAnimating}
                  className="w-full rounded-2xl bg-[color:var(--azul)] py-3 font-display text-sm font-extrabold text-white shadow-md hover:bg-blue-600 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="h-4 w-4 text-[color:var(--amarelo)]" />
                  <span>2. Posicionar as Mãos para a Manobra</span>
                </button>
              </div>
            )}

            {stepIndex === 2 && (
              <div className="space-y-3">
                <div className="rounded-xl bg-purple-500/15 border border-purple-500/30 p-3 text-xs text-purple-200 leading-relaxed">
                  <strong>Execução em J:</strong> Realize impulsos rápidos e firmes para dentro e
                  para cima. Clique no botão abaixo para aplicar cada impulso com ritmo.
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-white/80 px-1">
                  <span>Progresso dos Impulsos:</span>
                  <span className="text-[color:var(--amarelo)]">
                    {compressionsCount} de {requiredCompressions} impulsos
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[color:var(--azul)] to-[color:var(--amarelo)] transition-all duration-300"
                    style={{ width: `${(compressionsCount / requiredCompressions) * 100}%` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleExecutarCompressao}
                  disabled={isAnimating}
                  className="w-full rounded-2xl bg-gradient-to-r from-[color:var(--roxo)] to-[color:var(--azul)] py-3.5 font-display text-sm font-extrabold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="h-5 w-5 text-[color:var(--amarelo)]" />
                  <span>
                    {compressionsCount === 0
                      ? "3. Aplicar 1º Impulso para Dentro e para Cima"
                      : `Aplicar ${compressionsCount + 1}º Impulso em J`}
                  </span>
                </button>
              </div>
            )}

            {stepIndex === 3 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/40 p-3.5 text-xs text-emerald-200 leading-relaxed">
                  <div className="flex items-center gap-2 font-display text-sm font-extrabold text-emerald-300 mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Obstrução Desfeita! Via Aérea Livre!</span>
                  </div>
                  O corpo estranho foi expelido com os impulsos em J! Lucas voltou a respirar com
                  fôlego, o ar retornou aos pulmões e a atendente do SAMU foi informada no viva-voz
                  que a vítima está consciente e segura.
                </div>
                <button
                  type="button"
                  onClick={handleFinalizar}
                  className="w-full rounded-2xl bg-emerald-500 py-3 font-display text-sm font-extrabold text-white shadow-md hover:bg-emerald-600 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Concluir Missão e Salvar Progresso 🎉</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Rodapé Educativo */}
        <div className="mt-4 border-t border-white/10 pt-2.5 text-[10px] text-white/60 text-center">
          <span>
            Simulação didática com base nas Diretrizes da American Heart Association (AHA) e Lei
            Lucas (13.722/2018).
          </span>
        </div>
      </div>
    </div>
  );
}

