import type { EducationalResult, Mode } from '../integration/contract';
export type Phase = 'explore' | 'cough' | 'monitor' | 'severe' | 'help' | 'call' | 'position' | 'back' | 'abdomen' | 'reassess' | 'recovery' | 'complete' | 'escalate';
export type Action = 'observe' | 'encourage' | 'check' | 'adult' | 'dispatch' | 'position' | 'gesture' | 'finish' | 'water' | 'sweep' | 'unresponsive';
export const objectives: Record<Phase, string> = {
  explore: 'Conheça o refeitório. Converse com Lia e encontre a professora.', cough: 'Rafa está tossindo. Aproxime-se e observe.',
  monitor: 'Incentive a tosse e acompanhe a respiração de Rafa.', severe: 'Os sinais mudaram. Observe Rafa novamente.',
  help: 'Peça ajuda à professora Marina.', call: 'Peça a Lia para acionar o SAMU 192.', position: 'Volte até Rafa e prepare o atendimento.',
  back: 'Acompanhe cinco golpes nas costas.', abdomen: 'Acompanhe cinco compressões abdominais.',
  reassess: 'Pare e verifique se a obstrução foi resolvida.', recovery: 'Fique com Rafa até a chegada do socorro.', complete: 'Missão concluída.', escalate: 'Interrompa esta sequência. O socorro assume o atendimento.'
};
export class ChokingMission {
  phase: Phase = 'explore'; count = 0; cycles = 0; elapsed = 0; phaseTime = 0; corrections = 0;
  encouraged = false; checked = false; completed: string[] = []; lastGesture = -99;
  private explored=0; private conversations=new Set<string>();
  explore(distance:number){if(this.phase==='explore')this.explored+=Math.max(0,distance);}
  converse(id:string){if(this.phase==='explore')this.conversations.add(id);}
  feedback = ''; constructor(public mode: Mode, public onObjective: (id: string) => void = () => {}) {}
  transition(phase: Phase) { this.phase = phase; this.phaseTime = 0; this.count = 0; this.feedback = ''; }
  tick(dt: number) { this.elapsed += dt; this.phaseTime += dt; if (this.phase === 'explore' && this.phaseTime >= 4 && (this.conversations.size>0 || this.explored>=220)) this.transition('cough'); }
  goal(id: string) { if (!this.completed.includes(id)) { this.completed.push(id); this.onObjective(id); } }
  act(action: Action): boolean {
    if (action === 'water' || action === 'sweep') { this.corrections++; this.feedback = action === 'water' ? 'Água não resolve o engasgo. Observe a respiração e peça ajuda.' : 'Não introduza os dedos às cegas na boca.'; return false; }
    if (action === 'unresponsive' && ['position','back','abdomen','reassess'].includes(this.phase)) { this.transition('escalate'); return true; }
    if (this.phase === 'cough' && action === 'observe') { this.transition('monitor'); return true; }
    if (this.phase === 'monitor') {
      if (action === 'encourage') { this.encouraged = true; this.feedback = 'Teddy: Continue tossindo, Rafa. Estou aqui com você.'; return true; }
      if (action === 'check' && this.encouraged) { this.checked = true; this.goal('effective-cough'); this.transition('severe'); return true; }
    }
    if (this.phase === 'severe' && action === 'observe') { this.goal('severe-signs'); this.transition('help'); return true; }
    if (this.phase === 'help' && action === 'adult') { this.goal('adult-help'); this.transition('call'); return true; }
    if (this.phase === 'call' && action === 'dispatch') { this.goal('emergency-call'); this.transition('position'); return true; }
    if (this.phase === 'position' && action === 'position') { this.transition('back'); return true; }
    if ((this.phase==='back'||this.phase==='abdomen')&&action==='check'){this.feedback='Neste momento da história, Rafa ainda não consegue falar ou respirar normalmente. Continue a sequência guiada. Na vida real, pare assim que a obstrução se resolver.';return true;}
    if ((this.phase === 'back' || this.phase === 'abdomen') && action === 'gesture') {
      if (this.elapsed - this.lastGesture < 1.2) { this.feedback = 'Uma ação por vez. Aguarde a animação; não é uma corrida.'; return false; }
      this.lastGesture = this.elapsed; this.count++; this.feedback = `${this.count} de 5 • observe a vítima`;
      if (this.count === 5) { if (this.phase === 'back') this.transition('abdomen'); else { this.cycles++; this.transition('reassess'); } }
      return true;
    }
    if (this.phase === 'reassess' && action === 'check') { this.goal('guided-assistance'); this.transition('recovery'); return true; }
    if (this.phase === 'recovery' && action === 'finish') { this.goal('recovery-support'); this.transition('complete'); return true; }
    return false;
  }
  result(): EducationalResult { return { mode: this.mode, objectives: [...this.completed], corrections: this.corrections, durationSeconds: Math.round(this.elapsed), clinicalReview: 'pending' }; }
}
