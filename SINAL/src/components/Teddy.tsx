import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Teddy, mascote oficial do SINAL                                    */
/*  Renderização PBR refinada, iluminação de estúdio da marca Sinal,   */
/*  animações orgânicas com amortecimento de mola e renderização      */
/*  otimizada com corte fora de tela.                                 */
/* ------------------------------------------------------------------ */

export type TeddyEstado =
  | "idle"
  | "feliz"
  | "acenando"
  | "comemorando"
  | "preocupado"
  | "pensando"
  | "incentivando"
  | "explicando"
  | "triste"
  | "surpreso";

export const TEDDY_ESTADOS: TeddyEstado[] = [
  "idle",
  "feliz",
  "acenando",
  "comemorando",
  "preocupado",
  "pensando",
  "incentivando",
  "explicando",
  "triste",
  "surpreso",
];

export type TeddyEnquadramento = "corpo" | "busto";

export interface TeddyProps {
  estado?: TeddyEstado | undefined;
  /** Largura em px. A altura acompanha (proporção 4:5 no corpo, 1:1 no busto). */
  tamanho?: number | undefined;
  /** Cabeça acompanha o cursor suavemente. */
  seguirCursor?: boolean | undefined;
  enquadramento?: TeddyEnquadramento | undefined;
  sombra?: boolean | undefined;
  /** Caminho do modelo. Padrão: /teddy.glb (pasta public). */
  modeloUrl?: string | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  onClick?: (() => void) | undefined;
}

/* ----------------------------- Poses ------------------------------ */

const POSE_KEYS = [
  "chestX",
  "chestZ",
  "headX",
  "headZ",
  "rootY",
  "scale",
  "Dsx",
  "Dsy",
  "Dsz",
  "Dex",
  "Dez",
  "Esx",
  "Esy",
  "Esz",
  "Eex",
  "Eez",
] as const;
type PoseKey = (typeof POSE_KEYS)[number];
type Pose = Record<PoseKey, number>;

/** Pose base descansada: braços relaxados levemente flexionados, postura amigável de pelúcia */
const BASE: Pose = {
  chestX: -0.02,
  chestZ: 0,
  headX: -0.02,
  headZ: 0.02,
  rootY: 0,
  scale: 1,
  Dsx: -0.14,
  Dsy: 0.06,
  Dsz: -0.28,
  Dex: -0.32,
  Dez: -0.12,
  Esx: -0.14,
  Esy: 0.06,
  Esz: -0.28,
  Eex: -0.32,
  Eez: -0.12,
};

const P = (o: Partial<Pose>): Pose => ({ ...BASE, ...o });

/** Poses expressivas e naturais do Teddy */
const POSES: Record<TeddyEstado, Pose> = {
  idle: P({}),
  feliz: P({
    chestX: -0.04,
    headX: -0.06,
    headZ: -0.04,
    Dsx: -0.24,
    Dsy: 0.08,
    Dsz: -0.42,
    Dex: -0.46,
    Dez: -0.2,
    Esx: -0.24,
    Esy: 0.08,
    Esz: -0.42,
    Eex: -0.46,
    Eez: -0.2,
  }),
  acenando: P({
    headZ: -0.1,
    headX: -0.04,
    chestZ: 0.03,
    Dsx: -0.12,
    Dsy: -0.12,
    Dsz: -1.68,
    Dex: -0.85,
    Dez: -0.65,
    Esx: -0.12,
    Esy: 0.05,
    Esz: -0.25,
    Eex: -0.28,
    Eez: -0.1,
  }),
  comemorando: P({
    chestX: -0.06,
    headX: -0.18,
    headZ: 0,
    Dsx: -0.22,
    Dsy: -0.08,
    Dsz: -2.05,
    Dex: -0.5,
    Dez: -0.38,
    Esx: -0.22,
    Esy: -0.08,
    Esz: -2.05,
    Eex: -0.5,
    Eez: -0.38,
  }),
  preocupado: P({
    chestX: 0.06,
    headX: 0.12,
    headZ: 0.08,
    Dsx: -0.82,
    Dsy: 0.22,
    Dsz: 0.44,
    Dex: -1.35,
    Dez: 0.06,
    Esx: -0.82,
    Esy: 0.22,
    Esz: 0.44,
    Eex: -1.35,
    Eez: 0.06,
  }),
  pensando: P({
    chestX: 0.02,
    headX: 0.07,
    headZ: 0.16,
    chestZ: -0.02,
    Dsx: -0.92,
    Dsy: 0.24,
    Dsz: 0.62,
    Dex: -1.75,
    Dez: 0.06,
    Esx: -0.28,
    Esy: 0.1,
    Esz: 0.18,
    Eex: -0.65,
    Eez: -0.04,
  }),
  incentivando: P({
    chestX: -0.04,
    headX: -0.05,
    headZ: -0.06,
    Dsx: -0.62,
    Dsy: -0.08,
    Dsz: -0.52,
    Dex: -1.42,
    Dez: -0.16,
    Esx: -0.14,
    Esy: 0.05,
    Esz: -0.26,
    Eex: -0.3,
    Eez: -0.12,
  }),
  explicando: P({
    headZ: 0.06,
    chestX: -0.02,
    Dsx: -0.58,
    Dsy: 0.14,
    Dsz: -0.82,
    Dex: -0.62,
    Dez: -0.18,
    Esx: -0.36,
    Esy: 0.1,
    Esz: -0.42,
    Eex: -0.52,
    Eez: -0.14,
  }),
  triste: P({
    chestX: 0.09,
    headX: 0.28,
    rootY: -0.016,
    Dsx: 0.02,
    Dsz: 0.08,
    Dex: -0.14,
    Esx: 0.02,
    Esz: 0.08,
    Eex: -0.14,
  }),
  surpreso: P({
    chestX: -0.08,
    headX: -0.16,
    scale: 1.04,
    Dsx: -0.32,
    Dsz: -0.72,
    Dex: -0.48,
    Esx: -0.32,
    Esz: -0.72,
    Eex: -0.48,
  }),
};

/* -------------------------- Esqueleto ----------------------------- */

const JOINTS = {
  root: new THREE.Vector3(0, -0.2, 0),
  chest: new THREE.Vector3(0, -0.15, 0),
  head: new THREE.Vector3(0, 0.12, 0.02),
  shD: new THREE.Vector3(-0.17, 0.04, 0),
  elD: new THREE.Vector3(-0.24, -0.08, 0.02),
  shE: new THREE.Vector3(0.17, 0.04, 0),
  elE: new THREE.Vector3(0.24, -0.08, 0.02),
};

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const ss = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Normais suaves (solda por posição espacial sem costuras visíveis de UV) */
function smoothNormals(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const idx = geo.index ? geo.index.array : null;
  const triCount = idx ? idx.length / 3 : pos.count / 3;
  const acc = new Map<string, THREE.Vector3>();
  const key = (i: number) =>
    `${Math.round(pos.getX(i) * 1e4)}_${Math.round(pos.getY(i) * 1e4)}_${Math.round(pos.getZ(i) * 1e4)}`;
  const a = new THREE.Vector3(),
    b = new THREE.Vector3(),
    c = new THREE.Vector3();
  const e1 = new THREE.Vector3(),
    e2 = new THREE.Vector3();

  for (let t = 0; t < triCount; t++) {
    const i0 = idx ? idx[t * 3] : t * 3;
    const i1 = idx ? idx[t * 3 + 1] : t * 3 + 1;
    const i2 = idx ? idx[t * 3 + 2] : t * 3 + 2;
    a.fromBufferAttribute(pos, i0);
    b.fromBufferAttribute(pos, i1);
    c.fromBufferAttribute(pos, i2);
    e1.subVectors(b, a);
    e2.subVectors(c, a);
    const n = new THREE.Vector3().crossVectors(e1, e2);
    for (const i of [i0, i1, i2]) {
      const k = key(i);
      const cur = acc.get(k);
      if (cur) cur.add(n);
      else acc.set(k, n.clone());
    }
  }

  const normals = new Float32Array(pos.count * 3);
  const tmp = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    const v = acc.get(key(i));
    if (v && v.lengthSq() > 1e-6) tmp.copy(v).normalize();
    else tmp.set(0, 1, 0);
    normals.set([tmp.x, tmp.y, tmp.z], i * 3);
  }
  geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
}

function distSeg(p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, tmp: THREE.Vector3) {
  tmp.subVectors(b, a);
  const l2 = tmp.lengthSq();
  const t = l2 > 0 ? clamp01(((p.x - a.x) * tmp.x + (p.y - a.y) * tmp.y + (p.z - a.z) * tmp.z) / l2) : 0;
  const dx = p.x - (a.x + tmp.x * t);
  const dy = p.y - (a.y + tmp.y * t);
  const dz = p.z - (a.z + tmp.z * t);
  return { d: Math.sqrt(dx * dx + dy * dy + dz * dz), t };
}

const ARM_AXIS = {
  D: [
    new THREE.Vector3(-0.2, 0.045, 0.012),
    new THREE.Vector3(-0.25, -0.08, 0.012),
    new THREE.Vector3(-0.268, -0.225, 0.012),
  ],
  E: [
    new THREE.Vector3(0.2, 0.045, 0.012),
    new THREE.Vector3(0.25, -0.08, 0.012),
    new THREE.Vector3(0.268, -0.225, 0.012),
  ],
};

/**
 * Pesos de pele gerados proceduralmente (o .glb vem sem esqueleto).
 *
 * 1. Peso "cru" do braço pela distância ao eixo do braço.
 * 2. Suavização laplaciana desse peso sobre a malha (vértices soldados por posição):
 *    sem ela, vértices vizinhos na axila recebiam pesos muito diferentes e, com o braço
 *    levantado, os triângulos esticavam em "espinhos" na manga.
 * 3. Guardas rígidas reaplicadas depois: cabeça, laterais do tronco e mochila não seguem o braço.
 */
function skinGeometry(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const n = pos.count;
  const skinIndex = new Uint16Array(n * 4);
  const skinWeight = new Float32Array(n * 4);
  const w = new Float32Array(7);
  const p = new THREE.Vector3(),
    tmp = new THREE.Vector3();
  const R0 = 0.07,
    R1 = 0.115;

  // Solda por posição: vértices duplicados (costuras de UV) compartilham o mesmo nó.
  const keyOf = new Int32Array(n);
  const ids = new Map<string, number>();
  for (let i = 0; i < n; i++) {
    const k = `${Math.round(pos.getX(i) * 1e4)}_${Math.round(pos.getY(i) * 1e4)}_${Math.round(pos.getZ(i) * 1e4)}`;
    let id = ids.get(k);
    if (id === undefined) {
      id = ids.size;
      ids.set(k, id);
    }
    keyOf[i] = id;
  }
  const m = ids.size;
  const vizinhos: Set<number>[] = Array.from({ length: m }, () => new Set<number>());
  const idx = geo.index ? geo.index.array : null;
  const tris = idx ? idx.length / 3 : n / 3;
  for (let t = 0; t < tris; t++) {
    const a = keyOf[idx ? idx[t * 3] : t * 3];
    const b = keyOf[idx ? idx[t * 3 + 1] : t * 3 + 1];
    const c = keyOf[idx ? idx[t * 3 + 2] : t * 3 + 2];
    vizinhos[a].add(b).add(c);
    vizinhos[b].add(a).add(c);
    vizinhos[c].add(a).add(b);
  }

  // 1) peso cru por nó + guardas
  const cru = new Float32Array(m);
  const guarda = new Float32Array(m);
  const tEn = new Float32Array(m);
  const lado = new Int8Array(m);
  for (let i = 0; i < n; i++) {
    const k = keyOf[i];
    if (lado[k] !== 0) continue;
    p.fromBufferAttribute(pos, i);
    const y = p.y;
    const head = ss(0.075, 0.15, y);
    const side = p.x < 0 ? ARM_AXIS.D : ARM_AXIS.E;
    const s1 = distSeg(p, side[0], side[1], tmp),
      s2 = distSeg(p, side[1], side[2], tmp);
    const d = Math.min(s1.d, s2.d);
    const torsoGuard =
      1 - ss(0.0, -0.04, y) * (1 - ss(-0.17, -0.12, y)) * (1 - ss(0.14, 0.245, Math.abs(p.x)));
    // A mochila fica atrás do tronco e nunca acompanha o braço.
    const backGuard = ss(-0.02, -0.075, p.z) * (1 - ss(0.175, 0.215, Math.abs(p.x)));
    cru[k] = 1 - ss(R0, R1, d);
    guarda[k] = (1 - head) * torsoGuard * (1 - backGuard);
    tEn[k] = ss(-0.035, -0.125, y);
    lado[k] = p.x < 0 ? -1 : 1;
  }

  // 2) suavização laplaciana (mantém regiões, elimina degraus entre vizinhos)
  let cur = Float32Array.from(cru, (v, k) => v * guarda[k]);
  let nxt = new Float32Array(m);
  for (let it = 0; it < 10; it++) {
    for (let k = 0; k < m; k++) {
      const vs = vizinhos[k];
      if (vs.size === 0) {
        nxt[k] = cur[k];
        continue;
      }
      let soma = 0;
      for (const v of vs) soma += cur[v];
      nxt[k] = cur[k] * 0.4 + (soma / vs.size) * 0.6;
    }
    [cur, nxt] = [nxt, cur];
  }

  // 3) pesos finais por vértice
  for (let i = 0; i < n; i++) {
    const k = keyOf[i];
    p.fromBufferAttribute(pos, i);
    const head = ss(0.075, 0.15, p.y);
    const armRaw = Math.min(1, cur[k] * guarda[k]);
    const tE = tEn[k];
    const rest = Math.max(0, 1 - head - armRaw);
    const chestShare = ss(-0.26, -0.08, p.y);
    w.fill(0);
    w[2] = head;
    w[1] = rest * chestShare;
    w[0] = rest * (1 - chestShare);
    if (lado[k] < 0) {
      w[3] = armRaw * (1 - tE);
      w[4] = armRaw * tE;
    } else {
      w[5] = armRaw * (1 - tE);
      w[6] = armRaw * tE;
    }
    const order = [0, 1, 2, 3, 4, 5, 6].sort((a, b) => w[b] - w[a]).slice(0, 4);
    let sum = 0;
    for (const o of order) sum += w[o];
    for (let j = 0; j < 4; j++) {
      skinIndex[i * 4 + j] = order[j];
      skinWeight[i * 4 + j] = sum > 0 ? w[order[j]] / sum : j === 0 ? 1 : 0;
    }
  }
  geo.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(skinIndex, 4));
  geo.setAttribute("skinWeight", new THREE.Float32BufferAttribute(skinWeight, 4));
}

interface Rig {
  mesh: THREE.SkinnedMesh;
  bones: Record<"root" | "chest" | "head" | "shD" | "elD" | "shE" | "elE", THREE.Bone>;
}

/** Cache em memória da geometria processada para reaproveitamento instantâneo */
let cachedGeometry: THREE.BufferGeometry | null = null;

function buildRig(source: THREE.Mesh): Rig {
  let geo: THREE.BufferGeometry;
  if (cachedGeometry) {
    geo = cachedGeometry.clone();
  } else {
    geo = source.geometry.clone();
    smoothNormals(geo);
    skinGeometry(geo);
    cachedGeometry = geo.clone();
  }

  const mk = (name: string, world: THREE.Vector3, parent?: { b: THREE.Bone; w: THREE.Vector3 }) => {
    const b = new THREE.Bone();
    b.name = name;
    b.position.copy(parent ? world.clone().sub(parent.w) : world);
    parent?.b.add(b);
    return { b, w: world };
  };

  const root = mk("root", JOINTS.root);
  const chest = mk("chest", JOINTS.chest, root);
  const head = mk("head", JOINTS.head, chest);
  const shD = mk("shD", JOINTS.shD, chest);
  const elD = mk("elD", JOINTS.elD, shD);
  const shE = mk("shE", JOINTS.shE, chest);
  const elE = mk("elE", JOINTS.elE, shE);
  const list = [root, chest, head, shD, elD, shE, elE].map((o) => o.b);

  // Material PBR refinado: toque de pelúcia com acabamento suave e mapa sRGB correto
  const material = (source.material as THREE.MeshStandardMaterial).clone();
  material.metalness = 0.02;
  material.roughness = 0.68;
  if (material.map) {
    material.map.anisotropy = 8;
    material.map.colorSpace = THREE.SRGBColorSpace;
  }

  const mesh = new THREE.SkinnedMesh(geo, material);
  mesh.frustumCulled = false;
  mesh.add(root.b);
  mesh.updateMatrixWorld(true);
  mesh.bind(new THREE.Skeleton(list));

  return {
    mesh,
    bones: { root: root.b, chest: chest.b, head: head.b, shD: shD.b, elD: elD.b, shE: shE.b, elE: elE.b },
  };
}

/* -------------------- Sombra suave de pedestal -------------------- */

let cachedShadowTexture: THREE.CanvasTexture | null = null;

function getSoftShadowTexture(): THREE.CanvasTexture {
  if (cachedShadowTexture) return cachedShadowTexture;
  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(40, 20, 85, 0.44)");
    grad.addColorStop(0.35, "rgba(50, 28, 105, 0.28)");
    grad.addColorStop(0.7, "rgba(70, 40, 130, 0.1)");
    grad.addColorStop(1, "rgba(90, 50, 150, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  cachedShadowTexture = new THREE.CanvasTexture(canvas);
  cachedShadowTexture.needsUpdate = true;
  return cachedShadowTexture;
}

/** Sombra de contato: escala e opacidade atualizadas direto no useFrame (sem re-render do React). */
function StylizedGroundShadow({ shadowRef }: { shadowRef: React.RefObject<THREE.Mesh | null> }) {
  const shadowTex = useMemo(() => getSoftShadowTexture(), []);
  return (
    <mesh ref={shadowRef} position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.55, 0.42, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={shadowTex} transparent opacity={0.7} depthWrite={false} />
    </mesh>
  );
}

/* --------------------------- Animação ----------------------------- */

interface CursorState {
  x: number;
  y: number;
  active: boolean;
}

function TeddyModel({
  estado,
  seguirCursor,
  modeloUrl,
  cursor,
  pulse,
  reduzido,
  shadowRef,
}: {
  estado: TeddyEstado;
  seguirCursor: boolean;
  modeloUrl: string;
  cursor: React.MutableRefObject<CursorState>;
  pulse: React.MutableRefObject<number>;
  reduzido: boolean;
  shadowRef: React.RefObject<THREE.Mesh | null>;
}) {
  const gltf = useGLTF(modeloUrl);
  const rig = useMemo(() => {
    let found: THREE.Mesh | null = null;
    gltf.scene.traverse((o) => {
      if (!found && (o as THREE.Mesh).isMesh) found = o as THREE.Mesh;
    });
    if (!found) throw new Error("Teddy: nenhuma malha encontrada no .glb");
    return buildRig(found);
  }, [gltf]);

  useEffect(() => {
    return () => {
      rig.mesh.geometry.dispose();
      (rig.mesh.material as THREE.Material).dispose();
    };
  }, [rig]);

  const group = useRef<THREE.Group>(null!);
  // Começa menor e "abaixado": a interpolação de pose faz uma entrada suave ao aparecer.
  const cur = useRef<Pose>({ ...POSES.idle, scale: 0.82, rootY: -0.04 });
  const stateStart = useRef(0);
  const last = useRef<TeddyEstado>(estado);
  const gaze = useRef({ x: 0, y: 0 });

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = state.clock.elapsedTime;
    if (last.current !== estado) {
      last.current = estado;
      stateStart.current = t;
    }
    const since = t - stateStart.current;
    const enter = clamp01(since / 0.45);
    const amp = reduzido ? 0.25 : 1;

    // Interpolação suave e contínua em direção à pose de destino
    const target = POSES[estado] || POSES.idle;
    const k = 1 - Math.exp(-dt * 6.5);
    const c = cur.current;
    for (const key of POSE_KEYS) {
      c[key] += (target[key] - c[key]) * k;
    }

    // Micro-oscilações naturais e orgânicas
    const o: Pose = { ...BASE, scale: 0 };
    const s = (f: number, ph = 0) => Math.sin(t * f + ph);

    // Respiração suave com cadência biológica tranquila (~0.35 Hz)
    o.chestX += s(2.2) * 0.01 * amp;
    o.chestZ += s(1.1) * 0.008 * amp;

    // Pequena mudança sutil de peso corporal (vida e presença)
    o.headZ += s(0.7) * 0.015 * amp;

    let hop = 0,
      squash = 0;

    switch (estado) {
      case "feliz": {
        hop = Math.abs(s(2.6)) * 0.018 * amp;
        o.chestZ += s(1.3) * 0.018 * amp;
        o.headZ += s(2.6) * 0.02 * amp;
        break;
      }
      case "acenando": {
        // Tchauzinho amigável com frequência agradável (~0.6 Hz)
        o.Dez += s(3.8) * 0.32 * enter * amp;
        o.Dsz += s(1.9) * 0.06 * enter * amp;
        o.headZ += s(1.9) * 0.035 * enter * amp;
        break;
      }
      case "comemorando": {
        // Pulinho alegre com amortecimento elástico
        hop = Math.abs(s(3.4)) * 0.055 * enter * amp;
        squash = (s(6.8 - Math.PI) * 0.5 + 0.5) * 0.025 * enter * amp;
        o.Dez += s(6.8) * 0.18 * enter * amp;
        o.Eez += s(6.8, 0.8) * 0.18 * enter * amp;
        o.chestZ += s(1.7) * 0.04 * amp;
        break;
      }
      case "preocupado": {
        // Inquietação sutil e contida sem vibrações mecânicas
        o.chestZ += s(2.8) * 0.012 * amp;
        o.headZ += s(2.1) * 0.018 * amp;
        o.headX += s(1.4) * 0.015 * amp;
        break;
      }
      case "pensando": {
        o.headZ += s(0.9) * 0.025 * amp;
        o.headX += s(0.6) * 0.015 * amp;
        break;
      }
      case "incentivando": {
        hop = Math.abs(s(2.2)) * 0.014 * amp;
        o.Dex += s(4.4) * 0.08 * enter * amp;
        o.headX += s(2.2) * 0.02 * amp;
        break;
      }
      case "explicando": {
        // Gestos de oratória carismática e receptiva
        o.Dsz += s(2.0) * 0.18 * amp;
        o.Dex += s(2.0, 0.8) * 0.18 * amp;
        o.headX += s(2.0, 1.6) * 0.03 * amp;
        o.chestZ += s(1.0) * 0.02 * amp;
        break;
      }
      case "triste": {
        o.chestX += s(0.8) * 0.012 * amp;
        o.headX += s(0.8, 0.8) * 0.02 * amp;
        break;
      }
      case "surpreso": {
        const j = since < 0.45 ? Math.sin((since / 0.45) * Math.PI) : 0;
        hop = j * 0.065 * amp;
        squash = -j * 0.025 * amp;
        break;
      }
      default:
        break;
    }

    // Reação interativa ao clique (pulinho carismático com retorno suave)
    const pt = t - pulse.current;
    if (pt >= 0 && pt < 0.5) {
      const hopPhase = pt / 0.5;
      hop += Math.sin(hopPhase * Math.PI) * 0.065 * amp;
      squash += (hopPhase < 0.2 ? -0.03 : hopPhase > 0.7 ? 0.02 : 0) * amp;
    }

    const sh = shadowRef.current;
    if (sh) {
      const k2 = Math.max(0.7, 1 - hop * 2.2);
      sh.scale.set(0.55 * k2, 0.42 * k2, 1);
      (sh.material as THREE.MeshBasicMaterial).opacity = Math.max(0.2, 0.7 - hop * 3.5);
    }

    // Olhar em direção ao cursor (suavizado e com amplitude limitada para naturalidade)
    // Sem cursor por perto, o Teddy olha em volta devagar (curiosidade em vez de estátua).
    const olharLivre = !(seguirCursor && cursor.current.active);
    const passeio = olharLivre && !reduzido ? 1 : 0;
    const targetGx = olharLivre
      ? (Math.sin(t * 0.31) * 0.6 + Math.sin(t * 0.13 + 1.7) * 0.4) * 0.32 * passeio
      : Math.max(-0.6, Math.min(0.6, cursor.current.x));
    const targetGy = olharLivre
      ? Math.sin(t * 0.23 + 0.6) * 0.12 * passeio
      : Math.max(-0.4, Math.min(0.4, cursor.current.y));

    gaze.current.x += (targetGx - gaze.current.x) * (1 - Math.exp(-dt * 5.0));
    gaze.current.y += (targetGy - gaze.current.y) * (1 - Math.exp(-dt * 5.0));

    const lookFactor =
      estado === "triste" ? 0.3 : estado === "pensando" ? 0.45 : 0.85;

    const b = rig.bones;
    const v = (key: PoseKey) => c[key] + o[key];

    b.root.position.set(JOINTS.root.x, JOINTS.root.y + v("rootY") + hop, JOINTS.root.z);
    b.chest.rotation.set(v("chestX"), gaze.current.x * 0.1 * lookFactor, v("chestZ"));
    b.head.rotation.set(
      v("headX") + gaze.current.y * 0.22 * lookFactor,
      gaze.current.x * 0.45 * lookFactor,
      v("headZ")
    );

    b.shD.rotation.set(v("Dsx"), v("Dsy"), v("Dsz"));
    b.elD.rotation.set(v("Dex"), 0, v("Dez"));
    // Espelho simétrico e harmonioso no braço esquerdo
    b.shE.rotation.set(v("Esx"), -v("Esy"), -v("Esz"));
    b.elE.rotation.set(v("Eex"), 0, -v("Eez"));

    // Respiração suave de corpo inteiro
    const breathe = 1 + Math.sin(t * 2.2) * 0.005 * amp;
    const sc = c.scale * breathe;
    group.current.scale.set(sc * (1 + squash * 0.6), sc * (1 - squash), sc * (1 + squash * 0.6));
  });

  return (
    <group ref={group} position={[0, 0.4993, 0]}>
      <primitive object={rig.mesh} />
    </group>
  );
}

/* ----------------------- Rastreador de Cursor ---------------------- */

function CursorTracker({ cursor }: { cursor: React.MutableRefObject<CursorState> }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    let timeout: number | undefined;

    const onMove = (e: PointerEvent) => {
      const r = gl.domElement.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.35;
      cursor.current.x = (e.clientX - cx) / Math.max(280, r.width * 0.8);
      cursor.current.y = -(e.clientY - cy) / Math.max(240, r.height * 0.8);
      cursor.current.active = true;

      window.clearTimeout(timeout);
      // Se cursor parado por mais de 3.5s, repousa gentilmente o olhar
      timeout = window.setTimeout(() => {
        cursor.current.active = false;
      }, 3500);
    };

    const onLeave = () => {
      cursor.current.active = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [gl, cursor]);
  return null;
}

function Pulser({
  pulse,
  trigger,
}: {
  pulse: React.MutableRefObject<number>;
  trigger: React.MutableRefObject<boolean>;
}) {
  useFrame((state) => {
    if (trigger.current) {
      trigger.current = false;
      pulse.current = state.clock.elapsedTime;
    }
  });
  return null;
}

/* ------------------------- Componente Teddy ----------------------- */

export function Teddy({
  estado = "idle",
  tamanho = 300,
  seguirCursor = true,
  enquadramento = "corpo",
  sombra = true,
  modeloUrl = "/teddy.glb",
  className,
  style,
  onClick,
}: TeddyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursor = useRef<CursorState>({ x: 0, y: 0, active: false });
  const pulse = useRef(-10);
  const trigger = useRef(false);
  const shadowRef = useRef<THREE.Mesh>(null);
  const [isVisible, setIsVisible] = useState(true);

  const reduzido = useMemo(
    () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Otimização: interrompe a renderização WebGL quando o mascote sai da tela ou a aba fica oculta
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true;
        setIsVisible(visible);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    const onVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
      } else if (el) {
        const rect = el.getBoundingClientRect();
        setIsVisible(rect.bottom > 0 && rect.top < window.innerHeight);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const busto = enquadramento === "busto";
  const altura = busto ? tamanho : Math.round(tamanho * 1.25);
  const cam = busto
    ? { pos: [0, 0.8, 1.72] as const, look: [0, 0.8, 0] as const, fov: 29 }
    : { pos: [0, 0.52, 3.12] as const, look: [0, 0.5, 0] as const, fov: 26.5 };

  const handleClick = () => {
    trigger.current = true;
    onClick?.();
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: tamanho,
        height: altura,
        cursor: onClick ? "pointer" : "default",
        touchAction: "manipulation",
        ...style,
      }}
      role={onClick ? "button" : "img"}
      tabIndex={onClick ? 0 : undefined}
      aria-label="Teddy, o mascote do SINAL"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <Canvas
        frameloop={isVisible ? "always" : "never"}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{ position: [...cam.pos], fov: cam.fov, near: 0.1, far: 30 }}
        onCreated={({ camera }) => camera.lookAt(cam.look[0], cam.look[1], cam.look[2])}
        style={{ background: "transparent" }}
      >
        {/* Iluminação de estúdio harmonizada com a identidade do Sinal */}
        <ambientLight intensity={0.65} color="#F4EFFF" />
        {/* Luz principal quente de frente-direita */}
        <directionalLight position={[2.6, 3.4, 3.2]} intensity={1.75} color="#FFFBF0" />
        {/* Luz de preenchimento suave no tom Lilás Sinal */}
        <directionalLight position={[-2.8, 1.8, 2.2]} intensity={0.9} color="#D2BFFF" />
        {/* Luz de contorno no tom Verde-água Sinal (#53C6B6) realçando a silhueta */}
        <directionalLight position={[-2.6, 3.0, -2.8]} intensity={1.35} color="#53C6B6" />
        {/* Luz de recorte quente no tom Amarelo Sinal (#FFC044) */}
        <directionalLight position={[2.6, 1.8, -2.4]} intensity={0.8} color="#FFC044" />
        {/* Catchlight frontal para brilho e vida nos olhos */}
        <pointLight position={[0, 0.45, 2.2]} intensity={0.3} color="#FFFFFF" distance={4} />

        <Suspense fallback={null}>
          <TeddyModel
            estado={estado}
            seguirCursor={seguirCursor}
            modeloUrl={modeloUrl}
            cursor={cursor}
            pulse={pulse}
            reduzido={reduzido}
            shadowRef={shadowRef}
          />
          {sombra && !busto && <StylizedGroundShadow shadowRef={shadowRef} />}
        </Suspense>

        {seguirCursor && <CursorTracker cursor={cursor} />}
        <Pulser pulse={pulse} trigger={trigger} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/teddy.glb");
export default Teddy;
