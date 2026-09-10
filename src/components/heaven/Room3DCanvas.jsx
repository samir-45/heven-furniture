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
  RotateCw,
  RotateCcw,
  RefreshCw,
  Eye,
  Trash2,
  Copy,
  X,
} from "lucide-react";
import { useLang } from "./LanguageProvider";
import { resolveSlidePosition } from "@/utils/plannerCollision";

/**
 * Procedural Luxury Flooring Texture Generator
 * Supports: Teak Parquet, Walnut Herringbone, White Oak, and Travertine Stone
 */
function createFloorTexture(type = "teak_parquet") {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  if (type === "walnut_herringbone") {
    // Rich dark espresso walnut herringbone (broad architectural planks)
    ctx.fillStyle = "#331E12";
    ctx.fillRect(0, 0, 1024, 1024);

    const step = 256;
    for (let y = -step; y < 1024 + step; y += step) {
      for (let x = -step; x < 1024 + step; x += step) {
        const alt = ((x + y) / step) % 2 === 0;
        const v = Math.floor((Math.sin(x * 0.02 + y * 0.03) * 0.5 + 0.5) * 16) - 8;
        const r = Math.max(0, Math.min(255, 60 + v));
        const g = Math.max(0, Math.min(255, 36 + v));
        const b = Math.max(0, Math.min(255, 22 + v));

        ctx.save();
        ctx.translate(x + step / 2, y + step / 2);
        ctx.rotate(alt ? Math.PI / 4 : -Math.PI / 4);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(-step / 2 + 2, -step / 4 + 2, step - 4, step / 2 - 4);

        // Soft subtle woodgrain gradient
        ctx.fillStyle = "rgba(15, 8, 4, 0.12)";
        ctx.fillRect(-step / 2 + 4, 0, step - 8, 3);
        ctx.restore();
      }
    }
  } else if (type === "white_oak") {
    // Pale Scandinavian / Japandi White Oak (wide planks)
    ctx.fillStyle = "#D6CBB9";
    ctx.fillRect(0, 0, 1024, 1024);

    const plankH = 128;
    for (let y = 0; y < 1024; y += plankH) {
      const v = Math.floor((Math.sin(y * 0.05) * 0.5 + 0.5) * 12) - 6;
      ctx.fillStyle = `rgb(${216 + v},${205 + v},${187 + v})`;
      ctx.fillRect(0, y + 2, 1024, plankH - 4);

      // Subtle warm woodgrain
      ctx.fillStyle = "rgba(120, 105, 85, 0.05)";
      for (let s = 0; s < 3; s++) {
        ctx.fillRect(0, y + s * 36 + 16, 1024, 2);
      }

      // Soft bevel seam
      ctx.fillStyle = "rgba(100, 85, 68, 0.15)";
      ctx.fillRect(0, y, 1024, 2);
    }
  } else if (type === "travertine") {
    // Luxury Travertine Stone Slabs (large format 512x256)
    ctx.fillStyle = "#ECE7DE";
    ctx.fillRect(0, 0, 1024, 1024);

    for (let i = 0; i < 150; i++) {
      const rx = Math.random() * 1024;
      const ry = Math.random() * 1024;
      const rw = 60 + Math.random() * 90;
      ctx.fillStyle = `rgba(${195 + Math.random() * 15}, ${185 + Math.random() * 15}, ${170 + Math.random() * 15}, 0.06)`;
      ctx.beginPath();
      ctx.ellipse(rx, ry, rw, rw * 0.4, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    // Architectural grout lines (512x256 tiles)
    ctx.strokeStyle = "rgba(140, 130, 115, 0.2)";
    ctx.lineWidth = 2;
    for (let y = 0; y <= 1024; y += 256) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }
    for (let x = 0; x <= 1024; x += 512) {
      for (let y = 0; y < 1024; y += 256) {
        const off = (y / 256) % 2 === 0 ? 0 : 256;
        ctx.beginPath();
        ctx.moveTo(x + off, y);
        ctx.lineTo(x + off, y + 256);
        ctx.stroke();
      }
    }
  } else {
    // Default: Golden Chittagong Teak Parquet (wide luxurious planks)
    ctx.fillStyle = "#C8A375";
    ctx.fillRect(0, 0, 1024, 1024);

    const plankH = 128; // 8 broad planks per repeat
    const plankW = 512; // 2 planks per row
    for (let y = 0; y < 1024; y += plankH) {
      const rowOffset = (Math.floor(y / plankH) % 2) * (plankW / 2);
      for (let x = -plankW; x < 1024 + plankW; x += plankW) {
        const px = x + rowOffset;
        const toneVariance = Math.floor((Math.sin(px * 0.02 + y * 0.04) * 0.5 + 0.5) * 14) - 7;
        const r = Math.max(0, Math.min(255, 185 + toneVariance));
        const g = Math.max(0, Math.min(255, 142 + toneVariance));
        const b = Math.max(0, Math.min(255, 96 + toneVariance));

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(px + 2, y + 2, plankW - 4, plankH - 4);

        // Soft subtle woodgrain striations
        ctx.fillStyle = "rgba(80, 48, 20, 0.05)";
        for (let s = 0; s < 3; s++) {
          ctx.fillRect(px + 2, y + s * 36 + 18, plankW - 4, 2);
        }

        // Soft natural bevel seams
        ctx.fillStyle = "rgba(50, 25, 10, 0.15)";
        ctx.fillRect(px, y, plankW, 2);
        ctx.fillRect(px, y, 2, plankH);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  return texture;
}

/**
 * Modern Gallery Artwork Canvas Generator (Back Wall Art)
 */
function createArtTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");

  // Minimalist ivory linen background
  ctx.fillStyle = "#F7F4ED";
  ctx.fillRect(0, 0, 1024, 768);

  // Subtle natural canvas texture grain
  ctx.fillStyle = "rgba(228, 220, 208, 0.3)";
  for (let i = 0; i < 1024; i += 4) {
    ctx.fillRect(i, 0, 1, 768);
  }
  for (let j = 0; j < 768; j += 4) {
    ctx.fillRect(0, j, 1024, 1);
  }

  // Organic modern architectural art shapes (Haven luxury palette)
  // 1. Warm Golden Brass Arc
  ctx.fillStyle = "#C9A66B";
  ctx.beginPath();
  ctx.arc(440, 400, 220, 0, Math.PI * 1.6);
  ctx.fill();

  // 2. Rich Deep Charcoal Arch
  ctx.fillStyle = "#1E262B";
  ctx.beginPath();
  ctx.arc(620, 360, 170, Math.PI * 0.5, Math.PI * 1.8);
  ctx.fill();

  // 3. Earthy Terracotta Sun
  ctx.fillStyle = "#8C5C38";
  ctx.beginPath();
  ctx.arc(340, 280, 100, 0, Math.PI * 2);
  ctx.fill();

  // 4. Soft Sand Dune Curve
  ctx.fillStyle = "rgba(201, 166, 107, 0.4)";
  ctx.beginPath();
  ctx.ellipse(512, 600, 350, 120, 0, 0, Math.PI * 2);
  ctx.fill();

  // Fine architectural inner border
  ctx.strokeStyle = "rgba(30, 38, 43, 0.2)";
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, 960, 704);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Ceramic Potted Monstera Plant
 */
function createPottedPlant() {
  const plantGroup = new THREE.Group();

  // 1. Ceramic Pot Body (Tapered architectural planter with open top to eliminate z-fighting)
  const potMat = new THREE.MeshStandardMaterial({
    color: "#F0ECE1",
    roughness: 0.38,
    metalness: 0.05,
  });

  // Hollow tapered cylinder (openEnded: true ensures NO coplanar top disc)
  const potGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.48, 32, 1, true);
  const pot = new THREE.Mesh(potGeo, potMat);
  pot.position.y = 0.24;
  pot.castShadow = true;
  pot.receiveShadow = true;
  plantGroup.add(pot);

  // Closed base disc for pot
  const baseGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.02, 32);
  const base = new THREE.Mesh(baseGeo, potMat);
  base.position.y = 0.01;
  base.receiveShadow = true;
  plantGroup.add(base);

  // 2. Brass Architectural Rim Collar & Top Lip
  const brassRimMat = new THREE.MeshStandardMaterial({
    color: "#C9A66B",
    roughness: 0.25,
    metalness: 0.78,
  });

  // Brass outer band (open sleeve around the upper lip)
  const rimBandGeo = new THREE.CylinderGeometry(0.244, 0.244, 0.04, 32, 1, true);
  const rimBand = new THREE.Mesh(rimBandGeo, brassRimMat);
  rimBand.position.y = 0.46;
  rimBand.castShadow = true;
  plantGroup.add(rimBand);

  // Brass rounded top lip ring (ring geometry, only occupies radius [0.215, 0.246] at y = 0.481)
  const lipGeo = new THREE.RingGeometry(0.215, 0.246, 32);
  const lip = new THREE.Mesh(lipGeo, brassRimMat);
  lip.rotation.x = -Math.PI / 2;
  lip.position.y = 0.481;
  lip.castShadow = true;
  plantGroup.add(lip);

  // 3. Recessed Dark Potting Soil (sits safely 36mm below the rim inside the pot at y = 0.445)
  const soilGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.03, 32);
  const soilMat = new THREE.MeshStandardMaterial({
    color: "#241810",
    roughness: 0.95,
  });
  const soil = new THREE.Mesh(soilGeo, soilMat);
  soil.position.y = 0.43; // top face is at 0.445m, safely 36mm below the brass lip at 0.481m
  soil.receiveShadow = true;
  plantGroup.add(soil);

  // 4. Monstera Foliage (stems anchored firmly into the recessed soil at y = 0.445)
  const leafMat = new THREE.MeshStandardMaterial({
    color: "#274E23",
    roughness: 0.38,
    metalness: 0.08,
    side: THREE.DoubleSide,
  });

  const stemMat = new THREE.MeshStandardMaterial({
    color: "#1E3D1B",
    roughness: 0.5,
  });

  const leafAngles = [0, 1.05, 2.1, 3.14, 4.2, 5.25];
  leafAngles.forEach((ang, idx) => {
    const leafGroup = new THREE.Group();
    leafGroup.rotation.y = ang;
    leafGroup.position.set(0, 0.445, 0);

    // Arching Stem
    const stemH = 0.48 + idx * 0.04;
    const stemGeo = new THREE.CylinderGeometry(0.008, 0.012, stemH, 8);
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.rotation.z = -0.32 - (idx % 2) * 0.08;
    stem.position.set(0.11, stemH * 0.45, 0);
    stem.castShadow = true;
    leafGroup.add(stem);

    // Leaf Blade
    const bladeGeo = new THREE.PlaneGeometry(0.25, 0.36);
    const blade = new THREE.Mesh(bladeGeo, leafMat);
    blade.position.set(0.23, stemH * 0.85, 0);
    blade.rotation.y = 0.35;
    blade.rotation.z = -0.38;
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
  overlappingItemIds = new Set(),
  onSelectItem,
  onMoveItem,
  onRotateItem,
  onDuplicateItem,
  onDeleteItem,
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
  const selectionGroupRef = useRef(null);
  const sunLightRef = useRef(null);
  const ambientLightRef = useRef(null);
  const pendantLightRef = useRef(null);
  const bulbMeshRef = useRef(null);
  const backWallRef = useRef(null);
  const leftWallRef = useRef(null);
  const skyPaneRef = useRef(null);
  const floorMeshRef = useRef(null);

  // Dynamic props kept in sync for 3D event listeners
  const placedItemsRef = useRef(placedItems);
  placedItemsRef.current = placedItems;
  const selectedItemIdRef = useRef(selectedItemId);
  selectedItemIdRef.current = selectedItemId;
  const catalogRef = useRef(catalog);
  catalogRef.current = catalog;
  const roomWidthRef = useRef(roomWidth);
  roomWidthRef.current = roomWidth;
  const roomLengthRef = useRef(roomLength);
  roomLengthRef.current = roomLength;
  const onMoveItemRef = useRef(onMoveItem);
  onMoveItemRef.current = onMoveItem;
  const onSelectItemRef = useRef(onSelectItem);
  onSelectItemRef.current = onSelectItem;

  // 3D Drag State Ref
  const dragStateRef = useRef({
    isDragging: false,
    hasMoved: false,
    itemId: null,
    itemGroup: null,
    dragOffset: { x: 0, z: 0 },
    downPos: { x: 0, y: 0 },
  });

  // Art texture memo
  const artTextureRef = useRef(null);
  if (!artTextureRef.current) {
    artTextureRef.current = createArtTexture();
  }

  // 1. Initialize Scene, WebGL Renderer & 3D Pointer Engine
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F3EEE5");
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.5, 60);
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

    const selectionGroup = new THREE.Group();
    scene.add(selectionGroup);
    selectionGroupRef.current = selectionGroup;

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
    sunLight.shadow.bias = -0.00008;
    sunLight.shadow.normalBias = 0.03;
    sunLight.shadow.radius = 2.0;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 28;
    sunLight.shadow.camera.left = -8;
    sunLight.shadow.camera.right = 8;
    sunLight.shadow.camera.top = 8;
    sunLight.shadow.camera.bottom = -8;
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

    // Center Ceiling Pendant Light (warm ambient room illumination, no shadow acne on floor)
    const pendantLight = new THREE.PointLight("#FFAE42", 0.8, 9, 1.2);
    pendantLight.position.set(0, 2.1, 0);
    pendantLight.castShadow = false;
    scene.add(pendantLight);
    pendantLightRef.current = pendantLight;

    // 3D Raycasting & Drag Interaction Handlers
    const raycaster = new THREE.Raycaster();
    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    const onPointerDown = (e) => {
      if (e.button !== 0) return; // Only primary left-click
      const dom = renderer.domElement;
      if (!dom || !cameraRef.current || !furnitureGroupRef.current) return;

      const rect = dom.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(furnitureGroupRef.current.children, true);

      dragStateRef.current.downPos = { x: e.clientX, y: e.clientY };

      if (intersects.length > 0) {
        let curr = intersects[0].object;
        let hitItemId = null;
        let hitGroup = null;
        while (curr && curr !== furnitureGroupRef.current) {
          if (curr.userData && curr.userData.itemId) {
            hitItemId = curr.userData.itemId;
            hitGroup = curr;
            break;
          }
          curr = curr.parent;
        }

        if (hitItemId && hitGroup) {
          const planeIntersection = new THREE.Vector3();
          if (raycaster.ray.intersectPlane(floorPlane, planeIntersection)) {
            dragStateRef.current = {
              isDragging: true,
              hasMoved: false,
              itemId: hitItemId,
              itemGroup: hitGroup,
              dragOffset: {
                x: hitGroup.position.x - planeIntersection.x,
                z: hitGroup.position.z - planeIntersection.z,
              },
              downPos: { x: e.clientX, y: e.clientY },
            };

            // Select this piece
            onSelectItemRef.current?.(hitItemId);

            // Temporarily disable orbit controls so dragging moves the piece instead of rotating camera
            controls.enabled = false;
            dom.style.cursor = "grabbing";
            return;
          }
        }
      }

      dragStateRef.current.isDragging = false;
    };

    const onPointerMove = (e) => {
      const dom = renderer.domElement;
      if (!dom || !cameraRef.current) return;

      const rect = dom.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(mouse, cameraRef.current);

      if (dragStateRef.current.isDragging) {
        const dx = Math.abs(e.clientX - dragStateRef.current.downPos.x);
        const dy = Math.abs(e.clientY - dragStateRef.current.downPos.y);
        if (dx > 3 || dy > 3) {
          dragStateRef.current.hasMoved = true;
        }

        const planeIntersection = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(floorPlane, planeIntersection)) {
          const rw = roomWidthRef.current;
          const rl = roomLengthRef.current;
          const itemId = dragStateRef.current.itemId;
          const itemGroup = dragStateRef.current.itemGroup;
          const currentItem = placedItemsRef.current.find((p) => p.id === itemId);
          const cat = currentItem ? catalogRef.current.find((c) => c.id === currentItem.catId) : null;

          if (currentItem && cat && itemGroup) {
            const rawTargetX = planeIntersection.x + dragStateRef.current.dragOffset.x;
            const rawTargetZ = planeIntersection.z + dragStateRef.current.dragOffset.z;

            // Target center in 2D coordinates
            const targetCx = rawTargetX + rw / 2;
            const targetCy = rawTargetZ + rl / 2;

            const targetItemX = targetCx - cat.wM / 2;
            const targetItemY = targetCy - cat.dM / 2;

            // Resolve non-overlapping position against room walls and all other furniture
            const resolved = resolveSlidePosition({
              item: currentItem,
              targetX: targetItemX,
              targetY: targetItemY,
              placedItems: placedItemsRef.current,
              catalog: catalogRef.current,
              roomWidth: rw,
              roomLength: rl,
            });

            const resolvedCx = resolved.x + cat.wM / 2;
            const resolvedCy = resolved.y + cat.dM / 2;
            const clampedPosX = resolvedCx - rw / 2;
            const clampedPosZ = resolvedCy - rl / 2;

            // Instant 120 FPS 3D mesh movement
            itemGroup.position.x = clampedPosX;
            itemGroup.position.z = clampedPosZ;

            // Follow selection halo
            if (selectionGroupRef.current) {
              selectionGroupRef.current.position.x = clampedPosX;
              selectionGroupRef.current.position.z = clampedPosZ;
            }

            // Sync with parent state
            onMoveItemRef.current?.(itemId, resolved.x, resolved.y);
          }
        }
      } else {
        // Hover cursor feedback
        const furnitureGroup = furnitureGroupRef.current;
        if (furnitureGroup) {
          const intersects = raycaster.intersectObjects(furnitureGroup.children, true);
          let hit = false;
          if (intersects.length > 0) {
            let curr = intersects[0].object;
            while (curr && curr !== furnitureGroup) {
              if (curr.userData && curr.userData.itemId) {
                hit = true;
                break;
              }
              curr = curr.parent;
            }
          }
          dom.style.cursor = hit ? "grab" : "default";
        }
      }
    };

    const onPointerUp = (e) => {
      const dom = renderer.domElement;
      controls.enabled = true;
      if (dom) {
        dom.style.cursor = "default";
      }

      const dx = Math.abs(e.clientX - dragStateRef.current.downPos.x);
      const dy = Math.abs(e.clientY - dragStateRef.current.downPos.y);

      // If clicked without dragging (< 4px), perform selection / deselection
      if (!dragStateRef.current.hasMoved && dx < 4 && dy < 4) {
        const camera = cameraRef.current;
        const furnitureGroup = furnitureGroupRef.current;
        if (dom && camera && furnitureGroup) {
          const rect = dom.getBoundingClientRect();
          const mouse = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
          );
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(furnitureGroup.children, true);
          let hitId = null;
          if (intersects.length > 0) {
            let curr = intersects[0].object;
            while (curr && curr !== furnitureGroup) {
              if (curr.userData && curr.userData.itemId) {
                hitId = curr.userData.itemId;
                break;
              }
              curr = curr.parent;
            }
          }
          // If clicked empty floor/space, hitId is null -> deselects cleanly!
          onSelectItemRef.current?.(hitId);
        }
      }

      dragStateRef.current.isDragging = false;
      dragStateRef.current.hasMoved = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

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
      domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
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
    floorTex.repeat.set(rw * 0.35, rl * 0.35);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: floorFinish === "travertine" ? 0.38 : 0.48,
      metalness: 0.04,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    roomGroup.add(floorMesh);
    floorMeshRef.current = floorMesh;

    // Base Sub-Plinth (architectural concrete slab recessed safely below the floor)
    const slabGeo = new THREE.BoxGeometry(rw + 0.14, 0.15, rl + 0.14);
    const slabMat = new THREE.MeshStandardMaterial({ color: "#D2C9BB", roughness: 0.85 });
    const slabMesh = new THREE.Mesh(slabGeo, slabMat);
    slabMesh.position.y = -0.095; // Top face is at -0.095 + 0.075 = -0.020m, safely 20mm under floor
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

    // ==========================================
    // Architectural Framed Art Assembly (Back Wall)
    // Completely eliminates z-fighting and texture shifting/blinking
    // ==========================================
    const artW = Math.min(2.0, rw * 0.4);
    const artH = 1.35;
    const frameBorder = 0.036; // 3.6 cm outer brass moulding
    const frameDepth = 0.04;   // 4.0 cm frame depth projecting off the wall
    const wallFaceZ = -rl / 2;  // Front face of back wall

    const artGroup = new THREE.Group();
    artGroup.position.set(0, 1.55, wallFaceZ);

    const brassFrameMat = new THREE.MeshStandardMaterial({
      color: "#C9A66B",
      roughness: 0.28,
      metalness: 0.8,
    });

    // 1. Backboard (mounted directly on wall face, thin backing)
    const backboardGeo = new THREE.BoxGeometry(artW + frameBorder * 2, artH + frameBorder * 2, 0.008);
    const backboardMat = new THREE.MeshStandardMaterial({
      color: "#1E1A16",
      roughness: 0.85,
    });
    const backboard = new THREE.Mesh(backboardGeo, backboardMat);
    backboard.position.set(0, 0, 0.004);
    backboard.castShadow = true;
    artGroup.add(backboard);

    // 2. Four Frame Moulding Bars (Bordering the canvas with zero overlapping center face)
    // Top Bar
    const topBarGeo = new THREE.BoxGeometry(artW + frameBorder * 2, frameBorder, frameDepth);
    const topBar = new THREE.Mesh(topBarGeo, brassFrameMat);
    topBar.position.set(0, artH / 2 + frameBorder / 2, frameDepth / 2);
    topBar.castShadow = true;
    artGroup.add(topBar);

    // Bottom Bar
    const botBarGeo = new THREE.BoxGeometry(artW + frameBorder * 2, frameBorder, frameDepth);
    const botBar = new THREE.Mesh(botBarGeo, brassFrameMat);
    botBar.position.set(0, -artH / 2 - frameBorder / 2, frameDepth / 2);
    botBar.castShadow = true;
    artGroup.add(botBar);

    // Left Bar
    const leftBarGeo = new THREE.BoxGeometry(frameBorder, artH, frameDepth);
    const leftBar = new THREE.Mesh(leftBarGeo, brassFrameMat);
    leftBar.position.set(-artW / 2 - frameBorder / 2, 0, frameDepth / 2);
    leftBar.castShadow = true;
    artGroup.add(leftBar);

    // Right Bar
    const rightBarGeo = new THREE.BoxGeometry(frameBorder, artH, frameDepth);
    const rightBar = new THREE.Mesh(rightBarGeo, brassFrameMat);
    rightBar.position.set(artW / 2 + frameBorder / 2, 0, frameDepth / 2);
    rightBar.castShadow = true;
    artGroup.add(rightBar);

    // 3. Gallery Canvas Artwork (recessed inside frame by 8mm, with its own dedicated depth)
    const artGeo = new THREE.PlaneGeometry(artW, artH);
    const artMat = new THREE.MeshStandardMaterial({
      map: artTextureRef.current,
      roughness: 0.8,
      metalness: 0.02,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const artMesh = new THREE.Mesh(artGeo, artMat);
    artMesh.position.set(0, 0, frameDepth - 0.008);
    artMesh.receiveShadow = false; // Prevent shadow acne/striping on canvas surface
    artGroup.add(artMesh);

    roomGroup.add(artGroup);

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
    frontBorder.position.set(0, 0.03, rl / 2 + 0.015);
    roomGroup.add(frontBorder);

    const rightBorderGeo = new THREE.BoxGeometry(0.03, 0.06, rl);
    const rightBorder = new THREE.Mesh(rightBorderGeo, lowSkirtMat);
    rightBorder.position.set(rw / 2 + 0.015, 0.03, 0);
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
    // When actively dragging a piece on the floor plane, do not rebuild geometries/meshes
    if (dragStateRef.current.isDragging) return;

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
      const woodMat = cat.timber?.includes("Walnut") ? walnutWoodMat : teakWoodMat;

      // Contact Ambient Occlusion Shadow Decal on Floor (only for furniture pieces, not rugs)
      if (cat.type !== "rug") {
        const shadowGeo = new THREE.PlaneGeometry(w * 1.04, d * 1.04);
        const shadowMat = new THREE.MeshBasicMaterial({
          color: "#18120B",
          transparent: true,
          opacity: 0.18,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        });
        const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
        contactShadow.rotation.x = -Math.PI / 2;
        contactShadow.position.y = 0.002;
        itemGroup.add(contactShadow);
      }

      // Model Dispatch
      if (cat.type === "sofa") {
        const armW = 0.14;
        const innerW = w - 2 * armW;

        // Wooden Plinth Base
        const plinthH = 0.08;
        const plinthGeo = new THREE.BoxGeometry(w, plinthH, d);
        const plinth = new THREE.Mesh(plinthGeo, woodMat);
        plinth.position.y = plinthH / 2;
        plinth.castShadow = true;
        itemGroup.add(plinth);

        // Solid Timber Side Armrests
        const armH = 0.38;
        const armGeo = new THREE.BoxGeometry(armW, armH, d);
        const leftArm = new THREE.Mesh(armGeo, woodMat);
        leftArm.position.set(-w / 2 + armW / 2, 0.27, 0);
        leftArm.castShadow = true;
        itemGroup.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, woodMat);
        rightArm.position.set(w / 2 - armW / 2, 0.27, 0);
        rightArm.castShadow = true;
        itemGroup.add(rightArm);

        // Architectural Rear Timber Back Rail
        const backRailGeo = new THREE.BoxGeometry(innerW, 0.42, 0.02);
        const backRail = new THREE.Mesh(backRailGeo, woodMat);
        backRail.position.set(0, 0.29, -d / 2 + 0.01);
        backRail.castShadow = true;
        itemGroup.add(backRail);

        // Plush Seat Cushion
        const seatGeo = new THREE.BoxGeometry(innerW - 0.01, 0.26, d - 0.15);
        const seat = new THREE.Mesh(seatGeo, boucléFabricMat);
        seat.position.set(0, 0.21, 0.05);
        seat.castShadow = true;
        itemGroup.add(seat);

        // Tall, Elegant Architectural Backrest Cushion (restored to full tall luxury height)
        const backH = 0.50;
        const backGeo = new THREE.BoxGeometry(innerW - 0.01, backH, 0.18);
        const back = new THREE.Mesh(backGeo, boucléFabricMat);
        back.position.set(0, 0.47, -d / 2 + 0.1);
        back.castShadow = true;
        itemGroup.add(back);

        // Luxury Accent Throw Pillows
        const pillowMat = new THREE.MeshStandardMaterial({ color: "#C9A66B", roughness: 0.82 });
        const pillowGeo = new THREE.BoxGeometry(0.24, 0.22, 0.1);
        const lp = new THREE.Mesh(pillowGeo, pillowMat);
        lp.position.set(-innerW / 2 + 0.18, 0.38, -d / 2 + 0.20);
        lp.rotation.y = 0.25;
        lp.castShadow = true;
        itemGroup.add(lp);

        const rp = new THREE.Mesh(pillowGeo, pillowMat);
        rp.position.set(innerW / 2 - 0.18, 0.38, -d / 2 + 0.20);
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
      } else if (cat.id === "nightstand") {
        // Dedicated Bedside Nightstand Cabinet
        const nsH = 0.52;
        const bodyH = 0.36;
        const legH = nsH - bodyH;

        // Nightstand Cabinet Body
        const bodyGeo = new THREE.BoxGeometry(w, bodyH, d);
        const body = new THREE.Mesh(bodyGeo, woodMat);
        body.position.y = legH + bodyH / 2;
        body.castShadow = true;
        body.receiveShadow = true;
        itemGroup.add(body);

        // Top Drawer Groove & Brass Pull Knob
        const knobGeo = new THREE.CylinderGeometry(0.015, 0.012, 0.02, 16);
        const knob = new THREE.Mesh(knobGeo, brassMat);
        knob.rotation.x = Math.PI / 2;
        knob.position.set(0, legH + bodyH * 0.72, d / 2 + 0.01);
        itemGroup.add(knob);

        // 4 Tapered Legs
        const legGeo = new THREE.CylinderGeometry(0.02, 0.012, legH, 12);
        const legOffsets = [
          [-w / 2 + 0.05, -d / 2 + 0.05],
          [w / 2 - 0.05, -d / 2 + 0.05],
          [-w / 2 + 0.05, d / 2 - 0.05],
          [w / 2 - 0.05, d / 2 - 0.05],
        ];
        legOffsets.forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(legGeo, brassMat);
          leg.position.set(lx, legH / 2, lz);
          leg.castShadow = true;
          itemGroup.add(leg);
        });
      } else if (cat.id === "wardrobe_3d" || (cat.type === "cabinet" && cat.id.includes("wardrobe"))) {
        // Architectural Master Wardrobe (Full Height ~2.05m)
        const wardH = 2.05;
        const plinthH = 0.08;
        const doorH = wardH - plinthH;

        // Main Carcass
        const carcassGeo = new THREE.BoxGeometry(w, wardH, d);
        const carcass = new THREE.Mesh(carcassGeo, woodMat);
        carcass.position.y = wardH / 2;
        carcass.castShadow = true;
        carcass.receiveShadow = true;
        itemGroup.add(carcass);

        // 3 Vertical Fluted Door Panels & Shadow Lines
        const doorW = (w - 0.04) / 3;
        for (let i = 0; i < 3; i++) {
          const doorPosX = -w / 2 + 0.02 + doorW / 2 + i * doorW;
          const doorGeo = new THREE.BoxGeometry(doorW - 0.015, doorH - 0.02, 0.015);
          const doorMesh = new THREE.Mesh(doorGeo, woodMat);
          doorMesh.position.set(doorPosX, plinthH + doorH / 2, d / 2 + 0.008);
          itemGroup.add(doorMesh);

          // Long Architectural Brass Pull
          const handleGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.35, 12);
          const handle = new THREE.Mesh(handleGeo, brassMat);
          const hOff = i === 1 ? -doorW * 0.3 : doorW * 0.3;
          handle.position.set(doorPosX + hOff, plinthH + doorH * 0.52, d / 2 + 0.025);
          itemGroup.add(handle);
        }

        // Top Crown Cornice Trim
        const crownGeo = new THREE.BoxGeometry(w + 0.04, 0.04, d + 0.04);
        const crown = new THREE.Mesh(crownGeo, brassMat);
        crown.position.y = wardH + 0.02;
        itemGroup.add(crown);
      } else if (cat.type === "table" || cat.type === "dining_set") {
        // Tabletop (Timber or Smoked Glass for Coffee Table)
        const topH = 0.05;
        const isCoffee = cat.id.includes("coffee");
        const legH = isCoffee ? 0.38 : 0.72;

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

        // Dining Chairs around Table (if dining suite or table > 1.4m)
        if (cat.id.includes("dining") || cat.type === "dining_set") {
          const chairSeats = [
            [-w * 0.28, -d / 2 - 0.28],
            [w * 0.28, -d / 2 - 0.28],
            [-w * 0.28, d / 2 + 0.28],
            [w * 0.28, d / 2 + 0.28],
          ];
          if (w >= 2.0) {
            chairSeats.push([0, -d / 2 - 0.28], [0, d / 2 + 0.28]);
          }
          chairSeats.forEach(([cxPos, czPos]) => {
            const chairGeo = new THREE.BoxGeometry(0.44, 0.44, 0.44);
            const chair = new THREE.Mesh(chairGeo, woodMat);
            chair.position.set(cxPos, 0.22, czPos);
            chair.castShadow = true;
            itemGroup.add(chair);

            const chairBackGeo = new THREE.BoxGeometry(0.44, 0.4, 0.06);
            const chairBack = new THREE.Mesh(chairBackGeo, woodMat);
            chairBack.position.set(cxPos, 0.58, czPos > 0 ? czPos + 0.19 : czPos - 0.19);
            chairBack.castShadow = true;
            itemGroup.add(chairBack);
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

      furnitureGroup.add(itemGroup);
    });
  }, [placedItems, catalog, roomWidth, roomLength]);

  // 4. Dedicated Selection Highlight Engine (Glow Halo & Bounding Wireframe)
  useEffect(() => {
    const group = selectionGroupRef.current;
    if (!group) return;

    // Clear previous selection indicators
    while (group.children.length > 0) {
      const obj = group.children[0];
      if (obj.geometry) obj.geometry.dispose();
      group.remove(obj);
    }

    if (!selectedItemId) return;

    const currentItem = placedItems.find((p) => p.id === selectedItemId);
    const cat = currentItem ? catalog.find((c) => c.id === currentItem.catId) : null;
    if (!currentItem || !cat) return;

    const rw = roomWidth;
    const rl = roomLength;
    const cx = currentItem.x + cat.wM / 2;
    const cy = currentItem.y + cat.dM / 2;
    const posX = cx - rw / 2;
    const posZ = cy - rl / 2;

    group.position.set(posX, 0, posZ);
    group.rotation.y = -THREE.MathUtils.degToRad(currentItem.rot);

    const w = cat.wM;
    const d = cat.dM;

    const isOverlapping = overlappingItemIds?.has(selectedItemId);
    const ringColor = isOverlapping ? "#EF4444" : "#C9A66B";
    const wireColor = isOverlapping ? "#FCA5A5" : "#E2BA78";

    // Golden Glow Ring on Floor (or alert rose if overlapping)
    const radius = Math.max(w, d) * 0.58;
    const ringGeo = new THREE.RingGeometry(radius, radius + 0.08, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: ringColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.006;
    group.add(ring);

    // Architectural Wireframe Bounding Box
    const boxGeo = new THREE.BoxGeometry(w + 0.06, 0.02, d + 0.06);
    const wireMat = new THREE.MeshBasicMaterial({
      color: wireColor,
      wireframe: true,
      depthWrite: false,
    });
    const wireBox = new THREE.Mesh(boxGeo, wireMat);
    wireBox.position.y = 0.01;
    group.add(wireBox);
  }, [selectedItemId, placedItems, catalog, roomWidth, roomLength, overlappingItemIds]);

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

  const activeSelectedItem = placedItems.find((p) => p.id === selectedItemId);
  const activeSelectedCat = activeSelectedItem
    ? catalog.find((c) => c.id === activeSelectedItem.catId)
    : null;

  return (
    <div
      ref={rootRef}
      className={`relative w-full h-[420px] xs:h-[480px] sm:h-auto sm:aspect-[16/10] bg-[#F3EEE5] border-2 border-brass/35 rounded-sm select-none shadow-2xl transition-all ${
        isFullscreen ? "fixed inset-0 z-50 h-auto aspect-auto rounded-none border-0" : ""
      }`}
    >
      {/* 3D WebGL Canvas Mount Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* DSLR Shutter Flash Effect */}
      <div
        className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-300 z-30 ${
          flashEffect ? "opacity-85" : "opacity-0"
        }`}
      />

      {/* Top Floating Luxury HUD Bar (Ultra-responsive single-row floating capsules) */}
      <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between gap-1.5 pointer-events-none z-20">
        {/* Left: Camera Angle Presets & Orbit Controls */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 bg-[#FAF8F5]/95 backdrop-blur-xl px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-full border border-[#E5DFD5] shadow-[0_2px_12px_rgba(0,0,0,0.06)] pointer-events-auto shrink-0">
          <button
            type="button"
            onClick={() => setCameraPreset("iso")}
            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[0.68rem] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeCamPreset === "iso"
                ? "border border-[#C2A478] bg-[#EFE8DD] text-[#1F1E1B] shadow-2xs"
                : "border border-transparent text-[#7A756D] hover:text-[#1F1E1B]"
            }`}
          >
            3D
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset("front")}
            className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[0.68rem] sm:text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
              activeCamPreset === "front"
                ? "border border-[#C2A478] bg-[#EFE8DD] text-[#1F1E1B] font-bold shadow-2xs"
                : "border border-transparent text-[#7A756D] hover:text-[#1F1E1B]"
            }`}
          >
            FRONT
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset("top")}
            className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[0.68rem] sm:text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
              activeCamPreset === "top"
                ? "border border-[#C2A478] bg-[#EFE8DD] text-[#1F1E1B] font-bold shadow-2xs"
                : "border border-transparent text-[#7A756D] hover:text-[#1F1E1B]"
            }`}
          >
            TOP
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset("eye")}
            className={`p-1 sm:p-1.5 rounded-full transition-all cursor-pointer hidden xs:inline-flex ${
              activeCamPreset === "eye"
                ? "border border-[#C2A478] bg-[#EFE8DD] text-[#1F1E1B] shadow-2xs"
                : "border border-transparent text-[#7A756D] hover:text-[#1F1E1B]"
            }`}
            title={lang === "bn" ? "আই-লেভেল ওয়াকথ্রু" : "Eye-Level Walkthrough"}
          >
            <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>

          {/* Subtle Vertical Divider */}
          <div className="w-[1px] h-3 sm:h-4 bg-[#E2DDD5] mx-0.5" />

          {/* Auto-Orbit 360° */}
          <button
            type="button"
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`w-6 h-6 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center border border-[#C2A478] bg-[#EFE8DD] text-[#1F1E1B] transition-all cursor-pointer ${
              autoRotate ? "shadow-2xs ring-2 ring-[#C2A478]/30" : "hover:brightness-95"
            }`}
            title={t("planner.autoRotate")}
          >
            <Rotate3d className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${autoRotate ? "animate-spin" : ""}`} />
          </button>

          {/* Reset Camera View */}
          <button
            type="button"
            onClick={() => setCameraPreset("iso")}
            className="w-6 h-6 sm:w-7.5 sm:h-7.5 rounded-full text-[#7A756D] hover:text-[#1F1E1B] hover:bg-[#EAE4D9]/60 flex items-center justify-center transition-all cursor-pointer"
            title="Reset View"
          >
            <RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>

        {/* Right: Studio Atmosphere & Action Tools (Individual standalone floating luxury pills on desktop) */}
        <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto shrink-0">
          {/* Day / Evening Mood Switcher */}
          <button
            type="button"
            onClick={() => setLightingMood((prev) => (prev === "day" ? "evening" : "day"))}
            className={`inline-flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full backdrop-blur-xl border transition-all shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-xs font-medium cursor-pointer ${
              lightingMood === "evening"
                ? "border border-[#C2A478] bg-[#EFE8DD] text-[#1F1E1B] font-bold shadow-2xs"
                : "bg-[#FAF8F5]/95 text-[#7A756D] border-[#E5DFD5] hover:text-[#1F1E1B] hover:bg-[#F2ECE1]"
            }`}
            title="Toggle Daylight / Evening Mood"
          >
            {lightingMood === "evening" ? (
              <>
                <Moon className="h-3.5 w-3.5 text-[#C2A478] fill-current" />
                <span className="hidden sm:inline">{t("planner.moodNight")}</span>
              </>
            ) : (
              <>
                <Sun className="h-3.5 w-3.5 text-[#C2A478]" />
                <span className="hidden sm:inline">{t("planner.moodDay")}</span>
              </>
            )}
          </button>

          {/* Floor Finish Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFloorMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 bg-[#FAF8F5]/95 hover:bg-[#F2ECE1] text-[#4A443D] hover:text-[#1F1E1B] p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-[#E5DFD5] backdrop-blur-xl text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-all cursor-pointer"
              title={t("planner.floorFinish")}
            >
              <Layers className="h-3.5 w-3.5 text-[#C2A478]" />
              <span className="hidden sm:inline">
                {floorFinish === "teak_parquet"
                  ? t("planner.floorTeak")
                  : floorFinish === "walnut_herringbone"
                  ? t("planner.floorWalnut")
                  : floorFinish === "white_oak"
                  ? t("planner.floorOak")
                  : t("planner.floorStone")}
              </span>
              <ChevronDown className="h-3 w-3 text-[#7A756D] hidden sm:inline" />
            </button>

            {/* Floor Finish Dropdown */}
            {isFloorMenuOpen && (
              <>
                {/* Backdrop click-catcher for mobile touch screens */}
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsFloorMenuOpen(false)}
                />
                <div
                  onMouseLeave={() => setIsFloorMenuOpen(false)}
                  className="absolute right-0 top-full mt-2 w-44 sm:w-48 max-w-[calc(100vw-24px)] bg-[#FAF8F5]/98 backdrop-blur-2xl border border-[#E5DFD5] rounded-xl p-1.5 shadow-2xl z-40 space-y-1"
                >
                  <div className="px-2.5 py-1 text-[0.62rem] uppercase tracking-wider text-[#A67C52] font-mono border-b border-[#EAE4D9] font-bold">
                    {t("planner.floorFinish")}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFloorFinish("teak_parquet");
                      setIsFloorMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      floorFinish === "teak_parquet" ? "bg-[#EFE8DD] text-[#1F1E1B] font-bold border border-[#C2A478]/40" : "text-[#4A443D] hover:bg-[#F2ECE1]"
                    }`}
                  >
                    <span>{t("planner.floorTeak")}</span>
                    {floorFinish === "teak_parquet" && <span className="h-1.5 w-1.5 rounded-full bg-[#C2A478]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFloorFinish("walnut_herringbone");
                      setIsFloorMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      floorFinish === "walnut_herringbone" ? "bg-[#EFE8DD] text-[#1F1E1B] font-bold border border-[#C2A478]/40" : "text-[#4A443D] hover:bg-[#F2ECE1]"
                    }`}
                  >
                    <span>{t("planner.floorWalnut")}</span>
                    {floorFinish === "walnut_herringbone" && <span className="h-1.5 w-1.5 rounded-full bg-[#C2A478]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFloorFinish("white_oak");
                      setIsFloorMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      floorFinish === "white_oak" ? "bg-[#EFE8DD] text-[#1F1E1B] font-bold border border-[#C2A478]/40" : "text-[#4A443D] hover:bg-[#F2ECE1]"
                    }`}
                  >
                    <span>{t("planner.floorOak")}</span>
                    {floorFinish === "white_oak" && <span className="h-1.5 w-1.5 rounded-full bg-[#C2A478]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFloorFinish("travertine");
                      setIsFloorMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      floorFinish === "travertine" ? "bg-[#EFE8DD] text-[#1F1E1B] font-bold border border-[#C2A478]/40" : "text-[#4A443D] hover:bg-[#F2ECE1]"
                    }`}
                  >
                    <span>{t("planner.floorStone")}</span>
                    {floorFinish === "travertine" && <span className="h-1.5 w-1.5 rounded-full bg-[#C2A478]" />}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 3D 4K Photo Snapshot */}
          <button
            type="button"
            onClick={handleCaptureSnapshot}
            disabled={isSnapshotting}
            className="inline-flex items-center gap-1.5 bg-[#FAF8F5]/95 hover:bg-[#F2ECE1] text-[#4A443D] hover:text-[#1F1E1B] p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-[#E5DFD5] backdrop-blur-xl text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-all cursor-pointer"
            title={t("planner.snapshot")}
          >
            <Camera className="h-3.5 w-3.5 text-[#C2A478]" />
            <span className="hidden sm:inline">{t("planner.snapshot")}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-1.5 sm:p-2 rounded-full bg-[#FAF8F5]/95 hover:bg-[#F2ECE1] text-[#4A443D] hover:text-[#1F1E1B] border border-[#E5DFD5] backdrop-blur-xl transition-all shadow-[0_2px_10px_rgba(0,0,0,0.06)] cursor-pointer"
            title={t("planner.fullscreen")}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Bottom Left Status Badge */}
      <div className="absolute bottom-3 left-3 bg-[#FAF8F5]/95 text-[#2D2A26] backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-[#E5DFD5] text-[0.62rem] sm:text-[0.65rem] font-mono pointer-events-none shadow-xl flex items-center gap-2 z-20">
        <span className="flex h-2 w-2 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
        </span>
        <span className="text-[#8C6239] font-bold tracking-wider shrink-0">3D WEBGL STUDIO</span>
        <span className="text-[#A89F91]">·</span>
        <span>
          {roomWidth.toFixed(1)}m × {roomLength.toFixed(1)}m ({placedItems.length}{" "}
          {lang === "bn" ? "টি সামগ্রী" : "Pieces"})
        </span>
      </div>

      {/* Bottom Right Interaction Guide */}
      <div className="absolute bottom-3 right-3 bg-[#FAF8F5]/95 text-[#5C554E] backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-[#E5DFD5] text-[0.62rem] font-mono pointer-events-none shadow-xl hidden md:flex items-center gap-1.5 z-20">
        <Sparkles className="h-3 w-3 text-[#C2A478] shrink-0" />
        <span>
          {lang === "bn"
            ? "ঘোরাতে ড্র্যাগ করুন · জুম করতে স্ক্রোল · সিলেক্ট করতে ক্লিক করুন"
            : "Left-Click: Orbit 360° · Scroll: Zoom · Right-Click: Pan · Click Piece to Inspect"}
        </span>
      </div>
    </div>
  );
}
