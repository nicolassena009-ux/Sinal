import { GAME_THEMES } from "@/data/gameplay";
export const PROGRESS_KEY = "sinal_gameplay_v1";
const validKeys = new Set(GAME_THEMES.flatMap((t) => t.levels.map((l) => `${t.slug}:${l.number}`)));
let memory: string[] = [];
export function readGameProgress(): string[] {
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
  return [...memory];
}
export function completeLevel(theme: string, level: number): boolean {
  const key = `${theme}:${level}`;
  if (!validKeys.has(key)) return false;
  memory = [...new Set([...readGameProgress(), key])];
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(memory));
    return true;
  } catch {
    return false;
  }
}
