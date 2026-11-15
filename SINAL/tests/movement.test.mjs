import { test } from "node:test";
import assert from "node:assert/strict";
import {
  movePlayer,
  BOUNDS,
  MAX_DT,
  SPEED,
  blocked,
} from "../src/components/minigames/movement.ts";
for (const hz of [30, 60, 120, 144]) {
  test(`52 pixels in one second at ${hz} Hz`, () => {
    let p = { x: 30, y: 150 };
    for (let i = 0; i < hz; i++) p = movePlayer(p, { x: 1, y: 0 }, 1 / hz, []);
    assert.ok(Math.abs(p.x - 82) < 1e-9);
    assert.equal(p.y, 150);
  });
}
test("diagonal has the same total speed", () => {
  let p = { x: 30, y: 80 };
  for (let i = 0; i < 60; i++) p = movePlayer(p, { x: 1, y: 1 }, 1 / 60, []);
  assert.ok(Math.abs(Math.hypot(p.x - 30, p.y - 80) - 52) < 1e-9);
});
test("furniture blocks all four sides and permits sliding", () => {
  const obstacles = [{ x: 100, y: 90, width: 50, height: 40 }];
  for (const [start, input] of [
    [
      { x: 80, y: 110 },
      { x: 1, y: 0 },
    ],
    [
      { x: 170, y: 110 },
      { x: -1, y: 0 },
    ],
    [
      { x: 120, y: 70 },
      { x: 0, y: 1 },
    ],
    [
      { x: 120, y: 160 },
      { x: 0, y: -1 },
    ],
  ]) {
    let p = start;
    for (let i = 0; i < 120; i++) {
      p = movePlayer(p, input, 1 / 60, obstacles);
      assert.equal(blocked(p, obstacles), false);
    }
  }
  const p = movePlayer({ x: 93, y: 110 }, { x: 1, y: 1 }, 0.05, obstacles);
  assert.equal(p.x, 93);
  assert.ok(p.y > 110);
});
test("bounds hold at every edge", () => {
  for (const input of [
    { x: 1, y: 1 },
    { x: -1, y: -1 },
  ]) {
    let p = { x: 180, y: 100 };
    for (let i = 0; i < 1000; i++) p = movePlayer(p, input, 0.05, []);
    assert.ok(
      p.x >= BOUNDS.left && p.x <= BOUNDS.right && p.y >= BOUNDS.top && p.y <= BOUNDS.bottom,
    );
    assert.equal(p.x, input.x > 0 ? BOUNDS.right : BOUNDS.left);
    assert.equal(p.y, input.y > 0 ? BOUNDS.bottom : BOUNDS.top);
  }
});
test("long intervals are clamped and cannot tunnel through furniture", () => {
  const start = { x: 30, y: 150 };
  assert.equal(movePlayer(start, { x: 1, y: 0 }, 20, []).x, 30 + SPEED * MAX_DT);
  assert.deepEqual(movePlayer(start, { x: 1, y: 0 }, -1, []), start);
  assert.deepEqual(movePlayer(start, { x: 1, y: 0 }, NaN, []), start);
  assert.equal(
    movePlayer({ x: 92, y: 110 }, { x: 1, y: 0 }, 20, [{ x: 100, y: 90, width: 50, height: 40 }]).x,
    92,
  );
});
test("tap target does not overshoot; zero input stands still", () => {
  assert.equal(movePlayer({ x: 30, y: 150 }, { x: 1, y: 0 }, 0.05, [], 0.5).x, 30.5);
  assert.deepEqual(movePlayer({ x: 30, y: 150 }, { x: 0, y: 0 }, 0.05, []), { x: 30, y: 150 });
});
