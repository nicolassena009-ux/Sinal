import { useEffect, useRef } from "react";
import { Award, Printer, X, Sparkles } from "lucide-react";

interface CertificadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: "kids" | "teens";
  stars: number;
}

export function CertificadoModal({
  isOpen,
  onClose,
  track,
  stars,
}: CertificadoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trackTitle = track === "kids" ? "Sinal Kids (4–12 anos)" : "Sinal Teens (13–18 anos)";
  const trackSubtitle =
    track === "kids"
      ? "Parabéns por aprender a reconhecer situações de risco e chamar ajuda com segurança!"
      : "Parabéns por praticar decisões responsáveis de primeiros socorros e proteção coletiva!";

  const today = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 print:p-0 print:bg-white print:static"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-card p-8 text-center text-foreground shadow-2xl animate-in fade-in zoom-in-95 duration-200 print:border-4 print:border-[color:var(--roxo)] print:shadow-none print:max-w-none print:w-full"
      >
        {/* Botão de Fechar na tela (oculto na impressão) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted print:hidden"
          aria-label="Fechar certificado"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Emblema */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--amarelo)] text-[color:var(--tinta)] shadow-lg shadow-[color:var(--amarelo)]/30">
          <Award className="h-10 w-10" />
        </div>

        <p className="mt-4 font-display text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--roxo)]">
          Certificado Oficial de Conclusão
        </p>

        <h2 id="cert-title" className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">
          {trackTitle}
        </h2>

        <div className="my-6 rounded-2xl border-2 border-dashed border-[color:var(--border)] bg-muted/30 p-6">
          <p className="font-display text-base font-semibold text-foreground">
            {trackSubtitle}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="flex items-center gap-1 font-display text-2xl font-black text-[color:var(--amarelo)]">
              ⭐ {stars}
            </span>
            <span className="text-xs text-muted-foreground font-semibold">
              estrelas conquistadas
            </span>
          </div>
          <p className="mt-4 font-display text-xs font-semibold text-[color:var(--roxo)]">
            "Reconhecer também é proteger."
          </p>
        </div>

        <div className="flex items-center justify-between text-left text-xs text-muted-foreground border-t border-border pt-4">
          <div>
            <span className="block font-bold text-foreground">Plataforma Sinal</span>
            <span className="block">Educação em Primeiros Socorros</span>
          </div>
          <div className="text-right">
            <span className="block font-semibold">Emitido em</span>
            <span className="block">{today}</span>
          </div>
        </div>

        {/* Ações na tela */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[color:var(--roxo)] px-6 py-2.5 font-display text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
          >
            <Printer className="h-4 w-4" />
            Imprimir certificado
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center rounded-full border border-border px-5 py-2.5 font-display text-sm font-semibold hover:bg-muted"
          >
            Continuar explorando
          </button>
        </div>
      </div>
    </div>
  );
}
