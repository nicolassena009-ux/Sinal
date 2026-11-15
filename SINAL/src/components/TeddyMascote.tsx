import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Teddy, type TeddyEstado } from "./Teddy";
import { Volume2, VolumeX, Sparkles, Play, Pause, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mascote 3D global integrado à narração e ao áudio                 */
/* ------------------------------------------------------------------ */

export interface ActiveNarration {
  title: string;
  text: string;
  audioSrc?: string | undefined;
  isPlaying: boolean;
  isPaused: boolean;
  togglePlay: () => void;
  stop: () => void;
}

export interface TeddyContextValue {
  estado: TeddyEstado;
  fala: string | null;
  setFala: (fala: string | null) => void;
  falando: boolean;

  /** Taxa de velocidade (0.5x a 2.0x) */
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;

  /** Volume geral do áudio (0.0 a 1.0) */
  volume: number;
  setVolume: (vol: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;

  /** Define o estado fixo */
  setEstado: (e: TeddyEstado) => void;

  /** Mostra uma mensagem educativa ou de feedback */
  falar: (texto: string, estado?: TeddyEstado, ms?: number) => void;

  /** Interrompe imediatamente e fecha o balão */
  calar: () => void;
  acertou: (texto?: string) => void;
  errou: (texto?: string) => void;
  comemorar: (texto?: string) => void;
  visivel: boolean;
  setVisivel: (v: boolean) => void;

  /** Sincroniza o Teddy com reprodutores de áudio da página */
  sincronizarAudio: (tocando: boolean, rate?: number) => void;

  /** Conexão direta bidirecional com a narração da página atual */
  narracaoAtiva: ActiveNarration | null;
  registrarNarracao: (narracao: ActiveNarration | null) => void;
  tocarNarracaoDaPagina: () => void;
}

const Ctx = createContext<TeddyContextValue | null>(null);

/** Toca um chime sonoro suave e alegre para o mascote */
function playTeddyChime(volume = 0.25) {
  if (volume <= 0) return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(0, now + i * 0.07);
      gain.gain.linearRampToValueAtTime(volume * 0.1, now + i * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.23);
    });
  } catch {
    // Silencioso se bloqueado por autoplay
  }
}

export function TeddyProvider({
  children,
  estadoInicial = "idle",
}: {
  children: ReactNode;
  estadoInicial?: TeddyEstado;
}) {
  const [base, setBase] = useState<TeddyEstado>(estadoInicial);
  const [temp, setTemp] = useState<TeddyEstado | null>(null);
  const [fala, setFala] = useState<string | null>(null);
  const [falando, setFalando] = useState(false);
  const [visivel, setVisivel] = useState(true);

  // Estados Globais de Velocidade e Volume
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);

  // Narração ativa conectada na página atual
  const [narracaoAtiva, setNarracaoAtiva] = useState<ActiveNarration | null>(null);

  const timer = useRef<number | undefined>(undefined);

  const registrarNarracao = useCallback((narracao: ActiveNarration | null) => {
    setNarracaoAtiva((prev) => {
      if (!prev && !narracao) return prev;
      if (
        prev &&
        narracao &&
        prev.title === narracao.title &&
        prev.text === narracao.text &&
        prev.audioSrc === narracao.audioSrc &&
        prev.isPlaying === narracao.isPlaying &&
        prev.isPaused === narracao.isPaused
      ) {
        return prev;
      }
      return narracao;
    });
  }, []);

  const tocarNarracaoDaPagina = useCallback(() => {
    if (narracaoAtiva) {
      narracaoAtiva.togglePlay();
    }
  }, [narracaoAtiva]);

  const limpar = useCallback(() => {
    window.clearTimeout(timer.current);
    setFalando(false);
    setTemp(null);
    setFala(null);
  }, []);

  const sincronizarAudio = useCallback((tocando: boolean, rate?: number) => {
    setFalando((prev) => (prev === tocando ? prev : tocando));
    if (typeof rate === "number") {
      setPlaybackRate((prev) => (Math.abs(prev - rate) < 0.01 ? prev : rate));
    }
    setTemp((prev) => {
      const next = tocando ? "explicando" : null;
      return prev === next ? prev : next;
    });
  }, []);

  const falar = useCallback(
    (texto: string, estado: TeddyEstado = "explicando", ms = 4500) => {
      window.clearTimeout(timer.current);
      setFala(texto);
      setTemp(estado);
      playTeddyChime(isMuted ? 0 : volume * 0.25);

      if (ms > 0) {
        timer.current = window.setTimeout(limpar, ms);
      }
    },
    [limpar, volume, isMuted]
  );

  const acertou = useCallback(
    (t = "Acertou! Muito bem!") => falar(t, "comemorando", 3800),
    [falar]
  );
  const errou = useCallback(
    (t = "Quase! Vamos tentar de novo?") => falar(t, "preocupado", 4000),
    [falar]
  );
  const comemorar = useCallback(
    (t = "Você está preparado para ajudar e salvar vidas!") => falar(t, "comemorando", 5000),
    [falar]
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const value = useMemo<TeddyContextValue>(
    () => ({
      estado: temp ?? base,
      fala,
      setFala,
      falando,
      playbackRate,
      setPlaybackRate,
      volume,
      setVolume,
      isMuted,
      setIsMuted,
      setEstado: setBase,
      falar,
      calar: limpar,
      acertou,
      errou,
      comemorar,
      visivel,
      setVisivel,
      sincronizarAudio,
      narracaoAtiva,
      registrarNarracao,
      tocarNarracaoDaPagina,
    }),
    [
      temp,
      base,
      fala,
      falando,
      playbackRate,
      volume,
      isMuted,
      falar,
      limpar,
      acertou,
      errou,
      comemorar,
      visivel,
      sincronizarAudio,
      narracaoAtiva,
      registrarNarracao,
      tocarNarracaoDaPagina,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTeddy(): TeddyContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTeddy precisa estar dentro de <TeddyProvider>");
  return v;
}

const DICAS_EDUCATIVAS_TEDDY = [
  "Em qualquer emergência no Brasil, ligue imediatamente: SAMU 192 ou Bombeiros 193! 💜",
  "Mantenha a calma e respire fundo! Reconhecer os sinais a tempo salva vidas.",
  "Se alguém desmaiar, engasgar ou passar mal, chame logo um adulto de confiança!",
  "Segurança em primeiro lugar, sempre! Estou aqui com você para te apoiar!",
  "Aprender os primeiros socorros é um superpoder para proteger quem você ama!",
];

/** Teddy 3D fixo no canto da tela, integrado à narração com balão e poses 3D */
export function TeddyMascote({
  tamanho = 190,
  canto = "direita",
  mensagemInicial = null,
}: {
  tamanho?: number;
  canto?: "direita" | "esquerda";
  mensagemInicial?: string | null;
}) {
  const {
    estado,
    fala,
    setFala,
    falando,
    calar,
    visivel,
    setVisivel,
    playbackRate,
    narracaoAtiva,
    tocarNarracaoDaPagina,
  } = useTeddy();

  const [narrow, setNarrow] = useState(false);
  const dicaIdxRef = useRef(0);
  const timerLocal = useRef<number | undefined>(undefined);

  useEffect(() => {
    const on = () => setNarrow(window.innerWidth < 640);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  useEffect(() => {
    if (!mensagemInicial) return;
    setFala(mensagemInicial);
    const id = window.setTimeout(() => setFala(null), 5000);
    return () => window.clearTimeout(id);
    // só na primeira montagem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickTeddy = () => {
    // 1. Se a página atual possui narração (ex: tema, missão), clica no Teddy e ele inicia/pausa o áudio do tema!
    if (narracaoAtiva) {
      tocarNarracaoDaPagina();
      return;
    }

    // 2. Se não houver narração na tela atual, exibe dica educativa no balão e faz animação 3D sem voz robótica
    const dica = DICAS_EDUCATIVAS_TEDDY[dicaIdxRef.current % DICAS_EDUCATIVAS_TEDDY.length];
    dicaIdxRef.current += 1;
    setFala(dica);
    playTeddyChime();

    window.clearTimeout(timerLocal.current);
    timerLocal.current = window.setTimeout(() => setFala(null), 5000);
  };

  const lado = canto === "direita" ? { right: 12 } : { left: 12 };
  const size = narrow ? Math.round(tamanho * 0.72) : tamanho;

  if (!visivel) {
    return (
      <button
        onClick={() => setVisivel(true)}
        aria-label="Chamar o Teddy"
        className="fixed bottom-4 z-60 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--roxo)] text-white shadow-[0_6px_20px_rgba(91,45,182,0.45)] transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        style={lado}
      >
        <span className="text-2xl">🧸</span>
      </button>
    );
  }

  const textoExibicao = fala || (narracaoAtiva?.isPlaying ? `Narrando: ${narracaoAtiva.title} 🎧` : null);

  return (
    <div style={{ position: "fixed", bottom: 0, ...lado, zIndex: 60, pointerEvents: "none" }}>
      {/* Balão de fala interativo com o tema da página */}
      {textoExibicao && (
        <div
          role="status"
          aria-live="polite"
          style={{
            pointerEvents: "auto",
            position: "absolute",
            bottom: Math.round(size * 1.25) - 4,
            [canto === "direita" ? "right" : "left"]: 6,
            width: Math.min(320, (typeof window !== "undefined" ? window.innerWidth : 360) - 36),
            background: "linear-gradient(135deg, #6D3FC3 0%, #5227AC 100%)",
            color: "#ffffff",
            borderRadius: 20,
            padding: "12px 16px",
            fontFamily: "Nunito, system-ui, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            lineHeight: 1.45,
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow: "0 14px 34px rgba(109,63,195,0.42), 0 2px 8px rgba(0,0,0,0.12)",
            cursor: "pointer",
          }}
          onClick={narracaoAtiva?.isPlaying ? narracaoAtiva.togglePlay : calar}
          title={narracaoAtiva?.isPlaying ? "Clique para pausar narração" : "Clique para fechar balão"}
        >
          <div className="flex items-center justify-between text-[11px] font-display font-extrabold uppercase tracking-wide opacity-95 pb-1 mb-1.5 border-b border-white/20">
            <span className="flex items-center gap-1.5 text-white">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--amarelo)]" />
              {narracaoAtiva?.isPlaying || fala ? "Teddy Narrando:" : "Dica do Teddy:"}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              {playbackRate !== 1.0 && (
                <span className="rounded bg-black/25 px-1.5 py-0.5 text-[color:var(--amarelo)] font-bold">
                  {playbackRate}x
                </span>
              )}
              {falando ? (
                <span className="flex items-center gap-1 text-[color:var(--amarelo)] font-bold">
                  <Volume2 className="h-3 w-3 animate-pulse" />
                  <span>{narracaoAtiva ? "Pausar" : "Silenciar"}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 opacity-80">
                  <Play className="h-2.5 w-2.5" />
                  <span>Continuar</span>
                </span>
              )}
            </div>
          </div>

          <p className="line-clamp-6 text-[13px] leading-relaxed select-text font-medium text-white/95">{textoExibicao}</p>

          <span
            style={{
              position: "absolute",
              bottom: -9,
              [canto === "direita" ? "right" : "left"]: size * 0.3,
              width: 0,
              height: 0,
              borderLeft: "9px solid transparent",
              borderRight: "9px solid transparent",
              borderTop: "10px solid #5227AC",
            }}
          />
        </div>
      )}

      {/* Mascote Teddy 3D interativo */}
      <div style={{ pointerEvents: "auto", position: "relative" }}>
        <Teddy
          estado={estado}
          tamanho={size}
          onClick={handleClickTeddy}
        />
        <button
          onClick={() => setVisivel(false)}
          aria-label="Ocultar o Teddy"
          title="Ocultar o Teddy"
          className="absolute top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--roxo)]/85 text-white shadow-md backdrop-blur-xs transition-all hover:bg-[color:var(--roxo)] hover:scale-110 active:scale-95 cursor-pointer"
          style={{ [canto === "direita" ? "right" : "left"]: 6 }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
