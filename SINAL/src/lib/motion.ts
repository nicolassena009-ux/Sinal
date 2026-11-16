import type { CSSProperties } from "react";

/** Tipagem de variáveis CSS inline (ex.: atrasos de animação escalonados). */
export const vars = (v: Record<`--${string}`, string | number>) => v as CSSProperties;
