import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { AudioNarration } from "@/components/AudioNarration";
import { HighContrastToggle } from "@/components/HighContrastToggle";

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

function Emergencia() {
  return (
    <div className="min-h-screen bg-[color:var(--tinta)]/92 backdrop-blur-xs text-[color:var(--lilas)]">
      <div className="mx-auto max-w-5xl px-6 pb-20 pt-8 sm:px-10">
        <nav className="flex flex-wrap items-center justify-between gap-3 font-display text-sm font-semibold">
          <Link to="/" className="transition-opacity hover:opacity-70">
            ← Sinal
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/temas"
              className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10"
            >
              Temas
            </Link>
            <Link
              to="/como-funciona"
              className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10"
            >
              Como funciona
            </Link>
            <Link
              to="/jogos"
              className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10"
            >
              Jogos & Missões
            </Link>
            <HighContrastToggle className="text-white" />
          </div>
        </nav>

        <main>
          <h1 className="mt-14 text-5xl sm:text-6xl">Precisa de ajuda agora?</h1>
          <p className="mt-4 max-w-xl text-lg opacity-85">
            Ligue. Fale com calma, informe o endereço e descreva o que está acontecendo. O
            atendente vai orientar você passo a passo até a equipe chegar.
          </p>

          <div className="mt-6">
            <AudioNarration
              title="Ouvir orientações de emergência"
              text="Precisa de ajuda agora? No Brasil, ligue 192 para o SAMU em emergências médicas, ou 193 para o Corpo de Bombeiros em resgates, traumas e incêndios. Ao falar com o atendente, informe o endereço completo com um ponto de referência, o que aconteceu, quantas pessoas precisam de socorro e se a pessoa está consciente e respirando. Fique calmo e não desligue antes do atendente autorizar."
            />
          </div>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {CONTATOS.map((c) => (
              <li key={c.numero}>
                <a
                  href={`tel:${c.numero}`}
                  className="group relative block overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-8 transition-colors hover:bg-white/10"
                >
                  <span
                    className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-25 blur-xl"
                    style={{ backgroundColor: c.cor }}
                    aria-hidden="true"
                  />
                  <span
                    className="block font-display text-7xl font-extrabold leading-none"
                    style={{ color: c.cor }}
                  >
                    {c.numero}
                  </span>
                  <span className="mt-3 block font-display text-2xl font-semibold">
                    {c.nome}
                  </span>
                  <span className="mt-2 block text-sm opacity-80">{c.descricao}</span>
                  <span className="mt-4 inline-block font-display text-sm font-semibold underline-offset-4 group-hover:underline">
                    Ligar agora
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <section className="mt-12 rounded-3xl border border-white/15 p-7">
            <h2 className="text-2xl">O que informar</h2>
            <ul className="mt-4 grid gap-3 text-sm opacity-85 sm:grid-cols-2">
              <li>Endereço completo e um ponto de referência.</li>
              <li>O que aconteceu e há quanto tempo.</li>
              <li>Quantas pessoas precisam de ajuda.</li>
              <li>Se a pessoa está consciente e respirando.</li>
              <li>Seu nome e um telefone de contato.</li>
              <li>Não desligue antes de o atendente autorizar.</li>
            </ul>
          </section>

          <p className="mt-10 rounded-2xl bg-white/5 p-5 text-sm opacity-75">
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
