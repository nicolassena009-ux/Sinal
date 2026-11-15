import Phaser from 'phaser';
import type {Rect} from '../core/movement';
export const yardBounds={left:52,right:1390,top:386,bottom:924};
export function yard(s:Phaser.Scene){
 const g=s.add.graphics().setDepth(-3000);g.fillStyle(0xbde9fa).fillRect(0,0,1450,950);
 g.fillStyle(0xf6ce9f).fillRect(686,0,765,370);g.fillStyle(0xc77e61).fillRect(686,275,765,95);
 for(let y=275;y<370;y+=24){g.lineStyle(2,0xefa587).lineBetween(686,y,1450,y);for(let x=686+(y%2)*35;x<1450;x+=78)g.lineBetween(x,y,x,y+24);}
 g.fillStyle(0xeab397).fillRect(0,365,1450,585);
 for(let y=365;y<950;y+=44)for(let x=-100;x<1450;x+=100){const off=(Math.floor(y/44)%2)*50;const v=[{x:x+off,y},{x:x+off+100,y},{x:x+off+139,y:y+44},{x:x+off+39,y:y+44}];g.fillStyle((Math.floor(x/100)+Math.floor(y/44))%3===0?0xe6a186:0xefb498).fillPoints(v,true);g.lineStyle(1,0xcb8d7c).strokePoints(v,true);}
 const lines=s.add.graphics().setDepth(-2000);lines.lineStyle(5,0xfff5da).strokePoints([{x:80,y:715},{x:625,y:470},{x:1370,y:708},{x:790,y:935}],true).strokeEllipse(725,702,195,89).lineBetween(335,597,1080,825);
 const objects=new Map<string,Phaser.GameObjects.Image>();const solids:Rect[]=[];
 function prop(id:string,frame:number,x:number,y:number,w:number,h:number,foot?:[number,number]){const image=s.add.image(x,y,'trauma-props',String(frame)).setOrigin(.5,1).setDisplaySize(w,h).setDepth(y);objects.set(id,image);if(foot)solids.push({x:x-foot[0]/2,y:y-foot[1],w:foot[0],h:foot[1]});return image;}
 for(let i=0;i<4;i++)prop('fence'+i,15,85+i*174,370,185,195);
 prop('window',14,880,249,320,205);prop('door',13,1300,376,125,254);
 prop('tree',4,145,415,355,355,[66,36]);prop('bench',5,260,468,200,120,[180,45]);prop('rack',6,532,430,155,110,[136,27]);prop('stairs',12,1300,478,230,135,[230,88]);prop('fountain',11,1050,418,65,115,[55,30]);
 prop('planter',10,850,406,210,94,[180,35]);prop('front-planter',10,1340,935,215,108,[190,44]);prop('goal',7,88,815,174,173,[140,55]);prop('bag',8,140,515,49,62,[32,15]);prop('ball',9,1200,770,52,52,[40,19]);
 prop('spare',1,378,475,42,55,[30,18]);prop('cone',1,430,570,48,59);prop('bike',0,545,511,147,101);prop('kit',2,1105,437,65,52);
 const cabinet=s.add.graphics().setDepth(275);cabinet.fillStyle(0xc34550).fillRoundedRect(1090,170,80,77,6);cabinet.fillStyle(0xfff8ed).fillRect(1122,180,15,53).fillRect(1103,200,53,15);
 g.fillStyle(0x585366).fillRect(1134,666,68,20);for(let i=0;i<6;i++)g.fillStyle(0x292c40).fillRect(1138+i*10,669,5,13);
 return {objects,solids};
}
