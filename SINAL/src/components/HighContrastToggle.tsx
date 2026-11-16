import { useSinalStore, toggleContrastMode } from "@/lib/sinalStore";
import { Contrast } from "lucide-react";

export function HighContrastToggle({
  className = "",
  tone = "dark",
}: {
  className?: string;
  /** "dark" = sobre fundo escuro/colorido; "light" = sobre fundo claro. */
  tone?: "dark" | "light";
}) {
  const { contrast } = useSinalStore();
  const label = contrast ? "Desativar modo alto contraste" : "Ativar modo alto contraste";

  return (
    <button
      type="button"
      onClick={() => toggleContrastMode()}
      className={`press inline-flex h-10 w-10 items-center justify-center rounded-full border text-inherit transition-[background-color,transform] hover:scale-105 ${
        tone === "light"
          ? "border-[color:var(--border)] bg-white/70 hover:bg-white"
          : "border-white/20 bg-white/10 hover:bg-white/20"
      } ${contrast ? "ring-2 ring-[color:var(--amarelo)]" : ""} ${className}`}
      aria-pressed={contrast}
      aria-label={label}
      title={label}
    >
      <Contrast
        aria-hidden="true"
        className={`h-[18px] w-[18px] transition-transform duration-500 ${contrast ? "rotate-180" : ""}`}
      />
    </button>
  );
}
