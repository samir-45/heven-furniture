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
  const furnitureGroupRef = useRef(null);
  const materialsRef = useRef({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const widthPx = container.clientWidth || 600;
    const heightPx = container.clientHeight || 360;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F4F1EA"); // Warm luxury studio sand/bone background

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, widthPx / heightPx, 0.1, 100);
    camera.position.set(3.2, 2.2, 4.2);

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
    controls.minDistance = 2.5;
    controls.maxDistance = 7.5;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.9;
    controls.target.set(0, 0.45, 0);
    controlsRef.current = controls;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight("#FAF7F0", 1.2);
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

    // 7. Group for Furniture Piece
    const furnitureGroup = new THREE.Group();
    scene.add(furnitureGroup);
    furnitureGroupRef.current = furnitureGroup;

    // 8. Animation Loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Build / Rebuild 3D Model whenever category or specs change
  useEffect(() => {
    const group = furnitureGroupRef.current;
    if (!group) return;

    // Clear previous model meshes
    while (group.children.length > 0) {
      const obj = group.children[0];
      if (obj.geometry) obj.geometry.dispose();
      group.remove(obj);
    }

    // Material definitions
    const woodColor = new THREE.Color(wood.swatch || "#9C6B3C");
    const fabricColor = new THREE.Color(fabric?.swatch || "#D9CFBE");
    const brassColor = new THREE.Color("#C9A66B");

    // Dynamic roughness based on finish
    const woodRoughness = finish.id === "handrubbed" ? 0.28 : finish.id === "stained" ? 0.35 : 0.45;
    const woodMetalness = finish.id === "handrubbed" ? 0.08 : 0.03;

    const woodMat = new THREE.MeshStandardMaterial({
      color: woodColor,
      roughness: woodRoughness,
      metalness: woodMetalness,
    });

    const isLeather = fabric?.id === "leather";
    const isVelvet = fabric?.id === "velvet";
    const isBoucle = fabric?.id === "boucle";

    const fabricMat = new THREE.MeshStandardMaterial({
      color: fabricColor,
      roughness: isLeather ? 0.32 : isVelvet ? 0.75 : isBoucle ? 0.95 : 0.88,
      metalness: isLeather ? 0.12 : 0.0,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: brassColor,
      metalness: 0.88,
      roughness: 0.22,
    });

    const whiteLinenMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#F6F4EE"),
      roughness: 0.9,
    });

    materialsRef.current = { woodMat, fabricMat, brassMat, whiteLinenMat };

    // Helper to create and position meshes
    const addMesh = (geo, mat, pos = [0, 0, 0], rot = [0, 0, 0], cast = true) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.rotation.set(...rot);
      mesh.castShadow = cast;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    };

    // Calculate normalized dimension scales
    const scaleW = width / 200;
    const scaleD = depth / 90;
    const scaleH = height / 80;

    // --- 1. SOFA MODEL ---
    if (category.id === "sofa") {
      const sofaW = 2.4 * scaleW;
      const sofaD = 1.0 * scaleD;
      const sofaH = 0.85 * scaleH;

      // Solid Wood Base Frame
      addMesh(new THREE.BoxGeometry(sofaW, 0.08, sofaD), woodMat, [0, 0.18, 0]);

      // 4 Sculpted Tapered Wood Legs
      const legGeo = new THREE.CylinderGeometry(0.025, 0.015, 0.18, 16);
      const legX = (sofaW / 2) - 0.14;
      const legZ = (sofaD / 2) - 0.14;
      addMesh(legGeo, woodMat, [legX, 0.09, legZ], [0.1, 0, -0.1]);
      addMesh(legGeo, woodMat, [-legX, 0.09, legZ], [0.1, 0, 0.1]);
      addMesh(legGeo, woodMat, [legX, 0.09, -legZ], [-0.1, 0, -0.1]);
      addMesh(legGeo, woodMat, [-legX, 0.09, -legZ], [-0.1, 0, 0.1]);

      // Brass ferrules on leg tips
      const ferruleGeo = new THREE.CylinderGeometry(0.018, 0.015, 0.04, 16);
      addMesh(ferruleGeo, brassMat, [legX + 0.005, 0.02, legZ + 0.005]);
      addMesh(ferruleGeo, brassMat, [-legX - 0.005, 0.02, legZ + 0.005]);
      addMesh(ferruleGeo, brassMat, [legX + 0.005, 0.02, -legZ - 0.005]);
      addMesh(ferruleGeo, brassMat, [-legX - 0.005, 0.02, -legZ - 0.005]);

      // Deep Seat Platform Cushion
      const seatGeo = new THREE.BoxGeometry(sofaW - 0.04, 0.22, sofaD - 0.08);
      addMesh(seatGeo, fabricMat, [0, 0.33, 0.02]);

      // Dual Plush Top Seat Cushions
      const cushionW = (sofaW - 0.28) / 2;
      const cushionGeo = new THREE.BoxGeometry(cushionW, 0.16, sofaD - 0.26);
      addMesh(cushionGeo, fabricMat, [-cushionW / 2 - 0.02, 0.45, 0.06]);
      addMesh(cushionGeo, fabricMat, [cushionW / 2 + 0.02, 0.45, 0.06]);

      // Curved Backrest Cushion
      const backGeo = new THREE.BoxGeometry(sofaW, 0.55 * scaleH, 0.24);
      addMesh(backGeo, fabricMat, [0, 0.65 * scaleH, -sofaD / 2 + 0.14], [-0.08, 0, 0]);

      // Side Armrests
      const armGeo = new THREE.BoxGeometry(0.18, 0.42 * scaleH, sofaD);
      addMesh(armGeo, fabricMat, [sofaW / 2 - 0.09, 0.48 * scaleH, 0]);
      addMesh(armGeo, fabricMat, [-sofaW / 2 + 0.09, 0.48 * scaleH, 0]);

      // 2 Accent Throw Pillows
      const pillowGeo = new THREE.BoxGeometry(0.36, 0.36, 0.12);
      addMesh(pillowGeo, brassMat, [sofaW / 2 - 0.28, 0.52 * scaleH, -0.15], [0.1, -0.3, 0.15]);
      addMesh(pillowGeo, fabricMat, [-sofaW / 2 + 0.28, 0.52 * scaleH, -0.15], [0.1, 0.3, -0.15]);
    }

    // --- 2. BED MODEL ---
    else if (category.id === "bed") {
      const bedW = 2.0 * scaleW;
      const bedL = 2.2 * scaleD;
      const headH = 1.35 * scaleH;

      // Platform Timber Rails
      addMesh(new THREE.BoxGeometry(bedW, 0.18, bedL), woodMat, [0, 0.18, 0]);

      // 4 Sturdy Solid Wood Bed Legs
      const legGeo = new THREE.BoxGeometry(0.09, 0.18, 0.09);
      addMesh(legGeo, woodMat, [bedW / 2 - 0.06, 0.09, bedL / 2 - 0.06]);
      addMesh(legGeo, woodMat, [-bedW / 2 + 0.06, 0.09, bedL / 2 - 0.06]);
      addMesh(legGeo, woodMat, [bedW / 2 - 0.06, 0.09, -bedL / 2 + 0.06]);
      addMesh(legGeo, woodMat, [-bedW / 2 + 0.06, 0.09, -bedL / 2 + 0.06]);

      // Imposing Headboard (Solid Wood Frame + Padded Upholstery)
      const headFrameGeo = new THREE.BoxGeometry(bedW + 0.14, headH, 0.1);
      addMesh(headFrameGeo, woodMat, [0, headH / 2 + 0.09, -bedL / 2 + 0.05]);

      const headPanelGeo = new THREE.BoxGeometry(bedW - 0.08, headH - 0.18, 0.06);
      addMesh(headPanelGeo, fabricMat, [0, headH / 2 + 0.12, -bedL / 2 + 0.1]);

      // Plush Mattress
      const mattressGeo = new THREE.BoxGeometry(bedW - 0.12, 0.32, bedL - 0.14);
      addMesh(mattressGeo, whiteLinenMat, [0, 0.42, 0.04]);

      // Duvet Linen Layer
      const duvetGeo = new THREE.BoxGeometry(bedW - 0.08, 0.14, bedL * 0.65);
      addMesh(duvetGeo, fabricMat, [0, 0.54, bedL * 0.16]);

      // Dual Pillows
      const pillowGeo = new THREE.BoxGeometry(0.68, 0.14, 0.42);
      addMesh(pillowGeo, whiteLinenMat, [-0.44, 0.63, -bedL / 2 + 0.42], [0.15, 0, 0]);
      addMesh(pillowGeo, whiteLinenMat, [0.44, 0.63, -bedL / 2 + 0.42], [0.15, 0, 0]);
    }

    // --- 3. DINING TABLE MODEL ---
    else if (category.id === "dining") {
      const tableW = 2.4 * scaleW;
      const tableD = 1.1 * scaleD;
      const tableH = 0.78 * scaleH;

      // Solid Hardwood Beveled Tabletop
      const topGeo = new THREE.BoxGeometry(tableW, 0.08, tableD);
      addMesh(topGeo, woodMat, [0, tableH, 0]);

      // Under-apron support frame
      const apronGeo = new THREE.BoxGeometry(tableW - 0.28, 0.06, tableD - 0.24);
      addMesh(apronGeo, woodMat, [0, tableH - 0.06, 0]);

      // 4 Sculpted Tapered Legs with Brass Tips
      const legGeo = new THREE.CylinderGeometry(0.042, 0.026, tableH, 24);
      const posX = tableW / 2 - 0.22;
      const posZ = tableD / 2 - 0.18;

      addMesh(legGeo, woodMat, [posX, tableH / 2, posZ], [0.06, 0, -0.06]);
      addMesh(legGeo, woodMat, [-posX, tableH / 2, posZ], [0.06, 0, 0.06]);
      addMesh(legGeo, woodMat, [posX, tableH / 2, -posZ], [-0.06, 0, -0.06]);
      addMesh(legGeo, woodMat, [-posX, tableH / 2, -posZ], [-0.06, 0, 0.06]);

      // Brass Accents on leg bases
      const tipGeo = new THREE.CylinderGeometry(0.03, 0.026, 0.08, 24);
      addMesh(tipGeo, brassMat, [posX + 0.01, 0.04, posZ + 0.01]);
      addMesh(tipGeo, brassMat, [-posX - 0.01, 0.04, posZ + 0.01]);
      addMesh(tipGeo, brassMat, [posX + 0.01, 0.04, -posZ - 0.01]);
      addMesh(tipGeo, brassMat, [-posX - 0.01, 0.04, -posZ - 0.01]);

      // Centerpiece Brass Decorative Vessel
      const bowlGeo = new THREE.CylinderGeometry(0.18, 0.08, 0.07, 32);
      addMesh(bowlGeo, brassMat, [0, tableH + 0.07, 0]);
    }

    // --- 4. WARDROBE MODEL ---
    else if (category.id === "wardrobe") {
      const wardW = 1.8 * scaleW;
      const wardD = 0.65 * scaleD;
      const wardH = 2.1 * scaleH;

      // Solid Wood Cabinet Body
      const bodyGeo = new THREE.BoxGeometry(wardW, wardH, wardD);
      addMesh(bodyGeo, woodMat, [0, wardH / 2 + 0.08, 0]);

      // Crown Molding Top
      const crownGeo = new THREE.BoxGeometry(wardW + 0.08, 0.08, wardD + 0.06);
      addMesh(crownGeo, woodMat, [0, wardH + 0.1, 0]);

      // Plinth Base
      const baseGeo = new THREE.BoxGeometry(wardW + 0.04, 0.08, wardD + 0.04);
      addMesh(baseGeo, woodMat, [0, 0.04, 0]);

      // 3 Door Panels
      const doorW = (wardW - 0.1) / 3;
      const doorGeo = new THREE.BoxGeometry(doorW, wardH - 0.16, 0.03);

      addMesh(doorGeo, woodMat, [-doorW - 0.02, wardH / 2 + 0.08, wardD / 2 + 0.01]);
      addMesh(doorGeo, woodMat, [0, wardH / 2 + 0.08, wardD / 2 + 0.01]);
      addMesh(doorGeo, woodMat, [doorW + 0.02, wardH / 2 + 0.08, wardD / 2 + 0.01]);

      // Brass Handles
      const handleGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.28, 16);
      addMesh(handleGeo, brassMat, [-0.06, wardH * 0.52, wardD / 2 + 0.04]);
      addMesh(handleGeo, brassMat, [0.06, wardH * 0.52, wardD / 2 + 0.04]);
      addMesh(handleGeo, brassMat, [doorW * 1.45, wardH * 0.52, wardD / 2 + 0.04]);
    }

    // --- 5. LOUNGE CHAIR MODEL ---
    else if (category.id === "chair") {
      const chairW = 0.95 * scaleW;
      const chairD = 1.0 * scaleD;
      const chairH = 0.92 * scaleH;

      // Solid Sculpted Wood Frame Base
      addMesh(new THREE.BoxGeometry(chairW, 0.06, chairD), woodMat, [0, 0.22, 0]);

      // Angled Timber Legs
      const legGeo = new THREE.CylinderGeometry(0.028, 0.018, 0.26, 16);
      addMesh(legGeo, woodMat, [chairW / 2 - 0.08, 0.12, chairD / 2 - 0.1], [0.15, 0, -0.15]);
      addMesh(legGeo, woodMat, [-chairW / 2 + 0.08, 0.12, chairD / 2 - 0.1], [0.15, 0, 0.15]);
      addMesh(legGeo, woodMat, [chairW / 2 - 0.08, 0.12, -chairD / 2 + 0.1], [-0.15, 0, -0.15]);
      addMesh(legGeo, woodMat, [-chairW / 2 + 0.08, 0.12, -chairD / 2 + 0.1], [-0.15, 0, 0.15]);

      // Deep Ergonomic Seat Cushion
      const seatGeo = new THREE.BoxGeometry(chairW - 0.08, 0.18, chairD - 0.14);
      addMesh(seatGeo, fabricMat, [0, 0.32, 0.04]);

      // Angled High Back Cushion
      const backGeo = new THREE.BoxGeometry(chairW - 0.08, 0.65 * scaleH, 0.16);
      addMesh(backGeo, fabricMat, [0, 0.68 * scaleH, -chairD / 2 + 0.16], [-0.22, 0, 0]);

      // Sculpted Curved Armrests
      const armGeo = new THREE.BoxGeometry(0.08, 0.04, chairD * 0.85);
      addMesh(armGeo, woodMat, [chairW / 2 - 0.03, 0.52 * scaleH, 0], [0.06, 0, 0]);
      addMesh(armGeo, woodMat, [-chairW / 2 + 0.03, 0.52 * scaleH, 0], [0.06, 0, 0]);
    }
  }, [category, wood, fabric, finish, width, depth, height]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0.45, 0);
    }
  };

  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[2.1/1] rounded-sm bg-[#F4F1EA] border border-ink/10 overflow-hidden shadow-inner select-none">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Floating Dimension Badge */}
      <div className="absolute top-3 left-3 bg-bone/95 backdrop-blur-md border border-ink/10 px-3 py-1.5 rounded-sm text-[0.64rem] tracking-wider uppercase text-ink/75 font-medium z-10 flex items-center gap-1.5 shadow-sm pointer-events-none">
        <Sparkles className="h-3 w-3 text-bronze" />
        <span>{width} × {depth} × {height} cm</span>
      </div>

      {/* Top Right Material Tag */}
      <div className="absolute top-3 right-3 bg-depth/90 backdrop-blur-md border border-brass/35 px-3 py-1.5 rounded-sm text-[0.62rem] tracking-wider text-brass font-light z-10 shadow-sm pointer-events-none">
        {wood.id.toUpperCase()} {category.hasFabric && `· ${fabric.id.toUpperCase()}`}
      </div>

      {/* Bottom Center 360° Drag Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-bone/85 backdrop-blur-md border border-ink/10 px-3 py-1 rounded-full text-[0.6rem] tracking-[0.16em] uppercase text-ink/60 font-medium z-10 flex items-center gap-1.5 shadow-sm pointer-events-none">
        <Rotate3d className="h-3 w-3 text-bronze animate-spin-slow" />
        <span>360° Interactive 3D</span>
      </div>

      {/* Bottom Right Control Actions */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
        <button
          type="button"
          onClick={() => setAutoRotate((v) => !v)}
          title={autoRotate ? "Pause Auto-Rotation" : "Start Auto-Rotation"}
          className={`p-2 rounded-full border text-xs shadow-sm transition-colors cursor-pointer ${
            autoRotate
              ? "bg-depth text-bone border-brass/40"
              : "bg-bone/90 text-ink/70 border-ink/15 hover:text-ink"
          }`}
        >
          <Rotate3d className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={handleResetCamera}
          title="Reset Camera View"
          className="p-2 rounded-full border bg-bone/90 text-ink/70 border-ink/15 hover:text-ink shadow-sm transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
