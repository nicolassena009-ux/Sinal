import type Phaser from 'phaser';
import {CLASSROOM} from './classroomMap';
export function drawClassroom(s:Phaser.Scene){
 const g=s.add.graphics().setDepth(-3000);g.fillStyle(0xffe0b9).fillRect(0,0,1200,900);g.fillStyle(0xffd4b2).fillRect(0,0,1200,320);
 for(let y=320;y<900;y+=56)for(let x=-80;x<1250;x+=110){const shift=((y-320)/56%2)*55;g.fillStyle(((x+80)/110+(y-320)/56)%3===0?0xf7be96:0xfbd0a4).fillPoints([{x:x+shift,y},{x:x+shift+110,y},{x:x+shift+160,y:y+56},{x:x+shift+50,y:y+56}],true);g.lineStyle(2,0xfff2d4,.8).strokePoints([{x:x+shift,y},{x:x+shift+110,y},{x:x+shift+160,y:y+56},{x:x+shift+50,y:y+56}],true);}
 g.fillStyle(0xc77840).fillRect(0,240,1200,90);for(let x=0;x<1200;x+=32)g.lineStyle(2,0x945230).lineBetween(x,245,x,327);g.fillStyle(0xf5a951).fillRect(0,236,1200,8);g.fillStyle(0x875136).fillRect(0,326,1200,7);
 const objects=new Map<string,Phaser.GameObjects.Image>();
 const prop=(id:string,frame:string,x:number,y:number,w:number,h:number,depth=y)=>{const p=s.add.image(x,y,'seizure-props',frame).setOrigin(.5,1).setDisplaySize(w,h).setDepth(depth).setName(id);objects.set(id,p);return p;};
 prop('board','0-0',340,235,380,215,-1000);prop('window','0-1',710,245,280,230,-1000);prop('door','0-2',1100,350,155,290,-900);prop('locker','0-3',950,350,130,220,340);prop('shelf','2-0',850,345,130,145,340);
 prop('clock','3-2',950,105,65,65,-900);prop('poster','3-3',70,215,90,90,-900);prop('plant','2-1',65,415,85,135);
 prop('teacher-chair','1-3',195,392,72,100,350);prop('desk','1-2',190,468,240,150);prop('jacket','2-3',330,520,60,28);prop('pencils','3-1',250,380,24,35,470);const phone=s.add.graphics();phone.fillStyle(0x372746).fillRoundedRect(0,0,26,40,4);phone.fillStyle(0x9de4db).fillRoundedRect(3,3,20,29,2);phone.fillStyle(0xffffff).fillCircle(13,36,2);phone.generateTexture('class-phone',26,40);phone.destroy();objects.set('phone',s.add.image(152,365,'class-phone').setDepth(470).setName('phone'));
 for(const [i,p]of CLASSROOM.desks.entries()){prop('desk-'+i,'1-0',p.x,p.y,155,130);prop('chair-'+i,'1-1',p.x,p.y+65,65,100);prop('books-'+i,'3-0',p.x,p.y-96,42,24,p.y+1);}
 prop('bag','2-2',480,655,60,75);prop('materials','3-0',695,680,65,38);
 const flag=s.add.graphics().setDepth(-900);flag.fillStyle(0x268951).fillRect(25,40,95,60);flag.fillStyle(0xffdc48).fillPoints([{x:33,y:70},{x:72,y:46},{x:112,y:70},{x:72,y:94}],true);flag.fillStyle(0x2e58a3).fillCircle(72,70,14);
 return objects;
}

