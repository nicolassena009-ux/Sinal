import type {Bounds,Rect,Vec} from '../core/movement';
export const KITCHEN={width:1200,height:850,bounds:{left:55,right:1145,top:425,bottom:800} as Bounds,
 spawn:{x:190,y:690},sister:{x:430,y:520},mother:{x:660,y:445},
 points:{stove:{x:370,y:445},safe:{x:470,y:470},sink:{x:830,y:455},sisterSink:{x:780,y:430},motherSink:{x:690,y:440},kit:{x:1045,y:635},phone:{x:1080,y:465},fridge:{x:1060,y:445},table:{x:630,y:730}} satisfies Record<string,Vec>,
 obstacles:[{x:485,y:535,w:300,h:135},{x:515,y:485,w:65,h:48},{x:680,y:485,w:65,h:48},{x:515,y:690,w:65,h:48},{x:680,y:690,w:65,h:48},{x:1010,y:660,w:130,h:90}] as Rect[]};

