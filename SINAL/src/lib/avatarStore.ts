import { useEffect, useState } from "react";
import type { AvatarConfig } from "@/types/minigame";

export const DEFAULT_AVATAR: AvatarConfig = {
  tomPele: 1,
  cabeloEstilo: "curto",
  cabeloCor: "castanho",
  roupaModelo: "camiseta_sinal",
  roupaCor: "roxo",
  calcadoCor: "branco",
  acessorio: "cracha",
};

export const TONS_PELE = [
  { id: 0, nome: "Pele Clara", cor: "#F5D0B0", sombra: "#D8A783" },
  { id: 1, nome: "Pele Média Clara", cor: "#DEAB88", sombra: "#BF8560" },
  { id: 2, nome: "Pele Parda / Morena", cor: "#BA7F59", sombra: "#965E39" },
  { id: 3, nome: "Pele Negra", cor: "#8D5534", sombra: "#6B3B20" },
  { id: 4, nome: "Pele Retinta", cor: "#56311D", sombra: "#3E2111" },
];

export const ESTILOS_CABELO = [
  { id: "curto", nome: "Curto Moderno" },
  { id: "cacheado", nome: "Cacheado / Ondulado" },
  { id: "black_power", nome: "Black Power / Crespo" },
  { id: "trancas", nome: "Tranças" },
  { id: "liso", nome: "Liso com Franja" },
] as const;

export const CORES_CABELO = [
  { id: "castanho", nome: "Castanho", hex: "#4E3120" },
  { id: "preto", nome: "Preto", hex: "#1C1917" },
  { id: "loiro", nome: "Loiro", hex: "#C89C32" },
  { id: "ruivo", nome: "Ruivo", hex: "#A53C1B" },
  { id: "cinza", nome: "Grisalho", hex: "#8A94A0" },
] as const;

export const MODELOS_ROUPA = [
  { id: "camiseta_sinal", nome: "Camiseta Sinal" },
  { id: "colete_socorrista", nome: "Colete Socorrista" },
  { id: "moletom", nome: "Moletom Confortável" },
  { id: "jaqueta", nome: "Jaqueta Esportiva" },
] as const;

export const CORES_ROUPA = [
  { id: "roxo", nome: "Roxo Sinal", hex: "#6D3FC3" },
  { id: "azul", nome: "Azul Sinal", hex: "#2E7DD1" },
  { id: "rosa", nome: "Rosa Sinal", hex: "#FF60A7" },
  { id: "amarelo", nome: "Amarelo Sinal", hex: "#FFC044" },
  { id: "aqua", nome: "Aqua Sinal", hex: "#53C6B6" },
  { id: "branco", nome: "Branco Neutro", hex: "#F3F4F6" },
] as const;

export const CORES_CALCADO = [
  { id: "branco", nome: "Tênis Branco", hex: "#F3F4F6" },
  { id: "preto", nome: "Tênis Preto", hex: "#18181B" },
  { id: "azul", nome: "Tênis Azul", hex: "#1E40AF" },
  { id: "vermelho", nome: "Tênis Vermelho", hex: "#DC2626" },
] as const;

export const ACESSORIOS = [
  { id: "nenhum", nome: "Nenhum" },
  { id: "cracha", nome: "Crachá Socorrista Sinal" },
  { id: "oculos", nome: "Óculos de Grau" },
  { id: "bone", nome: "Boné Estiloso" },
] as const;

export const AVATAR_STORAGE_KEY = "sinal_avatar_custom_v2";
let sessionAvatar: AvatarConfig | null = null;
export function validateAvatar(value: unknown): AvatarConfig {
  if (!value || typeof value !== "object") return { ...DEFAULT_AVATAR };
  const v = value as Record<string, unknown>;
  const valid =
    Number.isInteger(v.tomPele) &&
    TONS_PELE.some((t) => t.id === v.tomPele) &&
    ESTILOS_CABELO.some((t) => t.id === v.cabeloEstilo) &&
    CORES_CABELO.some((t) => t.id === v.cabeloCor) &&
    MODELOS_ROUPA.some((t) => t.id === v.roupaModelo) &&
    CORES_ROUPA.some((t) => t.id === v.roupaCor) &&
    CORES_CALCADO.some((t) => t.id === v.calcadoCor) &&
    ACESSORIOS.some((t) => t.id === v.acessorio);
  if (!valid) return { ...DEFAULT_AVATAR };
  return {
    tomPele: v.tomPele,
    cabeloEstilo: v.cabeloEstilo,
    cabeloCor: v.cabeloCor,
    roupaModelo: v.roupaModelo,
    roupaCor: v.roupaCor,
    calcadoCor: v.calcadoCor,
    acessorio: v.acessorio,
  } as AvatarConfig;
}
export function getStoredAvatar(): AvatarConfig {
  if (sessionAvatar) return sessionAvatar;
  try {
    const raw = localStorage.getItem(AVATAR_STORAGE_KEY);
    return raw ? validateAvatar(JSON.parse(raw)) : { ...DEFAULT_AVATAR };
  } catch {
    return { ...DEFAULT_AVATAR };
  }
}
export function saveStoredAvatar(avatar: AvatarConfig): boolean {
  sessionAvatar = validateAvatar(avatar);
  let saved = true;
  try {
    localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(sessionAvatar));
  } catch {
    saved = false;
  }
  window.dispatchEvent(new CustomEvent("sinal-avatar-change"));
  return saved;
}
export function usePlayerAvatar(): [AvatarConfig, (updated: AvatarConfig) => boolean] {
  const [avatar, setAvatar] = useState(getStoredAvatar);
  useEffect(() => {
    const change = () => setAvatar(getStoredAvatar());
    const storage = () => {
      sessionAvatar = null;
      change();
    };
    window.addEventListener("sinal-avatar-change", change);
    window.addEventListener("storage", storage);
    return () => {
      window.removeEventListener("sinal-avatar-change", change);
      window.removeEventListener("storage", storage);
    };
  }, []);
  return [avatar, saveStoredAvatar];
}
