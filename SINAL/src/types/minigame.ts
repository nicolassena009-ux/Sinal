export type ThemeSlug =
  | "engasgo"
  | "convulsao"
  | "parada-cardiorrespiratoria"
  | "queimadura"
  | "trauma";

export interface AvatarConfig {
  tomPele?: number | undefined; // compatibilidade
  cabeloEstilo?: ("curto" | "cacheado" | "liso" | "trancas" | "black_power") | undefined;
  cabeloCor?: ("castanho" | "preto" | "loiro" | "ruivo" | "cinza") | undefined;
  calcadoCor?: ("branco" | "preto" | "azul" | "vermelho") | undefined;
  // Campos oficiais do mascote Teddy em pixel art
  boneModelo?: ("bone_roxo" | "bone_azul" | "bone_vermelho" | "faixa" | "nenhum") | undefined;
  roupaModelo: "camiseta_sinal" | "moletom" | "colete_socorrista" | "jaqueta" | "camiseta_branca";
  roupaCor: "roxo" | "azul" | "rosa" | "amarelo" | "aqua" | "branco" | "vermelho";
  mochilaModelo?: ("mochila_amarela" | "mochila_vermelha" | "mochila_azul" | "nenhuma") | undefined;
  acessorio?: ("nenhum" | "oculos" | "bone" | "cracha") | undefined;
  pelagemCor?: ("caramelo" | "mel" | "cacau" | "creme") | undefined;
}

export interface ObjetoInterativo {
  id: string;
  nome: string;
  x: number; // posição virtual no canvas (0 a 360)
  y: number; // posição virtual no canvas (0 a 202)
  largura: number;
  altura: number;
  tipo: "pessoa" | "objeto" | "ponto_socorro";
  icone?: string;
  destacado?: boolean;
  mensagemProximidade?: string;
}

export interface EscolhaFase {
  id: string;
  texto: string;
  correta: boolean;
  explicacao: string;
  pontos?: number;
}

export interface EtapaFase {
  id: string;
  titulo: string;
  instrucao: string;
  falaPersonagem?: string;
  alvoInteracaoId?: string;
  tempoLimiteSegundos?: number;
  pergunta?: string;
  escolhas?: EscolhaFase[];
  concluida?: boolean;
}

export interface ConfiguracaoFase {
  slug: ThemeSlug;
  titulo: string;
  subtitulo: string;
  cor: string;
  cenarioNome: string;
  cenarioTipo: "refeitorio" | "sala_aula" | "parque" | "cozinha" | "quadra";
  vitimaNome: string;
  vitimaDescricao: string;
  etapas: EtapaFase[];
  resumoEducativoFinal: {
    oQueFazer: string[];
    oQueNaoFazer: string[];
    quandoChamarAjuda: string;
  };
}
