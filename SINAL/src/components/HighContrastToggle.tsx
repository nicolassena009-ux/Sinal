import { useSinalStore, toggleContrastMode } from "@/lib/sinalStore";
import { Moon, Sun } from "lucide-react";

export function HighContrastToggle({ className = "" }: { className?: string }) {
  const { contrast } = useSinalStore();

  return (
    <button
      type="button"
      onClick={() => toggleContrastMode()}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 font-display text-sm font-bold text-inherit transition-all hover:bg-white/20 hover:scale-105 ${className}`}
      aria-pressed={contrast}
      aria-label={contrast ? "Desativar modo alto contraste" : "Ativar modo alto contraste"}
      title={contrast ? "Desativar modo alto contraste" : "Ativar modo alto contraste"}
    >
      <span className="sr-only">Alto Contraste</span>
      <span aria-hidden="true" className="text-base select-none">
        ◐
      </span>
    </button>
  );
}
