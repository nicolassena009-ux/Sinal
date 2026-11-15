import Phaser from 'phaser';
import type {Accessory} from '../integration/contract';
import {AnimationController,type AnimationState} from './animation';
import {NavigationGrid,RouteFollower} from '../core/navigation';
import type {Vec} from '../core/movement';
import {TeddyLayers, type TeddyCustomConfig} from './TeddyLayers';
export type {AnimationState} from './animation';
export type Behavior='normal'|'cough'|'distress'|'help'|'recover';
/** World feet are never displaced by animation; all poses use a local rig. */
export class Actor extends Phaser.GameObjects.Container{
 grounded=false;controller=new AnimationController();behavior:Behavior='normal';clock=0;
 get animationState(){return this.controller.state;}set animationState(value:AnimationState){this.controller.set(value);}
 get direction(){return this.controller.direction;}
 route?:RouteFollower;label:Phaser.GameObjects.Text;
 private rigBody:Phaser.GameObjects.Container;private sprite:Phaser.GameObjects.Sprite;
 private official:boolean;private isTeddyCanonical:boolean;private row:string;private assistTime=0;private accessories:Phaser.GameObjects.Image[]=[];private signal:Phaser.GameObjects.Text;
 private teddyLayers?:TeddyLayers;
 constructor(scene:Phaser.Scene,public id:string,x:number,y:number,_color:number,name:string,proxy=false,equipped:Accessory[]=[],officialHeight=110,customConfig?:TeddyCustomConfig){
  super(scene,x,y);scene.add.existing(this);
  this.add(scene.add.ellipse(0,-1,40,11,0x573f3f,.22));
  this.rigBody=scene.add.container(0,0);this.add(this.rigBody);
  this.row=proxy?'teddy':id==='marina'||id==='staff'?'marina':id==='rafa'?'rafa':'lia';
  this.official=proxy&&scene.textures.exists('teddy-official');
  this.isTeddyCanonical=proxy&&scene.textures.exists('burns-people')&&!this.official;
  if(this.isTeddyCanonical){
   this.sprite=scene.add.sprite(0,0,'burns-people','0-0').setOrigin(.5,1);
   this.sprite.setScale(125/233);
   this.teddyLayers=new TeddyLayers(scene,this.rigBody,this.sprite,{color:undefined,accessories:equipped,custom:customConfig});
  }else{
   this.sprite=scene.add.sprite(0,0,this.official?'teddy-official':'pixel-characters',this.official?undefined:this.row+'-0').setOrigin(.5,this.official?1:.96);
   if(!this.official)this.sprite.setDisplaySize(184,123);else this.sprite.setDisplaySize(this.sprite.width/this.sprite.height*officialHeight,officialHeight);
   if(proxy&&_color!==0x6d3fc3)this.sprite.setTint(_color);
  }
  this.rigBody.add(this.sprite);
  for(const accessory of equipped)if(scene.textures.exists('accessory-'+accessory)){
   const anchor=accessory==='cap'?{x:0,y:-90}:accessory==='glasses'?{x:0,y:-70}:{x:0,y:-45};
   const image=scene.add.image(anchor.x,anchor.y,'accessory-'+accessory).setOrigin(.5);this.accessories.push(image);this.rigBody.add(image);
  }
  const displayName=proxy?'Teddy':name;
  this.label=scene.add.text(0,13,displayName,{fontFamily:'Arial',fontSize:'11px',fontStyle:'bold',color:'#594233',backgroundColor:'#fff4dbe8',padding:{x:6,y:3}}).setOrigin(.5,0);this.add(this.label);
  this.signal=scene.add.text(31,-108,'',{fontFamily:'Arial',fontSize:'17px',fontStyle:'bold',color:'#6d3fc3',backgroundColor:'#fff6df',padding:{x:5,y:3}}).setOrigin(.5);this.add(this.signal);
 }
 attachNavigation(grid:NavigationGrid){this.route=new RouteFollower(grid);}
 goTo(goal:Vec){return this.route?.request(this,goal)??false;}
 navigate(dt:number){
  if(!this.route)return false;const next=this.route.update(this,dt);const dx=next.x-this.x,dy=next.y-this.y;
  const moving=Math.hypot(dx,dy)>.001;if(moving){this.face(dx,dy);this.setPosition(next.x,next.y);}return moving;
 }
 playAssist(){this.assistTime=.65;this.animationState='assist';}
 animate(dt:number,moving=false,reduced=false){
  this.clock+=dt;this.setDepth(this.y);this.controller.update(dt,moving);this.assistTime=Math.max(0,this.assistTime-dt);
  const concerned=['cough','distress'].includes(this.behavior)||['observe','concerned','interact','assist'].includes(this.animationState);
  if(this.isTeddyCanonical){
   const isBack=[0,1,7].includes(this.direction);
   const isSpecial=this.animationState==='assist'||this.animationState==='interact'||this.behavior==='distress';
   const isCelebrate=this.animationState==='celebrate'||this.behavior==='recover';
   let frameKey='0-0';
   if(isCelebrate)frameKey='0-7';
   else if(isSpecial)frameKey='0-6';
   else if(isBack){
    frameKey=moving?(Math.floor(this.controller.time*7)%2===0?'0-4':'0-5'):'0-3';
   }else{
    frameKey=moving?(Math.floor(this.controller.time*7)%2===0?'0-1':'0-2'):'0-0';
   }
   this.sprite.setFrame(frameKey);
   this.sprite.setFlipX([5,6,7].includes(this.direction));
   this.teddyLayers?.redraw(isBack?'back':'front',this.sprite.flipX);
  }else if(!this.official){
   const frame=moving?1+Math.floor(this.controller.time*7)%2:concerned?3:0;
   this.sprite.setFrame(this.row+'-'+frame);this.sprite.setFlipX([5,6,7].includes(this.direction)!==(frame===2));
  }else{
   const atlas=this.scene.textures.get('teddy-official');
   const frames=[this.animationState+'_'+this.direction+'_'+this.controller.frame(),this.animationState+'_'+Math.round(this.direction/2)*2%8+'_'+this.controller.frame(),'idle_'+this.direction+'_0','idle_4_0'];
   const key=frames.find(f=>atlas.has(f));if(key)this.sprite.setFrame(key);
  }
  this.rigBody.y=reduced?0:moving?Math.sin(this.clock*12)*1.8:Math.sin(this.clock*2.5)*.6;
  this.rigBody.x=reduced?0:this.assistTime>0?Math.sin((.65-this.assistTime)/.65*Math.PI)*9:0;
  this.rigBody.rotation=reduced?0:this.behavior==='cough'?Math.sin(this.clock*11)*.04:this.behavior==='distress'?.05+Math.sin(this.clock*16)*.015:0;
  if(this.grounded){this.rigBody.rotation=1.35;this.rigBody.setPosition(-35,-12);}
  this.signal.setText(this.behavior==='cough'?'…':this.behavior==='distress'?'!':this.behavior==='recover'?'✓':'').setVisible(this.behavior!=='normal'&&this.behavior!=='help');
  this.accessories.forEach(image=>image.setFlipX(this.sprite.flipX));
 }
 face(dx:number,dy:number){this.controller.face(dx,dy);}
}
