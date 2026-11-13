"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import WaalddeiLogo from "./WaalddeiLogo";
import { 
  Camera, 
  Sparkles, 
  Layers, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Maximize2,
  Box,
  Leaf,
  Scan,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

export default function MatrixArScanner({ arConfig, brandConfig, onSwitchToViewer }) {
  const videoRef = useRef(null);
  const matrixCanvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [matrixDensity, setMatrixDensity] = useState("high"); // "high" | "low" | "off"
  const [isMuted, setIsMuted] = useState(true);
  const [placedObjects, setPlacedObjects] = useState([
    {
      id: 1,
      x: 50,
      y: 52,
      scale: 1,
      label: "I WAALDDEI // AR TAG 01",
      floraType: "Dettaglio Botanico"
    }
  ]);
  const [gyro, setGyro] = useState({ x: 0, y: 0 });
  const [scanStep, setScanStep] = useState(0);

  const accentColor = brandConfig?.accentColor || "#C85A17";

  // 1. Synthesize Matrix Cybernetic Audio Tone with Web Audio API
  const playCyberSound = useCallback((frequency = 440, duration = 0.15, type = "sawtooth") => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.8, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [isMuted]);

  // 2. Start Real Camera (rear facing environment on mobile)
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("API Fotocamera non supportata dal browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
      playCyberSound(580, 0.25, "sine");
    } catch (err) {
      console.warn("Fotocamera non disponibile o permessi negati:", err);
      setCameraError(err.message || "Permesso fotocamera negato.");
      setCameraActive(false);
    }
  };

  // Stop camera tracks cleanly
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // 3. Gyroscope Listener for Organic Spatial Parallax
  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        const g = Math.max(-40, Math.min(40, e.gamma));
        const b = Math.max(-40, Math.min(40, e.beta - 45));
        setGyro({
          x: (g / 40) * 16,
          y: (b / 40) * 12
        });
      }
    };

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleOrientation, true);
      }
    };
  }, []);

  // 4. Matrix Digital Rain Canvas Animation Engine
  useEffect(() => {
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 460);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Characters pool: Brutalist cyphers, Katakana, Latin, Architectural glyphs
    const characters = "01WAALDDEI//[]+=*~<>_§±µ¶0123456789ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ".split("");
    const fontSize = 13;
    const columns = Math.floor(width / fontSize);
    const drops = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -50);
    }

    let frameCount = 0;

    const renderMatrix = () => {
      frameCount++;

      if (matrixDensity !== "off") {
        // Semi-transparent wash so camera feed shines through underneath
        ctx.fillStyle = matrixDensity === "high" ? "rgba(10, 15, 12, 0.16)" : "rgba(10, 15, 12, 0.08)";
        ctx.fillRect(0, 0, width, height);

        ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;

        for (let i = 0; i < drops.length; i++) {
          const char = characters[Math.floor(Math.random() * characters.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Leading head character blazes bright white/cyan, tail is vivid matrix emerald green
          ctx.fillStyle = Math.random() > 0.85 ? "#FFFFFF" : "#00FF66";
          ctx.shadowColor = "#00FF66";
          ctx.shadowBlur = 6;

          ctx.fillText(char, x, y);

          ctx.shadowBlur = 0; // reset shadow for performance

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      } else {
        // Clear canvas if matrix is turned off
        ctx.clearRect(0, 0, width, height);
      }

      if (frameCount % 60 === 0) {
        setScanStep((prev) => (prev + 1) % 4);
      }

      animId = requestAnimationFrame(renderMatrix);
    };

    animId = requestAnimationFrame(renderMatrix);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [matrixDensity]);

  // 5. User Tap on Screen: Place or Transform Concrete & Flora Monoliths
  const handleScreenTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tapX = ((e.clientX - rect.left) / rect.width) * 100;
    const tapY = ((e.clientY - rect.top) / rect.height) * 100;

    playCyberSound(720, 0.12, "square");

    const newObj = {
      id: Date.now(),
      x: Math.max(15, Math.min(85, tapX)),
      y: Math.max(25, Math.min(80, tapY)),
      scale: 0.95 + Math.random() * 0.2,
      label: `I WAALDDEI // AR TAG 0${placedObjects.length + 1}`,
      floraType: "Dettaglio Botanico"
    };

    setPlacedObjects((prev) => [...prev.slice(-3), newObj]); // Keep up to 4 objects for performance
  };

  const clearObjects = () => {
    playCyberSound(320, 0.1, "sine");
    setPlacedObjects([
      {
        id: 1,
        x: 50,
        y: 52,
        scale: 1,
        label: "I WAALDDEI // AR TAG 01",
        floraType: "Dettaglio Botanico"
      }
    ]);
  };

  return (
    <div className="w-full flex flex-col gap-2.5 select-none">
      
      {/* HUD Header Bar */}
      <div className="flex items-center justify-between bg-[#111213] text-white p-2.5 border-2 border-[#111213] shadow-[2px_2px_0px_#FFFFFF]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#00FF66] animate-pulse rounded-none" />
          <div>
            <h3 className="font-mono font-bold text-[11px] tracking-widest text-[#00FF66] uppercase">
              {arConfig?.matrixTitle || "MATRIX SPATIAL AR // I WAALDDEI"}
            </h3>
            <p className="font-mono text-[8px] text-gray-400 tracking-wider uppercase">
              DECODIFICA SPAZIO REALE &gt; HOLOTAG OLOGRAFICO
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsMuted((prev) => !prev)}
            aria-label="Toggle Audio"
            className="p-1 border border-white/40 bg-black/50 hover:bg-white hover:text-black transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#00FF66]" />}
          </button>

          <button
            type="button"
            onClick={() => setMatrixDensity((prev) => (prev === "high" ? "low" : prev === "low" ? "off" : "high"))}
            className="px-2 py-0.5 border border-[#00FF66] text-[#00FF66] font-mono font-bold text-[9px] uppercase tracking-wider bg-black/60 hover:bg-[#00FF66] hover:text-black transition-colors"
          >
            MATRIX: {matrixDensity.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div 
        onClick={handleScreenTap}
        className="relative w-full aspect-[4/5] sm:aspect-square bg-[#050A07] border-3 border-[#111213] shadow-brutal overflow-hidden cursor-crosshair group"
      >
        {/* Layer 0: Real Camera Video Stream or Fallback Background */}
        {cameraActive ? (
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="absolute inset-0 w-full h-full object-cover filter contrast-125 brightness-90 saturate-50"
          />
        ) : (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center filter contrast-125 brightness-75 grayscale"
            style={{ backgroundImage: `url('/images/walddei-space.jpg')` }}
          />
        )}

        {/* Layer 1: Matrix Digital Rain Canvas Overlay */}
        <canvas
          ref={matrixCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen z-10"
        />

        {/* Layer 2: Cybernetic HUD Reticle & Spatial Coordinates */}
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 font-mono text-[9px]">
          {/* Top HUD Line */}
          <div className="flex items-center justify-between text-[#00FF66] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-1.5 bg-black/70 px-2 py-0.5 border border-[#00FF66]/40">
              <Scan className="w-3 h-3 text-[#00FF66] animate-spin" />
              <span>LIDAR: {cameraActive ? "CAMERA_STREAM_ACTIVE" : "SIMULATION_MODE"}</span>
            </div>
            <div className="bg-black/70 px-2 py-0.5 border border-[#00FF66]/40">
              <span>HOLOTAG: PRONTO</span>
            </div>
          </div>

          {/* Center Targeting Reticle */}
          <div className="self-center flex flex-col items-center gap-1 opacity-70">
            <div className="w-12 h-12 border border-[#00FF66] flex items-center justify-center relative">
              <div className="w-2 h-2 bg-[#00FF66]" />
              <div className="absolute -top-1 w-2 h-0.5 bg-[#00FF66]" />
              <div className="absolute -bottom-1 w-2 h-0.5 bg-[#00FF66]" />
              <div className="absolute -left-1 h-2 w-0.5 bg-[#00FF66]" />
              <div className="absolute -right-1 h-2 w-0.5 bg-[#00FF66]" />
            </div>
            <span className="text-[8px] text-[#00FF66] tracking-widest bg-black/70 px-1 border border-[#00FF66]/30">
              [ TARGET: SURFACE LOCK ]
            </span>
          </div>

          {/* Bottom HUD Feedback */}
          <div className="flex items-end justify-between text-white drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
            <div className="bg-black/80 p-1.5 border border-white/30 max-w-[210px]">
              <span className="text-[#00FF66] font-bold block text-[8px] uppercase">
                &gt; AMBIENTE RICONOSCIUTO:
              </span>
              <span className="text-gray-300 text-[8px] uppercase leading-tight block">
                TOCCA LO SCHERMO PER ANCORARE L'HOLOTAG I WAALDDEI NELLO SPAZIO
              </span>
            </div>

            <div className="bg-black/80 px-2 py-1 border border-white/30 text-right">
              <span className="block text-[#00FF66] font-bold text-[8px]">
                TAG: {placedObjects.length} ATTIVI
              </span>
              <span className="block text-gray-400 text-[8px]">
                X: {gyro.x.toFixed(1)}° | Y: {gyro.y.toFixed(1)}°
              </span>
            </div>
          </div>
        </div>

        {/* Layer 3: Placed Lightweight Holographic AR Tags (NO HEAVY CONCRETE MONOLITH) */}
        <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
          {placedObjects.map((obj, idx) => (
            <div
              key={obj.id}
              className="absolute transition-transform duration-75 ease-out"
              style={{
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                transform: `
                  translate(-50%, -50%) 
                  translate(${gyro.x * (idx + 1) * 0.5}px, ${gyro.y * (idx + 1) * 0.5}px)
                  scale(${obj.scale})
                `,
              }}
            >
              {/* Sleek Floating Holographic AR Tag */}
              <div className="relative flex flex-col items-center group/card animate-in zoom-in-75 duration-200">
                
                {/* Floating Glass Holo Plaque */}
                <div className="relative w-32 h-24 sm:w-40 sm:h-28 bg-[#111213]/90 backdrop-blur-md border-2 border-[#00FF66] shadow-[0_0_20px_rgba(0,255,102,0.45)] flex flex-col justify-between p-2 rounded-lg overflow-hidden">
                  
                  {/* Subtle Scanline Overlay */}
                  <div 
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, #00FF66 0px, #00FF66 1px, transparent 1px, transparent 6px)`,
                    }}
                  />

                  {/* Header: Tag Code & Delicate Botanical Green Accent */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-mono text-[8px] font-black tracking-widest text-[#00FF66] uppercase bg-black/70 px-1.5 py-0.5 border border-[#00FF66]/40">
                      TAG 0{idx + 1}
                    </span>
                    <div className="flex items-center gap-1 text-[#A8FF78]">
                      <Leaf className="w-3 h-3 text-[#A8FF78]" />
                      <span className="font-mono text-[7px] font-bold uppercase text-white/90">BOTANICA</span>
                    </div>
                  </div>

                  {/* Official Logo (Floating Centered) */}
                  <div className="relative z-10 flex items-center justify-center my-auto py-0.5">
                    <WaalddeiLogo
                      className="w-auto h-7 sm:h-9 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                    />
                  </div>

                  {/* Footer Bar: Coordinate & Corten Accent */}
                  <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-1 text-[7px] font-mono text-gray-300">
                    <span className="text-[#C85A17] font-bold">I WAALDDEI</span>
                    <span className="text-[#00FF66] font-bold">ANCORATO</span>
                  </div>
                </div>

                {/* Ground Target Beacon Reticle */}
                <div className="mt-1 flex items-center gap-1 text-[8px] font-mono font-bold text-[#00FF66] bg-black/85 px-2 py-0.5 border border-[#00FF66]/50 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-[#00FF66] animate-ping" />
                  <span>{obj.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scanline Sweep Animation */}
        <div 
          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00FF66] to-transparent opacity-70 pointer-events-none z-25"
          style={{
            top: `${(scanStep * 25) + 10}%`,
            transition: "top 1.2s ease-in-out"
          }}
        />
      </div>

      {/* Control Action Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {/* Button 1: Reset / Clear Placed Objects */}
        <button
          type="button"
          onClick={clearObjects}
          className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#FFFFFF] hover:bg-[#F4F4F0] text-[#111213] border-2 border-[#111213] font-mono font-bold text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_#111213] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#111213]" />
          <span>RESET TAG</span>
        </button>

        {/* Button 2: Restart / Toggle Camera */}
        <button
          type="button"
          onClick={() => {
            if (cameraActive) stopCamera();
            else startCamera();
          }}
          className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#FFFFFF] hover:bg-[#F4F4F0] text-[#111213] border-2 border-[#111213] font-mono font-bold text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_#111213] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5 text-[#111213]" />
          <span>{cameraActive ? "STOP CAMERA" : "AVVIA CAMERA"}</span>
        </button>

        {/* Button 3: Switch to 3D Materioteca Viewer */}
        <button
          type="button"
          onClick={onSwitchToViewer}
          style={{ backgroundColor: accentColor }}
          className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 py-2 px-2 text-white border-2 border-[#111213] font-mono font-bold text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_#111213] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <Box className="w-3.5 h-3.5 text-white" />
          <span>VISTA 3D TOTEM</span>
        </button>
      </div>

      {/* Guide Banner */}
      <div className="bg-[#FFFFFF] border-2 border-[#111213] p-2.5 shadow-[2px_2px_0px_#111213]">
        <div className="flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#00FF66] flex-shrink-0 mt-0.5 bg-black p-0.5" />
          <p className="font-mono text-[9.5px] uppercase tracking-wide text-raw-muted leading-tight">
            {arConfig?.instructions || 
              "INQUADRA LA STANZA O TOCCA LO SCHERMO PER ANCORARE L'HOLOTAG I WAALDDEI NELLO SPAZIO CON VISIONE MATRIX E DETTAGLI BOTANICI."}
          </p>
        </div>
      </div>

    </div>
  );
}
