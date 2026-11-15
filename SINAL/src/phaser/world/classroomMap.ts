import type {Bounds,Rect,Vec} from '../core/movement';
export const CLASSROOM={width:1200,height:900,bounds:{left:55,right:1145,top:350,bottom:850} as Bounds,
 spawn:{x:190,y:745},lucas:{x:590,y:600},helena:{x:350,y:460},
 points:{bag:{x:480,y:655},materials:{x:695,y:680},jacket:{x:330,y:520},clock:{x:720,y:370},phone:{x:350,y:510},board:{x:440,y:360},desk:{x:200,y:510},safe:{x:700,y:600},care:{x:610,y:535}} satisfies Record<string,Vec>,
 desks:[{x:865,y:470},{x:1060,y:470},{x:865,y:720},{x:1060,y:720}],
 obstacles:[{x:90,y:395,w:205,h:72},{x:165,y:350,w:60,h:42},... [865,1060].flatMap(x=>[470,720].flatMap(y=>[{x:x-66,y:y-64,w:132,h:64},{x:x-25,y:y+25,w:50,h:40}]))] as Rect[]};
export function bagFootprint(p:Vec):Rect{return {x:p.x-20,y:p.y-16,w:40,h:22};}
export function lucasFootprint(p:Vec,grounded:boolean):Rect{return grounded?{x:p.x-64,y:p.y-35,w:128,h:45}:{x:p.x-13,y:p.y-8,w:26,h:16};}
