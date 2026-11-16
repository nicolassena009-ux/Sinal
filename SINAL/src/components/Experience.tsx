import { Link } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import {
  ArrowRight,
  Check,
  Gamepad2,
  Headphones,
  Phone,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { SafeTeddy } from "@/components/cinema/SafeTeddy";
import type { TeddyEstado } from "@/components/Teddy";
import { METODO, temas } from "@/data/temas";
import { vars } from "@/lib/motion";

/* ==========================================================================
 * Home do Sinal (identidade lilás original, nível de apresentação).
 * Um momento marcante: o Teddy oficial sobre o emblema da mão com coração e o
 * desafio "Qual é o sinal?", que ensina reconhecendo. O resto é calmo e legível.
 * ========================================================================== */

const SINAIS = temas.map((t) => ({
  slug: t.slug,
  nome: t.nome,
  cor: t.color,
  sinal: t.reconhecer[0],
}));

/** Emblema do moletom do Teddy: mão aberta com coração. */
function Emblema({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 240" aria-hidden="true" className={className}>
      <g fill="currentColor">
        <rect x="36" y="58" width="26" height="92" rx="13" transform="rotate(-8 49 104)" />
        <rect x="70" y="22" width="27" height="118" rx="13.5" transform="rotate(-3 83 81)" />
        <rect x="104" y="18" width="27" height="122" rx="13.5" transform="rotate(3 117 79)" />
        <rect x="137" y="44" width="26" height="104" rx="13" transform="rotate(9 150 96)" />
        <rect x="6" y="122" width="28" height="74" rx="14" transform="rotate(-38 20 159)" />
        <path d="M38 118 Q36 210 100 226 Q164 210 162 118 Z" />
      </g>
      <path
        d="M100 196 C70 176 62 160 66 146 C70 132 88 128 100 142 C112 128 130 132 134 146 C138 160 130 176 100 196 Z"
        className="emblema-coracao"
      />
    </svg>
  );
}

/* ----------------------------- Hero + desafio ----------------------------- */

type Resposta = { escolhido: string; certo: boolean } | null;

function DesafioSinal({ onPose }: { onPose: (e: TeddyEstado) => void }) {
  const [i, setI] = useState(0);
  const [resposta, setResposta] = useState<Resposta>(null);
  const id = useId();
  const atual = SINAIS[i];

  const responder = (slug: string) => {
    if (resposta) return;
    const certo = slug === atual.slug;
    setResposta({ escolhido: slug, certo });
    onPose(certo ? "comemorando" : "preocupado");
  };
  const proximo = () => {
    setResposta(null);
    setI((v) => (v + 1) % SINAIS.length);
    onPose("pensando");
  };

  return (
    <section aria-labelledby={`${id}-t`} className="desafio">
      <div className="flex items-center justify-between gap-3">
        <h2
          id={`${id}-t`}
          className="font-display text-lg font-extrabold text-[color:var(--tinta)]"
        >
          Qual é o sinal?
        </h2>
        <span
          className="text-sm font-semibold text-[color:var(--muted-foreground)]"
          aria-live="polite"
        >
          {i + 1} de {SINAIS.length}
        </span>
      </div>
      <p
        key={atual.slug}
        className="desafio-sinal mt-2 text-[17px] leading-snug text-[color:var(--tinta)]"
      >
        “{atual.sinal}”
      </p>
      <div role="group" aria-label="Escolha a situação" className="mt-4 flex flex-wrap gap-2">
        {SINAIS.map((s) => {
          const marcado = resposta?.escolhido === s.slug;
          const correto = resposta && s.slug === atual.slug;
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => responder(s.slug)}
              aria-pressed={marcado}
              disabled={!!resposta && !marcado && !correto}
              className="desafio-opcao"
              data-estado={correto ? "certo" : marcado ? "errado" : undefined}
              style={vars({ "--c": s.cor })}
            >
              {correto ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : marcado ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : null}
              {s.nome}
            </button>
          );
        })}
      </div>
      <div className="mt-4 min-h-[44px]" aria-live="polite">
        {!resposta && (
          <p className="pt-2.5 text-sm text-[color:var(--muted-foreground)]">
            Toque na situação que combina com o sinal.
          </p>
        )}
        {resposta && (
          <div className="desafio-feedback flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] font-semibold text-[color:var(--tinta)]">
              {resposta.certo
                ? "Isso! Você reconheceu o sinal."
                : `Quase. Esse é um sinal de ${atual.nome.toLowerCase()}.`}
            </p>
            <div className="flex gap-2">
              <Link
                to="/tema/$slug"
                params={{ slug: atual.slug }}
                className="press inline-flex min-h-10 items-center rounded-full px-4 font-display text-sm font-bold text-[color:var(--roxo)] underline-offset-4 hover:underline"
              >
                Ver o guia
              </Link>
              <button
                type="button"
                onClick={proximo}
                className="press inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[color:var(--tinta)] px-4 font-display text-sm font-bold text-white"
              >
                Próximo sinal
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Hero() {
  const [pose, setPose] = useState<TeddyEstado>("acenando");
  const [tamanho, setTamanho] = useState(360);

  useEffect(() => {
    const on = () =>
      setTamanho(window.innerWidth < 640 ? 250 : window.innerWidth < 1024 ? 320 : 400);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  // Depois do aceno de boas-vindas, o Teddy fica de frente, atento.
  useEffect(() => {
    const t = setTimeout(() => setPose((p) => (p === "acenando" ? "idle" : p)), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <header className="home-hero relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-28 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-4 lg:pb-24 lg:pt-32">
        <div className="hero-stagger relative z-10">
          <h1
            style={vars({ "--i": 0 })}
            className="home-titulo font-display font-extrabold text-[color:var(--tinta)]"
          >
            Reconhecer também é proteger.
          </h1>
          <p
            style={vars({ "--i": 1 })}
            className="mt-6 max-w-[34ch] text-lg leading-relaxed text-[color:var(--muted-foreground)] sm:text-xl"
          >
            O Sinal ensina crianças e adolescentes a perceber uma emergência, entender o que está
            acontecendo e saber o que fazer até a ajuda chegar.
          </p>
          <div style={vars({ "--i": 2 })} className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/temas"
              className="btn-shine press inline-flex min-h-12 items-center gap-2 rounded-full bg-[color:var(--roxo)] px-7 font-display text-base font-extrabold text-white shadow-[0_14px_30px_-14px_rgba(109,63,195,0.9)]"
            >
              Conhecer os 5 temas
            </Link>
            <Link
              to="/jogos"
              className="press inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[color:var(--tinta)]/15 bg-white px-6 font-display text-base font-bold text-[color:var(--tinta)] transition-colors hover:border-[color:var(--roxo)]"
            >
              <Gamepad2 className="h-5 w-5 text-[color:var(--roxo)]" aria-hidden="true" />
              Praticar com o Teddy
            </Link>
          </div>
          <ul
            style={vars({ "--i": 3 })}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold text-[color:var(--muted-foreground)]"
          >
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[color:var(--aqua)]" aria-hidden="true" />
              Conteúdo revisado pela Enfermagem
            </li>
            <li className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-[color:var(--aqua)]" aria-hidden="true" />
              Narração em áudio
            </li>
          </ul>
        </div>

        <div className="home-palco relative mx-auto w-full max-w-[540px]">
          <div aria-hidden="true" className="home-palco-disco">
            <Emblema className="home-palco-emblema" />
          </div>
          <div className="home-palco-teddy relative flex justify-center pt-4 lg:justify-end lg:pr-2">
            <SafeTeddy estado={pose} tamanho={tamanho} onClick={() => setPose("feliz")} />
          </div>
          <div className="relative z-10 -mt-10 sm:-mt-14 lg:absolute lg:-left-24 lg:bottom-10 lg:mt-0 lg:w-[310px]">
            <DesafioSinal onPose={setPose} />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------- Situações -------------------------------- */

function Situacoes() {
  const [destaque, ...resto] = temas;
  return (
    <section aria-labelledby="situacoes-t" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <div className="max-w-2xl">
          <h2
            id="situacoes-t"
            className="home-h2 font-display font-extrabold text-[color:var(--tinta)]"
          >
            Cinco situações que todo mundo deveria saber reconhecer
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg text-[color:var(--muted-foreground)]">
            Cada guia explica o que é, como perceber, o que fazer e o que evitar, com narração e
            prática no final.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Link
            to="/tema/$slug"
            params={{ slug: destaque.slug }}
            className="tema-card group lg:row-span-2"
            style={vars({ "--c": destaque.color })}
          >
            <div className="tema-card-img aspect-[16/10] lg:aspect-auto lg:flex-1">
              <img src={destaque.cardImage} alt="" width={1024} height={636} loading="lazy" />
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="font-display text-3xl font-extrabold text-[color:var(--tinta)]">
                {destaque.nome}
              </h3>
              <p className="mt-2 max-w-[44ch] text-[color:var(--muted-foreground)]">
                {destaque.resumo}
              </p>
              <span className="tema-card-cta mt-5">
                Abrir o guia <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
          <div className="grid gap-5 sm:grid-cols-2">
            {resto.map((t) => (
              <Link
                key={t.slug}
                to="/tema/$slug"
                params={{ slug: t.slug }}
                className="tema-card group"
                style={vars({ "--c": t.color })}
              >
                <div className="tema-card-img aspect-[16/10]">
                  <img src={t.cardImage} alt="" width={1024} height={636} loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-extrabold leading-tight text-[color:var(--tinta)]">
                    {t.nome}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-snug text-[color:var(--muted-foreground)]">
                    {t.resumo}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Método --------------------------------- */

function Metodo() {
  return (
    <section
      aria-labelledby="metodo-t"
      className="home-metodo relative overflow-hidden py-20 text-white sm:py-28"
    >
      <div aria-hidden="true" className="home-metodo-emblema">
        <Emblema />
      </div>
      <div className="relative mx-auto max-w-6xl px-5 sm:px-10">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <h2 id="metodo-t" className="home-h2 max-w-[18ch] font-display font-extrabold">
            Em todo tema, o mesmo caminho em quatro passos
          </h2>
          <Link
            to="/como-funciona"
            className="press inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-white/10 px-5 font-display font-bold ring-1 ring-white/25 hover:bg-white/20 lg:self-end"
          >
            Como o método funciona
          </Link>
        </div>
        <ol className="home-passos mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {METODO.map((m, i) => (
            <li key={m.titulo} className="relative">
              <span
                className="home-passo-num font-display"
                style={vars({ "--c": i === 0 ? "#9cc6ff" : i === 1 ? "#c9b2ff" : m.cor })}
              >
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-2xl font-extrabold">{m.titulo}</h3>
              <p className="mt-2 max-w-[28ch] text-white/80">{m.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* --------------------------------- Prática -------------------------------- */

function Pratica() {
  return (
    <section aria-labelledby="pratica-t" className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-10 lg:grid-cols-2">
        <div>
          <h2
            id="pratica-t"
            className="home-h2 font-display font-extrabold text-[color:var(--tinta)]"
          >
            Aprender fazendo, no ritmo de cada um
          </h2>
          <p className="mt-4 max-w-[46ch] text-lg text-[color:var(--muted-foreground)]">
            Nas missões, o Teddy apresenta uma cena e você decide o que fazer. Cada escolha mostra o
            porquê, e no fim vem o certificado.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/jogos"
              className="btn-shine press inline-flex min-h-12 items-center gap-2 rounded-full bg-[color:var(--amarelo)] px-7 font-display font-extrabold text-[color:var(--tinta)]"
            >
              <Gamepad2 className="h-5 w-5" aria-hidden="true" />
              Começar uma missão
            </Link>
            <Link
              to="/familia-escola"
              className="press inline-flex min-h-12 items-center gap-2 rounded-full px-5 font-display font-bold text-[color:var(--roxo)] hover:bg-[color:var(--roxo)]/10"
            >
              <Users className="h-5 w-5" aria-hidden="true" />
              Para famílias e escolas
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
          <div className="pratica-cena">
            <p className="text-sm font-bold text-[color:var(--roxo)]">Missão · Engasgo</p>
            <p className="mt-2 font-display text-xl font-extrabold leading-snug text-[color:var(--tinta)]">
              No lanche, seu colega leva as mãos ao pescoço e não consegue falar. O que você faz
              primeiro?
            </p>
            <div className="mt-4 grid gap-2">
              <span className="pratica-op">Dar água para ajudar a descer</span>
              <span className="pratica-op is-certo">
                <Check className="h-4 w-4" /> Chamar um adulto e pedir para ligar 192
              </span>
              <span className="pratica-op">Esperar para ver se passa</span>
            </div>
          </div>
          <img src="/teddy/3d/incentivando.webp" alt="" width={720} height={900} className="pratica-teddy" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Emergência ------------------------------- */

function Emergencia() {
  return (
    <section aria-labelledby="emergencia-t" className="pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <div className="home-sos grid items-center gap-8 rounded-[2rem] p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <h2
              id="emergencia-t"
              className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl"
            >
              Numa emergência de verdade, ligue antes de tudo.
            </h2>
            <p className="mt-3 max-w-[48ch] text-white/85">
              Fale com calma, diga o endereço e o que aconteceu. O atendente orienta você até a
              equipe chegar.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="tel:192" className="sos-btn press">
              <Phone className="h-5 w-5" aria-hidden="true" />
              <span className="font-display text-3xl font-extrabold leading-none">192</span>
              <span className="text-sm font-bold opacity-80">SAMU</span>
            </a>
            <a href="tel:193" className="sos-btn press">
              <Phone className="h-5 w-5" aria-hidden="true" />
              <span className="font-display text-3xl font-extrabold leading-none">193</span>
              <span className="text-sm font-bold opacity-80">Bombeiros</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <div className="home-v3 relative bg-[color:var(--background)]">
      <SiteHeader tone="light" />
      <main>
        <Hero />
        <Situacoes />
        <Metodo />
        <Pratica />
        <Emergencia />
      </main>
      <Footer />
    </div>
  );
}
