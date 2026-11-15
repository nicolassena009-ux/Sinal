import type {EducationalResult,Mode} from '../integration/contract';

export const BURNS_PHASES = ['explore','incident','assess','secure','moveToSink','cooling','protection','seekHelp','complete'] as const;
export type BurnsPhase = typeof BURNS_PHASES[number];
export type BurnsAction = 'notice'|'incidentFinished'|'recognize'|'adultSecuredHeat'|'arrivedAtSink'|'openTap'|'cover'|'requestMedicalHelp';
/** Scene events, never dialogue dismissal, advance care. Clinical review remains pending. */
export class BurnsMission {
 phase:BurnsPhase='explore';
 elapsed=0;
 simulatedCoolingSeconds=0;
 waterRunning=false;
 heatSecured=false;
 readonly completed:string[]=[];
 private finished=false;
 constructor(readonly mode:Mode,private objective:(id:string)=>void=()=>{}){}
 act(action:BurnsAction):boolean {
  const transitions:Partial<Record<BurnsPhase,[BurnsAction,BurnsPhase]>>={
   explore:['notice','incident'],incident:['incidentFinished','assess'],assess:['recognize','secure'],
   secure:['adultSecuredHeat','moveToSink'],moveToSink:['arrivedAtSink','cooling'],
   protection:['cover','seekHelp'],seekHelp:['requestMedicalHelp','complete']
  };
  if(this.phase==='cooling'&&action==='openTap'&&!this.waterRunning){this.waterRunning=true;return true;}
  const transition=transitions[this.phase];
  if(!transition||transition[0]!==action)return false;
  if(action==='adultSecuredHeat')this.heatSecured=true;
  this.advance(transition[1]);return true;
 }
 tick(seconds:number){
  if(!Number.isFinite(seconds)||seconds<=0||this.finished)return;
  this.elapsed+=seconds;
  if(this.phase==='cooling'&&this.waterRunning){
   // Twenty real seconds represent twenty minutes, explicitly labelled by the UI.
   this.simulatedCoolingSeconds=Math.min(1200,this.simulatedCoolingSeconds+seconds*60);
   if(this.simulatedCoolingSeconds===1200){this.waterRunning=false;this.advance('protection');}
  }
 }
 private advance(next:BurnsPhase){
  const previous=this.phase;this.phase=next;this.completed.push(previous);
  this.finished=next==='complete';this.objective(previous);
 }
 result():EducationalResult {
  if(!this.finished)throw new Error('Queimaduras ainda não concluída');
  return {mode:this.mode,objectives:[...this.completed],corrections:0,durationSeconds:Math.round(this.elapsed),clinicalReview:'pending'};
 }
}
