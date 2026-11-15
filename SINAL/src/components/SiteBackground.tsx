import bgImg from "@/assets/sinal-bg.webp";

interface SiteBackgroundProps {
  /**
   * Opacidade da imagem de fundo (0 a 1).
   * Padrão calibrado para 0.22 (22%), dentro da faixa recomendada de 15% a 30%.
   */
  opacity?: number;
  className?: string;
}

/**
 * Background visual principal de todo o site Sinal.
 *
 * Características de engenharia e UX:
 * 1. Proporção 100% preservada (sem esticar ou distorcer).
 * 2. Posicionamento responsivo:
 *    - Desktop / Ultrawide: foca o Teddy no lado esquerdo com espaço amplo para conteúdo.
 *    - Tablets: ajusta o enquadramento preservando o aceno e expressão do Teddy.
 *    - Celulares: posicionamento adaptado (24% lateral, 35% vertical) para manter Teddy em destaque sutil.
 * 3. Camada de overlay translúcida em degradê suave, garantindo contraste perfeito para textos.
 * 4. `pointer-events-none` e `z-0` para nunca interferir em cliques, rolagens, 3D ou botões.
 * 5. Desativado automaticamente no modo de alto contraste para acessibilidade total.
 */
export function SiteBackground({ opacity, className = "" }: SiteBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none bg-[color:var(--background)] print:hidden ${className}`}
    >
      {/* Imagem de Fundo Oficial do Sinal */}
      <img
        src={bgImg}
        alt=""
        loading="eager"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out contrast:opacity-0"
        style={{
          opacity: opacity !== undefined ? opacity : "var(--sinal-bg-opacity, 0.22)",
          objectPosition: "var(--sinal-bg-position, 12% center)",
        }}
      />

      {/* Overlay translúcido para harmonização cromática e contraste de leitura */}
      <div
        className="absolute inset-0 transition-opacity duration-500 contrast:opacity-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 80% at 50% 30%, rgba(242, 241, 255, 0.35) 0%, rgba(242, 241, 255, 0.55) 60%, rgba(230, 222, 250, 0.75) 100%)",
        }}
      />
    </div>
  );
}
