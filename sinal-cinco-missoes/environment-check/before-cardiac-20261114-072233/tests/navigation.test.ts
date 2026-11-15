import {describe,it,expect} from 'vitest';
import {NavigationGrid,RouteFollower} from '../src/core/navigation';
import {blocked,moveBy,type Vec} from '../src/core/movement';
import {CAFETERIA_MAP,cafeteriaObstacles} from '../src/world/cafeteriaMap';

describe('colisão e navegação do refeitório v2',()=>{
 it('todos os pontos narrativos são caminháveis',()=>{
  const grid=new NavigationGrid(cafeteriaObstacles(),CAFETERIA_MAP.bounds);
  for(const p of [...Object.values(CAFETERIA_MAP.spawns),...Object.values(CAFETERIA_MAP.staging)])expect(grid.walkable(p),JSON.stringify(p)).toBe(true);
 });
 it('a professora contorna a mesa em vez de atravessar o trajeto direto',()=>{
  const grid=new NavigationGrid(cafeteriaObstacles(),CAFETERIA_MAP.bounds);const start=CAFETERIA_MAP.spawns.marina,goal=CAFETERIA_MAP.staging.marina;
  expect(grid.segmentClear(start,goal)).toBe(false);
  const path=grid.findPath(start,goal)!;expect(path.length).toBeGreaterThan(1);
  let previous=start;for(const point of path){expect(grid.segmentClear(previous,point)).toBe(true);previous=point;}
  expect(path.at(-1)).toEqual(goal);
 });
 it.each([30,60,15])('rota completa a %i atualizações/segundo sem penetrar em sólidos',fps=>{
  const grid=new NavigationGrid(cafeteriaObstacles(),CAFETERIA_MAP.bounds);const follower=new RouteFollower(grid);let p:Vec={...CAFETERIA_MAP.spawns.marina};
  expect(follower.request(p,CAFETERIA_MAP.staging.marina)).toBe(true);
  for(let i=0;i<fps*15&&follower.status!=='arrived';i++){const next=follower.update(p,1/fps);expect(grid.segmentClear(p,next)).toBe(true);expect(blocked(next,grid.obstacles)).toBe(false);p=next;}
  expect(follower.status).toBe('arrived');expect(p.x).toBeCloseTo(700);expect(p.y).toBeCloseTo(590);
 });
 it('rejeita destinos dentro de mesa e fora das paredes',()=>{
  const grid=new NavigationGrid(cafeteriaObstacles(),CAFETERIA_MAP.bounds);expect(grid.findPath({x:540,y:600},{x:760,y:450})).toBeNull();expect(grid.findPath({x:540,y:600},{x:20,y:100})).toBeNull();
 });
 it('não corta quinas nem entra em um corredor menor que os pés',()=>{
  const grid=new NavigationGrid([{x:700,y:200,w:50,h:390},{x:700,y:610,w:50,h:500}],CAFETERIA_MAP.bounds);
  expect(grid.findPath({x:650,y:600},{x:810,y:600})).toBeNull();
 });
 it('recalcula quando um obstáculo bloqueia uma rota previamente válida',()=>{
  const grid=new NavigationGrid([],CAFETERIA_MAP.bounds);const follower=new RouteFollower(grid);let p={x:500,y:600};follower.request(p,{x:900,y:600});
  grid.obstacles.push({x:650,y:550,w:100,h:100});
  for(let i=0;i<600&&follower.status!=='arrived';i++){p=follower.update(p,1/60);expect(blocked(p,grid.obstacles)).toBe(false);}
  expect(follower.status).toBe('arrived');
 });
 it('barreira sem rota mantém o NPC parado, sem teletransporte',()=>{
  const grid=new NavigationGrid([{x:700,y:200,w:100,h:900}],CAFETERIA_MAP.bounds);const follower=new RouteFollower(grid);const start={x:600,y:600};expect(follower.request(start,{x:900,y:600})).toBe(false);expect(follower.update(start,1)).toEqual(start);expect(follower.status).toBe('blocked');
 });
 it('deslocamento grande não salta um obstáculo fino',()=>{
  const next=moveBy({x:100,y:500},{x:500,y:0},[{x:200,y:450,w:5,h:100}],CAFETERIA_MAP.bounds);expect(next.x).toBeLessThanOrEqual(186);
 });
 it('todos os NPCs e o avatar alcançam a área de atendimento',()=>{
  const grid=new NavigationGrid(cafeteriaObstacles(),CAFETERIA_MAP.bounds);for(const p of Object.values(CAFETERIA_MAP.spawns))expect(grid.findPath(p,CAFETERIA_MAP.staging.kids)).not.toBeNull();
 });
});
