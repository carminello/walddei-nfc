"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, ShieldCheck, Cpu } from "lucide-react";

export default function HoloPlaque({ brand }) {
  const plaqueRef = useRef(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0.75 });
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
      // gamma: Left to Right (-90 to 90)
      // beta: Front to Back (-180 to 180, usually 30 to 60 when holding phone)
      if (e.gamma !== null && e.beta !== null) {
        // Clamp and normalize
        const g = Math.max(-45, Math.min(45, e.gamma));
        const b = Math.max(15, Math.min(75, e.beta)) - 45; // center around 45deg standard reading angle

        targetY = (g / 45) * 18;  // rotateY between -18deg and 18deg
        targetX = -(b / 30) * 15; // rotateX between -15deg and 15deg

        const glarePosX = Math.max(0, Math.min(100, 50 + (g / 45) * 45));
        const glarePosY = Math.max(0, Math.min(100, 50 + (b / 30) * 45));

        setGlare({
          x: glarePosX,
          y: glarePosY,
          opacity: 0.85
        });
      }
    };

    // Smooth lerp loop for organic physical fluid motion
    const loop = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      setRot({
        x: parseFloat(currentX.toFixed(2)),
        y: parseFloat(currentY.toFixed(2))
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

    const rotY = (relX - 0.5) * 22; // rotate along Y axis
    const rotX = (relY - 0.5) * -18; // rotate along X axis

    setRot({ x: rotX, y: rotY });
    setGlare({
      x: relX * 100,
      y: relY * 100,
      opacity: 0.95
    });
  };

  const handlePointerLeave = () => {
    setRot({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0.65 });
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

  // Dynamic prismatic angle based on rotation
  const holoAngle = 120 + rot.y * 3.5 + rot.x * 2;

  return (
    <div 
      className="w-full perspective-[800px] select-none"
      onClick={requestGyroPermission}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onTouchMove={handlePointerMove}
    >
      {/* Physical 3D Holographic Plaque Frame */}
      <div
        ref={plaqueRef}
        style={{
          transform: `perspective(800px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
          transition: "transform 0.08s ease-out, box-shadow 0.08s ease-out",
          boxShadow: `${-rot.y * 0.7 + 4}px ${rot.x * 0.7 + 4}px 0px #111213`,
        }}
        className="relative w-full overflow-hidden border-3 border-[#111213] bg-[#1A1C1E] p-4 sm:p-5 group cursor-pointer"
      >
        {/* ========================================================= */}
        {/* HOLOGRAPHIC OPTICAL LAYERS                                */}
        {/* ========================================================= */}

        {/* Layer A: Holographic Rainbow Prismatic Foil Refraction */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `linear-gradient(${holoAngle}deg, 
              rgba(255, 0, 128, 0.35) 0%, 
              rgba(0, 240, 255, 0.45) 22%, 
              rgba(255, 220, 0, 0.5) 45%, 
              rgba(0, 255, 136, 0.45) 68%, 
              rgba(180, 0, 255, 0.4) 88%,
              rgba(255, 0, 128, 0.35) 100%)`,
          }}
        />

        {/* Layer B: Dynamic Specular Reflection Hotspot / Glare */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle 280px at ${glare.x}% ${glare.y}%, 
              rgba(255, 255, 255, 0.9) 0%, 
              rgba(255, 245, 230, 0.45) 35%, 
              rgba(200, 90, 23, 0.15) 60%,
              transparent 85%)`,
          }}
        />

        {/* Layer C: Physical Security Micro-Grating & Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-soft-light"
          style={{
            backgroundImage: `repeating-linear-gradient(135deg, 
              rgba(255, 255, 255, 0.12) 0px, 
              rgba(255, 255, 255, 0.12) 1px, 
              transparent 1px, 
              transparent 3px)`,
          }}
        />

        {/* Layer D: Brushed Titanium Base Sheen */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            background: "linear-gradient(to right, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.4) 50%, rgba(255,255,255,0.08) 100%)",
          }}
        />

        {/* Corner Precision Registration Crosshairs (+) */}
        <span className="absolute top-1.5 left-2 font-mono text-[10px] text-white/50 font-bold select-none">+</span>
        <span className="absolute top-1.5 right-2 font-mono text-[10px] text-white/50 font-bold select-none">+</span>
        <span className="absolute bottom-1.5 left-2 font-mono text-[10px] text-white/50 font-bold select-none">+</span>
        <span className="absolute bottom-1.5 right-2 font-mono text-[10px] text-white/50 font-bold select-none">+</span>

        {/* ========================================================= */}
        {/* PLAQUE CONTENT (TACTILE MONUMENTAL ENGRAVING)            */}
        {/* ========================================================= */}
        <div className="relative z-10 flex flex-col gap-2">
          
          {/* Top Status Stripe */}
          <div className="flex items-center justify-between border-b border-white/20 pb-2">
            <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] font-bold text-white tracking-widest uppercase">
              <span 
                className="w-2.5 h-2.5 border border-white flex-shrink-0 animate-pulse shadow-[0_0_8px_rgba(200,90,23,0.8)]"
                style={{ backgroundColor: accentColor }}
              />
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {brand?.badge || "CERTIFIED PHYSICAL NFC PLAQUE // ED. 2026"}
              </span>
            </div>

            <div className="flex items-center gap-1 text-white/80 font-mono text-[9px] sm:text-[10px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-[#FFD700] animate-spin" style={{ animationDuration: "12s" }} />
              <span>{brand?.location || "MILANO // ZÜRICH"}</span>
            </div>
          </div>

          {/* Monumental Holographic Identity: I WAALDDEI */}
          <div className="pt-1.5 pb-0.5">
            <div className="flex items-baseline justify-between gap-2">
              <h1 
                className="font-sans font-black text-4xl sm:text-5xl md:text-6xl tracking-[-0.05em] uppercase text-white leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                style={{
                  textShadow: `
                    0 1px 0 rgba(255,255,255,0.4),
                    0 2px 0 rgba(0,0,0,0.9),
                    0 0 16px rgba(255,255,255,0.2)
                  `,
                }}
              >
                {brand?.name || "I WAALDDEI"}
              </h1>

              {/* Holographic Chip Indicator */}
              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 border border-white/30 bg-black/40 backdrop-blur-sm text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                <Cpu className="w-3 h-3 text-[#00F0FF]" />
                <span>NFC LIVE</span>
              </div>
            </div>

            {/* Subtitle / Studio Discipline */}
            <div className="flex items-center gap-2 mt-2">
              <div 
                className="h-1.5 w-10 flex-shrink-0 shadow-[0_0_10px_rgba(200,90,23,0.9)]" 
                style={{ backgroundColor: accentColor }} 
              />
              <p className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {brand?.tagline || "INTERIOR ARCHITECTURE // BÉTON BRUT & RAW STEEL"}
              </p>
            </div>
          </div>

          {/* Studio Manifesto / Structural Philosophy */}
          {brand?.manifesto && (
            <p className="font-mono text-[10px] sm:text-[11px] text-white/85 leading-relaxed border-t border-white/20 pt-2 mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2">
              {brand.manifesto}
            </p>
          )}

          {/* Micro-Engraved Security Watermark Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-dashed border-white/20 text-[8px] sm:text-[9px] font-mono text-white/60 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#00FF88]" />
              <span>HOLO SPECIMEN // GENUINE HARDWARE</span>
            </span>
            <span className="font-bold text-white/80">
              GYRO-ACTIVE 3D
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
