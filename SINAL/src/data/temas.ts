import imgEngasgo from "@/assets/tema-engasgo.webp";
import imgConvulsao from "@/assets/tema-convulsao.webp";
import imgParada from "@/assets/tema-parada.webp";
import imgQueimadura from "@/assets/tema-queimadura.webp";
import imgTrauma from "@/assets/tema-trauma.webp";

import cardEngasgo from "@/assets/card-engasgo.webp";
import cardConvulsao from "@/assets/card-convulsao.webp";
import cardParada from "@/assets/card-parada.webp";
import cardQueimadura from "@/assets/card-queimadura.webp";
import cardTrauma from "@/assets/card-trauma.webp";

export type Contato = { nome: string; numero: string };

export type LegendaAudio = {
  inicio: number;
  fim: number;
  texto: string;
};

export type ItemVideoEducativo = {
  id: string;
  titulo: string;
  subtitulo?: string;
  descricao?: string;
  src: string;
  poster?: string;
  aspectRatio?: "vertical" | "horizontal"; // 'vertical' = ~9:16, 'horizontal' = ~16:9
};

export type Tema = {
  slug: string;
  /** Nome curto usado no card 3D e na navegação. */
  title: string;
  /** Nome completo, usado nos títulos das páginas. */
  nome: string;
  /** Cor de identidade do tema (paleta oficial do Sinal). */
  color: string;
  resumo: string;
  /** Arquivo de áudio de estúdio pré-gerado em MP3 (narração fluida sem engasgos) */
  audioSrc?: string;
  /** Arquivo de vídeo educativo em MP4 (/videos/<slug>.mp4) - compatibilidade retroativa */
  videoSrc?: string;
  /** Lista de vídeos educativos (suporta múltiplos vídeos, orientações verticais 9:16 ou horizontais) */
  videos?: ItemVideoEducativo[];
  /** Legendas sincronizadas segundo a segundo com a fala exata do narrador */
  legendas?: LegendaAudio[];
  /** Imagem da página interna do tema (gerada Lovable) */
  image: string;
  /** Imagem exibida especificamente no fundo do card 3D (ilustração Teddy) */
  cardImage: string;
  aspect: number;
  cardAspect?: number;
  oQueE: string[];
  reconhecer: string[];
  fazer: string[];
  naoFazer: string[];
  ajuda: string[];
  contatos: Contato[];
};

const ASPECT = 1536 / 896;
const CARD_ASPECT = 1024 / 636;

export const temas: Tema[] = [
  {
    slug: "engasgo",
    title: "Engasgo",
    nome: "Engasgo",
    color: "#2E7DD1",
    resumo: "Quando a passagem de ar é bloqueada e cada segundo conta.",
    audioSrc: "/audio/narracao-engasgo.mp3",
    videoSrc: "/videos/engasgo-adulto.mp4",
    videos: [
      {
        id: "engasgo-bebes",
        titulo: "Vídeo 1 — Engasgo em bebês e lactentes",
        subtitulo: "Procedimento para bebês (< 1 ano)",
        descricao: "Técnica correta e segura de tapotagem (golpes dorsais) e compressões torácicas para desobstrução em lactentes (menores de 1 ano), mantendo a cabeça mais baixa que o tronco.",
        src: "/videos/Engasgo%2001.mp4",
        aspectRatio: "vertical",
      },
      {
        id: "engasgo-adultos",
        titulo: "Vídeo 2 — Engasgo em adultos e adolescentes",
        subtitulo: "Procedimento para adultos",
        descricao: "Manobra de desobstrução das vias aéreas (Manobra de Heimlich) com compressões abdominais em formato de 'J' aplicadas em adultos e adolescentes conscientes.",
        src: "/videos/Engasgo%2002.mp4",
        aspectRatio: "vertical",
      },
    ],
    legendas: [
      {
        inicio: 0.0,
        fim: 4.2,
        texto: "Atenção! Primeiros socorros para Engasgo.",
      },
      {
        inicio: 4.2,
        fim: 10.2,
        texto: "O engasgo acontece quando um alimento ou objeto bloqueia a passagem do ar.",
      },
      {
        inicio: 10.2,
        fim: 19.5,
        texto: "Como reconhecer: a pessoa leva as mãos ao pescoço, não consegue falar, tosse com dificuldade ou os lábios ficam arroxeados.",
      },
      {
        inicio: 19.5,
        fim: 32.5,
        texto: "O que fazer: mantenha a calma. Se ela ainda tosse com força, incentive a tosse. Se não conseguir respirar ou falar, ligue imediatamente para o SAMU 192 e siga as orientações para a desobstrução.",
      },
      {
        inicio: 32.5,
        fim: 38.0,
        texto: "Nunca tente puxar o objeto às cegas nem ofereça água ou pão. Cada segundo conta!",
      },
    ],
    image: imgEngasgo,
    cardImage: cardEngasgo,
    aspect: ASPECT,
    cardAspect: CARD_ASPECT,
    oQueE: [
      "O engasgo acontece quando um alimento ou objeto bloqueia, de forma parcial ou total, a passagem do ar.",
      "Com a via aérea obstruída, a pessoa passa a ter dificuldade para respirar, falar ou tossir — e a situação pode evoluir rápido.",
    ],
    reconhecer: [
      "A pessoa leva as mãos ao pescoço, um gesto quase universal de engasgo.",
      "Tosse fraca, sem som, ou nenhum som ao tentar falar.",
      "Respiração ruidosa, chiado ou esforço visível para puxar o ar.",
      "Rosto e lábios que vão ficando arroxeados.",
      "Agitação, olhos arregalados e, em casos graves, perda de consciência.",
    ],
    fazer: [
      "Mantenha a calma e fique ao lado da pessoa: sua presença já ajuda.",
      "Se ela ainda consegue tossir com força, incentive a tosse — é o jeito mais eficiente de expulsar o objeto.",
      "Se a tosse ficar fraca ou parar, e a pessoa não conseguir falar nem respirar, peça ajuda imediatamente ligando para o SAMU 192.",
      "Siga as orientações do atendente pelo telefone: a conduta muda conforme a idade (bebê, criança ou adulto) e as condições da pessoa.",
      "Observe continuamente a respiração e o nível de consciência até a ajuda chegar.",
    ],
    naoFazer: [
      "Não coloque os dedos na boca para tentar tirar o objeto às cegas — isso pode empurrá-lo ainda mais fundo.",
      "Não ofereça água, pão ou qualquer alimento para 'empurrar' o que está preso.",
      "Não bata nas costas sem saber a técnica correta para aquela idade.",
      "Não deixe a pessoa sozinha, mesmo que ela pareça melhorar.",
    ],
    ajuda: [
      "Sempre que a pessoa não conseguir falar, tossir ou respirar.",
      "Se a cor da pele ou dos lábios mudar.",
      "Se houver desmaio ou perda de consciência.",
      "Se, mesmo depois do objeto sair, permanecer tosse, dor ou falta de ar.",
    ],
    contatos: [{ nome: "SAMU", numero: "192" }],
  },
  {
    slug: "convulsao",
    title: "Convulsão",
    nome: "Convulsão",
    color: "#6D3FC3",
    resumo: "Proteger a pessoa durante a crise é mais importante do que contê-la.",
    audioSrc: "/audio/narracao-convulsao.mp3",
    videoSrc: "/videos/convulsao.mp4",
    videos: [
      {
        id: "convulsao-procedimento",
        titulo: "Vídeo educativo — Crise Convulsiva",
        subtitulo: "Procedimento de proteção e acolhimento",
        descricao: "Como proteger a cabeça, afastar objetos e posicionar a pessoa de lado após a crise.",
        src: "/videos/convulsao.mp4",
        aspectRatio: "horizontal",
      },
    ],
    legendas: [
      {
        inicio: 0.0,
        fim: 4.2,
        texto: "Atenção! Primeiros socorros para Convulsão.",
      },
      {
        inicio: 4.2,
        fim: 12.5,
        texto: "A convulsão acontece por uma atividade elétrica desordenada no cérebro. A maioria das crises dura poucos minutos e passa sozinha.",
      },
      {
        inicio: 12.5,
        fim: 21.5,
        texto: "Como reconhecer: queda súbita, movimentos involuntários dos braços e pernas, corpo rígido, salivação e olhar fixo.",
      },
      {
        inicio: 21.5,
        fim: 34.0,
        texto: "O que fazer: proteja a cabeça da pessoa com algo macio, afaste móveis ao redor e marque o tempo da crise. Quando os tremores pararem, deite a pessoa de lado para facilitar a respiração.",
      },
      {
        inicio: 34.0,
        fim: 46.0,
        texto: "Atenção: nunca segure a pessoa, não jogue água e jamais coloque objetos ou a mão na boca. Se a crise durar mais de 5 minutos, ligue imediatamente para o SAMU no 192.",
      },
    ],
    image: imgConvulsao,
    cardImage: cardConvulsao,
    aspect: ASPECT,
    cardAspect: CARD_ASPECT,
    oQueE: [
      "A convulsão acontece quando ocorre uma atividade elétrica desordenada no cérebro, o que altera de forma súbita os movimentos, a consciência ou as sensações da pessoa.",
      "A maioria das crises dura poucos minutos e termina sozinha. O papel de quem está por perto é proteger a pessoa enquanto isso passa.",
    ],
    reconhecer: [
      "Perda súbita de consciência, com queda.",
      "Movimentos rítmicos e involuntários dos braços e das pernas.",
      "Rigidez do corpo, mandíbula travada.",
      "Salivação intensa, respiração irregular durante a crise.",
      "Olhar parado, ausência ou confusão logo depois do episódio.",
      "Perda do controle da urina em alguns casos.",
    ],
    fazer: [
      "Marque o horário em que a crise começou.",
      "Afaste móveis e objetos que possam machucar a pessoa.",
      "Proteja a cabeça com algo macio, como uma peça de roupa dobrada.",
      "Afrouxe roupas apertadas no pescoço.",
      "Quando os movimentos cessarem, coloque a pessoa deitada de lado para facilitar a respiração.",
      "Fique ao lado até que ela recupere totalmente a consciência e explique com calma o que aconteceu.",
    ],
    naoFazer: [
      "Não tente segurar ou impedir os movimentos da pessoa.",
      "Não coloque a mão, colher ou qualquer objeto na boca — a pessoa não engole a língua.",
      "Não ofereça água, comida ou remédios durante ou logo após a crise.",
      "Não jogue água no rosto nem sacuda a pessoa para 'acordá-la'.",
    ],
    ajuda: [
      "Se a crise durar mais de 5 minutos.",
      "Se uma crise vier logo depois da outra.",
      "Se a pessoa não recuperar a consciência depois da crise.",
      "Se for a primeira crise da vida dela.",
      "Se houver gravidez, diabetes, ferimento, dificuldade para respirar ou se a crise ocorreu na água.",
    ],
    contatos: [{ nome: "SAMU", numero: "192" }],
  },
  {
    slug: "parada-cardiorrespiratoria",
    title: "Parada cardiorrespiratória",
    nome: "Parada cardiorrespiratória",
    color: "#FF60A7",
    resumo: "A emergência em que reconhecer rápido muda tudo.",
    audioSrc: "/audio/narracao-parada.mp3",
    videoSrc: "/videos/parada-cardiorrespiratoria.mp4",
    videos: [
      {
        id: "pcr-procedimento",
        titulo: "Vídeo educativo — Parada Cardiorrespiratória (PCR)",
        subtitulo: "Procedimento de suporte imediato",
        descricao: "Passo a passo das compressões torácicas no centro do tórax e acionamento do SAMU 192.",
        src: "/videos/Parada%20Cardiorrespirat%C3%B3ria.mp4",
        aspectRatio: "vertical",
      },
    ],
    legendas: [
      {
        inicio: 0.0,
        fim: 4.2,
        texto: "Atenção! Primeiros socorros para Parada Cardiorrespiratória.",
      },
      {
        inicio: 4.2,
        fim: 11.0,
        texto: "Esta é uma emergência crítica: o coração para de bombear sangue e o cérebro deixa de receber oxigênio. Cada minuto reduz as chances de vida.",
      },
      {
        inicio: 11.0,
        fim: 16.5,
        texto: "Como reconhecer: a pessoa desmaia, não responde ao chamado nem ao toque no ombro, e não respira normalmente.",
      },
      {
        inicio: 16.5,
        fim: 23.0,
        texto: "O que fazer imediatamente: ligue para o SAMU no 192, inicie as compressões no centro do peito com força e rapidez, e não pare até o socorro chegar. Você pode salvar uma vida!",
      },
    ],
    image: imgParada,
    cardImage: cardParada,
    aspect: ASPECT,
    cardAspect: CARD_ASPECT,
    oQueE: [
      "A parada cardiorrespiratória acontece quando o coração deixa de bombear sangue de forma eficaz e a respiração cessa.",
      "Sem circulação, o cérebro deixa de receber oxigênio em poucos minutos. É a emergência mais grave: reconhecer e pedir ajuda imediatamente faz diferença real.",
    ],
    reconhecer: [
      "A pessoa não responde quando você chama e toca o ombro dela.",
      "Não respira ou apresenta uma respiração estranha, com engasgos ou suspiros irregulares.",
      "Ausência de qualquer movimento ou reação.",
      "Pele pálida ou arroxeada.",
    ],
    fazer: [
      "Verifique se o local é seguro para você e para a pessoa.",
      "Chame a pessoa em voz alta e toque os ombros para confirmar que ela não responde.",
      "Ligue imediatamente para o SAMU 192 ou peça para alguém ligar enquanto você permanece ao lado da pessoa.",
      "Coloque o telefone no viva-voz: o atendente vai orientar passo a passo o que fazer, incluindo as compressões torácicas.",
      "Peça que alguém procure um desfibrilador (DEA), se houver um disponível no local, e siga as instruções de voz do aparelho.",
      "Siga as orientações do serviço de emergência até a equipe chegar.",
    ],
    naoFazer: [
      "Não perca tempo tentando 'acordar' a pessoa com água, tapas ou sacudidas.",
      "Não saia para buscar ajuda deixando a pessoa sozinha se puder ligar de onde está.",
      "Não interrompa as orientações do atendente antes que a equipe chegue.",
      "Não movimente a pessoa sem necessidade, a não ser que o local ofereça risco.",
    ],
    ajuda: [
      "Sempre. Toda suspeita de parada cardiorrespiratória é uma emergência: ligue 192 no primeiro sinal.",
      "Se a pessoa não responde e não respira normalmente, não espere para ver se melhora.",
      "Mesmo que ela volte a responder, o atendimento profissional continua sendo necessário.",
    ],
    contatos: [{ nome: "SAMU", numero: "192" }],
  },
  {
    slug: "queimadura",
    title: "Queimadura",
    nome: "Queimadura",
    color: "#FFC044",
    resumo: "Cuidados iniciais simples evitam que a lesão piore.",
    audioSrc: "/audio/narracao-queimadura.mp3",
    videoSrc: "/videos/queimadura.mp4",
    videos: [
      {
        id: "queimadura-procedimento",
        titulo: "Vídeo educativo — Queimaduras",
        subtitulo: "Procedimento de resfriamento e proteção",
        descricao: "Como agir com água corrente em temperatura ambiente e evitar substâncias que agravam a lesão.",
        src: "/videos/queimadura.mp4",
        aspectRatio: "horizontal",
      },
    ],
    legendas: [
      {
        inicio: 0.0,
        fim: 4.2,
        texto: "Atenção! Primeiros socorros para Queimaduras.",
      },
      {
        inicio: 4.2,
        fim: 12.0,
        texto: "Queimadura é a lesão na pele causada por calor, líquidos quentes, fogo, eletricidade ou produtos químicos.",
      },
      {
        inicio: 12.0,
        fim: 19.5,
        texto: "Como reconhecer: vermelhidão, dor intensa, inchaço e formação de bolhas com líquido.",
      },
      {
        inicio: 19.5,
        fim: 34.0,
        texto: "O que fazer: afaste a vítima da fonte de calor com segurança. Resfrie o local imediatamente com água corrente da torneira, em temperatura ambiente, por 10 a 20 minutos. Cubra a região com um pano limpo e seco.",
      },
      {
        inicio: 34.0,
        fim: 46.0,
        texto: "Nunca passe pasta de dente, manteiga, pó de café ou pomadas caseiras, e nunca estoure as bolhas. Em queimaduras graves, no rosto ou por eletricidade, ligue para o SAMU no 192 ou Bombeiros no 193.",
      },
    ],
    image: imgQueimadura,
    cardImage: cardQueimadura,
    aspect: ASPECT,
    cardAspect: CARD_ASPECT,
    oQueE: [
      "Queimadura é uma lesão da pele e, às vezes, dos tecidos mais profundos, provocada por calor, líquidos quentes, chamas, eletricidade, produtos químicos ou pelo sol.",
      "A gravidade depende da profundidade, da extensão e da região atingida — rosto, mãos, articulações e vias aéreas exigem atenção redobrada.",
    ],
    reconhecer: [
      "Vermelhidão, calor local e dor: sinais das queimaduras mais superficiais.",
      "Bolhas com líquido, dor intensa e pele úmida: lesão mais profunda.",
      "Pele esbranquiçada, escurecida ou com aspecto de couro, muitas vezes com pouca dor: sinal de gravidade.",
      "Fuligem no nariz ou na boca, rouquidão e tosse depois de incêndio: possível queimadura das vias aéreas.",
    ],
    fazer: [
      "Interrompa o contato com a fonte de calor com segurança, sem se expor ao risco.",
      "Resfrie a área com água corrente em temperatura ambiente por cerca de 10 a 20 minutos.",
      "Retire com cuidado anéis, pulseiras e relógios antes que a região inche.",
      "Cubra a área com um pano limpo, seco e que não solte fiapos.",
      "Mantenha a pessoa aquecida e calma e procure atendimento conforme a gravidade.",
    ],
    naoFazer: [
      "Não passe manteiga, pasta de dente, borra de café, pó de café ou qualquer receita caseira.",
      "Não use gelo nem água muito gelada diretamente sobre a queimadura.",
      "Não estoure bolhas.",
      "Não puxe roupa que esteja grudada na pele.",
      "Não aplique pomadas por conta própria antes da avaliação profissional.",
    ],
    ajuda: [
      "Queimaduras extensas ou profundas.",
      "Queimaduras no rosto, pescoço, mãos, pés, articulações ou região genital.",
      "Queimaduras por eletricidade, produtos químicos ou ocorridas em incêndio com fumaça.",
      "Queimaduras em bebês, crianças, idosos ou pessoas com doenças crônicas.",
      "Sinais de dificuldade para respirar, confusão ou dor incontrolável.",
    ],
    contatos: [
      { nome: "SAMU", numero: "192" },
      { nome: "Corpo de Bombeiros", numero: "193" },
    ],
  },
  {
    slug: "trauma",
    title: "Trauma",
    nome: "Trauma",
    color: "#53C6B6",
    resumo: "Segurança da cena primeiro: proteger antes de socorrer.",
    audioSrc: "/audio/narracao-trauma.mp3",
    videoSrc: "/videos/trauma.mp4",
    videos: [
      {
        id: "trauma-procedimento",
        titulo: "Vídeo educativo — Trauma e Acidentes",
        subtitulo: "Segurança da cena e imobilização",
        descricao: "Como avaliar a cena, acalmar a vítima sem movimentá-la e chamar o socorro de emergência.",
        src: "/videos/trauma.mp4",
        aspectRatio: "horizontal",
      },
    ],
    legendas: [
      {
        inicio: 0.0,
        fim: 4.2,
        texto: "Atenção! Primeiros socorros para Trauma.",
      },
      {
        inicio: 4.2,
        fim: 11.5,
        texto: "Trauma é qualquer lesão causada por impacto físico: quedas, acidentes de trânsito ou pancadas fortes.",
      },
      {
        inicio: 11.5,
        fim: 20.0,
        texto: "Como reconhecer: dor forte, inchaço, deformidade nos membros, sangramento ou confusão mental após uma batida.",
      },
      {
        inicio: 20.0,
        fim: 35.0,
        texto: "O que fazer: primeiro avalie a segurança do local. Peça para a vítima ficar calma e não se mexer, principalmente a cabeça e o pescoço. Se houver sangramento, comprima o local com um pano limpo. Mantenha a pessoa aquecida e ligue imediatamente para o SAMU no 192 ou Bombeiros no 193.",
      },
      {
        inicio: 35.0,
        fim: 44.0,
        texto: "Jamais movimente a vítima nem tente colocar ossos no lugar. Aguarde a equipe especializada.",
      },
    ],
    image: imgTrauma,
    cardImage: cardTrauma,
    aspect: ASPECT,
    cardAspect: CARD_ASPECT,
    oQueE: [
      "Trauma é a lesão causada por um impacto no corpo: quedas, acidentes de trânsito, atropelamentos, colisões durante o esporte, ferimentos por objetos.",
      "Nem toda lesão é visível. Por isso, em situações de trauma, a prioridade é manter a segurança do ambiente e evitar movimentos desnecessários.",
    ],
    reconhecer: [
      "Dor intensa, inchaço ou deformidade em algum membro.",
      "Sangramento visível, ferimentos abertos ou hematomas grandes.",
      "Dificuldade ou incapacidade de mover uma parte do corpo.",
      "Confusão, sonolência, vômito ou desmaio depois de uma batida na cabeça.",
      "Dor no pescoço ou nas costas, formigamento ou perda de força.",
      "Pele fria, pálida e suada — sinal de alerta que exige emergência.",
    ],
    fazer: [
      "Avalie a cena: só se aproxime se for seguro para você.",
      "Sinalize o local em caso de acidente de trânsito, se puder fazer isso com segurança.",
      "Fale com a pessoa e peça que ela permaneça parada, principalmente se houver dor no pescoço ou nas costas.",
      "Em caso de sangramento, faça pressão direta sobre o ferimento com um pano limpo.",
      "Cubra a pessoa para mantê-la aquecida e acompanhe a respiração e o nível de consciência.",
      "Ligue para o SAMU 192 e, em situações que envolvam veículos, incêndio ou desencarceramento, acione o Corpo de Bombeiros 193.",
    ],
    naoFazer: [
      "Não movimente nem transporte a pessoa por conta própria, exceto se houver risco imediato no local.",
      "Não tente recolocar ossos no lugar nem endireitar membros deformados.",
      "Não retire capacete, objetos encravados ou fragmentos do ferimento.",
      "Não ofereça água, comida ou remédios.",
      "Não aglomere em volta da vítima: espaço e calma também são cuidado.",
    ],
    ajuda: [
      "Sempre que houver perda de consciência, mesmo que breve.",
      "Sangramento que não para com pressão direta.",
      "Suspeita de fratura, lesão na cabeça, no pescoço ou na coluna.",
      "Acidentes de trânsito, quedas de altura ou impactos fortes.",
      "Se a pessoa apresentar confusão, vômitos, dificuldade para respirar ou piora progressiva.",
    ],
    contatos: [
      { nome: "SAMU", numero: "192" },
      { nome: "Corpo de Bombeiros", numero: "193" },
    ],
  },
];

export const temaBySlug = (slug: string) => temas.find((t) => t.slug === slug);

export const METODO = [
  {
    titulo: "Reconhecer",
    texto: "Perceber os sinais e identificar que algo está errado.",
    cor: "#2E7DD1",
  },
  {
    titulo: "Entender",
    texto: "Compreender o que está acontecendo e por que aquela situação exige atenção.",
    cor: "#6D3FC3",
  },
  {
    titulo: "Agir",
    texto: "Saber quais são os primeiros passos e quais atitudes devem ser evitadas.",
    cor: "#FFC044",
  },
  {
    titulo: "Proteger",
    texto: "Priorizar a segurança e saber quando acionar ajuda especializada.",
    cor: "#53C6B6",
  },
];
