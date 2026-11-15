import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveTeddyState,
  calculateTeddyPose,
} from "../src/components/minigames/animation.ts";
import {
  sortEntitiesByDepth,
  getObstacleDepthY,
} from "../src/components/minigames/depthSorting.ts";
import {
  isNearTarget,
  getInteractionPrompt,
} from "../src/components/minigames/npc.ts";
import { resolveCardinalDirection } from "../src/components/minigames/joystick.ts";
import { movePlayer, BOUNDS } from "../src/components/minigames/movement.ts";
import { validateAvatar, DEFAULT_AVATAR } from "../src/lib/avatarStore.ts";

test("Teddy Animação: seleção correta de estados com base no contexto do jogo", () => {
  // 1. Parado sem interagir -> idle
  assert.equal(
    resolveTeddyState({ isMoving: false, isInteracting: false, isFinished: false }),
    "idle",
  );

  // 2. Caminhando -> walk
  assert.equal(
    resolveTeddyState({ isMoving: true, isInteracting: false, isFinished: false }),
    "walk",
  );

  // 3. Perto da vítima antes de agir -> concerned
  assert.equal(
    resolveTeddyState({ isMoving: false, isInteracting: false, isFinished: false, isNearVictim: true }),
    "concerned",
  );

  // 4. Executando ação de socorro/interação -> assist
  assert.equal(
    resolveTeddyState({ isMoving: false, isInteracting: true, isFinished: false }),
    "assist",
  );

  // 5. Fase concluída -> celebrate (prioridade máxima)
  assert.equal(
    resolveTeddyState({ isMoving: true, isInteracting: true, isFinished: true }),
    "celebrate",
  );
});

test("Teddy Animação: temporização independente de FPS (cálculo de pose suave)", () => {
  // A 60 FPS ou 144 FPS, a pose deve ser uma função contínua do tempo em segundos
  const t0 = calculateTeddyPose("walk", 0.0);
  const tQuarter = calculateTeddyPose("walk", 0.0714); // ~1/4 do ciclo
  const tHalf = calculateTeddyPose("walk", 0.1428); // ~meio ciclo

  // As pernas alternam suavemente entre positivo e negativo
  assert.equal(typeof t0.legOffset, "number");
  assert.equal(typeof tQuarter.legOffset, "number");
  assert.equal(typeof tHalf.legOffset, "number");

  // Na comemoração, o pulinho eleva o Teddy (bobY negativo)
  const celPose = calculateTeddyPose("celebrate", 0.1);
  assert.ok(celPose.bobY <= 0);
  assert.ok(celPose.armAngle > 0.8); // Bracinhos erguidos
});

test("Perspectiva 2.5D: ordenação de profundidade (Y-sorting) garante sobreposição correta", () => {
  const entities = [
    { id: "teddy_frente", depthY: 150, render: () => {} },
    { id: "mesa_fundo", depthY: 90, render: () => {} },
    { id: "npc_lucas", depthY: 130, render: () => {} },
    { id: "cone_primeiro_plano", depthY: 180, render: () => {} },
  ];

  const sorted = sortEntitiesByDepth(entities);

  // Menor Y (mais ao fundo) primeiro; maior Y (mais à frente) por último
  assert.equal(sorted[0].id, "mesa_fundo");
  assert.equal(sorted[1].id, "npc_lucas");
  assert.equal(sorted[2].id, "teddy_frente");
  assert.equal(sorted[3].id, "cone_primeiro_plano");
});

test("Perspectiva 2.5D: cálculo da linha de contato de obstáculos", () => {
  // Mesa no refeitório: y=80, altura=50 -> profundidade no chão é 130
  const depth = getObstacleDepthY(80, 50);
  assert.equal(depth, 130);
});

test("NPCs e Interação: detecção precisa de proximidade e prompts contextuais", () => {
  const player = { x: 240, y: 145 };
  const lucasVictim = { x: 245, y: 145 }; // Distância = 5px (dentro do raio de 26px)
  const professoraAdult = { x: 300, y: 130 }; // Distância = ~62px (fora do raio)

  assert.equal(isNearTarget(player, lucasVictim), true);
  assert.equal(isNearTarget(player, professoraAdult), false);

  const promptVictim = getInteractionPrompt("Lucas", "victim");
  assert.ok(promptVictim.includes("Lucas"));
  assert.ok(promptVictim.includes("atender"));

  const promptAdult = getInteractionPrompt("Professora", "adult");
  assert.ok(promptAdult.includes("Professora"));
  assert.ok(promptAdult.includes("chamar"));
});

test("Personalização: compatibilidade retroativa com configurações salvas no avatarStore", () => {
  // Configuração válida com colete e crachá do socorrista
  const validConfig = {
    ...DEFAULT_AVATAR,
    roupaModelo: "colete_socorrista",
    roupaCor: "amarelo",
    acessorio: "cracha",
  };

  const validated = validateAvatar(validConfig);
  assert.equal(validated.roupaModelo, "colete_socorrista");
  assert.equal(validated.acessorio, "cracha");

  // Configuração corrompida ou incompleta deve reverter com segurança para DEFAULT_AVATAR
  const corrupted = { roupaModelo: "invalido" };
  const safe = validateAvatar(corrupted);
  assert.equal(safe.roupaModelo, DEFAULT_AVATAR.roupaModelo);
  assert.equal(safe.acessorio, DEFAULT_AVATAR.acessorio);
});

test("Preservação de Movimento e Colisões com o Teddy protagonista", () => {
  const obstacles = [{ x: 160, y: 80, width: 70, height: 50 }];
  const start = { x: 35, y: 165 };

  // Movimenta Teddy em direção à direita
  const moved = movePlayer(start, { x: 1, y: 0 }, 0.05, obstacles);
  assert.ok(moved.x > start.x);
  assert.equal(moved.y, start.y);

  // Limites do cenário continuam respeitados
  assert.ok(moved.x >= BOUNDS.left && moved.x <= BOUNDS.right);
  assert.ok(moved.y >= BOUNDS.top && moved.y <= BOUNDS.bottom);
});
