export interface Vec { x: number; y: number }
export interface Rect extends Vec { w: number; h: number }
export interface Bounds {left:number;right:number;top:number;bottom:number}
export function normalize(x: number, y: number, deadzone = 0): Vec {
  const length = Math.hypot(x, y);
  if (length <= deadzone) return { x: 0, y: 0 };
  const magnitude = Math.min(1, (length - deadzone) / (1 - deadzone));
  return { x: x / length * magnitude, y: y / length * magnitude };
}
export function blocked(p: Vec, rects: Rect[], radius = 14) {
  return rects.some(r => p.x + radius > r.x && p.x - radius < r.x + r.w && p.y + radius > r.y && p.y - radius < r.y + r.h);
}
/** Continuous slab intersection against expanded footprints; tangential contact is permitted. */
export function segmentBlocked(a:Vec,b:Vec,rects:Rect[],radius=14){
  const epsilon=1e-6;
  return rects.some(r=>{
    let enter=0,exit=1;
    for(const [start,delta,min,max]of [[a.x,b.x-a.x,r.x-radius+epsilon,r.x+r.w+radius-epsilon],[a.y,b.y-a.y,r.y-radius+epsilon,r.y+r.h+radius-epsilon]]){
      if(Math.abs(delta)<epsilon){if(start<=min||start>=max)return false;continue;}
      const t1=(min-start)/delta,t2=(max-start)/delta;enter=Math.max(enter,Math.min(t1,t2));exit=Math.min(exit,Math.max(t1,t2));
      if(enter>=exit)return false;
    }
    return exit>enter;
  });
}
export function move(p: Vec, velocity: Vec, delta: number, rects: Rect[],bounds:Bounds): Vec {
  const dt = Math.min(delta, 0.05);
  return moveBy(p, { x: velocity.x * 215 * dt, y: velocity.y * 215 * dt }, rects,bounds);
}
/** Swept substeps prevent thin-obstacle tunnelling; separate axes retain sliding. */
export function moveBy(p: Vec, displacement: Vec, rects: Rect[], bounds:Bounds,radius=14, slide=true): Vec {
  const next = { x: p.x, y: p.y };
  const steps = Math.max(1, Math.ceil(Math.hypot(displacement.x, displacement.y) / 4));
  for (let i=0;i<steps;i++) {
    if(!slide){
      const target={x:next.x+displacement.x/steps,y:next.y+displacement.y/steps};
      if(target.x<bounds.left||target.x>bounds.right||target.y<bounds.top||target.y>bounds.bottom||blocked(target,rects,radius)||segmentBlocked(next,target,rects,radius))break;
      next.x=target.x;next.y=target.y;continue;
    }
    const x=Math.max(bounds.left,Math.min(bounds.right,next.x+displacement.x/steps));
    if(!blocked({x,y:next.y},rects,radius))next.x=x;
    const y=Math.max(bounds.top,Math.min(bounds.bottom,next.y+displacement.y/steps));
    if(!blocked({x:next.x,y},rects,radius))next.y=y;
  }
  return next;
}
export const near = (a: Vec, b: Vec, range = 105) => Math.hypot(a.x - b.x, a.y - b.y) <= range;

