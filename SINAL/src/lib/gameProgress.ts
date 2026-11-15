import { GAME_THEMES } from "@/data/gameplay";

export const PROGRESS_KEY = "sinal_gameplay_v1";
export const MISSIONS_PROGRESS_KEY = "sinal_missions_v2";

export interface MissionRecord {
  missionId: string;
  completed: boolean;
  completedAt: string;
  durationSeconds?: number | undefined;
  corrections?: number | undefined;
  objectives?: string[] | undefined;
  achievements?: string[] | undefined;
  score?: number | undefined;
}

export const OFFICIAL_MISSIONS = [
  { id: "choking", slug: "engasgo", title: "Engasgo" },
  { id: "burns", slug: "queimadura", title: "Queimaduras" },
  { id: "seizure", slug: "convulsao", title: "Convulsão" },
  { id: "cardiac_arrest", slug: "parada-cardiorrespiratoria", title: "Parada Cardiorrespiratória" },
  { id: "trauma", slug: "trauma", title: "Trauma e Quedas" },
] as const;

export type OfficialMissionId = (typeof OFFICIAL_MISSIONS)[number]["id"];

const validKeys = new Set(GAME_THEMES.flatMap((t) => t.levels.map((l) => `${t.slug}:${l.number}`)));
let memory: string[] = [];
let memoryRecords: Record<string, MissionRecord> = {};

function normalizeMissionId(idOrSlug: string): OfficialMissionId {
  if (idOrSlug === "engasgo" || idOrSlug === "choking") return "choking";
  if (idOrSlug === "queimadura" || idOrSlug === "queimaduras" || idOrSlug === "burns") return "burns";
  if (idOrSlug === "convulsao" || idOrSlug === "seizure") return "seizure";
  if (idOrSlug === "parada-cardiorrespiratoria" || idOrSlug === "pcr" || idOrSlug === "cardiac_arrest") return "cardiac_arrest";
  if (idOrSlug === "trauma") return "trauma";
  return "choking";
}

export function readMissionRecords(): Record<string, MissionRecord> {
  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(MISSIONS_PROGRESS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          memoryRecords = { ...memoryRecords, ...parsed };
        }
      }
    } catch {
      /* fallback memory */
    }
  }
  return { ...memoryRecords };
}

export function isMissionCompleted(idOrSlug: string): boolean {
  const id = normalizeMissionId(idOrSlug);
  const records = readMissionRecords();
  return !!records[id]?.completed;
}

export function getCompletedMissionsCount(): number {
  const records = readMissionRecords();
  return OFFICIAL_MISSIONS.filter((m) => !!records[m.id]?.completed).length;
}

export function recordMissionCompletion(
  idOrSlug: string,
  result?: {
    durationSeconds?: number | undefined;
    corrections?: number | undefined;
    objectives?: string[] | undefined;
  },
): boolean {
  const id = normalizeMissionId(idOrSlug);
  const records = readMissionRecords();
  const achievements: string[] = [];

  if (result?.corrections === 0) {
    achievements.push("Precisão Perfeita");
  }
  if ((result?.durationSeconds ?? 999) < 180) {
    achievements.push("Socorrista Ágil");
  }

  const record: MissionRecord = {
    missionId: id,
    completed: true,
    completedAt: new Date().toISOString(),
    durationSeconds: result?.durationSeconds,
    corrections: result?.corrections,
    objectives: result?.objectives ?? [],
    achievements,
    score: Math.max(100 - (result?.corrections ?? 0) * 10, 50),
  };

  records[id] = record;
  memoryRecords = { ...records };

  // Atualiza também compatibilidade legada
  const matching = OFFICIAL_MISSIONS.find((m) => m.id === id);
  if (matching) {
    completeLevel(matching.slug, 1);
    completeLevel(matching.slug, 2);
  }

  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(MISSIONS_PROGRESS_KEY, JSON.stringify(records));
    } catch {
      /* blocked storage */
    }
  }

  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new CustomEvent("sinal-mission-progress-update", { detail: records }));
    } catch {
      /* dispatch event fallback */
    }
  }

  return true;
}

export function readGameProgress(): string[] {
  if (typeof localStorage !== "undefined") {
    try {
      const data: unknown = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "[]");
      if (Array.isArray(data))
        memory = [
          ...new Set([
            ...memory,
            ...data.filter((v): v is string => typeof v === "string" && validKeys.has(v)),
          ]),
        ];
    } catch {
      /* Blocked storage keeps in-memory completion available. */
    }
  }

  // Sincroniza a partir dos registros modernos das 5 missões
  const records = readMissionRecords();
  for (const m of OFFICIAL_MISSIONS) {
    if (records[m.id]?.completed) {
      memory.push(`${m.slug}:1`, `${m.slug}:2`);
    }
  }

  return [...new Set(memory)];
}

export function completeLevel(theme: string, level: number): boolean {
  const key = `${theme}:${level}`;
  if (!validKeys.has(key)) return false;
  memory = [...new Set([...readGameProgress(), key])];
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(memory));
      return true;
    } catch {
      return false;
    }
  }
  return true;
}
