import type {Vec,Rect} from '../core/movement';
export const range=135;
export const withinReach=(a:Vec,b:Vec)=>Math.hypot(a.x-b.x,a.y-b.y)<=range;
export function bikeFootprint(p:Vec,fallen:boolean):Rect{return {x:p.x-(fallen?60:55),y:p.y-(fallen?16:10),w:fallen?120:110,h:fallen?26:18};}
const phases=['explore','bicycleAccident','secureScene','initialAssessment','fetchKit','woundCare','comfort','complete'] as const;
export type TraumaPhase=typeof phases[number];
export class TraumaMission{
 phase:TraumaPhase='explore';completed:string[]=[];elapsed=0;hasKit=false;safe=false;
 constructor(private notify:(id:string)=>void=()=>{}){}
 advance(from:TraumaPhase){if(this.phase!==from||from==='complete')return false;
 if(from==='initialAssessment'&&!this.safe||from==='fetchKit'&&!this.hasKit)return false;
 this.completed.push(from);this.notify(from);this.phase=phases[phases.indexOf(from)+1];return true;}
}
