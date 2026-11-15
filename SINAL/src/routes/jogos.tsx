import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTeddy } from "@/components/TeddyMascote";
import { Footer } from "@/components/Footer";
import { GAME_THEMES, findTheme } from "@/data/gameplay";
import { MiniGameShell } from "@/components/minigames/MiniGameShell";
import { AvatarCustomizerModal } from "@/components/minigames/AvatarCustomizerModal";
import { readGameProgress } from "@/lib/gameProgress";
import { useSinalStore } from "@/lib/sinalStore";
import { HighContrastToggle } from "@/components/HighContrastToggle";
import { Teddy3D } from "@/components/Teddy3D";
import "@/components/minigames/gameplay.css";

import cardEngasgo from "@/assets/card-engasgo.webp";
import cardConvulsao from "@/assets/card-convulsao.webp";
import cardParada from "@/assets/card-parada.webp";
import cardQueimadura from "@/assets/card-queimadura.webp";
import cardTrauma from "@/assets/card-trauma.webp";

import {
  Sparkles,
  CheckCircle2,
  Play,
  ArrowRight,
  ShieldAlert,
  Gamepad2,
  User,
  Heart,
  Flame,
  Brain,
  Shield,
  Apple,
  Star,
  Award,
  ChevronRight,
  Clock,
  MapPin,
  HelpCircle,
  RotateCcw,
} from "lucide-react";

export const Route = createFileRoute("/jogos")({
  validateSearch: (search: Record<string, unknown>): { tema?: string; fase?: number } => {
    const theme = findTheme(search.tema);
    if (!theme) return {};
    const fase =
      search.fase === 1 || search.fase === "1"
        ? 1
        : search.fase === 2 || search.fase === "2"
          ? 2
          : undefined;
    return fase ? { tema: theme.slug, fase } : { tema: theme.slug };
  },
  head: () => ({
    meta: [
      { title: "Jogos e Missões — Sinal Kids & Teens" },
      {
        name: "description",
        content:
          "Explore cenários interativos, reconheça emergências e pratique condutas seguras de primeiros socorros ao lado do Teddy.",
      },
      { property: "og:title", content: "Jogos e Missões — Sinal" },
      {
        property: "og:description",
        content:
          "Quartel-general de missões 2D/2.5D com o mascote Teddy para aprender primeiros socorros de forma jogável.",
      },
    ],
  }),
  component: JogosPage,
});

interface MissionCardMeta {
  slug: string;
  order: string;
  title: string;
  cenario: string;
  cor: string;
  icone: typeof Apple;
  cardImg: string;
  resumo: string;
  dicasKids: string;
  dicasTeens: string;
}

const MISSIONS_META: MissionCardMeta[] = [
  {
    slug: "engasgo",
    order: "01",
    title: "Engasgo",
    cenario: "Refeitório Escolar",
    cor: "#2E7DD1",
    icone: Apple,
    cardImg: cardEngasgo,
    resumo: "Identifique tosse eficaz, evite intervenções inadequadas e busque socorro com adultos.",
    dicasKids: "Observe se o amigo consegue tossir com força e corra para avisar um adulto!",
    dicasTeens: "Avalie se a obstrução é parcial ou total e prepare o acionamento imediato do 192.",
  },
  {
    slug: "convulsao",
    order: "02",
    title: "Convulsão",
    cenario: "Sala de Aula",
    cor: "#6D3FC3",
    icone: Brain,
    cardImg: cardConvulsao,
    resumo: "Abaixe objetos ao redor, apoie a cabeça com maciez e nunca contenha a pessoa à força.",
    dicasKids: "Não segure os braços e nunca coloque nada na boca da pessoa. Peça ajuda a um professor!",
    dicasTeens: "Proteja a cabeça contra choques, cronometre a crise e posicione em decúbito lateral após cessar.",
  },
  {
    slug: "parada-cardiorrespiratoria",
    order: "03",
    title: "Parada Cardiorrespiratória",
    cenario: "Parque e Praça",
    cor: "#BF3077",
    icone: Heart,
    cardImg: cardParada,
    resumo: "Verifique a segurança do local, observe a ausência de resposta e solicite socorro.",
    dicasKids: "Grite por socorro para que um adulto venha correndo e ligue para o 192!",
    dicasTeens: "Cheque responsividade, confirme parada e oriente um adulto a iniciar compressões e buscar o DEA.",
  },
  {
    slug: "queimadura",
    order: "04",
    title: "Queimaduras",
    cenario: "Cozinha e Fogão",
    cor: "#FFC044",
    icone: Flame,
    cardImg: cardQueimadura,
    resumo: "Resfrie imediatamente apenas com água corrente da torneira e rejeite receitas caseiras.",
    dicasKids: "Fique longe do fogão quente! Se queimar, lave com água da torneira e chame um adulto.",
    dicasTeens: "Resfrie com água corrente em temperatura ambiente por 10 a 20 min. Nunca aplique pasta de dente ou café.",
  },
  {
    slug: "trauma",
    order: "05",
    title: "Trauma e Quedas",
    cenario: "Pátio e Escadaria",
    cor: "#53C6B6",
    icone: Shield,
    cardImg: cardTrauma,
    resumo: "Estabilize a vítima sem movimentação desnecessária da coluna e acione o suporte.",
    dicasKids: "Peça para o amigo ficar quietinho no chão e não tente levantá-lo. Chame socorro!",
    dicasTeens: "Mantenha alinhamento cervical, acalme a vítima e acione o SAMU 192 sem tracionar membros lesionados.",
  },
];

function JogosPage() {
  const search = Route.useSearch();
  const theme = findTheme(search.tema);
  const level = theme?.levels.find((l) => l.number === search.fase);
  const { setVisivel } = useTeddy();
  const [custom, setCustom] = useState(false);
  const [completed, setCompleted] = useState<string[]>(readGameProgress);
  const [track, setTrack] = useState<"kids" | "teens">("kids");
  const sinalStore = useSinalStore();

  useEffect(() => {
    setVisivel(false);
    return () => setVisivel(true);
  }, [setVisivel]);

  useEffect(() => {
    setCompleted(readGameProgress());
  }, [search.tema, search.fase]);

  const totalFasesConcluidas = completed.length;
  const missoesConcluidasCount = GAME_THEMES.filter(
    (t) => completed.includes(`${t.slug}:1`) && completed.includes(`${t.slug}:2`),
  ).length;

  const currentTrackStats = sinalStore[track];

  return (
        <div className="min-h-screen bg-transparent text-foreground">
          {/* 1. CABEÇALHO PRINCIPAL DO JOGO */}
          <header className="border-b border-border/80 bg-card/75 backdrop-blur-md sticky top-0 z-30 shadow-xs">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-8">
              <Link
                to="/"
                className="flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight text-[color:var(--roxo)] transition-opacity hover:opacity-85 sm:text-2xl"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[color:var(--roxo)] to-[color:var(--azul)] text-white shadow-sm text-base">
                  🎮
                </span>
                <div>
                  <span>Sinal</span>
                  <span className="ml-2 hidden text-xs font-semibold text-muted-foreground sm:inline">
                    Jogos e Missões
                  </span>
                </div>
              </Link>

              <nav className="flex items-center gap-2 sm:gap-3 font-display text-xs font-semibold sm:text-sm">
                <Link
                  to="/temas"
                  className="rounded-full px-3 py-1.5 transition-colors hover:bg-muted text-muted-foreground hover:text-foreground hidden md:inline-block"
                >
                  Guias Teóricos
                </Link>
                <Link
                  to="/missoes"
                  className="rounded-full border border-border/80 px-3.5 py-1.5 transition-all hover:bg-muted text-foreground"
                >
                  Revisão por Perguntas ↗
                </Link>
                <Link
                  to="/emergencia"
                  className="rounded-full bg-[color:var(--rosa)] px-3.5 py-1.5 text-white transition-transform hover:scale-105 shadow-xs"
                >
                  Emergência 192
                </Link>
                <HighContrastToggle />
              </nav>
            </div>
          </header>

                <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
                  {/* Breadcrumb de navegação de fases */}
                  <nav
                    className="mb-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground"
                    aria-label="Você está aqui"
                  >
                    <Link
                      to="/jogos"
                      search={{}}
                      className="font-bold text-[color:var(--roxo)] hover:underline"
                    >
                      🕹️ Jogos e Missões
                    </Link>
                    {theme && (
                      <>
                          <span className="text-border">/</span>
                          <Link
                            to="/jogos"
                            search={{ tema: theme.slug }}
                            className="font-semibold text-foreground hover:underline"
                          >
                            {theme.name}
                          </Link>
                        </>
          )}
                        {level && (
                          <>
                            <span className="text-border">/</span>
                            <span className="rounded-full bg-[color:var(--roxo)]/15 px-2.5 py-0.5 font-bold text-[color:var(--roxo)]">
                              Fase {level.number}: {level.title}
                            </span>
                          </>
                        )}
                      </nav>

                            {/* 2. MODO ATIVO DE FASE (QUANDO UMA FASE ESTÁ SELECIONADA) */}
                            {theme && level && (
                              <section className="mb-12">
                                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs">
                                  <div className="flex items-center gap-3">
                                    <Link
                                      to="/jogos"
                                      search={{}}
                                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3.5 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                                    >
                                      ← Voltar ao Mapa de Missões
                                    </Link>
                                    <div className="hidden sm:block">
                                      <span className="text-xs font-semibold text-muted-foreground block">
                                        Missão Ativa:
                                      </span>
                                      <strong className="font-display text-sm font-extrabold text-foreground">
                                        {theme.name} • {level.title}
                                      </strong>
                                    </div>
                                  </div>

                                    {/* Seletor Rápido entre Fase 1 e Fase 2 */}
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-muted-foreground mr-1 hidden sm:inline">
                                        Fases do Tema:
                                      </span>
                                      {theme.levels.map((l) => {
                                        const isCur = l.number === level.number;
                                        const isDone = completed.includes(`${theme.slug}:${l.number}`);
                                        return (
                                          <Link
                                            key={l.number}
                                            to="/jogos"
                                            search={{ tema: theme.slug, fase: l.number }}
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-xs font-bold transition-all ${isCur
                                                ? "bg-[color:var(--roxo)] text-white shadow-xs"
                                                : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                                              }`}
                                          >
                                            {isDone && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                                            Fase {l.number}
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Componente oficial da engine do jogo */}
                                  <MiniGameShell key={`${theme.slug}:${level.number}`} theme={theme} level={level} />
                              </section>
                            )}

                              {/* 3. MENU PRINCIPAL: QUARTEL-GENERAL DE MISSÕES (QUANDO NÃO ESTÁ EM FASE) */ }
        {!level && (
                              <>
            {/* 3.1 HERO BANNER PRINCIPAL COM TEDDY */}
            <section className="relative overflow-hidden rounded-3xl bg-[image:var(--gradiente-sinal)] p-6 sm:p-10 text-white shadow-[var(--sombra-forte)] mb-10">
              <span
                className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              <span
                className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none"
                aria-hidden="true"
              />

              <div className="grid gap-8 items-center lg:grid-cols-[1.3fr_0.7fr]">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold tracking-wider uppercase text-white backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5 text-[color:var(--amarelo)]" />
                    <span>Missões Jogáveis • 2D / 2.5D</span>
                  </div>

                  <h1 className="mt-4 font-display text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-white">
                    {theme ? theme.name : "Quartel-General de Missões"}
                  </h1>

                  <p className="mt-3 max-w-xl text-sm sm:text-base text-white/95 leading-relaxed">
                    {theme
                      ? `Complete os objetivos de ${theme.name}. Caminhe pelo cenário, reconheça os perigos e aprenda a atitude certa para proteger quem precisa.`
                      : "Explore cenários realistas de emergência, observe os sinais da vítima e pratique decisões seguras de primeiros socorros ao lado do Teddy."}
                  </p>

                  {/* Painel de Ações Rápidas do Hero */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCustom(true)}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-display text-xs sm:text-sm font-extrabold text-[color:var(--roxo)] shadow-md transition-all hover:bg-white/90 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <User className="h-4 w-4 text-[color:var(--amarelo)]" />
                      Personalizar Personagem
                    </button>

                    <a
                      href="#trilha-missoes"
                      className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2.5 font-display text-xs sm:text-sm font-bold text-white shadow-xs backdrop-blur-md transition-all hover:bg-white/25 cursor-pointer"
                    >
                      <Gamepad2 className="h-4 w-4" />
                      Ver Trilha de Fases
                    </a>
                  </div>

                  {/* Resumo Rápido de Estatísticas */}
                  <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-6 border-t border-white/20">
                    <div>
                      <span className="text-[11px] font-semibold text-white/80 block">
                        Missões Concluídas
                      </span>
                      <strong className="font-display text-2xl font-black text-[color:var(--amarelo)]">
                        {missoesConcluidasCount}/5
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-white/80 block">
                        Fases Finalizadas
                      </span>
                      <strong className="font-display text-2xl font-black text-white">
                        {totalFasesConcluidas}/10
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-white/80 block">
                        Trilha Ativa
                      </span>
                      <strong className="font-display text-lg font-bold text-[color:var(--aqua)]">
                        {track === "kids" ? "Sinal Kids" : "Sinal Teens"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-white/80 block">
                        Estrelas Conquistadas
                      </span>
                      <strong className="font-display text-2xl font-black text-[color:var(--amarelo)] flex items-center gap-1">
                        ⭐ {currentTrackStats.stars || totalFasesConcluidas * 3}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Avatar Teddy Hero 3D / Badge Ilustrado */}
                <div className="relative flex flex-col items-center justify-center">
                  <div className="relative flex flex-col items-center justify-center rounded-3xl bg-white/10 p-4 sm:p-5 backdrop-blur-md border border-white/25 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                    <span
                      className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[color:var(--amarelo)]/30 via-transparent to-[color:var(--aqua)]/30 blur-sm pointer-events-none"
                      aria-hidden="true"
                    />
                    <div className="relative h-44 w-44 sm:h-52 sm:w-52">
                      <Teddy3D
                        mode="idle"
                        allowLook={true}
                        interactive={true}
                        tamanho={208}
                        className="h-full w-full"
                      />
                    </div>
                    <div className="relative mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-[11px] font-display font-extrabold text-white backdrop-blur-sm shadow-xs">
                      <span>🧸 Teddy • Socorrista Mirim</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3.2 SELEÇÃO DE DIFICULDADE (SINAL KIDS vs SINAL TEENS) */ }
                                    < section className = "mb-10 rounded-3xl border border-border bg-card p-6 shadow-xs" >
                                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
                                      <div>
                                        <span className="font-display text-xs font-extrabold uppercase tracking-wider text-[color:var(--roxo)] block">
                                          Nível Educativo
                                        </span>
                                        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">
                                          Escolha a sua Experiência
                                        </h2>
                                      </div>

                                      {/* Switcher visual moderno Kids / Teens */}
                                      <div className="inline-flex rounded-full bg-muted p-1.5 border border-border shadow-inner">
                                        <button
                                          type="button"
                                          onClick={() => setTrack("kids")}
                                          className={`inline-flex items-center gap-2 rounded-full px-5 py-2 font-display text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${track === "kids"
                                              ? "bg-[color:var(--roxo)] text-white shadow-sm scale-102"
                                              : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                          <span>🧸</span>
                                          <span>Sinal Kids (4–12 anos)</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => setTrack("teens")}
                                          className={`inline-flex items-center gap-2 rounded-full px-5 py-2 font-display text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${track === "teens"
                                              ? "bg-[color:var(--azul)] text-white shadow-sm scale-102"
                                              : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                          <span>⚡</span>
                                          <span>Sinal Teens (13–18 anos)</span>
                                        </button>
                                      </div>
                                    </div>

              {/* Descrição contextual da dificuldade selecionada */ }
                                    < div className = "mt-4 grid gap-4 sm:grid-cols-2" >
                                    <div
                                      className={`rounded-2xl p-4 border transition-all ${track === "kids"
                                          ? "border-[color:var(--roxo)]/60 bg-[color:var(--roxo)]/5"
                                          : "border-border/60 bg-muted/20 opacity-70"
                                        }`}
                                    >
                                        <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                                          <span>🧸</span>
                                          <span>Modo Kids: Apoio e Cuidados Básicos</span>
                                        </h3>
                                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                          Instruções diretas, maior apoio visual, foco em manter a calma, evitar condutas
                                          perigosas e chamar um adulto rapidamente.
                                        </p>
                                      </div>

                                      <div
                                        className={`rounded-2xl p-4 border transition-all ${track === "teens"
                                            ? "border-[color:var(--azul)]/60 bg-[color:var(--azul)]/5"
                                            : "border-border/60 bg-muted/20 opacity-70"
                                          }`}
                                      >
                                        <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                                          <span>⚡</span>
                                          <span>Modo Teens: Autonomia e Decisões Críticas</span>
                                        </h3>
                                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                          Maior independência na tomada de decisão, reconhecimento de sinais de gravidade,
                                          acionamento do 192 e medidas protetoras imediatas.
                                        </p>
                                      </div>
                                    </div>
            </section>

                                {/* 3.3 TRILHA DE MISSÕES DO TEDDY (MAPA VISUAL DE PROGRESSÃO) */}
                                <section id="trilha-missoes" className="mb-12">
                                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                    <div>
                                      <span className="font-display text-xs font-extrabold uppercase tracking-wider text-[color:var(--roxo)] block">
                                        Mapa de Aventura
                                      </span>
                                      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                                        Trilha de Missões do Teddy
                                      </h2>
                                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                        Avance pelas cinco emergências essenciais e conquiste sua certificação de
                                        socorrista.
                                      </p>
                                    </div>

                                    <span className="rounded-full bg-muted px-4 py-1.5 text-xs font-bold text-muted-foreground border border-border">
                                      Progresso: {missoesConcluidasCount} de 5 missões concluídas
                                    </span>
                                  </div>

                                  {/* Mapa de progressão estilo Quest Line */}
                                  <div className="rounded-3xl border border-border bg-card/60 p-6 sm:p-8 shadow-xs">
                                    <div className="relative">
                                      {/* Linha de conexão desktop */}
                                      <div
                                        className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2 bg-border z-0"
                                        aria-hidden="true"
                                      >
                                        <div
                                          className="h-full bg-gradient-to-r from-[color:var(--azul)] via-[color:var(--roxo)] to-[color:var(--aqua)] transition-all duration-500"
                                          style={{ width: `${(missoesConcluidasCount / 5) * 100}%` }}
                                        />
                                      </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
                                          {MISSIONS_META.map((meta, index) => {
                                            const Icone = meta.icone;
                                            const isL1Done = completed.includes(`${meta.slug}:1`);
                                            const isL2Done = completed.includes(`${meta.slug}:2`);
                                            const isDone = isL1Done && isL2Done;
                                            const isStarted = isL1Done || isL2Done;

                                            return (
                                              <div
                                                key={meta.slug}
                                                className={`flex flex-col rounded-2xl border-2 p-4 transition-all ${isDone
                                                    ? "border-[color:var(--aqua)] bg-emerald-500/5 shadow-xs"
                                                    : isStarted
                                                      ? "border-[color:var(--roxo)] bg-[color:var(--roxo)]/5 shadow-xs"
                                                      : "border-border/80 bg-card hover:border-border"
                                                  }`}
                                              >
                                                <div className="flex items-center justify-between mb-2">
                                                  <span
                                                    className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black text-white shadow-xs"
                                                    style={{ backgroundColor: meta.cor }}
                                                  >
                                                    {meta.order}
                                                  </span>

                                                  {isDone ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                                                      <CheckCircle2 className="h-3 w-3" />
                                                      Concluída
                                                    </span>
                                                  ) : isStarted ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--roxo)]/20 px-2 py-0.5 text-[10px] font-extrabold text-[color:var(--roxo)]">
                                                      <Clock className="h-3 w-3" />
                                                      1/2 fases
                                                    </span>
                                                  ) : (
                                                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                                      Disponível
                                                    </span>
                                                  )}
                                                </div>

                                                <div className="flex items-center gap-2 mt-1">
                                                  <Icone className="h-4 w-4" style={{ color: meta.cor }} />
                                                  <h3 className="font-display text-sm font-extrabold text-foreground truncate">
                                                    {meta.title}
                                                  </h3>
                                                </div>

                                                <span className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                                                  <MapPin className="h-3 w-3 shrink-0" />
                                                  <span className="truncate">{meta.cenario}</span>
                                                </span>

                                                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                                                  <Link
                                                    to="/jogos"
                                                    search={{ tema: meta.slug, fase: isL1Done ? 2 : 1 }}
                                                    className="font-display text-xs font-bold text-[color:var(--roxo)] hover:underline inline-flex items-center gap-1"
                                                  >
                                                    {isDone ? "Rejogar" : isStarted ? "Continuar" : "Jogar"}
                                                    <ChevronRight className="h-3 w-3" />
                                                  </Link>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                    </div>
                                  </div>
                                </section>

                                {/* 3.4 GRADE DE CARDS VISUAIS DE SELEÇÃO DE FASES (CENÁRIOS) */}
                                <section className="mb-12">
                                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                    <div>
                                      <span className="font-display text-xs font-extrabold uppercase tracking-wider text-[color:var(--roxo)] block">
                                        Cenários em 2.5D
                                      </span>
                                      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                                        Selecione sua Próxima Missão
                                      </h2>
                                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                        Cada missão possui duas fases progressivas com cenários e desafios próprios.
                                      </p>
                                </div>
                              </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                              {GAME_THEMES.map((t) => {
                                const meta = MISSIONS_META.find((m) => m.slug === t.slug) || MISSIONS_META[0];
                                const Icone = meta.icone;
                                const isL1Done = completed.includes(`${t.slug}:1`);
                                const isL2Done = completed.includes(`${t.slug}:2`);
                                const isCompleted = isL1Done && isL2Done;
                                const completedCount = (isL1Done ? 1 : 0) + (isL2Done ? 1 : 0);

                                return (
                                  <article
                                    key={t.slug}
                                    className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--sombra-suave)] transition-all hover:border-[color:var(--roxo)] hover:shadow-lg"
                                  >
                                    {/* Imagem de Prévia do Cenário com Overlay */}
                                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                                      <img
                                        src={meta.cardImg}
                                        alt={`Cenário da missão ${t.name}: ${meta.cenario}`}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                      {/* Badges superiores na imagem */}
                                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                                        <span
                                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-xs font-extrabold text-white shadow-md backdrop-blur-md"
                                          style={{ backgroundColor: `${meta.cor}dd` }}
                                        >
                                          <Icone className="h-3.5 w-3.5" />
                                          <span>{t.name}</span>
                                        </span>

                                        <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-bold text-white/90 backdrop-blur-md">
                                          {meta.order} / 05
                                        </span>
                                      </div>

                                      {/* Localização na imagem */}
                                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                                        <div className="flex items-center gap-1.5 text-xs font-bold drop-shadow-sm">
                                          <MapPin className="h-3.5 w-3.5 text-[color:var(--amarelo)]" />
                                          <span>{meta.cenario}</span>
                                        </div>
                                        {isCompleted && (
                                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Completo
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Corpo do Card */}
                                    <div className="flex flex-1 flex-col p-5">
                                      <h3 className="font-display text-xl font-extrabold text-foreground group-hover:text-[color:var(--roxo)] transition-colors">
                                        {t.name}
                                      </h3>

                                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                        {meta.resumo}
                                      </p>

                                      {/* Dica da dificuldade ativa */}
                                      <div className="mt-3 rounded-xl bg-muted/40 p-2.5 border border-border/60 text-[11px] text-foreground/90">
                                        <strong className="block text-[color:var(--roxo)] font-bold mb-0.5">
                                          {track === "kids" ? "🧸 Dica Kids:" : "⚡ Foco Teens:"}
                                        </strong>
                                        {track === "kids" ? meta.dicasKids : meta.dicasTeens}
                                      </div>

                                      {/* Lista das Fases com Botões Diretos */}
                                      <div className="mt-4 space-y-2 border-t border-border/80 pt-3">
                                        <span className="text-[11px] font-bold text-muted-foreground block">
                                          Fases ({completedCount}/2 concluídas):
                                        </span>

                                        {t.levels.map((l) => {
                                          const isDone = completed.includes(`${t.slug}:${l.number}`);
                                          return (
                                            <Link
                                              key={l.number}
                                              to="/jogos"
                                              search={{ tema: t.slug, fase: l.number }}
                                              className={`flex items-center justify-between rounded-xl border p-2.5 text-xs transition-all ${isDone
                                                  ? "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-foreground"
                                                  : "border-border bg-card hover:border-[color:var(--roxo)] hover:bg-muted/40 text-foreground"
                                                }`}
                                            >
                                              <div className="flex items-center gap-2">
                                                <span
                                                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-display text-[10px] font-extrabold ${isDone
                                                      ? "bg-emerald-500 text-white"
                                                      : "bg-muted text-muted-foreground"
                                                    }`}
                                                >
                                                  {isDone ? "✓" : l.number}
                                                </span>
                                                <span className="font-semibold line-clamp-1">{l.title}</span>
                                              </div>
                                              <span className="font-bold text-[color:var(--roxo)] shrink-0 ml-2">
                                                Jogar →
                                              </span>
                                            </Link>
                                          );
                                        })}
                                      </div>

                                      {/* Botão Principal de Início */}
                                      <div className="mt-5 pt-2">
                                        <Link
                                          to="/jogos"
                                          search={{ tema: t.slug, fase: isL1Done ? 2 : 1 }}
                                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--roxo)] py-2.5 font-display text-xs sm:text-sm font-extrabold text-white shadow-sm transition-transform hover:scale-102 active:scale-98"
                                        >
                                          <Play className="h-4 w-4 fill-current" />
                                          <span>{isCompleted ? "Rejogar Missão" : "Iniciar Missão"}</span>
                                        </Link>
                                      </div>
                                    </div>
                                  </article>
                                );
                              })}
                            </div>
                          </section>
                        </>
        )}

                                {/* 4. AVISO EDUCATIVO DE SIMULAÇÃO RESPONSÁVEL */ }
                                < aside className = "mt-10 rounded-3xl border border-border/80 bg-muted/30 p-6 sm:p-8" >
                                <div className="flex items-start gap-4">
                                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--amarelo)] text-[color:var(--tinta)] shadow-xs">
                                    <ShieldAlert className="h-5 w-5" />
                                  </span>
                                  <div className="space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    <strong className="font-display text-sm sm:text-base font-extrabold text-foreground block">
                                      Uma experiência educativa interativa em constante aprimoramento.
                                    </strong>
                                    <p>
                                      Os jogos e missões do Sinal têm como finalidade ensinar a reconhecer situações de
                                      risco, buscar socorro imediato e manter a calma. Os tempos das ações são adaptados
                                      para a jogabilidade e não reproduzem a duração de procedimentos clínicos reais.
                                    </p>
                                    <p>
                                      A simulação digital não substitui o treinamento presencial de suporte básico de vida
                                      oferecido por instituições de saúde certificadas.
                                    </p>
                                    <div className="pt-2 flex flex-wrap gap-3">
                                      <Link
                                        to="/missoes"
                                        className="font-display text-xs font-extrabold text-[color:var(--roxo)] hover:underline inline-flex items-center gap-1"
                                      >
                                        Praticar na revisão teórica por perguntas →
                                      </Link>
                                      <span className="text-border">·</span>
                                      <Link
                                        to="/temas"
                                        className="font-display text-xs font-extrabold text-foreground hover:underline"
                                      >
                                        Explorar os 5 guias teóricos completos
                                      </Link>
                                    </div>
                                  </div>
                            </div>
                          </aside>
                      </main>

      {/* 5. RODAPÉ INSTITUCIONAL */}
                    <Footer />

                    {/* 6. MODAL DE PERSONALIZAÇÃO DO PERSONAGEM DO JOGADOR */}
                    <AvatarCustomizerModal isOpen={custom} onClose={() => setCustom(false)} />
                  </div>
                  );
}