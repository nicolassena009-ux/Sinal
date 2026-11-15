import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateJoystickVector,
  resolveCardinalDirection,
  clampKnobPosition,
} from "../src/components/minigames/joystick.ts";
import { movePlayer, SPEED } from "../src/components/minigames/movement.ts";

test("Joystick: movimentos dentro da zona morta resultam em vetor nulo e inativo", () => {
  const maxRadius = 50;
  const deadzone = 0.15; // 15% de 50 = 7.5px

  // Deslocamento de 3px (dentro da zona morta de 7.5px)
  const v1 = calculateJoystickVector(2, 2, maxRadius, deadzone);
  assert.equal(v1.active, false);
  assert.equal(v1.magnitude, 0);
  assert.equal(v1.x, 0);
  assert.equal(v1.y, 0);

  // Deslocamento de 7px (ainda dentro da zona morta)
  const v2 = calculateJoystickVector(7, 0, maxRadius, deadzone);
  assert.equal(v2.active, false);
  assert.equal(v2.magnitude, 0);
});

test("Joystick: deflexão total e além do limite máximo é grampeada em magnitude 1.0", () => {
  const maxRadius = 50;

  // Deflexão exatamente no limite do raio (50px)
  const vAtLimit = calculateJoystickVector(50, 0, maxRadius);
  assert.equal(vAtLimit.active, true);
  assert.ok(Math.abs(vAtLimit.magnitude - 1.0) < 1e-9);
  assert.ok(Math.abs(vAtLimit.x - 1.0) < 1e-9);
  assert.equal(vAtLimit.y, 0);

  // Deflexão além do raio (150px) deve permanecer com magnitude máxima 1.0
  const vBeyond = calculateJoystickVector(0, 150, maxRadius);
  assert.equal(vBeyond.active, true);
  assert.ok(Math.abs(vBeyond.magnitude - 1.0) < 1e-9);
  assert.equal(vBeyond.x, 0);
  assert.ok(Math.abs(vBeyond.y - 1.0) < 1e-9);
});

test("Joystick: movimento diagonal possui vetor normalizado com magnitude <= 1.0", () => {
  const maxRadius = 50;
  // Puxando o stick a 45 graus (nordeste)
  const vDiag = calculateJoystickVector(40, -40, maxRadius);
  assert.equal(vDiag.active, true);
  const totalMagnitude = Math.hypot(vDiag.x, vDiag.y);
  assert.ok(totalMagnitude <= 1.0000001);
  assert.ok(Math.abs(totalMagnitude - vDiag.magnitude) < 1e-9);
});

test("Joystick: resposta proporcional suave à inclinação do controle", () => {
  const maxRadius = 60;
  const deadzone = 0.15; // 9px
  // Meio do caminho entre zona morta (9px) e raio máximo (60px): 9 + (51 * 0.5) = 34.5px
  const vHalf = calculateJoystickVector(34.5, 0, maxRadius, deadzone);
  assert.equal(vHalf.active, true);
  assert.ok(Math.abs(vHalf.magnitude - 0.5) < 1e-2);
  assert.ok(Math.abs(vHalf.x - 0.5) < 1e-2);
});

test("Joystick: retorno ao centro e cancelamento de ponteiro", () => {
  // Simula liberação do toque (deslocamento zerado)
  const vCenter = calculateJoystickVector(0, 0, 50);
  assert.equal(vCenter.active, false);
  assert.equal(vCenter.magnitude, 0);
  assert.equal(vCenter.x, 0);
  assert.equal(vCenter.y, 0);

  const knob = clampKnobPosition(0, 0, 50);
  assert.equal(knob.visualX, 0);
  assert.equal(knob.visualY, 0);
});

test("Joystick: resolução correta das 4 direções cardeais do personagem", () => {
  assert.equal(resolveCardinalDirection(1, 0.2), "right");
  assert.equal(resolveCardinalDirection(-1, 0.2), "left");
  assert.equal(resolveCardinalDirection(0.1, 1), "down");
  assert.equal(resolveCardinalDirection(0.1, -1), "up");
});

test("Joystick: integração com motor de física movePlayer em velocidade proporcional", () => {
  const start = { x: 50, y: 100 };
  const dt = 1 / 60; // 60 FPS
  const maxRadius = 50;

  // 1. Tilt de 50%
  const vHalf = calculateJoystickVector(25 + 0.15 * 50 * 0.5, 0, maxRadius);
  const distHalf = SPEED * dt * vHalf.magnitude;
  const p1 = movePlayer(start, { x: vHalf.x, y: vHalf.y }, dt, [], distHalf);
  const movedDist = p1.x - start.x;
  assert.ok(Math.abs(movedDist - SPEED * dt * vHalf.magnitude) < 1e-6);

  // 2. Tilt total (100%) em 60 quadros (1 segundo)
  const vFull = calculateJoystickVector(50, 0, maxRadius);
  let p2 = start;
  for (let i = 0; i < 60; i++) {
    const distFull = SPEED * dt * vFull.magnitude;
    p2 = movePlayer(p2, { x: vFull.x, y: vFull.y }, dt, [], distFull);
  }
  assert.ok(Math.abs(p2.x - (start.x + SPEED)) < 1e-6);
});
