import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* ------------------------------------------------------------------ */
/*  Teddy 3D oficial (moletom roxo com a mão e o coração).             */
/*  O modelo já vem com esqueleto (24 ossos). As poses são feitas      */
/*  girando os ossos em eixos do mundo, com amortecimento de mola,     */
/*  então qualquer estado novo é só uma tabela de ângulos.             */
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

export const TEDDY_MODELO = "/teddy-oficial.glb";

export interface TeddyProps {
  estado?: TeddyEstado | undefined;
  /** Largura em px. A altura acompanha (4:5 no corpo, 1:1 no busto). */
  tamanho?: number | undefined;
  /** Cabeça acompanha o cursor suavemente. */
  seguirCursor?: boolean | undefined;
  enquadramento?: TeddyEnquadramento | undefined;
  modeloUrl?: string | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  onClick?: (() => void) | undefined;
  /** Chamado quando o modelo terminou de carregar e já desenhou o primeiro quadro. */
  onPronto?: (() => void) | undefined;
  /** Incrementar para disparar um pulinho. */
  pulo?: number | undefined;
}

/* ----------------------------- Poses ------------------------------ */
/*  Ângulos em radianos, em eixos do mundo (o Teddy olha para +Z).     */
/*  Braço esquerdo (+X): +Z levanta. Braço direito (-X): -Z levanta.   */
/*  Eixo X negativo leva o braço para a frente. Cabeça: +X abaixa.     */

const CHAVES = [
  "aEz",
  "aEx",
  "aEy",
  "fEz",
  "fEx",
  "aDz",
  "aDx",
  "aDy",
  "fDz",
  "fDx",
  "cabX",
  "cabY",
  "cabZ",
  "troncoX",
  "troncoZ",
  "quadrilY",
  "aceno",
  "pulinho",
  "balanco",
] as const;
type Chave = (typeof CHAVES)[number];
type Pose = Record<Chave, number>;

const BASE: Pose = {
  aEz: -0.42,
  aEx: -0.08,
  aEy: 0,
  fEz: 0.05,
  fEx: -0.18,
  aDz: 0.42,
  aDx: -0.08,
  aDy: 0,
  fDz: -0.05,
  fDx: -0.18,
  cabX: 0,
  cabY: 0,
  cabZ: 0,
  troncoX: 0,
  troncoZ: 0,
  quadrilY: 0,
  aceno: 0,
  pulinho: 0,
  balanco: 1,
};

const p = (o: Partial<Pose>): Pose => ({ ...BASE, ...o });

const POSES: Record<TeddyEstado, Pose> = {
  idle: BASE,
  feliz: p({ cabZ: 0.08, cabX: -0.06, aEz: -0.3, aDz: 0.3, pulinho: 0.4 }),
  acenando: p({ aDz: -1.42, aDx: -0.2, fDz: -0.9, fDx: -0.15, cabZ: 0.1, cabY: -0.08, aceno: 1 }),
  comemorando: p({
    aEz: 1.55,
    aDz: -1.55,
    aEx: -0.35,
    aDx: -0.35,
    fEz: 0.55,
    fDz: -0.55,
    cabX: -0.14,
    pulinho: 1,
  }),
  incentivando: p({
    aDz: 0.7,
    aDx: -0.95,
    aDy: 0.15,
    fDx: -1.35,
    cabZ: 0.08,
    cabX: -0.04,
    troncoX: 0.04,
  }),
  preocupado: p({
    aEz: -0.62,
    aDz: 0.62,
    aEx: -0.55,
    aDx: -0.55,
    aEy: -0.45,
    aDy: 0.45,
    fEx: -0.85,
    fDx: -0.85,
    cabX: 0.2,
    cabZ: -0.1,
    troncoX: 0.05,
    balanco: 0.5,
  }),
  triste: p({ aEz: -0.52, aDz: 0.52, cabX: 0.3, troncoX: 0.08, balanco: 0.35 }),
  pensando: p({
    aDz: 0.72,
    aDx: -0.85,
    aDy: 0.45,
    fDx: -2.35,
    cabZ: 0.14,
    cabY: -0.16,
    cabX: -0.05,
    balanco: 0.6,
  }),
  explicando: p({ aDz: 0.35, aDx: -0.75, aDy: -0.15, fDx: -0.95, cabZ: 0.06, aceno: 0.35 }),
  surpreso: p({
    aEz: 0.2,
    aDz: -0.2,
    aEx: -0.3,
    aDx: -0.3,
    fEz: 1.1,
    fDz: -1.1,
    fEx: -0.5,
    fDx: -0.5,
    cabX: -0.12,
    troncoX: -0.05,
    pulinho: 0.6,
  }),
};

/* ---------------------------- Utilidades --------------------------- */

const EIXO_X = new THREE.Vector3(1, 0, 0);
const EIXO_Y = new THREE.Vector3(0, 1, 0);
const EIXO_Z = new THREE.Vector3(0, 0, 1);

interface OssoRig {
  osso: THREE.Bone;
  local0: THREE.Quaternion;
  pai0: THREE.Quaternion;
  pai0Inv: THREE.Quaternion;
}

const qa = new THREE.Quaternion();
const qb = new THREE.Quaternion();
const qc = new THREE.Quaternion();

/**
 * Aplica uma rotação (em eixos do mundo, na pose de repouso) ao osso.
 * `zPai` é a abertura do braço: o antebraço gira junto com ela antes de dobrar,
 * para que "dobrar" signifique sempre dobrar o cotovelo para a frente.
 */
function girar(r: OssoRig | undefined, x: number, y: number, z: number, zPai = 0) {
  if (!r) return;
  // Ordem: Z (abre/fecha o braço), depois X (frente/trás), depois Y (para dentro/fora).
  qa.setFromAxisAngle(EIXO_Y, y);
  qb.setFromAxisAngle(EIXO_X, x);
  qa.multiply(qb);
  qb.setFromAxisAngle(EIXO_Z, z + zPai);
  qa.multiply(qb);
  if (zPai) {
    qb.setFromAxisAngle(EIXO_Z, -zPai);
    qa.premultiply(qb);
  }
  qc.copy(r.pai0Inv).multiply(qa).multiply(r.pai0);
  r.osso.quaternion.copy(qc).multiply(r.local0);
}

const prefereMenosMovimento = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------ Modelo ----------------------------- */

interface ModeloProps {
  url: string;
  estado: TeddyEstado;
  seguirCursor: boolean;
  pulo: number;
  onPronto?: (() => void) | undefined;
}

function Modelo({ url, estado, seguirCursor, pulo, onPronto }: ModeloProps) {
  const { scene } = useGLTF(url);
  const raiz = useRef<THREE.Group>(null);
  const instancia = useMemo(() => {
    const c = cloneSkinned(scene);
    c.traverse((o) => {
      const m = o as THREE.SkinnedMesh;
      if (m.isMesh) {
        m.frustumCulled = false;
        const mat = m.material as THREE.MeshPhysicalMaterial;
        if (mat) mat.envMapIntensity = 0.3;
      }
    });
    return c;
  }, [scene]);

  const rig = useMemo(() => {
    instancia.updateMatrixWorld(true);
    const mapa = new Map<string, OssoRig>();
    instancia.traverse((o) => {
      if (!(o as THREE.Bone).isBone) return;
      const osso = o as THREE.Bone;
      const pai0 = new THREE.Quaternion();
      osso.parent?.getWorldQuaternion(pai0);
      mapa.set(osso.name, {
        osso,
        local0: osso.quaternion.clone(),
        pai0,
        pai0Inv: pai0.clone().invert(),
      });
    });
    return mapa;
  }, [instancia]);

  const atual = useRef<Pose>({ ...BASE });
  const alvoCabeca = useRef({ x: 0, y: 0, ativo: false, ultimo: 0 });
  const pulo0 = useRef(pulo);
  const tPulo = useRef(-10);
  const reduzir = useMemo(prefereMenosMovimento, []);
  const avisou = useRef(false);

  // Cursor → direção do olhar (só mouse).
  useEffect(() => {
    if (!seguirCursor || typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      alvoCabeca.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      alvoCabeca.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      alvoCabeca.current.ativo = true;
      alvoCabeca.current.ultimo = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [seguirCursor]);

  useEffect(() => {
    if (pulo !== pulo0.current) {
      pulo0.current = pulo;
      tPulo.current = -1; // marca para iniciar no próximo quadro
    }
  }, [pulo]);

  useLayoutEffect(() => {
    if (raiz.current) raiz.current.scale.setScalar(reduzir ? 1 : 0.86);
  }, [reduzir]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const d = Math.min(dt, 1 / 20);
    const alvo = POSES[estado];
    const cur = atual.current;
    const k = reduzir ? 1 : 1 - Math.exp(-d * 7);
    for (const c of CHAVES) cur[c] += (alvo[c] - cur[c]) * k;

    if (tPulo.current === -1) tPulo.current = t;

    const m = reduzir ? 0 : 1;
    const resp = Math.sin(t * 1.9) * 0.018 * cur.balanco * m;
    const aceno = Math.sin(t * 9) * 0.38 * cur.aceno * m;

    // Olhar: cursor quando houver, senão um passeio lento pelo ambiente.
    const cab = alvoCabeca.current;
    const cursorAtivo = cab.ativo && performance.now() - cab.ultimo < 4000;
    const olharY = cursorAtivo ? cab.x * 0.42 : Math.sin(t * 0.37) * 0.22 * m;
    const olharX = cursorAtivo ? cab.y * 0.22 : Math.sin(t * 0.53 + 1) * 0.05 * m;

    // Pulinho (clique ou estado comemorando/feliz)
    const desdePulo = t - tPulo.current;
    const puloClique =
      desdePulo >= 0 && desdePulo < 0.55 ? Math.sin((desdePulo / 0.55) * Math.PI) : 0;
    const puloEstado = Math.max(0, Math.sin(t * 6.2)) * 0.5 * cur.pulinho;
    const altura = (puloClique * 0.16 + puloEstado * 0.08) * m;

    const g = raiz.current;
    if (g) {
      g.position.y = altura;
      const s = g.scale.x + (1 - g.scale.x) * (reduzir ? 1 : 1 - Math.exp(-d * 6));
      g.scale.setScalar(s);
      g.rotation.y = Math.sin(t * 0.45) * 0.06 * cur.balanco * m;
    }

    girar(rig.get("Hips"), 0, cur.quadrilY, Math.sin(t * 0.9) * 0.012 * cur.balanco * m);
    girar(rig.get("Spine01"), cur.troncoX + resp, 0, cur.troncoZ);
    girar(rig.get("Spine"), resp * 0.6, 0, 0);
    girar(rig.get("Head"), cur.cabX + olharX, cur.cabY + olharY, cur.cabZ - olharY * 0.12);

    const respBraco = resp * 1.4;
    girar(rig.get("LeftArm"), cur.aEx, cur.aEy, cur.aEz - respBraco);
    girar(rig.get("LeftForeArm"), cur.fEx, 0, cur.fEz, cur.aEz - respBraco);
    girar(rig.get("RightArm"), cur.aDx, cur.aDy, cur.aDz + respBraco);
    girar(rig.get("RightForeArm"), cur.fDx, 0, cur.fDz + aceno, cur.aDz + respBraco);

    if (!avisou.current) {
      avisou.current = true;
      requestAnimationFrame(() => onPronto?.());
    }
  });

  return (
    <group ref={raiz}>
      <primitive object={instancia} />
    </group>
  );
}

/** Luz de ambiente gerada localmente (sem baixar HDR). */
function Ambiente() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

const CAMERAS: Record<
  TeddyEnquadramento,
  { pos: [number, number, number]; alvo: [number, number, number]; fov: number }
> = {
  corpo: { pos: [0, 1.0, 4.6], alvo: [0, 0.86, 0], fov: 26 },
  busto: { pos: [0, 1.3, 2.6], alvo: [0, 1.2, 0], fov: 26 },
};

export function Teddy({
  estado = "idle",
  tamanho = 320,
  seguirCursor = true,
  enquadramento = "corpo",
  modeloUrl = TEDDY_MODELO,
  className = "",
  style,
  onClick,
  onPronto,
  pulo = 0,
}: TeddyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(true);
  const cam = CAMERAS[enquadramento];
  const altura = Math.round(enquadramento === "corpo" ? tamanho * 1.25 : tamanho);

  // Não desenha quadros quando o Teddy está fora da tela.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisivel(!!e?.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ width: tamanho, height: altura, ...style }}
      onClick={onClick}
    >
      <Canvas
        frameloop={visivel ? "always" : "never"}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: cam.pos, fov: cam.fov, near: 0.1, far: 30 }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(...cam.alvo);
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = 0.9;
        }}
        style={{ pointerEvents: "none" }}
      >
        <Ambiente />
        <hemisphereLight args={["#fffaf2", "#6f5aa8", 0.55]} />
        <directionalLight position={[2.4, 3.6, 3.2]} intensity={1.7} color="#fff6ea" />
        <directionalLight position={[-3, 2.2, -2.4]} intensity={1.2} color="#b9a3ff" />
        <directionalLight position={[2.8, 1.4, -2.6]} intensity={0.7} color="#ffd38a" />
        <Suspense fallback={null}>
          <Modelo
            url={modeloUrl}
            estado={estado}
            seguirCursor={seguirCursor}
            pulo={pulo}
            onPronto={onPronto}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Teddy;
