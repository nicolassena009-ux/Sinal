import Phaser from 'phaser';

export interface TeddyCustomConfig {
  boneModelo?: string;
  roupaModelo?: string;
  roupaCor?: string;
  mochilaModelo?: string;
  acessorio?: string;
  pelagemCor?: string;
  corCamiseta?: string;
  estampa?: string;
  corBone?: string;
}

/**
 * TeddyLayers — Camada de compatibilidade.
 * A personalização visual de roupas, estampas e bonés agora é renderizada diretamente
 * na textura do atlas do Teddy em pixel art (via ensureTeddyCustomTexture).
 * Retângulos vetoriais sobre o corpo, faixas brancas e tint global foram eliminados.
 */
export class TeddyLayers {
  private custom: TeddyCustomConfig;

  constructor(
    _scene: Phaser.Scene,
    _container: Phaser.GameObjects.Container,
    _baseSprite: Phaser.GameObjects.Sprite,
    inputAvatar: { color?: string | undefined; accessories?: string[] | undefined; custom?: TeddyCustomConfig | undefined }
  ) {
    this.custom = {
      boneModelo: inputAvatar.custom?.boneModelo ?? (inputAvatar.accessories?.includes('cap') ? 'bone_roxo' : 'bone_roxo'),
      roupaModelo: inputAvatar.custom?.roupaModelo ?? 'camiseta_sinal',
      roupaCor: inputAvatar.custom?.roupaCor ?? (inputAvatar.color ? 'roxo' : 'roxo'),
      mochilaModelo: inputAvatar.custom?.mochilaModelo ?? 'mochila_amarela',
      acessorio: inputAvatar.custom?.acessorio ?? (inputAvatar.accessories?.includes('glasses') ? 'oculos' : inputAvatar.accessories?.includes('badge') ? 'cracha' : 'cracha'),
      pelagemCor: inputAvatar.custom?.pelagemCor ?? 'caramelo',
      corCamiseta: inputAvatar.custom?.corCamiseta ?? 'roxo',
      estampa: inputAvatar.custom?.estampa ?? 'lisa',
      corBone: inputAvatar.custom?.corBone ?? 'roxo',
    };
  }

  public redraw(_direction: 'front' | 'back', _flipX: boolean) {
    // No-op: As roupas e bonés agora são renderizados em pixel art diretamente na textura gerada.
    // Nenhuma forma vetorial deformada ou faixa artificial é desenhada sobre o corpo.
  }
}
