import type { AvatarConfig } from "@/types/minigame";
import { CORES_ROUPA } from "@/lib/avatarStore";

export interface TeddyFrameRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const TEDDY_ATLAS_FRAMES = {
  front_idle: { x: 45, y: 77, w: 144, h: 233 },
  front_walk1: { x: 239, y: 80, w: 140, h: 231 },
  front_walk2: { x: 433, y: 81, w: 137, h: 230 },
  back_idle: { x: 614, y: 81, w: 139, h: 228 },
  back_walk1: { x: 801, y: 84, w: 134, h: 226 },
  back_walk2: { x: 981, y: 83, w: 134, h: 227 },
};

let cachedImage: HTMLImageElement | null = null;
let imageLoadingPromise: Promise<HTMLImageElement> | null = null;

export function loadTeddySprite(): Promise<HTMLImageElement> {
  if (cachedImage && cachedImage.complete && cachedImage.naturalWidth > 0) {
    return Promise.resolve(cachedImage);
  }
  if (imageLoadingPromise) return imageLoadingPromise;

  imageLoadingPromise = new Promise((resolve, reject) => {
    const img = new Image();
    img.src = "/assets/burns/characters.png";
    img.onload = () => {
      cachedImage = img;
      resolve(img);
    };
    img.onerror = (e) => reject(e);
  });
  return imageLoadingPromise;
}

export function drawTeddyOnCanvas(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  avatar: AvatarConfig,
  direction: "down" | "up" | "left" | "right",
  frameIndex: number,
  targetWidth: number,
  targetHeight: number
) {
  ctx.save();
  ctx.clearRect(0, 0, targetWidth, targetHeight);
  ctx.imageSmoothingEnabled = false;

  const isBack = direction === "up";
  const isLeft = direction === "left";
  const isRight = direction === "right";

  // Escolhe o frame do atlas
  let rect: TeddyFrameRect;
  if (isBack) {
    rect = frameIndex === 1 ? TEDDY_ATLAS_FRAMES.back_walk1 : frameIndex === 2 ? TEDDY_ATLAS_FRAMES.back_walk2 : TEDDY_ATLAS_FRAMES.back_idle;
  } else {
    rect = frameIndex === 1 ? TEDDY_ATLAS_FRAMES.front_walk1 : frameIndex === 2 ? TEDDY_ATLAS_FRAMES.front_walk2 : TEDDY_ATLAS_FRAMES.front_idle;
  }

  const drawH = 175;
  const drawW = (rect.w / rect.h) * drawH;
  const cx = targetWidth / 2;
  const cy = targetHeight - 20;

  // Sombra suave sob os pés
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(cx, cy - 2, drawW * 0.35, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(cx, cy);

  if (isLeft) {
    ctx.scale(-1, 1);
  }

  // 1. SPRITE BASE DO TEDDY
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(
      img,
      rect.x,
      rect.y,
      rect.w,
      rect.h,
      -drawW / 2,
      -drawH,
      drawW,
      drawH
    );

    // Ajuste de Tonalidade da Pelagem (se não for o caramelo padrão)
    const pelagem = avatar.pelagemCor ?? "caramelo";
    if (pelagem !== "caramelo") {
      ctx.save();
      ctx.globalCompositeOperation = "color";
      ctx.fillStyle =
        pelagem === "mel"
          ? "rgba(229, 169, 88, 0.45)"
          : pelagem === "cacau"
          ? "rgba(123, 70, 29, 0.45)"
          : "rgba(243, 229, 208, 0.45)";
      ctx.fillRect(-drawW / 2, -drawH, drawW, drawH);
      ctx.restore();
    }
  }

  // Coordenadas relativas aos pés (y=0 é os pés, y=-drawH é o topo)
  const scale = drawH / 233;

  // 2. MOCHILA
  const mochila = avatar.mochilaModelo ?? "mochila_amarela";
  if (mochila !== "nenhuma") {
    const corMochila =
      mochila === "mochila_vermelha"
        ? "#E53E3E"
        : mochila === "mochila_azul"
        ? "#2E7DD1"
        : "#FFC044";

    if (isBack) {
      // De costas: mochila em destaque total
      ctx.fillStyle = corMochila;
      ctx.beginPath();
      ctx.roundRect(-24 * scale, -165 * scale, 48 * scale, 58 * scale, 8 * scale);
      ctx.fill();

      // Bolso inferior
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.beginPath();
      ctx.roundRect(-20 * scale, -135 * scale, 40 * scale, 24 * scale, 5 * scale);
      ctx.fill();

      if (mochila === "mochila_vermelha") {
        // Cruz branca de emergência
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(-3 * scale, -158 * scale, 6 * scale, 18 * scale);
        ctx.fillRect(-9 * scale, -152 * scale, 18 * scale, 6 * scale);
      } else {
        // Detalhe de zíper e marca SINAL
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(-12 * scale, -155 * scale, 24 * scale, 3 * scale);
      }
    } else if (isLeft || isRight) {
      // Perfil: silhueta da mochila atrás do corpo
      ctx.fillStyle = corMochila;
      ctx.beginPath();
      ctx.roundRect(-32 * scale, -160 * scale, 16 * scale, 50 * scale, 6 * scale);
      ctx.fill();
    } else {
      // De frente: alças visíveis descendo pelos ombros
      ctx.fillStyle = corMochila;
      ctx.fillRect(-22 * scale, -160 * scale, 6 * scale, 54 * scale);
      ctx.fillRect(16 * scale, -160 * scale, 6 * scale, 54 * scale);

      // Fivelas das alças
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(-23 * scale, -135 * scale, 8 * scale, 4 * scale);
      ctx.fillRect(15 * scale, -135 * scale, 8 * scale, 4 * scale);
    }
  }

  // 3. ROUPA / COLETE
  const modelo = avatar.roupaModelo ?? "camiseta_sinal";
  const corHex = CORES_ROUPA.find((c) => c.id === avatar.roupaCor)?.hex ?? "#6D3FC3";

  const torsoTop = -160 * scale;
  const torsoH = 70 * scale;
  const torsoW = 60 * scale;
  const torsoX = -torsoW / 2;

  if (modelo === "colete_socorrista") {
    // Fundo amarelo alta visibilidade
    ctx.fillStyle = "#FFC044";
    ctx.beginPath();
    ctx.roundRect(torsoX, torsoTop, torsoW, torsoH, 6 * scale);
    ctx.fill();

    // Faixas refletivas prateadas
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(torsoX, torsoTop + 18 * scale, torsoW, 7 * scale);
    ctx.fillRect(torsoX, torsoTop + 38 * scale, torsoW, 7 * scale);

    // Borda e zíper
    if (!isBack) {
      ctx.fillStyle = "#563581";
      ctx.fillRect(-2 * scale, torsoTop + 4 * scale, 4 * scale, torsoH - 4 * scale);
    }
  } else if (modelo === "jaqueta") {
    // Jaqueta esportiva
    ctx.fillStyle = corHex;
    ctx.beginPath();
    ctx.roundRect(torsoX, torsoTop, torsoW, torsoH, 6 * scale);
    ctx.fill();

    if (!isBack) {
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(-2 * scale, torsoTop + 6 * scale, 4 * scale, torsoH - 6 * scale);
    }
    // Listras laterais brancas
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(torsoX + 2 * scale, torsoTop + 4 * scale, 4 * scale, torsoH - 8 * scale);
    ctx.fillRect(torsoX + torsoW - 6 * scale, torsoTop + 4 * scale, 4 * scale, torsoH - 8 * scale);
  } else if (modelo === "moletom") {
    // Moletom confortável com bolso
    ctx.fillStyle = corHex;
    ctx.beginPath();
    ctx.roundRect(torsoX - 2 * scale, torsoTop, torsoW + 4 * scale, torsoH + 2 * scale, 8 * scale);
    ctx.fill();

    if (!isBack) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.beginPath();
      ctx.roundRect(-16 * scale, torsoTop + 36 * scale, 32 * scale, 22 * scale, 4 * scale);
      ctx.fill();
    }
  } else {
    // Camiseta Oficial SINAL ou Branca Neutra
    ctx.fillStyle = modelo === "camiseta_branca" ? "#F3F4F6" : corHex;
    ctx.beginPath();
    ctx.roundRect(torsoX, torsoTop, torsoW, torsoH, 6 * scale);
    ctx.fill();

    if (!isBack && modelo === "camiseta_sinal") {
      // Emblema SINAL no peito
      ctx.fillStyle = "#FFC044";
      ctx.beginPath();
      ctx.arc(0, torsoTop + 22 * scale, 7 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(0, torsoTop + 22 * scale, 3.5 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 4. ACESSÓRIO EXTRA (Crachá ou Óculos)
  const acc = avatar.acessorio ?? "cracha";
  if (!isBack) {
    if (acc === "cracha") {
      // Cordão roxo
      ctx.strokeStyle = "#6D3FC3";
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(-10 * scale, torsoTop);
      ctx.lineTo(2 * scale, torsoTop + 24 * scale);
      ctx.lineTo(10 * scale, torsoTop);
      ctx.stroke();

      // Mini crachá branco com faixa amarela
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(-5 * scale, torsoTop + 22 * scale, 14 * scale, 18 * scale, 2 * scale);
      ctx.fill();
      ctx.fillStyle = "#FFC044";
      ctx.fillRect(-5 * scale, torsoTop + 22 * scale, 14 * scale, 5 * scale);
    } else if (acc === "oculos") {
      // Armação estilosa nos olhos
      ctx.strokeStyle = "#1E293B";
      ctx.lineWidth = 3 * scale;
      ctx.strokeRect(-22 * scale, -195 * scale, 18 * scale, 14 * scale);
      ctx.strokeRect(4 * scale, -195 * scale, 18 * scale, 14 * scale);
      ctx.beginPath();
      ctx.moveTo(-4 * scale, -188 * scale);
      ctx.lineTo(4 * scale, -188 * scale);
      ctx.stroke();
    }
  }

  // 5. BONÉ / CABEÇA
  const bone = avatar.boneModelo ?? "bone_roxo";
  if (bone !== "nenhum") {
    if (bone === "faixa") {
      // Faixa de socorrista branca com cruz na testa
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(-30 * scale, -210 * scale, 60 * scale, 12 * scale, 3 * scale);
      ctx.fill();
      // Cruz vermelha
      ctx.fillStyle = "#E53E3E";
      ctx.fillRect(-2.5 * scale, -209 * scale, 5 * scale, 10 * scale);
      ctx.fillRect(-6 * scale, -206.5 * scale, 12 * scale, 5 * scale);
    } else {
      const corBone = bone === "bone_azul" ? "#2E7DD1" : bone === "bone_vermelho" ? "#E53E3E" : "#6D3FC3";
      const corAba = bone === "bone_azul" ? "#1D4ED8" : bone === "bone_vermelho" ? "#B91C1C" : "#52289E";

      // Copa arredondada do boné
      ctx.fillStyle = corBone;
      ctx.beginPath();
      ctx.roundRect(-27 * scale, -230 * scale, 54 * scale, 25 * scale, 10 * scale);
      ctx.fill();

      // Botão superior do boné
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(0, -231 * scale, 3 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Aba do boné
      ctx.fillStyle = corAba;
      if (!isBack) {
        const abaX = isLeft ? -38 * scale : -14 * scale;
        ctx.beginPath();
        ctx.roundRect(abaX, -210 * scale, 44 * scale, 7 * scale, 3 * scale);
        ctx.fill();
      } else {
        // Fecho traseiro
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(-8 * scale, -210 * scale, 16 * scale, 5 * scale);
      }
    }
  }

  ctx.restore();
  ctx.restore();
}
