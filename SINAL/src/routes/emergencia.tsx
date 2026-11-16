import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { AudioNarration } from "@/components/AudioNarration";
import { SiteHeader } from "@/components/SiteHeader";
import { vars } from "@/lib/motion";
import { Phone, ArrowUpRight } from "lucide-react";

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

function Emergencia() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[color:var(--tinta)]/92 backdrop-blur-xs text-[color:var(--lilas)]">
      <SiteHeader />
      <span aria-hidden="true" className="glow-orb -left-24 top-20 h-80 w-80 bg-[color:var(--rosa)] opacity-30" />
      <span aria-hidden="true" className="glow-orb -right-20 top-[28rem] h-72 w-72 bg-[color:var(--amarelo)] opacity-20 [animation-delay:-8s]" />
      <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 sm:px-10">
        <main className="hero-stagger">
          <h1 className="mt-8 text-5xl sm:text-6xl" style={vars({ "--i": 0 })}>Precisa de ajuda agora?</h1>
          <p className="mt-4 max-w-xl text-lg opacity-85" style={vars({ "--i": 1 })}>
            Ligue. Fale com calma, informe o endereço e descreva o que está acontecendo. O
            atendente vai orientar você passo a passo até a equipe chegar.
          </p>

          <div className="mt-6" style={vars({ "--i": 2 })}>
            <AudioNarration
              title="Ouvir orientações de emergência"
              text="Precisa de ajuda agora? No Brasil, ligue 192 para o SAMU em emergências médicas, ou 193 para o Corpo de Bombeiros em resgates, traumas e incêndios. Ao falar com o atendente, informe o endereço completo com um ponto de referência, o que aconteceu, quantas pessoas precisam de socorro e se a pessoa está consciente e respirando. Fique calmo e não desligue antes do atendente autorizar."
            />
          </div>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2" style={vars({ "--i": 3 })}>
            {CONTATOS.map((c) => (
              <li key={c.numero}>
                <a
                  href={`tel:${c.numero}`}
                  className="spotlight spotlight-light tilt group press relative block overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-8 transition-colors hover:border-white/30 hover:bg-white/10"
                >
                  <span
                    className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-25 blur-xl"
                    style={{ backgroundColor: c.cor }}
                    aria-hidden="true"
                  />
                  <span className="flex items-start justify-between gap-4">
                    <span
                      className="block font-display text-7xl font-extrabold leading-none"
                      style={{ color: c.cor }}
                    >
                      {c.numero}
                    </span>
                    <span
                      aria-hidden="true"
                      className="call-pulse mt-2 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                      style={{ color: c.cor }}
                    >
                      <Phone className="h-6 w-6" />
                    </span>
                  </span>
                  <span className="mt-3 block font-display text-2xl font-semibold">
                    {c.nome}
                  </span>
                  <span className="mt-2 block text-sm opacity-80">{c.descricao}</span>
                  <span
                    className="mt-6 inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-sm font-bold text-[color:var(--tinta)] transition-[gap] group-hover:gap-2.5"
                    style={{ backgroundColor: c.cor }}
                  >
                    Ligar agora <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <section className="reveal-on-scroll mt-12 rounded-3xl border border-white/15 bg-white/[0.03] p-7">
            <h2 className="text-2xl">O que informar</h2>
            <ol className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              {INFORMAR.map((item, i) => (
                <li
                  key={item}
                  className="reveal-on-scroll flex items-start gap-3 rounded-2xl bg-white/5 p-4"
                  style={vars({ "--reveal-delay": `${i * 60}ms` })}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--amarelo)] font-display text-sm font-extrabold text-[color:var(--tinta)]">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 opacity-90">{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <p className="reveal-on-scroll mt-10 rounded-2xl bg-white/5 p-5 text-sm opacity-75">
            O Sinal é uma plataforma educativa. Ele ajuda você a reconhecer e entender
            situações de emergência, mas não substitui o atendimento de profissionais de
            saúde.
          </p>
        </main>
      </div>

      <Footer />
    </div>
  );
}
