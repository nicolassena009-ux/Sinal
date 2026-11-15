import type { GameInput } from '../integration/contract';
import type {Conclusion,MissionPresentation} from '../core/mission';

import { normalize } from '../core/movement';
export class Hud {
  root: HTMLDivElement; stick={x:0,y:0}; panel: HTMLElement; objective: HTMLElement; hint: HTMLElement;
  paused=false; modal: HTMLElement; private abort=new AbortController(); private joystickId?:number; private gestureStart?: {x:number;y:number};
  constructor(parent:HTMLElement,public input:GameInput,private action:(a:string)=>void,public interact:()=>void,private pause:(p:boolean)=>void,private restart:()=>void,private exit:()=>void,private audio:(music:boolean,effects:boolean)=>void,private presentation:MissionPresentation={number:'—',title:'SINAL',place:''}) {
    this.root=document.createElement('div');this.root.className='sinal-hud';parent.append(this.root);
    this.root.innerHTML=`<header class="sinal-top"><div class="sinal-brand">sinal<span>✦</span></div><div class="sinal-mission"><small>MISSÃO ${presentation.number} <b>• ${input.mode.toUpperCase()}</b></small><strong>${presentation.title}</strong></div><button class="icon" data-pause aria-label="Pausar">Ⅱ</button></header><section class="sinal-objective"><span class="objective-dot"></span><div><small>SEU OBJETIVO</small><p></p></div></section><aside class="sinal-panel" aria-live="polite"></aside><div class="sinal-hint"></div><footer class="sinal-footer"><span>WASD / ↑↓←→ <b>MOVER</b>　 E / ESPAÇO <b>INTERAGIR</b></span><small>PROTÓTIPO ACADÊMICO • AVATAR PROVISÓRIO</small></footer><div class="sinal-touch"><div class="sinal-stick" aria-label="Joystick de movimento"><i></i></div><button class="sinal-interact" aria-label="Interagir">E<span>INTERAGIR</span></button></div><div class="sinal-modal" hidden></div><div class="sinal-rotate">↻ Para jogar melhor, gire o celular.</div>`;
    this.panel=this.root.querySelector('.sinal-panel')!;this.objective=this.root.querySelector('.sinal-objective p')!;this.hint=this.root.querySelector('.sinal-hint')!;this.modal=this.root.querySelector('.sinal-modal')!;
    this.root.style.setProperty('--text-scale',String(Math.max(.85,Math.min(1.3,input.settings.textScale))));
    this.root.querySelector('[data-pause]')!.addEventListener('click',()=>this.togglePause(),{signal:this.abort.signal});
    this.root.querySelector('.sinal-interact')!.addEventListener('click',()=>this.interact(),{signal:this.abort.signal});
    const stick=this.root.querySelector<HTMLElement>('.sinal-stick')!;const knob=stick.querySelector('i')!;
    const update=(e:PointerEvent)=>{const r=stick.getBoundingClientRect();this.stick=normalize((e.clientX-r.x-r.width/2)/45,(e.clientY-r.y-r.height/2)/45,.13);knob.style.transform=`translate(${this.stick.x*35}px,${this.stick.y*35}px)`;};
    stick.addEventListener('pointerdown',e=>{if(this.joystickId!==undefined)return;this.joystickId=e.pointerId;stick.setPointerCapture(e.pointerId);update(e);},{signal:this.abort.signal});
    stick.addEventListener('pointermove',e=>{if(e.pointerId===this.joystickId)update(e);},{signal:this.abort.signal});
    const reset=(event:Event)=>{if((event as PointerEvent).pointerId!==this.joystickId)return;this.joystickId=undefined;this.stick={x:0,y:0};knob.style.transform='';};
    for(const event of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(event,reset,{signal:this.abort.signal});
    this.panel.addEventListener('click',e=>{const b=(e.target as HTMLElement).closest<HTMLElement>('[data-action]');if(b&&!b.hasAttribute('disabled'))this.action(b.dataset.action!);},{signal:this.abort.signal});
    this.panel.addEventListener('pointerdown',e=>{const target=(e.target as HTMLElement).closest<HTMLElement>('[data-gesture]');if(!target)return;this.gestureStart={x:e.clientX,y:e.clientY};target.setPointerCapture(e.pointerId);},{signal:this.abort.signal});
    this.panel.addEventListener('pointerup',e=>{if(!this.gestureStart)return;const start=this.gestureStart;this.gestureStart=undefined;const target=(e.target as HTMLElement).closest<HTMLElement>('[data-gesture]');if(!target)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(target.dataset.gesture==='back'?dx>30&&Math.abs(dy)<80:dy< -30&&Math.abs(dx)<80)this.action('gesture');else this.feedback('Siga a seta com um movimento curto. Também pode usar o botão ou E.');},{signal:this.abort.signal});
  }
  setObjective(text:string,procedure=false){this.objective.textContent=text;this.root.classList.toggle('procedure',procedure);}
  setHint(message:string){this.hint.textContent=message;this.hint.hidden=!message;}
  feedback(message:string){let p=this.panel.querySelector('.sinal-feedback');if(!p){p=document.createElement('p');p.className='sinal-feedback';this.panel.append(p);}p.textContent=message;}
  close(){this.panel.innerHTML='';this.panel.classList.remove('open');}
  animateGesture(back:boolean){if(this.input.settings.reducedMotion)return;this.panel.querySelector('.assist-hand')?.animate([{transform:'translate(0,0)'},{transform:back?'translate(9px,0)':'translate(0,-9px)'},{transform:'translate(0,0)'}],{duration:650,easing:'ease-in-out'});}
  show(title:string,body:string,buttons:{label:string;action:string;disabled?:boolean}[]=[],extra='') {
    this.panel.classList.add('open');this.panel.innerHTML=`<small>OBSERVE • DECIDA • CUIDE</small><h2>${title}</h2><p>${body}</p>${extra}<div class="sinal-actions">${buttons.map(b=>`<button data-action="${b.action}" ${b.disabled?'disabled':''}>${b.label}</button>`).join('')}</div>`;
  }
  togglePause(){if(this.modal.dataset.complete==='true')return;this.paused=!this.paused;this.stick={x:0,y:0};this.pause(this.paused);this.modal.hidden=!this.paused;if(!this.paused)return;
    this.modal.innerHTML=`<div class="sinal-card"><small>UM RESPIRO</small><h2>Missão em pausa</h2><button data-resume>Continuar</button><label><input type="checkbox" data-music ${this.input.settings.music?'checked':''}> Música ambiente</label><label><input type="checkbox" data-effects ${this.input.settings.effects?'checked':''}> Efeitos sonoros</label><button data-full>Tela cheia</button><button data-restart>Reiniciar missão</button><button data-exit>Voltar ao Quartel-General</button></div>`;
    this.modal.querySelector('[data-resume]')!.addEventListener('click',()=>this.togglePause());this.modal.querySelector('[data-restart]')!.addEventListener('click',()=>this.restart());this.modal.querySelector('[data-exit]')!.addEventListener('click',()=>this.exit());
    this.modal.querySelector('[data-full]')!.addEventListener('click',()=>{void this.root.parentElement?.requestFullscreen?.().catch(()=>{});});
    this.modal.querySelectorAll('input').forEach(el=>el.addEventListener('change',()=>{this.input.settings.music=this.modal.querySelector<HTMLInputElement>('[data-music]')!.checked;this.input.settings.effects=this.modal.querySelector<HTMLInputElement>('[data-effects]')!.checked;this.audio(this.input.settings.music,this.input.settings.effects);}));
  }
  conclusion(result:Conclusion){this.modal.hidden=false;this.modal.dataset.complete='true';this.modal.innerHTML=`<div class="sinal-card result"><small>MISSÃO ${this.presentation.number} • CONCLUÍDA</small><div class="sinal-medal">✦</div><h2>${result.title}</h2><p>${result.summary}</p><ul>${result.items.map(item=>`<li>${item}</li>`).join('')}</ul><p class="sinal-note">${result.note}</p><small>Arte provisória e revisão clínica pendente. Não substitui treinamento supervisionado.</small><button data-repeat>Jogar novamente</button><button data-exit>Voltar ao Quartel-General →</button></div>`;this.modal.querySelector('[data-repeat]')!.addEventListener('click',()=>this.restart());this.modal.querySelector('[data-exit]')!.addEventListener('click',()=>this.exit());}
  destroy(){this.abort.abort();this.root.remove();}
}


