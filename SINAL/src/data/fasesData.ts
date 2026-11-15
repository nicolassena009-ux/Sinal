import type { ConfiguracaoFase, ThemeSlug } from "@/types/minigame";

export const FASES_CONFIG: Record<ThemeSlug, ConfiguracaoFase> = {
  engasgo: {
    slug: "engasgo",
    titulo: "Mini Fase: Socorro no Refeitório",
    subtitulo: "Reconhecimento de obstrução e suporte imediato",
    cor: "#2E7DD1",
    cenarioNome: "Refeitório Escolar",
    cenarioTipo: "refeitorio",
    vitimaNome: "Lucas",
    vitimaDescricao: "Lucas estava comendo quando de repente levou as duas mãos ao pescoço.",
    etapas: [
      {
        id: "etapa-1-engasgo",
        titulo: "Etapa 1: Avaliar os Sinais",
        instrucao: "Aproxime-se de Lucas usando as setas do teclado (ou o direcional na tela) e observe a respiração dele.",
        falaPersonagem: "Lucas está com os olhos arregalados, mãos no pescoço, mas ainda consegue tossir com bastante força!",
        pergunta: "Lucas ainda tosse com força. Qual é a conduta comprovadamente correta neste momento?",
        escolhas: [
          {
            id: "opt-agua",
            texto: "Oferecer um copo de água ou pão para tentar 'empurrar' o que está preso.",
            correta: false,
            explicacao:
              "Nunca dê água ou alimentos para quem está engasgado! Isso pode empurrar o objeto ainda mais fundo ou causar broncoaspiração grave.",
          },
          {
            id: "opt-tossir",
            texto: "Incentivar Lucas a continuar tossindo com força e manter a calma ao lado dele.",
            correta: true,
            explicacao:
              "Muito bem! A tosse forte espontânea é o recurso mais eficaz do próprio corpo para expulsar o corpo estranho quando a via aérea ainda não está totalmente bloqueada.",
          },
          {
            id: "opt-dedo",
            texto: "Colocar os dedos no fundo da garganta dele para tentar puxar às cegas.",
            correta: false,
            explicacao:
              "Nunca coloque o dedo na boca às cegas! Sem enxergar com clareza, você pode empurrar o objeto para uma área ainda mais profunda e perigosa.",
          },
        ],
      },
      {
        id: "etapa-2-engasgo",
        titulo: "Etapa 2: Obstrução Grave",
        instrucao: "A tosse parou completamente. Lucas não emite som algum e não consegue puxar o ar.",
        falaPersonagem: "Lucas não consegue mais tossir nem falar! A obstrução agora é total!",
        pergunta: "A passagem de ar foi totalmente bloqueada. O que deve ser feito com urgência máxima?",
        escolhas: [
          {
            id: "opt-samu",
            texto: "Ligar imediatamente para o SAMU 192 (colocar no viva-voz), pedir socorro a adultos por perto e iniciar as manobras orientadas pelo atendente.",
            correta: true,
            explicacao:
              "Correto e essencial! Em engasgos totais (sem som, sem ar), o acionamento do 192 no viva-voz e o início das manobras de desobstrução salvam vidas a cada segundo.",
          },
          {
            id: "opt-sacudir",
            texto: "Sacudir a pessoa de cabeça para baixo e aguardar 10 minutos para ver se melhora.",
            correta: false,
            explicacao:
              "Sacudir pode causar traumas cervicais e esperar 10 minutos é fatal em uma emergência de parada respiratória.",
          },
          {
            id: "opt-tapa",
            texto: "Dar tapas aleatórios na cabeça ou jogar água gelada no peito.",
            correta: false,
            explicacao:
              "Tapas desordenados não desobstruem as vias aéreas e machucam a vítima.",
          },
        ],
      },
    ],
    resumoEducativoFinal: {
      oQueFazer: [
        "Incentive a tosse se a pessoa ainda conseguir tossir com força.",
        "Se não sair som e ela não conseguir respirar, chame ajuda e ligue para o SAMU 192 imediatamente.",
        "Mantenha a calma e fique ao lado da pessoa o tempo todo.",
      ],
      oQueNaoFazer: [
        "Não ofereça água, pão ou alimentos para 'empurrar' o que está entalado.",
        "Não tente retirar o objeto com o dedo às cegas.",
        "Não dê tapas desordenados sem conhecer a técnica correta.",
      ],
      quandoChamarAjuda:
        "Sempre que a pessoa não conseguir falar, tossir ou respirar, ou se os lábios começarem a ficar arroxeados.",
    },
  },

  convulsao: {
    slug: "convulsao",
    titulo: "Mini Fase: Segurança na Crise",
    subtitulo: "Protegendo o colega sem interferir bruscamente",
    cor: "#6D3FC3",
    cenarioNome: "Sala de Aula",
    cenarioTipo: "sala_aula",
    vitimaNome: "Beatriz",
    vitimaDescricao: "Beatriz caiu subitamente com movimentos musculares involuntários.",
    etapas: [
      {
        id: "etapa-1-convulsao",
        titulo: "Etapa 1: Ambiente Seguro",
        instrucao: "Mova seu personagem até Beatriz. Há carteiras com quinas pontiagudas por perto.",
        falaPersonagem: "Beatriz está no chão com contrações musculares rítmicas e rigidez corporal.",
        pergunta: "Qual é a prioridade imediata para proteger Beatriz durante a crise?",
        escolhas: [
          {
            id: "opt-segurar",
            texto: "Segurar os braços e as pernas dela com força para conter os tremores.",
            correta: false,
            explicacao:
              "Nunca segure a pessoa! Tentar conter os espasmos com força pode causar fraturas ósseas e lesões graves nos ligamentos.",
          },
          {
            id: "opt-afastar",
            texto: "Afastar móveis pontiagudos ao redor e colocar algo macio (como um casaco dobrado) sob a cabeça dela.",
            correta: true,
            explicacao:
              "Exatamente! Proteger a cabeça contra impactos no chão e afastar objetos pontiagudos é o cuidado mais nobre e eficaz durante a convulsão.",
          },
          {
            id: "opt-agua",
            texto: "Jogar água fria no rosto para tentar fazê-la acordar mais rápido.",
            correta: false,
            explicacao:
              "Jogar água pode causar afogamento/broncoaspiração enquanto a consciência está alterada.",
          },
        ],
      },
      {
        id: "etapa-2-convulsao",
        titulo: "Etapa 2: Mitos e Pós-Crise",
        instrucao: "Um colega apavorado sugere colocar uma caneta na boca de Beatriz.",
        falaPersonagem: "Os tremores estão diminuindo. Alguém sugere: 'Puxa a língua dela!'",
        pergunta: "Como você deve orientar o grupo e proceder agora?",
        escolhas: [
          {
            id: "opt-lingua",
            texto: "Colocar os dedos ou uma colher dentro da boca para segurar a língua.",
            correta: false,
            explicacao:
              "Mito perigoso! Ninguém engole a própria língua. Colocar objetos na boca quebra dentes e pode ferir gravemente os dedos de quem tenta ajudar.",
          },
          {
            id: "opt-recuperacao",
            texto: "Não colocar nada na boca, marcar o tempo da crise (se passar de 5 min, ligar 192) e, ao final, deitá-la suavemente de lado.",
            correta: true,
            explicacao:
              "Perfeito! Deitar de lado (posição lateral de segurança) após os tremores facilita a respiração e evita que saliva ou secreções obstruam a passagem de ar.",
          },
          {
            id: "opt-sacudir",
            texto: "Colocar a pessoa sentada e dar um remédio para dor de cabeça imediatamente.",
            correta: false,
            explicacao:
              "Nunca dê remédios, líquidos ou comida para quem acabou de ter uma crise e ainda está sonolenta.",
          },
        ],
      },
    ],
    resumoEducativoFinal: {
      oQueFazer: [
        "Afaste móveis e objetos pontiagudos que possam machucar a pessoa.",
        "Proteja a cabeça com algo macio (casaco, mochila macia, toalha).",
        "Marque no relógio a duração da crise.",
        "Quando os movimentos pararem, coloque a pessoa deitada de lado.",
      ],
      oQueNaoFazer: [
        "Não tente segurar ou impedir os movimentos involuntários.",
        "Nunca coloque as mãos, colheres ou objetos na boca da pessoa.",
        "Não jogue água no rosto nem sacuda a pessoa.",
        "Não ofereça remédios ou água até recuperação completa.",
      ],
      quandoChamarAjuda:
        "Ligue 192 se a crise durar mais de 5 minutos, se uma crise vier logo após a outra, ou se a pessoa não acordar.",
    },
  },

  "parada-cardiorrespiratoria": {
    slug: "parada-cardiorrespiratoria",
    titulo: "Mini Fase: Cada Minuto Conta",
    subtitulo: "Reconhecimento da PCR e compressões torácicas contínuas",
    cor: "#FF60A7",
    cenarioNome: "Parque / Pátio Esportivo",
    cenarioTipo: "parque",
    vitimaNome: "Adulto Desconhecido",
    vitimaDescricao: "Um adulto desmaiou de repente no chão e está imóvel.",
    etapas: [
      {
        id: "etapa-1-pcr",
        titulo: "Etapa 1: Checagem Rápida",
        instrucao: "Mova-se até a vítima e certifique-se de que a cena ao redor é segura para você.",
        falaPersonagem: "A vítima está deitada de costas no chão e não se mexe.",
        pergunta: "Como verificar com segurança se trata-se de uma emergência de parada?",
        escolhas: [
          {
            id: "opt-ombros",
            texto: "Tocar firmemente nos dois ombros, chamar em voz alta ('Você me ouve?') e observar o peito por alguns segundos.",
            correta: true,
            explicacao:
              "Correto! Se a pessoa não responder e não respirar normalmente (ou só emitir suspiros anormais), trata-se de parada cardiorrespiratória!",
          },
          {
            id: "opt-tapas",
            texto: "Dar tapas no rosto da pessoa e tentar levantá-la sentada.",
            correta: false,
            explicacao:
              "Tapas não reanimam ninguém e sentar a pessoa reduz a pouca circulação sanguínea que ainda chega ao cérebro.",
          },
          {
            id: "opt-esperar",
            texto: "Aguardar 10 minutos para ver se a pressão volta ao normal.",
            correta: false,
            explicacao:
              "Cada minuto sem socorro reduz em até 10% as chances de sobrevivência da vítima.",
          },
        ],
      },
      {
        id: "etapa-2-pcr",
        titulo: "Etapa 2: Acionamento e Compressões",
        instrucao: "A pessoa não responde e não respira! Cada segundo faz diferença.",
        falaPersonagem: "Não há resposta nem respiração normal!",
        pergunta: "Qual é a sequência que salva vidas segundo as diretrizes de primeiros socorros?",
        escolhas: [
          {
            id: "opt-rcp",
            texto: "Ligar imediatamente para o SAMU 192 (colocar no viva-voz), pedir para alguém buscar um DEA e iniciar compressões firmes no centro do peito.",
            correta: true,
            explicacao:
              "Excelente! As compressões contínuas no centro do peito bombeiam sangue artificialmente para o cérebro e coração até a equipe de resgate chegar.",
          },
          {
            id: "opt-sair",
            texto: "Sair correndo para buscar um copo de água com açúcar na cantina.",
            correta: false,
            explicacao:
              "Nunca abandone uma vítima em parada para buscar água. Ligue de onde está pelo celular no viva-voz!",
          },
          {
            id: "opt-pulso",
            texto: "Perder tempo tentando achar pulso sem ter treinamento médico avançado.",
            correta: false,
            explicacao:
              "Leigos não devem perder tempo procurando pulso: ausência de resposta + ausência de respiração normal = inicie as compressões!",
          },
        ],
      },
    ],
    resumoEducativoFinal: {
      oQueFazer: [
        "Verifique a segurança da cena antes de se aproximar.",
        "Toque nos ombros e chame em voz alta para checar se responde.",
        "Se não responder e não respirar: ligue 192 no viva-voz imediatamente.",
        "Posicione as mãos sobrepostas no centro do peito e comprima com ritmo de 100 a 120/min.",
      ],
      oQueNaoFazer: [
        "Não perca tempo tentando acordar a pessoa com tapas ou água.",
        "Não saia do local deixando a vítima sozinha se puder ligar de onde está.",
        "Não interrompa as orientações do atendente antes da ambulância chegar.",
      ],
      quandoChamarAjuda:
        "Imediatamente! Toda suspeita de parada é emergência médica absoluta: ligue 192 no primeiro sinal.",
    },
  },

  queimadura: {
    slug: "queimadura",
    titulo: "Mini Fase: Cuidados com a Pele",
    subtitulo: "Resfriamento seguro e rejeição de mitos perigosos",
    cor: "#FFC044",
    cenarioNome: "Cozinha Doméstica",
    cenarioTipo: "cozinha",
    vitimaNome: "Gabriel",
    vitimaDescricao: "Líquido quente respingou no antebraço de Gabriel próximo ao fogão.",
    etapas: [
      {
        id: "etapa-1-queimadura",
        titulo: "Etapa 1: Resfriar Corretamente",
        instrucao: "Mova-se com Gabriel para longe do fogão até a pia com água corrente.",
        falaPersonagem: "O braço de Gabriel está muito vermelho, quente e ardendo intensamente!",
        pergunta: "Qual é o primeiro procedimento correto e comprovado para aliviar a queimadura?",
        escolhas: [
          {
            id: "opt-torneira",
            texto: "Colocar o local queimado sob água corrente da torneira, em temperatura ambiente, por 10 a 20 minutos.",
            correta: true,
            explicacao:
              "Perfeito! A água corrente da torneira resfria o tecido com suavidade, interrompe a progressão do calor nas camadas profundas e alivia a dor.",
          },
          {
            id: "opt-gelo",
            texto: "Colocar pedras de gelo diretamente sobre a queimadura.",
            correta: false,
            explicacao:
              "Nunca use gelo! O frio extremo do gelo causa uma nova lesão na pele fragilizada (queimadura térmica por frio).",
          },
          {
            id: "opt-pasta",
            texto: "Passar pasta de dente, manteiga ou borra de café.",
            correta: false,
            explicacao:
              "Receitas caseiras prendem o calor dentro da pele e aumentam drasticamente o risco de infecções graves.",
          },
        ],
      },
      {
        id: "etapa-2-queimadura",
        titulo: "Etapa 2: Proteger a Lesão",
        instrucao: "Após o resfriamento com água corrente, a dor diminuiu um pouco.",
        falaPersonagem: "A pele continua sensível. Algumas pequenas bolhas começaram a surgir.",
        pergunta: "Como finalizar o cuidado inicial com segurança?",
        escolhas: [
          {
            id: "opt-pano",
            texto: "Cobrir suavemente com um pano limpo, seco e que não solte fiapos, sem estourar as bolhas.",
            correta: true,
            explicacao:
              "Correto! O pano limpo protege contra bactérias do ar. Nunca estoure bolhas, pois a pele da bolha é o melhor curativo biológico natural.",
          },
          {
            id: "opt-furar",
            texto: "Furar todas as bolhas com agulha para drenar o líquido.",
            correta: false,
            explicacao:
              "Furar bolhas abre uma porta direta de entrada para bactérias e agrava a cicatrização.",
          },
          {
            id: "opt-algodao",
            texto: "Colocar chumaços de algodão seco colados na ferida.",
            correta: false,
            explicacao:
              "Os fiapos de algodão grudam na pele queimada e machucam muito ao serem retirados no hospital.",
          },
        ],
      },
    ],
    resumoEducativoFinal: {
      oQueFazer: [
        "Afaste a pessoa da fonte de calor com segurança.",
        "Resfrie a área com água corrente em temperatura ambiente por 10 a 20 minutos.",
        "Retire com cuidado anéis e pulseiras antes que a região inche.",
        "Cubra com um pano limpo e seco que não solte fiapos.",
      ],
      oQueNaoFazer: [
        "Não passe pasta de dente, manteiga, óleo, café ou pomadas caseiras.",
        "Não aplique gelo diretamente na queimadura.",
        "Não estoure as bolhas.",
        "Não puxe tecidos de roupas colados à queimadura.",
      ],
      quandoChamarAjuda:
        "Ligue 192 ou 193 em queimaduras extensas, no rosto, mãos, genitais ou causadas por choque elétrico.",
    },
  },

  trauma: {
    slug: "trauma",
    titulo: "Mini Fase: Proteção e Imobilidade",
    subtitulo: "Segurança da cena, controle de lesão e de sangramento",
    cor: "#53C6B6",
    cenarioNome: "Quadra Poliesportiva",
    cenarioTipo: "quadra",
    vitimaNome: "Mateus",
    vitimaDescricao: "Mateus caiu de mau jeito, relata dor no pescoço e tem um ferimento com sangue no joelho.",
    etapas: [
      {
        id: "etapa-1-trauma",
        titulo: "Etapa 1: Segurança da Vítima",
        instrucao: "Mova-se com cuidado até Mateus na quadra. Alguém tenta colocá-lo em pé.",
        falaPersonagem: "Mateus diz que bateu as costas e sente muita dor no pescoço.",
        pergunta: "Amigos querem levantar Mateus pelos braços. Qual é a orientação correta?",
        escolhas: [
          {
            id: "opt-imovel",
            texto: "Pedir que ele permaneça deitado e calmo, sem mover a cabeça e o pescoço.",
            correta: true,
            explicacao:
              "Excelente! Em traumas com suspeita de lesão na coluna ou pescoço, manter a pessoa parada e alinhada evita lesões permanentes na medula.",
          },
          {
            id: "opt-levantar",
            texto: "Ajudá-lo a sentar e caminhar para ver se os ossos estão no lugar.",
            correta: false,
            explicacao:
              "Movimentar uma vítima de trauma pode transformar uma fratura estável em uma lesão medular incapacitante.",
          },
          {
            id: "opt-estalar",
            texto: "Tentar estalar o pescoço para 'ajeitar' a coluna.",
            correta: false,
            explicacao:
              "Nunca tente alinhar ossos ou mexer na coluna de uma vítima de queda!",
          },
        ],
      },
      {
        id: "etapa-2-trauma",
        titulo: "Etapa 2: Sangramento e Ajuda",
        instrucao: "Há um sangramento contínuo no ferimento do joelho.",
        falaPersonagem: "O sangue continua saindo do corte no joelho.",
        pergunta: "Como conter o sangramento e acionar o atendimento especializado?",
        escolhas: [
          {
            id: "opt-pressao",
            texto: "Fazer compressão direta sobre o ferimento com um pano limpo e acionar o SAMU 192 / Bombeiros 193.",
            correta: true,
            explicacao:
              "Correto! A pressão contínua e firme com tecido limpo estanca a grande maioria dos sangramentos até a chegada do resgate.",
          },
          {
            id: "opt-torniquete",
            texto: "Fazer um torniquete caseiro com arame ou cadarço apertado no limite.",
            correta: false,
            explicacao:
              "Torniquetes improvisados sem conhecimento técnico cortam a circulação sanguínea e podem levar à amputação do membro.",
          },
          {
            id: "opt-po",
            texto: "Colocar pó de café ou terra sobre o corte para estancar.",
            correta: false,
            explicacao:
              "Substâncias estranhas contaminam a corrente sanguínea e causam infecções graves.",
          },
        ],
      },
    ],
    resumoEducativoFinal: {
      oQueFazer: [
        "Avalie a segurança da cena antes de se aproximar.",
        "Peça para a pessoa permanecer parada, principalmente cabeça e pescoço.",
        "Em caso de sangramento, faça pressão direta contínua com pano limpo.",
        "Mantenha a pessoa aquecida e ligue para o SAMU 192 ou Bombeiros 193.",
      ],
      oQueNaoFazer: [
        "Não movimente ou transporte a pessoa por conta própria.",
        "Não tente colocar ossos no lugar ou endireitar membros deformados.",
        "Não ofereça água ou remédios para quem sofreu queda forte.",
        "Não retire capacetes em acidentes de moto ou bicicleta.",
      ],
      quandoChamarAjuda:
        "Sempre em quedas de altura, batidas na cabeça, dor no pescoço/coluna, sangramentos importantes ou desmaio.",
    },
  },
};
