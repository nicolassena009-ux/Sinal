import {near,type Vec} from './movement';
export interface WorldInteraction extends Vec {id:string;title:string;description:string}
export class InteractionSystem {
  constructor(public objects:WorldInteraction[]=[]){ }
  nearest(point:Vec,radius=100){return this.objects.filter(o=>near(point,o,radius)).sort((a,b)=>Math.hypot(a.x-point.x,a.y-point.y)-Math.hypot(b.x-point.x,b.y-point.y))[0];}
}
