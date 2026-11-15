import { useEffect, useState } from "react";
import type { AvatarConfig } from "@/types/minigame";

export type TeddyShirtColor = "roxo" | "azul" | "vermelho" | "verde" | "amarelo";
export type TeddyCapColor = "roxo" | "azul" | "vermelho" | "verde" | "amarelo";
export type TeddyDecal = "lisa" | "estrela" | "coracao" | "cruz" | "sinal";

export const TEDDY_SHIRT_COLORS = [
  { id: "roxo" as const, nome: "Roxo Oficial SINAL", hex: "#6D3FC3" },
  { id: "azul" as const, nome: "Azul Socorrista", hex: "#2563EB" },
  { id: "vermelho" as const, nome: "Vermelho Emergência", hex: "#DC2626" },
  { id: "verde" as const, nome: "Verde Socorro", hex: "#16A34A" },
  { id: "amarelo" as const, nome: "Amarelo Alerta", hex: "#F59E0B" },
];

export const TEDDY_CAP_COLORS = [
  { id: "roxo" as const, nome: "Boné Roxo SINAL", hex: "#6D3FC3" },
  { id: "azul" as const, nome: "Boné Azul", hex: "#2563EB" },
  { id: "vermelho" as const, nome: "Boné Vermelho", hex: "#DC2626" },
  { id: "verde" as const, nome: "Boné Verde", hex: "#16A34A" },
  { id: "amarelo" as const, nome: "Boné Amarelo", hex: "#F59E0B" },
];

export const TEDDY_DECAL_OPTIONS = [
  { id: "lisa" as const, nome: "Camiseta Lisa (Original)", desc: "Sem estampa" },
  { id: "estrela" as const, nome: "Estrela Guia", desc: "Estrela dourada em pixel art" },
  { id: "coracao" as const, nome: "Coração da Vida", desc: "Coração vermelho de socorrista" },
  { id: "cruz" as const, nome: "Primeiros Socorros", desc: "Cruz médica de emergência" },
  { id: "sinal" as const, nome: "Emblema SINAL", desc: "Símbolo oficial do projeto" },
];

export const DEFAULT_AVATAR: AvatarConfig = {
  tomPele: 1,
  cabeloEstilo: "curto",
  cabeloCor: "castanho",
  calcadoCor: "branco",
  // Padrão canônico oficial SINAL: Urso marrom caramelo com boné roxo, camiseta roxa e mochila amarela + crachá
  boneModelo: "bone_roxo",
  roupaModelo: "camiseta_sinal",
  roupaCor: "roxo",
  mochilaModelo: "mochila_amarela",
  acessorio: "cracha",
  pelagemCor: "caramelo",
  corCamiseta: "roxo",
  estampa: "lisa",
  corBone: "roxo",
};

export const BONES_TEDDY = [
  { id: "bone_roxo", nome: "Boné Roxo SINAL (Oficial)", cor: "#6D3FC3" },
  { id: "bone_azul", nome: "Boné Azul Socorrista", cor: "#2E7DD1" },
  { id: "bone_vermelho", nome: "Boné Vermelho Emergência", cor: "#E53E3E" },
  { id: "faixa", nome: "Faixa de Socorrista", cor: "#FFC044" },
  { id: "nenhum", nome: "Sem Boné", cor: "transparent" },
] as const;

export const MODELOS_ROUPA = [
  { id: "camiseta_sinal", nome: "Camiseta Oficial SINAL" },
  { id: "colete_socorrista", nome: "Colete Socorrista (Alta Visibilidade)" },
  { id: "jaqueta", nome: "Jaqueta Esportiva" },
  { id: "moletom", nome: "Moletom Confortável" },
  { id: "camiseta_branca", nome: "Camiseta Básica Neutra" },
] as const;

export const CORES_ROUPA = [
  { id: "roxo", nome: "Roxo SINAL", hex: "#6D3FC3" },
  { id: "azul", nome: "Azul SINAL", hex: "#2E7DD1" },
  { id: "amarelo", nome: "Amarelo Alerta", hex: "#FFC044" },
  { id: "vermelho", nome: "Vermelho Emergência", hex: "#E53E3E" },
  { id: "branco", nome: "Branco Neutro", hex: "#F3F4F6" },
  { id: "rosa", nome: "Rosa SINAL", hex: "#FF60A7" },
  { id: "aqua", nome: "Aqua SINAL", hex: "#53C6B6" },
] as const;

export const MOCHILAS_TEDDY = [
  { id: "mochila_amarela", nome: "Mochila Amarela SINAL (Oficial)", cor: "#FFC044" },
  { id: "mochila_vermelha", nome: "Mochila Primeiros Socorros 192", cor: "#E53E3E" },
  { id: "mochila_azul", nome: "Mochila de Apoio Azul", cor: "#2E7DD1" },
  { id: "nenhuma", nome: "Sem Mochila", cor: "transparent" },
] as const;

export const ACESSORIOS_TEDDY = [
  { id: "cracha", nome: "Crachá Oficial SINAL (Oficial)" },
  { id: "oculos", nome: "Óculos de Grau" },
  { id: "nenhum", nome: "Nenhum Acessório" },
] as const;

export const PELAGEM_TEDDY = [
  { id: "caramelo", nome: "Caramelo SINAL (Padrão Oficial)", hex: "#C47D3B", tint: 0xffffff },
  { id: "mel", nome: "Dourado Mel", hex: "#E5A958", tint: 0xffe2b2 },
  { id: "cacau", nome: "Chocolate Cacau", hex: "#7B461D", tint: 0xcca085 },
  { id: "creme", nome: "Polar Creme", hex: "#F3E5D0", tint: 0xfff6ec },
] as const;

// Compatibilidade legada
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

export const AVATAR_STORAGE_KEY = "sinal_avatar_custom_v3";

let sessionAvatar: AvatarConfig | null = null;

export function validateAvatar(value: unknown): AvatarConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ...DEFAULT_AVATAR };
  const v = value as Record<string, unknown>;

  // Checagem de integridade dos campos legados fundamentais
  const hasTomPele = typeof v.tomPele === "number" && Number.isInteger(v.tomPele) && TONS_PELE.some((t) => t.id === v.tomPele);
  const hasCabeloEstilo = typeof v.cabeloEstilo === "string" && ESTILOS_CABELO.some((e) => e.id === v.cabeloEstilo);
  const hasCabeloCor = typeof v.cabeloCor === "string" && CORES_CABELO.some((c) => c.id === v.cabeloCor);
  const hasCalcadoCor = typeof v.calcadoCor === "string" && CORES_CALCADO.some((c) => c.id === v.calcadoCor);

  if (!hasTomPele || !hasCabeloEstilo || !hasCabeloCor || !hasCalcadoCor) {
    return { ...DEFAULT_AVATAR };
  }

  // Validação dos novos campos do Teddy
  const boneValido = BONES_TEDDY.some((b) => b.id === v.boneModelo)
    ? (v.boneModelo as AvatarConfig["boneModelo"])
    : v.acessorio === "bone"
      ? "bone_roxo"
      : DEFAULT_AVATAR.boneModelo;

  const roupaModeloValido = MODELOS_ROUPA.some((m) => m.id === v.roupaModelo)
    ? (v.roupaModelo as AvatarConfig["roupaModelo"])
    : DEFAULT_AVATAR.roupaModelo;

  const roupaCorValida = CORES_ROUPA.some((c) => c.id === v.roupaCor)
    ? (v.roupaCor as AvatarConfig["roupaCor"])
    : DEFAULT_AVATAR.roupaCor;

  const mochilaValida = MOCHILAS_TEDDY.some((m) => m.id === v.mochilaModelo)
    ? (v.mochilaModelo as AvatarConfig["mochilaModelo"])
    : DEFAULT_AVATAR.mochilaModelo;

  const acessorioValido = ACESSORIOS_TEDDY.some((a) => a.id === v.acessorio)
    ? (v.acessorio as AvatarConfig["acessorio"])
    : v.acessorio === "bone"
      ? "nenhum"
      : DEFAULT_AVATAR.acessorio;

  const pelagemValida = PELAGEM_TEDDY.some((p) => p.id === v.pelagemCor)
    ? (v.pelagemCor as AvatarConfig["pelagemCor"])
    : DEFAULT_AVATAR.pelagemCor;

  // Personalização 2.0
  const corCamisetaValida: TeddyShirtColor = TEDDY_SHIRT_COLORS.some((c) => c.id === v.corCamiseta)
    ? (v.corCamiseta as TeddyShirtColor)
    : TEDDY_SHIRT_COLORS.some((c) => c.id === v.roupaCor)
    ? (v.roupaCor as TeddyShirtColor)
    : "roxo";

  const corBoneValida: TeddyCapColor = TEDDY_CAP_COLORS.some((c) => c.id === v.corBone)
    ? (v.corBone as TeddyCapColor)
    : v.boneModelo === "bone_azul"
    ? "azul"
    : v.boneModelo === "bone_vermelho"
    ? "vermelho"
    : "roxo";

  const estampaValida: TeddyDecal = TEDDY_DECAL_OPTIONS.some((d) => d.id === v.estampa)
    ? (v.estampa as TeddyDecal)
    : "lisa";

  return {
    tomPele: v.tomPele as number,
    cabeloEstilo: v.cabeloEstilo as AvatarConfig["cabeloEstilo"],
    cabeloCor: v.cabeloCor as AvatarConfig["cabeloCor"],
    calcadoCor: v.calcadoCor as AvatarConfig["calcadoCor"],
    boneModelo: boneValido,
    roupaModelo: roupaModeloValido,
    roupaCor: roupaCorValida,
    mochilaModelo: mochilaValida,
    acessorio: acessorioValido,
    pelagemCor: pelagemValida,
    corCamiseta: corCamisetaValida,
    estampa: estampaValida,
    corBone: corBoneValida,
  };
}

export function getStoredAvatar(): AvatarConfig {
  if (sessionAvatar) return sessionAvatar;
  try {
    const raw = localStorage.getItem(AVATAR_STORAGE_KEY) || localStorage.getItem("sinal_avatar_custom_v2");
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
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    try {
      window.dispatchEvent(new CustomEvent("sinal-avatar-change"));
    } catch {
      // fallback
    }
  }
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
