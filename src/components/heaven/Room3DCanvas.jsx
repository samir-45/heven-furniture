import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Rotate3d,
  Camera,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  ChevronDown,
} from "lucide-react";
import { useLang } from "./LanguageProvider";

/**
 * Procedural Luxury Flooring Texture Generator
 * Supports: Teak Parquet, Walnut Herringbone, White Oak, and Travertine Stone
 */
function createFloorTexture(type = "teak_parquet") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (type === "walnut_herringbone") {
    // Rich dark espresso walnut herringbone
    ctx.fillStyle = "#362114";
    ctx.fillRect(0, 0, 512, 512);

    const step = 64;
    for (let y = -step; y < 512 + step; y += step) {
      for (let x = -step; x < 512 + step; x += step) {
        const alt = ((x + y) / step) % 2 === 0;
        const variance = Math.floor((Math.sin(x * 0.15 + y * 0.22) * 0.5 + 0.5) * 20) - 10;
        const r = Math.max(0, Math.min(255, 62 + variance));
        const g = Math.max(0, Math.min(255, 38 + variance));
        const b = Math.max(0, Math.min(255, 24 + variance));

        ctx.save();
        ctx.translate(x + step / 2, y + step / 2);
        ctx.rotate(alt ? Math.PI / 4 : -Math.PI / 4);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(-step / 2 + 1, -step / 4 + 1, step - 2, step / 2 - 2);

        // Subtle woodgrain
        ctx.fillStyle = "rgba(20, 10, 5, 0.2)";
        ctx.fillRect(-step / 2 + 2, 0, step - 4, 1);
        ctx.restore();
      }
    }
  } else if (type === "white_oak") {
    // Pale Scandinavian / Japandi White Oak
    ctx.fillStyle = "#D6CBB9";
    ctx.fillRect(0, 0, 512, 512);

    const plankH = 40;
    for (let y = 0; y < 512; y += plankH) {
      const v = Math.floor((Math.sin(y * 0.24) * 0.5 + 0.5) * 16) - 8;
      ctx.fillStyle = `rgb(${216 + v},${205 + v},${187 + v})`;
      ctx.fillRect(0, y + 1, 512, plankH - 2);

      // Fine grain striations
      ctx.fillStyle = "rgba(110, 95, 75, 0.08)";
      for (let s = 0; s < 3; s++) {
        ctx.fillRect(0, y + s * 12 + 4, 512, 1);
      }
      ctx.strokeStyle = "rgba(130, 115, 95, 0.25)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, y + 0.5, 512, plankH - 1);
    }
  } else if (type === "travertine") {
    // Luxury Travertine Stone Tiles with organic clouding
    ctx.fillStyle = "#ECE7DE";
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 300; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const rw = 25 + Math.random() * 45;
      ctx.fillStyle = `rgba(${195 + Math.random() * 20}, ${185 + Math.random() * 20}, ${170 + Math.random() * 20}, 0.09)`;
      ctx.beginPath();
      ctx.ellipse(rx, ry, rw, rw * 0.45, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    // Large-format tile grid (256x128)
    ctx.strokeStyle = "rgba(150, 140, 125, 0.35)";
    ctx.lineWidth = 1.5;
    for (let y = 0; y <= 512; y += 128) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    for (let x = 0; x <= 512; x += 256) {
      for (let y = 0; y < 512; y += 128) {
        const off = (y / 128) % 2 === 0 ? 0 : 128;
        ctx.beginPath();
        ctx.moveTo(x + off, y);
        ctx.lineTo(x + off, y + 128);
        ctx.stroke();
      }
    }
  } else {
    // Default: Golden Chittagong Teak Parquet
    ctx.fillStyle = "#C8A375";
    ctx.fillRect(0, 0, 512, 512);

    const plankH = 32;
    const plankW = 128;
    for (let y = 0; y < 512; y += plankH) {
      const rowOffset = (Math.floor(y / plankH) % 2) * (plankW / 2);
      for (let x = -plankW; x < 512 + plankW; x += plankW) {
        const px = x + rowOffset;
        const toneVariance = Math.floor((Math.sin(px * 12.3 + y * 7.1) * 0.5 + 0.5) * 20) - 10;
        const r = Math.max(0, Math.min(255, 185 + toneVariance));
        const g = Math.max(0, Math.min(255, 142 + toneVariance));
        const b = Math.max(0, Math.min(255, 96 + toneVariance));

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(px + 1, y + 1, plankW - 2, plankH - 2);

        // Fine woodgrain striations
        ctx.fillStyle = "rgba(90, 55, 25, 0.08)";
        for (let s = 0; s < 4; s++) {
          ctx.fillRect(px + 1, y + s * 8 + 2, plankW - 2, 1);
        }

        // Plank seams
        ctx.strokeStyle = "rgba(45, 25, 10, 0.25)";
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 0.5, y + 0.5, plankW - 1, plankH - 1);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Modern Gallery Artwork Canvas Generator (Back Wall Art)
 */
function createArtTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext("2d");

  // Minimalist ivory linen background
  ctx.fillStyle = "#F7F4ED";
  ctx.fillRect(0, 0, 512, 384);

  // Organic modern shapes
  ctx.fillStyle = "#C9A66B"; // Gold leaf arc
  ctx.beginPath();
  ctx.arc(220, 200, 110, 0, Math.PI * 1.6);
  ctx.fill();

  ctx.fillStyle = "#1E262B"; // Charcoal arch
  ctx.beginPath();
  ctx.arc(310, 180, 85, Math.PI * 0.5, Math.PI * 1.8);
  ctx.fill();

  ctx.fillStyle = "#8C5C38"; // Terracotta circle
  ctx.beginPath();
  ctx.arc(170, 140, 50, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(30, 38, 43, 0.15)";
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, 480, 352);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Ceramic Potted Monstera Plant
 */
function createPottedPlant() {
  const plantGroup = new THREE.Group();

  // Ceramic Pot
  const potGeo = new THREE.CylinderGeometry(0.24, 0.19, 0.48, 24);
  const potMat = new THREE.MeshStandardMaterial({
    color: "#EFECE6",
    roughness: 0.35,
    metalness: 0.05,
  });
  const pot = new THREE.Mesh(potGeo, potMat);
  pot.position.y = 0.24;
  pot.castShadow = true;
  pot.receiveShadow = true;
  plantGroup.add(pot);

  // Pot rim brass band
  const rimGeo = new THREE.CylinderGeometry(0.245, 0.245, 0.04, 24);
  const rimMat = new THREE.MeshStandardMaterial({
    color: "#C9A66B",
    roughness: 0.25,
    metalness: 0.75,
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.position.y = 0.46;
  plantGroup.add(rim);

  // Soil
  const soilGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.02, 24);
  const soilMat = new THREE.MeshStandardMaterial({ color: "#2B1E16", roughness: 0.95 });
  const soil = new THREE.Mesh(soilGeo, soilMat);
  soil.position.y = 0.47;
  plantGroup.add(soil);

  // Foliage: 6 broad Monstera leaves
  const leafMat = new THREE.MeshStandardMaterial({
    color: "#2D5A27",
    roughness: 0.42,
    side: THREE.DoubleSide,
  });
  const leafAngles = [0, 1.05, 2.1, 3.14, 4.2, 5.25];
  leafAngles.forEach((ang, idx) => {
    const leafGroup = new THREE.Group();
    leafGroup.rotation.y = ang;
    leafGroup.position.set(0, 0.47, 0);

    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.01, 0.015, 0.5 + idx * 0.05, 8);
    const stem = new THREE.Mesh(stemGeo, leafMat);
    stem.rotation.z = -0.35;
    stem.position.set(0.12, 0.22, 0);
    leafGroup.add(stem);

    // Leaf Blade
    const bladeGeo = new THREE.PlaneGeometry(0.26, 0.38);
    const blade = new THREE.Mesh(bladeGeo, leafMat);
    blade.position.set(0.24, 0.44, 0);
    blade.rotation.y = 0.4;
    blade.rotation.z = -0.4;
    blade.castShadow = true;
    leafGroup.add(blade);

    plantGroup.add(leafGroup);
  });

  return plantGroup;
}

export default function Room3DCanvas({
  roomWidth = 6.0,
  roomLength = 4.5,
  placedItems = [],
  selectedItemId = null,
  catalog = [],
  onSelectItem,
}) {
  const { t, lang } = useLang();
  const rootRef = useRef(null);
  const mountRef = useRef(null);

  // Viewport Settings
  const [autoRotate, setAutoRotate] = useState(false);
  const [activeCamPreset, setActiveCamPreset] = useState("iso"); // "iso" | "top" | "front" | "eye"
  const [lightingMood, setLightingMood] = useState("day"); // "day" | "evening"
  const [floorFinish, setFloorFinish] = useState("teak_parquet");
  const [isFloorMenuOpen, setIsFloorMenuOpen] = useState(false);
  const [isSnapshotting, setIsSnapshotting] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Three.js References
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const roomGroupRef = useRef(null);
  const furnitureGroupRef = useRef(null);
  const sunLightRef = useRef(null);
  const ambientLightRef = useRef(null);
  const pendantLightRef = useRef(null);
  const bulbMeshRef = useRef(null);
  const backWallRef = useRef(null);
  const leftWallRef = useRef(null);
  const skyPaneRef = useRef(null);
  const floorMeshRef = useRef(null);

  // Art texture memo
  const artTextureRef = useRef(null);
  if (!artTextureRef.current) {
    artTextureRef.current = createArtTexture();
  }

  // 1. Initialize Scene & WebGL Renderer
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F3EEE5");
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Keep above floor
    controls.minDistance = 2.5;
    controls.maxDistance = 26;
    controlsRef.current = controls;

    // Room Groups
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);
    roomGroupRef.current = roomGroup;

    const furnitureGroup = new THREE.Group();
    scene.add(furnitureGroup);
    furnitureGroupRef.current = furnitureGroup;

    // Lights
    const ambientLight = new THREE.AmbientLight("#FAF5EC", 1.45);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Directional Sunlight (shining through the left architectural window)
    const sunLight = new THREE.DirectionalLight("#FFF2DC", 2.4);
    sunLight.position.set(-8, 8, -4);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0003;
    sunLight.shadow.radius = 2.2;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 32;
    sunLight.shadow.camera.left = -9;
    sunLight.shadow.camera.right = 9;
    sunLight.shadow.camera.top = 9;
    sunLight.shadow.camera.bottom = -9;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Soft Studio Fill
    const fillLight = new THREE.DirectionalLight("#E6DDCE", 1.1);
    fillLight.position.set(7, 5, 6);
    scene.add(fillLight);

    // Warm Gold Specular Rim
    const rimLight = new THREE.DirectionalLight("#C9A66B", 0.55);
    rimLight.position.set(0, 6, 7);
    scene.add(rimLight);

    // Center Ceiling Pendant Light
    const pendantLight = new THREE.PointLight("#FFAE42", 0.8, 9, 1.2);
    pendantLight.position.set(0, 2.1, 0);
    pendantLight.castShadow = true;
    pendantLight.shadow.bias = -0.002;
    scene.add(pendantLight);
    pendantLightRef.current = pendantLight;

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Fullscreen change listener
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 1.0;
    }
  }, [autoRotate]);

  // Set Camera Preset Position
  const setCameraPreset = useCallback(
    (preset) => {
      if (!cameraRef.current || !controlsRef.current) return;
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      const maxDim = Math.max(roomWidth, roomLength);

      controls.target.set(0, 0.45, 0);

      if (preset === "iso") {
        camera.position.set(roomWidth * 0.95, maxDim * 0.9, roomLength * 1.05);
      } else if (preset === "top") {
        camera.position.set(0.01, maxDim * 1.5, 0.01);
      } else if (preset === "front") {
        camera.position.set(0, maxDim * 0.75, roomLength * 1.25);
      } else if (preset === "eye") {
        camera.position.set(-roomWidth * 0.38, 1.4, roomLength * 0.42);
        controls.target.set(0, 0.75, 0);
      }
      controls.update();
      setActiveCamPreset(preset);
    },
    [roomWidth, roomLength]
  );

  // Initial Camera placement
  useEffect(() => {
    setCameraPreset("iso");
  }, [setCameraPreset]);

  // Sync Lighting Mood: "day" vs "evening"
  useEffect(() => {
    const scene = sceneRef.current;
    const sun = sunLightRef.current;
    const ambient = ambientLightRef.current;
    const pendant = pendantLightRef.current;
    const bulb = bulbMeshRef.current;
    const backW = backWallRef.current;
    const leftW = leftWallRef.current;
    const sky = skyPaneRef.current;

    if (!scene || !sun || !ambient) return;

    if (lightingMood === "evening") {
      scene.background = new THREE.Color("#121519");
      ambient.color.set("#282C34");
      ambient.intensity = 0.7;

      sun.color.set("#7D98B8"); // Cool moon/twilight
      sun.intensity = 0.65;

      if (pendant) {
        pendant.color.set("#FFA638");
        pendant.intensity = 3.2; // Glowing warm chandelier
      }
      if (bulb) {
        bulb.material.color.set("#FFA638");
      }
      if (backW && leftW) {
        backW.material.color.set("#282C33");
        leftW.material.color.set("#282C33");
      }
      if (sky) {
        sky.material.color.set("#0D131D");
      }
    } else {
      scene.background = new THREE.Color("#F3EEE5");
      ambient.color.set("#FAF5EC");
      ambient.intensity = 1.45;

      sun.color.set("#FFF2DC"); // Warm bright sunlight
      sun.intensity = 2.4;

      if (pendant) {
        pendant.color.set("#FFAE42");
        pendant.intensity = 0.8;
      }
      if (bulb) {
        bulb.material.color.set("#FFF3D6");
      }
      if (backW && leftW) {
        backW.material.color.set("#FAF8F2");
        leftW.material.color.set("#FAF8F2");
      }
      if (sky) {
        sky.material.color.set("#D2E6F5");
      }
    }
  }, [lightingMood]);

  // 2. Build Architectural Room (Floor, Panoramic Window, Art Canvas, Plant & Pendant)
  useEffect(() => {
    const roomGroup = roomGroupRef.current;
    if (!roomGroup) return;

    // Clear old room geometry
    while (roomGroup.children.length > 0) {
      const obj = roomGroup.children[0];
      if (obj.geometry) obj.geometry.dispose();
      roomGroup.remove(obj);
    }

    const rw = Math.max(3, roomWidth);
    const rl = Math.max(3, roomLength);
    const wallH = 2.7;
    const wallThick = 0.16;

    // Hardwood / Stone Floor
    const floorGeo = new THREE.PlaneGeometry(rw, rl);
    const floorTex = createFloorTexture(floorFinish);
    floorTex.repeat.set(rw * 0.9, rl * 0.9);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: floorFinish === "travertine" ? 0.28 : 0.38,
      metalness: 0.05,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    roomGroup.add(floorMesh);
    floorMeshRef.current = floorMesh;

    // Base Sub-Plinth (architectural concrete slab)
    const slabGeo = new THREE.BoxGeometry(rw + 0.12, 0.15, rl + 0.12);
    const slabMat = new THREE.MeshStandardMaterial({ color: "#D2C9BB", roughness: 0.85 });
    const slabMesh = new THREE.Mesh(slabGeo, slabMat);
    slabMesh.position.y = -0.075;
    slabMesh.receiveShadow = true;
    roomGroup.add(slabMesh);

    // Wall Material
    const wallColor = lightingMood === "evening" ? "#282C33" : "#FAF8F2";
    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.88,
    });

    // Back Wall (-Z)
    const backWallGeo = new THREE.BoxGeometry(rw, wallH, wallThick);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, wallH / 2, -rl / 2 - wallThick / 2);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);
    backWallRef.current = backWall;

    // Framed Abstract Art Canvas on Back Wall
    const artW = Math.min(2.0, rw * 0.4);
    const artH = 1.35;
    const artGeo = new THREE.PlaneGeometry(artW, artH);
    const artMat = new THREE.MeshStandardMaterial({
      map: artTextureRef.current,
      roughness: 0.6,
    });
    const artMesh = new THREE.Mesh(artGeo, artMat);
    artMesh.position.set(0, 1.55, -rl / 2 + 0.01);
    roomGroup.add(artMesh);

    // Brass Art Frame
    const frameThick = 0.04;
    const frameGeo = new THREE.BoxGeometry(artW + 0.08, artH + 0.08, frameThick);
    const brassFrameMat = new THREE.MeshStandardMaterial({
      color: "#C9A66B",
      roughness: 0.25,
      metalness: 0.75,
    });
    const artFrame = new THREE.Mesh(frameGeo, brassFrameMat);
    artFrame.position.set(0, 1.55, -rl / 2 - frameThick / 2 + 0.01);
    roomGroup.add(artFrame);

    // Left Wall (-X) with Panoramic Window Opening
    const leftWallGeo = new THREE.BoxGeometry(wallThick, wallH, rl + wallThick);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-rw / 2 - wallThick / 2, wallH / 2, 0);
    leftWall.receiveShadow = true;
    roomGroup.add(leftWall);
    leftWallRef.current = leftWall;

    // Recessed Floor-to-Ceiling Architectural Window Frame on Left Wall
    const winW = Math.min(2.4, rl * 0.6);
    const winH = 2.3;
    const winD = 0.06;

    // Black Metal Window Frame
    const winFrameGeo = new THREE.BoxGeometry(winD, winH, winW);
    const blackMetalMat = new THREE.MeshStandardMaterial({
      color: "#1E2226",
      roughness: 0.4,
      metalness: 0.6,
    });
    const winFrame = new THREE.Mesh(winFrameGeo, blackMetalMat);
    winFrame.position.set(-rw / 2 + 0.02, winH / 2 + 0.15, 0);
    roomGroup.add(winFrame);

    // Window Glass Pane with specular reflection
    const glassGeo = new THREE.PlaneGeometry(winW - 0.08, winH - 0.08);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: "#E2F0FB",
      transparent: true,
      opacity: 0.28,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.85,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.rotation.y = Math.PI / 2;
    glass.position.set(-rw / 2 + 0.025, winH / 2 + 0.15, 0);
    roomGroup.add(glass);

    // Exterior Ambient Sky Backing (visible through window)
    const skyGeo = new THREE.PlaneGeometry(winW * 1.5, winH * 1.3);
    const skyMat = new THREE.MeshBasicMaterial({
      color: lightingMood === "evening" ? "#0D131D" : "#D2E6F5",
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    sky.rotation.y = Math.PI / 2;
    sky.position.set(-rw / 2 - 0.25, winH / 2 + 0.15, 0);
    roomGroup.add(sky);
    skyPaneRef.current = sky;

    // Architectural Skirting Boards with Dark Timber & Shadow Gap
    const skirtH = 0.14;
    const skirtD = 0.03;
    const skirtMat = new THREE.MeshStandardMaterial({ color: "#4A2F1D", roughness: 0.45 });

    const backSkirtGeo = new THREE.BoxGeometry(rw, skirtH, skirtD);
    const backSkirt = new THREE.Mesh(backSkirtGeo, skirtMat);
    backSkirt.position.set(0, skirtH / 2, -rl / 2 + skirtD / 2);
    roomGroup.add(backSkirt);

    const leftSkirtGeo = new THREE.BoxGeometry(skirtD, skirtH, rl);
    const leftSkirt = new THREE.Mesh(leftSkirtGeo, skirtMat);
    leftSkirt.position.set(-rw / 2 + skirtD / 2, skirtH / 2, 0);
    roomGroup.add(leftSkirt);

    // Front & Right Cutaway Low Brass Plinths (0.06m)
    const lowSkirtMat = new THREE.MeshStandardMaterial({
      color: "#C9A66B",
      roughness: 0.35,
      metalness: 0.65,
    });
    const frontBorderGeo = new THREE.BoxGeometry(rw, 0.06, 0.03);
    const frontBorder = new THREE.Mesh(frontBorderGeo, lowSkirtMat);
    frontBorder.position.set(0, 0.03, rl / 2);
    roomGroup.add(frontBorder);

    const rightBorderGeo = new THREE.BoxGeometry(0.03, 0.06, rl);
    const rightBorder = new THREE.Mesh(rightBorderGeo, lowSkirtMat);
    rightBorder.position.set(rw / 2, 0.03, 0);
    roomGroup.add(rightBorder);

    // Architectural Plant in the corner
    const plant = createPottedPlant();
    plant.position.set(-rw / 2 + 0.42, 0, rl / 2 - 0.45);
    roomGroup.add(plant);

    // Central Brass Pendant Lamp Chandelier
    const pendant = new THREE.Group();
    pendant.position.set(0, 0, 0);

    const cordH = 0.7;
    const cordGeo = new THREE.CylinderGeometry(0.006, 0.006, cordH, 8);
    const cordMat = new THREE.MeshBasicMaterial({ color: "#1A1A1A" });
    const cord = new THREE.Mesh(cordGeo, cordMat);
    cord.position.y = wallH - cordH / 2;
    pendant.add(cord);

    const shadeGeo = new THREE.ConeGeometry(0.3, 0.22, 24, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({
      color: "#C9A66B",
      roughness: 0.22,
      metalness: 0.8,
      side: THREE.DoubleSide,
    });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.y = wallH - cordH;
    shade.castShadow = true;
    pendant.add(shade);

    const bulbGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const bulbMat = new THREE.MeshBasicMaterial({
      color: lightingMood === "evening" ? "#FFA638" : "#FFF3D6",
    });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.y = wallH - cordH - 0.03;
    pendant.add(bulb);
    bulbMeshRef.current = bulb;

    roomGroup.add(pendant);

    // Ground Ambient Shadow Receiver Plane
    const groundGeo = new THREE.PlaneGeometry(40, 40);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.2 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.16;
    ground.receiveShadow = true;
    roomGroup.add(ground);
  }, [roomWidth, roomLength, floorFinish, lightingMood]);

  // 3. Build Parametric 3D Furniture Meshes with Contact Shadows
  useEffect(() => {
    const furnitureGroup = furnitureGroupRef.current;
    if (!furnitureGroup) return;

    // Clear old furniture
    while (furnitureGroup.children.length > 0) {
      const obj = furnitureGroup.children[0];
      if (obj.geometry) obj.geometry.dispose();
      furnitureGroup.remove(obj);
    }

    const rw = roomWidth;
    const rl = roomLength;

    // Shared Materials
    const teakWoodMat = new THREE.MeshStandardMaterial({
      color: "#9C6B3C",
      roughness: 0.35,
      metalness: 0.05,
    });
    const walnutWoodMat = new THREE.MeshStandardMaterial({
      color: "#5C3A21",
      roughness: 0.38,
      metalness: 0.05,
    });
    const boucléFabricMat = new THREE.MeshStandardMaterial({
      color: "#EFEBE2",
      roughness: 0.94,
      metalness: 0.0,
    });
    const linenMattressMat = new THREE.MeshStandardMaterial({
      color: "#F7F5F0",
      roughness: 0.86,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: "#C9A66B",
      roughness: 0.22,
      metalness: 0.8,
    });
    const darkLeatherMat = new THREE.MeshStandardMaterial({
      color: "#38251A",
      roughness: 0.32,
      metalness: 0.1,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: "#C8B29E",
      transparent: true,
      opacity: 0.78,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.65,
    });

    placedItems.forEach((item) => {
      const cat = catalog.find((c) => c.id === item.catId);
      if (!cat) return;

      const itemGroup = new THREE.Group();
      itemGroup.userData = { itemId: item.id };

      // Map 2D coordinates to 3D center origin
      const cx = item.x + cat.wM / 2;
      const cy = item.y + cat.dM / 2;
      const posX = cx - rw / 2;
      const posZ = cy - rl / 2;

      itemGroup.position.set(posX, 0, posZ);
      itemGroup.rotation.y = -THREE.MathUtils.degToRad(item.rot);

      const w = cat.wM;
      const d = cat.dM;
      const isSelected = item.id === selectedItemId;
      const woodMat = cat.timber?.includes("Walnut") ? walnutWoodMat : teakWoodMat;

      // Contact Ambient Occlusion Shadow Decal on Floor
      const shadowGeo = new THREE.PlaneGeometry(w * 1.04, d * 1.04);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: "#18120B",
        transparent: true,
        opacity: 0.22,
      });
      const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
      contactShadow.rotation.x = -Math.PI / 2;
      contactShadow.position.y = 0.003;
      itemGroup.add(contactShadow);

      // Model Dispatch
      if (cat.type === "sofa") {
        // Wooden Plinth Base
        const plinthGeo = new THREE.BoxGeometry(w, 0.08, d);
        const plinth = new THREE.Mesh(plinthGeo, woodMat);
        plinth.position.y = 0.04;
        plinth.castShadow = true;
        itemGroup.add(plinth);

        // Seat Cushion
        const seatGeo = new THREE.BoxGeometry(w - 0.24, 0.3, d - 0.15);
        const seat = new THREE.Mesh(seatGeo, boucléFabricMat);
        seat.position.set(0, 0.23, 0.05);
        seat.castShadow = true;
        itemGroup.add(seat);

        // Backrest with piping line
        const backGeo = new THREE.BoxGeometry(w, 0.44, 0.18);
        const back = new THREE.Mesh(backGeo, boucléFabricMat);
        back.position.set(0, 0.45, -d / 2 + 0.1);
        back.castShadow = true;
        itemGroup.add(back);

        // Armrests
        const armW = 0.14;
        const armGeo = new THREE.BoxGeometry(armW, 0.38, d);
        const leftArm = new THREE.Mesh(armGeo, woodMat);
        leftArm.position.set(-w / 2 + armW / 2, 0.27, 0);
        leftArm.castShadow = true;
        itemGroup.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, woodMat);
        rightArm.position.set(w / 2 - armW / 2, 0.27, 0);
        rightArm.castShadow = true;
        itemGroup.add(rightArm);

        // Luxury Accent Throw Pillows
        const pillowMat = new THREE.MeshStandardMaterial({ color: "#C9A66B", roughness: 0.82 });
        const pillowGeo = new THREE.BoxGeometry(0.24, 0.22, 0.1);
        const lp = new THREE.Mesh(pillowGeo, pillowMat);
        lp.position.set(-w / 2 + armW + 0.1, 0.38, -d / 2 + 0.18);
        lp.rotation.y = 0.25;
        lp.castShadow = true;
        itemGroup.add(lp);

        const rp = new THREE.Mesh(pillowGeo, pillowMat);
        rp.position.set(w / 2 - armW - 0.1, 0.38, -d / 2 + 0.18);
        rp.rotation.y = -0.25;
        rp.castShadow = true;
        itemGroup.add(rp);
      } else if (cat.type === "bed") {
        // Bed Frame Base
        const frameH = 0.26;
        const frameGeo = new THREE.BoxGeometry(w, frameH, d);
        const frame = new THREE.Mesh(frameGeo, woodMat);
        frame.position.y = frameH / 2;
        frame.castShadow = true;
        itemGroup.add(frame);

        // Headboard
        const headH = 1.1;
        const headGeo = new THREE.BoxGeometry(w, headH, 0.08);
        const head = new THREE.Mesh(headGeo, woodMat);
        head.position.set(0, headH / 2, -d / 2 + 0.04);
        head.castShadow = true;
        itemGroup.add(head);

        // Cane Inlay Panel on Headboard
        const caneGeo = new THREE.BoxGeometry(w - 0.2, headH - 0.3, 0.02);
        const cane = new THREE.Mesh(caneGeo, brassMat);
        cane.position.set(0, headH / 2 + 0.05, -d / 2 + 0.08);
        itemGroup.add(cane);

        // Mattress
        const matH = 0.28;
        const matGeo = new THREE.BoxGeometry(w - 0.12, matH, d - 0.18);
        const mattress = new THREE.Mesh(matGeo, linenMattressMat);
        mattress.position.set(0, frameH + matH / 2, 0.06);
        mattress.castShadow = true;
        itemGroup.add(mattress);

        // Double Pillows
        const pillowGeo = new THREE.BoxGeometry((w - 0.3) / 2, 0.1, 0.38);
        const p1 = new THREE.Mesh(pillowGeo, boucléFabricMat);
        p1.position.set(-(w - 0.3) / 4 - 0.02, frameH + matH + 0.05, -d / 2 + 0.34);
        p1.castShadow = true;
        itemGroup.add(p1);

        const p2 = new THREE.Mesh(pillowGeo, boucléFabricMat);
        p2.position.set((w - 0.3) / 4 + 0.02, frameH + matH + 0.05, -d / 2 + 0.34);
        p2.castShadow = true;
        itemGroup.add(p2);

        // Folded Duvet Runner Accent
        const runnerGeo = new THREE.BoxGeometry(w - 0.08, 0.04, d * 0.4);
        const runnerMat = new THREE.MeshStandardMaterial({ color: "#D8CEC1", roughness: 0.88 });
        const runner = new THREE.Mesh(runnerGeo, runnerMat);
        runner.position.set(0, frameH + matH + 0.02, d * 0.22);
        runner.castShadow = true;
        itemGroup.add(runner);

        // Floating Wooden Nightstands on Both Sides
        const standW = 0.38;
        const standD = 0.36;
        const standH = 0.2;
        const standGeo = new THREE.BoxGeometry(standW, standH, standD);

        const leftStand = new THREE.Mesh(standGeo, woodMat);
        leftStand.position.set(-w / 2 - standW / 2, 0.26, -d / 2 + standD / 2);
        leftStand.castShadow = true;
        itemGroup.add(leftStand);

        const rightStand = new THREE.Mesh(standGeo, woodMat);
        rightStand.position.set(w / 2 + standW / 2, 0.26, -d / 2 + standD / 2);
        rightStand.castShadow = true;
        itemGroup.add(rightStand);
      } else if (cat.type === "table") {
        // Tabletop (Timber or Smoked Glass for Coffee Table)
        const topH = 0.05;
        const legH = cat.id.includes("coffee") ? 0.38 : 0.72;
        const isCoffee = cat.id.includes("coffee");

        if (isCoffee) {
          // Timber Frame with Inset Smoked Glass Top
          const frameGeo = new THREE.BoxGeometry(w, topH, d);
          const tableFrame = new THREE.Mesh(frameGeo, woodMat);
          tableFrame.position.y = legH + topH / 2;
          tableFrame.castShadow = true;
          itemGroup.add(tableFrame);

          const glassTopGeo = new THREE.BoxGeometry(w - 0.12, 0.015, d - 0.12);
          const glassTop = new THREE.Mesh(glassTopGeo, glassMat);
          glassTop.position.y = legH + topH + 0.01;
          itemGroup.add(glassTop);
        } else {
          // Solid Wood Slab Top
          const topGeo = new THREE.BoxGeometry(w, topH, d);
          const top = new THREE.Mesh(topGeo, woodMat);
          top.position.y = legH + topH / 2;
          top.castShadow = true;
          top.receiveShadow = true;
          itemGroup.add(top);
        }

        // Tapered Brass Legs
        const legGeo = new THREE.CylinderGeometry(0.032, 0.02, legH, 16);
        const legOffsets = [
          [-w / 2 + 0.1, -d / 2 + 0.1],
          [w / 2 - 0.1, -d / 2 + 0.1],
          [-w / 2 + 0.1, d / 2 - 0.1],
          [w / 2 - 0.1, d / 2 - 0.1],
        ];
        legOffsets.forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(legGeo, brassMat);
          leg.position.set(lx, legH / 2, lz);
          leg.castShadow = true;
          itemGroup.add(leg);
        });

        // Dining Chairs around Table (if dining suite)
        if (cat.id.includes("dining")) {
          const chairSeats = [
            [-w * 0.28, -d / 2 - 0.3],
            [w * 0.28, -d / 2 - 0.3],
            [-w * 0.28, d / 2 + 0.3],
            [w * 0.28, d / 2 + 0.3],
          ];
          chairSeats.forEach(([cxPos, czPos]) => {
            const chairGeo = new THREE.BoxGeometry(0.44, 0.44, 0.44);
            const chair = new THREE.Mesh(chairGeo, woodMat);
            chair.position.set(cxPos, 0.22, czPos);
            chair.castShadow = true;
            itemGroup.add(chair);
          });
        }
      } else if (cat.type === "chair") {
        // Lounge Armchair
        const seatGeo = new THREE.BoxGeometry(w, 0.22, d * 0.7);
        const seat = new THREE.Mesh(seatGeo, darkLeatherMat);
        seat.position.set(0, 0.32, 0.05);
        seat.castShadow = true;
        itemGroup.add(seat);

        // Curved Backrest
        const backGeo = new THREE.BoxGeometry(w, 0.48, 0.14);
        const back = new THREE.Mesh(backGeo, darkLeatherMat);
        back.position.set(0, 0.54, -d / 2 + 0.1);
        back.rotation.x = 0.15;
        back.castShadow = true;
        itemGroup.add(back);

        // Tapered Brass-Tipped Legs
        const legGeo = new THREE.CylinderGeometry(0.025, 0.015, 0.35, 12);
        const legOffsets = [
          [-w / 2 + 0.06, -d / 2 + 0.08],
          [w / 2 - 0.06, -d / 2 + 0.08],
          [-w / 2 + 0.06, d / 2 - 0.08],
          [w / 2 - 0.06, d / 2 - 0.08],
        ];
        legOffsets.forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(legGeo, woodMat);
          leg.position.set(lx, 0.175, lz);
          leg.castShadow = true;
          itemGroup.add(leg);
        });
      } else if (cat.type === "desk") {
        // Executive Desk with Leather Blotter
        const deskH = 0.75;
        const deskGeo = new THREE.BoxGeometry(w, 0.05, d);
        const deskTop = new THREE.Mesh(deskGeo, woodMat);
        deskTop.position.y = deskH;
        deskTop.castShadow = true;
        itemGroup.add(deskTop);

        // Leather Writing Blotter
        const blotterGeo = new THREE.BoxGeometry(w * 0.55, 0.008, d * 0.6);
        const blotter = new THREE.Mesh(blotterGeo, darkLeatherMat);
        blotter.position.set(0, deskH + 0.03, 0.05);
        itemGroup.add(blotter);

        // Solid Pedestal Legs
        const pedW = 0.28;
        const pedGeo = new THREE.BoxGeometry(pedW, deskH, d * 0.85);
        const leftPed = new THREE.Mesh(pedGeo, woodMat);
        leftPed.position.set(-w / 2 + pedW / 2 + 0.05, deskH / 2, 0);
        leftPed.castShadow = true;
        itemGroup.add(leftPed);

        const rightPed = new THREE.Mesh(pedGeo, woodMat);
        rightPed.position.set(w / 2 - pedW / 2 - 0.05, deskH / 2, 0);
        rightPed.castShadow = true;
        itemGroup.add(rightPed);
      } else if (cat.type === "cabinet") {
        // Credenza with Brass Pulls
        const cabH = 0.82;
        const cabGeo = new THREE.BoxGeometry(w, cabH, d);
        const cab = new THREE.Mesh(cabGeo, woodMat);
        cab.position.y = cabH / 2;
        cab.castShadow = true;
        cab.receiveShadow = true;
        itemGroup.add(cab);

        // Brass Handles
        const handleGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.16, 12);
        const h1 = new THREE.Mesh(handleGeo, brassMat);
        h1.position.set(-w * 0.15, cabH * 0.55, d / 2 + 0.015);
        itemGroup.add(h1);

        const h2 = new THREE.Mesh(handleGeo, brassMat);
        h2.position.set(w * 0.15, cabH * 0.55, d / 2 + 0.015);
        itemGroup.add(h2);
      } else if (cat.type === "rug") {
        // Luxury Textured Rug
        const rugH = 0.012;
        const rugGeo = new THREE.BoxGeometry(w, rugH, d);
        const rugMat = new THREE.MeshStandardMaterial({
          color: cat.color || "#C9A66B",
          roughness: 0.95,
        });
        const rug = new THREE.Mesh(rugGeo, rugMat);
        rug.position.y = rugH / 2 + 0.002;
        rug.receiveShadow = true;
        itemGroup.add(rug);
      } else {
        // Generic Bespoke Furniture
        const genH = 0.65;
        const genGeo = new THREE.BoxGeometry(w, genH, d);
        const genMesh = new THREE.Mesh(genGeo, woodMat);
        genMesh.position.y = genH / 2;
        genMesh.castShadow = true;
        itemGroup.add(genMesh);
      }

      // Selected Glow Ring & 3D CAD Bounding Wireframe
      if (isSelected) {
        const ringGeo = new THREE.RingGeometry(
          Math.max(w, d) * 0.52,
          Math.max(w, d) * 0.62,
          36
        );
        const ringMat = new THREE.MeshBasicMaterial({
          color: "#C9A66B",
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.012;
        itemGroup.add(ring);

        // Architectural CAD Selection Box
        const boxGeo = new THREE.BoxGeometry(w + 0.08, 0.02, d + 0.08);
        const wireMat = new THREE.MeshBasicMaterial({
          color: "#E2BA78",
          wireframe: true,
        });
        const wireBox = new THREE.Mesh(boxGeo, wireMat);
        wireBox.position.y = 0.015;
        itemGroup.add(wireBox);
      }

      furnitureGroup.add(itemGroup);
    });
  }, [placedItems, selectedItemId, catalog, roomWidth, roomLength]);

  // 4. Raycast Item Selection in 3D
  const handlePointerDown = (e) => {
    if (!onSelectItem || !sceneRef.current || !cameraRef.current) return;
    const container = mountRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const furnitureGroup = furnitureGroupRef.current;
    if (!furnitureGroup) return;

    const intersects = raycaster.intersectObjects(furnitureGroup.children, true);
    if (intersects.length > 0) {
      let curr = intersects[0].object;
      while (curr && curr !== furnitureGroup) {
        if (curr.userData && curr.userData.itemId) {
          onSelectItem(curr.userData.itemId);
          break;
        }
        curr = curr.parent;
      }
    }
  };

  // 5. 1-Click High-Res 3D Snapshot with Camera Flash Animation
  const handleCaptureSnapshot = () => {
    if (!rendererRef.current) return;
    setFlashEffect(true);
    setIsSnapshotting(true);

    setTimeout(() => {
      try {
        const dataUrl = rendererRef.current.domElement.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `Haven-Luxury-Studio-${Date.now().toString().slice(-6)}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Snapshot capture error:", err);
      } finally {
        setTimeout(() => {
          setIsSnapshotting(false);
          setFlashEffect(false);
        }, 300);
      }
    }, 150);
  };

  // 6. Fullscreen Toggle
  const handleToggleFullscreen = () => {
    const container = rootRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  return (
    <div
      ref={rootRef}
      className={`relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#14171A] border-2 border-brass/35 rounded-sm overflow-hidden select-none shadow-2xl transition-all ${
        isFullscreen ? "fixed inset-0 z-50 aspect-auto rounded-none border-0" : ""
      }`}
    >
      {/* 3D WebGL Canvas Mount Container */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* DSLR Shutter Flash Effect */}
      <div
        className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-300 z-30 ${
          flashEffect ? "opacity-85" : "opacity-0"
        }`}
      />

      {/* Top Floating Glassmorphism HUD Bar */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-20">
        {/* Left: Camera Angle Presets */}
        <div className="flex items-center gap-1 bg-depth/85 backdrop-blur-xl p-1 rounded-full border border-bone/15 shadow-xl pointer-events-auto">
          <button
            type="button"
            onClick={() => setCameraPreset("iso")}
            className={`px-3 py-1.5 rounded-full text-[0.65rem] sm:text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
              activeCamPreset === "iso"
                ? "bg-brass text-depth font-bold shadow-md"
                : "text-bone/70 hover:text-bone"
            }`}
          >
            {t("planner.camIso")}
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset("top")}
            className={`px-3 py-1.5 rounded-full text-[0.65rem] sm:text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
              activeCamPreset === "top"
                ? "bg-brass text-depth font-bold shadow-md"
                : "text-bone/70 hover:text-bone"
            }`}
          >
            {t("planner.camTop")}
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset("front")}
            className={`px-3 py-1.5 rounded-full text-[0.65rem] sm:text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
              activeCamPreset === "front"
                ? "bg-brass text-depth font-bold shadow-md"
                : "text-bone/70 hover:text-bone"
            }`}
          >
            {t("planner.camFront")}
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset("eye")}
            className={`px-3 py-1.5 rounded-full text-[0.65rem] sm:text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
              activeCamPreset === "eye"
                ? "bg-brass text-depth font-bold shadow-md"
                : "text-bone/70 hover:text-bone"
            }`}
          >
            {t("planner.camEye")}
          </button>
        </div>

        {/* Right: Studio Atmosphere & Action Tools */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Day / Evening Mood Switcher */}
          <button
            type="button"
            onClick={() => setLightingMood((prev) => (prev === "day" ? "evening" : "day"))}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl border transition-all shadow-xl text-xs font-medium cursor-pointer ${
              lightingMood === "evening"
                ? "bg-brass text-depth border-brass font-bold"
                : "bg-depth/85 text-bone/90 border-bone/15 hover:text-bone"
            }`}
            title="Toggle Daylight / Evening Mood"
          >
            {lightingMood === "evening" ? (
              <>
                <Moon className="h-3.5 w-3.5 fill-current" />
                <span className="hidden sm:inline">{t("planner.moodNight")}</span>
              </>
            ) : (
              <>
                <Sun className="h-3.5 w-3.5 text-brass" />
                <span className="hidden sm:inline">{t("planner.moodDay")}</span>
              </>
            )}
          </button>

          {/* Floor Finish Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFloorMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 bg-depth/85 hover:bg-depth text-bone px-3 py-1.5 rounded-full border border-bone/15 backdrop-blur-xl text-xs font-medium shadow-xl transition-all cursor-pointer"
              title={t("planner.floorFinish")}
            >
              <Layers className="h-3.5 w-3.5 text-brass" />
              <span className="hidden sm:inline">
                {floorFinish === "teak_parquet"
                  ? t("planner.floorTeak")
                  : floorFinish === "walnut_herringbone"
                  ? t("planner.floorWalnut")
                  : floorFinish === "white_oak"
                  ? t("planner.floorOak")
                  : t("planner.floorStone")}
              </span>
              <ChevronDown className="h-3 w-3 text-bone/60" />
            </button>

            {/* Floor Finish Dropdown */}
            {isFloorMenuOpen && (
              <div
                onMouseLeave={() => setIsFloorMenuOpen(false)}
                className="absolute right-0 top-full mt-2 w-44 bg-depth/95 backdrop-blur-2xl border border-bone/20 rounded-md p-1.5 shadow-2xl z-40 space-y-1"
              >
                <div className="px-2 py-1 text-[0.62rem] uppercase tracking-wider text-brass font-mono border-b border-bone/10 font-bold">
                  {t("planner.floorFinish")}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFloorFinish("teak_parquet");
                    setIsFloorMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xs text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    floorFinish === "teak_parquet" ? "bg-brass/20 text-brass font-bold" : "text-bone/80 hover:bg-white/10"
                  }`}
                >
                  <span>{t("planner.floorTeak")}</span>
                  {floorFinish === "teak_parquet" && <span className="h-1.5 w-1.5 rounded-full bg-brass" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFloorFinish("walnut_herringbone");
                    setIsFloorMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xs text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    floorFinish === "walnut_herringbone" ? "bg-brass/20 text-brass font-bold" : "text-bone/80 hover:bg-white/10"
                  }`}
                >
                  <span>{t("planner.floorWalnut")}</span>
                  {floorFinish === "walnut_herringbone" && <span className="h-1.5 w-1.5 rounded-full bg-brass" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFloorFinish("white_oak");
                    setIsFloorMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xs text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    floorFinish === "white_oak" ? "bg-brass/20 text-brass font-bold" : "text-bone/80 hover:bg-white/10"
                  }`}
                >
                  <span>{t("planner.floorOak")}</span>
                  {floorFinish === "white_oak" && <span className="h-1.5 w-1.5 rounded-full bg-brass" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFloorFinish("travertine");
                    setIsFloorMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xs text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    floorFinish === "travertine" ? "bg-brass/20 text-brass font-bold" : "text-bone/80 hover:bg-white/10"
                  }`}
                >
                  <span>{t("planner.floorStone")}</span>
                  {floorFinish === "travertine" && <span className="h-1.5 w-1.5 rounded-full bg-brass" />}
                </button>
              </div>
            )}
          </div>

          {/* Auto-Orbit 360° Button */}
          <button
            type="button"
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`p-2 rounded-full backdrop-blur-xl border transition-all shadow-xl cursor-pointer ${
              autoRotate
                ? "bg-brass text-depth border-brass"
                : "bg-depth/85 text-bone/80 border-bone/15 hover:text-bone"
            }`}
            title={t("planner.autoRotate")}
          >
            <Rotate3d className="h-3.5 w-3.5" />
          </button>

          {/* 3D 4K Photo Snapshot */}
          <button
            type="button"
            onClick={handleCaptureSnapshot}
            disabled={isSnapshotting}
            className="inline-flex items-center gap-1.5 bg-depth/85 hover:bg-depth text-bone px-3 py-1.5 rounded-full border border-bone/15 backdrop-blur-xl text-xs font-medium shadow-xl transition-all cursor-pointer"
            title={t("planner.snapshot")}
          >
            <Camera className="h-3.5 w-3.5 text-brass" />
            <span className="hidden sm:inline">{t("planner.snapshot")}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2 rounded-full bg-depth/85 hover:bg-depth text-bone/85 border border-bone/15 backdrop-blur-xl transition-all shadow-xl cursor-pointer"
            title={t("planner.fullscreen")}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Bottom Left Status Badge */}
      <div className="absolute bottom-3 left-3 bg-depth/85 text-bone/90 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-bone/15 text-[0.62rem] font-mono pointer-events-none shadow-xl flex items-center gap-2 z-20">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-brass font-bold tracking-wider">3D WEBGL STUDIO</span>
        <span className="text-bone/40">·</span>
        <span>
          {roomWidth.toFixed(1)}m × {roomLength.toFixed(1)}m ({placedItems.length}{" "}
          {lang === "bn" ? "টি সামগ্রী" : "Pieces"})
        </span>
      </div>

      {/* Bottom Center Interaction Guide */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-depth/85 text-bone/85 backdrop-blur-xl px-4 py-1.5 rounded-full border border-bone/15 text-[0.62rem] font-mono pointer-events-none shadow-xl hidden md:flex items-center gap-2 z-20">
        <Sparkles className="h-3 w-3 text-brass" />
        <span>
          {lang === "bn"
            ? "ঘোরাতে ড্র্যাগ করুন · জুম করতে স্ক্রোল · সিলেক্ট করতে ক্লিক করুন"
            : "Left-Click: Orbit 360° · Scroll: Zoom · Right-Click: Pan · Click Piece to Inspect"}
        </span>
      </div>
    </div>
  );
}
