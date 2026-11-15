import { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";

const DICAS_TEDDY = [
  "Oi! Eu sou o Teddy! Pronto para aprender? 💜",
  "Segurança em primeiro lugar, sempre!",
  "Chame um adulto de confiança em qualquer emergência.",
  "No Brasil: SAMU é 192 e Bombeiros é 193!",
  "Você está indo muito bem! Vamos praticar uma missão?",
  "Reconhecer um sinal a tempo salva vidas!",
  "Dica do Teddy: mantenha a calma e respire fundo!",
];

// Quadros de animação contínua do tchauzinho (aceno fluido)
const WAVE_FRAMES = [
  "/teddy/teddy-wave.webp",
  "/teddy/teddy-wave-2.webp",
  "/teddy/teddy-wave.webp",
  "/teddy/teddy-wave-3.webp",
];

export function TeddyCompanion() {
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isThumbsUp, setIsThumbsUp] = useState(false);
  const [waveFrameIdx, setWaveFrameIdx] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  // Animação fluida e contínua do tchauzinho (troca dinâmica de quadros de aceno)
  useEffect(() => {
    if (isThumbsUp) return;

    const interval = window.setInterval(() => {
      setWaveFrameIdx((prev) => (prev + 1) % WAVE_FRAMES.length);
    }, 220); // Cadência natural de aceno de mão

    return () => window.clearInterval(interval);
  }, [isThumbsUp]);

  const handleClick = () => {
    // Ao clicar, o Teddy faz o sinal de joinha e dá um pulinho alegre!
    setIsThumbsUp(true);

    const randomTip = DICAS_TEDDY[Math.floor(Math.random() * DICAS_TEDDY.length)];
    setBubbleText(randomTip);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setBubbleText(null);
      setIsThumbsUp(false); // Retorna suavemente para o tchauzinho animado
    }, 4200);
  };

  const currentImage = isThumbsUp
    ? "/teddy/teddy-thumbs.webp"
    : WAVE_FRAMES[waveFrameIdx];

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end print:hidden">
      {/* Balão de fala estilo HQ animado */}
      {bubbleText && (
        <div
          className="mr-2 mb-3 max-w-[240px] rounded-2xl rounded-br-xs border-2 border-[color:var(--roxo)]/30 bg-white/95 p-3.5 font-display text-xs font-bold text-gray-900 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-300 dark:bg-gray-900/95 dark:text-white"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-1.5 text-[color:var(--roxo)] font-black uppercase text-[10px] tracking-wider mb-1">
            <Sparkles className="h-3 w-3 animate-spin text-[color:var(--amarelo)]" />
            <span>Teddy diz:</span>
          </div>
          <p className="leading-relaxed">{bubbleText}</p>
        </div>
      )}

      {/* Botão flutuante animado do Teddy */}
      <button
        type="button"
        onClick={handleClick}
        className="group relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-3 border-white bg-gradient-to-tr from-[#ede4ff] via-[#f9f5ff] to-[#e6f4ff] p-1 shadow-[0_10px_35px_rgba(109,63,195,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 focus-visible:outline-3 focus-visible:outline-[color:var(--roxo)]"
        aria-label="Falar com Teddy, o companheiro do Sinal"
        title="Clique para falar com o Teddy!"
      >
        {/* Anel de brilho pulsante */}
        <span
          className="absolute -inset-1 rounded-full bg-gradient-to-r from-[color:var(--roxo)] to-[color:var(--aqua)] opacity-40 blur-sm group-hover:opacity-75 transition-opacity duration-300 animate-pulse"
          aria-hidden="true"
        />

        {/* Teddy com Tchauzinho animado contínuo */}
        <div
          className={`relative z-10 h-full w-full overflow-hidden rounded-full transition-transform duration-300 ${
            isThumbsUp ? "scale-105" : "hover:scale-105"
          }`}
        >
          <img
            key={currentImage}
            src={currentImage}
            alt="Teddy animado dando tchauzinho"
            className="h-full w-full object-cover object-top scale-110 drop-shadow-md transition-opacity duration-150"
            loading="eager"
          />
        </div>

        {/* Tagzinha de aceno interativa */}
        <div
          className="absolute -top-1 -left-2 z-20 flex items-center gap-1 rounded-full bg-[color:var(--roxo)] px-2.5 py-0.5 font-display text-[10px] font-extrabold text-white shadow-md transition-transform group-hover:scale-110"
          aria-hidden="true"
        >
          <span>{isThumbsUp ? "Boa! 👍" : "Tchauzinho! 👋"}</span>
        </div>

        <span className="sr-only">Interagir com Teddy</span>
      </button>
    </div>
  );
}
