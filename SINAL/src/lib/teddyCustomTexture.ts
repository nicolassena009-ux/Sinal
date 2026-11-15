/**
 * SINAL — Personalização 2.0 do Mascote Teddy
 * Gerador de texturas de alta fidelidade em pixel art por paleta e estampas.
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

export const TEDDY_SHIRT_COLORS: { id: TeddyShirtColor; nome: string; hex: string }[] = [
  { id: "roxo", nome: "Roxo Oficial SINAL", hex: "#6D3FC3" },
  { id: "azul", nome: "Azul Socorrista", hex: "#2563EB" },
  { id: "vermelho", nome: "Vermelho Emergência", hex: "#DC2626" },
  { id: "verde", nome: "Verde Socorro", hex: "#16A34A" },
  { id: "amarelo", nome: "Amarelo Alerta", hex: "#F59E0B" },
];

export const TEDDY_CAP_COLORS: { id: TeddyCapColor; nome: string; hex: string }[] = [
  { id: "roxo", nome: "Boné Roxo SINAL", hex: "#6D3FC3" },
  { id: "azul", nome: "Boné Azul", hex: "#2563EB" },
  { id: "vermelho", nome: "Boné Vermelho", hex: "#DC2626" },
  { id: "verde", nome: "Boné Verde", hex: "#16A34A" },
  { id: "amarelo", nome: "Boné Amarelo", hex: "#F59E0B" },
];

export const TEDDY_DECAL_OPTIONS: { id: TeddyDecal; nome: string; desc: string }[] = [
  { id: "lisa", nome: "Camiseta Lisa (Original)", desc: "Sem estampa" },
  { id: "estrela", nome: "Estrela Guia", desc: "Estrela dourada em pixel art" },
  { id: "coracao", nome: "Coração da Vida", desc: "Coração vermelho de socorrista" },
  { id: "cruz", nome: "Primeiros Socorros", desc: "Cruz médica de emergência" },
  { id: "sinal", nome: "Emblema SINAL", desc: "Símbolo oficial do projeto" },
];

/**
 * Coordenadas exatas dos 8 frames canônicos do Teddy na linha 0 de `burns/characters.png`.
 * Extraídas diretamente do atlas oficial characters.json.
 */
export const TEDDY_CANONICAL_FRAMES = {
  "0-0": { x: 45, y: 77, w: 144, h: 233, chestX: 78, chestY: 151, hasChest: true },
  "0-1": { x: 239, y: 80, w: 140, h: 231, chestX: 77, chestY: 151, hasChest: true },
  "0-2": { x: 433, y: 81, w: 137, h: 230, chestX: 79, chestY: 153, hasChest: true },
  "0-3": { x: 614, y: 81, w: 139, h: 228, chestX: 0, chestY: 0, hasChest: false },
  "0-4": { x: 801, y: 84, w: 134, h: 226, chestX: 0, chestY: 0, hasChest: false },
  "0-5": { x: 981, y: 83, w: 134, h: 227, chestX: 0, chestY: 0, hasChest: false },
  "0-6": { x: 1162, y: 84, w: 156, h: 226, chestX: 82, chestY: 150, hasChest: true },
  "0-7": { x: 1352, y: 70, w: 159, h: 240, chestX: 79, chestY: 152, hasChest: true },
} as const;

export type TeddyFrameKey = keyof typeof TEDDY_CANONICAL_FRAMES;

/**
 * Identifica se um pixel pertence ao tecido roxo do Teddy.
 * Filtra contornos pretos, pelagem marrom, mochila amarela e crachá.
 */
export function isTeddyPurple(r: number, g: number, b: number): boolean {
  if (r < 40 && g < 40 && b < 40) return false; // contorno escuro
  if (r > 160 && g > 110 && b < 80) return false; // mochila amarela / pelo marrom claro
  if (r > 100 && g > 60 && b < 50) return false; // pelagem marrom
  return b > 65 && r > 45 && b - g > 18 && r - g > 8;
}

/**
 * Recolore um pixel de tecido roxo para a cor alvo preservando luzes, sombras e saturação.
 */
function recolorPixel(
  origR: number,
  origG: number,
  origB: number,
  colorId: TeddyShirtColor | TeddyCapColor
): [number, number, number] {
  if (colorId === "roxo") {
    return [origR, origG, origB];
  }

  // Luminância perceptual do pixel roxo original
  const lum = 0.299 * origR + 0.587 * origG + 0.114 * origB;
  // Tom roxo médio de referência no atlas do Teddy ~ 91.8
  const factor = lum / 91.8;

  switch (colorId) {
    case "azul": {
      // Base #2563EB (37, 99, 235)
      const r = Math.min(255, Math.max(0, Math.round(37 * factor)));
      const g = Math.min(255, Math.max(0, Math.round(99 * factor * 1.05)));
      const b = Math.min(255, Math.max(0, Math.round(235 * (0.4 + 0.6 * factor))));
      return [r, g, b];
    }
    case "vermelho": {
      // Base #DC2626 (220, 38, 38)
      const r = Math.min(255, Math.max(0, Math.round(220 * (0.45 + 0.55 * factor))));
      const g = Math.min(255, Math.max(0, Math.round(38 * factor * 0.9)));
      const b = Math.min(255, Math.max(0, Math.round(38 * factor * 0.9)));
      return [r, g, b];
    }
    case "verde": {
      // Base #16A34A (22, 163, 74)
      const r = Math.min(255, Math.max(0, Math.round(22 * factor)));
      const g = Math.min(255, Math.max(0, Math.round(163 * (0.45 + 0.55 * factor))));
      const b = Math.min(255, Math.max(0, Math.round(74 * factor)));
      return [r, g, b];
    }
    case "amarelo": {
      // Base #F59E0B / #FFC044 com sombras douradas ricas em pixel art
      const r = Math.min(255, Math.max(0, Math.round(245 * (0.4 + 0.6 * factor))));
      const g = Math.min(255, Math.max(0, Math.round(180 * (0.35 + 0.65 * factor))));
      const b = Math.min(255, Math.max(0, Math.round(25 * factor * 0.6)));
      return [r, g, b];
    }
  }
}

/**
 * Matrizes em pixel art das estampas (11x11 ou 13x13).
 * Códigos:
 * '.' = transparente
 * 'B' = borda/sombra
 * 'W' = branco
 * 'Y' = amarelo ouro
 * 'R' = vermelho
 * 'S' = cor de destaque do SINAL
 */
const DECAL_MATRICES: Record<TeddyDecal, string[]> = {
  lisa: [],
  estrela: [
    "....BBB....",
    "....BYB....",
    "...BYYYB...",
    "BBBYYYYYBBB",
    ".BYYYYYYYB.",
    "..BYYYYYB..",
    "...BYYYB...",
    "..BYB.BYB..",
    ".BYB...BYB.",
    ".BB.....BB.",
  ],
  coracao: [
    ".BBB...BBB.",
    "BRRRB.BRRRB",
    "BRRRRBBRRRB",
    "BRRRRRRRRRB",
    ".BRRRRRRRB.",
    "..BRRRRRB..",
    "...BRRRB...",
    "....BRB....",
    ".....B.....",
  ],
  cruz: [
    "...BBBB...",
    "...BWWBB..",
    "...BWWBB..",
    "BBBBWWBBBB",
    "BWWWWWWWWB",
    "BWWWWWWWWB",
    "BBBBWWBBBB",
    "...BWWBB..",
    "...BWWBB..",
    "...BBBB...",
  ],
  sinal: [
    "..BBBBBB..",
    ".BSSSSSSB.",
    "BSSBBBSSSB",
    "BSSB..BBBB",
    "BSSSSBBB..",
    ".BSSSSSSB.",
    "..BBBSSSSB",
    "BBBB..BSSB",
    "BSSSBBBSSB",
    ".BSSSSSSB.",
    "..BBBBBB..",
  ],
};

function getDecalPixelColor(char: string): [number, number, number, number] | null {
  switch (char) {
    case "B":
      return [25, 20, 30, 255]; // borda suave
    case "W":
      return [255, 255, 255, 255]; // branco puro
    case "Y":
      return [255, 215, 0, 255]; // amarelo ouro
    case "R":
      return [220, 38, 38, 255]; // vermelho vida
    case "S":
      return [255, 210, 60, 255]; // emblema SINAL dourado
    default:
      return null;
  }
}

/** Chave única de cache para a personalização */
export function getTeddyCustomKey(config: TeddyCustomization): string {
  return `${config.corCamiseta}_${config.estampa}_${config.corBone}`;
}

const canvasCache = new Map<string, HTMLCanvasElement>();
const dataUrlCache = new Map<string, string>();

/**
 * Gera um Canvas offscreen derivado de `characters.png` com a personalização 2.0 aplicada.
 * Se a configuração for a padrão ('roxo', 'lisa', 'roxo'), os pixels originais permanecem inalterados.
 */
export function generateTeddyAtlasCanvas(
  baseImage: HTMLImageElement | HTMLCanvasElement,
  config: TeddyCustomization
): HTMLCanvasElement {
  const cacheKey = getTeddyCustomKey(config);
  const cached = canvasCache.get(cacheKey);
  if (cached) return cached;

  // Cria canvas offscreen de dimensões idênticas ao atlas original (1536x1024)
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

  // Desenha a imagem base integralmente
  ctx.drawImage(baseImage, 0, 0);

  // Se for a configuração original, retorna o atlas cópia sem modificações
  const isDefault =
    config.corCamiseta === "roxo" &&
    config.corBone === "roxo" &&
    config.estampa === "lisa";

  if (isDefault) {
    canvasCache.set(cacheKey, canvas);
    return canvas;
  }

  // Processa exclusivamente os 8 frames da linha 0 de Teddy
  const frameKeys = Object.keys(TEDDY_CANONICAL_FRAMES) as TeddyFrameKey[];

  for (const fKey of frameKeys) {
    const frameInfo = TEDDY_CANONICAL_FRAMES[fKey];
    const imgData = ctx.getImageData(frameInfo.x, frameInfo.y, frameInfo.w, frameInfo.h);
    const data = imgData.data;

    // 1. Passada de recoloração de pixels (boné vs camiseta)
    for (let py = 0; py < frameInfo.h; py++) {
      for (let px = 0; px < frameInfo.w; px++) {
        const idx = (py * frameInfo.w + px) * 4;
        const a = data[idx + 3];
        if (a < 50) continue; // pixel transparente

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        if (!isTeddyPurple(r, g, b)) continue;

        // Separação anatômica: topo (py <= 70) = Boné; tronco (py > 70) = Camiseta
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

    // 2. Passada de estampa no peito (apenas frames frontais com chest)
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
              // A estampa só é gravada sobre a camiseta (py > 70 e não-transparente)
              if (targetY > 70 && data[pIdx + 3] > 100) {
                const color = getDecalPixelColor(char);
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

    // Escreve de volta no frame do canvas
    ctx.putImageData(imgData, frameInfo.x, frameInfo.y);
  }

  canvasCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * Retorna o DataURL em cache para prévia instantânea em elementos <img> ou CSS.
 */
export function getTeddyAtlasDataUrl(
  baseImage: HTMLImageElement | HTMLCanvasElement,
  config: TeddyCustomization
): string {
  const cacheKey = getTeddyCustomKey(config);
  const cached = dataUrlCache.get(cacheKey);
  if (cached) return cached;

  const canvas = generateTeddyAtlasCanvas(baseImage, config);
  const url = canvas.toDataURL("image/png");
  dataUrlCache.set(cacheKey, url);
  return url;
}

/**
 * Garante e registra no gerenciador de texturas do Phaser uma versão do atlas com a personalização 2.0 aplicada.
 * Retorna a chave da textura pronta para uso no sprite do Teddy.
 */
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

  // Se for o padrão clássico original, usa o atlas original sem modificações
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
      // Clona as coordenadas dos 8 frames da linha 0 de Teddy
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
        (customTexture as any).setFilter(1); // NEAREST
      }
      return textureKey;
    }
  } catch (e) {
    console.warn("Erro ao registrar textura customizada do Teddy no Phaser:", e);
  }

  return "burns-people";
}

