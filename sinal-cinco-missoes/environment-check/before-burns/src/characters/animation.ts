export type AnimationState = 'idle'|'walk'|'turn'|'interact'|'observe'|'concerned'|'prepare_assist'|'assist'|'celebrate';
const durations:Partial<Record<AnimationState,number>>={turn:.2,interact:.8,assist:.7,celebrate:2};
export class AnimationController {
  state:AnimationState='idle'; time=0; direction=4;
  set(state:AnimationState){if(state===this.state)return;this.state=state;this.time=0;}
  face(dx:number,dy:number){if(Math.hypot(dx,dy)<.01)return;const next=(Math.round(Math.atan2(dy,dx)/(Math.PI/4))+2+8)%8;if(next!==this.direction&&this.state==='idle')this.set('turn');this.direction=next;}
  update(dt:number,moving:boolean){if(moving)this.set('walk');else if(this.state==='walk')this.set('idle');this.time+=dt;const duration=durations[this.state];if(duration&&this.time>=duration)this.set('idle');}
  frame(){const count=this.state==='walk'?8:4,rate=this.state==='walk'?10:4;const index=Math.floor(this.time*rate+1e-7);return durations[this.state]?Math.min(count-1,index):index%count;}
}
