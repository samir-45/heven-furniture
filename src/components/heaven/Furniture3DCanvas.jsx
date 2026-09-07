import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Rotate3d,
  Sparkles,
  RefreshCw,
  Sun,
  Moon,
  Camera,
  Maximize2,
  Minimize2,
  Eye,
} from "lucide-react";

/**
 * Procedural Realistic Woodgrain Texture Generator
 */
function createWoodTexture(woodId = "oak") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const palettes = {
    oak: { base: "#C8A47E", grain: "rgba(125, 90, 55, 0.15)", dark: "rgba(80, 50, 25, 0.08)" },
    walnut: { base: "#4A2E1D", grain: "rgba(25, 12, 5, 0.28)", dark: "rgba(15, 6, 2, 0.18)" },
    teak: { base: "#9C6B3C", grain: "rgba(75, 45, 15, 0.22)", dark: "rgba(45, 25, 8, 0.12)" },
    mahogany: { base: "#6D2E1F", grain: "rgba(45, 12, 8, 0.25)", dark: "rgba(30, 8, 4, 0.15)" },
  };

  const p = palettes[woodId] || palettes.teak;

  // Base wood fill
  ctx.fillStyle = p.base;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle tonal fiber variations
  for (let y = 0; y < 512; y += 4) {
    const v = Math.floor((Math.sin(y * 0.08) * 0.5 + 0.5) * 16) - 8;
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.abs(v) / 140})`;
    ctx.fillRect(0, y, 512, 4);
  }

  // Longitudinal woodgrain striations
  ctx.fillStyle = p.grain;
  for (let i = 0; i < 48; i++) {
    const y = Math.random() * 512;
    const h = 1 + Math.random() * 2.5;
    ctx.fillRect(0, y, 512, h);
  }

  // Fine organic grain waves
  ctx.strokeStyle = p.dark;
  ctx.lineWidth = 1.2;
  for (let w = 0; w < 16; w++) {
    ctx.beginPath();
    let cy = Math.random() * 512;
    ctx.moveTo(0, cy);
    for (let x = 0; x < 512; x += 32) {
      cy += (Math.random() - 0.5) * 6;
      ctx.lineTo(x, cy);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

/**
 * Procedural Tactile Fabric Texture Generator
 */
function createFabricTexture(fabricId = "linen") {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  const colors = {
    linen: "#D6CCA8",
    velvet: "#32221A",
    boucle: "#EAE6DE",
    leather: "#3E291C",
  };

  ctx.fillStyle = colors[fabricId] || "#D6CCA8";
  ctx.fillRect(0, 0, 256, 256);

  if (fabricId === "leather") {
    // Pebbled leather grain
    for (let i = 0; i < 600; i++) {
      const rx = Math.random() * 256;
      const ry = Math.random() * 256;
      ctx.fillStyle = Math.random() > 0.5 ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.arc(rx, ry, 1 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (fabricId === "boucle") {
    // Tactile loops
    for (let i = 0; i < 700; i++) {
      const rx = Math.random() * 256;
      const ry = Math.random() * 256;
      ctx.strokeStyle = Math.random() > 0.4 ? "rgba(220, 215, 205, 0.35)" : "rgba(120, 110, 100, 0.15)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(rx, ry, 1.5 + Math.random() * 2.5, 0, Math.PI * 1.5);
      ctx.stroke();
    }
  } else {
    // Woven Linen Crosshatch
    ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 256; x += 4) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }
    for (let y = 0; y < 256; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export default function Furniture3DCanvas({
  category,
  wood,
  fabric,
  finish,
  width,
  depth,
  height,
}) {
  const rootRef = useRef(null);
  const mountRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [lightingMood, setLightingMood] = useState("day"); // "day" | "evening"
  const [activePreset, setActivePreset] = useState("perspective"); // "perspective" | "top" | "front" | "detail"
  const [isSnapshotting, setIsSnapshotting] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const furnitureGroupRef = useRef(null);
  const keyLightRef = useRef(null);
  const fillLightRef = useRef(null);
  const spotLightRef = useRef(null);
  const ambientLightRef = useRef(null);
  const floorDiskRef = useRef(null);

  // 1. Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const widthPx = container.clientWidth || 640;
    const heightPx = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F4F1EA");
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(35, widthPx / heightPx, 0.1, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(widthPx, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Keep above studio floor
    controls.minDistance = 1.2;
    controls.maxDistance = 16;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.9;
    controlsRef.current = controls;

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight("#FAF7F0", 1.4);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Key Sunlight
    const keyLight = new THREE.DirectionalLight("#FFF5E4", 2.6);
    keyLight.position.set(4.5, 7.5, 3.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.radius = 2.4;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Soft Studio Fill Light
    const fillLight = new THREE.DirectionalLight("#E8DFD2", 1.2);
    fillLight.position.set(-5, 4, -3);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    // Gold Specular Rim Light
    const rimLight = new THREE.DirectionalLight("#C9A66B", 0.7);
    rimLight.position.set(0, 6, -5);
    scene.add(rimLight);

    // Overhead Focused Spotlight
    const spotLight = new THREE.SpotLight("#FFAE42", 0.6, 12, Math.PI / 4, 0.4, 1.2);
    spotLight.position.set(0, 5, 0);
    scene.add(spotLight);
    spotLightRef.current = spotLight;

    // Floor & Studio Ground Shadow Receiver Plane
    const groundGeo = new THREE.PlaneGeometry(24, 24);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Minimal Subtle Studio Floor Disc (seamlessly grounded)
    const diskGeo = new THREE.CircleGeometry(2.6, 64);
    const diskMat = new THREE.MeshBasicMaterial({
      color: "#ECE7DE",
      transparent: true,
      opacity: 0.65,
    });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.rotation.x = -Math.PI / 2;
    disk.position.y = 0.001;
    scene.add(disk);
    floorDiskRef.current = disk;

    // Dynamic Furniture Group
    const furnitureGroup = new THREE.Group();
    scene.add(furnitureGroup);
    furnitureGroupRef.current = furnitureGroup;

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

    // Fullscreen listener
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync autoRotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Sync Lighting Mood: "day" vs "evening"
  useEffect(() => {
    const scene = sceneRef.current;
    const key = keyLightRef.current;
    const ambient = ambientLightRef.current;
    const fill = fillLightRef.current;
    const spot = spotLightRef.current;
    const floorDisk = floorDiskRef.current;

    if (!scene || !key || !ambient) return;

    if (lightingMood === "evening") {
      scene.background = new THREE.Color("#161A1D");
      ambient.color.set("#282C34");
      ambient.intensity = 0.7;

      key.color.set("#7D98B8"); // Cool moon / rim highlight
      key.intensity = 0.9;

      if (fill) {
        fill.color.set("#20252C");
        fill.intensity = 0.5;
      }
      if (spot) {
        spot.color.set("#FFAE42");
        spot.intensity = 3.2; // Focused warm showcase spotlight
      }
      if (floorDisk) {
        floorDisk.material.color.set("#22272E");
        floorDisk.material.opacity = 0.5;
      }
    } else {
      scene.background = new THREE.Color("#F4F1EA");
      ambient.color.set("#FAF7F0");
      ambient.intensity = 1.35;

      key.color.set("#FFF8E7"); // Warm natural daylight
      key.intensity = 2.4;

      if (fill) {
        fill.color.set("#E8DFCF");
        fill.intensity = 1.2;
      }
      if (spot) {
        spot.color.set("#FFAE42");
        spot.intensity = 0.5;
      }
      if (floorDisk) {
        floorDisk.material.color.set("#ECE7DE");
        floorDisk.material.opacity = 0.65;
      }
    }
  }, [lightingMood]);

  // 2. Build High-Fidelity Parametric 3D Furniture Meshes with Contact Shadows
  useEffect(() => {
    const group = furnitureGroupRef.current;
    if (!group) return;

    // Clear previous geometries and meshes
    while (group.children.length > 0) {
      const obj = group.children[0];
      if (obj.geometry) obj.geometry.dispose();
      group.remove(obj);
    }

    const finishRoughness = {
      natural: 0.48,
      stained: 0.32,
      handrubbed: 0.22,
    };

    // Realistic Procedural Textures
    const woodTex = createWoodTexture(wood.id);
    const fabricTex = createFabricTexture(fabric.id);

    const woodMat = new THREE.MeshStandardMaterial({
      map: woodTex,
      roughness: finishRoughness[finish.id] || 0.38,
      metalness: 0.06,
    });

    const fabricMat = new THREE.MeshStandardMaterial({
      map: fabricTex,
      roughness: fabric.id === "leather" ? 0.32 : fabric.id === "velvet" ? 0.6 : 0.92,
      metalness: fabric.id === "leather" ? 0.12 : 0.0,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: "#C9A66B",
      roughness: 0.2,
      metalness: 0.85,
    });

    const addMesh = (geo, mat, pos = [0, 0, 0], rot = [0, 0, 0]) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.rotation.set(...rot);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    };

    // Convert cm to 3D scene meters
    const W = width / 100;
    const D = depth / 100;
    const H = height / 100;

    // Soft Ambient Contact Shadow under the Furniture Piece
    const shadowGeo = new THREE.PlaneGeometry(W * 1.1, D * 1.1);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: "#18120B",
      transparent: true,
      opacity: 0.25,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.003;
    group.add(contactShadow);

    if (category.id === "sofa") {
      const legH = 0.09;
      const baseH = 0.10;
      const topOfBase = legH + baseH;

      // 4 Turned Timber Legs with Gleaming Brass Ferrules
      const legGeo = new THREE.CylinderGeometry(0.032, 0.022, legH, 16);
      const ferruleGeo = new THREE.CylinderGeometry(0.024, 0.022, legH * 0.35, 16);
      const legX = W / 2 - 0.12;
      const legZ = D / 2 - 0.12;

      [
        [legX, legZ],
        [-legX, legZ],
        [legX, -legZ],
        [-legX, -legZ],
      ].forEach(([lx, lz]) => {
        addMesh(legGeo, woodMat, [lx, legH / 2, lz]);
        addMesh(brassMat ? ferruleGeo : legGeo, brassMat, [lx, (legH * 0.35) / 2, lz]);
      });

      // Solid Hardwood Base Plinth
      const baseGeo = new THREE.BoxGeometry(W, baseH, D);
      addMesh(baseGeo, woodMat, [0, legH + baseH / 2, 0]);

      // Side Armrests with contoured padding
      const armW = 0.16;
      const armH = Math.max(0.26, H * 0.7 - topOfBase);
      const armGeo = new THREE.BoxGeometry(armW, armH, D);
      addMesh(armGeo, fabricMat, [W / 2 - armW / 2, topOfBase + armH / 2, 0]);
      addMesh(armGeo, fabricMat, [-W / 2 + armW / 2, topOfBase + armH / 2, 0]);

      // Plush Multi-Segment Seat Cushions
      const seatW = W - 2 * armW;
      const seatH = 0.22;
      const seatD = D - 0.14;
      const segCount = seatW > 1.8 ? 3 : 2;
      const segW = seatW / segCount - 0.02;

      for (let i = 0; i < segCount; i++) {
        const segX = -seatW / 2 + segW / 2 + i * (segW + 0.02) + 0.01;
        const segGeo = new THREE.BoxGeometry(segW, seatH, seatD);
        addMesh(segGeo, fabricMat, [segX, topOfBase + seatH / 2, 0.07]);
      }

      // Slanted Ergonomic Backrest
      const backH = Math.max(0.38, H - topOfBase);
      const backD = 0.18;
      const backGeo = new THREE.BoxGeometry(seatW, backH, backD);
      addMesh(backGeo, fabricMat, [0, topOfBase + backH / 2, -D / 2 + backD / 2], [-0.05, 0, 0]);

      // Designer Accent Throw Pillows
      const pillowSize = Math.min(0.38, seatW / 3);
      const pillowMat = new THREE.MeshStandardMaterial({ color: "#C9A66B", roughness: 0.8 });
      const pillowGeo = new THREE.BoxGeometry(pillowSize, pillowSize, 0.12);
      addMesh(pillowGeo, pillowMat, [seatW / 2 - pillowSize / 2, topOfBase + seatH + pillowSize / 2 * 0.6, 0.08], [0, -0.28, 0.18]);
      addMesh(pillowGeo, pillowMat, [-seatW / 2 + pillowSize / 2, topOfBase + seatH + pillowSize / 2 * 0.6, 0.08], [0, 0.28, -0.18]);

    } else if (category.id === "bed") {
      const legH = 0.10;
      const frameH = 0.20;
      const topOfFrame = legH + frameH;

      // Legs with Brass Caps
      const legGeo = new THREE.CylinderGeometry(0.045, 0.03, legH, 16);
      const ferruleGeo = new THREE.CylinderGeometry(0.034, 0.03, legH * 0.4, 16);
      const legX = W / 2 - 0.08;
      const legZ = D / 2 - 0.08;

      [
        [legX, legZ],
        [-legX, legZ],
        [legX, -legZ],
        [-legX, -legZ],
      ].forEach(([lx, lz]) => {
        addMesh(legGeo, woodMat, [lx, legH / 2, lz]);
        addMesh(ferruleGeo, brassMat, [lx, (legH * 0.4) / 2, lz]);
      });

      // Bed Frame
      const frameGeo = new THREE.BoxGeometry(W, frameH, D);
      addMesh(frameGeo, woodMat, [0, legH + frameH / 2, 0]);

      // Headboard
      const headH = Math.max(0.65, H - legH);
      const headGeo = new THREE.BoxGeometry(W + 0.14, headH, 0.12);
      addMesh(headGeo, woodMat, [0, legH + headH / 2, -D / 2 + 0.06]);

      // Headboard Upholstered Panel
      const panelH = headH * 0.65;
      const panelGeo = new THREE.BoxGeometry(W - 0.1, panelH, 0.06);
      addMesh(panelGeo, fabricMat, [0, topOfFrame + panelH / 2, -D / 2 + 0.14]);

      // Mattress
      const mattressH = 0.26;
      const mattressGeo = new THREE.BoxGeometry(W - 0.1, mattressH, D - 0.18);
      addMesh(mattressGeo, fabricMat, [0, topOfFrame + mattressH / 2, 0.08]);

      // Folded Luxury Duvet Runner
      const duvetGeo = new THREE.BoxGeometry(W - 0.06, 0.06, (D - 0.18) * 0.55);
      const duvetMat = new THREE.MeshStandardMaterial({ color: "#D2C7B8", roughness: 0.85 });
      addMesh(duvetGeo, duvetMat, [0, topOfFrame + mattressH + 0.03, 0.35]);

      // Two Sleeping Pillows
      const pillowGeo = new THREE.BoxGeometry(W * 0.36, 0.12, 0.36);
      addMesh(pillowGeo, fabricMat, [W * 0.22, topOfFrame + mattressH + 0.06, -D / 2 + 0.38], [0.2, 0, 0]);
      addMesh(pillowGeo, fabricMat, [-W * 0.22, topOfFrame + mattressH + 0.06, -D / 2 + 0.38], [0.2, 0, 0]);

      // Floating Matching Wooden Nightstands on Both Sides
      const standW = 0.36;
      const standH = 0.18;
      const standD = 0.34;
      const standGeo = new THREE.BoxGeometry(standW, standH, standD);
      addMesh(standGeo, woodMat, [W / 2 + standW / 2 + 0.08, topOfFrame - 0.05, -D / 2 + standD / 2]);
      addMesh(standGeo, woodMat, [-W / 2 - standW / 2 - 0.08, topOfFrame - 0.05, -D / 2 + standD / 2]);

    } else if (category.id === "dining") {
      const topThick = 0.06;
      const topOfTable = H;
      const legH = topOfTable - topThick;

      // Solid Wood Beveled Table Top
      const topGeo = new THREE.BoxGeometry(W, topThick, D);
      addMesh(topGeo, woodMat, [0, topOfTable - topThick / 2, 0]);

      // 4 Solid Hardwood Legs with Brass Ferrules
      const legGeo = new THREE.CylinderGeometry(0.04, 0.026, legH, 16);
      const ferruleGeo = new THREE.CylinderGeometry(0.028, 0.026, legH * 0.3, 16);
      const legX = W / 2 - 0.12;
      const legZ = D / 2 - 0.12;

      [
        [legX, legZ],
        [-legX, legZ],
        [legX, -legZ],
        [-legX, -legZ],
      ].forEach(([lx, lz]) => {
        addMesh(legGeo, woodMat, [lx, legH / 2, lz]);
        addMesh(ferruleGeo, brassMat, [lx, (legH * 0.3) / 2, lz]);
      });

      // Under-top Apron Beams
      const aprGeoX = new THREE.BoxGeometry(W - 0.24, 0.06, 0.03);
      addMesh(aprGeoX, woodMat, [0, topOfTable - topThick - 0.03, D / 2 - 0.12]);
      addMesh(aprGeoX, woodMat, [0, topOfTable - topThick - 0.03, -D / 2 + 0.12]);

      // Surrounding Dining Chairs with Upholstered Seats
      const createChair = (x, z, rotY) => {
        const chairGroup = new THREE.Group();
        chairGroup.position.set(x, 0, z);
        chairGroup.rotation.y = rotY;

        // Seat Cushion
        const cSeat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.06, 0.44), fabricMat);
        cSeat.position.y = 0.46;
        cSeat.castShadow = true;
        chairGroup.add(cSeat);

        // Curved Backrest
        const cBack = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.42, 0.04), woodMat);
        cBack.position.set(0, 0.67, -0.2);
        cBack.castShadow = true;
        chairGroup.add(cBack);

        // Chair Legs
        const cLegGeo = new THREE.CylinderGeometry(0.018, 0.014, 0.46, 12);
        [
          [0.18, 0.18],
          [-0.18, 0.18],
          [0.18, -0.18],
          [-0.18, -0.18],
        ].forEach(([cx, cz]) => {
          const cl = new THREE.Mesh(cLegGeo, woodMat);
          cl.position.set(cx, 0.23, cz);
          cl.castShadow = true;
          chairGroup.add(cl);
        });

        group.add(chairGroup);
      };

      createChair(-W / 3, D / 2 + 0.36, Math.PI);
      createChair(W / 3, D / 2 + 0.36, Math.PI);
      createChair(-W / 3, -D / 2 - 0.36, 0);
      createChair(W / 3, -D / 2 - 0.36, 0);

    } else if (category.id === "wardrobe") {
      const plinthH = 0.08;
      const corniceH = 0.06;
      const bodyH = Math.max(1.0, H - plinthH - corniceH);

      // Base Plinth with Brass Feet Accents
      const plinthGeo = new THREE.BoxGeometry(W + 0.04, plinthH, D + 0.02);
      addMesh(plinthGeo, woodMat, [0, plinthH / 2, 0]);

      // Main Wardrobe Cabinet Body
      const bodyGeo = new THREE.BoxGeometry(W, bodyH, D);
      addMesh(bodyGeo, woodMat, [0, plinthH + bodyH / 2, 0]);

      // Crown Molding Cornice
      const corniceGeo = new THREE.BoxGeometry(W + 0.08, corniceH, D + 0.04);
      addMesh(corniceGeo, woodMat, [0, plinthH + bodyH + corniceH / 2, 0]);

      // Paneled Doors
      const doorW = W / 2 - 0.02;
      const doorGeo = new THREE.BoxGeometry(doorW, bodyH - 0.06, 0.025);
      addMesh(doorGeo, woodMat, [-W / 4, plinthH + bodyH / 2, D / 2 + 0.015]);
      addMesh(doorGeo, woodMat, [W / 4, plinthH + bodyH / 2, D / 2 + 0.015]);

      // Long Architectural Brushed Brass Bar Handles
      const handleGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.5, 16);
      addMesh(handleGeo, brassMat, [-0.06, plinthH + bodyH / 2, D / 2 + 0.038]);
      addMesh(handleGeo, brassMat, [0.06, plinthH + bodyH / 2, D / 2 + 0.038]);

    } else if (category.id === "chair") {
      // Bespoke Lounge Chair
      const legH = 0.22;

      // 4 Flared Hardwood Legs with Polished Brass Ferrules
      const legGeo = new THREE.CylinderGeometry(0.028, 0.018, legH, 16);
      const ferruleGeo = new THREE.CylinderGeometry(0.021, 0.018, legH * 0.35, 16);
      const legX = W / 2 - 0.08;
      const legZ = D / 2 - 0.09;

      addMesh(legGeo, woodMat, [legX, legH / 2, legZ], [0.12, 0, -0.12]);
      addMesh(ferruleGeo, brassMat, [legX, (legH * 0.35) / 2, legZ], [0.12, 0, -0.12]);

      addMesh(legGeo, woodMat, [-legX, legH / 2, legZ], [0.12, 0, 0.12]);
      addMesh(ferruleGeo, brassMat, [-legX, (legH * 0.35) / 2, legZ], [0.12, 0, 0.12]);

      addMesh(legGeo, woodMat, [legX, legH / 2, -legZ], [-0.12, 0, -0.12]);
      addMesh(ferruleGeo, brassMat, [legX, (legH * 0.35) / 2, -legZ], [-0.12, 0, -0.12]);

      addMesh(legGeo, woodMat, [-legX, legH / 2, -legZ], [-0.12, 0, 0.12]);
      addMesh(ferruleGeo, brassMat, [-legX, (legH * 0.35) / 2, -legZ], [-0.12, 0, 0.12]);

      // Deep Contoured Seat Cushion with Piping
      const seatH = 0.18;
      const seatGeo = new THREE.BoxGeometry(W - 0.06, seatH, D - 0.1);
      addMesh(seatGeo, fabricMat, [0, legH + seatH / 2, 0.03]);

      // Curved Upholstered Backrest
      const backH = Math.max(0.38, H - legH);
      const backGeo = new THREE.BoxGeometry(W - 0.06, backH, 0.14);
      addMesh(backGeo, fabricMat, [0, legH + backH / 2, -D / 2 + 0.14], [-0.14, 0, 0]);

      // Sculpted Architectural Wooden Armrests with Brass Joint Pins
      const armH = Math.max(0.2, H * 0.65 - legH);
      const armGeo = new THREE.BoxGeometry(0.06, 0.035, D * 0.88);
      addMesh(armGeo, woodMat, [W / 2 - 0.03, legH + armH, 0.02]);
      addMesh(armGeo, woodMat, [-W / 2 + 0.03, legH + armH, 0.02]);

      // Lumbar Accent Cushion
      const lumbarGeo = new THREE.BoxGeometry(W * 0.55, 0.18, 0.08);
      const lumbarMat = new THREE.MeshStandardMaterial({ color: "#C9A66B", roughness: 0.75 });
      addMesh(lumbarGeo, lumbarMat, [0, legH + seatH + 0.08, -D / 2 + 0.22], [-0.1, 0, 0]);
    }

    // 3. Dynamic Camera Auto-Framing: Calibrated so furniture fills 75% of viewport!
    if (cameraRef.current && controlsRef.current && mountRef.current) {
      const box = new THREE.Box3().setFromObject(group);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      // Tight, beautiful framing distance
      const maxDim = Math.max(size.x, size.y * 1.15, size.z);
      const aspect = cameraRef.current.aspect || 1.6;
      const fovRad = (cameraRef.current.fov * Math.PI) / 180;
      const distV = (maxDim * 0.85) / Math.tan(fovRad / 2);
      const distH = (maxDim * 0.85) / (Math.tan(fovRad / 2) * aspect);
      const distance = Math.max(distV, distH, 1.85);

      const azimuth = Math.PI / 4;
      const elevation = 0.38;

      cameraRef.current.position.set(
        distance * Math.cos(elevation) * Math.sin(azimuth),
        distance * Math.sin(elevation) + center.y * 0.9,
        distance * Math.cos(elevation) * Math.cos(azimuth)
      );
      controlsRef.current.target.set(0, center.y * 0.85, 0);
      controlsRef.current.update();
    }
  }, [category, wood, fabric, finish, width, depth, height]);

  // Set Camera Preset Angle
  const setCameraPreset = useCallback(
    (preset) => {
      if (!furnitureGroupRef.current || !cameraRef.current || !controlsRef.current) return;
      const box = new THREE.Box3().setFromObject(furnitureGroupRef.current);
      const center = new THREE.Vector3();
      box.getCenter(center);
      const size = new THREE.Vector3();
      box.getSize(size);

      const maxDim = Math.max(size.x, size.y * 1.15, size.z);
      const baseDist = Math.max(maxDim * 1.85, 1.85);

      if (preset === "perspective") {
        const azimuth = Math.PI / 4;
        const elevation = 0.38;
        cameraRef.current.position.set(
          baseDist * Math.cos(elevation) * Math.sin(azimuth),
          baseDist * Math.sin(elevation) + center.y * 0.9,
          baseDist * Math.cos(elevation) * Math.cos(azimuth)
        );
        controlsRef.current.target.set(0, center.y * 0.85, 0);
      } else if (preset === "front") {
        cameraRef.current.position.set(0, center.y + 0.1, baseDist * 1.1);
        controlsRef.current.target.set(0, center.y, 0);
      } else if (preset === "top") {
        cameraRef.current.position.set(0.01, baseDist * 1.3, 0.01);
        controlsRef.current.target.set(0, 0, 0);
      } else if (preset === "detail") {
        cameraRef.current.position.set(baseDist * 0.5, center.y + 0.15, baseDist * 0.5);
        controlsRef.current.target.set(0, center.y, 0);
      }

      controlsRef.current.update();
      setActivePreset(preset);
    },
    []
  );

  // 1-Click 4K Spec Snapshot with Camera Flash
  const handleCaptureSnapshot = () => {
    if (!rendererRef.current) return;
    setFlashEffect(true);
    setIsSnapshotting(true);

    setTimeout(() => {
      try {
        const dataUrl = rendererRef.current.domElement.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `Haven-${category.id}-${wood.id}-${Date.now().toString().slice(-6)}.png`;
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
    }, 120);
  };

  // Fullscreen Toggle
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
      className={`relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[2.1/1] rounded-sm bg-[#F4F1EA] border border-ink/10 overflow-hidden shadow-inner select-none touch-pan-y transition-all ${
        isFullscreen ? "fixed inset-0 z-50 aspect-auto rounded-none border-0" : ""
      }`}
    >
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Camera Flash Effect */}
      <div
        className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-300 z-30 ${
          flashEffect ? "opacity-90" : "opacity-0"
        }`}
      />

      {/* Top Left Floating Dimension Badge */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-bone/90 backdrop-blur-md border border-ink/10 px-3 py-1.5 rounded-full text-xs tracking-wider uppercase text-ink/80 font-medium z-10 flex items-center gap-1.5 shadow-xs pointer-events-none">
        <Sparkles className="h-3.5 w-3.5 text-bronze shrink-0" />
        <span className="font-mono text-[0.72rem] tracking-tight">{width} × {depth} × {height} cm</span>
      </div>

      {/* Top Right Studio Tools */}
      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1.5 z-10">
        {/* Material Tag */}
        <div className="bg-bone/90 backdrop-blur-md border border-ink/10 px-3 py-1.5 rounded-full text-xs tracking-wider text-ink/75 font-medium shadow-xs uppercase pointer-events-none hidden sm:inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
          <span>{wood.id} {category.hasFabric && `· ${fabric.id}`}</span>
        </div>

        {/* Day / Evening Mood Switcher */}
        <button
          type="button"
          onClick={() => setLightingMood((v) => (v === "day" ? "evening" : "day"))}
          title="Toggle Day / Evening Studio Lighting"
          className={`p-2 rounded-full border backdrop-blur-md transition-all shadow-xs cursor-pointer ${
            lightingMood === "evening"
              ? "bg-depth text-bone border-depth"
              : "bg-bone/90 text-ink/70 border-ink/10 hover:text-ink hover:bg-bone"
          }`}
        >
          {lightingMood === "evening" ? (
            <Moon className="h-3.5 w-3.5 fill-current text-bone" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-bronze" />
          )}
        </button>

        {/* 4K Photo Snapshot */}
        <button
          type="button"
          onClick={handleCaptureSnapshot}
          disabled={isSnapshotting}
          title="Capture High-Res 3D Spec Photo"
          className="p-2 rounded-full bg-bone/90 hover:bg-bone text-ink/70 hover:text-ink border border-ink/10 backdrop-blur-md transition-all shadow-xs cursor-pointer"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={handleToggleFullscreen}
          title="Toggle Fullscreen"
          className="p-2 rounded-full bg-bone/90 hover:bg-bone text-ink/70 hover:text-ink border border-ink/10 backdrop-blur-md transition-all shadow-xs cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Bottom Center 360° Drag Hint */}
      <div className="hidden xs:flex absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 bg-bone/85 backdrop-blur-md border border-ink/10 px-3 py-1 rounded-full text-[0.62rem] font-mono tracking-wider uppercase text-ink/60 font-medium z-10 items-center gap-1.5 shadow-xs pointer-events-none">
        <Rotate3d className="h-3 w-3 text-bronze animate-spin-slow" />
        <span>360° Studio · Drag to Rotate</span>
      </div>

      {/* Bottom Right Camera Presets & Orbit Action Controls */}
      <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 flex items-center gap-1 z-10 bg-bone/90 backdrop-blur-md p-1 rounded-full border border-ink/10 shadow-sm">
        <button
          type="button"
          onClick={() => setCameraPreset("perspective")}
          title="3D Showcase Perspective"
          className={`px-2.5 py-1 rounded-full text-[0.62rem] uppercase font-mono transition-all cursor-pointer ${
            activePreset === "perspective"
              ? "bg-depth text-bone font-medium shadow-xs"
              : "text-ink/65 hover:text-ink font-medium"
          }`}
        >
          3D
        </button>

        <button
          type="button"
          onClick={() => setCameraPreset("front")}
          title="Front Profile View"
          className={`px-2.5 py-1 rounded-full text-[0.62rem] uppercase font-mono transition-all cursor-pointer ${
            activePreset === "front"
              ? "bg-depth text-bone font-medium shadow-xs"
              : "text-ink/65 hover:text-ink font-medium"
          }`}
        >
          Front
        </button>

        <button
          type="button"
          onClick={() => setCameraPreset("top")}
          title="Top-Down Plan View"
          className={`px-2.5 py-1 rounded-full text-[0.62rem] uppercase font-mono transition-all cursor-pointer ${
            activePreset === "top"
              ? "bg-depth text-bone font-medium shadow-xs"
              : "text-ink/65 hover:text-ink font-medium"
          }`}
        >
          Top
        </button>

        <button
          type="button"
          onClick={() => setCameraPreset("detail")}
          title="Close-Up Detail View"
          className={`p-1.5 rounded-full transition-all cursor-pointer ${
            activePreset === "detail"
              ? "bg-depth text-bone shadow-xs"
              : "text-ink/65 hover:text-ink"
          }`}
        >
          <Eye className="h-3 w-3" />
        </button>

        <div className="w-[1px] h-3.5 bg-ink/10 mx-0.5" />

        <button
          type="button"
          onClick={() => setAutoRotate((v) => !v)}
          title={autoRotate ? "Pause Auto-Rotation" : "Start Auto-Rotation"}
          className={`p-1.5 rounded-full transition-all cursor-pointer ${
            autoRotate
              ? "bg-depth text-bone"
              : "text-ink/65 hover:text-ink"
          }`}
        >
          <Rotate3d className="h-3 w-3" />
        </button>

        <button
          type="button"
          onClick={() => setCameraPreset("perspective")}
          title="Reset Camera View"
          className="p-1.5 rounded-full text-ink/65 hover:text-ink transition-all cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
