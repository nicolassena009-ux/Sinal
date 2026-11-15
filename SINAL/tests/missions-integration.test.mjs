import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);

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

const gameplayData = moduleAt("../src/data/gameplay.ts");
const gameProgress = moduleAt(
  "../src/lib/gameProgress.ts",
  {},
  { "@/data/gameplay": gameplayData },
);
const avatarStore = moduleAt("../src/lib/avatarStore.ts");

test("Etapa 05: Contrato das Cinco Missões Oficiais", () => {
  const { OFFICIAL_MISSIONS } = gameProgress;
  assert.equal(OFFICIAL_MISSIONS.length, 5, "Exatamente cinco missões devem estar registradas");
  const expectedSlugs = ["engasgo", "queimadura", "convulsao", "parada-cardiorrespiratoria", "trauma"];
  assert.equal(
    JSON.stringify(OFFICIAL_MISSIONS.map((m) => m.slug)),
    JSON.stringify(expectedSlugs),
    "As 5 missões devem corresponder exatamente aos slugs previstos",
  );
});

test("Etapa 05: Registro e Persistência de Conclusão de Missão", () => {
  const { recordMissionCompletion, isMissionCompleted, getCompletedMissionsCount, readMissionRecords } = gameProgress;

  // Simula conclusão de engasgo
  const ok1 = recordMissionCompletion("choking", {
    durationSeconds: 45,
    corrections: 0,
    objectives: ["cough", "help", "back_slaps"],
  });
  assert.equal(ok1, true, "Registro de choking deve ter sucesso");
  assert.equal(isMissionCompleted("choking"), true, "choking deve constar como concluído");
  assert.equal(isMissionCompleted("engasgo"), true, "engasgo por slug também deve constar como concluído");

  // Simula conclusão de queimaduras
  recordMissionCompletion("burns", { durationSeconds: 60, corrections: 1 });
  assert.equal(isMissionCompleted("burns"), true);
  assert.equal(isMissionCompleted("queimadura"), true);

  const count = getCompletedMissionsCount();
  assert.ok(count >= 2, "Pelo menos 2 missões devem constar como concluídas");

  const records = readMissionRecords();
  assert.ok(records.choking.completedAt, "Deve possuir timestamp ISO de conclusão");
  assert.ok(records.choking.score !== undefined, "Deve calcular pontuação educativa");
  assert.ok(records.choking.achievements?.includes("Precisão Perfeita"), "Deve registrar conquista quando zero correções");
});

test("Etapa 05: Personalização Unificada do Teddy", () => {
  const { DEFAULT_AVATAR, validateAvatar, CORES_ROUPA } = avatarStore;
  const avatar = validateAvatar({
    ...DEFAULT_AVATAR,
    roupaCor: "azul",
    acessorio: "oculos",
  });

  assert.equal(avatar.roupaCor, "azul");
  assert.equal(avatar.acessorio, "oculos");

  const hex = CORES_ROUPA.find((c) => c.id === avatar.roupaCor)?.hex;
  assert.equal(hex, "#2E7DD1", "Deve mapear para a cor oficial Sinal Azul");
});
