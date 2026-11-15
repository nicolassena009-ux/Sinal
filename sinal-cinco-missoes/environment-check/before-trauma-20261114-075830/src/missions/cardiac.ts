export class CardiacMission {
  phase='explore';
  stage='closed';
  elapsed=0;
  called=false;
  carrying=false;
  delivered=false;
  rhythm=false;
  recognized=false;
  compressing=false;
  beats=0;
  lastTap?:number;
  completed:string[]=[];
  constructor(readonly shockable:boolean,private notify:(id:string)=>void=()=>{}){}
  objective(id:string){if(!this.completed.includes(id)){this.completed.push(id);this.notify(id);}}
  collapse(){if(this.phase==='explore')this.phase='collapse';}
  assess(){if(this.phase==='collapse')this.phase='recognize';}
  respond(){if(this.phase!=='recognize')return;this.recognized=true;this.compressing=true;this.phase='emergencyResponse';this.objective('recognize');}
  call(){if(this.recognized&&!this.called){this.called=true;this.objective('dispatch');}}
  pickup(){if(this.recognized&&!this.delivered){this.carrying=true;}}
  deliver(){if(this.carrying){this.delivered=true;this.carrying=false;this.objective('retrieveAED');}}
  tap(){const previous=this.lastTap;this.lastTap=this.elapsed;if(previous===undefined)return 'Marque o próximo retorno.';const interval=this.elapsed-previous;if(interval<.49||interval>.61){this.beats=0;return interval<.49?'Diminua o ritmo.':'Acompanhe o pulso visual.';}if(++this.beats>=3)this.observe();return 'Ritmo adequado.';}
  observe(){if(this.compressing){this.rhythm=true;this.objective('rhythm');}}
  advance(clear:boolean){if(!this.delivered||!this.recognized)return false;
    if(this.stage==='closed'){this.stage='open';this.phase='aed';}
    else if(this.stage==='open')this.stage='on';
    else if(this.stage==='on')this.stage='pads';
    else if(this.stage==='pads'&&clear){this.stage='analysis';this.compressing=false;}
    else return false;return true;
  }
  analyzed(clear:boolean){if(this.stage==='analysis'&&clear){if(this.shockable)this.stage='shockAdvised';else this.resume();}}
  shock(clear:boolean){if(this.stage!=='shockAdvised'||!this.shockable||!clear)return false;this.resume();return true;}
  private resume(){this.stage='done';this.compressing=true;this.phase='continueCPR';this.objective('aed');}
  handoff(){if(this.called&&this.rhythm&&this.phase==='continueCPR'){this.phase='handoff';this.compressing=false;this.objective('handoff');return true;}return false;}
}
