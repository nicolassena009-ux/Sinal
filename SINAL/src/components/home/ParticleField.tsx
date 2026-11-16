import { useEffect, useRef } from "react";

/**
 * Campo de partículas (Canvas 2D) nas cores do Sinal.
 * - Deriva lenta com profundidade (parallax por camada).
 * - Repulsão suave ao redor do ponteiro.
 * - Rastros proporcionais à velocidade do scroll (efeito "salto").
 * Pausa fora da tela/aba oculta; desligado com movimento reduzido (desenha 1 frame estático).
 */
const CORES = ["#ffc044", "#ffc044", "#2e7dd1", "#53c6b6", "#f2f1ff", "#f2f1ff", "#ff60a7"];

interface P {
  x: number;
  y: number;
  z: number; // 0.2 (fundo) .. 1 (frente)
  vx: number;
  vy: number;
  r: number;
  c: string;
  tw: number;
}

export function ParticleField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let parts: P[] = [];
    const mouse = { x: -9999, y: -9999 };
    let lastScroll = window.scrollY;
    let vel = 0;
    let raf = 0;
    let visible = true;
    let t = 0;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(Math.round((w * h) / 5200), w < 700 ? 140 : 320);
      parts = Array.from({ length: n }, () => {
        const z = 0.2 + Math.random() * 0.8;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          vx: (Math.random() - 0.5) * 0.12,
          vy: -0.05 - Math.random() * 0.15,
          r: 0.5 + z * 1.6,
          c: CORES[(Math.random() * CORES.length) | 0],
          tw: Math.random() * Math.PI * 2,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const sy = window.scrollY;
      vel += (sy - lastScroll - vel) * 0.25;
      lastScroll = sy;
      t += 0.016;

      for (const p of parts) {
        if (!reduce) {
          p.x += p.vx * p.z;
          p.y += p.vy * p.z - vel * 0.06 * p.z;
          // repulsão do ponteiro
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 16000) {
            const f = (1 - d2 / 16000) * 1.6 * p.z;
            const d = Math.sqrt(d2) || 1;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
        }
        const a = 0.35 + 0.65 * p.z * (0.75 + 0.25 * Math.sin(t * 2 + p.tw));
        ctx.globalAlpha = a;
        const streak = Math.min(Math.abs(vel) * 0.9 * p.z, 60);
        if (streak > 2) {
          ctx.strokeStyle = p.c;
          ctx.lineWidth = p.r;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + Math.sign(vel) * streak);
          ctx.stroke();
        } else {
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      raf = 0;
      if (!visible || document.hidden) return;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && !reduce) raf = requestAnimationFrame(loop);
    };

    seed();
    draw();
    start();

    const onResize = () => {
      seed();
      draw();
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    const onVis = () => (document.hidden ? undefined : start());
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  );
}
