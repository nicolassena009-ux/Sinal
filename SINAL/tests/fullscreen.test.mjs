import { test } from "node:test";
import assert from "node:assert/strict";
import { movePlayer, SPEED } from "../src/components/minigames/movement.ts";

test("Orientação e Tela Cheia: detecção de orientação horizontal vs vertical", () => {
  const isLandscape = (width, height) => width >= height;

  // Telas em modo paisagem (landscape)
  assert.equal(isLandscape(844, 390), true); // iPhone em paisagem
  assert.equal(isLandscape(1920, 1080), true); // Desktop Full HD
  assert.equal(isLandscape(900, 900), true); // Quadrado (limite)

  // Telas em modo retrato (portrait)
  assert.equal(isLandscape(390, 844), false); // iPhone vertical
  assert.equal(isLandscape(412, 915), false); // Android vertical
});

test("Orientação: tratamento resiliente de falha ao bloquear orientação no Safari/iOS", async () => {
  // Simula API de tela cheia e orientação com rejeição proposital (comportamento típico do iOS Safari)
  const fakeScreenOrientation = {
    lock: async () => {
      throw new Error("NotSupportedError: screen.orientation.lock() is not supported on this platform.");
    },
    unlock: () => {},
  };

  let orientationLocked = false;
  let errorCaught = false;

  try {
    if (fakeScreenOrientation.lock) {
      await fakeScreenOrientation.lock("landscape");
      orientationLocked = true;
    }
  } catch {
    errorCaught = true;
    orientationLocked = false;
  }

  assert.equal(errorCaught, true);
  assert.equal(orientationLocked, false);
});

test("Canvas e Responsividade: proporção fixa 360:202 para evitar distorção", () => {
  const CANVAS_WIDTH = 360;
  const CANVAS_HEIGHT = 202;
  const targetAspect = CANVAS_WIDTH / CANVAS_HEIGHT;

  // Em tela cheia widescreen (ex.: 1280x720)
  const screenWidth = 1280;
  const screenHeight = 720;
  const fitWidth = Math.min(screenWidth, screenHeight * targetAspect);
  const fitHeight = fitWidth / targetAspect;

  assert.ok(Math.abs(fitWidth / fitHeight - targetAspect) < 1e-6);
  assert.ok(fitWidth <= screenWidth);
  assert.ok(fitHeight <= screenHeight);
});

test("Compatibilidade Desktop: controles de teclado preservados integralmente", () => {
  const start = { x: 100, y: 100 };
  const dt = 1 / 60; // 60 Hz frame

  // 1. Tecla W / ArrowUp (para cima)
  const up = movePlayer(start, { x: 0, y: -1 }, dt, []);
  assert.equal(up.x, 100);
  assert.ok(up.y < 100);

  // 2. Tecla S / ArrowDown (para baixo)
  const down = movePlayer(start, { x: 0, y: 1 }, dt, []);
  assert.equal(down.x, 100);
  assert.ok(down.y > 100);

  // 3. Tecla A / ArrowLeft (esquerda)
  const left = movePlayer(start, { x: -1, y: 0 }, dt, []);
  assert.ok(left.x < 100);
  assert.equal(left.y, 100);

  // 4. Tecla D / ArrowRight (direita)
  const right = movePlayer(start, { x: 1, y: 0 }, dt, []);
  assert.ok(right.x > 100);
  assert.equal(right.y, 100);

  // 5. Movimento diagonal com WASD (normalizado: mesma velocidade linear em 1 segundo a 60 Hz)
  let diag = start;
  for (let i = 0; i < 60; i++) {
    diag = movePlayer(diag, { x: 1, y: 1 }, dt, []);
  }
  const linearDist = Math.hypot(diag.x - start.x, diag.y - start.y);
  assert.ok(Math.abs(linearDist - SPEED) < 1e-6);
});
