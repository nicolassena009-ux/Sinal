import type {Rect, Vec} from '../core/movement';

export type FurnitureKind='table'|'chair'|'buffet'|'plant'|'bin';
export interface FurnitureDefinition extends Vec {
  id:string; kind:FurnitureKind; width:number; height:number;
  /** Relative to foot/pivot. Sprite silhouettes do not become giant collision boxes. */
  footprint:Rect; meal?:boolean; flip?:boolean;
}
export const LAYERS={floor:-10000,architecture:-9000,groundDetails:-8000,foreground:5000} as const;
const furniture:FurnitureDefinition[]=[];
for(const [index,[x,y]] of [[340,470],[760,470],[1170,650],[340,790],[760,850]].entries()) {
  furniture.push({id:`table-${index}`,kind:'table',x,y,width:260,height:180,footprint:{x:-119,y:-66,w:238,h:70},meal:index!==3});
  for(const [chair,[dx,dy]] of [[-80,-85],[80,-85],[-80,73],[80,73]].entries()) {
    furniture.push({id:`chair-${index}-${chair}`,kind:'chair',x:x+dx,y:y+dy,width:65,height:125,footprint:{x:-22,y:-17,w:44,h:30}});
  }
}
furniture.push({id:'buffet',kind:'buffet',x:1300,y:365,width:470,height:205,footprint:{x:-220,y:-65,w:440,h:70}});
for(const [i,[x,y]] of [[90,310],[1510,460],[90,905],[1490,1000]].entries()) {
  furniture.push({id:`plant-${i}`,kind:'plant',x,y,width:100,height:155,footprint:{x:-23,y:-20,w:46,h:32}});
}
for(const [i,x]of [1340,1410].entries())furniture.push({id:`bin-${i}`,kind:'bin',x,y:900,width:65,height:100,footprint:{x:-24,y:-24,w:48,h:35}});

export const CAFETERIA_MAP={
  width:1600,height:1100,
  bounds:{left:45,right:1555,top:235,bottom:1040},
  furniture,
  structure:[
    {x:0,y:0,w:1600,h:221},
    {x:0,y:0,w:35,h:1100}, {x:1565,y:0,w:35,h:1100},
    {x:0,y:0,w:65,h:350}, {x:1535,y:0,w:65,h:350},
    {x:0,y:1054,w:1600,h:46},
  ] satisfies Rect[],
  spawns:{teddy:{x:165,y:945},rafa:{x:770,y:590},marina:{x:1010,y:395},lia:{x:540,y:650},bia:{x:335,y:610},staff:{x:1240,y:255}},
  staging:{marina:{x:700,y:590},teens:{x:720,y:625},kids:{x:630,y:625}},
};
export function cafeteriaObstacles():Rect[]{return [...CAFETERIA_MAP.structure.map(r=>({...r})),...furniture.map(o=>({x:o.x+o.footprint.x,y:o.y+o.footprint.y,w:o.footprint.w,h:o.footprint.h}))];}
