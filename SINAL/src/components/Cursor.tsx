import { useEffect, useRef } from "react";

/**
 * Interpolated cursor: target = raw mouse position, current chases it with
 * exponential damping, so the dot trails the pointer with a soft delay.
 * A second, faster ring gives the two-speed feel.
 */
export function Cursor({ label }: { label: string | null }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot = { ...target };
    const ring = { ...target };
    let raf = 0;
    let last = performance.now();

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const kDot = 1 - Math.exp(-26 * dt);
      const kRing = 1 - Math.exp(-11 * dt);
      dot.x += (target.x - dot.x) * kDot;
      dot.y += (target.y - dot.y) * kDot;
      ring.x += (target.x - ring.x) * kRing;
      ring.y += (target.y - ring.y) * kRing;
      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      if (labelRef.current)
        labelRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 hidden md:block" aria-hidden="true">
      <div
        ref={ringRef}
        className={`fixed left-0 top-0 rounded-full border border-white/35 transition-[width,height,background-color,border-color] duration-300 ease-out ${
          label ? "h-16 w-16 bg-white/5 border-white/60" : "h-9 w-9"
        }`}
      />
      <div
        ref={dotRef}
        className={`fixed left-0 top-0 rounded-full bg-white transition-[opacity,width,height] duration-200 ${
          label ? "h-0 w-0 opacity-0" : "h-1 w-1 opacity-90"
        }`}
      />
      <span
        ref={labelRef}
        className={`fixed left-0 top-0 text-[10px] uppercase tracking-[0.18em] text-white transition-opacity duration-200 ${
          label ? "opacity-100" : "opacity-0"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
