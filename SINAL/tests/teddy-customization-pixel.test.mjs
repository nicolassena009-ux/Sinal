import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isTeddyPurple,
  TEDDY_CANONICAL_FRAMES,
  TEDDY_SHIRT_COLORS,
  TEDDY_CAP_COLORS,
  TEDDY_DECAL_OPTIONS,
  DEFAULT_TEDDY_CUSTOM,
  getTeddyCustomKey,
  ensureTeddyCustomTexture,
} from "../src/lib/teddyCustomTexture.ts";
import {
  DEFAULT_AVATAR,
  validateAvatar,
  saveStoredAvatar,
  getStoredAvatar,
} from "../src/lib/avatarStore.ts";

test("Etapa 10.1: Precisão da Máscara de Tecido — Detecção de Pixels Roxo vs Pelagem, Contorno e Mochila", () => {
  // 1. Pixels que NUNCA devem ser detectados como tecido (devem ser preservados intactos):
  assert.equal(isTeddyPurple(15, 15, 15), false, "Contorno preto do Teddy deve ser preservado");
  assert.equal(isTeddyPurple(196, 125, 59), false, "Pelagem marrom caramelo do urso deve ser preservada");
  assert.equal(isTeddyPurple(123, 70, 29), false, "Pelagem marrom escura das sombras do urso deve ser preservada");
  assert.equal(isTeddyPurple(255, 192, 68), false, "Mochila amarela do Teddy deve ser preservada");
  assert.equal(isTeddyPurple(255, 255, 255), false, "Branco dos olhos e do crachá deve ser preservado");
  assert.equal(isTeddyPurple(0, 0, 0), false, "Pupilas e contornos 0,0,0 devem ser preservados");

  // 2. Pixels reais de tecido roxo oficial nos 8 frames do Teddy:
  assert.equal(isTeddyPurple(109, 63, 195), true, "Tom médio roxo da camiseta/boné deve ser detectado");
  assert.equal(isTeddyPurple(75, 38, 138), true, "Sombra do tecido roxo deve ser detectada");
  assert.equal(isTeddyPurple(145, 92, 230), true, "Luz do tecido roxo deve ser detectada");
  assert.equal(isTeddyPurple(95, 48, 172), true, "Meio-tom sombreado do boné deve ser detectado");
});

test("Etapa 10.2: Prova de 0 Delta em pixels anatômicos (Pelagem, Olhos, Focinho, Mochila e Contorno)", () => {
  // Simula um buffer de pixels representando a anatomia do Teddy
  const pixels = [
    { name: "olho_preto", r: 12, g: 12, b: 12, a: 255 },
    { name: "focinho_preto", r: 20, g: 18, b: 22, a: 255 },
    { name: "pelo_caramelo", r: 196, g: 125, b: 59, a: 255 },
    { name: "pelo_sombra", r: 140, g: 82, b: 35, a: 255 },
    { name: "mochila_amarela", r: 255, g: 192, b: 68, a: 255 },
    { name: "cracha_branco", r: 245, g: 245, b: 245, a: 255 },
    { name: "contorno_externo", r: 28, g: 24, b: 32, a: 255 },
  ];

  // Nenhum pixel anatômico pode ser classificado como tecido modificável
  for (const p of pixels) {
    const isFabric = isTeddyPurple(p.r, p.g, p.b);
    assert.equal(isFabric, false, `Pixel ${p.name} não pode sofrer alteração (Delta deve ser 0)`);
  }
});

test("Etapa 10.3: Cores Independentes da Camiseta e do Boné (5 cores disponíveis)", () => {
  assert.equal(TEDDY_SHIRT_COLORS.length, 5, "Devem existir exatamente 5 opções de cor de camiseta");
  const shirtIds = TEDDY_SHIRT_COLORS.map((c) => c.id);
  assert.deepEqual(shirtIds, ["roxo", "azul", "vermelho", "verde", "amarelo"]);

  assert.equal(TEDDY_CAP_COLORS.length, 5, "Devem existir exatamente 5 opções de cor de boné");
  const capIds = TEDDY_CAP_COLORS.map((c) => c.id);
  assert.deepEqual(capIds, ["roxo", "azul", "vermelho", "verde", "amarelo"]);

  // Geração de chave de cache única
  const key1 = getTeddyCustomKey({ corCamiseta: "azul", estampa: "lisa", corBone: "vermelho" });
  assert.equal(key1, "azul_lisa_vermelho");

  const keyDefault = getTeddyCustomKey(DEFAULT_TEDDY_CUSTOM);
  assert.equal(keyDefault, "roxo_lisa_roxo");
});

test("Etapa 10.4: Estampas em Pixel Art na Camiseta (5 opções e restrição peitoral)", () => {
  assert.equal(TEDDY_DECAL_OPTIONS.length, 5, "Devem existir exatamente 5 opções de estampa");
  const decalIds = TEDDY_DECAL_OPTIONS.map((d) => d.id);
  assert.deepEqual(decalIds, ["lisa", "estrela", "coracao", "cruz", "sinal"]);

  // Validação dos 8 frames canônicos
  const frameKeys = Object.keys(TEDDY_CANONICAL_FRAMES);
  assert.equal(frameKeys.length, 8, "Devem existir exatamente 8 frames canônicos mapeados");

  // Frames frontais devem ter chestX e chestY válidos dentro da camiseta
  for (const fk of ["0-0", "0-1", "0-2", "0-6", "0-7"]) {
    const info = TEDDY_CANONICAL_FRAMES[fk];
    assert.equal(info.hasChest, true, `Frame frontal ${fk} deve permitir estampa no peito`);
    assert.ok(info.chestY > 140 && info.chestY < 165, `Centro do peito no frame ${fk} deve estar na camiseta`);
    assert.ok(info.chestX > 70 && info.chestX < 90, `Centro horizontal no frame ${fk} deve estar alinhado`);
  }

  // Frames de costas (0-3, 0-4, 0-5) JAMAIS recebem estampa
  for (const fk of ["0-3", "0-4", "0-5"]) {
    const info = TEDDY_CANONICAL_FRAMES[fk];
    assert.equal(info.hasChest, false, `Frame de costas ${fk} não deve receber estampa no peito`);
  }
});

test("Etapa 10.5: Persistência no LocalStorage e Validação de Avatar", () => {
  const store = new Map();
  const mockStorage = {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  };
  globalThis.localStorage = mockStorage;

  // Salva avatar customizado 2.0
  const customAvatar = {
    ...DEFAULT_AVATAR,
    corCamiseta: "azul",
    estampa: "estrela",
    corBone: "amarelo",
  };

  const saved = saveStoredAvatar(customAvatar);
  assert.equal(saved, true, "Avatar customizado deve ser salvo com sucesso");

  const loaded = getStoredAvatar();
  assert.equal(loaded.corCamiseta, "azul");
  assert.equal(loaded.estampa, "estrela");
  assert.equal(loaded.corBone, "amarelo");

  // Validação restaura padrão em caso de dados corrompidos
  const corrupted = validateAvatar({ corCamiseta: "invalida", estampa: "inexistente" });
  assert.equal(corrupted.corCamiseta, "roxo");
  assert.equal(corrupted.estampa, "lisa");
  assert.equal(corrupted.corBone, "roxo");
});

test("Etapa 10.6: Transmissão para o Phaser e Gestão de Cache de Texturas", () => {
  const textureRegistry = new Map();
  const mockScene = {
    textures: {
      exists: (key) => textureRegistry.has(key),
      get: (key) => textureRegistry.get(key),
      addCanvas: (key, canvas) => {
        const obj = { key, canvas, add: () => {}, setFilter: () => {} };
        textureRegistry.set(key, obj);
        return obj;
      },
    },
  };

  // Simula atlas base burns-people pré-existente
  textureRegistry.set("burns-people", {
    getSourceImage: () => ({ width: 1536, height: 1024 }),
    get: (_frame) => ({ cutX: 45, cutY: 77, cutWidth: 144, cutHeight: 233 }),
  });

  // 1. Configuração padrão retorna 'burns-people' original imediatamente sem alocar nova textura
  const defaultKey = ensureTeddyCustomTexture(mockScene, {
    corCamiseta: "roxo",
    estampa: "lisa",
    corBone: "roxo",
  });
  assert.equal(defaultKey, "burns-people", "Configuração padrão deve usar o atlas original intacto");

  // 2. Configuração customizada retorna chave customizada
  const customKey = ensureTeddyCustomTexture(mockScene, {
    corCamiseta: "azul",
    estampa: "cruz",
    corBone: "vermelho",
  });
  assert.ok(customKey.includes("azul_cruz_vermelho"), "Chave deve refletir a combinação personalizada");
});
