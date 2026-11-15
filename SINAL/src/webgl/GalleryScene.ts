import * as THREE from "three";
import type { Tema } from "@/data/temas";
import { VirtualScroll } from "@/systems/VirtualScroll";

const CARD_VERT = /* glsl */ `
  uniform float uCurve;
  uniform float uVelocity;
  uniform float uHover;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // world X before bending: drives the cylindrical bend of the whole ribbon
    vec4 world = modelMatrix * vec4(pos, 1.0);
    float wx = world.x;

    // cylindrical bend — planes wrap away from the camera towards the edges
    world.z -= uCurve * wx * wx;

    // velocity driven wave: the ribbon flexes while it is moving
    world.z += sin(wx * 0.22 + uv.x * 3.14159) * uVelocity * 0.00035;
    world.y += sin(uv.x * 3.14159) * uVelocity * 0.00008;

    // hover lift
    world.z += uHover * 0.18;

    vDepth = world.z;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const CARD_FRAG = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uRadius;      // in uv units of the shorter side
  uniform vec2 uSize;         // card size in world units
  uniform float uOpacity;
  uniform float uHover;
  uniform vec3 uTint;
  varying vec2 vUv;
  varying float vDepth;

  // signed distance to a rounded box
  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  void main() {
    vec2 p = (vUv - 0.5) * uSize;
    float d = roundedBox(p, uSize * 0.5, uRadius);
    float aa = fwidth(d) * 1.2;
    float mask = 1.0 - smoothstep(-aa, aa, d);
    if (mask <= 0.001) discard;

    // Imagem do Teddy pura e nítida (sem overlay ou lavagem de cor)
    vec3 color = texture2D(uTexture, vUv).rgb;

    // Profundidade 3D suave para os extremos da fita
    float shade = clamp(1.0 + vDepth * 0.10, 0.50, 1.0);
    color *= shade;

    // Leve realce de brilho natural ao passar o mouse (sem tingir com a cor do tema)
    color *= (0.98 + uHover * 0.08);

    // Contorno fino, nítido e elegante na cor oficial de cada tema
    float borderWidth = 0.020;
    float border = smoothstep(-borderWidth - aa, -borderWidth, d);
    vec3 borderColor = uTint * (1.0 + uHover * 0.22);
    color = mix(color, borderColor, border);

    gl_FragColor = vec4(color, mask * uOpacity);
  }
`;

type CardUniforms = {
  uTexture: { value: THREE.Texture | null };
  uRadius: { value: number };
  uSize: { value: THREE.Vector2 };
  uOpacity: { value: number };
  uHover: { value: number };
  uCurve: { value: number };
  uVelocity: { value: number };
  uTint: { value: THREE.Color };
};

export type CardScreenInfo = {
  slug: string;
  x: number;
  y: number;
  opacity: number;
  hovered: boolean;
};

const CARD_HEIGHT = 2.7;
const GAP = 0.55;

export class GalleryScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private cards: {
    mesh: THREE.Mesh;
    material: THREE.ShaderMaterial;
    u: CardUniforms;
    baseX: number;
    width: number;
    project: Tema;
    hover: number;
    reveal: number;
  }[] = [];
  private total = 0;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2(-10, -10);
  private pointerNorm = new THREE.Vector2(0, 0);
  private smoothedPointer = new THREE.Vector2(0, 0);
  private hoveredIndex = -1;
  private raf = 0;
  private lastTime = 0;
  private disposed = false;
  private elapsed = 0;
  private lowPower: boolean;

  scroll: VirtualScroll;
  onFrame?: (cards: CardScreenInfo[], hovered: Tema | null) => void;
  onSelect?: (tema: Tema) => void;
  onActive?: (slug: string) => void;
  private activeSlug = "";
  step(direction: number) {
    const index = Math.max(0, this.cards.findIndex(card => card.project.slug === this.activeSlug));
    const next = this.cards[(index + direction + this.cards.length) % this.cards.length];
    const delta = this.wrap(next.baseX - this.scroll.current * 0.0032);
    this.scroll.target = this.scroll.current + delta / 0.0032;
  }

  constructor(
    private canvas: HTMLCanvasElement,
    private projects: Tema[],
  ) {
    this.lowPower = window.matchMedia("(pointer: coarse)").matches;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !this.lowPower,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.lowPower ? 1.5 : 2));
    this.renderer.setClearColor(0x000000, 0);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 120);
    this.camera.position.set(0, 0.15, 7.4);

    const isMobile = window.innerWidth < 768;
    this.scroll = new VirtualScroll(canvas, {
      smoothing: isMobile ? 18 : 6.5,
      wheelFactor: 1,
      dragFactor: isMobile ? 2.2 : 1.7,
    });

    this.buildCards();
    this.resize();

    window.addEventListener("resize", this.resize);
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    canvas.addEventListener("click", this.onClick);
    document.addEventListener("visibilitychange", this.onVisibility);

    this.raf = requestAnimationFrame(this.tick);
  }

  private buildCards() {
    const geo = new THREE.PlaneGeometry(1, 1, 40, 20);
    const loader = new THREE.TextureLoader();
    let cursor = 0;

    this.projects.forEach((project) => {
      const cardAspect = project.cardAspect ?? project.aspect;
      const width = CARD_HEIGHT * cardAspect;
      const u: CardUniforms = {
        uTexture: { value: null },
        uRadius: { value: 0.14 },
        uSize: { value: new THREE.Vector2(width, CARD_HEIGHT) },
        uOpacity: { value: 0 },
        uHover: { value: 0 },
        uCurve: { value: 0.028 },
        uVelocity: { value: 0 },
        uTint: { value: new THREE.Color(project.color) },
      };
      const material = new THREE.ShaderMaterial({
        vertexShader: CARD_VERT,
        fragmentShader: CARD_FRAG,
        transparent: true,
        uniforms: u,
      });

      loader.load(project.cardImage || project.image, (texture) => {
        if (this.disposed) { texture.dispose(); return; }
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        u.uTexture.value = texture;
      });

      const mesh = new THREE.Mesh(geo, material);
      mesh.scale.set(width, CARD_HEIGHT, 1);
      mesh.frustumCulled = false;
      this.scene.add(mesh);

      this.cards.push({
        mesh,
        material,
        u,
        baseX: cursor + width / 2,
        width,
        project,
        hover: 0,
        reveal: 0,
      });

      cursor += width + GAP;
    });

    this.total = cursor;
    if (window.innerWidth < 768) this.scroll.current = this.scroll.target = this.cards[0].baseX / 0.0032;
  }

  private resize = () => {
    const { width: w, height: h } = this.canvas.getBoundingClientRect();
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // No PC (w >= 768), valores 100% idênticos aos originais (7.4 / 8.6)
    // No celular (w < 768), afasta para que os cards fiquem em tamanho harmônico e não transbordem
    const isMobile = w < 768;
    const cardWidth = Math.max(...this.cards.map(card => card.width));
    const mobileDistance = Math.max(cardWidth / (0.94 * (w / h)), CARD_HEIGHT / 0.48) / (2 * Math.tan(THREE.MathUtils.degToRad(45 / 2)));
    this.camera.position.z = isMobile ? mobileDistance : w < 1100 ? 8.6 : 7.4;
    // Match a finger pixel to a rendered pixel instead of a fixed desktop multiplier.
    const worldWidth = 2 * this.camera.position.z * Math.tan(THREE.MathUtils.degToRad(45 / 2)) * (w / h);
    this.scroll.setDragFactor(isMobile ? worldWidth / w / 0.0032 : 1.7);
    this.camera.position.y = isMobile ? 0.35 : 0.15;
    this.camera.updateProjectionMatrix();
  };

  private onPointerMove = (e: { clientX: number; clientY: number }) => {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.pointerNorm.set(this.pointer.x, this.pointer.y);
  };

  private onClick = (e: MouseEvent) => {
    if (this.scroll.dragDistance > 12) return;
    this.onPointerMove(e);
    this.scene.updateMatrixWorld(true);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.cards.map(c => c.mesh), false)[0];
    this.hoveredIndex = this.cards.findIndex(c => c.mesh === hit?.object);
    if (this.hoveredIndex < 0) return;
    const card = this.cards[this.hoveredIndex];
    if (card) this.onSelect?.(card.project);
  };

  private onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.raf);
    } else if (!this.disposed) {
      this.lastTime = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    }
  };

  private wrap(x: number) {
    const half = this.total / 2;
    return ((((x + half) % this.total) + this.total) % this.total) - half;
  }

  private tick = (now = performance.now()) => {
    this.raf = requestAnimationFrame(this.tick);
    if (!this.lastTime) this.lastTime = now;
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    this.elapsed += dt;

    // pixels -> world units
    const offset = this.scroll.update(dt) * 0.0032;
    const velocity = this.scroll.velocity * 0.0032;

    // cursor drives a small parallax of the whole ribbon
    const k = 1 - Math.exp(-4 * dt);
    this.smoothedPointer.x += (this.pointerNorm.x - this.smoothedPointer.x) * k;
    this.smoothedPointer.y += (this.pointerNorm.y - this.smoothedPointer.y) * k;

    this.camera.position.x = this.smoothedPointer.x * 0.22;
    this.camera.position.y = 0.15 + this.smoothedPointer.y * 0.12;
    this.camera.lookAt(0, 0, 0);

    for (const card of this.cards) {
      const x = this.wrap(card.baseX - offset);
      card.mesh.position.x = x;
      card.mesh.position.y = Math.sin(x * 0.18 + this.elapsed * 0.35) * 0.035;
      card.mesh.rotation.y = -x * 0.055;
      card.u.uVelocity.value = velocity * 60;

      // fade in near the seam so the infinite loop never pops
      const edge = 1 - THREE.MathUtils.smoothstep(Math.abs(x), 11.5, 18.0);
      card.reveal += (Math.min(1, this.elapsed * 0.9) - card.reveal) * (1 - Math.exp(-3 * dt));
      card.u.uOpacity.value = edge * card.reveal;
    }

    const active = this.cards.reduce((nearest, card) => Math.abs(card.mesh.position.x) < Math.abs(nearest.mesh.position.x) ? card : nearest);
    if (active.project.slug !== this.activeSlug) {
      this.activeSlug = active.project.slug;
      this.onActive?.(this.activeSlug);
    }

    // hover via raycast against the (unbent) planes — accurate enough at these angles
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(
      this.cards.map((c) => c.mesh),
      false,
    );
    const hitMesh = hits[0]?.object ?? null;
    this.hoveredIndex = this.cards.findIndex((c) => c.mesh === hitMesh);

    const infos: CardScreenInfo[] = [];
    const v = new THREE.Vector3();
    this.cards.forEach((card, i) => {
      const isHovered = i === this.hoveredIndex && !this.scroll.isDragging;
      card.hover += ((isHovered ? 1 : 0) - card.hover) * (1 - Math.exp(-9 * dt));
      card.u.uHover.value = card.hover;
      const s = 1 + card.hover * 0.022;
      card.mesh.scale.set(card.width * s, CARD_HEIGHT * s, 1);

      // project the card's bottom-left corner to screen space for the DOM label
      v.set(-0.42, -0.44, 0).applyMatrix4(card.mesh.matrixWorld);
      v.project(this.camera);
      infos.push({
        slug: card.project.slug,
        x: (v.x * 0.5 + 0.5) * window.innerWidth,
        y: (-v.y * 0.5 + 0.5) * window.innerHeight,
        opacity: card.u.uOpacity.value,
        hovered: card.hover > 0.5,
      });
    });

    this.onFrame?.(
      infos,
      this.cards[this.hoveredIndex]?.project ?? null,
    );

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("click", this.onClick);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.scroll.destroy();

    this.cards.forEach((c) => {
      c.u.uTexture.value?.dispose();
      c.material.dispose();
      c.mesh.geometry.dispose();
    });
    this.renderer.dispose();
  }
}
