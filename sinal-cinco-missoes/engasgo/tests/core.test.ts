import {CAFETERIA_MAP} from '../src/world/cafeteriaMap';
import {describe,it,expect} from 'vitest';
import {move,near,normalize,blocked} from '../src/core/movement';
import {ChokingMission} from '../src/missions/choking';
import {defaults,validateInput} from '../src/integration/contract';
import {AnimationController} from '../src/characters/animation';
import {InteractionSystem} from '../src/core/interactions';
describe('animações e interações reutilizáveis',()=>{
 it('seleciona oito direções e encerra animações não repetitivas',()=>{const a=new AnimationController();a.face(1,0);expect(a.direction).toBe(2);expect(a.state).toBe('turn');a.update(.3,false);expect(a.state).toBe('idle');a.set('celebrate');a.update(2.1,false);expect(a.state).toBe('idle');});
 it('reprodução depende do tempo e movimento real',()=>{const a=new AnimationController(),b=new AnimationController();for(let i=0;i<30;i++)a.update(1/30,true);for(let i=0;i<60;i++)b.update(1/60,true);expect(a.frame()).toBe(b.frame());a.update(.01,false);expect(a.state).toBe('idle');});
 it('encontra somente objetos dentro do alcance',()=>{const s=new InteractionSystem([{id:'a',x:20,y:30,title:'A',description:''},{id:'b',x:60,y:30,title:'B',description:''}]);expect(s.nearest({x:0,y:30})?.id).toBe('a');expect(s.nearest({x:300,y:30})).toBeUndefined();});
});
describe('movimento e colisões',()=>{
 it('normaliza diagonais sem ganho de velocidade',()=>{expect(Math.hypot(...Object.values(normalize(1,1)))).toBeCloseTo(1);});
 it('joystick conserva velocidade analógica e zona morta',()=>{expect(normalize(.05,0,.13)).toEqual({x:0,y:0});expect(normalize(.6,0,.13).x).toBeCloseTo(.47/.87);});
 it('colide nos pés e permite deslizar no outro eixo',()=>{const walls=[{x:100,y:280,w:60,h:60}];expect(move({x:85,y:300},{x:1,y:1},.05,walls,CAFETERIA_MAP.bounds)).toEqual({x:85,y:310.75});expect(blocked({x:120,y:300},walls)).toBe(true);});
 it('limita delta e limites do mundo',()=>{expect(move({x:1550,y:1039},{x:1,y:1},1,[],CAFETERIA_MAP.bounds)).toEqual({x:1555,y:1040});});
 it('interação depende de proximidade',()=>{expect(near({x:0,y:0},{x:80,y:50})).toBe(true);expect(near({x:0,y:0},{x:120,y:50})).toBe(false);});
});
function advance(m:ChokingMission){m.explore(230);m.tick(4);m.act('observe');m.act('encourage');m.act('check');m.act('observe');m.act('adult');m.act('dispatch');m.act('position');}
describe('missão e procedimentos',()=>{
 it('não dispara só pela passagem do tempo',()=>{const m=new ChokingMission('kids');m.tick(60);expect(m.phase).toBe('explore');m.converse('lia');m.tick(.1);expect(m.phase).toBe('cough');});
 it('exploração ativa dispara após intervalo breve, nunca instantaneamente',()=>{const m=new ChokingMission('teens');m.explore(230);m.tick(3);expect(m.phase).toBe('explore');m.tick(1);expect(m.phase).toBe('cough');});
 it.each(['kids','teens'] as const)('conclui %s com eventos únicos e dez ações',mode=>{const events:string[]=[];const m=new ChokingMission(mode,id=>events.push(id));advance(m);expect(m.phase).toBe('back');for(let i=0;i<5;i++){m.tick(1.3);expect(m.act('gesture')).toBe(true);}expect(m.phase).toBe('abdomen');for(let i=0;i<5;i++){m.tick(1.3);m.act('gesture');}expect(m.phase).toBe('reassess');m.act('check');m.act('finish');expect(m.phase).toBe('complete');expect(events).toHaveLength(6);expect(new Set(events).size).toBe(events.length);expect(m.result().mode).toBe(mode);});
 it('não permite manobras na tosse eficaz nem pular ajuda',()=>{const m=new ChokingMission('teens');m.explore(230);m.tick(4);m.act('observe');expect(m.act('gesture')).toBe(false);expect(m.act('check')).toBe(false);expect(m.phase).toBe('monitor');expect(m.act('dispatch')).toBe(false);});
 it('ações apressadas não progridem',()=>{const m=new ChokingMission('teens');advance(m);m.act('gesture');expect(m.act('gesture')).toBe(false);expect(m.count).toBe(1);});
 it('corrige ações inadequadas sem avançar',()=>{const m=new ChokingMission('kids');expect(m.act('water')).toBe(false);expect(m.act('sweep')).toBe(false);expect(m.corrections).toBe(2);expect(m.phase).toBe('explore');});
 it('inconsciência interrompe o procedimento',()=>{const m=new ChokingMission('teens');advance(m);m.act('unresponsive');expect(m.phase).toBe('escalate');expect(m.act('gesture')).toBe(false);});
 it('contrato rejeita versões desconhecidas',()=>{const input=defaults();expect(()=>validateInput(input)).not.toThrow();expect(()=>validateInput({...input,version:2 as 1})).toThrow();});
});



