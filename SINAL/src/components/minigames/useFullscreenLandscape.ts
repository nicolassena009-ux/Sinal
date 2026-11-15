import { useState, useEffect, useCallback, useRef } from "react";

interface LockableScreenOrientation {
  type: string;
  angle?: number;
  lock?: (orientation: "landscape" | "portrait" | "any" | "natural") => Promise<void>;
  unlock?: () => void;
  addEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void;
  removeEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void;
}

export interface FullscreenLandscapeState {
  isFullscreen: boolean;
  isLandscape: boolean;
  isTouchDevice: boolean;
  orientationLocked: boolean;
  showOrientationPrompt: boolean;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  toggleFullscreen: () => Promise<void>;
  dismissOrientationPrompt: () => void;
}

export function useFullscreenLandscape(
  elementRef: React.RefObject<HTMLElement | null>,
): FullscreenLandscapeState {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [orientationLocked, setOrientationLocked] = useState(false);
  const [showOrientationPrompt, setShowOrientationPrompt] = useState(false);
  const userDismissedPrompt = useRef(false);

  // 1. Detecção de orientação e suporte a toque
  const checkOrientation = useCallback(() => {
    if (typeof window === "undefined") return;

    const screenOrientation = (
      typeof screen !== "undefined" ? (screen.orientation as LockableScreenOrientation | undefined) : undefined
    );

    const landscape =
      window.innerWidth >= window.innerHeight ||
      (screenOrientation && screenOrientation.type ? screenOrientation.type.includes("landscape") : false);

    setIsLandscape(landscape);

    // Se o usuário estiver em tela cheia (ou celular) e a tela estiver em modo retrato (portrait),
    // e o lock automático falhou ou não é suportado, orientamos visualmente
    if (!landscape && !userDismissedPrompt.current) {
      setShowOrientationPrompt(true);
    } else if (landscape) {
      setShowOrientationPrompt(false);
    }
  }, []);

  // 2. Sincronização de eventos de tela e redimensionamento
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detecta se o dispositivo suporta toque
    const hasTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(hasTouch);

    checkOrientation();

    const handleFullscreenChange = () => {
      const doc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
        mozFullScreenElement?: Element;
        msFullscreenElement?: Element;
      };

      const active = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );

      setIsFullscreen(active);

      if (!active) {
        // Saiu da tela cheia: destrava orientação e reseta prompt
        userDismissedPrompt.current = false;
        setShowOrientationPrompt(false);
        setOrientationLocked(false);
        try {
          const orientation = screen.orientation as LockableScreenOrientation | undefined;
          if (orientation && typeof orientation.unlock === "function") {
            orientation.unlock();
          }
        } catch {
          // Ignora falha de unlock silenciosamente
        }
      } else {
        checkOrientation();
      }
    };

    const handleResize = () => {
      checkOrientation();
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    const screenOrientation = screen.orientation as LockableScreenOrientation | undefined;
    if (screenOrientation && typeof screenOrientation.addEventListener === "function") {
      screenOrientation.addEventListener("change", handleResize);
    }

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (screenOrientation && typeof screenOrientation.removeEventListener === "function") {
        screenOrientation.removeEventListener("change", handleResize);
      }
    };
  }, [checkOrientation]);

  // 3. Solicitação de tela cheia com tentativa de rotação horizontal
  const enterFullscreen = useCallback(async () => {
    const el = elementRef.current;
    if (!el) return;

    userDismissedPrompt.current = false;

    // A. Ativa Fullscreen API com fallbacks compatíveis
    try {
      const elementWithFullscreen = el as unknown as {
        requestFullscreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
        mozRequestFullScreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
      };

      if (elementWithFullscreen.requestFullscreen) {
        await elementWithFullscreen.requestFullscreen();
      } else if (elementWithFullscreen.webkitRequestFullscreen) {
        await elementWithFullscreen.webkitRequestFullscreen();
      } else if (elementWithFullscreen.mozRequestFullScreen) {
        await elementWithFullscreen.mozRequestFullScreen();
      } else if (elementWithFullscreen.msRequestFullscreen) {
        await elementWithFullscreen.msRequestFullscreen();
      }
    } catch (err) {
      console.warn("[SINAL] Tela cheia nativa não permitida ou rejeitada:", err);
    }

    // B. Solicita orientação horizontal (landscape) quando suportada
    let locked = false;
    try {
      const screenOrientation = screen.orientation as LockableScreenOrientation | undefined;
      if (
        screenOrientation &&
        typeof screenOrientation.lock === "function" &&
        // Evita erro em desktop Chrome onde lock requer app instalado
        window.matchMedia("(pointer: coarse)").matches
      ) {
        await screenOrientation.lock("landscape");
        locked = true;
      }
    } catch {
      // Navegadores sem suporte a lock (ex.: Safari iOS) caem no fallback visual
      locked = false;
    }

    setOrientationLocked(locked);
    checkOrientation();
  }, [elementRef, checkOrientation]);

  // 4. Saída de tela cheia
  const exitFullscreen = useCallback(async () => {
    try {
      const doc = document as unknown as {
        exitFullscreen?: () => Promise<void>;
        webkitExitFullscreen?: () => Promise<void>;
        mozCancelFullScreen?: () => Promise<void>;
        msExitFullscreen?: () => Promise<void>;
      };

      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    } catch (err) {
      console.warn("[SINAL] Erro ao sair da tela cheia:", err);
    }

    try {
      const screenOrientation = screen.orientation as LockableScreenOrientation | undefined;
      if (screenOrientation && typeof screenOrientation.unlock === "function") {
        screenOrientation.unlock();
      }
    } catch {
      // Ignora erro
    }

    setIsFullscreen(false);
    setShowOrientationPrompt(false);
    setOrientationLocked(false);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  const dismissOrientationPrompt = useCallback(() => {
    userDismissedPrompt.current = true;
    setShowOrientationPrompt(false);
  }, []);

  return {
    isFullscreen,
    isLandscape,
    isTouchDevice,
    orientationLocked,
    showOrientationPrompt,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    dismissOrientationPrompt,
  };
}
