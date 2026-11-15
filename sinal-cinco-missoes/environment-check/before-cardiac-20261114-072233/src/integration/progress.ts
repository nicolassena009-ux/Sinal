import type {GameEvent} from './contract';
export const PROGRESS_KEY='sinal-missions:v1';
export interface MissionProgress {started:boolean;objectives:string[];completed:boolean;clinicalReview:'pending';phase?:string;result?:unknown}
/** Independent keys preserve the older standalone Engasgo payload. */
export function persistProgress(event:GameEvent,storage:Pick<Storage,'getItem'|'setItem'>){
 if(!['mission-started','phase-changed','objective-completed','mission-completed'].includes(event.type))return;
 try{let all:Record<string,MissionProgress>={};try{const value=JSON.parse(storage.getItem(PROGRESS_KEY)??'{}');if(value&&typeof value==='object'&&!Array.isArray(value))all=value;}catch{/* recover corrupt local cache */}
 const previous=all[event.missionId];const entry:MissionProgress={started:true,objectives:Array.isArray(previous?.objectives)?previous.objectives:[],completed:previous?.completed===true,clinicalReview:'pending'};
 if(event.type==='objective-completed')entry.objectives=[...new Set([...entry.objectives,event.objective])];
 entry.phase=event.type==='phase-changed'?event.phase:previous?.phase??'explore';
 if(event.type==='mission-completed'){entry.completed=true;entry.result=event.result;entry.objectives=[...new Set([...entry.objectives,...event.result.objectives])];}else if(previous?.result)entry.result=previous.result;
 all[event.missionId]=entry;storage.setItem(PROGRESS_KEY,JSON.stringify(all));
 }catch{/* Storage may be disabled; gameplay must remain available. */}
}
