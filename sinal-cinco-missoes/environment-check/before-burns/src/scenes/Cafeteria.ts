import {showChokingProcedure} from '../missions/choking/presentation';
import {PRESENTATIONS} from '../missions/catalog';
import Phaser from 'phaser';
import { generateTextures, loadPixelAssets } from '../assets/art';
import { Actor } from '../characters/Actor';
import { move, near, normalize, type Rect } from '../core/movement';
import { CameraRig } from '../core/camera';
import { AudioBus } from '../core/audio';
import { InteractionSystem } from '../core/interactions';
import { buildCafeteria } from '../world/cafeteria';
import { CAFETERIA_MAP } from '../world/cafeteriaMap';
import { NavigationGrid } from '../core/navigation';
import { objectives, ChokingMission, type Action, type Phase } from '../missions/choking';
import { Hud } from '../ui/Hud';
import type { EventSink, GameInput } from '../integration/contract';
export class Cafeteria extends Phaser.Scene {
  teddy!:Actor;rafa!:Actor;marina!:Actor;lia!:Actor;actors:Actor[]=[];walls:Rect[]=[];mission!:ChokingMission;hud!:Hud;rig!:CameraRig;audio=new AudioBus();
  navigation!:NavigationGrid; private pendingPreparation=false; private preparationTime=0;
  objects=new InteractionSystem([{id:'mural',x:790,y:250,title:'Mural do cuidado',description:'Observe as pessoas ao seu redor. Nesta escola, a professora Marina pode ajudar em uma emergência. O SAMU atende pelo 192. No jogo, nenhuma ligação real é feita.'},{id:'tray',x:340,y:615,title:'Um intervalo juntos',description:'Bia deixou sua bandeja na mesa. O refeitório é um lugar de encontro: as passagens entre as cadeiras devem ficar livres para todos circularem.'},{id:'entry',x:150,y:995,title:'Bem-vindo ao refeitório',description:'Use WASD, setas ou o joystick para andar. Aproxime-se dos colegas e pressione E. Marina está perto da cantina; Lia está entre as mesas.'}]);
  keys!:Record<string,Phaser.Input.Keyboard.Key>; currentPhase?:Phase; paused=false; open=false; locked=false; prepared=false; marker!:Phaser.GameObjects.Text; elapsedStep=0; resizeHandler!:()=>void;
  constructor(private host:HTMLElement,public config:GameInput,private emit:EventSink,private restart:()=>void,private leave:()=>void){super('cafeteria');}
  preload(){for(const [key,url]of Object.entries(this.config.avatar.accessoryImages??{}))if(url)this.load.image('accessory-'+key,url);loadPixelAssets(this);if(this.config.avatar.atlas)this.load.atlas('teddy-official',this.config.avatar.atlas.image,this.config.avatar.atlas.data);this.load.on('loaderror',(file:Phaser.Loader.File)=>this.emit({version:1,missionId:'choking',type:'recoverable-error',message:`Não foi possível carregar ${file.key}. Verifique os arquivos de arte.`}));}
  create(){
    generateTextures(this);this.walls=buildCafeteria(this);
    const avatarColor=/^#[0-9a-f]{6}$/i.test(this.config.avatar.color??'')?Number.parseInt(this.config.avatar.color!.slice(1),16):0x6d3fc3;
    this.teddy=new Actor(this,'teddy',165,945,avatarColor,this.textures.exists('teddy-official')?'Teddy':'Teddy · provisório',true,this.config.avatar.accessories,Math.max(70,Math.min(180,this.config.avatar.atlas?.height??110)));
    this.rafa=new Actor(this,'rafa',770,590,0xe9a546,'Rafa · 15 anos');this.marina=new Actor(this,'marina',1010,395,0x6d3fc3,'Prof. Marina');this.lia=new Actor(this,'lia',540,650,0x4c98b5,'Lia');
    this.actors=[this.teddy,this.rafa,this.marina,this.lia,new Actor(this,'student-2',335,610,0xce737b,'Bia'),new Actor(this,'staff',1240,255,0xeeeecc,'Cantina')];
    this.navigation=new NavigationGrid(this.walls,CAFETERIA_MAP.bounds);
    for(const actor of this.actors)actor.attachNavigation(this.navigation);
    this.mission=new ChokingMission(this.config.mode,objective=>this.emit({version:1,missionId:'choking',type:'objective-completed',objective}));
    this.hud=new Hud(this.host,this.config,a=>this.perform(a as Action),()=>this.interact(),p=>{this.paused=p;if(p)this.audio.context?.suspend();else void this.audio.context?.resume();},this.restart,this.leave,(m,e)=>{this.audio.effects=e;this.audio.setMusic(m);},PRESENTATIONS.choking);
    this.audio.effects=this.config.settings.effects;this.audio.setMusic(this.config.settings.music);
    this.rig=new CameraRig(this.cameras.main,this.config.settings.reducedMotion);this.rig.follow(this.teddy);
    this.keys=this.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,ESC') as typeof this.keys;
    this.input.keyboard!.on('keydown', (e:KeyboardEvent)=>{if(e.code==='Escape')this.hud.togglePause();if((e.code==='KeyE'||e.code==='Space')&&!e.repeat&&!(e.code==='Space'&&document.activeElement instanceof HTMLButtonElement)){e.preventDefault();this.interact();}});
    this.input.on('pointerdown',()=>this.audio.unlock());this.input.keyboard!.on('keydown',()=>this.audio.unlock());
    this.marker=this.add.text(0,0,'↓',{fontSize:'36px',color:'#6d3fc3',fontStyle:'bold'}).setOrigin(.5).setDepth(10000);
    this.resizeHandler=()=>{if(this.locked)this.rig.focus(this.rafa.x,this.rafa.y-20,this.focusZoom());};this.scale.on('resize',this.resizeHandler);
    this.events.once('shutdown',()=>{this.hud.destroy();this.audio.destroy();this.scale.off('resize',this.resizeHandler);this.input.keyboard?.removeAllListeners();});
    this.emit({version:1,missionId:'choking',type:'loaded'});this.emit({version:1,missionId:'choking',type:'mission-started'});
    if(import.meta.env.DEV&&new URLSearchParams(location.search).has('test'))(window as unknown as {sinalTest:unknown}).sinalTest={scene:this,position:(id:string)=>{const a=this.actors.find(a=>a.id===id)!;this.teddy.setPosition(a.x-65,a.y+30);},state:()=>({phase:this.mission.phase,x:this.teddy.x,y:this.teddy.y,mode:this.config.mode,paused:this.paused})};
  }
  focusZoom(){return this.scale.width<700?1:1.35;}
  target(){const p=this.mission.phase;return p==='help'?this.marina:p==='call'?this.lia:this.rafa;}
  update(_time:number,delta:number){if(!this.mission||this.paused)return;const dt=Math.min(delta/1000,.1);if(this.mission.phase!=='complete')this.mission.tick(Math.min(delta/1000,.5));
    if(this.currentPhase!==this.mission.phase){this.currentPhase=this.mission.phase;this.phaseChanged();}
    if(this.mission.phase==='complete'){this.teddy.animate(dt,false,this.config.settings.reducedMotion);return;}
    let moving=false;
    if(!this.locked){const k=this.keys;const key=normalize(Number(k.D.isDown||k.RIGHT.isDown)-Number(k.A.isDown||k.LEFT.isDown),Number(k.S.isDown||k.DOWN.isDown)-Number(k.W.isDown||k.UP.isDown));const v=Math.hypot(key.x,key.y)>0?key:this.hud.stick;const next=move(this.teddy,v,dt,this.walls,CAFETERIA_MAP.bounds);moving=Math.hypot(next.x-this.teddy.x,next.y-this.teddy.y)>.01;this.mission.explore(Math.hypot(next.x-this.teddy.x,next.y-this.teddy.y));this.teddy.setPosition(next.x,next.y);this.teddy.face(v.x,v.y);if(moving){this.elapsedStep+=dt;if(this.elapsedStep>.3){this.audio.tone(180,.025,.012);this.elapsedStep=0;}if(this.open){this.open=false;this.hud.close();}}}
    for(const a of this.actors){const routed=a.navigate(dt);a.animate(dt,a===this.teddy?moving||routed:routed,this.config.settings.reducedMotion);}
    if(this.pendingPreparation){this.preparationTime+=dt;if(this.marina.route?.status==='blocked'||this.preparationTime>8){this.pendingPreparation=false;this.locked=false;this.marina.route?.cancel();this.rig.follow(this.teddy);this.hud.show('Vamos liberar o acesso','Teddy continua ao seu controle. Aproxime-se de Rafa por outro lado e pressione E para tentar novamente. A professora não atravessará os móveis.');}}
    if(this.pendingPreparation&&this.marina.route?.status==='arrived'){
      this.pendingPreparation=false;this.mission.act('position');
    }
    const target=this.target();this.marker.setPosition(target.x,target.y-128+(this.config.settings.reducedMotion?0:Math.sin(_time/400)*4));this.marker.setVisible(!this.locked&&this.mission.phase!=='explore');
    if(!this.locked){const close=this.actors.find(a=>a!==this.teddy&&near(a,this.teddy));const object=this.objects.nearest(this.teddy,75);this.hud.setHint(close?`E · Conversar com ${close.id==='rafa'?'Rafa':close.id==='marina'?'Marina':close.id==='lia'?'Lia':close.label.text}`:object&&this.mission.phase==='explore'?`E · ${object.title}`:'');}
  }
  phaseChanged(){const p=this.mission.phase;this.hud.setObjective(objectives[p],['monitor','back','abdomen','reassess','recovery','complete'].includes(p));
    this.rafa.behavior=['cough','monitor'].includes(p)?'cough':['severe','help','call','position','back','abdomen'].includes(p)?'distress':['recovery','complete'].includes(p)?'recover':'normal';
    if(p==='cough'){this.lia.goTo({x:620,y:610});this.hud.show('Teddy, olha o Rafa!','Lia: Ele começou a tossir enquanto comia. Vamos ver como ele está.');this.audio.tone(620,.18);}
    if(p==='help'){this.teddy.animationState='concerned';this.locked=false;this.rig.follow(this.teddy);this.hud.show('Ele precisa de ajuda','Rafa não consegue falar nem tossir com força. Procure Marina: ela está perto da cantina.');}
    if(p==='call'){this.marina.goTo(CAFETERIA_MAP.staging.marina);this.locked=false;this.rig.follow(this.teddy);this.hud.show('Uma tarefa para Lia','Marina vai até Rafa. Encontre Lia e peça que chame o SAMU 192.');}
    if(p==='position'){this.hud.show('Ajuda acionada','Lia: Vou ligar 192 e dizer: escola, refeitório, adolescente consciente com engasgo grave. Vou informar o endereço e seguir as orientações. Volte até Rafa.');this.lia.animationState='interact';}
    if(p==='back'||p==='abdomen'){this.locked=true;this.hud.setHint('');this.rig.focus(this.rafa.x-50,this.rafa.y-15,this.focusZoom());showChokingProcedure(this.hud,this.mission);this.teddy.animationState='prepare_assist';}
    if(p==='reassess'){this.rafa.behavior='recover';this.hud.show('A respiração voltou','Nesta situação simulada, Rafa expulsou o objeto. Ele consegue respirar e falar. As manobras devem parar assim que a obstrução se resolve.',[{label:'Verificar respiração e resposta · E',action:'check'}]);}
    if(p==='recovery'){this.hud.show('Fique por perto','Rafa: Agora consigo respirar. Obrigado por ficar comigo. Marina: Vamos aguardar orientação do socorro e avaliação após as manobras.',[{label:'Acolher Rafa e concluir · E',action:'finish'}]);}
    if(p==='complete'){this.teddy.animationState='celebrate';this.teddy.animate(.1);this.hud.conclusion({title:'Cuidar começa por perceber.',summary:'Rafa voltou a respirar. A professora aguarda orientação do socorro.',items:['Reconheceu os sinais.','Incentivou a tosse eficaz.','Buscou ajuda e participou conforme sua modalidade.'],note:'Interrompa as manobras quando a obstrução se resolver. Se houver inconsciência, acione ajuda e siga o serviço de emergência. Bebês precisam de outra técnica.'});this.audio.tone(780,.5);const result=this.mission.result();this.emit({version:1,missionId:'choking',type:'educational-result',result});this.emit({version:1,missionId:'choking',type:'mission-completed',result});}
    if(p==='escalate'){this.locked=true;this.hud.show('Escalonar o atendimento','Se a vítima ficar inconsciente, interrompa esta sequência. Acione ou confirme o socorro e siga as instruções do atendente. A resposta à inconsciência não é treinada nesta missão. Reinicie pelo menu de pausa.');}
  }
  interact(){if(this.paused||this.mission.phase==='complete')return;const p=this.mission.phase;
    if(this.locked){const a:Action|undefined=p==='position'?'position':p==='monitor'?(this.mission.encouraged?'check':'encourage'):p==='back'||p==='abdomen'?'gesture':p==='reassess'?'check':p==='recovery'?'finish':undefined;if(a)this.perform(a);return;}
    if(p==='explore'){const actor=this.actors.find(a=>a!==this.teddy&&near(a,this.teddy));if(actor){this.mission.converse(actor.id);this.teddy.animationState='interact';this.open=true;this.hud.show(actor.label.text,actor===this.marina?'Marina: Estou por aqui se alguém precisar de ajuda. Conheça o refeitório e cuide de quem está ao seu lado.':actor===this.lia?'Lia: Oi! O Rafa está ali perto da mesa do meio. Hoje o refeitório está cheio.':'Que bom encontrar você! Observe as passagens livres entre as mesas.');}else{const object=this.objects.nearest(this.teddy,75);if(object){this.teddy.animationState='observe';this.open=true;this.hud.show(object.title,object.description);}}return;}
    if(!near(this.teddy,this.target(),120)){this.hud.setHint('Aproxime-se do personagem indicado pela seta.');return;}
    if(p==='cough'||p==='severe')this.perform('observe');else if(p==='help')this.perform('adult');else if(p==='call')this.perform('dispatch');else if(p==='position'){
      this.locked=true;this.rig.focus(this.rafa.x-50,this.rafa.y-15,this.focusZoom());this.hud.show('Prepare o atendimento',this.config.mode==='kids'?'Marina: Eu vou ajudar o Rafa. Fique perto, mantenha espaço livre e acompanhe comigo.':'Marina: Esta é uma simulação guiada. Vou orientar a posição. Na vida real, aja conforme seu treinamento e as orientações do socorro.',[{label:'Posicionar para a sequência · E',action:'position'}]);
      this.prepared=true;
    }
  }
  perform(a:Action){if(this.paused)return;const p=this.mission.phase;
    if(['observe','adult','dispatch','position'].includes(a)&&!near(this.teddy,this.target(),120))return;
    if(a==='position'&&p==='position'){
      if(this.pendingPreparation)return;
      if(!this.navigation.findPath(this.marina,CAFETERIA_MAP.staging.marina)){
        this.locked=false;this.rig.follow(this.teddy);this.hud.feedback('O acesso está bloqueado. Você pode se mover e tentar novamente perto de Rafa.');return;
      }
      this.teddy.route?.cancel();this.marina.goTo(CAFETERIA_MAP.staging.marina);this.pendingPreparation=true;this.preparationTime=0;this.locked=true;
      this.hud.feedback('Teddy fica ao lado de Rafa. Marina contorna os móveis e se aproxima para orientar o atendimento.');return;
    }
    const ok=this.mission.act(a);if(!ok){if(this.mission.feedback)this.hud.feedback(this.mission.feedback);return;}this.audio.unlock();this.audio.tone();
    if(a==='observe'&&p==='cough'){this.locked=true;this.rig.focus(this.rafa.x-50,this.rafa.y-15,this.focusZoom());this.teddy.animationState='observe';this.hud.show('A tosse tem som e força','Rafa consegue tossir e responder com a cabeça. Há passagem de ar. Incentive a tosse e acompanhe; não faça manobras físicas enquanto a tosse for eficaz.',[{label:'“Continue tossindo. Estou aqui.” · E',action:'encourage'}]);}
    if(a==='encourage')this.hud.show('Acompanhe os sinais','Você incentivou a tosse. Observe o peito, escute a tosse e veja se Rafa consegue responder. Nesta história, a situação vai piorar — isso não acontece em todos os engasgos.',[{label:'Observar novamente · E',action:'check'}]);
    if(a==='check'&&p==='monitor'){this.locked=false;this.rig.follow(this.teddy);this.hud.show('Algo mudou','A tosse perdeu a força. Rafa leva as mãos ao pescoço e não consegue falar. Aproxime-se e pressione E para reconhecer os novos sinais.');}
    if(a==='gesture'){const actor=this.config.mode==='kids'?this.marina:this.teddy;actor.playAssist();if(this.mission.phase===p)showChokingProcedure(this.hud,this.mission);this.hud.animateGesture(p==='back');}
    if(this.mission.feedback)this.hud.feedback(this.mission.feedback);
  }
}




