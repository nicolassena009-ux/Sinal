/**
 * Efeito leve e elegante de confete em Canvas,
 * usando a paleta de cores oficial do Sinal (#6D3FC3, #2E7DD1, #FFC044, #FF60A7, #53C6B6)
 * e respeitando `prefers-reduced-motion`.
 */

export function launchConfetti(durationMs = 1800) {
  if (typeof window === "undefined") return;

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  // Paleta oficial Sinal
  const colors = ["#6D3FC3", "#2E7DD1", "#FFC044", "#FF60A7", "#53C6B6", "#F2F1FF"];

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  const count = 100;
  const pieces = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * (window.innerHeight * 0.4),
    w: 7 + Math.random() * 7,
    h: 9 + Math.random() * 9,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI,
    vRot: (Math.random() - 0.5) * 0.28,
    vy: 2.2 + Math.random() * 2.8,
    vx: (Math.random() - 0.5) * 2.2,
    sway: Math.random() * Math.PI * 2,
  }));

  const start = performance.now();
  let rafId: number;

  function frame(now: number) {
    const elapsed = now - start;

    ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const p of pieces) {
      p.y += p.vy;
      p.sway += 0.08;
      p.x += p.vx + Math.sin(p.sway) * 0.7;
      p.rot += p.vRot;

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rot);
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx!.restore();
    }

    if (elapsed < durationMs) {
      rafId = requestAnimationFrame(frame);
    } else {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
      canvas.remove();
    }
  }

  window.addEventListener("resize", resize);
  rafId = requestAnimationFrame(frame);
}
