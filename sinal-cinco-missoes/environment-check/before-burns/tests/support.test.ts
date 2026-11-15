import {describe,it,expect} from 'vitest';
import {WORLDS} from '../src/world/supportWorlds';
import {SUPPORT,SupportMission,type SupportId} from '../src/missions/support';
import {NavigationGrid,RouteFollower} from '../src/core/navigation';
import {move,blocked} from '../src/core/movement';
import {PHASES,defaults,validateInput,type MissionId} from '../src/integration/contract';
for(const id of Object.keys(PHASES) as MissionId[])it(`contrato ${id}`,()=>{expect(()=>validateInput(defaults('kids',id))).not.toThrow();expect(()=>validateInput({...defaults('kids',id),phaseId:'invalid' as any})).toThrow();});
for(const id of Object.keys(WORLDS) as SupportId[])describe(id,()=>{
 const w=WORLDS[id];
 it('todos os objetivos têm acesso e caminhos respeitam sólidos',()=>{const grid=new NavigationGrid(w.obstacles,w.bounds);for(const p of Object.values(w.points)){expect(grid.walkable(p)).toBe(true);const route=grid.findPath(w.spawn,p);expect(route).not.toBeNull();let previous=w.spawn;for(const q of route!){expect(grid.segmentClear(previous,q)).toBe(true);previous=q;}}});
 it('professora chega sem penetrar móveis; movimento usa limites locais',()=>{const grid=new NavigationGrid(w.obstacles,w.bounds),f=new RouteFollower(grid);let p={...w.adult};expect(f.request(p,{x:w.victim.x+75,y:w.victim.y})).toBe(true);for(let n=0;n<2000&&f.status!=='arrived';n++){p=f.update(p,1/60);expect(blocked(p,w.obstacles)).toBe(false);}expect(f.status).toBe('arrived');expect(move({x:w.bounds.right,y:w.bounds.bottom},{x:1,y:1},1,[],w.bounds)).toEqual({x:w.bounds.right,y:w.bounds.bottom});});
 for(const mode of ['kids','teens'] as const)it(`sequência ${mode}, gatilho ativo e conclusão pendente`,()=>{const events:string[]=[];const m=new SupportMission(SUPPORT[id],mode,x=>events.push(x));m.tick(60);expect(m.phase).toBe('explore');m.talked=true;m.tick(.1);expect(m.phase).toBe('incident');m.engage();expect(m.perform('wrong')).toBe(false);for(const t of SUPPORT[id].tasks)expect(m.perform(t.target)).toBe(true);expect(m.phase).toBe('complete');expect(m.result().clinicalReview).toBe('pending');expect(events).toHaveLength(6);expect(m.perform('victim')).toBe(false);});
});
