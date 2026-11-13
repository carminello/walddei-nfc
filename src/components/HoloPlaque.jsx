"use client";

import { useEffect, useRef, useState } from "react";
import WaalddeiLogo from "./WaalddeiLogo";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function HoloPlaque({ brand }) {
  const plaqueRef = useRef(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0.85 });
  const [isPermissionRequested, setIsPermissionRequested] = useState(false);
  const accentColor = brand?.accentColor || "#C85A17";

  // 1. Mobile Gyroscope / DeviceOrientation Listener
  useEffect(() => {
    let animFrame;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        // gamma: Left to Right (-90 to 90)
        // beta: Front to Back (-180 to 180, center ~45deg for standard reading tilt)
        const g = Math.max(-45, Math.min(45, e.gamma));
        const b = Math.max(15, Math.min(75, e.beta)) - 45;

        targetY = (g / 45) * 28;  // horizontal parallax shift
        targetX = -(b / 30) * 22; // vertical parallax shift

        const glarePosX = Math.max(0, Math.min(100, 50 + (g / 45) * 48));
        const glarePosY = Math.max(0, Math.min(100, 50 + (b / 30) * 48));

        setGlare({
          x: glarePosX,
          y: glarePosY,
          opacity: 0.95,
        });
      }
    };

    // Smooth lerp loop for organic physical fluid motion of the inner textures
    const loop = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      setRot({
        x: parseFloat(currentX.toFixed(2)),
        y: parseFloat(currentY.toFixed(2)),
      });

      animFrame = requestAnimationFrame(loop);
    };
    animFrame = requestAnimationFrame(loop);

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      cancelAnimationFrame(animFrame);
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleOrientation, true);
      }
    };
  }, []);

  // 2. Desktop Mouse Move & Touch Drag Fallback
  const handlePointerMove = (e) => {
    if (!plaqueRef.current) return;
    const rect = plaqueRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches ? e.touches[0].clientX : rect.width / 2);
    const clientY = e.clientY ?? (e.touches ? e.touches[0].clientY : rect.height / 2);

    const relX = (clientX - rect.left) / rect.width;
    const relY = (clientY - rect.top) / rect.height;

    const shiftX = (relX - 0.5) * 32;
    const shiftY = (relY - 0.5) * -24;

    setRot({ x: shiftY, y: shiftX });
    setGlare({
      x: relX * 100,
      y: relY * 100,
      opacity: 1,
    });
  };

  const handlePointerLeave = () => {
    setRot({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0.75 });
  };

  // 3. iOS DeviceOrientation Permission Request on Tap
  const requestGyroPermission = async () => {
    if (
      typeof window !== "undefined" &&
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function" &&
      !isPermissionRequested
    ) {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === "granted") {
          setIsPermissionRequested(true);
        }
      } catch (err) {
        console.warn("DeviceOrientation permission notice:", err);
      }
    }
  };

  // Dynamic prismatic rainbow angle sweeping with gyro / pointer tilt
  const holoAngle = 120 + (glare.x - 50) * 1.8 + (glare.y - 50) * 1.2;

  return (
    <div 
      className="w-full select-none"
      onClick={requestGyroPermission}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onTouchMove={handlePointerMove}
    >
      {/* ============================================================= */}
      {/* STATIONARY OUTER WINDOW: FIRM, SOLID & ROUNDED (DOES NOT MOVE)*/}
      {/* ============================================================= */}
      <div
        ref={plaqueRef}
        className="relative w-full aspect-[16/9] min-h-[195px] sm:min-h-[225px] rounded-2xl sm:rounded-3xl overflow-hidden border-3 border-[#111213] bg-[#141517] shadow-[4px_4px_0px_#111213] flex flex-col items-center justify-center p-4 sm:p-5 group cursor-pointer"
      >
        {/* ========================================================= */}
        {/* LAYER 1: REPEATING MINI-LOGOS PATTERN (MOVES WITH TILT)   */}
        {/* ========================================================= */}
        <div
          className="absolute -inset-8 pointer-events-none opacity-30 mix-blend-screen transition-transform duration-75"
          style={{
            backgroundImage: `url('/images/waalddei-logo.svg')`,
            backgroundSize: "44px 34px",
            backgroundRepeat: "repeat",
            transform: `translate(${(glare.x - 50) * 0.45}px, ${(glare.y - 50) * 0.35}px)`,
          }}
        />

        {/* ========================================================= */}
        {/* LAYER 2: RAINBOW PRISMATIC SPECTRAL FOIL REFRACTION       */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-200"
          style={{
            opacity: glare.opacity,
            background: `linear-gradient(${holoAngle}deg, 
              rgba(255, 0, 128, 0.45) 0%, 
              rgba(0, 240, 255, 0.55) 20%, 
              rgba(255, 220, 0, 0.6) 40%, 
              rgba(0, 255, 136, 0.55) 60%, 
              rgba(180, 0, 255, 0.5) 80%,
              rgba(255, 0, 128, 0.45) 100%)`,
          }}
        />

        {/* ========================================================= */}
        {/* LAYER 3: SECONDARY DENSE MINI-LOGO PARALLAX FOIL          */}
        {/* ========================================================= */}
        <div
          className="absolute -inset-8 pointer-events-none opacity-40 mix-blend-overlay transition-transform duration-75"
          style={{
            backgroundImage: `url('/images/waalddei-logo.svg')`,
            backgroundSize: "30px 23px",
            backgroundRepeat: "repeat",
            transform: `translate(${(50 - glare.x) * 0.55}px, ${(50 - glare.y) * 0.45}px)`,
          }}
        />

        {/* ========================================================= */}
        {/* LAYER 4: DYNAMIC SPECULAR REFLECTION SPOTLIGHT (MOVES)   */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-150"
          style={{
            background: `radial-gradient(circle 280px at ${glare.x}% ${glare.y}%, 
              rgba(255, 255, 255, 0.95) 0%, 
              rgba(255, 240, 220, 0.55) 30%, 
              rgba(200, 90, 23, 0.25) 55%,
              transparent 80%)`,
          }}
        />

        {/* ========================================================= */}
        {/* LAYER 5: PHYSICAL SECURITY MICRO-DIFFRACTION SCANLINES    */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-soft-light"
          style={{
            backgroundImage: `repeating-linear-gradient(135deg, 
              rgba(255, 255, 255, 0.15) 0px, 
              rgba(255, 255, 255, 0.15) 1px, 
              transparent 1px, 
              transparent 3px)`,
          }}
        />

        {/* ========================================================= */}
        {/* LAYER 6: HERO OFFICIAL WAALDDEI LOGO + SECURITY SEAL      */}
        {/* ========================================================= */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-[240px] sm:max-w-[280px] -mt-1 sm:-mt-2">
          {/* Official WAALDDEI Vector Logo */}
          <WaalddeiLogo
            className="w-auto h-[68px] sm:h-[82px] max-w-[160px] sm:max-w-[200px] text-white select-none"
            style={{
              filter: `
                drop-shadow(0 2px 8px rgba(0, 0, 0, 0.95))
                drop-shadow(0 0 16px rgba(255, 255, 255, 0.4))
              `,
            }}
          />

          {/* Holographic Seal Badge: ORIGINAL RESTYLING HOLOGRAM (ELEVATED & HIGH-CONTRAST) */}
          <div 
            className="mt-2.5 sm:mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/80 bg-[#0B0C0E]/92 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.9),0_0_8px_rgba(255,255,255,0.3)] select-none transition-transform duration-100"
            style={{
              transform: `translate(${(glare.x - 50) * 0.1}px, ${(glare.y - 50) * 0.08}px)`,
            }}
          >
            <Sparkles className="w-3 h-3 text-[#FFD700] flex-shrink-0 animate-pulse" />
            <span className="font-mono font-black text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.16em] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
              ORIGINAL RESTYLING HOLOGRAM
            </span>
            <ShieldCheck className="w-3 h-3 text-[#00F0FF] flex-shrink-0" />
          </div>
        </div>

      </div>
    </div>
  );
}
