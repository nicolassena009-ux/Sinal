/**
 * Módulo de Ordenação de Profundidade em Perspectiva 2.5D (Y-Sorting)
 * Garante que personagens e objetos que estão à frente sobreponham visualmente
 * elementos que estão mais ao fundo do cenário.
 */

export interface DepthEntity {
  id: string;
  depthY: number; // Coordenada Y da base de contato com o chão
  render: (ctx: CanvasRenderingContext2D) => void;
}

/**
 * Ordena de forma estável uma lista de entidades pela coordenada Y do chão.
 * Elementos com menor Y (mais distantes) são desenhados primeiro;
 * Elementos com maior Y (mais próximos da câmera) são desenhados por cima.
 */
export function sortEntitiesByDepth(entities: DepthEntity[]): DepthEntity[] {
  return [...entities].sort((a, b) => a.depthY - b.depthY);
}

/**
 * Calcula a coordenada Y de profundidade para um obstáculo retangular.
 * O plano de contato frontal de um móvel/obstáculo é sua borda inferior (y + height).
 */
export function getObstacleDepthY(y: number, height: number): number {
  return y + height;
}

