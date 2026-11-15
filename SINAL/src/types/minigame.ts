export type ThemeSlug =
  | "engasgo"
  | "convulsao"
  | "parada-cardiorrespiratoria"
  | "queimadura"
  | "trauma";

export interface AvatarConfig {
  tomPele: number; // 0 a 4 (tons do mais claro ao mais retinto)
  cabeloEstilo: "curto" | "cacheado" | "liso" | "trancas" | "black_power";
  cabeloCor: "castanho" | "preto" | "loiro" | "ruivo" | "cinza";
  roupaModelo: "camiseta_sinal" | "moletom" | "colete_socorrista" | "jaqueta";
  roupaCor: "roxo" | "azul" | "rosa" | "amarelo" | "aqua" | "branco";
  calcadoCor: "branco" | "preto" | "azul" | "vermelho";
  acessorio?: "nenhum" | "oculos" | "bone" | "cracha";
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
