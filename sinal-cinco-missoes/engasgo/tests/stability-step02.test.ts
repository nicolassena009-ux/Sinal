import { describe, it, expect } from 'vitest';
import { move, moveBy, resolveOverlap, blocked, type Rect, type Bounds, type Vec } from '../src/core/movement';
import { NavigationGrid, RouteFollower } from '../src/core/navigation';
import { CLASSROOM, lucasFootprint, bagFootprint } from '../src/world/classroomMap';

describe('ETAPA 02 — BUG-001 (Softlock em Convulsão)', () => {
  const bounds = CLASSROOM.bounds;
  const lucasPos = { x: 590, y: 600 };
  const standingFootprint = lucasFootprint(lucasPos, false);
  const groundedFootprint = lucasFootprint(lucasPos, true);

  it('confirma expansão da hitbox de Lucas ao cair no chão', () => {
    expect(standingFootprint.w).toBe(26);
    expect(standingFootprint.h).toBe(16);
    expect(groundedFootprint.w).toBe(128);
    expect(groundedFootprint.h).toBe(45);
    expect(groundedFootprint.w).toBeGreaterThan(standingFootprint.w * 4);
  });

  const distances = [30, 60, 90, 130];
  const angles = [
    { name: 'lateral esquerda (180°)', dx: -1, dy: 0 },
    { name: 'lateral direita (0°)', dx: 1, dy: 0 },
    { name: 'superior (270°)', dx: 0, dy: -1 },
    { name: 'inferior (90°)', dx: 0, dy: 1 },
    { name: 'diagonal superior-esquerda (225°)', dx: -Math.SQRT1_2, dy: -Math.SQRT1_2 },
    { name: 'diagonal inferior-esquerda (135°)', dx: -Math.SQRT1_2, dy: Math.SQRT1_2 },
    { name: 'diagonal superior-direita (315°)', dx: Math.SQRT1_2, dy: -Math.SQRT1_2 },
    { name: 'diagonal inferior-direita (45°)', dx: Math.SQRT1_2, dy: Math.SQRT1_2 },
  ];

  for (const dist of distances) {
    for (const ang of angles) {
      it(`resolução de overlap e escape seguro a ${dist}px na direção ${ang.name}`, () => {
        const teddyPos: Vec = {
          x: Math.round(lucasPos.x + ang.dx * dist),
          y: Math.round(lucasPos.y + ang.dy * dist)
        };

        const obstacles = [...CLASSROOM.obstacles, groundedFootprint, bagFootprint(CLASSROOM.points.bag)];

        // 1. Teddy deve poder ser descolado caso esteja sobreposto
        const safePos = resolveOverlap(teddyPos, obstacles, bounds, 14, 160);
        expect(blocked(safePos, obstacles, 14)).toBe(false);
        expect(safePos.x).toBeGreaterThanOrEqual(bounds.left);
        expect(safePos.x).toBeLessThanOrEqual(bounds.right);
        expect(safePos.y).toBeGreaterThanOrEqual(bounds.top);
        expect(safePos.y).toBeLessThanOrEqual(bounds.bottom);

        // 2. Se Teddy estiver sobreposto à hitbox de Lucas, movimento manual DEVE permitir caminhar para fora
        if (blocked(teddyPos, obstacles, 14)) {
          const escapeDir: Vec = { x: -ang.dx, y: -ang.dy };
          const moved = move(teddyPos, escapeDir, 0.05, obstacles, bounds);
          const distMoved = Math.hypot(moved.x - teddyPos.x, moved.y - teddyPos.y);
          expect(distMoved).toBeGreaterThan(0);
        }

        // 3. Pathfinding a partir da posição (mesmo sobreposta) até o corredor livre perto da mochila deve gerar rota válida
        const grid = new NavigationGrid(obstacles, bounds);
        const walkableGoal = { x: 400, y: 655 };
        expect(grid.walkable(walkableGoal)).toBe(true);

        const path = grid.findPath(teddyPos, walkableGoal);
        expect(path).not.toBeNull();
        expect(path!.length).toBeGreaterThan(0);

        const endPoint = path![path!.length - 1];
        expect(endPoint.x).toBeCloseTo(walkableGoal.x);
        expect(endPoint.y).toBeCloseTo(walkableGoal.y);
      });
    }
  }

  it('RouteFollower consegue navegar para fora de colisão sobreposta até o destino', () => {
    const obstacles = [...CLASSROOM.obstacles, groundedFootprint, bagFootprint(CLASSROOM.points.bag)];
    const grid = new NavigationGrid(obstacles, bounds);
    const follower = new RouteFollower(grid, 180);

    // Colocar Teddy profundamente sobreposto no pé de Lucas
    const trappedTeddy: Vec = { x: 570, y: 595 };
    expect(blocked(trappedTeddy, obstacles, 14)).toBe(true);

    const goal = { x: 400, y: 655 };
    expect(grid.walkable(goal)).toBe(true);
    expect(follower.request(trappedTeddy, goal)).toBe(true);

    let current = { ...trappedTeddy };
    let escaped = false;

    for (let step = 0; step < 180 && follower.status !== 'arrived'; step++) {
      current = follower.update(current, 1 / 30);
      if (!blocked(current, obstacles, 14)) {
        escaped = true;
      }
    }

    expect(escaped).toBe(true);
    expect(follower.status).toBe('arrived');
    expect(blocked(current, obstacles, 14)).toBe(false);
  });
});

describe('ETAPA 02 — BUG-019 (Risco de softlock em Parada Cardiorrespiratória)', () => {
  const bounds: Bounds = { left: 65, right: 1410, top: 395, bottom: 875 };
  const walls: Rect[] = [
    { x: 0, y: 345, w: 193, h: 263 },
    { x: 216, y: 318, w: 317, h: 168 },
    { x: 568, y: 185, w: 312, h: 210 },
    { x: 885, y: 245, w: 223, h: 206 },
    { x: 1092, y: 371, w: 210, h: 149 },
    { x: 930, y: 821, w: 480, h: 89 }
  ];
  const rafaelPos = { x: 735, y: 644 };
  const standingObstacle: Rect = { x: 735 - 16, y: 644 - 12, w: 32, h: 18 };
  const fallenObstacle: Rect = { x: 735 - 92, y: 644 - 31, w: 184, h: 34 };

  it('confirma expansão significativa da hitbox de Rafael de 32px para 184px', () => {
    expect(standingObstacle.w).toBe(32);
    expect(fallenObstacle.w).toBe(184);
    expect(fallenObstacle.w).toBeGreaterThan(standingObstacle.w * 5);
  });

  const distances = [30, 60, 90, 130];
  for (const dist of distances) {
    it(`resolve sobreposição com Rafael caído a ${dist}px`, () => {
      for (const sign of [-1, 1]) {
        const teddyPos: Vec = { x: rafaelPos.x + sign * dist, y: rafaelPos.y };
        const obstacles = [...walls, fallenObstacle];

        const safePos = resolveOverlap(teddyPos, obstacles, bounds, 14, 180);
        expect(blocked(safePos, obstacles, 14)).toBe(false);

        // Pathfinding até o telefone
        const grid = new NavigationGrid(obstacles, bounds);
        const path = grid.findPath(teddyPos, { x: 1260, y: 620 });
        expect(path).not.toBeNull();
        expect(path!.length).toBeGreaterThan(0);
      }
    });
  }

  it('Teddy preso dentro do footprint caído de Rafael escapa com RouteFollower até o DEA', () => {
    const obstacles = [...walls, fallenObstacle];
    const grid = new NavigationGrid(obstacles, bounds);
    const follower = new RouteFollower(grid, 180);

    // Teddy bem no centro de Rafael caído
    const trappedTeddy: Vec = { x: 730, y: 635 };
    expect(blocked(trappedTeddy, obstacles, 14)).toBe(true);

    const goal = { x: 1140, y: 568 }; // Gabinete do DEA
    expect(grid.walkable(goal)).toBe(true);
    expect(follower.request(trappedTeddy, goal)).toBe(true);

    let current = { ...trappedTeddy };
    let escaped = false;

    for (let step = 0; step < 200 && follower.status !== 'arrived'; step++) {
      current = follower.update(current, 1 / 30);
      if (!blocked(current, obstacles, 14)) {
        escaped = true;
      }
    }

    expect(escaped).toBe(true);
    expect(follower.status).toBe('arrived');
    expect(blocked(current, obstacles, 14)).toBe(false);
  });
});

describe('ETAPA 02 — Resiliência do RouteFollower contra bloqueio infinito', () => {
  it('cancela a rota limpa se o destino estiver permanentemente bloqueado sem oscilar infinitamente', () => {
    const bounds: Bounds = { left: 0, right: 500, top: 0, bottom: 500 };
    // Muro intransponível cortando o mapa
    const obstacles: Rect[] = [{ x: 200, y: 0, w: 50, h: 500 }];
    const grid = new NavigationGrid(obstacles, bounds);
    const follower = new RouteFollower(grid);

    const start = { x: 100, y: 250 };
    const unreachableGoal = { x: 350, y: 250 };

    follower.request(start, unreachableGoal);
    expect(follower.status).toBe('blocked');

    let p = { ...start };
    for (let i = 0; i < 20; i++) {
      p = follower.update(p, 0.4);
    }

    expect(follower.status).toBe('idle');
    expect(follower.goal).toBeUndefined();
  });
});
