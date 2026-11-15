import type { AvatarConfig } from "@/types/minigame";
import {
  generateTeddyAtlasCanvas,
  TEDDY_CANONICAL_FRAMES,
  type TeddyCustomization,
} from "@/lib/teddyCustomTexture";

export interface TeddyFrameRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const TEDDY_ATLAS_FRAMES = {
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

/**
 * Desenha o Teddy na tela de prévia utilizando a textura real com recoloração de paleta e estampa no peito.
 * Não desenha retângulos sobrepostos ou formas vetoriais artificiais.
 */
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

  // Identifica o frame canônico
  let frameKey: keyof typeof TEDDY_CANONICAL_FRAMES;
  if (isBack) {
    frameKey = frameIndex === 1 ? "0-4" : frameIndex === 2 ? "0-5" : "0-3";
  } else {
    frameKey = frameIndex === 1 ? "0-1" : frameIndex === 2 ? "0-2" : "0-0";
  }

  const frame = TEDDY_CANONICAL_FRAMES[frameKey];
  const drawH = 180;
  const drawW = (frame.w / frame.h) * drawH;
  const cx = targetWidth / 2;
  const cy = targetHeight - 20;

  // Sombra suave sob os pés
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.beginPath();
  ctx.ellipse(cx, cy - 2, drawW * 0.35, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(cx, cy);

  if (isLeft) {
    ctx.scale(-1, 1);
  }

  if (img && img.complete && img.naturalWidth > 0) {
    // Configuração do personalizador 2.0
    const customConfig: TeddyCustomization = {
      corCamiseta: avatar.corCamiseta ?? (avatar.roupaCor as any) ?? "roxo",
      estampa: avatar.estampa ?? "lisa",
      corBone:
        avatar.corBone ??
        (avatar.boneModelo === "bone_azul"
          ? "azul"
          : avatar.boneModelo === "bone_vermelho"
          ? "vermelho"
          : "roxo"),
    };

    // Gera textura com paleta e estampas em pixel art integradas
    const atlasCanvas = generateTeddyAtlasCanvas(img, customConfig);

    ctx.drawImage(
      atlasCanvas,
      frame.x,
      frame.y,
      frame.w,
      frame.h,
      -drawW / 2,
      -drawH,
      drawW,
      drawH
    );
  }

  ctx.restore();
  ctx.restore();
}
