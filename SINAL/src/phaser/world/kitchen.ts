import Phaser from 'phaser';
export function drawKitchen(s:Phaser.Scene){
 const g=s.add.graphics().setDepth(-2000);g.fillStyle(0xf2c5a5).fillRect(0,0,1200,850);g.fillStyle(0xffddc0).fillRect(0,0,1200,340);g.lineStyle(2,0xfff4df,.85);for(let y=340;y<900;y+=55)g.lineBetween(0,y,1200,y);for(let x=-800;x<1500;x+=85)g.lineBetween(x,340,x+540,850);g.fillStyle(0xd17b45).fillRect(0,310,1200,30);g.fillStyle(0x9f4d32).fillRect(0,334,1200,6);g.lineStyle(2,0xeeb18d);for(let x=0;x<1000;x+=45)g.lineBetween(x,180,x,310);for(let y=180;y<310;y+=40)g.lineBetween(0,y,1000,y);
 const p=(name:string,f:string,x:number,y:number,w:number,h:number,d=y)=>s.add.image(x,y,'burns-props',f).setOrigin(.5,1).setDisplaySize(w,h).setDepth(d).setName(name);
 p('window','2-0',790,220,230,190,-1000);p('cupboard-left','1-2',190,205,215,160,-1000);p('cupboard-right','1-2',1000,175,190,130,-1000);p('hood','1-3',370,225,200,170,-1000);
 p('counter','1-0',180,414,230,170);p('stove','0-2',380,414,180,220);p('counter-middle','1-0',570,414,200,170);p('sink','1-1',810,414,270,195);p('fridge','0-3',1030,412,155,280);
 p('chair-back-left','0-1',550,532,75,115,532);p('chair-back-right','0-1',715,532,75,115,532);
 p('table','0-0',635,667,330,230,667);
 p('chair-front-left','0-1',550,738,75,115,738);p('chair-front-right','0-1',715,738,75,115,738);
 p('kit-cabinet','1-0',1080,750,145,140);p('kit','2-2',1065,627,60,52,751);p('towel','2-3',1110,641,58,28,752);p('plant','2-1',105,440,75,125);p('plant-door','2-1',1130,440,66,110);
 const d=s.add.graphics().setDepth(415);d.fillStyle(0x643a4d).fillRect(1135,180,65,220);d.lineStyle(9,0xf19737).strokeRect(1135,180,65,220);d.fillStyle(0xf6d28a).fillCircle(1188,300,4);d.fillStyle(0xfff1e8).fillCircle(1120,100,32);d.lineStyle(5,0x6d3fc3).strokeCircle(1120,100,32);d.lineStyle(3,0x593247).lineBetween(1120,100,1120,78).lineBetween(1120,100,1136,92);d.fillStyle(0xfdf0c9).fillRect(1085,155,42,55);d.lineStyle(4,0xb66433).strokeRect(1085,155,42,55);d.fillStyle(0xff60a7).fillCircle(1105,175,9);d.lineStyle(4,0x559545).lineBetween(1105,182,1105,200);
 d.fillStyle(0xf2f1ff).fillRect(135,245,30,36);d.lineStyle(5,0xad6939).lineBetween(142,250,135,220).lineBetween(154,250,165,220);
 const t=s.add.graphics().setDepth(668);
 t.fillStyle(0x3e1d28,.22).fillEllipse(635,576,78,22);
 t.fillStyle(0xfff5ea).fillEllipse(635,572,74,22);
 t.lineStyle(2,0xd49b28,.7).strokeEllipse(635,572,74,22);
 t.fillStyle(0xeb5156).fillCircle(620,571,7);
 t.fillStyle(0xffc044).fillEllipse(636,569,14,6);
 t.fillStyle(0x53c6b6).fillCircle(626,565,4);
 t.fillStyle(0x6d3fc3).fillCircle(648,572,6);
 t.fillStyle(0x3e1d28,.15).fillEllipse(585,582,32,14);
 t.fillStyle(0xffffff).fillEllipse(585,580,30,12);
 t.fillStyle(0xeb5156).fillCircle(585,579,5);
 t.fillStyle(0x3e1d28,.15).fillEllipse(685,582,24,10);
 t.fillStyle(0x53c6b6,.85).fillRoundedRect(677,566,16,18,3);
 t.fillStyle(0xa7f3d0,.9).fillEllipse(685,567,14,6);
}
