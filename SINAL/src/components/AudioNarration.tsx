import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Volume2,
  Volume1,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Gauge,
  Minus,
  Plus,
} from "lucide-react";
import { useTeddy } from "@/components/TeddyMascote";

export interface LegendaAudio {
  inicio: number;
  fim: number;
  texto: string;
}

interface AudioNarrationProps {
  text: string;
  title?: string | undefined;
  audioSrc?: string | undefined;
  legendas?: LegendaAudio[] | undefined;
  className?: string | undefined;
}

export const SPEED_OPTIONS = [
  { value: 0.5, label: "0.5x", desc: "Mais lento" },
  { value: 0.75, label: "0.75x", desc: "Lento" },
  { value: 1.0, label: "1.0x", desc: "Normal" },
  { value: 1.25, label: "1.25x", desc: "Dinâmico" },
  { value: 1.5, label: "1.5x", desc: "Rápido" },
  { value: 2.0, label: "2.0x", desc: "2x Rápido" },
];

/**
 * Normaliza o texto para narração por voz natural:
 * - Evita cortes bruscos e pausas artificiais em títulos curtos (ex: "Parada cardiorrespiratória")
 * - Converte siglas e números para pronúncia fluida em português brasileiro
 * - Agrupa em frases completas e agradáveis
 */
function normalizeTextForSpeech(rawText: string): string[] {
  if (!rawText) return [];

  const text = rawText
    .replace(/[#*•✓✕→\-_]/g, " ")
    .replace(/SAMU\s*192/gi, "SAMU, 1 9 2")
    .replace(/\b192\b/g, "1 9 2")
    .replace(/Bombeiros\s*193/gi, "Bombeiros, 1 9 3")
    .replace(/\b193\b/g, "1 9 3")
    .replace(/\b190\b/g, "1 9 0")
    .replace(/(\d+)\s*[–-]\s*(\d+)\s*anos/gi, "$1 a $2 anos")
    .replace(/\bmin\.\b/gi, "minutos")
    .replace(/\bseg\.\b/gi, "segundos")
    .replace(/\s+/g, " ")
    .trim();

  const rawSentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const mergedChunks: string[] = [];
  let buffer = "";

  for (let i = 0; i < rawSentences.length; i++) {
    const s = rawSentences[i];

    if (!buffer) {
      buffer = s;
    } else if (buffer.length < 55 && !/[?!]/.test(buffer)) {
      const cleanPrev = buffer.replace(/[.:;]$/, "");
      const lowerNext = s.charAt(0).toLowerCase() + s.slice(1);
      buffer = `${cleanPrev}: ${lowerNext}`;
    } else if (buffer.length + s.length < 240) {
      buffer = `${buffer} ${s}`;
    } else {
      mergedChunks.push(buffer);
      buffer = s;
    }
  }

  if (buffer) {
    mergedChunks.push(buffer);
  }

  return mergedChunks.length > 0 ? mergedChunks : [text];
}

/**
 * Divide o texto do tema em frases/trechos legíveis para exibição no balão do Teddy.
 * Cada trecho possui tamanho confortável para leitura (~60 a 140 caracteres).
 */
function splitIntoReadingChunks(rawText: string): string[] {
  if (!rawText) return [];

  const text = rawText
    .replace(/[#*•✓✕→\-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const rawSentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const chunks: string[] = [];
  let buffer = "";

  for (const s of rawSentences) {
    if (!buffer) {
      buffer = s;
    } else if (buffer.length + s.length < 140) {
      buffer = `${buffer} ${s}`;
    } else {
      chunks.push(buffer);
      buffer = s;
    }
  }

  if (buffer) {
    chunks.push(buffer);
  }

  return chunks.length > 0 ? chunks : [text];
}

export function AudioNarration({
  text,
  title = "Se preferir, escute",
  audioSrc,
  legendas,
  className = "",
}: AudioNarrationProps) {
  let teddyCtx: ReturnType<typeof useTeddy> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    teddyCtx = useTeddy();
  } catch {
    // seguro caso usado fora de <TeddyProvider>
  }

  const [supported, setSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Sincroniza velocidade e volume com o contexto global do Teddy
  const [playbackRate, setPlaybackRateState] = useState(1.0);
  const setPlaybackRate = useCallback(
    (r: number) => {
      setPlaybackRateState(r);
      teddyCtx?.setPlaybackRate(r);
    },
    [teddyCtx]
  );

  // Sincroniza taxa inicial se o contexto já tiver um valor diferente
  useEffect(() => {
    if (teddyCtx?.playbackRate && Math.abs(teddyCtx.playbackRate - playbackRate) > 0.05) {
      setPlaybackRateState(teddyCtx.playbackRate);
    }
  }, [teddyCtx?.playbackRate]);

  const volume = teddyCtx?.volume ?? 1.0;
  const setVolume = (v: number) => {
    teddyCtx?.setVolume(v);
  };

  const isMuted = teddyCtx?.isMuted ?? false;
  const setIsMuted = (m: boolean) => {
    teddyCtx?.setIsMuted(m);
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speedMenuRef = useRef<HTMLDivElement | null>(null);
  const synthSpeakingRef = useRef(false);
  const synthChunkIndexRef = useRef(0);
  const synthChunksRef = useRef<string[]>([]);
  const keepAliveIntervalRef = useRef<number | null>(null);
  const lastFalaRef = useRef<string>("");
  const speakNextChunkRef = useRef<(() => void) | null>(null);

  // Fecha menu de velocidade ao clicar fora
  useEffect(() => {
    if (!showSpeedMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target as Node)) {
        setShowSpeedMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSpeedMenu]);

  // Trechos de texto para exibir sincronizadamente no balão do mascote Teddy
  const textChunks = useMemo(() => splitIntoReadingChunks(text), [text]);

  // Pré-computa as faixas proporcionais (start -> end de 0.0 a 1.0) para cada trecho
  const chunkBoundaries = useMemo(() => {
    if (textChunks.length === 0) return [];
    const totalChars = textChunks.reduce((acc, c) => acc + Math.max(1, c.length), 0) || 1;
    let accumulated = 0;
    return textChunks.map((c) => {
      const start = accumulated / totalChars;
      accumulated += Math.max(1, c.length);
      const end = accumulated / totalChars;
      return { text: c, start, end };
    });
  }, [textChunks]);

  const chunkBoundariesRef = useRef(chunkBoundaries);
  useEffect(() => {
    chunkBoundariesRef.current = chunkBoundaries;
  }, [chunkBoundaries]);

  // Inicialização e suporte a áudio
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (audioSrc || "speechSynthesis" in window) {
        setSupported(true);
      }
    }

    return () => {
      cleanupPlayback();
    };
  }, [audioSrc]);

  // Se audioSrc mudar enquanto toca, reinicia limpo
  useEffect(() => {
    cleanupPlayback();
  }, [audioSrc]);

  // Atualiza taxa de velocidade dinamicamente no áudio HTML5 sem pausar e sem reiniciar
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Atualiza volume dinamicamente no áudio HTML5
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sincroniza o Teddy com o status de reprodução do áudio e velocidade da boca
  useEffect(() => {
    teddyCtx?.sincronizarAudio(isPlaying && !isPaused, playbackRate);
  }, [isPlaying, isPaused, playbackRate]);

  const cleanupPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthSpeakingRef.current = false;
      window.speechSynthesis.cancel();
    }
    if (keepAliveIntervalRef.current) {
      window.clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    lastFalaRef.current = "";
    teddyCtx?.sincronizarAudio(false);
    teddyCtx?.setFala(null);
  }, [teddyCtx]);

  /* ============================================================
     1. MODO SÍNTESE DE VOZ ULTRA-FLUIDA (PT-BR) - Fallback
     ============================================================ */
  const getBestPtVoice = (synth: SpeechSynthesis): SpeechSynthesisVoice | null => {
    const voices = synth.getVoices();
    const ptVoices = voices.filter(
      (v) => v.lang === "pt-BR" || v.lang.startsWith("pt")
    );
    if (ptVoices.length === 0) return null;

    const preferredNames = [
      "francisca",
      "antonio",
      "thalita",
      "natural",
      "neural",
      "google português",
      "google",
      "luciana",
      "felipe",
      "maria",
      "daniel",
    ];

    for (const name of preferredNames) {
      const found = ptVoices.find((v) => v.name.toLowerCase().includes(name));
      if (found) return found;
    }

    return ptVoices[0];
  };

  const handleToggleSpeechSynth = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    if (isPlaying && !isPaused) {
      synth.pause();
      setIsPaused(true);
      teddyCtx?.sincronizarAudio(false, playbackRate);
      return;
    }

    if (isPlaying && isPaused) {
      synth.resume();
      setIsPaused(false);
      teddyCtx?.sincronizarAudio(true, playbackRate);
      return;
    }

    synth.cancel();

    const chunks = normalizeTextForSpeech(text);
    if (chunks.length === 0) return;

    synthChunksRef.current = chunks;
    synthChunkIndexRef.current = 0;
    synthSpeakingRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);
    setProgress(0);
    teddyCtx?.sincronizarAudio(true, playbackRate);

    const bestVoice = getBestPtVoice(synth);

    // Keepalive para navegadores Chromium (evita parada silenciosa após ~14s)
    if (keepAliveIntervalRef.current) {
      window.clearInterval(keepAliveIntervalRef.current);
    }
    keepAliveIntervalRef.current = window.setInterval(() => {
      if (synthSpeakingRef.current && synth.speaking && !synth.paused) {
        synth.pause();
        synth.resume();
      }
    }, 10000);

    const speakNextChunk = () => {
      if (!synthSpeakingRef.current || synthChunkIndexRef.current >= chunks.length) {
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(100);
        synthSpeakingRef.current = false;
        teddyCtx?.sincronizarAudio(false);
        teddyCtx?.setFala(null);
        lastFalaRef.current = "";
        if (keepAliveIntervalRef.current) {
          window.clearInterval(keepAliveIntervalRef.current);
          keepAliveIntervalRef.current = null;
        }
        return;
      }

      const currentIndex = synthChunkIndexRef.current;
      const chunkText = chunks[currentIndex];
      const utterance = new SpeechSynthesisUtterance(chunkText);

      utterance.lang = "pt-BR";
      utterance.rate = playbackRate;
      utterance.volume = isMuted ? 0 : volume;
      utterance.pitch = 1.0;
      if (bestVoice) utterance.voice = bestVoice;

      utterance.onstart = () => {
        setProgress(Math.round((currentIndex / chunks.length) * 100));
        // Atualiza a legenda no balão do Teddy com o trecho exato que ele está falando
        lastFalaRef.current = chunkText;
        teddyCtx?.setFala(chunkText);
      };

      utterance.onend = () => {
        synthChunkIndexRef.current = currentIndex + 1;
        if (synthChunkIndexRef.current < chunks.length && synthSpeakingRef.current) {
          speakNextChunk();
        } else {
          setIsPlaying(false);
          setIsPaused(false);
          setProgress(100);
          synthSpeakingRef.current = false;
          teddyCtx?.sincronizarAudio(false);
          teddyCtx?.setFala(null);
          lastFalaRef.current = "";
          if (keepAliveIntervalRef.current) {
            window.clearInterval(keepAliveIntervalRef.current);
            keepAliveIntervalRef.current = null;
          }
        }
      };

      utterance.onerror = (e) => {
        console.warn("[AudioNarration] Erro no sintetizador:", e);
        setIsPlaying(false);
        setIsPaused(false);
        synthSpeakingRef.current = false;
        teddyCtx?.sincronizarAudio(false);
        teddyCtx?.setFala(null);
        lastFalaRef.current = "";
        if (keepAliveIntervalRef.current) {
          window.clearInterval(keepAliveIntervalRef.current);
          keepAliveIntervalRef.current = null;
        }
      };

      synth.speak(utterance);
    };

    speakNextChunkRef.current = speakNextChunk;
    speakNextChunk();
  }, [isPlaying, isPaused, text, playbackRate, isMuted, volume, teddyCtx]);

  /* ============================================================
     2. MODO ÁUDIO DE ESTÚDIO (HTML5 AUDIO - MP3/WAV)
     ============================================================ */
  const handleToggleAudioFile = useCallback(() => {
    if (!audioSrc) return;

    if (!audioRef.current) {
      const audio = new Audio(audioSrc);
      audio.playbackRate = playbackRate;
      audio.volume = isMuted ? 0 : volume;
      audioRef.current = audio;

      audio.onplay = () => {
        setIsPlaying(true);
        setIsPaused(false);
        teddyCtx?.sincronizarAudio(true, playbackRate);
        if (legendas && legendas.length > 0) {
          const cur = audio.currentTime;
          const active = legendas.find((l) => cur >= l.inicio && cur < l.fim) ?? legendas[0];
          lastFalaRef.current = active.texto;
          teddyCtx?.setFala(active.texto);
        } else {
          const bounds = chunkBoundariesRef.current;
          if (bounds.length > 0) {
            const ratio = audio.duration ? Math.max(0, Math.min(1, audio.currentTime / audio.duration)) : 0;
            const active = bounds.find((b) => ratio >= b.start && ratio < b.end) ?? bounds[0];
            lastFalaRef.current = active.text;
            teddyCtx?.setFala(active.text);
          } else {
            teddyCtx?.setFala(title);
          }
        }
      };

      audio.onpause = () => {
        setIsPaused(true);
        teddyCtx?.sincronizarAudio(false, playbackRate);
        // Mantém a legenda no balão visível para o usuário poder continuar lendo com calma
      };

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(0);
        teddyCtx?.sincronizarAudio(false);
        teddyCtx?.setFala(null);
        lastFalaRef.current = "";
      };

      audio.ontimeupdate = () => {
        if (audio.duration && audio.duration > 0) {
          setProgress((audio.currentTime / audio.duration) * 100);

          // Sincroniza o balão do Teddy com a fala exata da gravação
          if (legendas && legendas.length > 0) {
            const cur = audio.currentTime;
            const active =
              legendas.find((l) => cur >= l.inicio && cur < l.fim) ??
              (cur >= legendas[legendas.length - 1].fim ? null : legendas[legendas.length - 1]);
            if (active && active.texto !== lastFalaRef.current) {
              lastFalaRef.current = active.texto;
              teddyCtx?.setFala(active.texto);
            }
          } else {
            const bounds = chunkBoundariesRef.current;
            if (bounds.length > 0) {
              const ratio = Math.max(0, Math.min(1, audio.currentTime / audio.duration));
              const active =
                bounds.find((b) => ratio >= b.start && ratio < b.end) ??
                bounds[bounds.length - 1];
              if (active && active.text !== lastFalaRef.current) {
                lastFalaRef.current = active.text;
                teddyCtx?.setFala(active.text);
              }
            }
          }
        }
      };

      audio.onerror = () => {
        console.warn("[AudioNarration] Erro ao carregar arquivo de áudio, usando sintetizador...");
        audioRef.current = null;
        handleToggleSpeechSynth();
      };

      audio.play().catch((err) => {
        console.warn("[AudioNarration] Erro ao reproduzir áudio:", err);
      });
      return;
    }

    const audio = audioRef.current;
    if (audio.paused) {
      audio.playbackRate = playbackRate;
      audio.volume = isMuted ? 0 : volume;
      audio.play().catch(console.warn);
      teddyCtx?.sincronizarAudio(true, playbackRate);
      if (lastFalaRef.current) {
        teddyCtx?.setFala(lastFalaRef.current);
      }
    } else {
      audio.pause();
      teddyCtx?.sincronizarAudio(false, playbackRate);
    }
  }, [audioSrc, playbackRate, isMuted, volume, title, legendas, teddyCtx, handleToggleSpeechSynth]);

  const handleTogglePlay = useCallback(() => {
    if (audioSrc) {
      handleToggleAudioFile();
    } else {
      handleToggleSpeechSynth();
    }
  }, [audioSrc, handleToggleAudioFile, handleToggleSpeechSynth]);

  // Conecta este player diretamente ao mascote Teddy da página
  const registrarRef = useRef(teddyCtx?.registrarNarracao);
  useEffect(() => {
    registrarRef.current = teddyCtx?.registrarNarracao;
  }, [teddyCtx?.registrarNarracao]);

  const playbackActionsRef = useRef({ togglePlay: handleTogglePlay, stop: cleanupPlayback });
  useEffect(() => {
    playbackActionsRef.current = { togglePlay: handleTogglePlay, stop: cleanupPlayback };
  }, [handleTogglePlay, cleanupPlayback]);

  useEffect(() => {
    const fn = registrarRef.current;
    if (!fn) return;

    fn({
      title,
      text,
      audioSrc,
      isPlaying,
      isPaused,
      togglePlay: () => playbackActionsRef.current.togglePlay(),
      stop: () => playbackActionsRef.current.stop(),
    });

  }, [title, text, audioSrc, isPlaying, isPaused]);

  useEffect(() => () => { registrarRef.current?.(null); }, []);

  const handleSetSpeed = useCallback(
    (newSpeed: number) => {
      setPlaybackRate(newSpeed);
      setShowSpeedMenu(false);

      if (audioRef.current) {
        audioRef.current.playbackRate = newSpeed;
      }

      // No modo síntese de voz (fallback), continua a partir do trecho atual sem reiniciar do início:
      if (synthSpeakingRef.current && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setTimeout(() => {
          if (synthSpeakingRef.current && speakNextChunkRef.current) {
            speakNextChunkRef.current();
          }
        }, 50);
      }
    },
    [setPlaybackRate]
  );

  const handleStepSpeed = useCallback(
    (delta: number, e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Encontra a opção de velocidade mais próxima por proximidade numérica
      let closestIndex = 2; // Padrão: 1.0x
      let minDiff = Infinity;
      SPEED_OPTIONS.forEach((opt, idx) => {
        const diff = Math.abs(opt.value - playbackRate);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = idx;
        }
      });

      const nextIndex = Math.max(0, Math.min(SPEED_OPTIONS.length - 1, closestIndex + delta));
      const targetSpeed = SPEED_OPTIONS[nextIndex].value;
      handleSetSpeed(targetSpeed);
    },
    [playbackRate, handleSetSpeed]
  );

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleStepVolume = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newVol = Math.max(0, Math.min(1, Math.round((volume + delta) * 10) / 10));
    setVolume(newVol);
    if (newVol === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  if (!supported) return null;

  const currentVolEffective = isMuted ? 0 : volume;
  const volPercent = Math.round(currentVolEffective * 100);
  const currentSpeedLabel =
    SPEED_OPTIONS.find((s) => Math.abs(s.value - playbackRate) < 0.05)?.label ?? `${playbackRate}x`;

  return (
    <div
      className={`relative inline-flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 overflow-visible rounded-2xl border border-white/25 bg-white/15 dark:bg-black/35 p-2.5 sm:px-4 sm:py-2.5 backdrop-blur-xl shadow-lg transition-all ${className}`}
      role="region"
      aria-label="Controles de narração em áudio acessível"
    >
      {/* Barra de progresso visual de fundo */}
      {isPlaying && (
        <div
          className="pointer-events-none absolute bottom-0 left-0 top-0 rounded-2xl bg-gradient-to-r from-[color:var(--roxo)]/15 via-[color:var(--azul)]/15 to-[color:var(--aqua)]/15 transition-all duration-300"
          style={{ width: `${Math.max(4, progress)}%` }}
        />
      )}

      {/* 1. Botão Principal: Play / Pause */}
      <button
        type="button"
        onClick={handleTogglePlay}
        className="relative z-10 inline-flex items-center gap-3 font-display text-xs font-semibold text-inherit transition-transform hover:scale-[1.02] active:scale-[0.98] text-left cursor-pointer"
        aria-label={
          isPlaying
            ? isPaused
              ? "Retomar áudio"
              : "Pausar áudio"
            : `Reproduzir áudio: ${title}`
        }
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-md transition-all ${
            isPlaying && !isPaused
              ? "bg-[color:var(--aqua)] text-[color:var(--tinta)] ring-4 ring-[color:var(--aqua)]/30 animate-pulse"
              : isPaused
              ? "bg-[color:var(--amarelo)] text-[color:var(--tinta)]"
              : "bg-[color:var(--roxo)] text-white hover:bg-[color:var(--roxo)]/90"
          }`}
        >
          {isPlaying ? (
            isPaused ? (
              <Play className="h-4 w-4 fill-current ml-0.5" />
            ) : (
              <Pause className="h-4 w-4 fill-current" />
            )
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </span>

        <span className="leading-tight">
          <strong className="block text-xs sm:text-sm font-bold text-foreground">
            {title}
          </strong>
          <span className="block text-[11px] font-normal opacity-85 text-foreground/80">
            {isPlaying
              ? isPaused
                ? "Pausado (clique no player ou no Teddy para continuar)"
                : `Teddy narrando a ${currentSpeedLabel}...`
              : "Clique para ouvir ou clique no Teddy"}
          </span>
        </span>
      </button>

      {/* Equalizador animado em tempo real quando o áudio está tocando */}
      {isPlaying && !isPaused && (
        <div
          className="relative z-10 hidden sm:flex items-center gap-1 px-1.5"
          aria-hidden="true"
          title="Áudio em reprodução"
        >
          <span className="h-3 w-1 animate-pulse rounded-full bg-[color:var(--amarelo)]" />
          <span className="h-5 w-1 animate-pulse rounded-full bg-[color:var(--rosa)] [animation-delay:150ms]" />
          <span className="h-3.5 w-1 animate-pulse rounded-full bg-[color:var(--aqua)] [animation-delay:300ms]" />
        </div>
      )}

      {/* Controles expandidos: aparecem e destacam quando tocando ou pausado */}
      <div className="relative z-10 flex flex-wrap items-center gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 sm:border-l border-white/20 sm:pl-3 w-full sm:w-auto">
        {/* 2. Controle de Volume (Diminuir e Aumentar o Volume) */}
        <div
          className="flex items-center gap-1.5 rounded-xl bg-black/10 dark:bg-white/10 px-2 py-1 border border-white/15"
          title={`Volume do Teddy: ${volPercent}%`}
        >
          <button
            type="button"
            onClick={handleToggleMute}
            className="p-1 rounded-md opacity-80 hover:opacity-100 hover:bg-white/20 transition-all cursor-pointer"
            aria-label={isMuted ? "Ativar som" : "Silenciar áudio"}
            title={isMuted ? "Ativar som" : "Silenciar áudio"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-3.5 w-3.5 text-[color:var(--rosa)]" />
            ) : volume < 0.5 ? (
              <Volume1 className="h-3.5 w-3.5 opacity-90" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-[color:var(--amarelo)]" />
            )}
          </button>

          {/* Botão diminuir volume */}
          <button
            type="button"
            onClick={(e) => handleStepVolume(-0.1, e)}
            disabled={currentVolEffective <= 0}
            className="hidden sm:flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 hover:bg-white/25 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            aria-label="Diminuir volume"
            title="Diminuir volume"
          >
            <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>

          {/* Slider interativo de volume */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={currentVolEffective}
            onChange={handleVolumeChange}
            className="volume-slider w-14 sm:w-16 cursor-pointer"
            aria-label="Volume da narração e da voz do Teddy"
            title={`Ajustar volume: ${volPercent}%`}
          />

          {/* Botão aumentar volume */}
          <button
            type="button"
            onClick={(e) => handleStepVolume(0.1, e)}
            disabled={currentVolEffective >= 1}
            className="hidden sm:flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 hover:bg-white/25 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            aria-label="Aumentar volume"
            title="Aumentar volume"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>

          <span className="font-mono text-[10px] font-bold min-w-[28px] text-right opacity-85">
            {volPercent}%
          </span>
        </div>

        {/* 3. Controle de Velocidade (0.5x, 1x, 1.5x, 2x...) */}
        <div ref={speedMenuRef} className="relative flex items-center">
          <div className="flex items-center rounded-xl bg-black/15 dark:bg-white/15 p-1 border border-white/20 gap-1 shadow-sm">
            {/* Botão desacelerar velocidade (-) com alvo de clique amplo e confortável */}
            <button
              type="button"
              onClick={(e) => handleStepSpeed(-1, e)}
              disabled={playbackRate <= SPEED_OPTIONS[0].value + 0.01}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-white/15 hover:bg-white/30 active:scale-90 disabled:opacity-25 disabled:pointer-events-none text-foreground transition-all cursor-pointer shadow-xs"
              title="Diminuir velocidade do áudio (-)"
              aria-label="Diminuir velocidade"
            >
              <Minus className="h-4 w-4 stroke-[2.5]" />
            </button>

            {/* Badge de velocidade atual que abre menu completo com opções */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowSpeedMenu((prev) => !prev);
              }}
              className="inline-flex h-8 sm:h-9 items-center gap-1.5 px-2.5 sm:px-3 font-mono text-xs sm:text-sm font-extrabold rounded-lg bg-white/20 hover:bg-white/35 active:scale-95 text-foreground transition-all cursor-pointer shadow-xs"
              title="Clique para escolher a velocidade"
              aria-label={`Velocidade atual: ${currentSpeedLabel}`}
            >
              <Gauge className="h-4 w-4 text-[color:var(--amarelo)]" />
              <span>{currentSpeedLabel}</span>
            </button>

            {/* Botão acelerar velocidade (+) com alvo de clique amplo e confortável */}
            <button
              type="button"
              onClick={(e) => handleStepSpeed(1, e)}
              disabled={playbackRate >= SPEED_OPTIONS[SPEED_OPTIONS.length - 1].value - 0.01}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-white/15 hover:bg-white/30 active:scale-90 disabled:opacity-25 disabled:pointer-events-none text-foreground transition-all cursor-pointer shadow-xs"
              title="Aumentar velocidade do áudio (+)"
              aria-label="Aumentar velocidade"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Menu popover com atalhos diretos de velocidade (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x) */}
          {showSpeedMenu && (
            <div
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 z-50 flex flex-col gap-1.5 rounded-2xl border border-white/25 bg-gray-950/95 p-2.5 shadow-2xl backdrop-blur-xl min-w-[170px] animate-in fade-in zoom-in-95 duration-150 text-white"
              role="menu"
            >
              <div className="flex items-center justify-between px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white/70 border-b border-white/10 pb-1.5">
                <span>Velocidade</span>
                <span className="font-mono text-[color:var(--amarelo)] font-bold">{currentSpeedLabel}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {SPEED_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetSpeed(opt.value);
                    }}
                    className={`flex items-center justify-center rounded-xl py-2 px-2 text-xs font-mono font-extrabold transition-all cursor-pointer ${
                      Math.abs(playbackRate - opt.value) < 0.05
                        ? "bg-[color:var(--roxo)] text-white shadow-md ring-2 ring-white/60 scale-102"
                        : "bg-white/10 hover:bg-white/25 text-white/90"
                    }`}
                  >
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Botão de Parar / Reiniciar Narração */}
        {isPlaying && (
          <button
            type="button"
            onClick={cleanupPlayback}
            className="rounded-xl border border-white/15 bg-black/10 dark:bg-white/10 p-1.5 opacity-80 transition-all hover:opacity-100 hover:bg-black/20 cursor-pointer"
            title="Parar áudio e reiniciar"
            aria-label="Parar áudio"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default AudioNarration;
