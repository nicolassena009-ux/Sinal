import Phaser from 'phaser';
import {SceneRegistry} from './scenes/registry';
import {validateInput,type EventSink,type GameInput} from './integration/contract';
import './style.css';
export interface GameHandle {destroy():void}
export function mountGame(container:HTMLElement,input:GameInput,onEvent:EventSink):GameHandle{
 validateInput(input);input={...input,settings:{...input.settings},avatar:{...input.avatar,accessories:[...input.avatar.accessories]},progress:{completedObjectives:[...input.progress.completedObjectives]}};const host=document.createElement('div');host.className='sinal-game';container.append(host);
 let game:Phaser.Game|undefined;let destroyed=false;let generation=0;
 const emit:EventSink=e=>{if(!destroyed)onEvent(e);};
 const start=async()=>{const token=++generation;try{const Scene=await SceneRegistry[input.missionId]();if(destroyed||token!==generation)return;
 game=new Phaser.Game({type:Phaser.AUTO,parent:host,width:host.clientWidth,height:host.clientHeight,backgroundColor:'#efd199',pixelArt:true,antialias:false,roundPixels:true,scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},input:{activePointers:3,keyboard:{capture:[]}},render:{powerPreference:'default'},fps:{target:60,smoothStep:true},scene:[new Scene(host,input,emit,restart,()=>emit({version:1,missionId:input.missionId,type:'return-menu'}))]});
 }catch(error){emit({version:1,missionId:input.missionId,type:'recoverable-error',message:String(error)});}};
 // Phaser destruction emits DESTROY, not SHUTDOWN. Stop scenes first so their
 // resource cleanup runs on restart and unmount, including Web Audio and DOM handlers.
 const dispose=(instance:Phaser.Game)=>{for(const scene of instance.scene.getScenes(false))instance.scene.stop(scene);instance.destroy(true);};
 const restart=()=>{if(!game||destroyed)return;const old=game;game=undefined;old.events.once('destroy',()=>{if(destroyed)return;host.replaceChildren();void start();});dispose(old);};
 const observer=new ResizeObserver(()=>{if(host.clientWidth&&host.clientHeight)game?.scale.resize(host.clientWidth,host.clientHeight);});observer.observe(host);void start();
 return {destroy(){if(destroyed)return;destroyed=true;generation++;observer.disconnect();if(game)dispose(game);host.remove();if(import.meta.env.DEV)delete (window as unknown as {sinalTest?:unknown}).sinalTest;}};
}
