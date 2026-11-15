import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import { test } from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
import { blocked, BOUNDS } from "../src/components/minigames/movement.ts";
const require = createRequire(import.meta.url);
// Execute actual storage modules with a browser-storage substitute, without writing user data.
function moduleAt(path, globals = {}, dependencies = {}) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    require: (name) => dependencies[name] ?? require(name),
    ...globals,
  });
  return exports;
}
const data = moduleAt("../src/data/gameplay.ts");
test("ten levels, thirty reachable objectives, sink separate from stove", () => {
  assert.equal(data.GAME_THEMES.length, 5);
  for (const theme of data.GAME_THEMES) {
    assert.equal(theme.levels.length, 2);
    for (const level of theme.levels) {
      assert.equal(level.objectives.length, 3);
      for (const o of level.objectives) {
        assert.ok(
          o.x >= BOUNDS.left && o.x <= BOUNDS.right && o.y >= BOUNDS.top && o.y <= BOUNDS.bottom,
        );
        assert.equal(blocked(o, theme.obstacles), false);
        assert.ok(o.seconds > 0 && o.task && o.done);
      }
    }
  }
  const sink = data.GAME_THEMES.find((t) => t.slug === "queimadura").levels[0].objectives[2];
  assert.equal(sink.x, 200);
  assert.equal(sink.target, "sink");
  assert.ok(sink.x > 85 + 23);
});
function storage(block = false) {
  const values = new Map();
  return {
    values,
    getItem: (k) => values.get(k) ?? null,
    setItem: (k, v) => {
      if (block) throw Error("blocked");
      values.set(k, v);
    },
  };
}
const windowStub = { dispatchEvent: () => {} };
test("avatar validation resets old, incomplete and malicious values", () => {
  const a = moduleAt("../src/lib/avatarStore.ts", {
    localStorage: storage(),
    window: windowStub,
    CustomEvent: class {},
  });
  for (const invalid of [
    null,
    [],
    {},
    { tomPele: 1 },
    { ...a.DEFAULT_AVATAR, tomPele: 1.5 },
    { ...a.DEFAULT_AVATAR, cabeloEstilo: "invalid" },
    { ...a.DEFAULT_AVATAR, calcadoCor: "#fff" },
  ]) {
    assert.equal(JSON.stringify(a.validateAvatar(invalid)), JSON.stringify(a.DEFAULT_AVATAR));
  }
  assert.equal(
    a.validateAvatar({ ...a.DEFAULT_AVATAR, calcadoCor: "vermelho" }).calcadoCor,
    "vermelho",
  );
});
test("avatar stays usable for the session when storage is blocked", () => {
  const a = moduleAt("../src/lib/avatarStore.ts", {
    localStorage: storage(true),
    window: windowStub,
    CustomEvent: class {},
  });
  assert.equal(a.saveStoredAvatar({ ...a.DEFAULT_AVATAR, calcadoCor: "azul" }), false);
  assert.equal(a.getStoredAvatar().calcadoCor, "azul");
});
test("completion persists only valid level identifiers and handles blocked storage", () => {
  const localStorage = storage();
  localStorage.values.set("sinal_gameplay_v1", '["engasgo:1","bad:99",1,"engasgo:1"]');
  const p = moduleAt("../src/lib/gameProgress.ts", { localStorage }, { "@/data/gameplay": data });
  assert.equal(JSON.stringify(p.readGameProgress()), '["engasgo:1"]');
  assert.equal(p.completeLevel("trauma", 2), true);
  assert.equal(p.completeLevel("bad", 1), false);
  const reread = moduleAt(
    "../src/lib/gameProgress.ts",
    { localStorage },
    { "@/data/gameplay": data },
  );
  assert.ok(reread.readGameProgress().includes("trauma:2"));
  const failed = moduleAt(
    "../src/lib/gameProgress.ts",
    { localStorage: storage(true) },
    { "@/data/gameplay": data },
  );
  assert.equal(failed.completeLevel("engasgo", 1), false);
  assert.ok(failed.readGameProgress().includes("engasgo:1"));
});
