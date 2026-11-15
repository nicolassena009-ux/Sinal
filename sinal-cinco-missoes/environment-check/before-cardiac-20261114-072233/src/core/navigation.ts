import { blocked, segmentBlocked, moveBy, type Bounds, type Rect, type Vec } from './movement';

const distance = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

/** World-space A*: the same foot clearance and solids used by player movement. */
export class NavigationGrid {
  readonly cell = 20;
  constructor(public obstacles: Rect[], public bounds:Bounds, public radius = 14) {}

  walkable(p: Vec) {
    return p.x >= this.bounds.left && p.x <= this.bounds.right &&
      p.y >= this.bounds.top && p.y <= this.bounds.bottom && !blocked(p, this.obstacles, this.radius);
  }

  segmentClear(a: Vec, b: Vec) {
    return this.walkable(a)&&this.walkable(b)&&!segmentBlocked(a,b,this.obstacles,this.radius);
  }

  findPath(start: Vec, goal: Vec): Vec[] | null {
    if (!this.walkable(start) || !this.walkable(goal)) return null;
    if (this.segmentClear(start, goal)) return [{ ...goal }];
    const cols = Math.floor((this.bounds.right - this.bounds.left) / this.cell) + 1;
    const rows = Math.floor((this.bounds.bottom - this.bounds.top) / this.cell) + 1;
    const point = (id: number): Vec => ({ x: this.bounds.left + id % cols * this.cell, y: this.bounds.top + Math.floor(id / cols) * this.cell });
    const cache = new Map<number, boolean>();
    const free = (id: number) => { if (!cache.has(id)) cache.set(id, this.walkable(point(id))); return cache.get(id)!; };
    // Endpoints connect only through verified free segments, never by snapping through furniture.
    const connect = (p: Vec) => {
      const candidates: number[] = [];
      const cx = Math.round((p.x - this.bounds.left) / this.cell), cy = Math.round((p.y - this.bounds.top) / this.cell);
      for (let y = Math.max(0, cy - 3); y <= Math.min(rows - 1, cy + 3); y++) {
        for (let x = Math.max(0, cx - 3); x <= Math.min(cols - 1, cx + 3); x++) {
          const id = y * cols + x;
          if (free(id) && this.segmentClear(p, point(id))) candidates.push(id);
        }
      }
      return candidates.sort((a, b) => distance(p, point(a)) - distance(p, point(b)))[0];
    };
    const first = connect(start), last = connect(goal);
    if (first === undefined || last === undefined) return null;
    const open = new Set([first]), closed = new Set<number>(), previous = new Map<number, number>();
    const costs = new Map([[first, 0]]), scores = new Map([[first, distance(point(first), point(last))]]);
    while (open.size) {
      let current = -1, best = Infinity;
      for (const id of open) if (scores.get(id)! < best) { best = scores.get(id)!; current = id; }
      if (current === last) {
        const route: Vec[] = [goal, point(current)];
        while (previous.has(current)) { current = previous.get(current)!; route.push(point(current)); }
        route.push(start); route.reverse();
        const smooth: Vec[] = []; let anchor = 0;
        while (anchor < route.length - 1) {
          let next = route.length - 1;
          while (next > anchor + 1 && !this.segmentClear(route[anchor], route[next])) next--;
          smooth.push(route[next]); anchor = next;
        }
        return smooth;
      }
      open.delete(current); closed.add(current);
      const cx = current % cols, cy = Math.floor(current / cols);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const x = cx + dx, y = cy + dy;
        if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
        const id = y * cols + x;
        if (closed.has(id) || !free(id)) continue;
        if (dx && dy && (!free(cy * cols + x) || !free(y * cols + cx))) continue;
        if (!this.segmentClear(point(current), point(id))) continue;
        const cost = costs.get(current)! + this.cell * Math.hypot(dx, dy);
        if (cost >= (costs.get(id) ?? Infinity)) continue;
        previous.set(id, current); costs.set(id, cost); scores.set(id, cost + distance(point(id), point(last))); open.add(id);
      }
    }
    return null;
  }
}

export class RouteFollower {
  path: Vec[] = []; goal?: Vec; status: 'idle'|'moving'|'arrived'|'blocked' = 'idle';
  private retry = 0;
  constructor(public grid: NavigationGrid, public speed = 125) {}
  request(from: Vec, goal: Vec) {
    const path = this.grid.findPath(from, goal);
    if (!path) { this.path = []; this.goal = { ...goal }; this.status = 'blocked'; this.retry = .4; return false; }
    this.path = path; this.goal = { ...goal }; this.status = 'moving'; return true;
  }
  cancel() { this.path = []; this.goal = undefined; this.status = 'idle'; }
  update(from: Vec, delta: number): Vec {
    let p = { x: from.x, y: from.y };
    if (this.status === 'blocked' && this.goal) {
      this.retry -= delta;
      if (this.retry <= 0) { this.retry = .4; this.request(p, this.goal); }
    }
    if (this.status !== 'moving') return p;
    let budget = this.speed * Math.min(delta, .1);
    while (budget > 0 && this.path.length) {
      const target = this.path[0], d = distance(p, target);
      if (d < .01) { this.path.shift(); continue; }
      if (!this.grid.segmentClear(p, target)) {
        this.status = 'blocked'; this.path = []; this.retry = .1; break;
      }
      const step = Math.min(d, budget);
      const next = moveBy(p, { x: (target.x - p.x) / d * step, y: (target.y - p.y) / d * step }, this.grid.obstacles, this.grid.bounds, this.grid.radius, false);
      if (distance(p, next) < step - .01) { this.status = 'blocked'; this.path = []; this.retry = .1; break; }
      p = next; budget -= step;
      if (step >= d) this.path.shift();
    }
    if (this.status === 'moving' && !this.path.length) this.status = 'arrived';
    return p;
  }
}

