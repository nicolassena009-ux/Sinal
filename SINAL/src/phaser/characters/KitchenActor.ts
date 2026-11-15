import Phaser from 'phaser';
import {NavigationGrid,RouteFollower} from '../core/navigation';
import type {Vec} from '../core/movement';
import type {GameInput} from '../integration/contract';
import {TeddyLayers} from './TeddyLayers';
import {ensureTeddyCustomTexture} from './teddyCustomTexture';
export type KitchenState='idle'|'walking'|'running'|'interacting'|'talking'|'alert'|'thinking'|'helping'|'celebrating';
export class KitchenActor extends Phaser.GameObjects.Container {
 override state:KitchenState='idle';direction='front';route:RouteFollower;sprite:Phaser.GameObjects.Sprite;label:Phaser.GameObjects.Text;
 private characterHeight=125;private action?:(()=>void)|undefined;private official=false;private clock=0;
 private peopleKey='burns-people';
 private teddyLayers?:TeddyLayers;
 constructor(scene:Phaser.Scene,public role:'teddy'|'sister'|'mother',position:Vec,grid:NavigationGrid,input:GameInput){
  super(scene,position.x,position.y);this.characterHeight=role==='mother'?155:role==='teddy'?Math.max(70,Math.min(180,input.avatar.atlas?.height??125)):125;scene.add.existing(this);this.route=new RouteFollower(new NavigationGrid([...grid.obstacles],grid.bounds),135);
  this.add(scene.add.ellipse(0,-3,42,12,0x4d2440,.2));
  this.official=role==='teddy'&&scene.textures.exists('teddy-official');
  this.peopleKey=role==='teddy'&&!this.official?ensureTeddyCustomTexture(scene,input.avatar?.custom):'burns-people';
  this.sprite=scene.add.sprite(0,0,this.official?'teddy-official':this.peopleKey,this.official?undefined:this.frame(0)).setOrigin(.5,1);
  this.sprite.setScale(this.characterHeight/this.sprite.height);this.add(this.sprite);
  if(role==='teddy'){
   this.teddyLayers=new TeddyLayers(scene,this,this.sprite,input.avatar);
  }
  this.label=scene.add.text(0,8,role==='teddy'?'Teddy':role==='sister'?'Irmã':'Mãe',{fontFamily:'Nunito,Arial',fontSize:'12px',color:'#48285c',backgroundColor:'#fff3df',padding:{x:7,y:3}}).setOrigin(.5,0);this.add(this.label);
  for(const direction of ['front','back'])for(const state of ['idle','walking','running','interacting','talking','alert','thinking','helping','celebrating'] as KitchenState[]){
   const animRole=role==='teddy'?`burns-${role}-${this.peopleKey}`:`burns-${role}`;
   const key=`${animRole}-${direction}-${state}`;if(scene.anims.exists(key))continue;
   const base=direction==='back'?3:0;const frames=state==='walking'||state==='running'?[base,base+1,base,base+2]:state==='alert'||state==='celebrating'?[0,7,7,0]:state==='helping'||state==='interacting'?[0,6,6,6,0]:state==='talking'?[0,6,0,6]:[base,base,base,base];
   const baseFrame={key:this.peopleKey,frame:this.frame(base)};
   const action=(n:number)=>({key:'burns-actions',frame:this.frame(n)});
   const sequence=state==='idle'&&direction==='front'?[baseFrame,baseFrame,baseFrame,baseFrame,baseFrame,baseFrame,baseFrame,action(0)]:state==='thinking'?[baseFrame,action(2),action(2),baseFrame]:state==='talking'?[baseFrame,action(1),baseFrame,action(1)]:state==='celebrating'?[baseFrame,action(5),action(5),baseFrame]:state==='alert'?[baseFrame,action(role==='sister'?2:1),action(role==='sister'?3:1),baseFrame]:state==='helping'?[baseFrame,action(3),action(4),action(4),baseFrame]:state==='interacting'?[baseFrame,action(role==='teddy'?4:role==='mother'?0:4),action(role==='teddy'?4:role==='mother'?0:4),baseFrame]:frames.map(f=>({key:this.peopleKey,frame:this.frame(f)}));
   scene.anims.create({key,frames:sequence,frameRate:state==='running'?12:state==='walking'?10:state==='idle'?4:7,repeat:['idle','walking','running'].includes(state)?-1:0});
  }
  this.sprite.on('animationupdate',()=>{
   if(!this.official)this.sprite.setScale(this.characterHeight/(this.sprite.texture.key==='burns-actions'?(role==='mother'?280:270):(role==='mother'?283:role==='sister'?236:233)));
   if(role==='teddy')this.teddyLayers?.redraw(this.direction as 'front'|'back',this.sprite.flipX);
  });
  this.sprite.on('animationcomplete',()=>{const done=this.action;this.action=undefined;this.pose('idle');done?.();});this.pose('idle',true);
 }
 frame(n:number){return `${this.role==='teddy'?0:this.role==='sister'?1:2}-${n}`;}
 pose(state:KitchenState,force=false){if(this.state===state&&!force)return;this.state=state;
  if(!this.official){
   if(force)this.sprite.stop();
   const animRole=this.role==='teddy'?`burns-${this.role}-${this.peopleKey}`:`burns-${this.role}`;
   this.sprite.play(`${animRole}-${this.direction}-${state}`,true);
   if(this.role==='teddy')this.teddyLayers?.redraw(this.direction as 'front'|'back',this.sprite.flipX);
   return;
  }
  const prefix:Record<KitchenState,string>={idle:'idle',walking:'walk',running:'walk',interacting:'interact',talking:'interact',alert:'concerned',thinking:'observe',helping:'assist',celebrating:'celebrate'};
  const names=this.scene.textures.get('teddy-official').getFrameNames();const direction=this.direction==='back'?0:4;
  let frames=names.filter(f=>f.startsWith(`${prefix[state]}_${direction}_`));if(!frames.length)frames=names.filter(f=>f.startsWith(`idle_${direction}_`));if(!frames.length)frames=names.filter(f=>f.startsWith('idle_4_'));if(!frames.length)frames=names.slice(0,1);
  const key=`burns-official-${state}-${direction}`;if(!this.scene.anims.exists(key))this.scene.anims.create({key,frames:frames.sort().map(frame=>({key:'teddy-official',frame})),frameRate:state==='walking'?10:6,repeat:['idle','walking','running'].includes(state)?-1:0});if(force)this.sprite.stop();this.sprite.play(key,true);
  if(this.role==='teddy')this.teddyLayers?.redraw(this.direction as 'front'|'back',this.sprite.flipX);
 }
 gesture(state:KitchenState,done:()=>void){this.route.cancel();this.action=done;this.pose(state,true);}
 face(dx:number,dy:number){const direction=dy< -Math.abs(dx)*.7?'back':'front';this.sprite.setFlipX(dx<-.01);if(direction!==this.direction){this.direction=direction;this.pose(this.state,true);}if(this.role==='teddy')this.teddyLayers?.redraw(this.direction as 'front'|'back',this.sprite.flipX);}
 goTo(p:Vec){this.action=undefined;return this.route.request(this,p);}
 updateActor(dt:number,reduced:boolean,manual=false){const next=this.route.update(this,dt);const dx=next.x-this.x,dy=next.y-this.y;const moving=Math.hypot(dx,dy)>.01;if(moving){this.face(dx,dy);this.setPosition(next.x,next.y);this.pose('walking');}else if(!manual&&(this.state==='walking'||this.state==='running'))this.pose('idle');this.clock+=dt;this.sprite.y=reduced?0:this.state==='idle'?Math.sin(this.clock*2)*.4:0;this.setDepth(this.y);return moving;}
 hold(frame=6){this.sprite.stop();if(!this.official)this.sprite.setTexture(this.peopleKey,this.frame(frame));this.state='helping';if(this.role==='teddy')this.teddyLayers?.redraw(this.direction as 'front'|'back',this.sprite.flipX);}
 holdAction(frame:number){this.sprite.stop();if(!this.official){this.sprite.setTexture('burns-actions',this.frame(frame));this.sprite.setScale(this.characterHeight/(this.role==='mother'?280:270));}this.state='helping';if(this.role==='teddy')this.teddyLayers?.redraw(this.direction as 'front'|'back',this.sprite.flipX);}
}
