import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Rotate3d, Sparkles, RefreshCw } from "lucide-react";

// Optimal Isometric Camera Calculation to keep 3D models 100% centered and fitted
function setOptimalCamera(camera, controls, widthPx, heightPx) {
  if (!camera || widthPx <= 0 || heightPx <= 0) return;
  const aspect = widthPx / heightPx;
  camera.aspect = aspect;
  camera.fov = 40;

  // Maximum furniture bounding radius
  const radius = 1.75;
  const vFovRad = (camera.fov * Math.PI) / 180;
  const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * aspect);

  // Compute required distance to fit completely without any cropping
  const distV = (radius * 1.3) / Math.tan(vFovRad / 2);
  const distH = (radius * 1.3) / Math.tan(hFovRad / 2);
  const distance = Math.max(distV, distH, 4.2);

  // 45° azimuth, 22° elevation
  const azimuth = Math.PI / 4;
  const elevation = 0.38;

  const x = distance * Math.cos(elevation) * Math.sin(azimuth);
  const y = distance * Math.sin(elevation) + 0.38;
  const z = distance * Math.cos(elevation) * Math.cos(azimuth);

  camera.position.set(x, y, z);
  camera.updateProjectionMatrix();

  if (controls) {
    controls.target.set(0, 0.38, 0);
    controls.minDistance = distance * 0.5;
    controls.maxDistance = distance * 2.8;
    controls.update();
  }
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
  const mountRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const furnitureGroupRef = useRef(null);
  const materialsRef = useRef({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const widthPx = container.clientWidth || 600;
    const heightPx = container.clientHeight || 360;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F4F1EA");

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, widthPx / heightPx, 0.1, 100);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(widthPx, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go below floor
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.9;
    controlsRef.current = controls;

    // Center and frame camera initially
    setOptimalCamera(camera, controls, widthPx, heightPx);

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight("#FAF7F0", 1.25);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight("#FFF8E7", 2.2);
    keyLight.position.set(4, 6, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.radius = 3;
    scene.add(keyLight);

    // Warm Fill Light
    const fillLight = new THREE.DirectionalLight("#E8DFCF", 1.4);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // Soft Top Rim Light
    const rimLight = new THREE.DirectionalLight("#FFFFFF", 1.0);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    // 6. Luxury Ground Floor with Circular Contact Shadow
    const floorGeo = new THREE.PlaneGeometry(14, 14);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Studio pedestal disk
    const diskGeo = new THREE.CircleGeometry(2.4, 64);
    const diskMat = new THREE.MeshBasicMaterial({ color: "#ECE7DE", transparent: true, opacity: 0.65 });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.rotation.x = -Math.PI / 2;
    disk.position.y = 0.001;
    scene.add(disk);

    // 7. Dynamic Furniture Model Group
    const furnitureGroup = new THREE.Group();
    scene.add(furnitureGroup);
    furnitureGroupRef.current = furnitureGroup;

    // Resize Observer for dynamic responsiveness across all device rotations and resize events
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      setOptimalCamera(camera, controls, w, h);
    });
    resizeObserver.observe(container);

    // 8. Animation Loop
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

  // Update Controls autoRotate on state change
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Update Materials & Dynamic 3D Meshes
  useEffect(() => {
    const group = furnitureGroupRef.current;
    if (!group) return;

    // Clear old meshes
    while (group.children.length > 0) {
      const obj = group.children[0];
      if (obj.geometry) obj.geometry.dispose();
      group.remove(obj);
    }

    // Material definitions
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
      natural: 0.55,
      stained: 0.35,
      handrubbed: 0.25,
    };

    const woodMat = new THREE.MeshStandardMaterial({
      color: woodColors[wood.id] || "#9C6B3C",
      roughness: finishRoughness[finish.id] || 0.45,
      metalness: 0.08,
    });

    const fabricMat = new THREE.MeshStandardMaterial({
      color: fabricColors[fabric.id] || "#D9CFBE",
      roughness: fabric.id === "leather" ? 0.35 : 0.88,
      metalness: fabric.id === "leather" ? 0.12 : 0.0,
    });

    materialsRef.current = { woodMat, fabricMat };

    const scaleW = width / 200;
    const scaleD = depth / 90;
    const scaleH = height / 80;

    const addMesh = (geo, mat, pos = [0, 0, 0], rot = [0, 0, 0]) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.rotation.set(...rot);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    };

    if (category.id === "sofa") {
      const sofaW = 2.1 * scaleW;
      const sofaD = 0.9 * scaleD;
      const sofaH = 0.82 * scaleH;

      const baseGeo = new THREE.BoxGeometry(sofaW, 0.14, sofaD);
      addMesh(baseGeo, woodMat, [0, 0.12, 0]);

      const legGeo = new THREE.CylinderGeometry(0.035, 0.025, 0.12, 16);
      const legX = sofaW / 2 - 0.12;
      const legZ = sofaD / 2 - 0.12;
      addMesh(legGeo, woodMat, [legX, 0.06, legZ]);
      addMesh(legGeo, woodMat, [-legX, 0.06, legZ]);
      addMesh(legGeo, woodMat, [legX, 0.06, -legZ]);
      addMesh(legGeo, woodMat, [-legX, 0.06, -legZ]);

      const seatGeo = new THREE.BoxGeometry(sofaW - 0.36, 0.22, sofaD - 0.22);
      addMesh(seatGeo, fabricMat, [0, 0.28, 0.04]);

      const backGeo = new THREE.BoxGeometry(sofaW - 0.36, sofaH * 0.58, 0.22);
      addMesh(backGeo, fabricMat, [0, 0.58 * scaleH, -sofaD / 2 + 0.16], [-0.08, 0, 0]);

      const armGeo = new THREE.BoxGeometry(0.18, sofaH * 0.54, sofaD - 0.06);
      addMesh(armGeo, fabricMat, [sofaW / 2 - 0.09, 0.44 * scaleH, 0]);
      addMesh(armGeo, fabricMat, [-sofaW / 2 + 0.09, 0.44 * scaleH, 0]);

      const pillowGeo = new THREE.BoxGeometry(0.42, 0.42, 0.16);
      addMesh(pillowGeo, fabricMat, [sofaW / 2 - 0.32, 0.42 * scaleH, 0.06], [0, -0.3, 0.2]);
      addMesh(pillowGeo, fabricMat, [-sofaW / 2 + 0.32, 0.42 * scaleH, 0.06], [0, 0.3, -0.2]);
    } else if (category.id === "bed") {
      const bedW = 1.9 * scaleW;
      const bedL = 2.15 * scaleD;
      const bedH = 1.1 * scaleH;

      const frameGeo = new THREE.BoxGeometry(bedW, 0.22, bedL);
      addMesh(frameGeo, woodMat, [0, 0.18, 0]);

      const legGeo = new THREE.CylinderGeometry(0.045, 0.03, 0.12, 16);
      const legX = bedW / 2 - 0.08;
      const legZ = bedL / 2 - 0.08;
      addMesh(legGeo, woodMat, [legX, 0.06, legZ]);
      addMesh(legGeo, woodMat, [-legX, 0.06, legZ]);
      addMesh(legGeo, woodMat, [legX, 0.06, -legZ]);
      addMesh(legGeo, woodMat, [-legX, 0.06, -legZ]);

      const headboardGeo = new THREE.BoxGeometry(bedW + 0.14, bedH * 0.72, 0.16);
      addMesh(headboardGeo, woodMat, [0, 0.65 * scaleH, -bedL / 2 + 0.08]);

      const headPanelGeo = new THREE.BoxGeometry(bedW - 0.12, bedH * 0.54, 0.08);
      addMesh(headPanelGeo, fabricMat, [0, 0.68 * scaleH, -bedL / 2 + 0.15]);

      const mattressGeo = new THREE.BoxGeometry(bedW - 0.12, 0.28, bedL - 0.22);
      addMesh(mattressGeo, fabricMat, [0, 0.38, 0.06]);

      const duvetGeo = new THREE.BoxGeometry(bedW - 0.08, 0.08, (bedL - 0.22) * 0.65);
      addMesh(duvetGeo, fabricMat, [0, 0.44, 0.32]);

      const pillowGeo = new THREE.BoxGeometry(0.55, 0.16, 0.38);
      addMesh(pillowGeo, fabricMat, [bedW / 4, 0.54, -bedL / 2 + 0.42], [0.25, 0, 0]);
      addMesh(pillowGeo, fabricMat, [-bedW / 4, 0.54, -bedL / 2 + 0.42], [0.25, 0, 0]);
    } else if (category.id === "dining") {
      const tableW = 2.0 * scaleW;
      const tableD = 0.95 * scaleD;
      const tableH = 0.76 * scaleH;

      const topGeo = new THREE.BoxGeometry(tableW, 0.08, tableD);
      addMesh(topGeo, woodMat, [0, tableH, 0]);

      const legGeo = new THREE.BoxGeometry(0.08, tableH - 0.04, 0.08);
      const legX = tableW / 2 - 0.14;
      const legZ = tableD / 2 - 0.14;
      addMesh(legGeo, woodMat, [legX, tableH / 2, legZ]);
      addMesh(legGeo, woodMat, [-legX, tableH / 2, legZ]);
      addMesh(legGeo, woodMat, [legX, tableH / 2, -legZ]);
      addMesh(legGeo, woodMat, [-legX, tableH / 2, -legZ]);

      const aprGeoX = new THREE.BoxGeometry(tableW - 0.28, 0.06, 0.03);
      addMesh(aprGeoX, woodMat, [0, tableH - 0.06, tableD / 2 - 0.14]);
      addMesh(aprGeoX, woodMat, [0, tableH - 0.06, -tableD / 2 + 0.14]);

      const createChair = (x, z, rotY) => {
        const chairGroup = new THREE.Group();
        chairGroup.position.set(x, 0, z);
        chairGroup.rotation.y = rotY;

        const cSeat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.42), woodMat);
        cSeat.position.y = 0.46;
        cSeat.castShadow = true;
        chairGroup.add(cSeat);

        const cLegGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.46, 12);
        const cl1 = new THREE.Mesh(cLegGeo, woodMat);
        cl1.position.set(0.18, 0.23, 0.18);
        cl1.castShadow = true;
        chairGroup.add(cl1);
        const cl2 = cl1.clone();
        cl2.position.set(-0.18, 0.23, 0.18);
        chairGroup.add(cl2);
        const cl3 = cl1.clone();
        cl3.position.set(0.18, 0.23, -0.18);
        chairGroup.add(cl3);
        const cl4 = cl1.clone();
        cl4.position.set(-0.18, 0.23, -0.18);
        chairGroup.add(cl4);

        const cBack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.44, 0.04), woodMat);
        cBack.position.set(0, 0.68, -0.19);
        cBack.castShadow = true;
        chairGroup.add(cBack);

        group.add(chairGroup);
      };

      createChair(-tableW / 3, tableD / 2 + 0.38, Math.PI);
      createChair(tableW / 3, tableD / 2 + 0.38, Math.PI);
      createChair(-tableW / 3, -tableD / 2 - 0.38, 0);
      createChair(tableW / 3, -tableD / 2 - 0.38, 0);
    } else if (category.id === "wardrobe") {
      const wardW = 1.8 * scaleW;
      const wardD = 0.65 * scaleD;
      const wardH = 2.0 * scaleH;

      const bodyGeo = new THREE.BoxGeometry(wardW, wardH, wardD);
      addMesh(bodyGeo, woodMat, [0, wardH / 2 + 0.08, 0]);

      const basePlinth = new THREE.BoxGeometry(wardW + 0.06, 0.08, wardD + 0.04);
      addMesh(basePlinth, woodMat, [0, 0.04, 0]);

      const cornice = new THREE.BoxGeometry(wardW + 0.08, 0.06, wardD + 0.06);
      addMesh(cornice, woodMat, [0, wardH + 0.08, 0]);

      const doorW = wardW / 2 - 0.02;
      const doorGeo = new THREE.BoxGeometry(doorW, wardH - 0.12, 0.02);
      addMesh(doorGeo, woodMat, [-wardW / 4, wardH / 2 + 0.08, wardD / 2 + 0.015]);
      addMesh(doorGeo, woodMat, [wardW / 4, wardH / 2 + 0.08, wardD / 2 + 0.015]);

      const brassMat = new THREE.MeshStandardMaterial({ color: "#C9A66B", metalness: 0.85, roughness: 0.25 });
      const handleGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.45, 16);
      addMesh(handleGeo, brassMat, [-0.06, wardH / 2 + 0.08, wardD / 2 + 0.035]);
      addMesh(handleGeo, brassMat, [0.06, wardH / 2 + 0.08, wardD / 2 + 0.035]);
    } else if (category.id === "chair") {
      const chairW = 0.95 * scaleW;
      const chairD = 0.9 * scaleD;

      const legGeo = new THREE.CylinderGeometry(0.03, 0.02, 0.24, 16);
      addMesh(legGeo, woodMat, [chairW / 2 - 0.08, 0.12, chairD / 2 - 0.1], [0.15, 0, -0.15]);
      addMesh(legGeo, woodMat, [-chairW / 2 + 0.08, 0.12, chairD / 2 - 0.1], [0.15, 0, 0.15]);
      addMesh(legGeo, woodMat, [chairW / 2 - 0.08, 0.12, -chairD / 2 + 0.1], [-0.15, 0, -0.15]);
      addMesh(legGeo, woodMat, [-chairW / 2 + 0.08, 0.12, -chairD / 2 + 0.1], [-0.15, 0, 0.15]);

      const seatGeo = new THREE.BoxGeometry(chairW - 0.08, 0.18, chairD - 0.14);
      addMesh(seatGeo, fabricMat, [0, 0.32, 0.04]);

      const backGeo = new THREE.BoxGeometry(chairW - 0.08, 0.65 * scaleH, 0.16);
      addMesh(backGeo, fabricMat, [0, 0.68 * scaleH, -chairD / 2 + 0.16], [-0.22, 0, 0]);

      const armGeo = new THREE.BoxGeometry(0.08, 0.04, chairD * 0.85);
      addMesh(armGeo, woodMat, [chairW / 2 - 0.03, 0.52 * scaleH, 0], [0.06, 0, 0]);
      addMesh(armGeo, woodMat, [-chairW / 2 + 0.03, 0.52 * scaleH, 0], [0.06, 0, 0]);
    }
  }, [category, wood, fabric, finish, width, depth, height]);

  const handleResetCamera = () => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !controlsRef.current) return;
    setOptimalCamera(
      cameraRef.current,
      controlsRef.current,
      container.clientWidth,
      container.clientHeight
    );
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[2.1/1] rounded-sm bg-[#F4F1EA] border border-ink/10 overflow-hidden shadow-inner select-none touch-pan-y">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Floating Dimension Badge */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-bone/95 backdrop-blur-md border border-ink/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-sm text-[0.55rem] sm:text-[0.64rem] tracking-wider uppercase text-ink/75 font-medium z-10 flex items-center gap-1.5 shadow-sm pointer-events-none">
        <Sparkles className="h-3 w-3 text-bronze shrink-0" />
        <span>{width}×{depth}×{height}cm</span>
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
