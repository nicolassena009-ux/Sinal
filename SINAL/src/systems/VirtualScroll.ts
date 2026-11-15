/**
 * Virtual scroll: no native scrollbar, no scrollY.
 * Wheel / trackpad / drag / touch / keyboard all feed one `target` value;
 * `current` chases it with frame-rate-independent exponential damping, which
 * produces the inertia and the "keeps gliding after you let go" feel.
 */
export type VirtualScrollOptions = {
  /** damping strength: higher = snappier, lower = more glide */
  smoothing?: number;
  /** pixels of movement per wheel unit */
  wheelFactor?: number;
  /** pixels of movement per drag pixel */
  dragFactor?: number;
};

export class VirtualScroll {
  target = 0;
  current = 0;
  velocity = 0;
  isDragging = false;

  private smoothing: number;
  private wheelFactor: number;
  private dragFactor: number;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private pointerId: number | null = null;
  private el: HTMLElement;
  private moved = 0;

  constructor(el: HTMLElement, opts: VirtualScrollOptions = {}) {
    this.el = el;
    this.smoothing = opts.smoothing ?? 6.5;
    this.wheelFactor = opts.wheelFactor ?? 1;
    this.dragFactor = opts.dragFactor ?? 1.6;

    el.addEventListener("wheel", this.onWheel, { passive: false });
    el.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.onPointerUp);
    window.addEventListener("keydown", this.onKeyDown);
  }

  /** distance dragged during the current gesture — used to suppress click after a drag */
  get dragDistance() {
    return this.moved;
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    // Trackpads report horizontal intent too; take whichever axis dominates.
    const delta =
      Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    this.target += delta * this.wheelFactor;
  };

  private onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 || !e.isPrimary || this.isDragging) return;
    this.el.setPointerCapture?.(e.pointerId);
    this.pointerId = e.pointerId;
    this.isDragging = true;
    this.moved = 0;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    document.documentElement.classList.add("is-grabbing");
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isDragging || e.pointerId !== this.pointerId) return;
    const dx = e.clientX - this.lastPointerX;
    const dy = e.clientY - this.lastPointerY;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    this.moved += Math.hypot(dx, dy);
    this.target -= dx * this.dragFactor;
  };

  private onPointerUp = (e: PointerEvent) => {
    if (e.pointerId !== this.pointerId) return;
    if (!this.isDragging) return;
    if (this.pointerId !== null && this.el.hasPointerCapture?.(this.pointerId)) this.el.releasePointerCapture(this.pointerId);
    this.isDragging = false;
    this.pointerId = null;
    document.documentElement.classList.remove("is-grabbing");
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof Element && e.target.closest('a, button, input, textarea, select, summary, [contenteditable="true"]')) return;
    if (!["ArrowRight", "ArrowLeft", "PageDown", "PageUp"].includes(e.key)) return;
    e.preventDefault();
    const step = window.innerWidth * 0.4;
    if (e.key === "ArrowRight" || e.key === "PageDown") this.target += step;
    if (e.key === "ArrowLeft" || e.key === "PageUp") this.target -= step;
  };

  setDragFactor(value: number) { this.dragFactor = value; }

  /** call once per frame with delta seconds */
  update(dt: number) {
    const prev = this.current;
    const k = 1 - Math.exp(-this.smoothing * Math.min(dt, 0.05));
    this.current += (this.target - this.current) * k;
    this.velocity = (this.current - prev) / Math.max(dt, 0.001);
    return this.current;
  }

  destroy() {
    this.el.removeEventListener("wheel", this.onWheel);
    this.el.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("pointercancel", this.onPointerUp);
    window.removeEventListener("keydown", this.onKeyDown);
    document.documentElement.classList.remove("is-grabbing");
  }
}
