import { PlayCircle, Gamepad2, Sparkles, Monitor, Video, Smartphone } from "lucide-react";
import type { Tema, ItemVideoEducativo } from "@/data/temas";

interface DemonstracaoExperienciaProps {
  tema: Tema;
  className?: string;
}

export function DemonstracaoExperiencia({
  tema,
  className = "",
}: DemonstracaoExperienciaProps) {
  // Coletar a lista de vídeos: se tema.videos existir com itens, usa-os; caso contrário, se tiver videoSrc único, constrói um item padrão
  const listaVideos: ItemVideoEducativo[] =
    tema.videos && tema.videos.length > 0
      ? tema.videos
      : tema.videoSrc
      ? [
          {
            id: `video-${tema.slug}`,
            titulo: `Vídeo educativo — ${tema.nome}`,
            subtitulo: `Procedimento de primeiros socorros`,
            src: tema.videoSrc,
            aspectRatio: "horizontal",
          },
        ]
      : [];

  const hasVideos = listaVideos.length > 0;
  const isVerticalGroup = listaVideos.some((v) => v.aspectRatio === "vertical");

  return (
    <section
      id={`demonstracao-${tema.slug}`}
      data-section="demonstracao"
      aria-labelledby={`titulo-demonstracao-${tema.slug}`}
      className={`scroll-mt-24 mt-12 sm:mt-16 ${className}`}
    >
      {/* Cabeçalho da Seção */}
      <div className="mb-6 flex flex-col items-start gap-2">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-display font-extrabold uppercase tracking-[0.2em] shadow-xs"
          style={{
            backgroundColor: `${tema.color}20`,
            color: tema.color,
            border: `1px solid ${tema.color}40`,
          }}
        >
          {hasVideos ? (
            <>
              {isVerticalGroup ? (
                <Smartphone className="h-3.5 w-3.5" />
              ) : (
                <Video className="h-3.5 w-3.5" />
              )}
              {listaVideos.length > 1
                ? "Vídeos Educativos • Procedimentos Práticos"
                : "Vídeo Educativo • Primeiros Socorros"}
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Demonstração • Mini Experiência Interativa
            </>
          )}
        </span>

        <h2
          id={`titulo-demonstracao-${tema.slug}`}
          className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground"
        >
          {hasVideos
            ? listaVideos.length > 1
              ? `Vídeos educativos: Primeiros socorros para ${tema.nome}`
              : `Vídeo educativo: Primeiros socorros para ${tema.nome}`
            : `Demonstração da experiência de ${tema.nome}`}
        </h2>

        <p className="max-w-2xl text-sm sm:text-base text-[color:var(--muted-foreground)]">
          {hasVideos
            ? listaVideos.length > 1
              ? `Assista às demonstrações práticas em vídeo gravadas para cada situação de ${tema.nome.toLowerCase()}. Aprenda o procedimento correto com calma e segurança.`
              : `Assista ao vídeo explicativo sobre ${tema.nome.toLowerCase()} e aprenda o passo a passo seguro para reconhecer e prestar socorro com calma.`
            : `Veja como a simulação interativa em pixel art funciona na prática. Uma prévia visual do cenário educativo para você reconhecer e aplicar os primeiros socorros com segurança.`}
        </p>
      </div>

      {/* Exibição dos Vídeos ou Placeholder de Em Breve */}
      {hasVideos ? (
        isVerticalGroup ? (
          /* Disposição especializada para vídeos verticais (proporção ~9:16) */
          <div
            className={`grid gap-8 justify-items-center ${
              listaVideos.length > 1
                ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
                : "grid-cols-1 max-w-md mx-auto"
            }`}
          >
            {listaVideos.map((video, index) => (
              <div
                key={video.id || index}
                className="w-full max-w-[340px] sm:max-w-[360px] flex flex-col overflow-hidden rounded-3xl border shadow-[var(--sombra-forte)] transition-all duration-300"
                style={{
                  borderColor: `${tema.color}50`,
                  background: `radial-gradient(ellipse 100% 70% at 50% 30%, ${tema.color}15 0%, #0d0a1a 75%, #06040c 100%)`,
                }}
              >
                {/* Barra de controle estética superior do player vertical */}
                <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-2.5 backdrop-blur-md">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500/80" />
                    <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                    <span className="ml-1.5 font-mono text-[10px] sm:text-[11px] text-white/60 truncate max-w-[140px]">
                      sinal://video/{video.id}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-display text-[10px] sm:text-[11px] font-bold text-[color:var(--amarelo)]">
                    <Smartphone className="h-3 w-3" />
                    Vertical
                  </span>
                </div>

                {/* Área do vídeo vertical com proporção 9:16 e limite de altura ergonômico */}
                <div className="relative aspect-[9/16] max-h-[72vh] w-full bg-black flex items-center justify-center overflow-hidden">
                  <video
                    src={video.src}
                    controls
                    playsInline
                    preload="metadata"
                    poster={video.poster || tema.cardImage || tema.image}
                    aria-label={video.titulo}
                    className="h-full w-full object-contain focus:outline-hidden"
                  >
                    Seu navegador não suporta a reprodução deste vídeo.
                  </video>
                </div>

                {/* Rodapé com identificação clara do procedimento */}
                <div className="border-t border-white/10 bg-black/60 p-4 backdrop-blur-md flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-sm sm:text-base font-extrabold text-white leading-snug">
                      {video.titulo}
                    </h3>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono font-bold"
                      style={{
                        backgroundColor: `${tema.color}25`,
                        color: tema.color,
                        border: `1px solid ${tema.color}40`,
                      }}
                    >
                      {video.subtitulo || "Procedimento"}
                    </span>
                  </div>

                  {video.descricao && (
                    <p className="text-xs text-white/70 leading-relaxed">
                      {video.descricao}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Disposição padrão para vídeos horizontais (16:9) */
          <div
            className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border shadow-[var(--sombra-forte)] transition-all duration-300"
            style={{
              borderColor: `${tema.color}50`,
              background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${tema.color}18 0%, #0d0a1a 70%, #06040c 100%)`,
            }}
          >
            {/* Barra de controle estética superior (estilo monitor retro-moderno de simulador) */}
            <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-2.5 sm:px-6 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] sm:text-xs text-white/60">
                  sinal://video/{tema.slug}.mp4
                </span>
              </div>

              <div className="flex items-center gap-2 font-display text-xs font-semibold text-white/70">
                <Video className="h-3.5 w-3.5 text-[color:var(--amarelo)]" />
                <span className="hidden sm:inline">Vídeo Oficial Sinal</span>
              </div>
            </div>

            {/* Área interna de exibição de vídeo (16:9) */}
            <div className="relative aspect-video w-full bg-black">
              <video
                src={listaVideos[0].src}
                controls
                playsInline
                preload="metadata"
                poster={listaVideos[0].poster || tema.cardImage || tema.image}
                aria-label={`Vídeo educativo de primeiros socorros sobre ${tema.nome}`}
                className="h-full w-full object-contain focus:outline-hidden"
              >
                Seu navegador não suporta a reprodução deste vídeo.
              </video>
            </div>

            {/* Rodapé do container */}
            <div className="flex flex-wrap items-center justify-between border-t border-white/10 bg-black/50 px-4 py-3 sm:px-6 text-xs text-white/65 backdrop-blur-md">
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: tema.color }}
                />
                Vídeo educativo oficial • {tema.nome}
              </span>
              <span className="hidden sm:inline font-display text-[11px] opacity-80">
                Aprender → Praticar → Compreender
              </span>
            </div>
          </div>
        )
      ) : (
        /* Estado placeholder quando ainda não há vídeos para o tema */
        <div
          className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border shadow-[var(--sombra-forte)] transition-all duration-300"
          style={{
            borderColor: `${tema.color}50`,
            background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${tema.color}18 0%, #0d0a1a 70%, #06040c 100%)`,
          }}
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-2.5 sm:px-6 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] sm:text-xs text-white/60">
                sinal://simulador/{tema.slug}
              </span>
            </div>

            <div className="flex items-center gap-2 font-display text-xs font-semibold text-white/70">
              <Gamepad2 className="h-3.5 w-3.5 text-[color:var(--amarelo)]" />
              <span className="hidden sm:inline">Universo 2D Sinal</span>
            </div>
          </div>

          <div className="relative flex aspect-video min-h-[260px] sm:min-h-[380px] w-full flex-col items-center justify-center p-6 text-center">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute h-48 w-48 sm:h-64 sm:w-64 rounded-full blur-3xl opacity-25"
              style={{ backgroundColor: tema.color }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex max-w-md flex-col items-center gap-3 sm:gap-4 px-4">
              <div
                className="relative flex h-14 w-14 sm:h-18 sm:w-18 items-center justify-center rounded-2xl sm:rounded-3xl border border-white/20 shadow-xl backdrop-blur-md transition-transform hover:scale-105"
                style={{
                  backgroundColor: `${tema.color}25`,
                  color: "#ffffff",
                }}
              >
                <PlayCircle className="h-7 w-7 sm:h-9 sm:w-9 text-white opacity-95 drop-shadow-md" />
                <span
                  className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full"
                  style={{ backgroundColor: tema.color }}
                >
                  <span className="h-2 w-2 animate-ping rounded-full bg-white opacity-75" />
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                Em breve demonstração
              </h3>

              <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-sm">
                Estamos preparando a gravação em vídeo educativo de{" "}
                <strong className="text-white font-semibold">{tema.nome}</strong>. Em breve você
                poderá conferir toda a orientação em vídeo nesta seção!
              </p>

              <div className="mt-1 flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] font-semibold text-white/85 backdrop-blur-sm border border-white/15">
                  <Monitor className="h-3 w-3 text-[color:var(--aqua)]" />
                  Pixel Art 2D
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] font-semibold text-white/85 backdrop-blur-sm border border-white/15">
                  Primeiros Socorros
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] font-semibold text-white/85 backdrop-blur-sm border border-white/15">
                  Sem violência
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between border-t border-white/10 bg-black/50 px-4 py-3 sm:px-6 text-xs text-white/65 backdrop-blur-md">
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: tema.color }}
              />
              Área de demonstração em vídeo • {tema.nome}
            </span>
            <span className="hidden sm:inline font-display text-[11px] opacity-80">
              Aprender → Praticar → Compreender
            </span>
          </div>
        </div>
      )}
    </section>
  );
}