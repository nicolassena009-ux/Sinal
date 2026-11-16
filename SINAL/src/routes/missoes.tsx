import { useEffect, useState, useRef } from "react";
import { useTeddy } from "@/components/TeddyMascote";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Teddy3D, type TeddyAnimationMode } from "@/components/Teddy3D";
import { CertificadoModal } from "@/components/CertificadoModal";
import { AudioNarration } from "@/components/AudioNarration";
import { SiteHeader } from "@/components/SiteHeader";
import { MISSOES_KIDS, MISSOES_TEENS, PRATICA_POR_TEMA, type Missao } from "@/data/missoes";
import { FASES_CONFIG } from "@/data/fasesData";

import { AvatarCustomizerModal } from "@/components/minigames/AvatarCustomizerModal";
import { usePlayerAvatar } from "@/lib/avatarStore";
import type { ThemeSlug } from "@/types/minigame";
import { launchConfetti } from "@/lib/confetti";
import { useSinalStore, saveMissionAttempt, resetTrackProgress } from "@/lib/sinalStore";
import {
  Award,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Gamepad2,
  User,
  Heart,
  Flame,
  Brain,
  Shield,
  Apple,
} from "lucide-react";

import { z } from "zod";

const jogosSearchSchema = z.object({
  tema: z.string().optional(),
});

export const Route = createFileRoute("/missoes")({
  validateSearch: (search) => jogosSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Revisão por perguntas — Sinal Kids & Teens" },
      {
        name: "description",
        content:
          "Pratique decisões seguras de primeiros socorros em missões interativas com o Teddy e nas novas mini fases 2D. Trilhas para crianças e adolescentes.",
      },
      { property: "og:title", content: "Jogos e Missões — Sinal" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content:
          "Simulações e mini fases 2D interativas para aprender a agir com segurança e reconhecer emergências.",
      },
    ],
  }),
  component: JogosPage,
});

const TEMAS_INFO: {
  slug: ThemeSlug;
  nome: string;
  cor: string;
  icone: typeof Apple;
  resumo: string;
}[] = [
  {
    slug: "engasgo",
    nome: "Engasgo",
    cor: "#2E7DD1",
    icone: Apple,
    resumo: "Quando a passagem de ar é bloqueada e cada segundo conta.",
  },
  {
    slug: "convulsao",
    nome: "Convulsão",
    cor: "#6D3FC3",
    icone: Brain,
    resumo: "Proteger a pessoa durante a crise sem contê-la à força.",
  },
  {
    slug: "parada-cardiorrespiratoria",
    nome: "Parada cardiorrespiratória",
    cor: "#FF60A7",
    icone: Heart,
    resumo: "Reconhecimento imediato e compressões contínuas no centro do peito.",
  },
  {
    slug: "queimadura",
    nome: "Queimaduras",
    cor: "#FFC044",
    icone: Flame,
    resumo: "Resfriamento com água corrente e rejeição de receitas caseiras.",
  },
  {
    slug: "trauma",
    nome: "Trauma",
    cor: "#53C6B6",
    icone: Shield,
    resumo: "Segurança da cena, não movimentar a vítima e estancar sangramentos.",
  },
];

function JogosPage() {
  const search = Route.useSearch();
  const teddy = useTeddy();
  const setTeddyVisivel = teddy.setVisivel;
  const store = useSinalStore();
  const [avatar] = usePlayerAvatar();
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Trilha ativa de Missões clássicas: Kids vs Teens
  const [activeTrack, setActiveTrack] = useState<"kids" | "teens">("kids");
  const [activeMissionIdx, setActiveMissionIdx] = useState<number | null>(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [teddyMode, setTeddyMode] = useState<TeddyAnimationMode>("idle");
  const [showCertificate, setShowCertificate] = useState(false);

  // Filtro Temático (todos ou slug específico)
  const [selectedTheme, setSelectedTheme] = useState<string>(search.tema || "todos");

  const missions = activeTrack === "kids" ? MISSOES_KIDS : MISSOES_TEENS;
  const progress = store[activeTrack];
  const currentMission: Missao | null =
    activeMissionIdx !== null ? (missions[activeMissionIdx] ?? null) : null;

  // Responde ao search param da URL (?tema=engasgo)
  useEffect(() => {
    if (search.tema) {
      setSelectedTheme(search.tema);
      // Rola suavemente até a seção do tema
      setTimeout(() => {
        const el = document.getElementById(`secao-tema-${search.tema}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  }, [search.tema]);

  // Oculta o mascote flutuante global enquanto estiver na página de Jogos
  // para dar destaque ao Teddy Hero e ao Teddy da missão interativa, economizando GPU
  useEffect(() => {
    setTeddyVisivel(false);
    return () => {
      setTeddyVisivel(true);
    };
  }, [setTeddyVisivel]);

  useEffect(() => {
    if (showCertificate) teddy.comemorar();
  }, [showCertificate, teddy.comemorar]);

  const handleSelectMission = (idx: number) => {
    setActiveMissionIdx(idx);
    setSelectedChoice(null);
    setIsAnswered(false);
    setTeddyMode("idle");
  };

  const handleAnswer = (choiceIdx: number) => {
    if (isAnswered || activeMissionIdx === null || !currentMission) return;

    setSelectedChoice(choiceIdx);
    setIsAnswered(true);

    const isCorrect = choiceIdx === currentMission.correta;

    if (isCorrect) {
      teddy.acertou();
      setTeddyMode("celebrate");
      launchConfetti(2000);
      saveMissionAttempt(activeTrack, activeMissionIdx, true);

      // Se concluiu todas as missões
      const updatedDoneCount = progress.done.includes(activeMissionIdx)
        ? progress.done.length
        : progress.done.length + 1;

      if (updatedDoneCount >= missions.length) {
        setTimeout(() => setShowCertificate(true), 1200);
      }
    } else {
      teddy.errou();
      setTeddyMode("sad");
      saveMissionAttempt(activeTrack, activeMissionIdx, false);
    }
  };

  const handleNextMission = () => {
    if (activeMissionIdx === null) return;
    const nextIdx = (activeMissionIdx + 1) % missions.length;
    handleSelectMission(nextIdx);
  };

  const handleReset = () => {
    if (
      window.confirm(
        `Deseja reiniciar o progresso da trilha ${activeTrack === "kids" ? "Kids" : "Teens"}?`,
      )
    ) {
      resetTrackProgress(activeTrack);
      handleSelectMission(0);
    }
  };

  const isCurrentCorrect =
    currentMission && selectedChoice !== null && selectedChoice === currentMission.correta;

  // Temas a exibir conforme o filtro selecionado
  const temasParaExibir =
    selectedTheme === "todos" ? TEMAS_INFO : TEMAS_INFO.filter((t) => t.slug === selectedTheme);

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      {/* 1. Header do Site */}
      <SiteHeader tone="light" subtitle="Revisão por perguntas" progress />

      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        {/* 2. Banner Principal com TED Mascot */}
        <div className="rounded-3xl bg-[image:var(--gradiente-sinal)] p-8 sm:p-12 text-[color:var(--lilas)] shadow-[var(--sombra-forte)] relative overflow-hidden">
          <span
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid gap-8 items-center md:grid-cols-[1.3fr_0.7fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold tracking-wider uppercase text-white">
                <Sparkles className="h-3.5 w-3.5 text-[color:var(--amarelo)]" />
                Revisão por perguntas • Kids & Teens
              </span>
              <h1 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold leading-tight text-white">
                Aprenda a agir com segurança em situações reais.
              </h1>
              <p className="mt-3 max-w-xl text-base opacity-90 leading-relaxed text-white/95">
                Revise as perguntas das trilhas Kids e Teens com o Teddy. Depois, acesse os jogos
                pelo menu para explorar cenários e realizar objetivos com seu personagem.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <AudioNarration
                  title="Ouvir instruções das missões"
                  text="Bem-vindo às missões e mini fases do Sinal. Aqui você aprende na prática como reconhecer perigos e tomar decisões seguras para proteger sua vida e a de quem você ama."
                />

                {/* Botão de Atalho para Personalizar Avatar */}
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 font-display text-xs font-bold text-white shadow-md backdrop-blur-md transition-all hover:bg-white/25 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <User className="h-4 w-4 text-[color:var(--amarelo)]" />
                  Personalizar Personagem 2D
                </button>
              </div>
            </div>

            {/* Teddy Hero 3D (Mascote Institucional) */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex flex-col items-center justify-center rounded-3xl bg-white/10 p-3 sm:p-4 backdrop-blur-md border border-white/25 shadow-[0_16px_36px_rgba(0,0,0,0.18)] transition-all hover:border-white/40">
                {/* Halo sutil de luz da marca */}
                <span
                  className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[color:var(--amarelo)]/20 via-transparent to-[color:var(--aqua)]/20 blur-sm pointer-events-none"
                  aria-hidden="true"
                />

                <div className="relative h-48 w-48 sm:h-56 sm:w-56">
                  <Teddy3D
                    mode={teddyMode}
                    allowLook={true}
                    interactive={true}
                    tamanho={224}
                    className="h-full w-full"
                  />
                </div>

                <div className="relative mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-[11px] font-display font-extrabold text-white backdrop-blur-sm shadow-xs transition-transform hover:scale-105">
                  <Sparkles className="h-3 w-3 text-[color:var(--amarelo)]" />
                  <span>Teddy • Mascote Guia</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Seletor de Trilha: Kids vs Teens (Preservando o sistema existente) */}
        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="font-display text-2xl font-extrabold">Trilha de Missões do Teddy</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Perguntas contextualizadas com o mascote Teddy para praticar respostas rápidas e
                seguras.
              </p>
            </div>

            <div className="inline-flex rounded-full bg-muted p-1 border border-border">
              <button
                type="button"
                onClick={() => {
                  setActiveTrack("kids");
                  handleSelectMission(0);
                }}
                className={`rounded-full px-5 py-2 font-display text-xs font-bold transition-all ${
                  activeTrack === "kids"
                    ? "bg-[color:var(--roxo)] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🧸 Sinal Kids (4–12 anos)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTrack("teens");
                  handleSelectMission(0);
                }}
                className={`rounded-full px-5 py-2 font-display text-xs font-bold transition-all ${
                  activeTrack === "teens"
                    ? "bg-[color:var(--azul)] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ⚡ Sinal Teens (13–18 anos)
              </button>
            </div>
          </div>

          {/* Painel de Estatísticas */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <span className="text-xs text-muted-foreground font-semibold block">
                Missões Concluídas
              </span>
              <span className="font-display text-2xl font-extrabold text-[color:var(--roxo)]">
                {progress.done.length}/{missions.length}
              </span>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <span className="text-xs text-muted-foreground font-semibold block">
                Estrelas Ganhas
              </span>
              <span className="font-display text-2xl font-extrabold text-[color:var(--amarelo)]">
                ⭐ {progress.stars}
              </span>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <span className="text-xs text-muted-foreground font-semibold block">Tentativas</span>
              <span className="font-display text-2xl font-extrabold text-foreground">
                {progress.tries}
              </span>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground font-semibold block">
                  Certificado
                </span>
                <span className="font-display text-xs font-bold text-foreground">
                  {progress.done.length === missions.length ? "Liberado! 🏆" : "Em andamento"}
                </span>
              </div>
              {progress.done.length === missions.length && (
                <button
                  type="button"
                  onClick={() => setShowCertificate(true)}
                  className="rounded-full bg-[color:var(--amarelo)] p-2 text-[color:var(--tinta)] shadow-sm hover:scale-105"
                  title="Abrir Certificado"
                >
                  <Award className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Carrossel de seleção de Missões do Teddy */}
          <div className="mt-6 flex gap-3 overflow-x-auto pb-3">
            {missions.map((m, idx) => {
              const isDone = progress.done.includes(idx);
              const isSelected = activeMissionIdx === idx;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectMission(idx)}
                  className={`flex shrink-0 min-w-[190px] flex-col rounded-2xl border-2 p-4 text-left transition-all ${
                    isSelected
                      ? "border-[color:var(--roxo)] bg-[color:var(--roxo)]/10 shadow-md ring-2 ring-[color:var(--roxo)]/30"
                      : isDone
                        ? "border-[color:var(--aqua)]/70 bg-card hover:border-[color:var(--aqua)]"
                        : "border-border bg-card hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold text-muted-foreground">
                      Missão {idx + 1}
                    </span>
                    {isDone && <CheckCircle2 className="h-4 w-4 text-[color:var(--aqua)]" />}
                  </div>
                  <span className="mt-1 text-2xl">{m.emoji}</span>
                  <span className="mt-1 font-display text-base font-extrabold text-foreground">
                    {m.titulo}
                  </span>
                  <span className="mt-2 text-[11px] font-semibold text-muted-foreground">
                    {isDone ? "★★★★★ Concluída" : "☆ Praticar agora"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Área ativa de simulação de perguntas com o Teddy */}
          {currentMission && (
            <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-[var(--sombra-suave)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-2xl">
                    {currentMission.emoji}
                  </span>
                  <div>
                    <span className="font-display text-xs font-bold text-[color:var(--roxo)] uppercase tracking-wider">
                      {activeTrack === "kids" ? "Sinal Kids" : "Sinal Teens"} • Missão{" "}
                      {(activeMissionIdx ?? 0) + 1}
                    </span>
                    <h3 className="font-display text-2xl font-extrabold text-foreground">
                      {currentMission.titulo}
                    </h3>
                  </div>
                </div>

                <AudioNarration
                  title="Ouvir este cenário"
                  text={`Cenário: ${currentMission.cenario}. Pergunta: ${currentMission.pergunta}`}
                />
              </div>

              <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
                <div>
                  <div className="rounded-2xl bg-muted/40 p-4 border border-border text-sm text-foreground leading-relaxed">
                    <strong className="block mb-1 text-foreground">Situação:</strong>
                    {currentMission.cenario}
                  </div>

                  <h4 className="mt-6 font-display text-lg font-bold text-foreground">
                    {currentMission.pergunta}
                  </h4>

                  <div className="mt-4 space-y-3">
                    {currentMission.opcoes.map((opcao, i) => {
                      const letter = String.fromCharCode(65 + i);
                      let style =
                        "border-border bg-card hover:border-[color:var(--roxo)] hover:bg-muted/30";

                      if (isAnswered) {
                        if (i === currentMission.correta) {
                          style =
                            "border-[color:var(--aqua)] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold ring-2 ring-[color:var(--aqua)]";
                        } else if (i === selectedChoice) {
                          style =
                            "border-[color:var(--rosa)] bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 line-through opacity-80";
                        } else {
                          style = "border-border/40 opacity-40 bg-card";
                        }
                      }

                      return (
                        <button
                          key={opcao}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleAnswer(i)}
                          className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left text-sm transition-all cursor-pointer ${style}`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-display text-xs font-extrabold ${
                              isAnswered && i === currentMission.correta
                                ? "bg-[color:var(--aqua)] text-[color:var(--tinta)]"
                                : isAnswered && i === selectedChoice
                                  ? "bg-[color:var(--rosa)] text-white"
                                  : "bg-muted text-foreground"
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="flex-1">{opcao}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback da resposta da missão */}
                  {isAnswered && (
                    <div
                      className={`mt-6 rounded-2xl p-5 border-2 animate-in fade-in duration-300 ${
                        isCurrentCorrect
                          ? "border-[color:var(--aqua)] bg-emerald-50/90 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100"
                          : "border-[color:var(--rosa)] bg-rose-50/90 text-rose-950 dark:bg-rose-950/60 dark:text-rose-100"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCurrentCorrect ? (
                          <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-6 w-6 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                        )}
                        <div>
                          <h5 className="font-display text-base font-extrabold">
                            {isCurrentCorrect
                              ? "Excelente! Resposta certa e segura! 🎉"
                              : "Quase lá! Vamos reforçar a segurança 💜"}
                          </h5>
                          <p className="mt-1 text-xs sm:text-sm opacity-90 leading-relaxed">
                            {currentMission.explicacao}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {isCurrentCorrect ? (
                              <button
                                type="button"
                                onClick={handleNextMission}
                                className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--roxo)] px-5 py-2 font-display text-xs font-bold text-white transition-transform hover:scale-105 cursor-pointer"
                              >
                                Próxima missão
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedChoice(null);
                                  setIsAnswered(false);
                                  setTeddyMode("idle");
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--roxo)] px-4 py-2 font-display text-xs font-bold text-white transition-transform hover:scale-105 cursor-pointer"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Tentar de novo
                              </button>
                            )}

                            {currentMission.temaRelacionado && (
                              <Link
                                to="/tema/$slug"
                                params={{ slug: currentMission.temaRelacionado }}
                                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-4 py-2 font-display text-xs font-semibold text-foreground hover:bg-muted"
                              >
                                Revisar guia completo deste tema
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Companheiro Teddy 3D interativo na missão */}
                <div className="flex flex-col items-center justify-center rounded-3xl border border-border/70 bg-gradient-to-b from-card/80 to-muted/30 p-6 text-center shadow-xs">
                  <div className="relative h-56 w-56 sm:h-64 sm:w-64">
                    <Teddy3D
                      mode={teddyMode}
                      allowLook={true}
                      interactive={true}
                      tamanho={240}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--roxo)]/10 px-3 py-0.5 text-xs font-display font-extrabold text-[color:var(--roxo)] dark:bg-[color:var(--roxo)]/25 dark:text-[color:var(--lilas)]">
                    <span>Teddy Companheiro</span>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1.5 leading-relaxed">
                    Ele celebra cada acerto e te apoia quando precisar tentar de novo!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botão de reiniciar progresso */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reiniciar progresso da trilha {activeTrack === "kids" ? "Kids" : "Teens"}
            </button>
          </div>
        </div>

        {/* 4. NOVA SEÇÃO: ORGANIZAÇÃO POR TEMA — MISSÕES + MINI FASES 2D */}
        <section className="mt-20 border-t border-border pt-12" aria-labelledby="titulo-mini-fases">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--roxo)]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[color:var(--roxo)]">
                <Gamepad2 className="h-3.5 w-3.5" />
                Relembre as decisões e suas explicações
              </span>
              <h2
                id="titulo-mini-fases"
                className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-foreground"
              >
                Revisão por tema
              </h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                Confira as perguntas originais de cada tema e suas explicações. Os links levam às
                duas fases de exploração correspondentes.
              </p>
            </div>

            {/* Barra do Personagem do Jogador */}
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--roxo)] text-white shadow-xs">
                <User className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-muted-foreground">
                  Seu Socorrista 2D
                </span>
                <span className="block font-display text-xs font-bold text-foreground">
                  Compartilhado nos 5 temas
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="rounded-full bg-[color:var(--roxo)] px-3.5 py-1.5 font-display text-xs font-bold text-white shadow-xs hover:bg-[color:var(--roxo)]/90 transition-all cursor-pointer"
              >
                Personalizar
              </button>
            </div>
          </div>

          {/* Seletor Rápido de Temas (Abas / Filtro) */}
          <div className="flex gap-2 overflow-x-auto pb-4">
            <button
              type="button"
              onClick={() => setSelectedTheme("todos")}
              className={`rounded-full px-4 py-2 font-display text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedTheme === "todos"
                  ? "bg-[color:var(--tinta)] text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              🌟 Todos os 5 Temas
            </button>
            {TEMAS_INFO.map((t) => {
              const Icone = t.icone;
              const isSelected = selectedTheme === t.slug;
              return (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => setSelectedTheme(t.slug)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  style={isSelected ? { backgroundColor: t.cor } : undefined}
                >
                  <Icone className="h-3.5 w-3.5" />
                  <span>{t.nome}</span>
                </button>
              );
            })}
          </div>

          {/* Blocos de cada Tema: Missão + Mini Fase 2D */}
          <div className="mt-8 space-y-16">
            {temasParaExibir.map((t) => {
              const Icone = t.icone;
              const faseConfig = FASES_CONFIG[t.slug];
              const missaoDoTema = PRATICA_POR_TEMA[t.slug];

              return (
                <div
                  key={t.slug}
                  id={`secao-tema-${t.slug}`}
                  className="rounded-3xl border-2 bg-card/60 p-6 sm:p-10 shadow-[var(--sombra-suave)] transition-all scroll-mt-24"
                  style={{ borderColor: `${t.cor}44` }}
                >
                  {/* Cabeçalho do Bloco do Tema */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md"
                        style={{ backgroundColor: t.cor }}
                      >
                        <Icone className="h-6 w-6" />
                      </span>
                      <div>
                        <span
                          className="font-display text-xs font-extrabold uppercase tracking-widest block"
                          style={{ color: t.cor }}
                        >
                          Tema Educativo
                        </span>
                        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                          {t.nome}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{t.resumo}</p>
                      </div>
                    </div>

                    <Link
                      to="/tema/$slug"
                      params={{ slug: t.slug }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 font-display text-xs font-bold text-foreground hover:bg-muted transition-all"
                    >
                      <span>Ver guia teórico completo</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {/* 4.1 Missão de Pergunta e Resposta Existente do Tema */}
                  {missaoDoTema && (
                    <div className="mt-8 rounded-2xl border border-border bg-muted/20 p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <span>{missaoDoTema.emoji}</span>
                          Missão de Resposta Rápida • {missaoDoTema.titulo}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/90 font-medium">
                        <strong>Situação:</strong> {missaoDoTema.cenario}
                      </p>
                      <p className="mt-2 text-xs sm:text-sm font-bold text-foreground">
                        {missaoDoTema.pergunta}
                      </p>
                      <details className="mt-3 text-sm">
                        <summary className="cursor-pointer font-bold">
                          Ver alternativas e explicação
                        </summary>
                        <ol className="mt-2 list-decimal pl-5">
                          {missaoDoTema.opcoes.map((opcao, index) => (
                            <li key={opcao}>
                              {index === missaoDoTema.correta ? "✓ " : ""}
                              {opcao}
                            </li>
                          ))}
                        </ol>
                        <p className="mt-3">{missaoDoTema.explicacao}</p>
                      </details>
                    </div>
                  )}

                  <Link
                    to="/jogos"
                    search={{ tema: t.slug }}
                    className="mt-6 inline-block rounded-full bg-primary px-5 py-3 text-primary-foreground"
                  >
                    Explorar as fases deste tema →
                  </Link>
                  <div className="mt-6 space-y-3">
                    {faseConfig.etapas
                      .filter((etapa) => etapa.pergunta)
                      .map((etapa) => (
                        <details key={etapa.id} className="rounded-xl border border-border p-4">
                          <summary className="cursor-pointer font-bold">{etapa.pergunta}</summary>
                          <ul className="mt-3 space-y-3">
                            {etapa.escolhas?.map((escolha) => (
                              <li key={escolha.id}>
                                <strong>
                                  {escolha.correta ? "✓ " : ""}
                                  {escolha.texto}
                                </strong>
                                <p>{escolha.explicacao}</p>
                              </li>
                            ))}
                          </ul>
                        </details>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Aviso Educativo e Segurança */}
        <div className="mt-16 rounded-3xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-6 text-amber-950 dark:text-amber-100 flex gap-4">
          <ShieldAlert className="h-6 w-6 shrink-0 text-amber-600 mt-1" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <strong>Aviso de Segurança e Educação:</strong> As missões e mini fases do Sinal são
            ferramentas educativas para exercitar o reconhecimento de riscos e a tomada de decisões
            seguras. Em qualquer emergência de saúde real no Brasil, chame imediatamente o{" "}
            <strong>SAMU 192</strong> ou os <strong>Bombeiros 193</strong>.
          </div>
        </div>
      </main>

      {/* 6. Rodapé */}
      <Footer />

      {/* 7. Modal de Personalização Global do Avatar */}
      <AvatarCustomizerModal isOpen={showAvatarModal} onClose={() => setShowAvatarModal(false)} />

      {/* 8. Modal de Certificado */}
      <CertificadoModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        track={activeTrack}
        stars={progress.stars}
      />
    </div>
  );
}
