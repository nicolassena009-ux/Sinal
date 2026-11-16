import { useEffect, useRef } from "react";

const PALAVRAS = ["Reconhecer", "Entender", "Agir", "Proteger"];
const CORES = ["#7fb6ff", "#b99bff", "#ffc044", "#53c6b6"];

/**
 * Faixa de palavras gigantes em loop. A velocidade acompanha a rolagem
 * (rolar rápido acelera, rolar para cima inverte o sentido) e pausa fora da tela.
 */
export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = 0;
    let dir = -1;
    let boost = 0;
    let lastY = window.scrollY;
    let raf = 0;
    let visible = false;
    let last = performance.now();

    const tick = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(64, now - last);
      last = now;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (Math.abs(dy) > 0.5) dir = dy > 0 ? -1 : 1;
      boost += (Math.min(Math.abs(dy), 80) * 0.18 - boost) * 0.12;
      x += dir * (0.045 + boost * 0.02) * dt;
      const half = track.scrollWidth / 2;
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      track.style.transform = `translate3d(${x}px,0,0) skewX(${(-dir * Math.min(boost, 10) * 0.6).toFixed(2)}deg)`;
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce && !raf) {
        last = performance.now();
        lastY = window.scrollY;
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(track);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const serie = [...PALAVRAS, ...PALAVRAS];
  return (
    <div
      aria-hidden="true"
      className="marquee overflow-hidden border-y border-white/10 py-6 sm:py-8"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {serie.map((p, i) => (
              <span key={`${k}-${i}`} className="flex items-center">
                <span
                  className={`marquee-word px-6 font-display font-extrabold leading-none tracking-tight sm:px-10 ${i % 2 ? "is-outline" : ""}`}
                  style={{ color: CORES[i % 4], ["--c" as string]: CORES[i % 4] }}
                >
                  {p}
                </span>
                <span className="text-2xl text-[color:var(--amarelo)] sm:text-4xl">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
