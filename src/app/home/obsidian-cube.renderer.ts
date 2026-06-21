import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Euler,
  Float32BufferAttribute,
  Fog,
  Group,
  LineBasicMaterial,
  LineSegments,
  LinearFilter,
  LinearMipmapLinearFilter,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Points,
  PointsMaterial,
  Quaternion,
  Raycaster,
  RingGeometry,
  Scene,
  SRGBColorSpace,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

export type ObsidianCubeFaceId =
  | 'home'
  | 'profile'
  | 'stack'
  | 'experience'
  | 'projects'
  | 'contact';

export interface ObsidianCubeFace {
  id: ObsidianCubeFaceId;
  title: string;
  eyebrow: string;
  route: string;
  accent: string;
}

interface Glint {
  mesh: Mesh;
  baseScale: number;
  delay: number;
}

const DRAG_SENSITIVITY = 0.009;
const INITIAL_ROTATION = new Euler(-0.26, -0.62, -0.08);

export const PORTFOLIO_OBSIDIAN_FACES: ObsidianCubeFace[] = [
  {
    id: 'home',
    title: 'Inicio',
    eyebrow: 'Portafolio',
    route: '/home',
    accent: '#ff7a3d',
  },
  {
    id: 'profile',
    title: 'Perfil',
    eyebrow: 'Sobre mi',
    route: '/perfil',
    accent: '#ffb47a',
  },
  {
    id: 'stack',
    title: 'Stack',
    eyebrow: 'Tecnologias',
    route: '/stack',
    accent: '#ff6738',
  },
  {
    id: 'experience',
    title: 'Experiencia',
    eyebrow: 'Trabajo real',
    route: '/experiencia',
    accent: '#ffd18c',
  },
  {
    id: 'projects',
    title: 'Proyectos',
    eyebrow: 'Codigo',
    route: '/proyectos',
    accent: '#ff9a5f',
  },
  {
    id: 'contact',
    title: 'Contacto',
    eyebrow: 'Canales',
    route: '/contacto',
    accent: '#ffe2c8',
  },
];

export class ObsidianCubeRenderer {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(37, 1, 0.1, 80);
  private readonly renderer: WebGLRenderer;
  private readonly cubeRig = new Group();
  private readonly targetQuaternion = new Quaternion().setFromEuler(INITIAL_ROTATION);
  private readonly raycaster = new Raycaster();
  private readonly pointer = new Vector2();
  private readonly faceMeshes: Mesh[] = [];
  private readonly glints: Glint[] = [];
  private readonly dragAxis = new Vector3();
  private readonly dragDelta = new Quaternion();
  private readonly scratchEuler = new Euler();
  private readonly scratchQuaternion = new Quaternion();
  private readonly dragState = {
    active: false,
    freeRest: false,
    pointerId: -1,
    lastX: 0,
    lastY: 0,
    totalDistance: 0,
    spinAngle: 0,
    spinAxis: new Vector3(0, 1, 0),
    clickedFace: undefined as ObsidianCubeFace | undefined,
  };

  private animationFrame = 0;
  private resizeObserver?: ResizeObserver;
  private renderedWidth = 0;
  private renderedHeight = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly faces: ObsidianCubeFace[],
    private readonly onFaceSelected: (face: ObsidianCubeFace) => void,
  ) {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      powerPreference: 'high-performance',
    });

    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setClearColor(new Color('#050506'), 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }

  init(): void {
    this.configureScene();
    this.bindPointerEvents();
    this.observeResize();
    this.resize();
    this.animate();
  }

  destroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = 0;
    }

    this.resizeObserver?.disconnect();
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas.removeEventListener('pointermove', this.handlePointerMove);
    this.canvas.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas.removeEventListener('pointercancel', this.handlePointerUp);
    this.canvas.removeEventListener('lostpointercapture', this.handleLostPointerCapture);
    this.disposeScene();
    this.renderer.dispose();
  }

  private configureScene(): void {
    this.scene.fog = new Fog('#120806', 8, 28);

    this.camera.position.set(0, 0.78, 7.45);
    this.camera.lookAt(0, 0.02, 0);

    this.scene.add(new AmbientLight('#ff7a3d', 0.12));

    const keyLight = new DirectionalLight('#ff9a5f', 0.66);
    keyLight.position.set(-4.2, 2.2, -3.4);
    this.scene.add(keyLight);

    const platformLight = new PointLight('#e44822', 7.8, 5.5);
    platformLight.position.set(0, -1.32, 0.9);
    this.scene.add(platformLight);

    const faceLight = new PointLight('#ffe2c8', 1.35, 4.2);
    faceLight.position.set(1.6, 0.6, 2.4);
    this.scene.add(faceLight);

    const rimLight = new PointLight('#ff7a3d', 1.12, 4.2);
    rimLight.position.set(-1.6, 0.6, 2.4);
    this.scene.add(rimLight);

    this.createCube();
    this.createPlatform();
    this.createStars();
    this.createBeam();
  }

  private createCube(): void {
    this.cubeRig.quaternion.copy(this.targetQuaternion);
    this.cubeRig.position.set(0, 0.34, 0);
    this.scene.add(this.cubeRig);

    const bodyGeometry = new BoxGeometry(2.18, 2.18, 2.18, 1, 1, 1);
    const bodyMaterial = new MeshPhysicalMaterial({
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      color: new Color('#080403'),
      emissive: new Color('#1a0704'),
      emissiveIntensity: 0.12,
      envMapIntensity: 0.95,
      ior: 1.6,
      metalness: 0.92,
      reflectivity: 1,
      roughness: 0.13,
      thickness: 0.32,
      transmission: 0.02,
    });
    this.cubeRig.add(new Mesh(bodyGeometry, bodyMaterial));

    const edgeMaterial = new LineBasicMaterial({
      blending: AdditiveBlending,
      color: '#ffd0a8',
      opacity: 0.28,
      transparent: true,
    });
    this.cubeRig.add(new LineSegments(new EdgesGeometry(bodyGeometry), edgeMaterial));

    const faceGeometry = new PlaneGeometry(2, 2);
    const facePanels = [
      { position: [0, 0, 1.118] as const, rotation: [0, 0, 0] as const },
      { position: [1.118, 0, 0] as const, rotation: [0, Math.PI / 2, 0] as const },
      { position: [0, 1.118, 0] as const, rotation: [-Math.PI / 2, 0, 0] as const },
      { position: [0, 0, -1.118] as const, rotation: [0, Math.PI, 0] as const },
      { position: [-1.118, 0, 0] as const, rotation: [0, -Math.PI / 2, 0] as const },
      { position: [0, -1.118, 0] as const, rotation: [Math.PI / 2, 0, 0] as const },
    ];

    facePanels.forEach((panel, index) => {
      const face = this.faces[index];
      const texture = createFaceTexture(face);
      const material = new MeshBasicMaterial({
        depthWrite: false,
        map: texture,
        opacity: 0.93,
        side: DoubleSide,
        toneMapped: false,
        transparent: true,
      });
      const mesh = new Mesh(faceGeometry, material);
      mesh.position.set(panel.position[0], panel.position[1], panel.position[2]);
      mesh.rotation.set(panel.rotation[0], panel.rotation[1], panel.rotation[2]);
      mesh.userData['face'] = face;
      this.faceMeshes.push(mesh);
      this.cubeRig.add(mesh);
    });

    this.createGlints();
  }

  private createGlints(): void {
    const shineTexture = createShineTexture();
    const glints = [
      { position: [0.9, 0.86, 1.13] as const, rotation: [0.12, 0.18, 0.22] as const, scale: 0.18, delay: 0 },
      { position: [1.13, 0.05, 0.72] as const, rotation: [0.08, 1.58, -0.12] as const, scale: 0.22, delay: 1.2 },
      { position: [-0.72, -0.36, 1.13] as const, rotation: [0.1, -0.05, 0.62] as const, scale: 0.16, delay: 2.1 },
      { position: [0.2, 1.13, 0.28] as const, rotation: [-1.48, 0, 0.72] as const, scale: 0.2, delay: 3 },
      { position: [-1.13, 0.48, -0.24] as const, rotation: [0.06, -1.52, 0.4] as const, scale: 0.14, delay: 4 },
    ];

    glints.forEach((glint) => {
      const mesh = new Mesh(
        new PlaneGeometry(1, 1),
        new MeshBasicMaterial({
          blending: AdditiveBlending,
          depthWrite: false,
          map: shineTexture,
          opacity: 0.3,
          toneMapped: false,
          transparent: true,
        }),
      );
      mesh.position.set(glint.position[0], glint.position[1], glint.position[2]);
      mesh.rotation.set(glint.rotation[0], glint.rotation[1], glint.rotation[2]);
      mesh.scale.setScalar(glint.scale);
      this.glints.push({ mesh, baseScale: glint.scale, delay: glint.delay });
      this.cubeRig.add(mesh);
    });
  }

  private createPlatform(): void {
    const platform = new Group();
    platform.position.set(0, -0.16, 0);
    this.scene.add(platform);

    platform.add(
      new Mesh(
        new CircleGeometry(2.72, 180),
        new MeshStandardMaterial({
          color: '#090504',
          metalness: 0.86,
          opacity: 0.42,
          roughness: 0.22,
          transparent: true,
        }),
      ),
    );
    platform.children[0].rotation.x = -Math.PI / 2;
    platform.children[0].position.y = -1.455;

    const glow = new Mesh(
      new PlaneGeometry(2.2, 2.2),
      new MeshBasicMaterial({
        blending: AdditiveBlending,
        depthWrite: false,
        map: createGlowTexture('rgba(255, 184, 122, 0.82)', 'rgba(228, 72, 34, 0.32)'),
        opacity: 0.85,
        toneMapped: false,
        transparent: true,
      }),
    );
    glow.position.y = -1.42;
    glow.rotation.x = -Math.PI / 2;
    platform.add(glow);

    [
      { inner: 0.96, outer: 0.978, opacity: 0.85, color: '#fff8f1' },
      { inner: 1.18, outer: 1.196, opacity: 0.58, color: '#ffb47a' },
      { inner: 1.52, outer: 1.534, opacity: 0.42, color: '#ff7a3d' },
      { inner: 1.92, outer: 1.93, opacity: 0.32, color: '#e44822' },
      { inner: 2.34, outer: 2.346, opacity: 0.16, color: '#ffd0a8' },
    ].forEach((ring, index) => {
      const mesh = new Mesh(
        new RingGeometry(ring.inner, ring.outer, 220),
        new MeshBasicMaterial({
          blending: AdditiveBlending,
          color: ring.color,
          depthWrite: false,
          opacity: ring.opacity,
          toneMapped: false,
          transparent: true,
        }),
      );
      mesh.position.y = -1.412 + index * 0.002;
      mesh.rotation.x = -Math.PI / 2;
      platform.add(mesh);
    });

    platform.add(createPlatformTicks(2.08, 84, false));
    platform.add(createPlatformTicks(2.5, 120, true));
  }

  private createStars(): void {
    const geometry = new BufferGeometry();
    const positions: number[] = [];

    for (let index = 0; index < 110; index += 1) {
      const x = (seededNoise(index * 7.1) - 0.5) * 16;
      const y = (seededNoise(index * 9.7) - 0.5) * 8 + 1.2;
      const z = -4 - seededNoise(index * 13.3) * 12;
      positions.push(x, y, z);
    }

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

    this.scene.add(
      new Points(
        geometry,
        new PointsMaterial({
          blending: AdditiveBlending,
          color: '#ffd6b8',
          opacity: 0.42,
          size: 0.018,
          transparent: true,
        }),
      ),
    );
  }

  private createBeam(): void {
    const beam = new Mesh(
      new PlaneGeometry(0.9, 5),
      new MeshBasicMaterial({
        blending: AdditiveBlending,
        depthWrite: false,
        map: createBeamTexture(),
        opacity: 0.18,
        toneMapped: false,
        transparent: true,
      }),
    );
    beam.position.set(0, 4.6, -0.4);
    this.scene.add(beam);
  }

  private bindPointerEvents(): void {
    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    this.canvas.addEventListener('pointermove', this.handlePointerMove);
    this.canvas.addEventListener('pointerup', this.handlePointerUp);
    this.canvas.addEventListener('pointercancel', this.handlePointerUp);
    this.canvas.addEventListener('lostpointercapture', this.handleLostPointerCapture);
  }

  private observeResize(): void {
    const resizeTarget = this.canvas.parentElement ?? this.canvas;

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    this.resizeObserver.observe(resizeTarget);
  }

  private resize(): void {
    const host = this.canvas.parentElement ?? this.canvas;
    const rect = host.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));

    if (width === this.renderedWidth && height === this.renderedHeight) {
      return;
    }

    this.renderedWidth = width;
    this.renderedHeight = height;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private animate = (): void => {
    this.animationFrame = requestAnimationFrame(this.animate);
    this.resize();

    const elapsed = performance.now() * 0.001;
    const drag = this.dragState;

    this.cubeRig.position.y = 0.34 + Math.sin(elapsed * 0.72) * 0.035;

    let slerpFactor = 0.12;

    if (drag.active) {
      slerpFactor = 0.35;
    } else if (drag.spinAngle > 0.001) {
      this.dragDelta.setFromAxisAngle(drag.spinAxis, drag.spinAngle);
      this.targetQuaternion.premultiply(this.dragDelta);
      drag.spinAngle *= 0.9;
      drag.freeRest = true;
      slerpFactor = 0.3;
    } else if (drag.freeRest) {
      slerpFactor = 0.16;
    } else {
      this.scratchEuler.set(
        INITIAL_ROTATION.x + Math.sin(elapsed * 0.5) * 0.035,
        INITIAL_ROTATION.y + Math.sin(elapsed * 0.32) * 0.06,
        INITIAL_ROTATION.z + Math.sin(elapsed * 0.24) * 0.025,
      );
      this.scratchQuaternion.setFromEuler(this.scratchEuler);
      this.targetQuaternion.copy(this.scratchQuaternion);
      slerpFactor = 0.09;
    }

    this.cubeRig.quaternion.slerp(this.targetQuaternion, slerpFactor);

    this.glints.forEach((glint) => {
      const material = glint.mesh.material as MeshBasicMaterial;
      const pulse = (Math.sin(elapsed * 0.42 + glint.delay) + 1) * 0.5;
      material.opacity = 0.22 + pulse * 0.16;
      glint.mesh.scale.setScalar(glint.baseScale * (0.94 + pulse * 0.12));
      glint.mesh.rotation.z += 0.0008 + pulse * 0.0005;
    });

    this.renderer.render(this.scene, this.camera);
  };

  private handlePointerDown = (event: PointerEvent): void => {
    if (!event.isPrimary) {
      return;
    }

    const drag = this.dragState;
    drag.active = true;
    drag.freeRest = false;
    drag.pointerId = event.pointerId;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.totalDistance = 0;
    drag.spinAngle = 0;
    drag.clickedFace = this.getFaceAtPointer(event);
    this.targetQuaternion.copy(this.cubeRig.quaternion);
    this.canvas.setPointerCapture?.(event.pointerId);
    this.canvas.classList.add('is-dragging');
    event.preventDefault();
  };

  private handlePointerMove = (event: PointerEvent): void => {
    const drag = this.dragState;

    if (!drag.active || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.lastX;
    const deltaY = event.clientY - drag.lastY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance > 0) {
      this.dragAxis.set(deltaY, deltaX, 0).normalize();
      const angle = distance * DRAG_SENSITIVITY;
      this.dragDelta.setFromAxisAngle(this.dragAxis, angle);
      this.targetQuaternion.premultiply(this.dragDelta);
      drag.spinAxis.copy(this.dragAxis);
      drag.spinAngle = angle;
    }

    drag.totalDistance += distance;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    event.preventDefault();
  };

  private handlePointerUp = (event: PointerEvent): void => {
    const drag = this.dragState;

    if (!drag.active || drag.pointerId !== event.pointerId) {
      return;
    }

    drag.active = false;
    drag.pointerId = -1;
    this.canvas.classList.remove('is-dragging');

    if (this.canvas.hasPointerCapture?.(event.pointerId)) {
      this.canvas.releasePointerCapture(event.pointerId);
    }

    if (drag.totalDistance < 8 && drag.clickedFace) {
      this.onFaceSelected(drag.clickedFace);
    } else {
      drag.freeRest = true;
    }

    drag.clickedFace = undefined;
    drag.totalDistance = 0;
    event.preventDefault();
  };

  private handleLostPointerCapture = (): void => {
    this.dragState.active = false;
    this.canvas.classList.remove('is-dragging');
  };

  private getFaceAtPointer(event: PointerEvent): ObsidianCubeFace | undefined {
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(rect.width, 1);
    const height = Math.max(rect.height, 1);

    this.pointer.x = ((event.clientX - rect.left) / width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const hit = this.raycaster.intersectObjects(this.faceMeshes, false)[0];
    return hit?.object.userData['face'] as ObsidianCubeFace | undefined;
  }

  private disposeScene(): void {
    this.scene.traverse((object) => {
      const mesh = object as Mesh;

      mesh.geometry?.dispose();

      const material = mesh.material as Material | Material[] | undefined;
      const materials = Array.isArray(material) ? material : material ? [material] : [];

      materials.forEach((item) => {
        Object.values(item as unknown as Record<string, unknown>).forEach((value) => {
          if (value instanceof Texture) {
            value.dispose();
          }
        });
        item.dispose();
      });
    });
  }
}

function createFaceTexture(face: ObsidianCubeFace): CanvasTexture {
  const size = 1536;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  const outerInset = 110;
  const innerInset = 200;
  const innerSize = size - innerInset * 2;
  const bracketLen = 90;

  ctx.clearRect(0, 0, size, size);

  const baseShade = ctx.createLinearGradient(0, 0, 0, size);
  baseShade.addColorStop(0, 'rgba(42, 18, 10, 0.34)');
  baseShade.addColorStop(0.48, 'rgba(18, 8, 6, 0.14)');
  baseShade.addColorStop(1, 'rgba(5, 3, 3, 0.32)');
  ctx.fillStyle = baseShade;
  ctx.fillRect(0, 0, size, size);

  const radialGlow = ctx.createRadialGradient(size * 0.5, size * 0.4, 0, size * 0.5, size * 0.5, size * 0.48);
  radialGlow.addColorStop(0, hexToRgba(face.accent, 0.26));
  radialGlow.addColorStop(0.5, hexToRgba(face.accent, 0.08));
  radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(outerInset, outerInset + bracketLen);
  ctx.lineTo(outerInset, outerInset);
  ctx.lineTo(outerInset + bracketLen, outerInset);
  ctx.moveTo(size - outerInset - bracketLen, outerInset);
  ctx.lineTo(size - outerInset, outerInset);
  ctx.lineTo(size - outerInset, outerInset + bracketLen);
  ctx.moveTo(outerInset, size - outerInset - bracketLen);
  ctx.lineTo(outerInset, size - outerInset);
  ctx.lineTo(outerInset + bracketLen, size - outerInset);
  ctx.moveTo(size - outerInset - bracketLen, size - outerInset);
  ctx.lineTo(size - outerInset, size - outerInset);
  ctx.lineTo(size - outerInset, size - outerInset - bracketLen);
  ctx.strokeStyle = 'rgba(255, 210, 168, 0.34)';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  const innerShadow = ctx.createLinearGradient(0, innerInset, 0, size - innerInset);
  innerShadow.addColorStop(0, 'rgba(7, 2, 0, 0.38)');
  innerShadow.addColorStop(0.22, 'rgba(7, 2, 0, 0.1)');
  innerShadow.addColorStop(0.62, 'rgba(7, 2, 0, 0)');
  innerShadow.addColorStop(1, 'rgba(7, 2, 0, 0.26)');
  ctx.fillStyle = innerShadow;
  ctx.fillRect(innerInset, innerInset, innerSize, innerSize);

  ctx.strokeStyle = 'rgba(10, 3, 1, 0.68)';
  ctx.lineWidth = 3;
  ctx.strokeRect(innerInset, innerInset, innerSize, innerSize);
  ctx.strokeStyle = 'rgba(255, 216, 184, 0.42)';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(innerInset - 2, innerInset - 2, innerSize + 4, innerSize + 4);

  const topBevel = ctx.createLinearGradient(0, innerInset, 0, innerInset + 18);
  topBevel.addColorStop(0, 'rgba(255, 230, 206, 0.28)');
  topBevel.addColorStop(1, 'rgba(255, 230, 206, 0)');
  ctx.fillStyle = topBevel;
  ctx.fillRect(innerInset, innerInset, innerSize, 18);

  drawFaceGlyph(ctx, face, size * 0.5, size * 0.38, 150);

  const typography = getFaceLabelTypography(face.title);

  ctx.fillStyle = 'rgba(255, 248, 241, 0.98)';
  ctx.font = `300 ${typography.fontSize}px "Inter", "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowBlur = 28;
  ctx.shadowColor = face.accent;
  drawLetterSpacedText(ctx, face.title.toUpperCase(), size * 0.5, size * 0.6, typography.letterSpacing);

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255, 214, 184, 0.78)';
  ctx.font = '300 58px "Inter", "Helvetica Neue", Arial, sans-serif';
  drawLetterSpacedText(ctx, face.eyebrow.toUpperCase(), size * 0.5, size * 0.69, 20);

  ctx.fillStyle = hexToRgba(face.accent, 0.74);
  const dotY = size * 0.78;
  const dotRadius = 8;
  const dotGap = 40;

  for (let index = -1; index <= 1; index += 1) {
    ctx.beginPath();
    ctx.arc(size * 0.5 + index * dotGap, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  return texture;
}

function drawFaceGlyph(
  ctx: CanvasRenderingContext2D,
  face: ObsidianCubeFace,
  x: number,
  y: number,
  size: number,
): void {
  const k = size / 90;

  ctx.save();
  ctx.translate(x, y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(2.5, size * 0.035);

  ctx.save();
  ctx.rotate(Math.PI / 4);
  ctx.shadowBlur = size * 0.1;
  ctx.shadowColor = face.accent;
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = 'rgba(255, 239, 224, 0.82)';
  ctx.strokeRect(-74 * k, -74 * k, 148 * k, 148 * k);
  ctx.globalAlpha = 0.72;
  ctx.strokeStyle = face.accent;
  ctx.strokeRect(-44 * k, -44 * k, 88 * k, 88 * k);
  ctx.restore();

  ctx.strokeStyle = face.accent;
  ctx.fillStyle = face.accent;
  ctx.shadowBlur = size * 0.16;
  ctx.shadowColor = face.accent;
  ctx.globalAlpha = 0.88;

  switch (face.id) {
    case 'home':
      ctx.beginPath();
      ctx.moveTo(-94 * k, 0);
      ctx.lineTo(94 * k, 0);
      ctx.moveTo(0, -94 * k);
      ctx.lineTo(0, 94 * k);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 10 * k, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'profile':
      ctx.beginPath();
      ctx.arc(0, -30 * k, 24 * k, 0, Math.PI * 2);
      ctx.moveTo(-54 * k, 58 * k);
      ctx.quadraticCurveTo(0, 8 * k, 54 * k, 58 * k);
      ctx.stroke();
      break;
    case 'stack':
      ctx.strokeRect(-58 * k, -44 * k, 116 * k, 78 * k);
      ctx.strokeRect(-36 * k, -22 * k, 116 * k, 78 * k);
      ctx.beginPath();
      ctx.moveTo(-28 * k, -12 * k);
      ctx.lineTo(30 * k, -12 * k);
      ctx.moveTo(-28 * k, 16 * k);
      ctx.lineTo(16 * k, 16 * k);
      ctx.stroke();
      break;
    case 'experience':
      ctx.beginPath();
      ctx.moveTo(-54 * k, -48 * k);
      ctx.lineTo(54 * k, -48 * k);
      ctx.lineTo(42 * k, 18 * k);
      ctx.quadraticCurveTo(0, 52 * k, -42 * k, 18 * k);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 52 * k);
      ctx.lineTo(0, 72 * k);
      ctx.moveTo(-28 * k, 72 * k);
      ctx.lineTo(28 * k, 72 * k);
      ctx.stroke();
      break;
    case 'projects':
      ctx.beginPath();
      ctx.moveTo(-60 * k, -38 * k);
      ctx.lineTo(-12 * k, -38 * k);
      ctx.lineTo(4 * k, -18 * k);
      ctx.lineTo(60 * k, -18 * k);
      ctx.lineTo(60 * k, 46 * k);
      ctx.lineTo(-60 * k, 46 * k);
      ctx.closePath();
      ctx.stroke();
      break;
    case 'contact':
      ctx.strokeRect(-60 * k, -38 * k, 120 * k, 76 * k);
      ctx.beginPath();
      ctx.moveTo(-58 * k, -34 * k);
      ctx.lineTo(0, 12 * k);
      ctx.lineTo(58 * k, -34 * k);
      ctx.stroke();
      break;
  }

  ctx.restore();
}

function createShineTexture(): CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  const gradient = ctx.createRadialGradient(size * 0.5, size * 0.5, 0, size * 0.5, size * 0.5, size * 0.5);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.12, 'rgba(255,226,200,0.95)');
  gradient.addColorStop(0.3, 'rgba(255,122,61,0.38)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.translate(size * 0.5, size * 0.5);
  ctx.strokeStyle = 'rgba(255,230,210,0.92)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-86, 0);
  ctx.lineTo(86, 0);
  ctx.moveTo(0, -86);
  ctx.lineTo(0, 86);
  ctx.stroke();
  ctx.restore();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createGlowTexture(inner: string, outer: string): CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.4, outer);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  return texture;
}

function createBeamTexture(): CanvasTexture {
  const width = 256;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, 'rgba(255,255,255,0)');
  gradient.addColorStop(0.5, 'rgba(255,206,164,0.46)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const verticalFade = ctx.createLinearGradient(0, 0, 0, height);
  verticalFade.addColorStop(0, 'rgba(0,0,0,0)');
  verticalFade.addColorStop(0.55, 'rgba(0,0,0,0.4)');
  verticalFade.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = verticalFade;
  ctx.fillRect(0, 0, width, height);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  return texture;
}

function createPlatformTicks(radius: number, count: number, faint: boolean): Group {
  const group = new Group();
  group.rotation.x = -Math.PI / 2;
  group.position.y = -1.41;

  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2;
    const isMajor = index % 6 === 0;
    const length = (isMajor ? 0.085 : 0.04) * (faint ? 0.7 : 1);
    const opacity = (isMajor ? 0.55 : 0.22) * (faint ? 0.5 : 1);

    const mesh = new Mesh(
      new PlaneGeometry(length, 0.0085),
      new MeshBasicMaterial({
        blending: AdditiveBlending,
        color: isMajor ? '#fff0df' : '#ff9a5f',
        depthWrite: false,
        opacity,
        toneMapped: false,
        transparent: true,
      }),
    );

    mesh.rotation.z = angle;
    mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    group.add(mesh);
  }

  return group;
}

function getFaceLabelTypography(label: string): { fontSize: number; letterSpacing: number } {
  const length = Array.from(label).length;

  if (length >= 12) {
    return { fontSize: 80, letterSpacing: 8 };
  }

  if (length >= 10) {
    return { fontSize: 88, letterSpacing: 12 };
  }

  if (length >= 8) {
    return { fontSize: 104, letterSpacing: 18 };
  }

  return { fontSize: 116, letterSpacing: 26 };
}

function drawLetterSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacing: number,
): void {
  const characters = Array.from(text);
  const totalWidth =
    characters.reduce((width, character) => width + ctx.measureText(character).width, 0) +
    Math.max(0, characters.length - 1) * letterSpacing;
  let cursor = x - totalWidth / 2;

  characters.forEach((character) => {
    const metrics = ctx.measureText(character);
    ctx.fillText(character, cursor + metrics.width / 2, y);
    cursor += metrics.width + letterSpacing;
  });
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function seededNoise(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}
