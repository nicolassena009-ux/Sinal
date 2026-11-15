export interface Point {
  x: number;
  y: number;
}
export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}
export const SPEED = 52;
export const MAX_DT = 0.05;
export const BOUNDS = { left: 10, right: 350, top: 58, bottom: 186 };
export const PLAYER_RADIUS = 7;
export function safeDelta(seconds: number): number {
  return Number.isFinite(seconds) ? Math.max(0, Math.min(MAX_DT, seconds)) : 0;
}
export function normalized(vector: Point): Point {
  const length = Math.hypot(vector.x, vector.y);
  return length > 0 ? { x: vector.x / length, y: vector.y / length } : { x: 0, y: 0 };
}
export function blocked(point: Point, obstacles: readonly Obstacle[]): boolean {
  return obstacles.some(
    (o) =>
      point.x + PLAYER_RADIUS > o.x &&
      point.x - PLAYER_RADIUS < o.x + o.width &&
      point.y + PLAYER_RADIUS > o.y &&
      point.y - PLAYER_RADIUS < o.y + o.height,
  );
}
/** Position is the player's ground anchor; split axes allow sliding along furniture. */
export function movePlayer(
  position: Point,
  input: Point,
  seconds: number,
  obstacles: readonly Obstacle[],
  maxDistance = Infinity,
): Point {
  const direction = normalized(input);
  const distance = Math.min(SPEED * safeDelta(seconds), Math.max(0, maxDistance));
  const next = { ...position };
  const x = Math.max(BOUNDS.left, Math.min(BOUNDS.right, next.x + direction.x * distance));
  if (!blocked({ x, y: next.y }, obstacles)) next.x = x;
  const y = Math.max(BOUNDS.top, Math.min(BOUNDS.bottom, next.y + direction.y * distance));
  if (!blocked({ x: next.x, y }, obstacles)) next.y = y;
  return next;
}
