import type { ThemeSlug, ConfiguracaoFase } from "@/types/minigame";
import type { Point, Obstacle } from "@/components/minigames/movement";

export interface Objective extends Point {
  task: string;
  seconds: number;
  done: string;
  target: string;
}
export interface SceneItem extends Point {
  id: string;
  label: string;
  kind: "adult" | "victim" | "phone" | "cloth" | "cone" | "clock" | "bag";
}
export interface GameLevel {
  theme: ThemeSlug;
  number: number;
  title: string;
  objectives: Objective[];
}
export interface GameTheme {
  slug: ThemeSlug;
  name: string;
  color: string;
  icon: string;
  scene: ConfiguracaoFase["cenarioTipo"];
  items: SceneItem[];
  obstacles: Obstacle[];
  levels: GameLevel[];
}
const item = (
  id: string,
  label: string,
  kind: SceneItem["kind"],
  x: number,
  y: number,
): SceneItem => ({ id, label, kind, x, y });
const task = (
  task: string,
  target: string,
  x: number,
  y: number,
  done: string,
  seconds = 1.5,
): Objective => ({ task, target, x, y, done, seconds });
const adult = item("adult", "Professora", "adult", 300, 130);
const phone = item("phone", "192", "phone", 320, 65);
const level = (
  theme: ThemeSlug,
  number: number,
  title: string,
  objectives: Objective[],
): GameLevel => ({ theme, number, title, objectives });
export const GAME_THEMES: GameTheme[] = [
  {
    slug: "engasgo",
    name: "Engasgo",
    icon: "◉",
    color: "#2E7DD1",
    scene: "refeitorio",
    items: [item("victim", "Lucas", "victim", 245, 145), adult, phone],
    obstacles: [{ x: 160, y: 80, width: 70, height: 50 }],
    levels: [
      level("engasgo", 1, "Reconhecer e acompanhar", [
        task("Observar Lucas", "victim", 245, 145, "Você observou Lucas e sua tosse."),
        task("Chamar a professora", "adult", 300, 130, "A professora foi avisada."),
        task(
          "Acompanhar a tosse junto à professora",
          "victim",
          245,
          145,
          "Você permaneceu por perto, junto à professora.",
        ),
      ]),
      level("engasgo", 2, "Pedir ajuda", [
        task(
          "Observar a mudança dos sinais de Lucas",
          "victim",
          245,
          145,
          "Você percebeu a mudança e a necessidade de ajuda.",
        ),
        task("Chamar um adulto", "adult", 300, 130, "Um adulto está acompanhando Lucas."),
        task(
          "Acionar o 192 com o adulto",
          "phone",
          320,
          85,
          "No jogo, o pedido de ajuda foi feito. Siga as orientações do atendente.",
        ),
      ]),
    ],
  },
  {
    slug: "convulsao",
    name: "Convulsão",
    icon: "✦",
    color: "#6D3FC3",
    scene: "sala_aula",
    items: [
      item("victim", "Beatriz", "victim", 200, 135),
      adult,
      item("bag", "Objeto", "bag", 160, 130),
      item("cloth", "Casaco macio", "cloth", 55, 70),
      item("clock", "Cronômetro", "clock", 250, 70),
    ],
    obstacles: [{ x: 80, y: 85, width: 34, height: 32 }],
    levels: [
      level("convulsao", 1, "Proteger o espaço", [
        task(
          "Observar Beatriz",
          "victim",
          200,
          135,
          "Você reconheceu que Beatriz precisa de ajuda.",
        ),
        task(
          "Afastar o objeto próximo",
          "bag",
          160,
          130,
          "O objeto foi afastado do espaço ao redor.",
        ),
        task(
          "Buscar um casaco macio",
          "cloth",
          55,
          70,
          "O casaco está disponível para proteger a cabeça.",
        ),
      ]),
      level("convulsao", 2, "Acompanhar a crise", [
        task(
          "Proteger a cabeça sem conter os movimentos",
          "victim",
          200,
          135,
          "A cabeça está protegida com apoio macio, sem conter os movimentos.",
        ),
        task(
          "Marcar o tempo da crise",
          "clock",
          250,
          70,
          "O tempo começou a ser acompanhado. A barra do jogo não representa a duração da crise.",
        ),
        task(
          "Chamar a professora",
          "adult",
          300,
          130,
          "A professora foi chamada para acompanhar e buscar socorro.",
        ),
      ]),
    ],
  },
  {
    slug: "parada-cardiorrespiratoria",
    name: "Parada cardiorrespiratória",
    icon: "♡",
    color: "#BF3077",
    scene: "parque",
    items: [
      item("victim", "Pessoa", "victim", 200, 125),
      adult,
      phone,
      item("cone", "Acesso", "cone", 100, 100),
    ],
    obstacles: [],
    levels: [
      level("parada-cardiorrespiratoria", 1, "Reconhecer a emergência", [
        task(
          "Verificar a segurança do local",
          "cone",
          100,
          100,
          "Você observou a segurança antes de se aproximar.",
        ),
        task(
          "Observar resposta e respiração",
          "victim",
          200,
          125,
          "A situação exige ajuda imediata.",
        ),
        task(
          "Acionar o 192",
          "phone",
          320,
          85,
          "No jogo, o 192 foi acionado. Siga as orientações do atendente.",
        ),
      ]),
      level("parada-cardiorrespiratoria", 2, "Organizar o socorro", [
        task(
          "Pedir que um adulto busque o DEA",
          "adult",
          300,
          130,
          "Um adulto foi orientado a buscar o DEA.",
        ),
        task("Sinalizar o acesso para o socorro", "cone", 100, 100, "O acesso foi sinalizado."),
        task(
          "Permanecer junto à pessoa seguindo o atendente",
          "victim",
          200,
          125,
          "Você permaneceu junto à pessoa. Este jogo não simula manobras clínicas.",
        ),
      ]),
    ],
  },
  {
    slug: "queimadura",
    name: "Queimadura",
    icon: "♨",
    color: "#996100",
    scene: "cozinha",
    items: [
      item("victim", "Gabriel", "victim", 245, 120),
      item("adult", "Adulto", "adult", 100, 120),
      item("cloth", "Pano limpo", "cloth", 310, 145),
    ],
    obstacles: [
      { x: 170, y: 55, width: 60, height: 40 },
      { x: 40, y: 55, width: 45, height: 40 },
    ],
    levels: [
      level("queimadura", 1, "Afastar o calor", [
        task(
          "Chamar um adulto para tornar o fogão seguro",
          "adult",
          100,
          120,
          "O adulto cuida da fonte de calor; você mantém distância do fogão.",
        ),
        task(
          "Acompanhar Gabriel",
          "victim",
          245,
          120,
          "Gabriel está acompanhado por você e pelo adulto.",
        ),
        task(
          "Abrir a torneira da pia",
          "sink",
          200,
          104,
          "A torneira da pia foi aberta, longe do fogão.",
        ),
      ]),
      level("queimadura", 2, "Resfriar e proteger", [
        task(
          "Ajudar junto à pia com o adulto",
          "sink",
          200,
          104,
          "Você ajudou junto à pia. O tempo abreviado do jogo não é a duração real do resfriamento.",
        ),
        task("Buscar um pano limpo", "cloth", 310, 145, "O pano limpo foi levado ao adulto."),
        task(
          "Ajudar o adulto a proteger a região",
          "victim",
          245,
          120,
          "O adulto acompanha a proteção da região e a busca de orientação.",
        ),
      ]),
    ],
  },
  {
    slug: "trauma",
    name: "Trauma",
    icon: "◇",
    color: "#177C70",
    scene: "quadra",
    items: [
      item("victim", "Mateus", "victim", 200, 125),
      adult,
      phone,
      item("cone", "Sinalização", "cone", 100, 100),
      item("cloth", "Compressa", "cloth", 55, 70),
    ],
    obstacles: [],
    levels: [
      level("trauma", 1, "Proteger a cena", [
        task("Sinalizar a área", "cone", 100, 100, "A área foi sinalizada."),
        task(
          "Observar Mateus sem movimentá-lo",
          "victim",
          200,
          125,
          "Você observou Mateus sem mudar sua posição.",
        ),
        task("Chamar um adulto", "adult", 300, 130, "Um adulto foi chamado para ajudar."),
      ]),
      level("trauma", 2, "Buscar apoio", [
        task("Buscar uma compressa", "cloth", 55, 70, "Você encontrou uma compressa."),
        task(
          "Entregar a compressa ao adulto",
          "adult",
          300,
          130,
          "A compressa foi entregue ao adulto.",
        ),
        task(
          "Acionar o 192",
          "phone",
          320,
          85,
          "No jogo, o 192 foi acionado para orientar o socorro.",
        ),
      ]),
    ],
  },
];
export function findTheme(value: unknown) {
  return GAME_THEMES.find((t) => t.slug === value);
}
