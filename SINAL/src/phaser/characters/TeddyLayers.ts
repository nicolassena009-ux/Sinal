import Phaser from 'phaser';

export interface TeddyCustomConfig {
  boneModelo?: string;
  roupaModelo?: string;
  roupaCor?: string;
  mochilaModelo?: string;
  acessorio?: string;
  pelagemCor?: string;
}

const CORES_HEX: Record<string, number> = {
  roxo: 0x6D3FC3,
  azul: 0x2E7DD1,
  amarelo: 0xFFC044,
  vermelho: 0xE53E3E,
  branco: 0xF3F4F6,
  rosa: 0xFF60A7,
  aqua: 0x53C6B6,
};

export class TeddyLayers {
  private capG: Phaser.GameObjects.Graphics;
  private clothG: Phaser.GameObjects.Graphics;
  private packG: Phaser.GameObjects.Graphics;
  private accG: Phaser.GameObjects.Graphics;
  private custom: TeddyCustomConfig;

  constructor(
    private scene: Phaser.Scene,
    private container: Phaser.GameObjects.Container,
    private baseSprite: Phaser.GameObjects.Sprite,
    inputAvatar: { color?: string | undefined; accessories?: string[] | undefined; custom?: TeddyCustomConfig | undefined }
  ) {
    this.custom = {
      boneModelo: inputAvatar.custom?.boneModelo ?? (inputAvatar.accessories?.includes('cap') ? 'bone_roxo' : 'bone_roxo'),
      roupaModelo: inputAvatar.custom?.roupaModelo ?? (inputAvatar.accessories?.includes('vest') ? 'colete_socorrista' : 'camiseta_sinal'),
      roupaCor: inputAvatar.custom?.roupaCor ?? (inputAvatar.color ? 'roxo' : 'roxo'),
      mochilaModelo: inputAvatar.custom?.mochilaModelo ?? 'mochila_amarela',
      acessorio: inputAvatar.custom?.acessorio ?? (inputAvatar.accessories?.includes('glasses') ? 'oculos' : inputAvatar.accessories?.includes('badge') ? 'cracha' : 'cracha'),
      pelagemCor: inputAvatar.custom?.pelagemCor ?? 'caramelo',
    };

    // Aplica tonalidade da pelagem no sprite base
    this.applyFurTint();

    // Cria as camadas de sobreposição gráfica com profundidade relativa
    this.packG = scene.add.graphics();
    this.clothG = scene.add.graphics();
    this.capG = scene.add.graphics();
    this.accG = scene.add.graphics();

    container.add([this.packG, this.clothG, this.accG, this.capG]);
    this.redraw('front', false);
  }

  private applyFurTint() {
    const p = this.custom.pelagemCor;
    if (p === 'mel') this.baseSprite.setTint(0xffe4b5);
    else if (p === 'cacau') this.baseSprite.setTint(0xc89f8b);
    else if (p === 'creme') this.baseSprite.setTint(0xfff6ec);
    else this.baseSprite.clearTint();
  }

  public redraw(direction: 'front' | 'back', flipX: boolean) {
    this.capG.clear();
    this.clothG.clear();
    this.packG.clear();
    this.accG.clear();

    const sign = flipX ? -1 : 1;
    const isBack = direction === 'back';

    // 1. MOCHILA
    this.drawBackpack(isBack, sign);

    // 2. ROUPA / TRONCO
    this.drawClothing(isBack, sign);

    // 3. ACESSÓRIO EXTRA (Crachá ou Óculos)
    this.drawAccessory(isBack, sign);

    // 4. BONÉ / CABEÇA
    this.drawCap(isBack, sign);
  }

  private drawClothing(isBack: boolean, sign: number) {
    const modelo = this.custom.roupaModelo;
    const corId = this.custom.roupaCor || 'roxo';
    const mainColor = CORES_HEX[corId] ?? 0x6D3FC3;

    // Região do torso: x ~ -18..18, y ~ -40..-78
    const topY = -76;
    const botY = -42;
    const width = 34;
    const leftX = -17;

    if (modelo === 'colete_socorrista') {
      // Fundo amarelo alta visibilidade
      this.clothG.fillStyle(0xFFC044, 0.95);
      this.clothG.fillRoundedRect(leftX, topY, width, botY - topY, 4);

      // Faixas refletivas brancas/prateadas horizontais
      this.clothG.fillStyle(0xFFFFFF, 0.9);
      this.clothG.fillRect(leftX, topY + 10, width, 4);
      this.clothG.fillRect(leftX, topY + 20, width, 4);

      // Detalhe de zíper e bordas roxas SINAL
      this.clothG.fillStyle(0x563581, 1);
      if (!isBack) {
        this.clothG.fillRect(sign * 0 - 1, topY + 2, 2, botY - topY - 2);
      }
    } else if (modelo === 'jaqueta') {
      // Jaqueta esportiva
      this.clothG.fillStyle(mainColor, 0.92);
      this.clothG.fillRoundedRect(leftX, topY, width, botY - topY, 4);

      // Gola esporte e zíper
      this.clothG.fillStyle(0x1e1b4b, 0.8);
      if (!isBack) {
        this.clothG.fillRect(sign * 0 - 1.5, topY + 4, 3, botY - topY - 4);
      }
      // Listra lateral esportiva
      this.clothG.fillStyle(0xFFFFFF, 0.7);
      this.clothG.fillRect(leftX + 2, topY + 2, 2, botY - topY - 4);
      this.clothG.fillRect(leftX + width - 4, topY + 2, 2, botY - topY - 4);
    } else if (modelo === 'moletom') {
      // Moletom confortável
      this.clothG.fillStyle(mainColor, 0.92);
      this.clothG.fillRoundedRect(leftX - 1, topY, width + 2, botY - topY + 2, 5);

      if (!isBack) {
        // Bolso canguru
        this.clothG.fillStyle(0x000000, 0.15);
        this.clothG.fillRoundedRect(-10, botY - 12, 20, 10, 2);
      }
    } else {
      // Camiseta oficial SINAL / Básica
      this.clothG.fillStyle(mainColor, 0.92);
      this.clothG.fillRoundedRect(leftX, topY, width, botY - topY, 4);

      if (!isBack && modelo === 'camiseta_sinal') {
        // Logo / emblema SINAL no centro do peito
        this.clothG.fillStyle(0xFFC044, 0.9);
        this.clothG.fillCircle(sign * 0, topY + 12, 4);
        this.clothG.fillStyle(0xFFFFFF, 1);
        this.clothG.fillCircle(sign * 0, topY + 12, 2);
      }
    }
  }

  private drawBackpack(isBack: boolean, sign: number) {
    const mochila = this.custom.mochilaModelo;
    if (mochila === 'nenhuma') return;

    const corMochila = mochila === 'mochila_vermelha' ? 0xE53E3E : mochila === 'mochila_azul' ? 0x2E7DD1 : 0xFFC044;

    if (isBack) {
      // Mochila de costas: grande destaque no centro das costas
      this.packG.fillStyle(corMochila, 0.98);
      this.packG.fillRoundedRect(-15, -78, 30, 32, 6);

      // Bolso inferior
      this.packG.fillStyle(0x000000, 0.18);
      this.packG.fillRoundedRect(-12, -60, 24, 12, 4);

      if (mochila === 'mochila_vermelha') {
        // Cruz branca de primeiros socorros
        this.packG.fillStyle(0xFFFFFF, 1);
        this.packG.fillRect(-2, -73, 4, 10);
        this.packG.fillRect(-5, -70, 10, 4);
      } else {
        // Detalhe de zíper e marca SINAL
        this.packG.fillStyle(0xFFFFFF, 0.85);
        this.packG.fillRect(-8, -72, 16, 2);
      }
    } else {
      // De frente: alças visíveis passando sobre os ombros
      this.packG.fillStyle(corMochila, 0.9);
      this.packG.fillRect(-14, -76, 4, 28);
      this.packG.fillRect(10, -76, 4, 28);

      // Fivelas das alças
      this.packG.fillStyle(0x222222, 0.9);
      this.packG.fillRect(-15, -60, 6, 3);
      this.packG.fillRect(9, -60, 6, 3);
    }
  }

  private drawCap(isBack: boolean, sign: number) {
    const bone = this.custom.boneModelo;
    if (bone === 'nenhum') return;

    if (bone === 'faixa') {
      // Faixa de socorrista na testa
      this.capG.fillStyle(0xFFFFFF, 0.95);
      this.capG.fillRoundedRect(-18, -108, 36, 7, 2);
      // Pequena cruz vermelha na faixa
      this.capG.fillStyle(0xE53E3E, 1);
      this.capG.fillRect(sign * 0 - 1.5, -107, 3, 5);
      this.capG.fillRect(sign * 0 - 2.5, -106, 5, 3);
      return;
    }

    const corBone = bone === 'bone_azul' ? 0x2E7DD1 : bone === 'bone_vermelho' ? 0xE53E3E : 0x6D3FC3;
    const corAba = bone === 'bone_azul' ? 0x1D4ED8 : bone === 'bone_vermelho' ? 0xB91C1C : 0x52289E;

    // Copa do boné arredondada no topo da cabeça do Teddy
    this.capG.fillStyle(corBone, 0.96);
    this.capG.fillRoundedRect(-16, -118, 32, 14, 6);

    // Botão superior do boné
    this.capG.fillStyle(0xFFFFFF, 0.85);
    this.capG.fillCircle(sign * 0, -119, 2);

    // Aba do boné
    this.capG.fillStyle(corAba, 0.98);
    if (!isBack) {
      // Aba virada para a frente/lado
      const abaX = sign < 0 ? -22 : -10;
      this.capG.fillRoundedRect(abaX, -108, 26, 4, 2);
    } else {
      // De costas, fecho traseiro do boné
      this.capG.fillStyle(0x000000, 0.25);
      this.capG.fillRect(-5, -108, 10, 3);
    }
  }

  private drawAccessory(isBack: boolean, sign: number) {
    if (isBack) return;
    const acc = this.custom.acessorio;

    if (acc === 'cracha') {
      // Cordão roxo
      this.accG.lineStyle(1.5, 0x6D3FC3, 0.9);
      this.accG.strokeLineShape(new Phaser.Geom.Line(-6, -76, sign * 2, -63));
      this.accG.strokeLineShape(new Phaser.Geom.Line(6, -76, sign * 2, -63));

      // Cartão branco com faixa amarela
      this.accG.fillStyle(0xFFFFFF, 0.95);
      this.accG.fillRoundedRect(sign * 2 - 4, -63, 8, 10, 1.5);
      this.accG.fillStyle(0xFFC044, 1);
      this.accG.fillRect(sign * 2 - 4, -63, 8, 3);
    } else if (acc === 'oculos') {
      // Armação preta moderna nos olhos do Teddy
      this.accG.lineStyle(2, 0x1E293B, 0.95);
      this.accG.strokeRoundedRect(-13, -96, 11, 8, 2);
      this.accG.strokeRoundedRect(2, -96, 11, 8, 2);
      this.accG.strokeLineShape(new Phaser.Geom.Line(-2, -92, 2, -92));
    }
  }
}
