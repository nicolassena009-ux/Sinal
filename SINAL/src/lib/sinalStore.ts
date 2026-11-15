import { useEffect, useState } from "react";

export type TrackProgress = {
  done: number[];
  stars: number;
  tries: number;
};

export type SinalState = {
  contrast: boolean;
  kids: TrackProgress;
  teens: TrackProgress;
};

const STORAGE_KEY = "sinal_progress_v2";

const DEFAULT_STATE: SinalState = {
  contrast: false,
  kids: { done: [], stars: 0, tries: 0 },
  teens: { done: [], stars: 0, tries: 0 },
};

function readStoredState(): SinalState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("sinal");
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);

    // Compatibilidade com formato anterior se houver
    if (!parsed.kids) {
      return {
        contrast: !!parsed.contrast,
        kids: {
          done: parsed.done || [],
          stars: parsed.stars || 0,
          tries: parsed.tries || 0,
        },
        teens: { done: [], stars: 0, tries: 0 },
      };
    }

    return {
      contrast: !!parsed.contrast,
      kids: parsed.kids || { done: [], stars: 0, tries: 0 },
      teens: parsed.teens || { done: [], stars: 0, tries: 0 },
    };
  } catch (err) {
    console.warn("[Sinal] Erro ao carregar estado do localStorage:", err);
    return DEFAULT_STATE;
  }
}

function writeStoredState(state: SinalState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("sinal-state-change", { detail: state }));
  } catch (err) {
    console.warn("[Sinal] Não foi possível persistir estado:", err);
  }
}

export function getSinalState(): SinalState {
  return readStoredState();
}

export function saveMissionAttempt(
  track: "kids" | "teens",
  missionIndex: number,
  isCorrect: boolean,
): { isFirstSuccess: boolean; totalStars: number } {
  const current = readStoredState();
  const target = current[track];
  target.tries += 1;

  let isFirstSuccess = false;
  if (isCorrect) {
    if (!target.done.includes(missionIndex)) {
      target.done.push(missionIndex);
      target.stars += 3;
      isFirstSuccess = true;
    }
  }

  writeStoredState(current);
  return { isFirstSuccess, totalStars: target.stars };
}

export function resetTrackProgress(track: "kids" | "teens") {
  const current = readStoredState();
  current[track] = { done: [], stars: 0, tries: 0 };
  writeStoredState(current);
}

export function setContrastMode(enabled: boolean) {
  const current = readStoredState();
  current.contrast = enabled;
  writeStoredState(current);

  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("contrast", enabled);
    document.body.classList.toggle("contrast", enabled);
  }
}

export function toggleContrastMode(): boolean {
  const current = readStoredState();
  const next = !current.contrast;
  setContrastMode(next);
  return next;
}

/**
 * Hook reativo para assinar o estado do Sinal em componentes React
 */
export function useSinalStore() {
  const [state, setState] = useState<SinalState>(() => readStoredState());

  useEffect(() => {
    // Aplica o contraste inicial no DOM
    const initial = readStoredState();
    if (initial.contrast) {
      document.documentElement.classList.add("contrast");
      document.body.classList.add("contrast");
    }

    const handler = (e: Event) => {
      const custom = e as CustomEvent<SinalState>;
      setState(custom.detail || readStoredState());
    };

    window.addEventListener("sinal-state-change", handler);
    window.addEventListener("storage", () => setState(readStoredState()));

    return () => {
      window.removeEventListener("sinal-state-change", handler);
    };
  }, []);

  return state;
}
