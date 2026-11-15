import type { AvatarConfig } from "@/types/minigame";
import { CORES_ROUPA } from "@/lib/avatarStore";
import {
  type Direction,
  type TeddyAnimationState,
  calculateTeddyPose,
} from "./animation";

/**
 * Paleta de cores oficial do mascote Teddy (SINAL)
 */
const TEDDY_PALETTE = {
  furBase: "#C47D3B", // Pelagem caramelo acolhedora
  furLight: "#DE9A58", // Luz superior suave
  furDark: "#9B5C26", // Sombra e contornos
  muzzle: "#FBF0DC", // Focinho bege claro
  innerEar: "#F7DCB4", // Interior macio das orelhas
  nose: "#231815", // Nariz preto brilhante
  eye: "#1E1610", // Olhos escuros expressivos
  blush: "rgba(244, 114, 114, 0.35)", // Bochechas coradas
  shadow: "rgba(15, 23, 42, 0.28)", // Sombra de contato suave no chão
};

export class TeddyRenderer {
  /**
   * Renderiza o Teddy em perspectiva 2.5D com suporte completo a direções,
   * estados de animação e acessórios personalizados.
   */
  static drawTeddy(
    ctx: CanvasRenderingContext2D,
    avatar: AvatarConfig,
    x: number,
    y: number,
    direction: Direction = "down",
    state: TeddyAnimationState = "idle",
    time: number = 0,
  ) {
    ctx.save();

    const px = Math.round(x);
    const py = Math.round(y);

    const pose = calculateTeddyPose(state, time);
    const bob = pose.bobY;
    const leg = pose.legOffset;
    const armAngle = pose.armAngle;
    const earWiggle = pose.earWiggle;

    // 1. SOMBRA DE CONTATO 2.5D NO CHÃO
    ctx.fillStyle = TEDDY_PALETTE.shadow;
    ctx.beginPath();
    const shadowScale = state === "celebrate" ? 0.75 : 1;
    ctx.ellipse(px, py + 2, 11 * shadowScale, 4.5 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cor da roupinha selecionada no avatarStore
    const roupaHex = CORES_ROUPA.find((r) => r.id === avatar.roupaCor)?.hex || "#6D3FC3";

    if (direction === "left") {
      // Espelha horizontalmente em torno do pivô do jogador para direção esquerda
      ctx.translate(px, 0);
      ctx.scale(-1, 1);
      ctx.translate(-px, 0);
    }

    // 2. PATINHAS TRASEIRAS / PERNAS
    if (direction === "down" || direction === "up") {
      // Perna esquerda
      ctx.fillStyle = TEDDY_PALETTE.furBase;
      ctx.beginPath();
      ctx.roundRect(px - 7, py - 4 + leg, 5, 6, 2.5);
      ctx.fill();
      ctx.fillStyle = TEDDY_PALETTE.furDark;
      ctx.fillRect(px - 7, py + 1 + leg, 5, 1);

      // Perna direita
      ctx.fillStyle = TEDDY_PALETTE.furBase;
      ctx.beginPath();
      ctx.roundRect(px + 2, py - 4 - leg, 5, 6, 2.5);
      ctx.fill();
      ctx.fillStyle = TEDDY_PALETTE.furDark;
      ctx.fillRect(px + 2, py + 1 - leg, 5, 1);
    } else {
      // Perfil lateral (direita ou esquerda espelhada)
      ctx.fillStyle = TEDDY_PALETTE.furDark;
      ctx.beginPath();
      ctx.roundRect(px - 4 - leg, py - 3, 5, 5, 2.5);
      ctx.fill();

      ctx.fillStyle = TEDDY_PALETTE.furBase;
      ctx.beginPath();
      ctx.roundRect(px + 1 + leg, py - 3, 5, 5, 2.5);
      ctx.fill();
    }

    // 3. TORSO / CORPO
    ctx.fillStyle = TEDDY_PALETTE.furBase;
    ctx.beginPath();
    ctx.ellipse(px, py - 9 + bob, 8.5, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. ROUPINHA / COLETE DE SOCORRISTA (Camada de Customização)
    if (avatar.roupaModelo === "colete_socorrista") {
      // Colete de alta visibilidade amarelo Sinal
      ctx.fillStyle = "#FFC044";
      ctx.beginPath();
      ctx.roundRect(px - 7.5, py - 14 + bob, 15, 9, 3);
      ctx.fill();

      // Faixas reflexivas prateadas
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(px - 7.5, py - 10 + bob, 15, 2);

      // Detalhe roxo da marca Sinal
      ctx.fillStyle = "#6D3FC3";
      if (direction !== "up") {
        ctx.fillRect(px - 2, py - 13 + bob, 4, 3);
      }
    } else if (
      avatar.roupaModelo === "camiseta_sinal" ||
      avatar.roupaModelo === "moletom" ||
      avatar.roupaModelo === "jaqueta"
    ) {
      ctx.fillStyle = roupaHex;
      ctx.beginPath();
      ctx.roundRect(px - 7.5, py - 14 + bob, 15, 9, 3);
      ctx.fill();

      if (avatar.roupaModelo === "jaqueta" && direction !== "up") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.fillRect(px - 1, py - 14 + bob, 2, 9);
      }
    }

    // Barriguinha fofa bege (quando de frente)
    if (direction === "down" && avatar.roupaModelo === "camiseta_sinal") {
      ctx.fillStyle = TEDDY_PALETTE.muzzle;
      ctx.beginPath();
      ctx.ellipse(px, py - 8 + bob, 4.5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Crachá oficial de socorrista Sinal
    if (avatar.acessorio === "cracha" && direction !== "up") {
      // Cordão
      ctx.strokeStyle = "#6D3FC3";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px - 3, py - 14 + bob);
      ctx.lineTo(px, py - 10 + bob);
      ctx.lineTo(px + 3, py - 14 + bob);
      ctx.stroke();

      // Mini crachá
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(px - 2, py - 10 + bob, 4, 5);
      ctx.fillStyle = "#FFC044";
      ctx.fillRect(px - 1.5, py - 9.5 + bob, 3, 2);
    }

    // 5. CABEÇA DO TEDDY
    ctx.fillStyle = TEDDY_PALETTE.furBase;
    ctx.beginPath();
    ctx.ellipse(px, py - 19 + bob, 9, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Volume de luz superior na cabeça
    ctx.fillStyle = TEDDY_PALETTE.furLight;
    ctx.beginPath();
    ctx.ellipse(px, py - 22 + bob, 6.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 6. ORELHAS REDONDAS COM INTERIOR AVELUDADO
    const leftEarX = px - 7;
    const rightEarX = px + 7;
    const earY = py - 24 + bob;

    // Orelha esquerda
    ctx.fillStyle = TEDDY_PALETTE.furBase;
    ctx.beginPath();
    ctx.arc(leftEarX, earY, 3.8, 0, Math.PI * 2);
    ctx.fill();

    // Orelha direita
    ctx.beginPath();
    ctx.arc(rightEarX, earY, 3.8, 0, Math.PI * 2);
    ctx.fill();

    if (direction !== "up") {
      // Interior claro das orelhas
      ctx.fillStyle = TEDDY_PALETTE.innerEar;
      ctx.beginPath();
      ctx.arc(leftEarX, earY, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(rightEarX, earY, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. ROSTO, OLHOS E FOCINHO
    if (direction === "down") {
      // Focinho volumoso claro
      ctx.fillStyle = TEDDY_PALETTE.muzzle;
      ctx.beginPath();
      ctx.ellipse(px, py - 17 + bob, 5.2, 3.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Narizinho preto arredondado
      ctx.fillStyle = TEDDY_PALETTE.nose;
      ctx.beginPath();
      ctx.ellipse(px, py - 19 + bob, 1.8, 1.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sorriso simpático
      ctx.strokeStyle = TEDDY_PALETTE.furDark;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(px, py - 17.5 + bob, 2.2, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Bochechas rosadas
      ctx.fillStyle = TEDDY_PALETTE.blush;
      ctx.beginPath();
      ctx.arc(px - 5, py - 17 + bob, 2, 0, Math.PI * 2);
      ctx.arc(px + 5, py - 17 + bob, 2, 0, Math.PI * 2);
      ctx.fill();

      // Olhos pretos expressivos com brilho de vida
      if (state === "concerned") {
        // Olhar atento/preocupado
        ctx.fillStyle = TEDDY_PALETTE.eye;
        ctx.fillRect(px - 4.5, py - 21 + bob, 2, 2.5);
        ctx.fillRect(px + 2.5, py - 21 + bob, 2, 2.5);
        // Sobrancelha expressiva
        ctx.strokeStyle = TEDDY_PALETTE.furDark;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px - 5, py - 23 + bob);
        ctx.lineTo(px - 2.5, py - 22 + bob);
        ctx.moveTo(px + 5, py - 23 + bob);
        ctx.lineTo(px + 2.5, py - 22 + bob);
        ctx.stroke();
      } else {
        ctx.fillStyle = TEDDY_PALETTE.eye;
        ctx.beginPath();
        ctx.arc(px - 3.5, py - 21 + bob, 1.5, 0, Math.PI * 2);
        ctx.arc(px + 3.5, py - 21 + bob, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Ponto de luz no olhar
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(px - 4, py - 22 + bob, 1, 1);
        ctx.fillRect(px + 3, py - 22 + bob, 1, 1);
      }
    } else if (direction === "right" || direction === "left") {
      // Focinho de perfil proeminente
      ctx.fillStyle = TEDDY_PALETTE.muzzle;
      ctx.beginPath();
      ctx.ellipse(px + 4, py - 17 + bob, 4.2, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Narizinho de perfil
      ctx.fillStyle = TEDDY_PALETTE.nose;
      ctx.beginPath();
      ctx.arc(px + 6.5, py - 18.5 + bob, 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Olho de perfil
      ctx.fillStyle = TEDDY_PALETTE.eye;
      ctx.beginPath();
      ctx.arc(px + 2, py - 21 + bob, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(px + 1.5, py - 22 + bob, 1, 1);
    }

    // 8. ÓCULOS (Se equipado)
    if (avatar.acessorio === "oculos" && direction !== "up") {
      ctx.strokeStyle = "#1E293B";
      ctx.lineWidth = 1;
      if (direction === "down") {
        ctx.strokeRect(px - 5.5, py - 23 + bob, 4, 4);
        ctx.strokeRect(px + 1.5, py - 23 + bob, 4, 4);
        ctx.beginPath();
        ctx.moveTo(px - 1.5, py - 21 + bob);
        ctx.lineTo(px + 1.5, py - 21 + bob);
        ctx.stroke();
      } else {
        ctx.strokeRect(px, py - 23 + bob, 4.5, 4);
      }
    }

    // 9. BONÉ ESTILOSO (Se equipado)
    if (avatar.acessorio === "bone") {
      ctx.fillStyle = "#2E7DD1";
      ctx.beginPath();
      ctx.ellipse(px, py - 24 + bob, 7, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Aba do boné
      ctx.fillStyle = "#1E40AF";
      if (direction === "down" || direction === "right") {
        ctx.beginPath();
        ctx.roundRect(px + (direction === "right" ? 1 : -4), py - 23 + bob, 8, 2, 1);
        ctx.fill();
      } else if (direction === "left") {
        ctx.beginPath();
        ctx.roundRect(px - 4, py - 23 + bob, 8, 2, 1);
        ctx.fill();
      }
    }

    // 10. BRACINHOS / PATINHAS DIANTEIRAS
    ctx.fillStyle = TEDDY_PALETTE.furBase;
    if (state === "assist" || state === "interact") {
      // Bracinhos estendidos para frente prestando cuidado
      ctx.beginPath();
      ctx.roundRect(px - 10, py - 12 + bob, 6, 4, 2);
      ctx.roundRect(px + 4, py - 12 + bob, 6, 4, 2);
      ctx.fill();
    } else if (state === "celebrate") {
      // Bracinhos levantados para cima comemorando
      ctx.beginPath();
      ctx.roundRect(px - 10, py - 20 + bob, 4, 8, 2);
      ctx.roundRect(px + 6, py - 20 + bob, 4, 8, 2);
      ctx.fill();
    } else if (direction === "down" || direction === "up") {
      // Balanço natural dos bracinhos na caminhada/idle
      ctx.beginPath();
      ctx.roundRect(px - 10, py - 11 + bob + armAngle * 4, 4, 6, 2);
      ctx.roundRect(px + 6, py - 11 + bob - armAngle * 4, 4, 6, 2);
      ctx.fill();
    } else {
      // Perfil
      ctx.beginPath();
      ctx.roundRect(px + 1 + armAngle * 5, py - 10 + bob, 5, 5, 2.5);
      ctx.fill();
    }

    ctx.restore();
  }
}

