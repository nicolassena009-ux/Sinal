/**
 * Container reservado para o mini-game de cada tema. A estrutura já existe
 * para que a experiência prática possa ser plugada aqui depois, sem
 * reconstruir a página.
 */
export function PraticaEmBreve({ cor, tema }: { cor: string; tema: string }) {
  return (
    <section
      aria-labelledby="hora-de-praticar"
      className="relative overflow-hidden rounded-3xl border-2 border-dashed p-8 sm:p-12"
      style={{ borderColor: `${cor}66`, backgroundColor: `${cor}14` }}
    >
      <span
        className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-2xl"
        style={{ backgroundColor: cor }}
        aria-hidden="true"
      />
      <p
        className="font-display text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: cor }}
      >
        Em breve
      </p>
      <h2 id="hora-de-praticar" className="mt-2 text-3xl sm:text-4xl">
        Hora de praticar
      </h2>
      <p className="mt-3 max-w-xl text-[color:var(--muted-foreground)]">
        Em breve, você poderá testar o que aprendeu em uma experiência interativa sobre{" "}
        {tema.toLowerCase()}.
      </p>
      <button
        type="button"
        disabled
        aria-disabled="true"
        className="mt-6 inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-full px-6 py-3 font-display font-semibold text-white opacity-70"
        style={{ backgroundColor: cor }}
      >
        Praticar
        <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">em breve</span>
      </button>
    </section>
  );
}
