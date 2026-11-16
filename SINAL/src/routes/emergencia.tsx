import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Footer } from "@/components/Footer";
import { AudioNarration } from "@/components/AudioNarration";
import { SiteHeader } from "@/components/SiteHeader";
import { CinemaBackdrop, Eyebrow, NarracaoEscura } from "@/components/cinema/Cinema";
import { vars } from "@/lib/motion";
import { Phone, ArrowUpRight, ShieldAlert, PhoneCall } from "lucide-react";

export const Route = createFileRoute("/emergencia")({
  head: () => {
    const titulo = "Emergência — SAMU 192 e Bombeiros 193 | Sinal";
    const desc =
      "Acesso rápido aos contatos de emergência do Brasil: SAMU 192 e Corpo de Bombeiros 193. Saiba o que informar ao pedir ajuda.";
    return {
      meta: [
        { title: titulo },
        { name: "description", content: desc },
        { property: "og:title", content: titulo },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Emergencia,
});

const CONTATOS = [
  {
    numero: "192",
    nome: "SAMU",
    descricao: "Atendimento móvel de urgência para emergências de saúde.",
    cor: "var(--rosa)",
  },
  {
    numero: "193",
    nome: "Corpo de Bombeiros",
    descricao: "Resgate, incêndios, acidentes e situações de risco.",
    cor: "var(--amarelo)",
  },
];

const INFORMAR = [
  "Endereço completo e um ponto de referência.",
  "O que aconteceu e há quanto tempo.",
  "Quantas pessoas precisam de ajuda.",
  "Se a pessoa está consciente e respirando.",
  "Seu nome e um telefone de contato.",
  "Não desligue antes de o atendente autorizar.",
];

/** Cronômetro da "chamada" ilustrativa: só corre enquanto o cartão está na tela. */
function useCronometro() {
  const ref = useRef<HTMLDivElement>(null);
  const [seg, setSeg] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let id = 0;
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(id);
      if (e.isIntersecting) id = window.setInterval(() => setSeg((s) => s + 1), 1000);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, []);
  const mm = String(Math.floor(seg / 60)).padStart(2, "0");
  const ss = String(seg % 60).padStart(2, "0");
  return { ref, tempo: `${mm}:${ss}` };
}

/** Linha do tempo de "O que informar": a linha se preenche conforme a rolagem. */
function useLinhaProgresso() {
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [ativo, setAtivo] = useState(-1);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = listRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const alvo = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (alvo - r.top) / r.height));
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
      const itens = Array.from(el.children) as HTMLElement[];
      let a = -1;
      itens.forEach((li, i) => {
        if (li.getBoundingClientRect().top < alvo) a = i;
      });
      setAtivo(a);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return { listRef, fillRef, ativo };
}

function Emergencia() {
  const { ref: chamadaRef, tempo } = useCronometro();
  const { listRef, fillRef, ativo } = useLinhaProgresso();

  return (
    <div className="cinema-page relative bg-[#0d0922] text-[color:var(--lilas)]">
      <SiteHeader progress />

      {/* HERO: ligar vem primeiro */}
      <header className="relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-32">
        <CinemaBackdrop accent="var(--rosa)" />
        <div
          aria-hidden="true"
          className="emerg-radar pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2"
        >
          <span />
          <span />
          <span />
        </div>
        <div className="hero-stagger relative mx-auto max-w-6xl px-5 sm:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <div style={vars({ "--i": 0 })} className="flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--rosa)]/40 bg-[color:var(--rosa)]/10 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.25em] text-[#ff9cc9]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--rosa)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--rosa)]" />
                </span>
                Emergência · Brasil
              </span>
            </div>
            <h1
              style={vars({ "--i": 1 })}
              className="cinema-title mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
            >
              Precisa de ajuda agora?
            </h1>
            <p
              style={vars({ "--i": 2 })}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--lilas)]/80 sm:text-xl"
            >
              Ligue. Fale com calma, informe o endereço e descreva o que está acontecendo. O
              atendente vai orientar você passo a passo até a equipe chegar.
            </p>
          </div>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2" style={vars({ "--i": 3 })}>
            {CONTATOS.map((c) => (
              <li key={c.numero}>
                <a
                  href={`tel:${c.numero}`}
                  aria-label={`Ligar para ${c.nome}, ${c.numero}`}
                  className="spotlight spotlight-light group press relative block overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.04] p-7 backdrop-blur-md transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-white/35 hover:bg-white/[0.08] sm:p-9"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-50"
                    style={{ backgroundColor: c.cor }}
                  />
                  <span className="relative flex items-start justify-between gap-4">
                    <span>
                      <span className="block font-display text-xs font-bold uppercase tracking-[0.3em] opacity-70">
                        {c.nome}
                      </span>
                      <span
                        className="mt-2 block font-display text-[clamp(88px,14vw,168px)] font-extrabold leading-[0.8] tracking-tight"
                        style={{ color: c.cor }}
                      >
                        {c.numero}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="call-pulse inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                      style={{ color: c.cor }}
                    >
                      <Phone className="h-7 w-7" />
                    </span>
                  </span>
                  <span className="relative mt-5 block max-w-sm text-[color:var(--lilas)]/80">
                    {c.descricao}
                  </span>
                  <span
                    className="relative mt-7 inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-display font-extrabold text-[color:var(--tinta)] transition-[gap] group-hover:gap-3"
                    style={{ backgroundColor: c.cor }}
                  >
                    Ligar agora <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <NarracaoEscura style={vars({ "--i": 4 })} className="mt-8 flex justify-center">
            <AudioNarration
              title="Ouvir orientações de emergência"
              text="Precisa de ajuda agora? No Brasil, ligue 192 para o SAMU em emergências médicas, ou 193 para o Corpo de Bombeiros em resgates, traumas e incêndios. Ao falar com o atendente, informe o endereço completo com um ponto de referência, o que aconteceu, quantas pessoas precisam de socorro e se a pessoa está consciente e respirando. Fique calmo e não desligue antes do atendente autorizar."
            />
          </NarracaoEscura>
        </div>
      </header>

      {/* O QUE INFORMAR */}
      <section
        aria-labelledby="informar-titulo"
        className="relative border-t border-white/10 py-24 sm:py-32"
      >
        <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>Durante a ligação</Eyebrow>
            <h2
              id="informar-titulo"
              className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-6xl"
            >
              O que informar
            </h2>
            <p className="mt-4 max-w-md text-lg text-[color:var(--lilas)]/75">
              Respostas claras fazem a ajuda chegar mais rápido. Siga esta ordem.
            </p>

            {/* Chamada ilustrativa */}
            <div
              ref={chamadaRef}
              aria-hidden="true"
              className="relative mt-10 hidden max-w-sm overflow-hidden rounded-[2rem] border border-white/15 bg-[#150e33] p-6 shadow-[0_30px_80px_-30px_rgba(255,96,167,0.5)] sm:block"
            >
              <div className="flex items-center gap-4">
                <span className="call-pulse flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--rosa)] text-white">
                  <PhoneCall className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-2xl font-extrabold">192 · SAMU</p>
                  <p className="font-mono text-sm text-[color:var(--aqua)]">Em ligação · {tempo}</p>
                </div>
              </div>
              <div className="mt-6 flex h-10 items-end gap-1">
                {Array.from({ length: 28 }, (_, i) => (
                  <span
                    key={i}
                    className="emerg-onda w-1.5 flex-1 rounded-full bg-[color:var(--rosa)]/70"
                    style={vars({ "--d": `${(i * 97) % 900}ms` })}
                  />
                ))}
              </div>
              <p className="mt-5 text-sm text-[color:var(--lilas)]/70">
                {ativo >= 0
                  ? INFORMAR[Math.min(ativo, INFORMAR.length - 1)]
                  : "Respire fundo e fale com calma."}
              </p>
            </div>
          </div>

          <ol ref={listRef} className="relative space-y-4 pl-14 sm:pl-16">
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-[19px] top-6 w-0.5 bg-white/10 sm:left-[23px]"
            />
            <span
              ref={fillRef}
              aria-hidden="true"
              className="absolute bottom-6 left-[19px] top-6 w-0.5 origin-top bg-[linear-gradient(180deg,var(--amarelo),var(--rosa))] sm:left-[23px]"
              style={{ transform: "scaleY(0)" }}
            />
            {INFORMAR.map((item, i) => {
              const on = i <= ativo;
              return (
                <li key={item} className="relative">
                  <span
                    className="absolute -left-14 top-3 flex h-10 w-10 items-center justify-center rounded-full border font-display font-extrabold transition-all duration-500 sm:-left-16 sm:h-12 sm:w-12"
                    style={{
                      borderColor: on ? "var(--amarelo)" : "rgba(255,255,255,0.15)",
                      backgroundColor: on ? "var(--amarelo)" : "#0d0922",
                      color: on ? "var(--tinta)" : "rgba(242,241,255,0.6)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div
                    className="rounded-2xl border p-5 text-lg transition-all duration-500 sm:p-6 sm:text-xl"
                    style={{
                      borderColor: on ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
                      backgroundColor: on ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                      opacity: on ? 1 : 0.55,
                    }}
                  >
                    {item}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Aviso */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-10">
          <div className="reveal-on-scroll flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:p-8">
            <ShieldAlert
              className="h-8 w-8 shrink-0 text-[color:var(--amarelo)]"
              aria-hidden="true"
            />
            <p className="text-[color:var(--lilas)]/75">
              O Sinal é uma plataforma educativa. Ele ajuda você a reconhecer e entender situações
              de emergência, mas não substitui o atendimento de profissionais de saúde.
            </p>
            <Link
              to="/como-funciona"
              className="press shrink-0 rounded-full border border-white/20 px-5 py-2.5 font-display text-sm font-bold hover:bg-white/10 sm:ml-auto"
            >
              Conhecer o método
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
