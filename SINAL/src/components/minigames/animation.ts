/**
 * Módulo de Controle de Animações do Teddy em 2.5D
 * Suporta temporização independente de FPS, transições de estado e cálculo de marcha.
 */

export type TeddyAnimationState =
  | "idle"
  | "walk"
  | "interact"
  | "prepare"
  | "assist"
  | "celebrate"
  | "concerned";

export type Direction = "down" | "up" | "left" | "right";

export interface AnimationFrameData {
  state: TeddyAnimationState;
  direction: Direction;
  time: number;
  bobY: number;
  legOffset: number;
  armAngle: number;
  eyeState: "normal" | "blink" | "concerned" | "happy";
}

/**
 * Determina o estado de animação do Teddy com base no contexto do jogo.
 */
export function resolveTeddyState(params: {
  isMoving: boolean;
  isInteracting: boolean;
  isFinished: boolean;
  isNearVictim?: boolean;
}): TeddyAnimationState {
  if (params.isFinished) {
    return "celebrate";
  }
  if (params.isInteracting) {
    return "assist";
  }
  if (params.isMoving) {
    return "walk";
  }
  if (params.isNearVictim) {
    return "concerned";
  }
  return "idle";
}

/**
 * Calcula os deslocamentos de membros e cabeça para a animação do Teddy
 * com base no estado e tempo acumulado (em segundos).
 */
export function calculateTeddyPose(
  state: TeddyAnimationState,
  time: number,
): {
  bobY: number;
  legOffset: number;
  armAngle: number;
  earWiggle: number;
} {
  switch (state) {
    case "walk": {
      // Cadência de caminhada: 3.5 passos por segundo
      const walkFreq = 3.5;
      const cycle = time * walkFreq * Math.PI * 2;
      return {
        bobY: -Math.abs(Math.sin(cycle)) * 2, // Elevação sutil a cada passo
        legOffset: Math.sin(cycle) * 3, // Alternância das patinhas
        armAngle: -Math.sin(cycle) * 0.45, // Balanço dos bracinhos
        earWiggle: Math.sin(cycle * 0.5) * 0.15,
      };
    }

    case "assist":
    case "interact": {
      // Postura focada com leve oscilação de cuidado
      const assistCycle = Math.sin(time * 4) * 0.1;
      return {
        bobY: 1, // Leve inclinação para frente
        legOffset: 0,
        armAngle: 0.6 + assistCycle, // Braços estendidos prestando atendimento
        earWiggle: 0,
      };
    }

    case "celebrate": {
      // Pulinho contínuo de alegria e bracinhos erguidos
      const hop = Math.abs(Math.sin(time * 5)) * 4;
      return {
        bobY: -hop,
        legOffset: 0,
        armAngle: 1.2 + Math.sin(time * 8) * 0.2, // Braços no alto comemorando
        earWiggle: Math.sin(time * 10) * 0.3,
      };
    }

    case "concerned": {
      // Respiração ligeiramente mais rápida com cabecinha inclinada
      const breath = Math.sin(time * 2.5) * 0.8;
      return {
        bobY: breath,
        legOffset: 0,
        armAngle: 0.15,
        earWiggle: -0.1, // Orelhinha murcha de preocupação
      };
    }

    case "prepare": {
      return {
        bobY: 0,
        legOffset: 0,
        armAngle: 0.3,
        earWiggle: 0.05,
      };
    }

    case "idle":
    default: {
      // Respiração natural e tranquila de pelúcia (0.8 Hz)
      const breath = Math.sin(time * 2) * 0.8;
      const ear = Math.sin(time * 1.2) * 0.05;
      return {
        bobY: breath,
        legOffset: 0,
        armAngle: 0,
        earWiggle: ear,
      };
    }
  }
}

