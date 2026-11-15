import type { Point } from "./movement";

export interface GameNPC extends Point {
  id: string;
  name: string;
  role: "victim" | "adult" | "item";
  facing: "left" | "right" | "down" | "up";
  interactionRadius: number;
  status: string;
}

export const INTERACTION_DEFAULT_RADIUS = 26;

/**
 * Verifica se o jogador está dentro do raio de interação do NPC.
 */
export function isNearTarget(
  player: Point,
  target: Point,
  radius: number = INTERACTION_DEFAULT_RADIUS,
): boolean {
  return Math.hypot(player.x - target.x, player.y - target.y) <= radius;
}

/**
 * Retorna o texto explicativo da ação disponível com o NPC ou objeto.
 */
export function getInteractionPrompt(targetName: string, role: string): string {
  if (role === "victim") {
    return `Segure AGIR para atender ${targetName}`;
  }
  if (role === "adult") {
    return `Segure AGIR para chamar ${targetName}`;
  }
  return `Segure AGIR para interagir com ${targetName}`;
}

