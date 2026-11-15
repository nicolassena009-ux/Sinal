import { useEffect, useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTeddy } from "@/components/TeddyMascote";
import { Footer } from "@/components/Footer";
import { PhaserGameShell } from "@/components/minigames/PhaserGameShell";
import { AvatarCustomizerModal } from "@/components/minigames/AvatarCustomizerModal";
import {
  OFFICIAL_MISSIONS,
  readMissionRecords,
  getCompletedMissionsCount,
  type OfficialMissionId,
} from "@/lib/gameProgress";
import { HighContrastToggle } from "@/components/HighContrastToggle";
import { Teddy3D } from "@/components/Teddy3D";

import cardEngasgo from "@/assets/card-engasgo.webp";
import cardConvulsao from "@/assets/card-convulsao.webp";
import cardParada from "@/assets/card-parada.webp";
import cardQueimadura from "@/assets/card-queimadura.webp";
import cardTrauma from "@/assets/card-trauma.webp";

import {
  Sparkles,
  CheckCircle2,
  Play,
  ShieldAlert,
  Gamepad2,
  User,
  Heart,
  Flame,
  Brain,
  Shield,
  Apple,
  MapPin,
  Clock,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/jogos")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { missao?: string; tema?: string; fase?: number } => {
    const raw = (search.missao || search.tema) as string | undefined;
    const fase =
      typeof search.fase === "number" || typeof search.fase === "string"
        ? Number(search.fase)
        : undefined;
    if (!raw && !fase) return {};
    return { ...(raw ? { missao: raw } : {}), ...(fase ? { fase } : {}) };
  },
  head: () => ({
    meta: [
      { title: "Jogos e Missões — SINAL Primeiros Socorros" },
      {
        name: "description",
        content:
          "Explore os cinco cenários interativos, reconheça emergências e pratique condutas seguras de primeiros socorros ao lado do Teddy.",
      },
      { property: "og:title", content: "Jogos e Missões — SINAL" },
      {
        property: "og:description",
        content:
          "Quartel-general de missões 2.5D com o mascote Teddy para aprender primeiros socorros de forma jogável.",
      },
    ],
  }),
  component: JogosPage,
});

interface MissionCardMeta {
  id: OfficialMissionId;
  slug: string;
  order: string;
  title: string;
  cenario: string;
  cor: string;
  icone: typeof Apple;
  cardImg: string;
  resumo: string;
  condutaChave: string;
}

const MISSIONS_META: MissionCardMeta[] = [
  {
    id: "choking",
    slug: "engasgo",
    order: "01",
    title: "Engasgo",
    cenario: "Refeitório Escolar",
    cor: "#2E7DD1",
    icone: Apple,
    cardImg: cardEngasgo,
    resumo:
      "Reconheça a passagem de ar e a tosse eficaz. Ao notar tosse fraca ou sinal universal de asfixia, chame socorro e apoie as manobras com adultos.",
    condutaChave: "Incentive a tosse, chame Marina e apoie as manobras de desobstrução.",
  },
  {
    id: "burns",
    slug: "queimadura",
    order: "02",
    title: "Queimaduras",
    cenario: "Cozinha da Família",
    cor: "#FFC044",
    icone: Flame,
    cardImg: cardQueimadura,
    resumo:
      "Afastamento seguro da fonte de calor, resfriamento imediato com água corrente da torneira por 20 minutos e rejeição absoluta de receitas caseiras.",
    condutaChave: "Resfrie com água corrente da torneira. Sem gelo, manteiga ou pasta.",
  },
  {
    id: "seizure",
    slug: "convulsao",
    order: "03",
    title: "Convulsão",
    cenario: "Sala de Aula",
    cor: "#6D3FC3",
    icone: Brain,
    cardImg: cardConvulsao,
    resumo:
      "Afaste objetos pontiagudos ao redor, proteja a cabeça com apoio macio, nunca contenha movimentos à força e acione o SAMU 192.",
    condutaChave: "Proteja a cabeça, cronometre a crise e nunca coloque objetos na boca.",
  },
  {
    id: "cardiac_arrest",
    slug: "parada-cardiorrespiratoria",
    order: "04",
    title: "Parada Cardiorrespiratória",
    cenario: "Ginásio de Esportes",
    cor: "#BF3077",
    icone: Heart,
    cardImg: cardParada,
    resumo:
      "Checagem rápida de segurança e responsividade, chamado imediato ao 192, localização e transporte do DEA e acompanhamento do ritmo das compressões.",
    condutaChave: "Peça socorro urgente, traga o DEA e acompanhe o ritmo das compressões (100–120 bpm).",
  },
  {
    id: "trauma",
    slug: "trauma",
    order: "05",
    title: "Trauma e Quedas",
    cenario: "Pátio Escolar",
    cor: "#53C6B6",
    icone: Shield,
    cardImg: cardTrauma,
    resumo:
      "Estabilização preventiva sem movimentação forçada da vítima, avaliação de escoriações, lavagem cuidadosa com água e suporte emocional até o atendimento.",
    condutaChave: "Evite movimentar a vítima sem avaliação prévia e chame um responsável.",
  },
];

function JogosPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { setVisivel } = useTeddy();
  const [custom, setCustom] = useState(false);
  const [records, setRecords] = useState(readMissionRecords);

  const selectedMission = useMemo(() => {
    const raw = search.missao || search.tema;
    if (!raw) return null;
    return (
      MISSIONS_META.find((m) => m.slug === raw || m.id === raw) ?? null
    );
  }, [search.missao, search.tema]);

  useEffect(() => {
    setVisivel(false);
    return () => setVisivel(true);
  }, [setVisivel]);

  useEffect(() => {
    const handleUpdate = () => {
      setRecords(readMissionRecords());
    };
    window.addEventListener("sinal-mission-progress-update", handleUpdate);
    return () => window.removeEventListener("sinal-mission-progress-update", handleUpdate);
  }, []);

  const missoesConcluidasCount = getCompletedMissionsCount();

  const handleReturnToHQ = () => {
    setRecords(readMissionRecords());
    void navigate({ to: "/jogos", search: {} });
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      {/* 1. CABEÇALHO PRINCIPAL DO JOGO */}
      <header className="border-b border-border/80 bg-card/75 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-8">
          <Link
            to="/jogos"
            search={{}}
            className="flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight text-[color:var(--roxo)] transition-opacity hover:opacity-85 sm:text-2xl"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[color:var(--roxo)] to-[color:var(--azul)] text-white shadow-sm text-base">
              🎮
            </span>
            <div>
              <span>Sinal</span>
              <span className="ml-2 hidden text-xs font-semibold text-muted-foreground sm:inline">
                Quartel-General de Missões
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
        {/* 2. MODO ATIVO: QUANDO UMA DAS 5 MISSÕES ESTÁ SELECIONADA */}
        {selectedMission && (
          <section className="mb-12">
            <nav
              className="mb-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground"
              aria-label="Você está aqui"
            >
              <Link
                to="/jogos"
                search={{}}
                className="font-bold text-[color:var(--roxo)] hover:underline"
              >
                🕹️ Quartel-General
              </Link>
              <span className="text-border">/</span>
              <span className="rounded-full bg-[color:var(--roxo)]/15 px-2.5 py-0.5 font-bold text-[color:var(--roxo)]">
                Missão {selectedMission.order}: {selectedMission.title} ({selectedMission.cenario})
              </span>
            </nav>

            {/* Container dedicado com o motor Phaser 3 oficial */}
            <PhaserGameShell
              key={selectedMission.id}
              missionId={selectedMission.id}
              onReturn={handleReturnToHQ}
            />
          </section>
        )}

        {/* 3. QUARTEL-GENERAL: LISTA DAS EXATAS CINCO MISSÕES OFICIAIS */}
        {!selectedMission && (
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
                    <span>5 Missões Interativas em Phaser 3</span>
                  </div>

                  <h1 className="mt-4 font-display text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-white">
                    Quartel-General de Primeiros Socorros
                  </h1>

                  <p className="mt-3 max-w-xl text-sm sm:text-base text-white/95 leading-relaxed">
                    Explore cenários escolares e comunitários interativos, observe os sinais de alerta de cada
                    vítima e tome decisões seguras ao lado do Teddy.
                  </p>

                  {/* Ações Rápidas */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCustom(true)}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-display text-xs sm:text-sm font-extrabold text-[color:var(--roxo)] shadow-md transition-all hover:bg-white/90 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <User className="h-4 w-4 text-[color:var(--amarelo)]" />
                      Personalizar Teddy
                    </button>

                    <a
                      href="#missoes-cards"
                      className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2.5 font-display text-xs sm:text-sm font-bold text-white shadow-xs backdrop-blur-md transition-all hover:bg-white/25 cursor-pointer"
                    >
                      <Gamepad2 className="h-4 w-4" />
                      Ver as 5 Missões
                    </a>
                  </div>

                  {/* Resumo de Progresso Unificado */}
                  <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 pt-6 border-t border-white/20">
                    <div>
                      <span className="text-[11px] font-semibold text-white/80 block">
                        Missões Concluídas
                      </span>
                      <strong className="font-display text-2xl font-black text-[color:var(--amarelo)]">
                        {missoesConcluidasCount} / 5
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-white/80 block">
                        Status Geral
                      </span>
                      <strong className="font-display text-lg font-bold text-white">
                        {missoesConcluidasCount === 5 ? "🎓 Certificado Conquistado" : "Em Aprendizado"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-white/80 block">
                        Estrelas de Cuidado
                      </span>
                      <strong className="font-display text-2xl font-black text-[color:var(--amarelo)] flex items-center gap-1">
                        ⭐ {missoesConcluidasCount * 3}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Teddy 3D */}
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
                      <span>🧸 Teddy • Socorrista Sinal</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3.2 GRADE DAS CINCO MISSÕES OFICIAIS */}
            <section id="missoes-cards" className="mb-12">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <span className="font-display text-xs font-extrabold uppercase tracking-wider text-[color:var(--roxo)] block">
                    Cenários Oficiais
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                    As Cinco Missões de Primeiros Socorros
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Cada card abre diretamente a simulação completa no ambiente da escola.
                  </p>
                </div>

                <span className="rounded-full bg-muted px-4 py-1.5 text-xs font-bold text-muted-foreground border border-border">
                  Progresso: {missoesConcluidasCount} de 5 concluídas
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {MISSIONS_META.map((meta) => {
                  const Icone = meta.icone;
                  const isDone = !!records[meta.id]?.completed;
                  const record = records[meta.id];

                  return (
                    <article
                      key={meta.id}
                      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--sombra-suave)] transition-all hover:border-[color:var(--roxo)] hover:shadow-lg"
                    >
                      {/* Prévia do Cenário com Imagem Oficial */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                        <img
                          src={meta.cardImg}
                          alt={`Cenário da missão ${meta.title}: ${meta.cenario}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Badges superiores */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-xs font-extrabold text-white shadow-md backdrop-blur-md"
                            style={{ backgroundColor: `${meta.cor}dd` }}
                          >
                            <Icone className="h-3.5 w-3.5" />
                            <span>{meta.title}</span>
                          </span>

                          <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-bold text-white/90 backdrop-blur-md">
                            Missão {meta.order}
                          </span>
                        </div>

                        {/* Localização e Status de Conclusão */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                          <div className="flex items-center gap-1.5 text-xs font-bold drop-shadow-sm">
                            <MapPin className="h-3.5 w-3.5 text-[color:var(--amarelo)]" />
                            <span>{meta.cenario}</span>
                          </div>
                          {isDone && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
                              <CheckCircle2 className="h-3 w-3" />
                              Concluída
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Conteúdo do Card */}
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-display text-xl font-extrabold text-foreground group-hover:text-[color:var(--roxo)] transition-colors">
                          {meta.title}
                        </h3>

                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                          {meta.resumo}
                        </p>

                        <div className="mt-3 rounded-xl bg-muted/40 p-2.5 border border-border/60 text-[11px] text-foreground/90">
                          <strong className="block text-[color:var(--roxo)] font-bold mb-0.5">
                            Conduta Principal:
                          </strong>
                          {meta.condutaChave}
                        </div>

                        {/* Registro de Desempenho se Concluída */}
                        {isDone && record?.completedAt && (
                          <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Concluído em {new Date(record.completedAt).toLocaleDateString("pt-BR")}
                            </span>
                            {record.durationSeconds && (
                              <span>~{record.durationSeconds}s</span>
                            )}
                          </div>
                        )}

                        {/* Botão de Ação Direta */}
                        <div className="mt-auto pt-5">
                          <Link
                            to="/jogos"
                            search={{ missao: meta.slug }}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--roxo)] py-2.5 font-display text-xs sm:text-sm font-extrabold text-white shadow-sm transition-transform hover:scale-102 active:scale-98"
                          >
                            <Play className="h-4 w-4 fill-current" />
                            <span>{isDone ? "Rejogar Missão" : "Iniciar Missão"}</span>
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

        {/* 4. AVISO EDUCATIVO DE SIMULAÇÃO RESPONSÁVEL */}
        <aside className="mt-10 rounded-3xl border border-border/80 bg-muted/30 p-6 sm:p-8">
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
                risco, buscar socorro imediato com adultos e manter a calma. Os tempos das ações são adaptados
                para a jogabilidade e não reproduzem a duração de procedimentos clínicos reais.
              </p>
              <p>
                A simulação digital não substitui o treinamento presencial de suporte básico de vida
                oferecido por profissionais de saúde certificados.
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
