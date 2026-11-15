import {it,expect} from 'vitest';
import {TraumaMission,withinReach,bikeFootprint} from '../src/missions/trauma';
it('só inicia cuidado após avaliação e kit',()=>{const m=new TraumaMission();for(const p of ['explore','bicycleAccident','secureScene'] as const)expect(m.advance(p)).toBe(true);expect(m.advance('initialAssessment')).toBe(false);m.safe=true;m.advance('initialAssessment');expect(m.advance('fetchKit')).toBe(false);m.hasKit=true;m.advance('fetchKit');m.advance('woundCare');m.advance('comfort');expect(m.phase).toBe('complete');expect(m.advance('comfort')).toBe(false);});
it('alcance inclusivo de perto até a borda',()=>{for(const x of [1,67,135])expect(withinReach({x:0,y:0},{x,y:0})).toBe(true);expect(withinReach({x:0,y:0},{x:136,y:0})).toBe(false);});
it('bicicleta caída ocupa outra área',()=>expect(bikeFootprint({x:90,y:100},true).w).toBeGreaterThan(bikeFootprint({x:90,y:100},false).w));
