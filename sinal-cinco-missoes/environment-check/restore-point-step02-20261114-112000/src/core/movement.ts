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

function axisPenetration(pos: number, start: number, size: number, radius: number): number {
  const min = start - radius;
  const max = start + size + radius;
  if (pos <= min || pos >= max) return 0;
  return Math.min(pos - min, max - pos);
}

function isInside(p: Vec, r: Rect, radius: number): boolean {
  return p.x + radius > r.x && p.x - radius < r.x + r.w && p.y + radius > r.y && p.y - radius < r.y + r.h;
}

/** Verifica se um passo de movimento unidimensional é permitido, concedendo escape se já sobreposto. */
function isAxisStepAllowed(fromPos: number, toPos: number, otherAxis: number, isX: boolean, rects: Rect[], radius: number): boolean {
  for (const r of rects) {
    const fromP: Vec = isX ? { x: fromPos, y: otherAxis } : { x: otherAxis, y: fromPos };
    const toP: Vec = isX ? { x: toPos, y: otherAxis } : { x: otherAxis, y: toPos };

    const toIn = isInside(toP, r, radius);
    if (!toIn) continue;

    const fromIn = isInside(fromP, r, radius);
    if (!fromIn) {
      // Entrando em sólido a partir do exterior: bloqueado
      return false;
    }

    // Já sobreposto: permite mover se reduz ou mantém a penetração no eixo
    const start = isX ? r.x : r.y;
    const size = isX ? r.w : r.h;
    const fromPen = axisPenetration(fromPos, start, size, radius);
    const toPen = axisPenetration(toPos, start, size, radius);

    if (toPen > fromPen + 1e-4) {
      // Aprofundando ainda mais na colisão
      return false;
    }
  }
  return true;
}

export function move(p: Vec, velocity: Vec, delta: number, rects: Rect[],bounds:Bounds): Vec {
  const dt = Math.min(delta, 0.05);
  return moveBy(p, { x: velocity.x * 215 * dt, y: velocity.y * 215 * dt }, rects,bounds);
}

/** Desloca suavemente um ponto sobreposto para a borda livre mais próxima. */
export function resolveOverlap(p: Vec, rects: Rect[], bounds: Bounds, radius = 14, maxDisplacement = 120): Vec {
  const overlaps = rects.filter(r => isInside(p, r, radius));
  if (!overlaps.length) return p;

  let best: Vec = { x: p.x, y: p.y };
  let minCost = Infinity;

  for (const r of overlaps) {
    const leftX = r.x - radius;
    const rightX = r.x + r.w + radius;
    const topY = r.y - radius;
    const bottomY = r.y + r.h + radius;

    const candidates: Vec[] = [
      { x: leftX, y: p.y },
      { x: rightX, y: p.y },
      { x: p.x, y: topY },
      { x: p.x, y: bottomY },
      { x: leftX, y: topY },
      { x: rightX, y: topY },
      { x: leftX, y: bottomY },
      { x: rightX, y: bottomY }
    ];

    for (const c of candidates) {
      if (c.x < bounds.left || c.x > bounds.right || c.y < bounds.top || c.y > bounds.bottom) continue;
      const otherRects = rects.filter(o => o !== r);
      if (blocked(c, otherRects, radius)) continue;
      const d = Math.hypot(c.x - p.x, c.y - p.y);
      if (d < minCost && d <= maxDisplacement) {
        minCost = d;
        best = c;
      }
    }
  }

  return best;
}

/** Swept substeps prevent thin-obstacle tunnelling; separate axes retain sliding. */
export function moveBy(p: Vec, displacement: Vec, rects: Rect[], bounds:Bounds,radius=14, slide=true): Vec {
  const next = { x: p.x, y: p.y };
  const steps = Math.max(1, Math.ceil(Math.hypot(displacement.x, displacement.y) / 4));
  for (let i=0;i<steps;i++) {
    if(!slide){
      const target={x:next.x+displacement.x/steps,y:next.y+displacement.y/steps};
      if(target.x<bounds.left||target.x>bounds.right||target.y<bounds.top||target.y>bounds.bottom) break;
      const stepBlocked = rects.some(r => {
        if (!isInside(target, r, radius)) return false;
        if (!isInside(next, r, radius)) return true;
        const fromDistSq = (next.x - (r.x + r.w/2))**2 + (next.y - (r.y + r.h/2))**2;
        const toDistSq = (target.x - (r.x + r.w/2))**2 + (target.y - (r.y + r.h/2))**2;
        return toDistSq < fromDistSq - 1e-4;
      });
      if(stepBlocked || (!isInside(next, rects[0] ?? {x:0,y:0,w:0,h:0}, radius) && segmentBlocked(next,target,rects,radius))) break;
      next.x=target.x;next.y=target.y;continue;
    }
    const x=Math.max(bounds.left,Math.min(bounds.right,next.x+displacement.x/steps));
    if(isAxisStepAllowed(next.x, x, next.y, true, rects, radius)) next.x=x;

    const y=Math.max(bounds.top,Math.min(bounds.bottom,next.y+displacement.y/steps));
    if(isAxisStepAllowed(next.y, y, next.x, false, rects, radius)) next.y=y;
  }
  return next;
}
export const near = (a: Vec, b: Vec, range = 105) => Math.hypot(a.x - b.x, a.y - b.y) <= range;

