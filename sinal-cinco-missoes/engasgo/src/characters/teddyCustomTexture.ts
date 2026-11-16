/**
 * SINAL — Personalização 2.0 do Mascote Teddy (Refinamento Artístico Final)
 * Gerador de texturas de alta fidelidade em pixel art por paleta e estampas integradas.
 * Preserva 100% dos pixels originais de olhos, focinho, pelagem marrom, mochila e contornos.
 */

export type TeddyShirtColor = "roxo" | "azul" | "vermelho" | "verde" | "amarelo";
export type TeddyCapColor = "roxo" | "azul" | "vermelho" | "verde" | "amarelo";
export type TeddyDecal = "lisa" | "estrela" | "coracao" | "cruz" | "sinal";

export interface TeddyCustomization {
  corCamiseta: TeddyShirtColor;
  estampa: TeddyDecal;
  corBone: TeddyCapColor;
}

export const DEFAULT_TEDDY_CUSTOM: TeddyCustomization = {
  corCamiseta: "roxo",
  estampa: "lisa",
  corBone: "roxo",
};

export const TEDDY_SHIRT_COLORS = [
  { id: "roxo" as const, nome: "Roxo Oficial SINAL", hex: "#6D3FC3" },
  { id: "azul" as const, nome: "Azul Socorrista", hex: "#2563EB" },
  { id: "vermelho" as const, nome: "Vermelho Emergência", hex: "#DC2626" },
  { id: "verde" as const, nome: "Verde Socorro", hex: "#16A34A" },
  { id: "amarelo" as const, nome: "Amarelo Alerta", hex: "#F59E0B" },
];

export const TEDDY_CAP_COLORS = [
  { id: "roxo" as const, nome: "Boné Roxo SINAL", hex: "#6D3FC3" },
  { id: "azul" as const, nome: "Boné Azul", hex: "#2563EB" },
  { id: "vermelho" as const, nome: "Boné Vermelho", hex: "#DC2626" },
  { id: "verde" as const, nome: "Boné Verde", hex: "#16A34A" },
  { id: "amarelo" as const, nome: "Boné Amarelo", hex: "#F59E0B" },
];

export const TEDDY_DECAL_OPTIONS = [
  { id: "lisa" as const, nome: "Camiseta Lisa (Original)", desc: "Sem estampa adicional" },
  { id: "estrela" as const, nome: "Estrela Guia", desc: "Estrela dourada em pixel art" },
  { id: "coracao" as const, nome: "Coração da Vida", desc: "Coração vermelho de socorrista" },
  { id: "cruz" as const, nome: "Primeiros Socorros", desc: "Cruz médica de emergência" },
  { id: "sinal" as const, nome: "Emblema SINAL", desc: "Símbolo oficial do projeto" },
];

/**
 * Coordenadas exatas dos 8 frames canônicos do Teddy na linha 0 de `burns/characters.png`.
 * Centros do peito calibrados milimetricamente na área livre da camiseta, longe de braços e mochila.
 */
export const TEDDY_CANONICAL_FRAMES = {
  "0-0": { x: 45, y: 77, w: 144, h: 233, chestX: 89, chestY: 160, hasChest: true },
  "0-1": { x: 239, y: 80, w: 140, h: 231, chestX: 82, chestY: 157, hasChest: true },
  "0-2": { x: 433, y: 81, w: 137, h: 230, chestX: 84, chestY: 162, hasChest: true },
  "0-3": { x: 614, y: 81, w: 139, h: 228, chestX: 0, chestY: 0, hasChest: false },
  "0-4": { x: 801, y: 84, w: 134, h: 226, chestX: 0, chestY: 0, hasChest: false },
  "0-5": { x: 981, y: 83, w: 134, h: 227, chestX: 0, chestY: 0, hasChest: false },
  "0-6": { x: 1162, y: 84, w: 156, h: 226, chestX: 87, chestY: 162, hasChest: true },
  "0-7": { x: 1352, y: 70, w: 159, h: 240, chestX: 81, chestY: 160, hasChest: true },
} as const;

export type TeddyFrameKey = keyof typeof TEDDY_CANONICAL_FRAMES;

/**
 * Identifica se um pixel pertence ao tecido roxo do Teddy.
 * Filtra contornos pretos, pelagem marrom, mochila amarela e crachá.
 */
export function isTeddyPurple(r: number, g: number, b: number): boolean {
  if (r < 40 && g < 40 && b < 40) return false;
  if (r > 160 && g > 110 && b < 80) return false;
  if (r > 100 && g > 60 && b < 50) return false;
  return b > 65 && r > 45 && b - g > 18 && r - g > 8;
}

function recolorPixel(
  origR: number,
  origG: number,
  origB: number,
  colorId: TeddyShirtColor | TeddyCapColor
): [number, number, number] {
  if (colorId === "roxo") {
    return [origR, origG, origB];
  }

  const lum = 0.299 * origR + 0.587 * origG + 0.114 * origB;
  const factor = lum / 91.8;

  switch (colorId) {
    case "azul": {
      const r = Math.min(255, Math.max(0, Math.round(37 * factor)));
      const g = Math.min(255, Math.max(0, Math.round(99 * factor * 1.05)));
      const b = Math.min(255, Math.max(0, Math.round(235 * (0.4 + 0.6 * factor))));
      return [r, g, b];
    }
    case "vermelho": {
      const r = Math.min(255, Math.max(0, Math.round(220 * (0.45 + 0.55 * factor))));
      const g = Math.min(255, Math.max(0, Math.round(38 * factor * 0.9)));
      const b = Math.min(255, Math.max(0, Math.round(38 * factor * 0.9)));
      return [r, g, b];
    }
    case "verde": {
      const r = Math.min(255, Math.max(0, Math.round(22 * factor)));
      const g = Math.min(255, Math.max(0, Math.round(163 * (0.45 + 0.55 * factor))));
      const b = Math.min(255, Math.max(0, Math.round(74 * factor)));
      return [r, g, b];
    }
    case "amarelo": {
      const r = Math.min(255, Math.max(0, Math.round(245 * (0.4 + 0.6 * factor))));
      const g = Math.min(255, Math.max(0, Math.round(180 * (0.35 + 0.65 * factor))));
      const b = Math.min(255, Math.max(0, Math.round(25 * factor * 0.6)));
      return [r, g, b];
    }
  }
}

const DECAL_MATRICES: Record<TeddyDecal, string[]> = {
  lisa: [],
  estrela: [
    "...Y...",
    "..WYW..",
    ".YYYYY.",
    "YYYYYYY",
    "..YYY..",
    ".YY.YY.",
    "OY...YO",
  ],
  coracao: [
    ".W...R.",
    "RRR.RRR",
    "RRRRRRR",
    "RRRRRRR",
    ".RRRRR.",
    "..DRD..",
    "...D...",
  ],
  cruz: [
    "..WWW..",
    "..WWW..",
    "WWWWWWW",
    "WWWWWWW",
    "WWWWWWW",
    "..WGW..",
    "..GGG..",
  ],
  sinal: [
    ".YYYYY.",
    "YY...YY",
    "YY.....",
    ".YYYY..",
    "....YY.",
    "YY...YY",
    ".YYYYY.",
  ],
};

function getDecalPixelColor(char: string, shadowFactor = 1.0): [number, number, number, number] | null {
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v * shadowFactor)));
  switch (char) {
    case "W":
      return [clamp(255), clamp(255), clamp(255), 255];
    case "G":
      return [clamp(203), clamp(213), clamp(225), 255];
    case "Y":
      return [clamp(251), clamp(191), clamp(36), 255];
    case "O":
      return [clamp(217), clamp(119), clamp(6), 255];
    case "R":
      return [clamp(239), clamp(68), clamp(68), 255];
    case "D":
      return [clamp(153), clamp(27), clamp(27), 255];
    default:
      return null;
  }
}

export function getTeddyCustomKey(config: TeddyCustomization): string {
  return `${config.corCamiseta}_${config.estampa}_${config.corBone}`;
}

const canvasCache = new Map<string, HTMLCanvasElement>();
const dataUrlCache = new Map<string, string>();

export function generateTeddyAtlasCanvas(
  baseImage: HTMLImageElement | HTMLCanvasElement,
  config: TeddyCustomization
): HTMLCanvasElement {
  const cacheKey = getTeddyCustomKey(config);
  const cached = canvasCache.get(cacheKey);
  if (cached) return cached;

  const canvas =
    typeof document !== "undefined" && typeof document.createElement === "function"
      ? document.createElement("canvas")
      : ({
          width: (baseImage as any).width || 1536,
          height: (baseImage as any).height || 1024,
          getContext: () => null,
        } as unknown as HTMLCanvasElement);

  canvas.width = (baseImage as any).width || 1536;
  canvas.height = (baseImage as any).height || 1024;
  const ctx = canvas.getContext ? canvas.getContext("2d", { willReadFrequently: true }) : null;
  if (!ctx) {
    canvasCache.set(cacheKey, canvas);
    return canvas;
  }

  ctx.drawImage(baseImage, 0, 0);

  const isDefault =
    config.corCamiseta === "roxo" &&
    config.corBone === "roxo" &&
    config.estampa === "lisa";

  if (isDefault) {
    canvasCache.set(cacheKey, canvas);
    return canvas;
  }

  const frameKeys = Object.keys(TEDDY_CANONICAL_FRAMES) as TeddyFrameKey[];

  for (const fKey of frameKeys) {
    const frameInfo = TEDDY_CANONICAL_FRAMES[fKey];
    const imgData = ctx.getImageData(frameInfo.x, frameInfo.y, frameInfo.w, frameInfo.h);
    const data = imgData.data;

    for (let py = 0; py < frameInfo.h; py++) {
      for (let px = 0; px < frameInfo.w; px++) {
        const idx = (py * frameInfo.w + px) * 4;
        const a = data[idx + 3];
        if (a < 50) continue;

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        if (!isTeddyPurple(r, g, b)) continue;

        const isCap = py <= 70;
        const targetColor = isCap ? config.corBone : config.corCamiseta;

        if (targetColor !== "roxo") {
          const [newR, newG, newB] = recolorPixel(r, g, b, targetColor);
          data[idx] = newR;
          data[idx + 1] = newG;
          data[idx + 2] = newB;
        }
      }
    }

    if (frameInfo.hasChest && config.estampa !== "lisa") {
      const matrix = DECAL_MATRICES[config.estampa];
      if (matrix && matrix.length > 0) {
        const decalH = matrix.length;
        const decalW = matrix[0].length;
        const startX = Math.round(frameInfo.chestX - decalW / 2);
        const startY = Math.round(frameInfo.chestY - decalH / 2);

        for (let row = 0; row < decalH; row++) {
          const line = matrix[row];
          for (let col = 0; col < decalW; col++) {
            const char = line[col];
            if (char === ".") continue;

            const targetX = startX + col;
            const targetY = startY + row;

            if (
              targetX >= 0 &&
              targetX < frameInfo.w &&
              targetY >= 0 &&
              targetY < frameInfo.h
            ) {
              const pIdx = (targetY * frameInfo.w + targetX) * 4;
              const origR = data[pIdx];
              const origG = data[pIdx + 1];
              const origB = data[pIdx + 2];

              if (targetY > 70 && data[pIdx + 3] > 100) {
                const origLum = 0.299 * origR + 0.587 * origG + 0.114 * origB;
                const shadowFactor = Math.min(1.1, Math.max(0.7, origLum / 91.8));

                const color = getDecalPixelColor(char, shadowFactor);
                if (color) {
                  data[pIdx] = color[0];
                  data[pIdx + 1] = color[1];
                  data[pIdx + 2] = color[2];
                  data[pIdx + 3] = color[3];
                }
              }
            }
          }
        }
      }
    }

    ctx.putImageData(imgData, frameInfo.x, frameInfo.y);
  }

  canvasCache.set(cacheKey, canvas);
  return canvas;
}

export function getTeddyAtlasDataUrl(
  baseImage: HTMLImageElement | HTMLCanvasElement,
  config: TeddyCustomization
): string {
  const cacheKey = getTeddyCustomKey(config);
  const cached = dataUrlCache.get(cacheKey);
  if (cached) return cached;

  const canvas = generateTeddyAtlasCanvas(baseImage, config);
  const url = canvas.toDataURL ? canvas.toDataURL("image/png") : "";
  dataUrlCache.set(cacheKey, url);
  return url;
}

export function ensureTeddyCustomTexture(
  scene: any,
  customConfig?: any
): string {
  if (!scene || !scene.textures) return "burns-people";

  if (!scene.textures.exists("burns-people")) {
    return "burns-people";
  }

  const corCamiseta: TeddyShirtColor =
    customConfig?.corCamiseta || customConfig?.roupaCor || "roxo";
  const estampa: TeddyDecal = customConfig?.estampa || "lisa";
  const corBone: TeddyCapColor =
    customConfig?.corBone ||
    (customConfig?.boneModelo === "bone_azul"
      ? "azul"
      : customConfig?.boneModelo === "bone_vermelho"
      ? "vermelho"
      : "roxo");

  const config: TeddyCustomization = { corCamiseta, estampa, corBone };

  if (corCamiseta === "roxo" && corBone === "roxo" && estampa === "lisa") {
    return "burns-people";
  }

  const textureKey = "burns-people-custom-" + getTeddyCustomKey(config);
  if (scene.textures.exists(textureKey)) {
    return textureKey;
  }

  try {
    const originalTexture = scene.textures.get("burns-people");
    const baseImg = originalTexture.getSourceImage() as HTMLImageElement | HTMLCanvasElement;
    if (!baseImg) return "burns-people";

    const canvas = generateTeddyAtlasCanvas(baseImg, config);
    const customTexture = scene.textures.addCanvas(textureKey, canvas);

    if (customTexture) {
      for (let i = 0; i < 8; i++) {
        const frameName = "0-" + i;
        const origFrame = originalTexture.get(frameName);
        if (origFrame) {
          customTexture.add(
            frameName,
            0,
            origFrame.cutX,
            origFrame.cutY,
            origFrame.cutWidth,
            origFrame.cutHeight
          );
        }
      }
      if (typeof (customTexture as any).setFilter === "function") {
        (customTexture as any).setFilter(1);
      }
      return textureKey;
    }
  } catch (e) {
    console.warn("Erro ao registrar textura customizada do Teddy no Phaser:", e);
  }

  return "burns-people";
}
