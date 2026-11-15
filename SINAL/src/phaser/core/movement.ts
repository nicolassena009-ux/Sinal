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

function isInside(p: Vec, r: Rect, radius: number): boolean {
  return p.x + radius > r.x && p.x - radius < r.x + r.w && p.y + radius > r.y && p.y - radius < r.y + r.h;
}

/** Verifica se um passo de movimento unidimensional é permitido, garantindo escape irrestrito se sobreposto. */
function isAxisStepAllowed(fromPos: number, toPos: number, otherAxis: number, isX: boolean, rects: Rect[], radius: number): boolean {
  for (const r of rects) {
    const toP: Vec = isX ? { x: toPos, y: otherAxis } : { x: otherAxis, y: toPos };
    const toIn = isInside(toP, r, radius);
    if (!toIn) continue;

    const fromP: Vec = isX ? { x: fromPos, y: otherAxis } : { x: otherAxis, y: fromPos };
    const fromIn = isInside(fromP, r, radius);
    if (!fromIn) {
      // Entrando em sólido a partir do exterior: bloqueado
      return false;
    }

    // Já sobreposto ao retângulo r: o movimento dentro de r é permitido para que
    // o jogador possa navegar livremente em direção a qualquer borda de saída.
    // A entrada em qualquer OUTRO obstáculo que não o continha continuará
    // estritamente bloqueada pelo teste (!fromIn) quando esse outro obstáculo for avaliado.
  }
  return true;
}

export function move(p: Vec, velocity: Vec, delta: number, rects: Rect[],bounds:Bounds): Vec {
  const dt = Math.min(delta, 0.05);
  return moveBy(p, { x: velocity.x * 215 * dt, y: velocity.y * 215 * dt }, rects,bounds);
}

/** Desloca com segurança um ponto sobreposto para a posição livre mais próxima. */
export function resolveOverlap(p: Vec, rects: Rect[], bounds: Bounds, radius = 14, maxDisplacement = 160): Vec {
  const overlaps = rects.filter(r => isInside(p, r, radius));
  if (!overlaps.length) return p;

  let best: Vec = { x: p.x, y: p.y };
  let minCost = Infinity;

  // 1ª passada: projeções cardinais e diagonais com margem de segurança de 2px
  for (const r of overlaps) {
    const leftX = r.x - radius - 2;
    const rightX = r.x + r.w + radius + 2;
    const topY = r.y - radius - 2;
    const bottomY = r.y + r.h + radius + 2;

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
      if (blocked(c, rects, radius)) continue;
      const d = Math.hypot(c.x - p.x, c.y - p.y);
      if (d < minCost && d <= maxDisplacement) {
        minCost = d;
        best = c;
      }
    }
  }

  // 2ª passada: busca radial externa caso cantos ou outros sólidos bloqueiem projeções simples
  if (minCost === Infinity) {
    for (let dist = 8; dist <= maxDisplacement; dist += 8) {
      const samples = Math.max(8, dist);
      for (let i = 0; i < samples; i++) {
        const ang = (i / samples) * Math.PI * 2;
        const c = {
          x: Math.max(bounds.left, Math.min(bounds.right, p.x + Math.cos(ang) * dist)),
          y: Math.max(bounds.top, Math.min(bounds.bottom, p.y + Math.sin(ang) * dist))
        };
        if (!blocked(c, rects, radius)) {
          return c;
        }
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
      const outsideRects = rects.filter(r => !isInside(next, r, radius));
      if (outsideRects.some(r => isInside(target, r, radius)) || segmentBlocked(next, target, outsideRects, radius)) {
        break;
      }
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
