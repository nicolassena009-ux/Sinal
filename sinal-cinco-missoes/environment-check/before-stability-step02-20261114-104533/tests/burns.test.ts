import {describe,it,expect} from 'vitest';
import {BurnsMission} from '../src/missions/burns';

describe('BurnsMission',()=>{
 it('rejects skipped stages and premature results',()=>{
  const m=new BurnsMission('kids');
  expect(m.act('requestMedicalHelp')).toBe(false);
  expect(m.act('openTap')).toBe(false);
  expect(()=>m.result()).toThrow();
  m.tick(100);expect(m.phase).toBe('explore');
 });
 it('requires arrival, running water, full simulated cooling and medical help',()=>{
  const events:string[]=[];const m=new BurnsMission('teens',id=>events.push(id));
  for(const action of ['notice','incidentFinished','recognize','adultSecuredHeat','arrivedAtSink'] as const)expect(m.act(action)).toBe(true);
  expect(m.heatSecured).toBe(true);m.tick(20);expect(m.simulatedCoolingSeconds).toBe(0);
  expect(m.act('openTap')).toBe(true);expect(m.act('openTap')).toBe(false);
  m.tick(19);expect(m.phase).toBe('cooling');expect(m.act('cover')).toBe(false);
  m.tick(1);expect(m.phase).toBe('protection');expect(m.waterRunning).toBe(false);
  expect(m.act('cover')).toBe(true);expect(m.act('requestMedicalHelp')).toBe(true);
  expect(m.act('requestMedicalHelp')).toBe(false);expect(new Set(events).size).toBe(events.length);
  expect(m.result().clinicalReview).toBe('pending');const elapsed=m.elapsed;m.tick(10);expect(m.elapsed).toBe(elapsed);
 });
 it('ignores invalid time increments',()=>{
  const m=new BurnsMission('kids');for(const dt of [-1,NaN,Infinity])m.tick(dt);expect(m.elapsed).toBe(0);
 });
});
