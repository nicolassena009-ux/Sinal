/**
 * Funções puras de cálculo para o Joystick Virtual Analógico
 * Projetado para suportar movimentação em 360 graus, zona morta e resposta proporcional.
 */

export interface JoystickVector {
  x: number;
  y: number;
  magnitude: number;
  angle: number;
  active: boolean;
}

export const DEFAULT_DEADZONE = 0.15; // 15% de zona morta para evitar drift acidental

/**
 * Calcula o vetor normalizado do joystick a partir do deslocamento (dx, dy)
 * do polegar em relação ao centro da base.
 *
 * @param dx Deslocamento horizontal em pixels
 * @param dy Deslocamento vertical em pixels
 * @param maxRadius Raio máximo da base do joystick em pixels
 * @param deadzone Fração do raio [0, 1] considerada zona morta
 */
export function calculateJoystickVector(
  dx: number,
  dy: number,
  maxRadius: number,
  deadzone: number = DEFAULT_DEADZONE,
): JoystickVector {
  if (maxRadius <= 0) {
    return { x: 0, y: 0, magnitude: 0, angle: 0, active: false };
  }

  const distance = Math.hypot(dx, dy);
  const deadzonePx = deadzone * maxRadius;

  // Dentro da zona morta: retorno zerado sem movimento
  if (distance <= deadzonePx) {
    return { x: 0, y: 0, magnitude: 0, angle: Math.atan2(dy, dx), active: false };
  }

  // Limita a distância física ao raio máximo
  const clampedDistance = Math.min(distance, maxRadius);

  // Escala proporcional contínua de 0 (borda da zona morta) a 1 (borda máxima)
  const normalizedMagnitude = Math.min(
    1,
    Math.max(0, (clampedDistance - deadzonePx) / (maxRadius - deadzonePx)),
  );

  const angle = Math.atan2(dy, dx);
  const ux = dx / distance;
  const uy = dy / distance;

  return {
    x: ux * normalizedMagnitude,
    y: uy * normalizedMagnitude,
    magnitude: normalizedMagnitude,
    angle,
    active: true,
  };
}

/**
 * Converte o vetor 2D para a direção cardeal correspondente ("down", "up", "left", "right")
 * para sincronização da direção da animação do personagem.
 */
export function resolveCardinalDirection(
  x: number,
  y: number,
): "down" | "up" | "left" | "right" {
  if (Math.abs(x) > Math.abs(y)) {
    return x > 0 ? "right" : "left";
  }
  return y > 0 ? "down" : "up";
}

/**
 * Retorna as coordenadas limitadas (em pixels) para posicionamento visual do knob dentro da base.
 */
export function clampKnobPosition(
  dx: number,
  dy: number,
  maxRadius: number,
): { visualX: number; visualY: number } {
  const distance = Math.hypot(dx, dy);
  if (distance <= maxRadius) {
    return { visualX: dx, visualY: dy };
  }
  const ratio = maxRadius / distance;
  return { visualX: dx * ratio, visualY: dy * ratio };
}

