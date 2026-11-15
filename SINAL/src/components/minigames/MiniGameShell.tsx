import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import type { GameLevel, GameTheme } from "@/data/gameplay";
import { usePlayerAvatar } from "@/lib/avatarStore";
import { completeLevel } from "@/lib/gameProgress";
import { AvatarCustomizerModal } from "./AvatarCustomizerModal";
import { PixelRenderer } from "./PixelRenderer";
import { TeddyRenderer } from "./TeddyRenderer";
import { resolveTeddyState } from "./animation";
import { sortEntitiesByDepth, type DepthEntity } from "./depthSorting";
import { movePlayer, safeDelta, SPEED, type Point } from "./movement";
import { VirtualJoystick } from "./VirtualJoystick";
import type { JoystickVector } from "./joystick";
import { useFullscreenLandscape } from "./useFullscreenLandscape";
import { Maximize2, Minimize2, RotateCcw } from "lucide-react";
import "./gameplay.css";

type Direction = "down" | "up" | "left" | "right";
const START = { x: 35, y: 165 };
const RANGE = 23;
const keys: Record<string, string> = {
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  KeyE: "act",
  Space: "act",
};

export function MiniGameShell({ theme, level }: { theme: GameTheme; level: GameLevel }) {
  const [avatar] = usePlayerAvatar();
  const avatarRef = useRef(avatar);
  useEffect(() => {
    avatarRef.current = avatar;
  }, [avatar]);

  const canvas = useRef<HTMLCanvasElement>(null);
  const root = useRef<HTMLElement>(null);
  const commands = useRef<Map<string, string>>(new Map());
  const destination = useRef<Point | null>(null);

  // Vetor do Joystick Analógico Virtual
  const joystickVector = useRef<JoystickVector>({
    x: 0,
    y: 0,
    magnitude: 0,
    angle: 0,
    active: false,
  });

  // Hook de Tela Cheia e Orientação Horizontal
  const {
    isFullscreen,
    showOrientationPrompt,
    toggleFullscreen,
    dismissOrientationPrompt,
  } = useFullscreenLandscape(root);

  const runtime = useRef({
    position: { ...START },
    direction: "down" as Direction,
    step: 0,
    elapsed: 0,
    walking: 0,
    paused: false,
    custom: false,
    finished: false,
  });

  const [ui, setUi] = useState({
    step: 0,
    progress: 0,
    near: false,
    message: "",
    finished: false,
    saved: true,
  });
  const [paused, setPaused] = useState(false);
  const [custom, setCustom] = useState(false);

  const handleJoystickChange = useCallback((vector: JoystickVector) => {
    joystickVector.current = vector;
    if (vector.active) {
      destination.current = null;
    }
  }, []);

  const clear = () => {
    commands.current.clear();
    destination.current = null;
    joystickVector.current = { x: 0, y: 0, magnitude: 0, angle: 0, active: false };
    runtime.current.elapsed = 0;
  };

  const pause = () => {
    clear();
    runtime.current.paused = true;
    setPaused(true);
  };

  const resume = () => {
    clear();
    runtime.current.paused = false;
    setPaused(false);
    root.current?.focus();
  };

  const customize = () => {
    pause();
    runtime.current.custom = true;
    setCustom(true);
  };

  const restart = () => {
    clear();
    runtime.current = {
      position: { ...START },
      direction: "down",
      step: 0,
      elapsed: 0,
      walking: 0,
      paused: false,
      custom: false,
      finished: false,
    };
    setUi({ step: 0, progress: 0, near: false, message: "", finished: false, saved: true });
    setPaused(false);
    root.current?.focus();
  };

  useEffect(() => {
    root.current?.focus();
    const down = (e: KeyboardEvent) => {
      const r = runtime.current;
      if (r.custom) return;
      if (e.code === "Escape") {
        e.preventDefault();
        if (!r.finished) pause();
        return;
      }
      if (r.paused || r.finished || !keys[e.code]) return;
      if (document.activeElement !== root.current && document.activeElement !== canvas.current)
        return;
      e.preventDefault();
      commands.current.set(e.code, keys[e.code]);
      destination.current = null;
    };

    const up = (e: KeyboardEvent) => {
      commands.current.delete(e.code);
    };

    const hidden = () => {
      if (document.hidden) pause();
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", pause);
    document.addEventListener("visibilitychange", hidden);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", pause);
      document.removeEventListener("visibilitychange", hidden);
      clear();
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let previous: number | null = null;
    let lastUi = 0;

    const tick = (now: number) => {
      const dt = previous === null ? 0 : safeDelta((now - previous) / 1000);
      previous = now;
      const r = runtime.current;
      let moving = false;
      let near = false;
      const objective = level.objectives[r.step];
      const held = new Set(commands.current.values());

      if (!r.paused && !r.custom && !r.finished) {
        // 1. Entrada de Teclado
        let input = {
          x: Number(held.has("right")) - Number(held.has("left")),
          y: Number(held.has("down")) - Number(held.has("up")),
        };
        let distance = Infinity;

        // 2. Entrada do Joystick Virtual Analógico (se ativo e sem teclado)
        if (joystickVector.current.active && input.x === 0 && input.y === 0) {
          input = {
            x: joystickVector.current.x,
            y: joystickVector.current.y,
          };
          distance = SPEED * dt * joystickVector.current.magnitude;
        } else if (destination.current && input.x === 0 && input.y === 0) {
          // 3. Toque direto no Canvas para caminhar
          input = {
            x: destination.current.x - r.position.x,
            y: destination.current.y - r.position.y,
          };
          distance = Math.hypot(input.x, input.y);
          if (distance < 1) {
            destination.current = null;
            input = { x: 0, y: 0 };
          }
        }

        const next = movePlayer(r.position, input, dt, theme.obstacles, distance);
        moving = Math.hypot(next.x - r.position.x, next.y - r.position.y) > 0.001;

        if (moving) {
          r.direction =
            Math.abs(input.x) > Math.abs(input.y)
              ? input.x > 0
                ? "right"
                : "left"
              : input.y > 0
                ? "down"
                : "up";
          r.walking += dt * 60;
        }

        r.position = next;
        near = !!objective && Math.hypot(next.x - objective.x, next.y - objective.y) <= RANGE;

        if (near && held.has("act") && !moving) {
          r.elapsed += dt;
        } else {
          r.elapsed = 0;
        }

        if (objective && r.elapsed >= objective.seconds) {
          r.step++;
          r.elapsed = 0;
          clear();
          r.finished = r.step === level.objectives.length;
          const saved = r.finished ? completeLevel(level.theme, level.number) : true;
          setUi({
            step: r.step,
            progress: 0,
            near: false,
            message: objective.done,
            finished: r.finished,
            saved,
          });
        } else if (now - lastUi > 70) {
          lastUi = now;
          setUi((old) => ({
            ...old,
            step: r.step,
            progress: objective ? r.elapsed / objective.seconds : 0,
            near,
          }));
        }
      }

      // RENDERIZAÇÃO EM PERSPECTIVA 2.5D COM Y-SORTING
      const ctx = canvas.current?.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 360, 202);
        ctx.imageSmoothingEnabled = false;

        // A. Desenha o fundo e paredes do cenário
        PixelRenderer.drawEnvironment(ctx, theme.scene, 360, 202);

        if (theme.scene === "cozinha") {
          PixelRenderer.drawLabel(ctx, "PIA", 200, 45);
          PixelRenderer.drawLabel(ctx, "FOGÃO", 62, 45);
        }

        // B. Monta lista de entidades para ordenação de profundidade 2.5D
        const entities: DepthEntity[] = [];
        const totalTimeSeconds = now / 1000;

        // 1. Itens e NPCs do cenário
        for (const item of theme.items) {
          entities.push({
            id: `item:${item.id}`,
            depthY: item.y,
            render: (c) => PixelRenderer.drawSceneItem(c, item, theme.slug, level.number, r.step, r.walking),
          });
        }

        // 2. Teddy (Protagonista com resolução de estado e animações)
        const animState = resolveTeddyState({
          isMoving: moving,
          isInteracting: held.has("act") && near,
          isFinished: r.finished,
          isNearVictim: near,
        });

        entities.push({
          id: "player:teddy",
          depthY: r.position.y,
          render: (c) =>
            TeddyRenderer.drawTeddy(
              c,
              avatarRef.current,
              r.position.x,
              r.position.y,
              r.direction,
              animState,
              totalTimeSeconds,
            ),
        });

        // 3. Ordenação estável por profundidade vertical (Y-sorting)
        const sortedEntities = sortEntitiesByDepth(entities);
        for (const entity of sortedEntities) {
          entity.render(ctx);
        }

        // C. Marcadores de objetivos concluídos e objetivo atual
        level.objectives
          .slice(0, r.step)
          .forEach((o) => PixelRenderer.drawMarker(ctx, o.x, o.y, "✓", false));

        if (objective) {
          PixelRenderer.drawMarker(ctx, objective.x, objective.y, String(r.step + 1), true);

          // Prompt visual interativo flutuando acima do alvo quando o Teddy estiver próximo
          if (near && !r.finished) {
            PixelRenderer.drawInteractionPrompt(ctx, objective.x, objective.y - 10, "AGIR", totalTimeSeconds);
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [level, theme]);

  const pointerEnd = (id: number) => {
    commands.current.delete(`pointer:${id}`);
  };

  const control = (command: string) => ({
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (runtime.current.paused || runtime.current.custom || runtime.current.finished) return;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Fallback seguro
      }
      root.current?.focus();
      destination.current = null;
      commands.current.set(`pointer:${e.pointerId}`, command);
    },
    onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => pointerEnd(e.pointerId),
    onPointerCancel: (e: React.PointerEvent<HTMLButtonElement>) => pointerEnd(e.pointerId),
    onLostPointerCapture: (e: React.PointerEvent<HTMLButtonElement>) => pointerEnd(e.pointerId),
  });

  const current = level.objectives[ui.step];

  return (
    <section
      ref={root}
      tabIndex={0}
      onBlur={(event) => {
        if (!isFullscreen && !event.currentTarget.contains(event.relatedTarget)) {
          pause();
        }
      }}
      className={`game-shell ${isFullscreen ? "is-fullscreen" : ""}`}
      aria-label={`Jogo: ${theme.name}, fase ${level.number}`}
    >
      {/* Barra de Ferramentas / Header do Jogo */}
      <div className="game-toolbar">
        <div>
          <span className="game-eyebrow">
            {theme.name} · Fase {level.number} de 2
          </span>
          <h2>{level.title}</h2>
        </div>

        <div className="game-tools">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="border-[color:var(--amarelo)]/40 hover:border-[color:var(--amarelo)]"
            title={isFullscreen ? "Sair da tela cheia" : "Jogar em tela cheia na horizontal"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-4 w-4" />
                <span>Restaurar</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4 text-[color:var(--amarelo)]" />
                <span>Tela cheia</span>
              </>
            )}
          </button>

          <button type="button" onClick={customize} disabled={paused || ui.finished}>
            Personagem
          </button>
          <button type="button" onClick={pause} disabled={ui.finished || paused}>
            Pausar
          </button>
          <button type="button" onClick={restart}>
            Reiniciar
          </button>
        </div>
      </div>

      {/* Cenário Principal (Canvas) */}
      <div className="game-stage">
        <canvas
          ref={canvas}
          width={360}
          height={202}
          aria-label="Cenário do jogo. Controle o mascote Teddy com o joystick analógico ou setas/WASD até o marcador numerado."
          onPointerDown={(e) => {
            if (runtime.current.paused || runtime.current.custom || runtime.current.finished)
              return;
            e.preventDefault();
            try {
              e.currentTarget.setPointerCapture(e.pointerId);
            } catch {}
            root.current?.focus();
            const rect = e.currentTarget.getBoundingClientRect();
            destination.current = {
              x: ((e.clientX - rect.left) * 360) / rect.width,
              y: ((e.clientY - rect.top) * 202) / rect.height,
            };
          }}
          onPointerUp={() => {
            destination.current = null;
          }}
          onPointerCancel={() => {
            destination.current = null;
          }}
          onLostPointerCapture={() => {
            destination.current = null;
          }}
        />

        {/* Overlay de Pausa */}
        {paused && !custom && !ui.finished && (
          <div className="game-overlay">
            <h3>Jogo pausado</h3>
            <p>Os comandos foram interrompidos.</p>
            <button type="button" onClick={resume}>
              Continuar jogo
            </button>
          </div>
        )}

        {/* Overlay de Fase Concluída */}
        {ui.finished && (
          <div className="game-overlay">
            <span className="game-eyebrow">3 de 3 objetivos</span>
            <h3>Fase concluída!</h3>
            <p>
              {ui.saved
                ? "Conclusão salva neste navegador."
                : "A conclusão não foi salva: armazenamento indisponível. Você pode continuar jogando."}
            </p>
            <div className="game-tools mt-3">
              {level.number < 2 && (
                <Link to="/jogos" search={{ tema: theme.slug, fase: 2 }}>
                  Próxima fase →
                </Link>
              )}
              <Link to="/jogos" search={{ tema: theme.slug }}>
                Voltar às fases
              </Link>
            </div>
          </div>
        )}

        {/* Overlay de Orientação (Girar Celular) em Tela Cheia / Retrato */}
        {showOrientationPrompt && (
          <div className="orientation-overlay">
            <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/20">
              <RotateCcw className="h-8 w-8 text-[color:var(--amarelo)] animate-spin [animation-duration:4s]" />
            </div>
            <h3 className="font-display text-xl font-extrabold text-white">
              Gire o aparelho para a horizontal
            </h3>
            <p className="mt-2 max-w-xs text-xs text-white/80 leading-relaxed">
              O modo de jogo horizontal oferece melhor visualização do cenário e controle confortável
              com o joystick analógico.
            </p>
            <button
              type="button"
              onClick={dismissOrientationPrompt}
              className="mt-4 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-bold text-white hover:bg-white/25 cursor-pointer"
            >
              Continuar nesta orientação
            </button>
          </div>
        )}
      </div>

      {/* CONTROLES EM SOBREPOSIÇÃO NA TELA CHEIA */}
      {isFullscreen && (
        <div className="game-fullscreen-controls">
          <div className="game-fullscreen-joystick">
            <VirtualJoystick
              onChange={handleJoystickChange}
              disabled={paused || ui.finished}
              size={128}
              knobSize={50}
            />
          </div>

          {/* HUD Centralizado com Objetivo Atual */}
          <div className="game-fullscreen-hud">
            <span>
              {Math.min(ui.step + 1, 3)}/3: {current?.task ?? "Concluído!"}
            </span>
            {ui.progress > 0 && (
              <span className="ml-2 text-[color:var(--amarelo)]">
                ({Math.round(ui.progress * 100)}%)
              </span>
            )}
          </div>

          <div className="game-fullscreen-act">
            <button
              type="button"
              className="game-act"
              {...control("act")}
              disabled={paused || ui.finished}
              aria-label="Segurar para agir ou executar procedimento"
            >
              AGIR
              <span>segure</span>
            </button>
          </div>
        </div>
      )}

      {/* DASHBOARD DE CONTROLES NO MODO NORMAL (NÃO-TELA CHEIA) */}
      {!isFullscreen && (
        <>
          <div className="game-dashboard">
            <div>
              <span className="game-eyebrow">Objetivo {Math.min(ui.step + 1, 3)} de 3</span>
              <h3>{current?.task ?? "Todos os objetivos concluídos"}</h3>
              <p>
                {paused
                  ? "Pausado — continue para jogar."
                  : ui.near
                    ? "Segure E, Espaço ou AGIR, sem andar."
                    : "Caminhe até o marcador numerado."}
              </p>
              <progress max={1} value={paused ? 0 : ui.progress} aria-label="Progresso da ação" />
              <p className="game-feedback" role="status">
                {ui.message}
              </p>
            </div>

            {/* Painel de Controles com Joystick Analógico substituindo as 4 setas */}
            <div className="game-controls" aria-label="Controles de toque">
              <VirtualJoystick
                onChange={handleJoystickChange}
                disabled={paused || ui.finished}
                size={112}
                knobSize={44}
              />
              <button
                type="button"
                className="game-act"
                {...control("act")}
                disabled={paused || ui.finished}
                aria-label="Segurar para agir"
              >
                AGIR
                <span>segure</span>
              </button>
            </div>
          </div>

          {/* Lista de Objetivos */}
          <ol className="game-objectives">
            {level.objectives.map((o, i) => (
              <li
                key={i}
                aria-current={i === ui.step ? "step" : undefined}
                className={i < ui.step ? "done" : ""}
              >
                <span>{i < ui.step ? "✓" : i + 1}</span>
                {o.task}
              </li>
            ))}
          </ol>

          <p className="game-help">
            <strong>Computador:</strong> Setas ou WASD para andar · E ou Espaço: segurar para agir ·
            Esc: pausar. <br />
            <strong>Celular / Toque:</strong> Use o <strong>joystick analógico 360°</strong> na
            esquerda e segure <strong>AGIR</strong> na direita. Clique em{" "}
            <strong>Tela cheia</strong> para jogar na horizontal com o Teddy.
          </p>
        </>
      )}

      {/* Modal de Customização do Avatar */}
      <AvatarCustomizerModal
        isOpen={custom}
        onClose={() => {
          runtime.current.custom = false;
          setCustom(false);
        }}
      />
    </section>
  );
}
