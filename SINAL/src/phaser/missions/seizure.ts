import type {EducationalResult,Mode} from '../integration/contract';
export type SeizurePhase='explore'|'incident'|'secureArea'|'protectHead'|'monitor'|'callHelp'|'recovery'|'complete';
export type LucasState='normal'|'warning'|'losingBalance'|'assistedFall'|'seizure'|'postictal'|'recovering'|'alert';
export type HelenaState='idle'|'notice'|'approach'|'kneel'|'protect'|'monitor'|'callHelp'|'comfort'|'complete';
export const SEIZURE_OBJECTIVES=[
 {id:'bag',object:'bag',precondition:'incidentFinished',executor:'teddy',animation:'interacting'},
 {id:'materials',object:'materials',precondition:'incidentFinished',executor:'teddy',animation:'interacting'},
 {id:'head',object:'jacket',precondition:'areaSafe',executor:'helena',animation:'protect'},
 {id:'timer',object:'clock',precondition:'incidentStarted',executor:'teddy',animation:'thinking'},
 {id:'help',object:'phone',precondition:'incidentStarted',executor:'helena',animation:'callHelp'},
 {id:'recovery',object:'lucas',precondition:'movementsEnded',executor:'helena',animation:'comfort'},
] as const;
export class SeizureMission {
 phase:SeizurePhase='explore';lucas:LucasState='normal';helena:HelenaState='idle';elapsed=0;crisisSeconds=0;observedSeconds=0;
 timerStarted=false;helpRequested=false;helpCalled=false;headProtected=false;bagMoved=false;materialsMoved=false;recovered=false;corrections=0;
 readonly completed:string[]=[];
 constructor(readonly mode:Mode,private objective:(id:string)=>void=()=>{}){}
 completeObjective(id:string){if(this.completed.includes(id))return;this.completed.push(id);this.objective(id);}
 begin(){if(this.phase!=='explore')return false;this.phase='incident';this.lucas='warning';return true;}
 landed(){if(this.phase!=='incident')return;this.lucas='seizure';this.phase='secureArea';}
 act(action:string):boolean{
  if(this.phase==='explore'||this.phase==='complete')return false;
  if(['restrain','mouth','drink','medication'].includes(action)){this.corrections++;return false;}
  if(action==='requestHelp'&&!this.helpRequested){this.helpRequested=true;return true;}
  if(action==='helpCalled'&&this.helpRequested&&!this.helpCalled){this.helpCalled=true;this.completeObjective('help');this.refresh();return true;}
  if(action==='timer'&&!this.timerStarted){this.timerStarted=true;this.completeObjective('timer');this.refresh();return true;}
  if(this.phase==='incident')return false;
  if(action==='bag'&&!this.bagMoved){this.bagMoved=true;this.completeObjective('bag');this.refresh();return true;}
  if(action==='materials'&&!this.materialsMoved){this.materialsMoved=true;this.completeObjective('materials');this.refresh();return true;}
  if(action==='head'&&this.bagMoved&&this.materialsMoved&&!this.headProtected){this.headProtected=true;this.completeObjective('head');this.refresh();return true;}
  if(action==='recovery'&&this.lucas==='alert'&&this.helpCalled&&this.headProtected&&this.timerStarted&&!this.recovered){this.recovered=true;this.completeObjective('recovery');this.phase='complete';return true;}
  return false;
 }
 refresh(){if(this.phase==='incident'||this.phase==='explore'||this.phase==='complete')return;
  this.phase=!this.bagMoved||!this.materialsMoved?'secureArea':!this.headProtected?'protectHead':!this.timerStarted?'monitor':!this.helpCalled?'callHelp':this.lucas==='seizure'?'monitor':'recovery';
 }
 tick(dt:number){if(!Number.isFinite(dt)||dt<=0||this.phase==='complete')return;this.elapsed+=dt;
  if(this.lucas==='seizure'){this.crisisSeconds=Math.min(18,this.crisisSeconds+dt);if(this.timerStarted)this.observedSeconds+=dt;if(this.crisisSeconds>=18){this.lucas='postictal';this.refresh();}}
 }
 result():EducationalResult{if(this.phase!=='complete')throw new Error('Convulsão ainda não concluída');return {mode:this.mode,objectives:[...this.completed],durationSeconds:Math.round(this.elapsed),corrections:this.corrections,clinicalReview:'pending'};}
}
