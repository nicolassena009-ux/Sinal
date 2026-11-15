import type { AvatarConfig } from "@/types/minigame";
import { TONS_PELE, CORES_CABELO, CORES_ROUPA, CORES_CALCADO } from "@/lib/avatarStore";
import { TeddyRenderer } from "./TeddyRenderer";
import type { TeddyAnimationState, Direction } from "./animation";

export class PixelRenderer {
  static drawLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
    ctx.save();
    ctx.font = "bold 7px monospace";
    ctx.textAlign = "center";
    const width = ctx.measureText(text).width + 6;
    ctx.fillStyle = "#172033";
    ctx.fillRect(x - width / 2, y - 7, width, 10);
    ctx.fillStyle = "#fff";
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  static drawInteractionPrompt(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    label = "AGIR",
    time = 0,
  ) {
    ctx.save();
    const bob = Math.sin(time * 6) * 1.5;
    const py = y - 36 + bob;

    ctx.font = "bold 8px monospace";
    ctx.textAlign = "center";
    const text = `✦ ${label}`;
    const width = ctx.measureText(text).width + 8;

    // Fundo pill pulsante
    ctx.fillStyle = "#6D3FC3";
    ctx.beginPath();
    ctx.roundRect(x - width / 2, py - 6, width, 12, 6);
    ctx.fill();

    ctx.strokeStyle = "#FFC044";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(text, x, py + 3);

    ctx.restore();
  }

  static drawMarker(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    label: string,
    active: boolean,
  ) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y + 10, active ? 8 : 5, 0, Math.PI * 2);
    ctx.fillStyle = active ? "#6D28D9" : "#047857";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText(label, x, y + 13);
    ctx.restore();
  }

  static drawSceneItem(
    ctx: CanvasRenderingContext2D,
    item: import("@/data/gameplay").SceneItem,
    theme: string,
    level: number,
    step: number,
    frame: number,
  ) {
    const { x, y, kind } = item;
    ctx.save();
    if (kind === "victim") {
      const stage =
        theme === "engasgo" && level === 2
          ? 1
          : theme === "queimadura" && level === 2 && step > 0
            ? 1
            : theme === "convulsao" && level === 2 && step > 0
              ? 1
              : 0;
      this.drawThemeVictim(ctx, theme, x, y - 10, stage, frame);
    } else if (kind === "adult") {
      this.drawHumanNPC(
        ctx,
        {
          tomPele: 2,
          cabeloEstilo: "cacheado",
          cabeloCor: "preto",
          roupaModelo: "jaqueta",
          roupaCor: "aqua",
          calcadoCor: "preto",
          acessorio: "nenhum",
        },
        x,
        y - 10,
      );
    } else if (kind === "phone") {
      ctx.fillStyle = "#172033";
      ctx.fillRect(x - 6, y - 15, 12, 20);
      ctx.fillStyle = "#93C5FD";
      ctx.fillRect(x - 4, y - 12, 8, 12);
    } else if (kind === "cloth") {
      ctx.fillStyle = theme === "convulsao" ? "#A855F7" : "#fff";
      ctx.fillRect(x - 8, y - 7, 16, 10);
      ctx.strokeStyle = "#64748B";
      ctx.strokeRect(x - 8, y - 7, 16, 10);
    } else if (kind === "cone") {
      ctx.fillStyle = "#EA580C";
      ctx.beginPath();
      ctx.moveTo(x, y - 16);
      ctx.lineTo(x - 8, y + 2);
      ctx.lineTo(x + 8, y + 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillRect(x - 4, y - 6, 8, 3);
    } else if (kind === "clock") {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x, y - 6, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#172033";
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - 12);
      ctx.lineTo(x, y - 6);
      ctx.lineTo(x + 4, y - 6);
      ctx.stroke();
    } else {
      const moved = theme === "convulsao" && level === 1 && step >= 2;
      ctx.fillStyle = "#92400E";
      ctx.fillRect((moved ? 135 : x) - 5, y - 9, 10, 12);
    }
    this.drawLabel(ctx, item.label, x, y - 34);
    ctx.restore();
  }

  /**
   * Desenha o Teddy como protagonista principal em perspectiva 2.5D
   */
  static drawPlayer(
    ctx: CanvasRenderingContext2D,
    avatar: AvatarConfig,
    x: number,
    y: number,
    direction: Direction = "down",
    frame: number = 0,
    isMoving: boolean = false,
    isInteracting: boolean = false,
    state?: TeddyAnimationState,
    time?: number,
  ) {
    const resolvedState: TeddyAnimationState =
      state || (isInteracting ? "assist" : isMoving ? "walk" : "idle");
    const animTime = time !== undefined ? time : frame / 60;
    TeddyRenderer.drawTeddy(ctx, avatar, x, y, direction, resolvedState, animTime);
  }

  /**
   * Desenha NPCs humanos secundários (ex.: a professora ou socorrista adulto)
   */
  static drawHumanNPC(
    ctx: CanvasRenderingContext2D,
    avatar: AvatarConfig,
    x: number,
    y: number,
    direction: "down" | "up" | "left" | "right" = "down",
    frame: number = 0,
  ) {
    ctx.save();
    const px = Math.round(x);
    const py = Math.round(y);

    // Sombra sob os pés
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(px, py + 12, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    const tomPele = TONS_PELE[avatar.tomPele ?? 1] || TONS_PELE[1];
    const corCabelo = CORES_CABELO.find((c) => c.id === avatar.cabeloCor)?.hex || "#4E3120";
    const corRoupa = CORES_ROUPA.find((r) => r.id === avatar.roupaCor)?.hex || "#53C6B6";

    // Calçados e Pernas
    ctx.fillStyle = "#18181B";
    ctx.fillRect(px - 6, py + 8, 4, 4);
    ctx.fillRect(px + 2, py + 8, 4, 4);

    // Calça
    ctx.fillStyle = "#1E293B";
    ctx.fillRect(px - 7, py + 4, 14, 5);

    // Tronco / Jaleco ou Jaqueta da Professora
    ctx.fillStyle = corRoupa;
    ctx.fillRect(px - 8, py - 6, 16, 11);

    // Braços
    ctx.fillStyle = tomPele.cor;
    ctx.fillRect(px - 10, py - 4, 3, 6);
    ctx.fillRect(px + 7, py - 4, 3, 6);

    // Cabeça
    ctx.fillStyle = tomPele.cor;
    ctx.fillRect(px - 7, py - 20, 14, 14);

    // Rosto
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(px - 4, py - 14, 2, 3);
    ctx.fillRect(px + 2, py - 14, 2, 3);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(px - 4, py - 14, 1, 1);
    ctx.fillRect(px + 2, py - 14, 1, 1);

    // Cabelo
    ctx.fillStyle = corCabelo;
    ctx.fillRect(px - 9, py - 24, 18, 7);
    ctx.fillRect(px - 9, py - 18, 3, 8);
    ctx.fillRect(px + 6, py - 18, 3, 8);

    ctx.restore();
  }

  /**
   * Desenha a vítima ou colega central de cada tema
   */
  static drawThemeVictim(
    ctx: CanvasRenderingContext2D,
    theme: string,
    x: number,
    y: number,
    stage: number = 0,
    frame: number = 0,
  ) {
    ctx.save();
    const px = Math.round(x);
    const py = Math.round(y);

    if (theme === "engasgo") {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.ellipse(px, py + 12, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cadeira
      ctx.fillStyle = "#78350F";
      ctx.fillRect(px - 9, py - 14, 18, 26);

      // Corpo
      ctx.fillStyle = "#2563EB";
      ctx.fillRect(px - 8, py - 4, 16, 12);

      // Cabeça
      ctx.fillStyle = stage === 0 ? "#E0977E" : "#DEAB88";
      ctx.fillRect(px - 6, py - 18, 12, 14);

      // Cabelo castanho
      ctx.fillStyle = "#451A03";
      ctx.fillRect(px - 7, py - 21, 14, 5);

      // Mãos levadas ao pescoço (sinal universal de engasgo)
      ctx.fillStyle = "#E0977E";
      ctx.fillRect(px - 5, py - 8, 4, 4);
      ctx.fillRect(px + 1, py - 8, 4, 4);

      // Olhos assustados
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(px - 4, py - 14, 2, 3);
      ctx.fillRect(px + 2, py - 14, 2, 3);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(px - 4, py - 15, 2, 1);
      ctx.fillRect(px + 2, py - 15, 2, 1);

      // Partículas de tosse se estágio inicial
      if (stage === 0 && Math.floor(frame / 10) % 2 === 0) {
        ctx.fillStyle = "#93C5FD";
        ctx.fillRect(px + 7, py - 12, 2, 2);
        ctx.fillRect(px + 10, py - 14, 3, 3);
      }
    } else if (theme === "convulsao") {
      if (stage > 0) {
        ctx.fillStyle = "#A855F7";
        ctx.fillRect(px - 18, py - 6, 12, 8);
      }

      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.ellipse(px, py + 4, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#4338CA";
      ctx.fillRect(px - 14, py - 4, 24, 8);

      ctx.fillStyle = "#DEAB88";
      ctx.fillRect(px - 18, py - 6, 8, 8);

      ctx.fillStyle = "#1C1917";
      ctx.fillRect(px - 20, py - 8, 10, 6);
    } else if (theme === "parada-cardiorrespiratoria") {
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.ellipse(px, py + 4, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#DC2626";
      ctx.fillRect(px - 14, py - 3, 26, 7);

      ctx.fillStyle = "#BA7F59";
      ctx.fillRect(px - 19, py - 5, 8, 8);

      ctx.fillStyle = "#4E3120";
      ctx.fillRect(px - 21, py - 7, 10, 5);
    } else if (theme === "queimadura") {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.ellipse(px, py + 12, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#16A34A";
      ctx.fillRect(px - 7, py - 6, 14, 14);

      ctx.fillStyle = "#DEAB88";
      ctx.fillRect(px - 6, py - 19, 12, 13);

      ctx.fillStyle = "#C89C32";
      ctx.fillRect(px - 7, py - 22, 14, 5);

      ctx.fillStyle = "#EF4444";
      ctx.fillRect(px + 4, py - 4, 5, 5);
    } else if (theme === "trauma") {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.ellipse(px, py + 4, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#D97706";
      ctx.fillRect(px - 12, py - 3, 22, 7);

      ctx.fillStyle = "#F5D0B0";
      ctx.fillRect(px - 16, py - 5, 8, 8);

      ctx.fillStyle = "#1C1917";
      ctx.fillRect(px - 18, py - 7, 10, 5);
    }
    ctx.restore();
  }

  /**
   * Renderiza os ambientes e cenários temáticos
   */
  static drawEnvironment(
    ctx: CanvasRenderingContext2D,
    scene: string,
    width: number,
    height: number,
  ) {
    ctx.save();
    if (scene === "refeitorio") {
      ctx.fillStyle = "#F8FAFC";
      ctx.fillRect(0, 0, width, height);

      // Parede de fundo do refeitório
      ctx.fillStyle = "#E2E8F0";
      ctx.fillRect(0, 0, width, 55);

      // Faixa decorativa azul Sinal
      ctx.fillStyle = "#2E7DD1";
      ctx.fillRect(0, 52, width, 3);

      // Janela
      ctx.fillStyle = "#93C5FD";
      ctx.fillRect(40, 10, 50, 32);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 10, 50, 32);

      // Piso de cerâmica em perspectiva
      ctx.strokeStyle = "#CBD5E1";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 55);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 55; y <= height; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Mesa e bancos do refeitório (Obstáculo físico: x: 160, y: 80, width: 70, height: 50)
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(158, 82, 74, 52);

      ctx.fillStyle = "#CBD5E1"; // Tampo da mesa
      ctx.fillRect(160, 80, 70, 40);
      ctx.fillStyle = "#94A3B8"; // Borda da mesa
      ctx.fillRect(160, 120, 70, 10);

      // Bandejas e copos na mesa
      ctx.fillStyle = "#EF4444";
      ctx.fillRect(170, 88, 12, 8);
      ctx.fillStyle = "#3B82F6";
      ctx.fillRect(200, 86, 6, 10);
    } else if (scene === "sala_aula") {
      ctx.fillStyle = "#F1F5F9";
      ctx.fillRect(0, 0, width, height);

      // Parede com lousa
      ctx.fillStyle = "#E2E8F0";
      ctx.fillRect(0, 0, width, 55);
      ctx.fillStyle = "#6D3FC3";
      ctx.fillRect(0, 52, width, 3);

      // Lousa escolar
      ctx.fillStyle = "#064E3B";
      ctx.fillRect(110, 8, 140, 38);
      ctx.strokeStyle = "#78350F";
      ctx.lineWidth = 3;
      ctx.strokeRect(110, 8, 140, 38);

      // Carteiras escolares
      ctx.fillStyle = "#D97706";
      ctx.fillRect(80, 85, 34, 32);
      ctx.fillStyle = "#B45309";
      ctx.fillRect(80, 117, 34, 4);
    } else if (scene === "parque") {
      // Gramado verde ao ar livre
      ctx.fillStyle = "#A7F3D0";
      ctx.fillRect(0, 0, width, height);

      // Céu e árvores ao fundo
      ctx.fillStyle = "#BAE6FD";
      ctx.fillRect(0, 0, width, 55);

      ctx.fillStyle = "#059669";
      for (let x = 10; x < width; x += 45) {
        ctx.beginPath();
        ctx.arc(x, 50, 22, 0, Math.PI * 2);
        ctx.fill();
      }

      // Caminho de terra/pedra
      ctx.fillStyle = "#FDE68A";
      ctx.beginPath();
      ctx.moveTo(0, 120);
      ctx.bezierCurveTo(120, 110, 240, 140, width, 125);
      ctx.lineTo(width, 175);
      ctx.bezierCurveTo(240, 190, 120, 160, 0, 170);
      ctx.closePath();
      ctx.fill();
    } else if (scene === "cozinha") {
      // Cozinha doméstica
      ctx.fillStyle = "#F8FAFC";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#E2E8F0";
      ctx.fillRect(0, 0, width, 55);
      ctx.fillStyle = "#FFC044";
      ctx.fillRect(0, 52, width, 3);

      // Balcão da pia e fogão
      ctx.fillStyle = "#94A3B8";
      ctx.fillRect(40, 55, 280, 20);

      // Fogão à esquerda
      ctx.fillStyle = "#334155";
      ctx.fillRect(50, 50, 30, 25);
      ctx.fillStyle = "#DC2626"; // Boca do fogão acesa
      ctx.fillRect(58, 54, 14, 5);

      // Pia à direita
      ctx.fillStyle = "#E2E8F0";
      ctx.fillRect(185, 52, 35, 20);
      ctx.fillStyle = "#0284C7"; // Água na pia
      ctx.fillRect(190, 56, 25, 12);
    } else if (scene === "patio") {
      // Pátio com piso quadriculado e escada
      ctx.fillStyle = "#E2E8F0";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#CBD5E1";
      ctx.fillRect(0, 0, width, 55);
      ctx.fillStyle = "#53C6B6";
      ctx.fillRect(0, 52, width, 3);

      // Degraus de escada ao fundo
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = i % 2 === 0 ? "#94A3B8" : "#64748B";
        ctx.fillRect(240 - i * 15, 20 + i * 8, 90, 8);
      }
    }
    ctx.restore();
  }
}
