export interface Missao {
  id: string;
  emoji: string;
  titulo: string;
  cenario: string;
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
  temaRelacionado?: string; // slug de tema do Sinal
}

export const MISSOES_KIDS: Missao[] = [
  {
    id: "kids-queimadura",
    emoji: "🔥",
    titulo: "Panela quente!",
    cenario: "Teddy percebeu uma panela com vapor muito quente na beirada do fogão.",
    pergunta: "Qual atitude é a mais segura para uma criança?",
    opcoes: [
      "Tentar segurar a panela pelo cabo.",
      "Afastar-se do fogão e avisar um adulto imediatamente.",
      "Passar pasta de dente ou manteiga na panela.",
      "Continuar brincando perto do fogão.",
    ],
    correta: 1,
    explicacao:
      "Afastar-se de fontes de calor e chamar um adulto evita queimaduras graves. Crianças nunca devem mexer em panelas quentes.",
    temaRelacionado: "queimadura",
  },
  {
    id: "kids-engasgo",
    emoji: "🍎",
    titulo: "Engasgo no lanche",
    cenario: "Durante o lanche, Teddy começou a tossir fraco, ficou sem voz e colocou as mãos no pescoço.",
    pergunta: "O que deve ser feito primeiro?",
    opcoes: [
      "Esconder o que aconteceu e esperar passar.",
      "Chamar um adulto imediatamente para ajudar.",
      "Oferecer um copo de água ou pão.",
      "Tentar colocar o dedo no fundo da boca.",
    ],
    correta: 1,
    explicacao:
      "Chamar um adulto rapidamente é o passo mais importante! Colocar o dedo ou dar água pode piorar o engasgo.",
    temaRelacionado: "engasgo",
  },
  {
    id: "kids-queda",
    emoji: "🩹",
    titulo: "Queda e machucado",
    cenario: "Um amigo caiu do escorregador, está chorando muito de dor e não consegue se levantar.",
    pergunta: "Qual é a atitude mais protetora?",
    opcoes: [
      "Pedir ajuda de um adulto e pedir para o amigo ficar paradinho.",
      "Puxar o amigo pelo braço para ele levantar rápido.",
      "Mandar ele correr para a dor sumir.",
      "Ignorar e continuar a brincadeira.",
    ],
    correta: 0,
    explicacao:
      "Pedir ajuda e evitar movimentos bruscos protege a coluna e os ossos de lesões maiores.",
    temaRelacionado: "trauma",
  },
  {
    id: "kids-energia",
    emoji: "⚡",
    titulo: "Perigo elétrico",
    cenario: "Há um fio desencapado ou alguém em contato com uma tomada com faíscas.",
    pergunta: "O que você NUNCA deve fazer?",
    opcoes: [
      "Avisar um adulto rapidamente.",
      "Manter distância da tomada e do fio.",
      "Tocar diretamente na pessoa ou no fio elétrico.",
      "Pedir socorro.",
    ],
    correta: 2,
    explicacao:
      "Nunca toque diretamente em fios ou em alguém que tomou choque, pois a corrente elétrica pode passar para você. Mantenha distância e chame um adulto!",
    temaRelacionado: "queimadura",
  },
  {
    id: "kids-agua",
    emoji: "🌊",
    titulo: "Cuidado na água",
    cenario: "Uma pessoa parece estar com dificuldade para respirar e se debater dentro da piscina.",
    pergunta: "Qual é a decisão mais segura para uma criança?",
    opcoes: [
      "Pular na água funda para tentar segurar a pessoa.",
      "Gritar por socorro de adultos e jogar uma boia se houver por perto.",
      "Esperar para ver se ela consegue sair sozinha.",
      "Ir embora sem avisar ninguém.",
    ],
    correta: 1,
    explicacao:
      "Crianças nunca devem entrar na água para resgatar alguém. Chamar adultos imediatamente e oferecer uma boia ou galho seguro é a melhor forma de salvar vidas.",
    temaRelacionado: "parada-cardiorrespiratoria",
  },
];

export const MISSOES_TEENS: Missao[] = [
  {
    id: "teens-torcao",
    emoji: "🤕",
    titulo: "Torção no treino",
    cenario: "Durante uma partida de futebol na escola, um colega torce o tornozelo, sente dor intensa e não consegue apoiar o pé.",
    pergunta: "Qual é a conduta inicial mais correta?",
    opcoes: [
      "Mandar ele continuar jogando para 'aquecer o músculo'.",
      "Ajudá-lo a sentar, não apoiar o pé machucado e comunicar um responsável ou educador físico.",
      "Tentar puxar e estalar o tornozelo no lugar.",
      "Dar qualquer remédio para dor que encontrar na mochila.",
    ],
    correta: 1,
    explicacao:
      "Imobilização confortável, repouso do membro e avaliação adequada evitam o agravamento de fraturas ou entorses graves.",
    temaRelacionado: "trauma",
  },
  {
    id: "teens-alergia",
    emoji: "🌰",
    titulo: "Reação alérgica aguda",
    cenario: "Um colega que tem alergia conhecida ingere acidentalmente um alimento, começa a ficar com os lábios inchados e tosse seca.",
    pergunta: "Qual é a primeira atitude a tomar?",
    opcoes: [
      "Aguardar alguns minutos para ver se os sintomas diminuem.",
      "Acionar ajuda médica de urgência imediatamente e verificar se ele possui medicação prescrita pelo médico.",
      "Oferecer um copo de leite ou água quente.",
      "Postar a reação nas redes sociais.",
    ],
    correta: 1,
    explicacao:
      "Reações anafiláticas podem evoluir rapidamente para fechamento de glote. Ajuda imediata (SAMU 192) e apoio com medicação prescrita são cruciais.",
    temaRelacionado: "engasgo",
  },
  {
    id: "teens-calor",
    emoji: "🥵",
    titulo: "Insolação e exaustão",
    cenario: "Em um dia de muito calor ao ar livre, uma jovem fica tonta, com a pele quente, respiração ofegante e confusão mental.",
    pergunta: "Qual é a conduta segura?",
    opcoes: [
      "Levar para um local fresco e com sombra, afrouxar roupas, oferecer água se consciente e pedir apoio médico.",
      "Deixá-la exposta ao sol para 'suar a febre'.",
      "Oferecer bebida energética ou refrigerante gelado.",
      "Não fazer nada, pois insolação passa sozinha.",
    ],
    correta: 0,
    explicacao:
      "Levar à sombra, resfriar gradualmente e hidratar são as medidas de proteção certas para a exaustão térmica.",
    temaRelacionado: "queimadura",
  },
  {
    id: "teens-corte",
    emoji: "🩸",
    titulo: "Corte profundo com sangramento",
    cenario: "Durante uma atividade prática, um vidro quebrou e causou um corte profundo no antebraço que sangra sem parar.",
    pergunta: "O que deve ser feito de imediato?",
    opcoes: [
      "Fazer compressão direta sobre o ferimento com um pano limpo e elevar o membro até receber socorro.",
      "Lavar com sabão em pó ou pó de café para estancar.",
      "Fazer um torniquete caseiro muito apertado sem saber a técnica.",
      "Assoprar o ferimento para esfriar.",
    ],
    correta: 0,
    explicacao:
      "A pressão direta contínua com tecido limpo é a forma mais eficaz e segura de conter a maioria das hemorragias até a chegada do atendimento.",
    temaRelacionado: "trauma",
  },
  {
    id: "teens-avc",
    emoji: "🗣️",
    titulo: "Sinais de alerta neurológico",
    cenario: "Um adulto de repente apresenta a boca torta, não consegue levantar um dos braços e fala de forma arrastada e confusa.",
    pergunta: "Qual atitude salva vidas nessa emergência?",
    opcoes: [
      "Esperar a pessoa dormir para ver se ela acorda melhor.",
      "Anotar a hora exata do início dos sintomas e ligar imediatamente para o SAMU 192.",
      "Oferecer um café forte ou remédio para pressão.",
      "Pedir para a pessoa fazer exercícios físicos para testar a força.",
    ],
    correta: 1,
    explicacao:
      "Boca torta, perda de força no braço e fala alterada são sinais clássicos de AVC. O tempo é crucial: acione o 192 na hora e anote o horário do início!",
    temaRelacionado: "convulsao",
  },
];

/**
 * Mapeamento de cenários práticos por slug de tema do Sinal
 */
export const PRATICA_POR_TEMA: Record<string, Missao> = {
  engasgo: {
    id: "pratica-engasgo",
    emoji: "🍎",
    titulo: "Simulação de Engasgo",
    cenario: "Você está à mesa e a pessoa ao lado de repente não consegue falar, tossir nem respirar, e leva as duas mãos ao pescoço.",
    pergunta: "Qual é a sequência de ações mais segura?",
    opcoes: [
      "Oferecer água com açúcar e dar tapas fortes nas costas sem saber a técnica.",
      "Perguntar se ela consegue tossir com força; se não conseguir falar nem respirar, acionar o SAMU 192 e seguir orientações.",
      "Colocar o dedo na garganta para tentar puxar o alimento às cegas.",
      "Aguardar 10 minutos para ver se o alimento desce sozinho.",
    ],
    correta: 1,
    explicacao:
      "Incentivar a tosse se possível. Se a obstrução for total (sem voz, sem respiração), ligue 192 imediatamente e siga as instruções do atendente!",
    temaRelacionado: "engasgo",
  },
  convulsao: {
    id: "pratica-convulsao",
    emoji: "🧠",
    titulo: "Simulação de Convulsão",
    cenario: "Uma pessoa perde a consciência e começa a ter contrações musculares rítmicas no chão.",
    pergunta: "O que você DEVE fazer para protegê-la durante a crise?",
    opcoes: [
      "Segurar os braços e pernas com força para impedir os movimentos.",
      "Colocar uma colher ou a mão dentro da boca dela para segurar a língua.",
      "Proteger a cabeça com algo macio, afastar objetos perigosos e marcar a duração da crise.",
      "Jogar um copo de água fria no rosto para reanimar.",
    ],
    correta: 2,
    explicacao:
      "Nunca segure a pessoa nem coloque nada na boca (ela não engole a língua!). Afaste objetos para evitar ferimentos, proteja a cabeça e cronometre a crise.",
    temaRelacionado: "convulsao",
  },
  "parada-cardiorrespiratoria": {
    id: "pratica-parada",
    emoji: "💓",
    titulo: "Simulação de Parada Cardiorrespiratória",
    cenario: "Uma pessoa desmaia subitamente. Você chama em voz alta, toca nos ombros dela e ela não responde nem respira normalmente.",
    pergunta: "Qual é a prioridade absoluta neste momento?",
    opcoes: [
      "Dar tapas no rosto e tentar fazê-la sentar.",
      "Ligar imediatamente para o SAMU 192, colocar no viva-voz e iniciar as orientações do atendente.",
      "Buscar água com açúcar na cozinha antes de qualquer coisa.",
      "Aguardar para verificar se ela acorda espontaneamente.",
    ],
    correta: 1,
    explicacao:
      "Não responsiva + não respira normalmente = emergência crítica! Acione 192 na hora no viva-voz para receber orientações de RCP e buscar um DEA se houver.",
    temaRelacionado: "parada-cardiorrespiratoria",
  },
  queimadura: {
    id: "pratica-queimadura",
    emoji: "🔥",
    titulo: "Simulação de Queimadura",
    cenario: "Água fervente respingou no braço de uma criança, e a pele ficou muito vermelha e dolorida.",
    pergunta: "Qual é o primeiro cuidado comprovadamente correto?",
    opcoes: [
      "Passar pasta de dente, manteiga ou pó de café.",
      "Colocar gelo diretamente sobre a queimadura.",
      "Resfriar o local com água corrente em temperatura ambiente por cerca de 10 a 20 minutos.",
      "Estourar qualquer bolha que possa surgir.",
    ],
    correta: 2,
    explicacao:
      "Apenas água corrente em temperatura ambiente! Não use gelo (que agrava a lesão por frio) nem produtos caseiros (que causam infecção).",
    temaRelacionado: "queimadura",
  },
  trauma: {
    id: "pratica-trauma",
    emoji: "🛡️",
    titulo: "Simulação de Trauma / Queda",
    cenario: "Uma pessoa caiu de uma escada e queixa-se de dor muito forte nas costas e no pescoço.",
    pergunta: "O que você NÃO deve fazer de jeito nenhum?",
    opcoes: [
      "Pedir que ela permaneça deitada sem mexer o pescoço.",
      "Ligar para o SAMU 192 e Bombeiros 193.",
      "Movimentar a pessoa ou colocá-la sentada para levá-la no carro por conta própria.",
      "Cobrir a pessoa com uma manta para mantê-la aquecida.",
    ],
    correta: 2,
    explicacao:
      "Nunca mova uma vítima com suspeita de lesão na coluna! Movimentos inadequados podem causar sequelas graves. Mantenha-a imóvel e aguarde o resgate especializado.",
    temaRelacionado: "trauma",
  },
};
