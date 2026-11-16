import {describe,it,expect} from 'vitest';
import {KITCHEN} from '../src/world/kitchenMap';
import {NavigationGrid,RouteFollower} from '../src/core/navigation';
import {blocked} from '../src/core/movement';
import {persistProgress,PROGRESS_KEY} from '../src/integration/progress';
describe('Kitchen navigation and persistence',()=>{
 it('connects interaction areas and keeps every step outside furniture',()=>{
  const grid=new NavigationGrid(KITCHEN.obstacles,KITCHEN.bounds);
  for(const target of [KITCHEN.mother,KITCHEN.sister,...Object.values(KITCHEN.points).filter(p=>p!==KITCHEN.points.table)]){
   const follower=new RouteFollower(grid);let p={...KITCHEN.spawn};expect(follower.request(p,target),JSON.stringify(target)).toBe(true);
   for(let i=0;i<1500&&follower.status==='moving';i++){p=follower.update(p,.05);expect(blocked(p,KITCHEN.obstacles)).toBe(false);}
   expect(follower.status).toBe('arrived');expect(Math.hypot(p.x-target.x,p.y-target.y)).toBeLessThan(.1);
  }
 });
 it('keeps results by mission and does not duplicate objectives or overwrite old storage',()=>{
  const data=new Map<string,string>([['sinal-standalone-dev:v1','old-engasgo']]);const storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);}};
  for(const missionId of ['choking','burns'] as const){persistProgress({version:1,missionId,type:'mission-started'},storage);for(let i=0;i<2;i++)persistProgress({version:1,missionId,type:'objective-completed',objective:'explore'},storage);}
  const result={mode:'kids' as const,objectives:['explore','complete'],corrections:0,durationSeconds:50,clinicalReview:'pending' as const};
  persistProgress({version:1,missionId:'burns',type:'mission-completed',result},storage);persistProgress({version:1,missionId:'burns',type:'mission-started'},storage);
  const saved=JSON.parse(data.get(PROGRESS_KEY)!);expect(saved.choking.objectives).toEqual(['explore']);expect(saved.burns.completed).toBe(true);expect(saved.burns.objectives).toEqual(['explore','complete']);expect(saved.burns.clinicalReview).toBe('pending');expect(data.get('sinal-standalone-dev:v1')).toBe('old-engasgo');
 });
 it('recovers invalid storage and tolerates denied storage',()=>{
  const event={version:1 as const,missionId:'burns' as const,type:'mission-started' as const};let value='broken';persistProgress(event,{getItem:()=>value,setItem:(_k,v)=>{value=v;}});expect(JSON.parse(value).burns.started).toBe(true);expect(()=>persistProgress(event,{getItem:()=>{throw Error('denied');},setItem:()=>{throw Error('denied');}})).not.toThrow();
 });
});
