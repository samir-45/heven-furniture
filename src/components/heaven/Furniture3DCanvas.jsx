import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Rotate3d, Sparkles, RefreshCw } from "lucide-react";

export default function Furniture3DCanvas({
  category,
  wood,
  fabric,
  finish,
  width,
  depth,
  height,
}) {
  const mountRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const furnitureGroupRef = useRef(null);

  // 1. Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const widthPx = container.clientWidth || 600;
    const heightPx = container.clientHeight || 360;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F4F1EA");
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, widthPx / heightPx, 0.1, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(widthPx, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Keep camera above studio floor
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight("#FAF7F0", 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight("#FFF8E7", 2.2);
    keyLight.position.set(4.5, 6.5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.radius = 3;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight("#E8DFCF", 1.3);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight("#FFFFFF", 0.9);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    // Floor & Studio Pedestal
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    const diskGeo = new THREE.CircleGeometry(2.8, 64);
    const diskMat = new THREE.MeshBasicMaterial({ color: "#ECE7DE", transparent: true, opacity: 0.65 });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.rotation.x = -Math.PI / 2;
    disk.position.y = 0.001;
    scene.add(disk);

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

  // Build Connected Parametric 3D Furniture Meshes
  useEffect(() => {
    const group = furnitureGroupRef.current;
    if (!group) return;

    // Clear previous geometries and meshes
    while (group.children.length > 0) {
      const obj = group.children[0];
      if (obj.geometry) obj.geometry.dispose();
      group.remove(obj);
    }

    const woodColors = {
      teak: "#9C6B3C",
      walnut: "#5C3A21",
      oak: "#C8A47E",
      mahogany: "#6D2E1F",
    };

    const fabricColors = {
      linen: "#D9CFBE",
      velvet: "#3B2A20",
      boucle: "#EAE7DF",
      leather: "#4A3528",
    };

    const finishRoughness = {
      natural: 0.52,
      stained: 0.35,
      handrubbed: 0.24,
    };

    const woodMat = new THREE.MeshStandardMaterial({
      color: woodColors[wood.id] || "#9C6B3C",
      roughness: finishRoughness[finish.id] || 0.45,
      metalness: 0.06,
    });

    const fabricMat = new THREE.MeshStandardMaterial({
      color: fabricColors[fabric.id] || "#D9CFBE",
      roughness: fabric.id === "leather" ? 0.32 : 0.88,
      metalness: fabric.id === "leather" ? 0.12 : 0.0,
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

    if (category.id === "sofa") {
      const legH = 0.08;
      const baseH = 0.10;
      const topOfBase = legH + baseH;

      // 4 Solid Turned Wood Legs
      const legGeo = new THREE.CylinderGeometry(0.035, 0.025, legH, 16);
      const legX = W / 2 - 0.14;
      const legZ = D / 2 - 0.14;
      addMesh(legGeo, woodMat, [legX, legH / 2, legZ]);
      addMesh(legGeo, woodMat, [-legX, legH / 2, legZ]);
      addMesh(legGeo, woodMat, [legX, legH / 2, -legZ]);
      addMesh(legGeo, woodMat, [-legX, legH / 2, -legZ]);

      // Base Plinth (rests directly on top of legs)
      const baseGeo = new THREE.BoxGeometry(W, baseH, D);
      addMesh(baseGeo, woodMat, [0, legH + baseH / 2, 0]);

      // Side Armrests (rest directly on top of base plinth)
      const armW = 0.18;
      const armH = Math.max(0.24, H * 0.72 - topOfBase);
      const armGeo = new THREE.BoxGeometry(armW, armH, D);
      addMesh(armGeo, fabricMat, [W / 2 - armW / 2, topOfBase + armH / 2, 0]);
      addMesh(armGeo, fabricMat, [-W / 2 + armW / 2, topOfBase + armH / 2, 0]);

      // Seat Cushion (rests on base plinth between arms)
      const seatW = W - 2 * armW;
      const seatH = 0.20;
      const seatD = D - 0.18;
      const seatGeo = new THREE.BoxGeometry(seatW, seatH, seatD);
      addMesh(seatGeo, fabricMat, [0, topOfBase + seatH / 2, 0.09]);

      // Backrest (anchored to top of base plinth, extends to H)
      const backH = Math.max(0.35, H - topOfBase);
      const backD = 0.18;
      const backGeo = new THREE.BoxGeometry(seatW, backH, backD);
      // Center Y is mathematically pinned so bottom touches topOfBase
      addMesh(backGeo, fabricMat, [0, topOfBase + backH / 2, -D / 2 + backD / 2], [-0.04, 0, 0]);

      // Throw Pillows (nestled on seat cushion against arms)
      const pillowSize = Math.min(0.42, seatW / 3);
      const pillowGeo = new THREE.BoxGeometry(pillowSize, pillowSize, 0.14);
      addMesh(pillowGeo, fabricMat, [seatW / 2 - pillowSize / 2, topOfBase + seatH + pillowSize / 2 * 0.7, 0.08], [0, -0.28, 0.18]);
      addMesh(pillowGeo, fabricMat, [-seatW / 2 + pillowSize / 2, topOfBase + seatH + pillowSize / 2 * 0.7, 0.08], [0, 0.28, -0.18]);

    } else if (category.id === "bed") {
      const legH = 0.10;
      const frameH = 0.18;
      const topOfFrame = legH + frameH;

      // Legs
      const legGeo = new THREE.CylinderGeometry(0.045, 0.03, legH, 16);
      const legX = W / 2 - 0.08;
      const legZ = D / 2 - 0.08;
      addMesh(legGeo, woodMat, [legX, legH / 2, legZ]);
      addMesh(legGeo, woodMat, [-legX, legH / 2, legZ]);
      addMesh(legGeo, woodMat, [legX, legH / 2, -legZ]);
      addMesh(legGeo, woodMat, [-legX, legH / 2, -legZ]);

      // Solid Frame
      const frameGeo = new THREE.BoxGeometry(W, frameH, D);
      addMesh(frameGeo, woodMat, [0, legH + frameH / 2, 0]);

      // Headboard (permanently anchored from bottom of frame up to H)
      const headH = Math.max(0.5, H - legH);
      const headGeo = new THREE.BoxGeometry(W + 0.14, headH, 0.14);
      addMesh(headGeo, woodMat, [0, legH + headH / 2, -D / 2 + 0.07]);

      // Headboard Upholstered Inset
      const panelH = headH * 0.65;
      const panelGeo = new THREE.BoxGeometry(W - 0.12, panelH, 0.06);
      addMesh(panelGeo, fabricMat, [0, topOfFrame + panelH / 2, -D / 2 + 0.14]);

      // Mattress (rests on frame)
      const mattressH = 0.24;
      const mattressGeo = new THREE.BoxGeometry(W - 0.12, mattressH, D - 0.20);
      addMesh(mattressGeo, fabricMat, [0, topOfFrame + mattressH / 2, 0.08]);

      // Duvet fold
      const duvetGeo = new THREE.BoxGeometry(W - 0.08, 0.07, (D - 0.20) * 0.62);
      addMesh(duvetGeo, fabricMat, [0, topOfFrame + mattressH + 0.035, 0.32]);

      // Sleeping Pillows
      const pillowGeo = new THREE.BoxGeometry(W * 0.34, 0.14, 0.36);
      addMesh(pillowGeo, fabricMat, [W * 0.22, topOfFrame + mattressH + 0.07, -D / 2 + 0.40], [0.22, 0, 0]);
      addMesh(pillowGeo, fabricMat, [-W * 0.22, topOfFrame + mattressH + 0.07, -D / 2 + 0.40], [0.22, 0, 0]);

    } else if (category.id === "dining") {
      const topThick = 0.06;
      const topOfTable = H;
      const legH = topOfTable - topThick;

      // Table Top
      const topGeo = new THREE.BoxGeometry(W, topThick, D);
      addMesh(topGeo, woodMat, [0, topOfTable - topThick / 2, 0]);

      // 4 Solid Legs (connected from floor y=0 up to bottom of table top)
      const legGeo = new THREE.BoxGeometry(0.08, legH, 0.08);
      const legX = W / 2 - 0.14;
      const legZ = D / 2 - 0.14;
      addMesh(legGeo, woodMat, [legX, legH / 2, legZ]);
      addMesh(legGeo, woodMat, [-legX, legH / 2, legZ]);
      addMesh(legGeo, woodMat, [legX, legH / 2, -legZ]);
      addMesh(legGeo, woodMat, [-legX, legH / 2, -legZ]);

      // Under-top Apron Beams
      const aprGeoX = new THREE.BoxGeometry(W - 0.28, 0.06, 0.03);
      addMesh(aprGeoX, woodMat, [0, topOfTable - topThick - 0.03, D / 2 - 0.14]);
      addMesh(aprGeoX, woodMat, [0, topOfTable - topThick - 0.03, -D / 2 + 0.14]);

      // Flanking Dining Chairs
      const createChair = (x, z, rotY) => {
        const chairGroup = new THREE.Group();
        chairGroup.position.set(x, 0, z);
        chairGroup.rotation.y = rotY;

        const cSeat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.42), woodMat);
        cSeat.position.y = 0.46;
        cSeat.castShadow = true;
        chairGroup.add(cSeat);

        const cLegGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.46, 12);
        [
          [0.17, 0.17],
          [-0.17, 0.17],
          [0.17, -0.17],
          [-0.17, -0.17],
        ].forEach(([cx, cz]) => {
          const cl = new THREE.Mesh(cLegGeo, woodMat);
          cl.position.set(cx, 0.23, cz);
          cl.castShadow = true;
          chairGroup.add(cl);
        });

        const cBack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.04), woodMat);
        cBack.position.set(0, 0.67, -0.19);
        cBack.castShadow = true;
        chairGroup.add(cBack);

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

      // Base Plinth
      const plinthGeo = new THREE.BoxGeometry(W + 0.04, plinthH, D + 0.02);
      addMesh(plinthGeo, woodMat, [0, plinthH / 2, 0]);

      // Main Cabinet Body
      const bodyGeo = new THREE.BoxGeometry(W, bodyH, D);
      addMesh(bodyGeo, woodMat, [0, plinthH + bodyH / 2, 0]);

      // Top Crown Cornice
      const corniceGeo = new THREE.BoxGeometry(W + 0.08, corniceH, D + 0.04);
      addMesh(corniceGeo, woodMat, [0, plinthH + bodyH + corniceH / 2, 0]);

      // Doors
      const doorW = W / 2 - 0.02;
      const doorGeo = new THREE.BoxGeometry(doorW, bodyH - 0.06, 0.02);
      addMesh(doorGeo, woodMat, [-W / 4, plinthH + bodyH / 2, D / 2 + 0.015]);
      addMesh(doorGeo, woodMat, [W / 4, plinthH + bodyH / 2, D / 2 + 0.015]);

      // Brass Handles
      const brassMat = new THREE.MeshStandardMaterial({ color: "#C9A66B", metalness: 0.85, roughness: 0.25 });
      const handleGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.45, 16);
      addMesh(handleGeo, brassMat, [-0.06, plinthH + bodyH / 2, D / 2 + 0.035]);
      addMesh(handleGeo, brassMat, [0.06, plinthH + bodyH / 2, D / 2 + 0.035]);

    } else if (category.id === "chair") {
      const legH = 0.22;

      // Angled Timber Legs
      const legGeo = new THREE.CylinderGeometry(0.03, 0.02, legH, 16);
      addMesh(legGeo, woodMat, [W / 2 - 0.08, legH / 2, D / 2 - 0.1], [0.12, 0, -0.12]);
      addMesh(legGeo, woodMat, [-W / 2 + 0.08, legH / 2, D / 2 - 0.1], [0.12, 0, 0.12]);
      addMesh(legGeo, woodMat, [W / 2 - 0.08, legH / 2, -D / 2 + 0.1], [-0.12, 0, -0.12]);
      addMesh(legGeo, woodMat, [-W / 2 + 0.08, legH / 2, -D / 2 + 0.1], [-0.12, 0, 0.12]);

      // Deep Seat Cushion (rests on legs)
      const seatH = 0.18;
      const seatGeo = new THREE.BoxGeometry(W - 0.06, seatH, D - 0.12);
      addMesh(seatGeo, fabricMat, [0, legH + seatH / 2, 0.03]);

      // Backrest (anchored to top of seat, extends to H)
      const backH = Math.max(0.35, H - legH);
      const backGeo = new THREE.BoxGeometry(W - 0.06, backH, 0.15);
      addMesh(backGeo, fabricMat, [0, legH + backH / 2, -D / 2 + 0.15], [-0.15, 0, 0]);

      // Sculpted Wooden Armrests
      const armH = Math.max(0.18, H * 0.65 - legH);
      const armGeo = new THREE.BoxGeometry(0.06, 0.04, D * 0.85);
      addMesh(armGeo, woodMat, [W / 2 - 0.03, legH + armH, 0]);
      addMesh(armGeo, woodMat, [-W / 2 + 0.03, legH + armH, 0]);
    }

    // Dynamic Camera Framing — perfectly centers and fits any size without clipping
    if (cameraRef.current && controlsRef.current && mountRef.current) {
      const box = new THREE.Box3().setFromObject(group);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      const maxDim = Math.max(size.x, size.y * 1.3, size.z);
      const aspect = cameraRef.current.aspect || 1.6;
      const fovRad = (cameraRef.current.fov * Math.PI) / 180;
      const distV = (maxDim * 0.9) / Math.tan(fovRad / 2);
      const distH = (maxDim * 0.9) / (Math.tan(fovRad / 2) * aspect);
      const distance = Math.max(distV, distH, 3.8);

      const azimuth = Math.PI / 4;
      const elevation = 0.38;

      const camX = distance * Math.cos(elevation) * Math.sin(azimuth);
      const camY = distance * Math.sin(elevation) + center.y;
      const camZ = distance * Math.cos(elevation) * Math.cos(azimuth);

      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.lookAt(center);
      controlsRef.current.target.set(0, center.y, 0);
      controlsRef.current.update();
    }
  }, [category, wood, fabric, finish, width, depth, height]);

  const handleResetCamera = () => {
    if (!furnitureGroupRef.current || !cameraRef.current || !controlsRef.current) return;
    const box = new THREE.Box3().setFromObject(furnitureGroupRef.current);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y * 1.3, size.z);
    const distance = Math.max(maxDim * 1.8, 4.0);
    const azimuth = Math.PI / 4;
    const elevation = 0.38;

    cameraRef.current.position.set(
      distance * Math.cos(elevation) * Math.sin(azimuth),
      distance * Math.sin(elevation) + center.y,
      distance * Math.cos(elevation) * Math.cos(azimuth)
    );
    controlsRef.current.target.set(0, center.y, 0);
    controlsRef.current.update();
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[2.1/1] rounded-sm bg-[#F4F1EA] border border-ink/10 overflow-hidden shadow-inner select-none touch-pan-y">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Floating Dimension Badge */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-bone/95 backdrop-blur-md border border-ink/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-sm text-[0.55rem] sm:text-[0.64rem] tracking-wider uppercase text-ink/75 font-medium z-10 flex items-center gap-1.5 shadow-sm pointer-events-none">
        <Sparkles className="h-3 w-3 text-bronze shrink-0" />
        <span>{width} × {depth} × {height} cm</span>
      </div>

      {/* Top Right Material Tag */}
      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-depth/90 backdrop-blur-md border border-brass/35 px-2 sm:px-3 py-1 sm:py-1.5 rounded-sm text-[0.55rem] sm:text-[0.62rem] tracking-wider text-brass font-light z-10 shadow-sm pointer-events-none uppercase">
        {wood.id} {category.hasFabric && `· ${fabric.id}`}
      </div>

      {/* Bottom Center 360° Drag Hint */}
      <div className="hidden xs:flex absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 bg-bone/85 backdrop-blur-md border border-ink/10 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[0.54rem] sm:text-[0.6rem] tracking-[0.14em] uppercase text-ink/60 font-medium z-10 items-center gap-1.5 shadow-sm pointer-events-none">
        <Rotate3d className="h-3 w-3 text-bronze animate-spin-slow" />
        <span>360° View</span>
      </div>

      {/* Bottom Right Control Actions */}
      <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 flex items-center gap-1.5 z-10">
        <button
          type="button"
          onClick={() => setAutoRotate((v) => !v)}
          title={autoRotate ? "Pause Auto-Rotation" : "Start Auto-Rotation"}
          className={`p-1.5 sm:p-2 rounded-full border text-xs shadow-sm transition-colors cursor-pointer ${
            autoRotate
              ? "bg-depth text-bone border-brass/40"
              : "bg-bone/90 text-ink/70 border-ink/15 hover:text-ink"
          }`}
        >
          <Rotate3d className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
        </button>

        <button
          type="button"
          onClick={handleResetCamera}
          title="Reset Camera View"
          className="p-1.5 sm:p-2 rounded-full border bg-bone/90 text-ink/70 border-ink/15 hover:text-ink shadow-sm transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
        </button>
      </div>
    </div>
  );
}
