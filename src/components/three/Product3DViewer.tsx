"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCcw, Play, Pause, Camera, Maximize2, Sparkles } from "lucide-react";

interface Product3DViewerProps {
  modelType?: "hoodie" | "jacket" | "tshirt";
  bodyColorHex?: string;
  sleeveColorHex?: string;
  accentColorHex?: string;
  className?: string;
  autoRotateDefault?: boolean;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  modelType = "hoodie",
  bodyColorHex = "#0A0A0A",
  sleeveColorHex = "#20201E",
  accentColorHex = "#D61C24",
  className = "w-full h-full min-h-[420px]",
  autoRotateDefault = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(autoRotateDefault);
  const [activeView, setActiveView] = useState<"front" | "back" | "left" | "right">("front");
  const [isLoading, setIsLoading] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const garmentGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<Record<string, THREE.MeshStandardMaterial>>({});

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsRotating(false);
    }

    const width = currentMount.clientWidth || 500;
    const height = currentMount.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.2);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and shadow maps
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    currentMount.innerHTML = "";
    currentMount.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf4f4ef, 1.0);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd90429, 1.5);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // 5. Build Procedural Garment Geometry
    const garmentGroup = new THREE.Group();
    garmentGroupRef.current = garmentGroup;

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(bodyColorHex),
      roughness: 0.85,
      metalness: 0.05,
    });
    const sleeveMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(sleeveColorHex),
      roughness: 0.85,
      metalness: 0.05,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColorHex),
      roughness: 0.75,
      metalness: 0.1,
    });

    materialsRef.current = { body: bodyMat, sleeves: sleeveMat, accent: accentMat };

    // Torso Cylinder
    const torsoGeo = new THREE.CylinderGeometry(0.72, 0.68, 1.4, 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, bodyMat);
    torsoMesh.position.y = 0.2;
    torsoMesh.castShadow = true;
    garmentGroup.add(torsoMesh);

    // Shoulders
    const shoulderGeo = new THREE.SphereGeometry(0.78, 32, 16);
    shoulderGeo.scale(1, 0.4, 0.7);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, bodyMat);
    shoulderMesh.position.y = 0.88;
    shoulderMesh.castShadow = true;
    garmentGroup.add(shoulderMesh);

    // Left Arm / Sleeve
    const leftArmGeo = new THREE.CylinderGeometry(0.24, 0.18, 1.25, 24);
    leftArmGeo.translate(0, -0.5, 0);
    const leftArmMesh = new THREE.Mesh(leftArmGeo, sleeveMat);
    leftArmMesh.position.set(0.85, 0.85, 0);
    leftArmMesh.rotation.z = -0.32;
    leftArmMesh.castShadow = true;
    garmentGroup.add(leftArmMesh);

    // Right Arm / Sleeve
    const rightArmGeo = new THREE.CylinderGeometry(0.24, 0.18, 1.25, 24);
    rightArmGeo.translate(0, -0.5, 0);
    const rightArmMesh = new THREE.Mesh(rightArmGeo, sleeveMat);
    rightArmMesh.position.set(-0.85, 0.85, 0);
    rightArmMesh.rotation.z = 0.32;
    rightArmMesh.castShadow = true;
    garmentGroup.add(rightArmMesh);

    // Kangaroo Pocket / Chest Accent
    const pocketGeo = new THREE.BoxGeometry(0.68, 0.42, 0.14);
    const pocketMesh = new THREE.Mesh(pocketGeo, accentMat);
    pocketMesh.position.set(0, -0.05, 0.66);
    pocketMesh.castShadow = true;
    garmentGroup.add(pocketMesh);

    // Hood / High Collar
    const hoodGeo = new THREE.TorusGeometry(0.38, 0.18, 16, 32, Math.PI * 1.5);
    hoodGeo.rotateX(Math.PI / 2);
    hoodGeo.rotateZ(Math.PI / 4);
    const hoodMesh = new THREE.Mesh(hoodGeo, bodyMat);
    hoodMesh.position.set(0, 1.05, -0.05);
    hoodMesh.castShadow = true;
    garmentGroup.add(hoodMesh);

    scene.add(garmentGroup);
    setIsLoading(false);

    // 6. Interactive Orbit Controls via Mouse / Touch
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !garmentGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      garmentGroupRef.current.rotation.y += deltaX * 0.008;
      garmentGroupRef.current.rotation.x += deltaY * 0.005;
      garmentGroupRef.current.rotation.x = Math.max(-0.4, Math.min(0.4, garmentGroupRef.current.rotation.x));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z += e.deltaY * 0.0025;
      cameraRef.current.position.z = Math.max(2.8, Math.min(6.5, cameraRef.current.position.z));
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    domEl.addEventListener("wheel", onWheel, { passive: false });

    // Touch support for mobile
    let touchStart = { x: 0, y: 0 };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && garmentGroupRef.current) {
        const deltaX = e.touches[0].clientX - touchStart.x;
        garmentGroupRef.current.rotation.y += deltaX * 0.008;
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    domEl.addEventListener("touchstart", onTouchStart);
    domEl.addEventListener("touchmove", onTouchMove);

    // 7. Animation Loop with IntersectionObserver Auto-Pause
    let animationFrameId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(currentMount);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      if (garmentGroupRef.current && isRotating && !isDragging) {
        garmentGroupRef.current.rotation.y += 0.006;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!currentMount || !camera || !renderer) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      domEl.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domEl.removeEventListener("wheel", onWheel);
      domEl.removeEventListener("touchstart", onTouchStart);
      domEl.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (currentMount) currentMount.innerHTML = "";
    };
  }, [modelType, autoRotateDefault, isRotating]);

  // Real-time material updates
  useEffect(() => {
    if (materialsRef.current.body) materialsRef.current.body.color.set(bodyColorHex);
    if (materialsRef.current.sleeves) materialsRef.current.sleeves.color.set(sleeveColorHex);
    if (materialsRef.current.accent) materialsRef.current.accent.color.set(accentColorHex);
  }, [bodyColorHex, sleeveColorHex, accentColorHex]);

  const setPresetView = (preset: "front" | "back" | "left" | "right") => {
    setActiveView(preset);
    setIsRotating(false);
    if (!garmentGroupRef.current) return;
    garmentGroupRef.current.rotation.x = 0;
    if (preset === "front") garmentGroupRef.current.rotation.y = 0;
    else if (preset === "back") garmentGroupRef.current.rotation.y = Math.PI;
    else if (preset === "left") garmentGroupRef.current.rotation.y = -Math.PI / 2;
    else if (preset === "right") garmentGroupRef.current.rotation.y = Math.PI / 2;
  };

  const resetCamera = () => {
    if (!cameraRef.current || !garmentGroupRef.current) return;
    cameraRef.current.position.set(0, 0.5, 4.2);
    garmentGroupRef.current.rotation.set(0, 0, 0);
    setActiveView("front");
    setIsRotating(true);
  };

  return (
    <div className={`relative bg-[#F4F4EF] rounded-[2px] overflow-hidden border border-[#DADBD2] select-none ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing min-h-[420px]" />

      {isLoading && (
        <div className="absolute inset-0 bg-[#F4F4EF] flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 mx-auto border-2 border-[#D61C24] border-t-transparent rounded-full animate-spin" />
            <div className="text-xs uppercase font-mono font-semibold text-neutral-500">
              Initializing Garment Specimen...
            </div>
          </div>
        </div>
      )}

      {/* Preset Camera Views */}
      <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-[2px] border border-[#DADBD2] shadow-xs">
        <span className="text-[10px] uppercase font-bold text-neutral-400 px-2 flex items-center gap-1 font-mono">
          <Camera className="w-3 h-3" /> Angle:
        </span>
        {(["front", "back", "left", "right"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setPresetView(v)}
            className={`px-2 py-1 text-[10px] uppercase font-mono font-bold rounded-[2px] transition-colors ${
              activeView === v
                ? "bg-[#0A0A0A] text-white"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Control Buttons (Rotate / Reset) */}
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-[2px] border border-[#DADBD2] shadow-xs">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1.5 rounded-[2px] transition-colors ${
            isRotating ? "text-[#D61C24] bg-[#D61C24]/10" : "text-neutral-600 hover:text-black"
          }`}
          title={isRotating ? "Pause Auto-Rotation" : "Start Auto-Rotation"}
        >
          {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={resetCamera}
          className="p-1.5 text-neutral-600 hover:text-black rounded-[2px] transition-colors"
          title="Reset Camera Angle"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono text-neutral-500 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-[2px] border border-[#DADBD2] pointer-events-none hidden sm:block">
        Click & Drag to Orbit • Scroll to Zoom • Touch Supported
      </div>
    </div>
  );
};
