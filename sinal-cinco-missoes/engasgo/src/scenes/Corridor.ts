import Phaser from 'phaser';
import {KitchenActor} from '../characters/KitchenActor';
import {NavigationGrid,RouteFollower} from '../core/navigation';
import {blocked,move,near,normalize,resolveOverlap,type Vec,type Rect} from '../core/movement';
import {KitchenAudio} from '../core/kitchenAudio';
import {Hud} from '../ui/Hud';
import {PRESENTATIONS} from '../missions/catalog';
import {CardiacMission} from '../missions/cardiac';
import type {GameInput,EventSink,GameEvent} from '../integration/contract';

const bounds={left:65,right:1410,top:395,bottom:875};
const walls:Rect[]=[{x:0,y:345,w:193,h:263},{x:216,y:318,w:317,h:168},{x:568,y:185,w:312,h:210},{x:885,y:245,w:223,h:206},{x:1092,y:371,w:210,h:149},{x:930,y:821,w:480,h:89}];
for(let x=0;x<1484;x+=40){const edge=x<830?636-x*.31:380+(x-830)*.40;walls.push({x,y:0,w:40,h:edge});}
const places:Record<string,Vec>={rafael:{x:735,y:644},phone:{x:1260,y:620},cabinet:{x:1140,y:568},bench:{x:400,y:530}};
const frames=[[132,4,124,321],[487,25,194,300],[817,104,250,214],[1154,220,366,97],[138,344,111,328],[478,349,183,322],[858,349,204,323],[1216,395,196,277],[40,697,265,315],[446,713,251,298],[783,713,347,286],[1222,744,245,232]];
export class Corridor extends Phaser.Scene{
 mission!:CardiacMission;teddy!:KitchenActor;ana!:Phaser.GameObjects.Sprite;rafael!:Phaser.GameObjects.Sprite;device!:Phaser.GameObjects.Image;hud!:Hud;paused=false;
 private nav=new NavigationGrid(walls,bounds);private route=new RouteFollower(this.nav,170);private audio=new KitchenAudio();private keys!:Record<string,Phaser.Input.Keyboard.Key>;private age=0;private stageAge=0;private queued='';private clear=false;private displayKey='';private feedback='';private pulse!:HTMLElement;private pads!:Phaser.GameObjects.Graphics;private previousPhase='';private finished=false;private spoken=false;
 constructor(private host:HTMLElement,public config:GameInput,private emit:EventSink,private restart:()=>void,private leave:()=>void){super('gym');}
 preload(){this.load.image('gym','/assets/cardiac/gym.png');this.load.image('gym-actors','/assets/cardiac/actors.png');for(const [key,file] of [['people','characters'],['actions','actions']])this.load.atlas('burns-'+key,'/assets/burns/'+file+'.png','/assets/burns/'+file+'.json');if(this.config.avatar.atlas)this.load.atlas('teddy-official',this.config.avatar.atlas.image,this.config.avatar.atlas.data);for(const [key,url]of Object.entries(this.config.avatar.accessoryImages??{}))if(url)this.load.image('accessory-'+key,url);}
 private send(type:string,extra:object={}){this.emit({version:1,missionId:'cardiac_arrest',type,...extra} as GameEvent);}
 create(){
  const tex=this.textures.get('gym-actors');frames.forEach(([x,y,w,h],i)=>tex.add(String(i),0,x,y,w,h));
  const gym=this.textures.get('gym');const src=gym.getSourceImage() as HTMLImageElement;gym.add('court',0,0,0,src.width,Math.floor(src.height*.94));this.add.image(0,0,'gym','court').setOrigin(0).setDisplaySize(1484,910);
  this.mission=new CardiacMission(Math.random()<.5,id=>this.send('objective-completed',{objective:id}));
  this.teddy=new KitchenActor(this,'teddy',{x:415,y:730},this.nav,this.config);
  this.rafael=this.add.sprite(735,644,'gym-actors','0').setOrigin(.5,1).setScale(.53);
  this.ana=this.add.sprite(940,520,'gym-actors','4').setOrigin(.5,1).setScale(.52);
  this.device=this.add.image(1200,300,'gym-actors','11').setScale(.34).setInteractive({useHandCursor:true}).on('pointerdown',()=>this.requestInteraction('cabinet'));
  this.pads=this.add.graphics().setDepth(700);
  const gCabinet=this.add.graphics().setDepth(200);
  gCabinet.fillStyle(0xffffff,0.95).fillRoundedRect(1170,230,65,70,8);
  gCabinet.lineStyle(3,0x53c6b6,1).strokeRoundedRect(1170,230,65,70,8);
  gCabinet.fillStyle(0x53c6b6,1).fillRect(1198,242,9,26).fillRect(1189,251,27,9);
  const gPhone=this.add.graphics().setDepth(200);
  gPhone.fillStyle(0xffc044,0.95).fillRoundedRect(1295,470,60,60,8);
  gPhone.lineStyle(3,0xd94444,1).strokeRoundedRect(1295,470,60,60,8);
  const label=(id:string,x:number,y:number,title:string,bg='#54377f')=>this.add.text(x,y,title,{fontFamily:'Manrope,Arial',fontSize:'16px',fontStyle:'bold',backgroundColor:bg,color:'#ffffff',padding:{x:8,y:4}}).setOrigin(.5).setInteractive({useHandCursor:true}).on('pointerdown',()=>this.requestInteraction(id)).setDepth(201);
  label('cabinet',1202,315,'DEA','#24685b');label('phone',1325,545,'☎ SAMU 192','#b32d2e');label('bench',370,414,'Equipamentos','#54377f');this.rafael.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.requestInteraction('rafael'));
  this.hud=new Hud(this.host,this.config,a=>this.action(a),()=>this.interact(),p=>{this.paused=p;this.teddy.sprite.anims[p?'pause':'resume']();if(p)void this.audio.context?.suspend();else void this.audio.context?.resume();},this.restart,this.leave,(m,e)=>{this.audio.effects=e;this.audio.setMusic(m);},PRESENTATIONS.cardiac_arrest);
  this.hud.root.classList.add('gym-hud');this.hud.root.querySelector('.sinal-footer small')!.textContent='SIMULAÇÃO · REVISÃO CLÍNICA PENDENTE';this.audio.effects=this.config.settings.effects;this.audio.setMusic(this.config.settings.music);
  this.pulse=document.createElement('output');this.pulse.className='gym-pulse';this.hud.root.append(this.pulse);
  this.keys=this.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT') as typeof this.keys;
  this.input.keyboard!.on('keydown',(e:KeyboardEvent)=>{if(e.repeat)return;if(e.code==='Escape')this.hud.togglePause();if(e.code==='KeyE')this.interact();if(e.code==='Space'&&!(document.activeElement instanceof HTMLButtonElement)){e.preventDefault();this.action('beat');}});
  this.fit();this.scale.on('resize',this.fit,this);this.events.once('shutdown',()=>{this.scale.off('resize',this.fit,this);this.hud.destroy();this.audio.destroy();if(this.spoken)speechSynthesis.cancel();});this.send('loaded');this.send('mission-started');
  if(import.meta.env.DEV&&location.search.includes('test=1'))Object.assign(window,{sinalTest:{scene:this,state:()=>({phase:this.mission.phase,x:this.teddy.x,y:this.teddy.y})}});
 }
 private fit(){const c=this.cameras.main;c.setBounds(0,0,1484,910);c.setZoom(Math.max(this.scale.width/1484,this.scale.height/910));c.startFollow(this.teddy,true,0.1,0.1);}
 private target(){const m=this.mission;return !m.recognized?'rafael':!m.called?'phone':!m.carrying&&!m.delivered?'cabinet':'rafael';}
 requestInteraction(id:string){if(this.paused||this.finished||['analysis','shockAdvised'].includes(this.mission.stage))return;this.audio.unlock();const p=places[id];if(!p)return;const goal=id==='rafael'?{x:620,y:685}:p;if(this.teddy.goTo(goal))this.queued=id;else this.hud.feedback('Passagem bloqueada. Aproxime-se pelo centro da quadra.');}
 interact(){if(this.paused)return;const target=this.target();if(near(this.teddy,places[target],155))this.use(target);else this.hud.setHint('Aproxime-se ou clique no ponto indicado.');}
 private use(id:string){if(!near(this.teddy,places[id],160))return;const m=this.mission;
  if(m.phase==='explore'){
   if(id==='rafael'){
    m.collapse();this.age=0;this.teddy.gesture('alert',()=>{});
    const danger:Rect[]=[{x:643,y:613,w:184,h:34},{x:734,y:622,w:32,h:20}];
    const safeSpot=resolveOverlap(this.teddy,danger,bounds,24,180);
    if(Math.hypot(safeSpot.x-this.teddy.x,safeSpot.y-this.teddy.y)>1){
     this.tweens.add({targets:this.teddy,x:safeSpot.x,y:safeSpot.y,duration:this.config.settings.reducedMotion?100:750,ease:'Sine.easeOut'});
    }
    this.route.request(this.ana,{x:705,y:608});
   }else this.hud.feedback(id==='cabinet'?'O DEA está identificado na parede.':id==='phone'?'Aqui é possível simular a chamada ao 192.':'Rafael organiza a atividade esportiva.');
   return;
  }
  if(id==='phone'){m.call();if(m.called)this.feedback='SAMU 192 • Ginásio da Escola SINAL. Adulto inconsciente, sem respiração normal, suspeita de PCR. Ana iniciou RCP e há DEA disponível. Chamada simulada.';}
  if(id==='cabinet'){m.pickup();if(m.carrying)this.teddy.gesture('interacting',()=>{});}
  if(id==='rafael'){m.deliver();if(m.delivered){this.device.setPosition(625,685).setScale(.26);}}
  this.displayKey='';
 }
 private action(a:string){if(this.paused||this.finished)return;const m=this.mission;
  if(a==='read'&&'speechSynthesis'in window){this.spoken=true;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(this.hud.panel.textContent??'');u.lang='pt-BR';speechSynthesis.speak(u);return;}
  if(a.startsWith('go-')){this.requestInteraction(a.slice(3));return;}
  if(a==='observe')m.observe();if(a==='beat'&&m.compressing)this.feedback=m.tap();
  if(a==='device'&&!near(this.teddy,places.rafael,160)){this.requestInteraction('rafael');return;}if(a==='device'&&near(this.teddy,places.rafael,160)){if(m.stage==='pads'){this.route.request(this.ana,{x:840,y:550});this.feedback='Ana se afasta. Ninguém deve tocar no professor.';}else m.advance(false);}
  if(a==='shock')m.shock(this.clear&&this.safe());this.displayKey='';
 }
 private safe(){return !near(this.ana,places.rafael,95)&&!near(this.teddy,places.rafael,100);}
 private render(){const m=this.mission;const key=[m.phase,m.stage,m.called,m.carrying,m.delivered,m.rhythm,this.feedback].join('|');if(key===this.displayKey)return;this.displayKey=key;
  const b=(label:string,action:string)=>({label,action});const buttons=[];let body='';
  if(m.phase==='explore'){body='Rafael organiza a aula no ginásio. Explore ou converse com ele no centro da quadra.';buttons.push(b('Conversar com Rafael','go-rafael'));}
  else if(!m.recognized)body='Teddy: Ana! O professor caiu! Ana verifica se ele responde e respira normalmente.';
  else {body='Rafael não responde e não respira normalmente. Suspiros agônicos não são respiração normal. Ana inicia compressões no centro do tórax.';if(!m.called)buttons.push(b('Ir ao telefone','go-phone'));if(!m.delivered)buttons.push(m.carrying?b('Levar o DEA até Ana','go-rafael'):b('Buscar o DEA','go-cabinet'));
   if(m.compressing&&!m.rhythm){body+=' Observe 100–120/min, profundidade de 5–6 cm e retorno completo. O toque treina cadência, sem medir força.';buttons.push(b('Marcar batida · Espaço','beat'),b('Observei o ritmo e o retorno','observe'));}
   if(m.delivered&&m.stage!=='done'){const prompts:Record<string,string>={closed:'Abrir estojo',open:'Ligar DEA',on:'Aplicar eletrodos conforme o desenho',pads:'Afastar para a análise',analysis:'Analisando. Ninguém toca em Rafael.',shockAdvised:'Choque indicado. Todos afastados.'};body=prompts[m.stage]+'. '+(m.stage==='on'?'Um eletrodo abaixo da clavícula direita, o outro no lado esquerdo do tórax.':'Siga a orientação do aparelho.');if(m.stage==='shockAdvised')buttons.push(b('Confirmar afastamento e aplicar choque','shock'));else if(m.stage!=='analysis')buttons.push(b(prompts[m.stage],'device'));}
   if(m.stage==='done')body=(m.shockable?'Choque simulado realizado.':'DEA: choque não indicado.')+' Ana retoma imediatamente a RCP até a equipe assumir.';
  }
  buttons.push(b('Ler instruções','read'));this.hud.show(m.phase==='explore'?'Antes da aula':m.phase==='aed'?'Instruções do DEA':'Atendimento ao professor',body+(this.feedback?' '+this.feedback:''),buttons);
  this.hud.setObjective(m.phase==='explore'?'Encontre o professor Rafael.':!m.called?'Acione o SAMU 192.':!m.delivered?'Providencie o DEA.':m.stage!=='done'?'Acompanhe as instruções do DEA.':'Acompanhe Ana até a transferência.');
 }
 update(_t:number,delta:number){if(!this.mission||this.paused||this.finished)return;const dt=Math.min(delta/1000,.06),m=this.mission;m.elapsed+=dt;this.age+=dt;
  const down=this.rafael.frame.name==='3';const obstacles=[...walls,{x:735-(down?92:16),y:644-(down?31:12),w:down?184:32,h:down?34:18},{x:this.ana.x-16,y:this.ana.y-10,w:32,h:18}];this.teddy.route.grid.obstacles=obstacles;
  if(blocked(this.teddy,obstacles,14)){
   const resolved=resolveOverlap(this.teddy,obstacles,bounds,14,140);
   if(Math.hypot(resolved.x-this.teddy.x,resolved.y-this.teddy.y)>0.1){
    this.teddy.x+=(resolved.x-this.teddy.x)*Math.min(1,dt*12);
    this.teddy.y+=(resolved.y-this.teddy.y)*Math.min(1,dt*12);
   }
  }
  const k=this.keys,keys=normalize(Number(k.D.isDown||k.RIGHT.isDown)-Number(k.A.isDown||k.LEFT.isDown),Number(k.S.isDown||k.DOWN.isDown)-Number(k.W.isDown||k.UP.isDown));const v=keys.x||keys.y?keys:this.hud.stick;const manual=!!(v.x||v.y)&&!['analysis','shockAdvised'].includes(m.stage);if(manual){this.queued='';this.teddy.route.cancel();const p=move(this.teddy,v,dt,obstacles,bounds);this.teddy.face(v.x,v.y);this.teddy.setPosition(p.x,p.y);}this.teddy.updateActor(dt,this.config.settings.reducedMotion,manual);if(manual)this.teddy.pose('walking');
  if(this.queued&&this.teddy.route.status==='arrived'){const id=this.queued;this.queued='';this.use(id);}
  const walking=this.route.status==='moving';const next=this.route.update(this.ana,dt);this.ana.setPosition(next.x,next.y);if(walking)this.ana.setFrame(String(5+Math.floor(m.elapsed*7)%2));
  if(m.phase==='collapse'){this.rafael.setFrame(this.age<.55?'1':this.age<1.1?'2':'3');if((this.age>1.2&&!walking)||this.age>8){m.assess();this.age=0;this.ana.setFrame('7');}}
  if(m.phase==='recognize'&&this.age>1.2){m.respond();this.age=0;}if(m.phase==='emergencyResponse'&&this.age>.25)m.phase='cpr';
  if(m.carrying)this.device.setPosition(this.teddy.x+28,this.teddy.y-48).setScale(.21);
  if(m.stage==='pads'&&this.safe()&&!walking){this.clear=true;m.advance(true);this.stageAge=0;}
  if(m.stage==='analysis'){this.ana.setFrame('4');this.stageAge+=dt;if(this.stageAge>2){m.analyzed(this.safe());}}
  if(m.stage==='done'&&this.clear){this.clear=false;this.route.request(this.ana,{x:705,y:608});this.age=0;}
  if(m.compressing&&!walking&&near(this.ana,{x:705,y:608},75)){const compression=Math.floor(m.elapsed*110/60*2)%2;this.ana.setFrame(compression?'9':'8');this.rafael.y=644+(compression?2.5:0);}
  if(m.delivered&&m.stage!=='closed')this.device.setFrame('10');
  if(['pads','analysis','shockAdvised','done'].includes(m.stage)){this.pads.clear().fillStyle(0xf5ede1).fillRoundedRect(685,613,13,9,2).fillRoundedRect(716,624,13,9,2);}
  this.rafael.setDepth(644);this.ana.setDepth(m.compressing?643:this.ana.y);this.device.setDepth(m.carrying?this.teddy.y+1:690);
  if(m.stage==='done'&&this.age>5&&!walking&&m.handoff()){this.age=0;this.feedback='A equipe chegou ao ginásio. Ana transmite o atendimento.';}
  if(m.phase==='handoff'&&this.age>2){this.finished=true;m.phase='complete';const result={mode:this.config.mode,objectives:[...m.completed],durationSeconds:Math.round(m.elapsed),corrections:0,clinicalReview:'pending' as const};this.teddy.gesture('celebrating',()=>{});this.hud.conclusion({title:'MISSÃO CONCLUÍDA — VOCÊ AJUDOU A SALVAR TEMPO!',summary:'Ana transferiu o cuidado à equipe especializada.',items:['Reconhecer a emergência e chamar o SAMU 192.','Iniciar compressões e minimizar interrupções.','Providenciar o DEA e seguir suas instruções.'],note:'Demonstração de RCP adulta. Revisão clínica pendente.'});this.send('educational-result',{result});this.send('mission-completed',{result});return;}
  if(this.previousPhase!==m.phase){this.previousPhase=m.phase;this.send('phase-changed',{phase:m.phase});}
  if(m.compressing){const comp=Math.floor(m.elapsed*110/60*2)%2;const simSeconds=Math.min(30,Math.floor(m.elapsed));this.pulse.innerHTML=`<div class="gym-pulse-header"><span>RITMO DE RCP (ADULTO)</span><span class="gym-pulse-bpm">100–120 / min</span></div><div class="gym-pulse-meter"><span class="gym-beat-dot ${comp?'compress':''}"></span><span class="gym-pulse-status">${comp?'<b>COMPRIMIR</b> (5–6 cm no centro)':'<b>RETORNO</b> (reexpansão total)'}</span></div><div class="gym-pulse-info">Simulação abreviada (${simSeconds}s). Na vida real: 100–120/min contínuas até o SAMU 192 ou DEA.</div>`;}else{this.pulse.innerHTML='';}
  this.render();
 }
}
import '../ui/gym.css';
