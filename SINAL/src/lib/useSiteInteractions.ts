import { useEffect } from "react";

/**
 * Camada global de micro-interações, montada uma única vez na raiz.
 *
 * - `.reveal-on-scroll`: entra suavemente quando aparece na tela (IntersectionObserver
 *   compartilhado; um MutationObserver pega elementos de rotas carregadas depois).
 *   Use `style={{ "--reveal-delay": "120ms" }}` para escalonar.
 * - `.spotlight`: brilho que segue o ponteiro (variáveis --mx/--my).
 * - `.tilt`: inclinação 3D leve seguindo o ponteiro (só mouse/caneta).
 *
 * Com `prefers-reduced-motion` a revelação vira só um fade (sem deslocamento); sem JS o conteúdo fica visível,
 * pois o estado oculto só vale com a classe `motion-ready` no <html>.
 */
export function useSiteInteractions() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    /* ---------- Revelar ao rolar ---------- */
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;

    const observeAll = () => {
      document.querySelectorAll<HTMLElement>(".reveal-on-scroll:not(.is-visible)").forEach((el) => {
        if (!el.dataset.revealObserved) {
          el.dataset.revealObserved = "1";
          io?.observe(el);
        }
      });
    };

    if (typeof IntersectionObserver !== "undefined") {
      root.classList.add("motion-ready");
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io?.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
      observeAll();
      let scheduled = false;
      mo = new MutationObserver(() => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
          scheduled = false;
          observeAll();
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    /* ---------- Spotlight + tilt (ponteiro fino) ---------- */
    let current: HTMLElement | null = null;
    let raf = 0;
    let lastEvent: PointerEvent | null = null;

    const reset = (el: HTMLElement) => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.classList.remove("is-pointer");
    };

    const apply = () => {
      raf = 0;
      const e = lastEvent;
      if (!e) return;
      const el = (e.target as Element | null)?.closest?.<HTMLElement>(".spotlight, .tilt") ?? null;
      if (el !== current) {
        if (current) reset(current);
        current = el;
      }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      el.classList.add("is-pointer");
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      if (el.classList.contains("tilt")) {
        const px = x / r.width - 0.5;
        const py = y / r.height - 0.5;
        el.style.setProperty("--rx", `${(-py * 6).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${(px * 8).toFixed(2)}deg`);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      lastEvent = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (current) reset(current);
      current = null;
    };

    /* ---------- Botões magnéticos (só mouse) ---------- */
    let magnet: HTMLElement | null = null;
    const MAGNETICO = ".btn-shine, .magnetic";

    const soltarIma = () => {
      if (magnet) magnet.style.transform = "";
      magnet = null;
    };
    const onCursorMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target as Element | null;
      const m = t?.closest?.<HTMLElement>(MAGNETICO) ?? null;
      if (m !== magnet) soltarIma();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        m.style.transform = `translate(${(dx * 10).toFixed(1)}px, ${(dy * 8).toFixed(1)}px)`;
      }
    };
    const onCursorLeave = () => soltarIma();

    const pointerEnabled = finePointer.matches;
    if (pointerEnabled) {
      document.addEventListener("pointermove", onCursorMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onCursorLeave);
      document.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      window.addEventListener("blur", onLeave);
    }

    return () => {
      io?.disconnect();
      mo?.disconnect();
      root.classList.remove("motion-ready");
      cancelAnimationFrame(raf);
      if (pointerEnabled) {
        soltarIma();
        document.removeEventListener("pointermove", onCursorMove);
        document.documentElement.removeEventListener("pointerleave", onCursorLeave);
        document.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("blur", onLeave);
      }
    };
  }, []);
}
