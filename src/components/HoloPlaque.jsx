"use client";

import { useEffect, useRef, useState } from "react";
import WaalddeiLogo from "./WaalddeiLogo";

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
        // beta: Front to Back (-180 to 180, center ~45deg for normal phone hold)
        const g = Math.max(-45, Math.min(45, e.gamma));
        const b = Math.max(15, Math.min(75, e.beta)) - 45;

        targetY = (g / 45) * 20;  // rotateY between -20deg and 20deg
        targetX = -(b / 30) * 16; // rotateX between -16deg and 16deg

        const glarePosX = Math.max(0, Math.min(100, 50 + (g / 45) * 45));
        const glarePosY = Math.max(0, Math.min(100, 50 + (b / 30) * 45));

        setGlare({
          x: glarePosX,
          y: glarePosY,
          opacity: 0.95,
        });
      }
    };

    // Smooth lerp loop for organic physical fluid motion
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

    const rotY = (relX - 0.5) * 24; // rotate along Y axis
    const rotX = (relY - 0.5) * -18; // rotate along X axis

    setRot({ x: rotX, y: rotY });
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

  // Dynamic prismatic angle shifting with physical tilt
  const holoAngle = 120 + rot.y * 3.5 + rot.x * 2;

  return (
    <div 
      className="w-full perspective-[900px] select-none"
      onClick={requestGyroPermission}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onTouchMove={handlePointerMove}
    >
      {/* Physical 3D Holographic Plaque Frame with Rounded Corners */}
      <div
        ref={plaqueRef}
        style={{
          transform: `perspective(900px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
          transition: "transform 0.08s ease-out, box-shadow 0.08s ease-out",
          boxShadow: `${-rot.y * 0.7 + 4}px ${rot.x * 0.7 + 5}px 0px #111213`,
        }}
        className="relative w-full aspect-[16/9] min-h-[190px] sm:min-h-[220px] rounded-2xl sm:rounded-3xl overflow-hidden border-3 border-[#111213] bg-[#141517] flex items-center justify-center p-6 group cursor-pointer"
      >
        {/* ========================================================= */}
        {/* LAYER 1: REPEATING MINI-LOGOS SECURITY PATTERN (WATERMARK) */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen transition-opacity duration-300"
          style={{
            backgroundImage: `url('/images/waalddei-logo.svg')`,
            backgroundSize: "44px 34px",
            backgroundRepeat: "repeat",
            backgroundPosition: `${rot.y * 0.6}px ${rot.x * 0.6}px`,
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
        {/* LAYER 3: SECONDARY DENSE MINI-LOGO HOLOGRAPHIC FOIL       */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 pointer-events-none opacity-35 mix-blend-overlay"
          style={{
            backgroundImage: `url('/images/waalddei-logo.svg')`,
            backgroundSize: "32px 25px",
            backgroundRepeat: "repeat",
            backgroundPosition: `${-rot.y * 0.8}px ${-rot.x * 0.8}px`,
          }}
        />

        {/* ========================================================= */}
        {/* LAYER 4: DYNAMIC SPECULAR REFLECTION GLARE SPOTLIGHT      */}
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
        {/* LAYER 6: HERO OFFICIAL WAALDDEI LOGO (CENTERED & EMBOSSED)*/}
        {/* ========================================================= */}
        <div className="relative z-20 flex items-center justify-center w-full max-w-[220px] sm:max-w-[260px]">
          <WaalddeiLogo
            className="w-full h-auto text-white select-none transition-transform duration-100"
            style={{
              filter: `
                drop-shadow(0 2px 6px rgba(0, 0, 0, 0.95))
                drop-shadow(0 0 16px rgba(255, 255, 255, 0.4))
              `,
              transform: `scale(${1 + Math.abs(rot.x * 0.005) + Math.abs(rot.y * 0.005)})`,
            }}
          />
        </div>

      </div>
    </div>
  );
}
