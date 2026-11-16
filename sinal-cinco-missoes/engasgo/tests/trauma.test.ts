import { describe, it, expect } from 'vitest';
import { TraumaMission, withinReach, bikeFootprint } from '../src/missions/trauma';
import { yardBounds } from '../src/world/traumaYard';
import { NavigationGrid, RouteFollower } from '../src/core/navigation';
import { type Rect, type Vec } from '../src/core/movement';

describe('Trauma — Lógica de Missão e Footprints', () => {
  it('só inicia cuidado após avaliação e kit', () => {
    const m = new TraumaMission();
    for (const p of ['explore', 'bicycleAccident', 'secureScene'] as const) expect(m.advance(p)).toBe(true);
    expect(m.advance('initialAssessment')).toBe(false);
    m.safe = true;
    m.advance('initialAssessment');
    expect(m.advance('fetchKit')).toBe(false);
    m.hasKit = true;
    m.advance('fetchKit');
    m.advance('woundCare');
    m.advance('comfort');
    expect(m.phase).toBe('complete');
    expect(m.advance('comfort')).toBe(false);
  });

  it('alcance inclusivo de perto até a borda', () => {
    for (const x of [1, 67, 135]) expect(withinReach({ x: 0, y: 0 }, { x, y: 0 })).toBe(true);
    expect(withinReach({ x: 0, y: 0 }, { x: 136, y: 0 })).toBe(false);
  });

  it('bicicleta caída ocupa outra área com footprint estável', () => {
    const standing = bikeFootprint({ x: 90, y: 100 }, false);
    const fallen = bikeFootprint({ x: 90, y: 100 }, true);
    expect(fallen.w).toBeGreaterThan(standing.w);
    expect(fallen.h).toBeGreaterThan(standing.h);
  });
});

describe('Trauma — Regressão Etapa 02.1: Navegação da Professora e Desobstrução da Bicicleta', () => {
  const solids: Rect[] = [];
  const bikePos = { x: 890, y: 650 };
  const fallenBike = bikeFootprint(bikePos, true);
  const sofiaPos = { x: 740, y: 650 };
  const sofiaObstacle = { x: sofiaPos.x - 36, y: sofiaPos.y - 12, w: 72, h: 18 };

  it('Sofia e bicicleta caída mantêm vão livre superior a 40px para travessia desimpedida', () => {
    expect(fallenBike.x).toBeGreaterThan(sofiaObstacle.x + sofiaObstacle.w);
    const gap = fallenBike.x - (sofiaObstacle.x + sofiaObstacle.w);
    expect(gap).toBeGreaterThanOrEqual(40);
  });

  it('Professora Clara navega da posição inicial até a queda de Sofia sem bloqueio', () => {
    const claraStart = { x: 981, y: 484 };
    const destQueda = { x: 780, y: 575 };
    const obstacles = [...solids, fallenBike, sofiaObstacle];
    const grid = new NavigationGrid(obstacles, yardBounds);

    expect(grid.walkable(destQueda)).toBe(true);
    const path = grid.findPath(claraStart, destQueda);
    expect(path).not.toBeNull();
    expect(path!.length).toBeGreaterThan(0);

    const follower = new RouteFollower(grid, 173);
    expect(follower.request(claraStart, destQueda)).toBe(true);

    let p = { ...claraStart };
    for (let i = 0; i < 120 && follower.status === 'moving'; i++) {
      p = follower.update(p, 1 / 30);
    }
    expect(follower.status).toBe('arrived');
  });

  it('Professora Clara atinge ponto seguro para avaliação inicial sem colidir com Sofia ou a bicicleta', () => {
    const claraPosQueda = { x: 780, y: 575 };
    const destAtendimento = { x: 740, y: 605 };
    const obstacles = [...solids, fallenBike, sofiaObstacle];
    const grid = new NavigationGrid(obstacles, yardBounds);

    expect(grid.walkable(destAtendimento)).toBe(true);
    const path = grid.findPath(claraPosQueda, destAtendimento);
    expect(path).not.toBeNull();
    expect(path!.length).toBeGreaterThan(0);

    const follower = new RouteFollower(grid, 173);
    expect(follower.request(claraPosQueda, destAtendimento)).toBe(true);

    let p = { ...claraPosQueda };
    for (let i = 0; i < 120 && follower.status === 'moving'; i++) {
      p = follower.update(p, 1 / 30);
    }
    expect(follower.status).toBe('arrived');
  });

  it('deslocamento de Clara conclui com sucesso independente da posição de Teddy', () => {
    const claraStart = { x: 981, y: 484 };
    const destQueda = { x: 780, y: 575 };
    const teddyPositions: Vec[] = [
      { x: 880, y: 530 },
      { x: 780, y: 575 }, // Teddy exatamente no destino pretendido
      { x: 600, y: 650 },
      { x: 850, y: 600 }
    ];

    for (const teddyPos of teddyPositions) {
      const teddyObstacle: Rect = { x: teddyPos.x - 14, y: teddyPos.y - 10, w: 28, h: 16 };
      const obstacles = [...solids, fallenBike, sofiaObstacle, teddyObstacle];
      const grid = new NavigationGrid(obstacles, yardBounds);

      let target = destQueda;
      if (!grid.walkable(target)) {
        const closest = grid.findClosestWalkable(target, 80);
        expect(closest).not.toBeNull();
        target = closest!;
      }

      const follower = new RouteFollower(grid, 173);
      expect(follower.request(claraStart, target)).toBe(true);
      let p = { ...claraStart };
      for (let i = 0; i < 150 && follower.status === 'moving'; i++) {
        p = follower.update(p, 1 / 30);
      }
      expect(follower.status).toBe('arrived');
    }
  });
});
