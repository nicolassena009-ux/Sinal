import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Teddy3D, type TeddyAnimationMode } from "@/components/Teddy3D";
import { PRATICA_POR_TEMA } from "@/data/missoes";
import { launchConfetti } from "@/lib/confetti";
import { saveMissionAttempt } from "@/lib/sinalStore";
import { useTeddy } from "@/components/TeddyMascote";
import { Sparkles, CheckCircle2, AlertCircle, RotateCcw, ArrowRight } from "lucide-react";

interface PraticaInterativaProps {
  slug: string;
  cor: string;
  temaNome: string;
}

export function PraticaInterativa({ slug, cor, temaNome }: PraticaInterativaProps) {
  const teddy = useTeddy();
  const missao = PRATICA_POR_TEMA[slug];

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [teddyMode, setTeddyMode] = useState<TeddyAnimationMode>("idle");
  const [starsAwarded, setStarsAwarded] = useState<number | null>(null);

  if (!missao) return null;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setSelectedIdx(index);
    setIsAnswered(true);

    const isCorrect = index === missao.correta;

    if (isCorrect) {
      teddy.acertou();
      setTeddyMode("celebrate");
      launchConfetti(1800);
      const result = saveMissionAttempt("kids", 0, true);
      setStarsAwarded(result.isFirstSuccess ? 3 : 1);
    } else {
      teddy.errou();
      setTeddyMode("sad");
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setIsAnswered(false);
    setTeddyMode("idle");
    setStarsAwarded(null);
  };

  const isCorrect = selectedIdx === missao.correta;

  return (
    <section
      aria-labelledby="pratica-titulo"
      className="relative overflow-hidden rounded-3xl border-2 p-6 sm:p-10 shadow-[var(--sombra-suave)]"
      style={{
        borderColor: `${cor}66`,
        background: `linear-gradient(145deg, var(--card) 0%, ${cor}10 100%)`,
      }}
    >
      <span
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: cor }}
        aria-hidden="true"
      />

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <span
            className="inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: cor }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Hora de praticar • Simulação de {temaNome}
          </span>
          <h2 id="pratica-titulo" className="mt-1 font-display text-2xl font-extrabold sm:text-3xl text-foreground">
            {missao.titulo}
          </h2>
        </div>

        <Link
          to="/jogos"
          search={{ tema: slug }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-4 py-2 font-display text-xs font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-muted hover:scale-105"
        >
          Hora de praticar
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-6 grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="rounded-2xl bg-muted/40 p-4 border border-border/50 text-sm text-foreground">
            <span className="font-bold text-foreground block mb-1">Cenário:</span>
            {missao.cenario}
          </div>

          <h3 className="mt-5 font-display text-lg font-bold text-foreground">
            {missao.pergunta}
          </h3>

          <div className="mt-4 space-y-2.5">
            {missao.opcoes.map((opcao, i) => {
              const letter = String.fromCharCode(65 + i);
              let btnStyle = "border-border/60 bg-card hover:border-[color:var(--roxo)] hover:bg-muted/40";

              if (isAnswered) {
                if (i === missao.correta) {
                  btnStyle = "border-[color:var(--aqua)] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold ring-2 ring-[color:var(--aqua)]";
                } else if (i === selectedIdx) {
                  btnStyle = "border-[color:var(--rosa)] bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 line-through opacity-85";
                } else {
                  btnStyle = "border-border/40 opacity-50 bg-card";
                }
              }

              return (
                <button
                  key={opcao}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(i)}
                  className={`flex w-full items-start gap-3 rounded-2xl border-2 p-3.5 text-left text-sm transition-all ${btnStyle}`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-display text-xs font-extrabold ${
                      isAnswered && i === missao.correta
                        ? "bg-[color:var(--aqua)] text-[color:var(--tinta)]"
                        : isAnswered && i === selectedIdx
                        ? "bg-[color:var(--rosa)] text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="flex-1">{opcao}</span>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div
              className={`mt-6 rounded-2xl p-5 border-2 animate-in fade-in duration-300 ${
                isCorrect
                  ? "border-[color:var(--aqua)] bg-emerald-50/90 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100"
                  : "border-[color:var(--rosa)] bg-rose-50/90 text-rose-950 dark:bg-rose-950/60 dark:text-rose-100"
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="h-6 w-6 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                )}
                <div>
                  <h4 className="font-display text-base font-extrabold">
                    {isCorrect ? "Muito bem! Decisão correta e segura! 🎉" : "Quase lá! Vamos pensar em segurança 💜"}
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm opacity-90 leading-relaxed">
                    {missao.explicacao}
                  </p>

                  {isCorrect && starsAwarded && (
                    <p className="mt-2 inline-flex items-center gap-1.5 font-display text-xs font-extrabold text-amber-700 dark:text-amber-300">
                      ⭐ +{starsAwarded} estrelas adicionadas ao seu progresso!
                    </p>
                  )}

                  {!isCorrect && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--roxo)] px-4 py-2 font-display text-xs font-bold text-white transition-transform hover:scale-105"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Tentar de novo
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Palco do Teddy 3D */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative h-60 w-60 sm:h-72 sm:w-72">
            <Teddy3D
              mode={teddyMode}
              allowLook={true}
              interactive={true}
              cameraDistance={5.0}
              cameraHeight={0.05}
              className="h-full w-full"
            />
          </div>
          <p className="mt-2 font-display text-xs font-bold text-muted-foreground">
            Teddy • Companheiro interativo do Sinal
          </p>
        </div>
      </div>
    </section>
  );
}
