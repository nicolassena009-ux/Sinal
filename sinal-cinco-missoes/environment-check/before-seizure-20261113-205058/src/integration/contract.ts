export type Mode = 'kids' | 'teens';
export const PHASES={choking:'cafeteria',seizure:'classroom',cardiac_arrest:'corridor',burns:'kitchen',trauma:'courtyard'} as const;
export type MissionId=keyof typeof PHASES;
export type Accessory = 'cap' | 'vest' | 'badge' | 'glasses' | 'cape';
export interface GameInput {
  version: 1; missionId: MissionId; phaseId: typeof PHASES[MissionId]; mode: Mode;
  avatar: { color?: string; accessories: Accessory[]; atlas?: { image: string; data: string; height?:number }; accessoryImages?:Partial<Record<Accessory,string>> };
  progress: { completedObjectives: string[] };
  settings: { music: boolean; effects: boolean; reducedMotion: boolean; textScale: number };
}
export type GameEvent =
  | { type: 'phase-changed'; version: 1; missionId: MissionId; phase: string }
  | { type: 'loaded' | 'mission-started' | 'return-menu'; version: 1; missionId: MissionId }
  | { type: 'objective-completed'; version: 1; missionId: MissionId; objective: string }
  | { type: 'mission-completed' | 'educational-result'; version: 1; missionId: MissionId; result: EducationalResult }
  | { type: 'recoverable-error'; version: 1; missionId: MissionId; message: string };
export interface EducationalResult { mode: Mode; objectives: string[]; corrections: number; durationSeconds: number; clinicalReview: 'pending' }
export type EventSink = (event: GameEvent) => void;
export const defaults = (mode: Mode = 'teens',missionId:MissionId='choking'): GameInput => ({ version: 1, missionId, phaseId: PHASES[missionId], mode, avatar: { accessories: ['vest', 'badge'] }, progress: { completedObjectives: [] }, settings: { music: false, effects: true, reducedMotion: false, textScale: 1 } });
export function validateInput(input: GameInput) {
  if (input.version !== 1 || !Object.hasOwn(PHASES,input.missionId) || input.phaseId !== PHASES[input.missionId] || !['kids', 'teens'].includes(input.mode)) throw new Error('Contrato ou missão não suportados');
}
