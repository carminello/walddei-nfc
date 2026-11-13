"use client";

import { useEffect, useRef, useState } from "react";
import { 
  Camera, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Box, 
  Move3d, 
  Ruler, 
  Check, 
  Compass, 
  Maximize2,
  Sliders,
  Leaf
} from "lucide-react";

export default function BrutalistInteriorAr({ arConfig, brandConfig, onSwitchToViewer }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState("corten"); // "corten" | "nero" | "cemento"
  const [showDimensions, setShowDimensions] = useState(true);
  const [placedPosition, setPlacedPosition] = useState({ x: 50, y: 62 });
  const [gyro, setGyro] = useState({ x: 0, y: 0 });

  const accentColor = brandConfig?.accentColor || "#C85A17";

  // Catalog of Brutalist Interior Design Furniture pieces
  const furniturePieces = [
    {
      id: "table-monolith",
      code: "FURN // 01",
      name: "TAVOLO BASSO 'MONOLITH'",
      category: "TAVOLO DA SALOTTO SCULTOREO",
      dimensions: "1100 x 650 x H 380 mm",
      description: "Piano in calcestruzzo a cassaforma di legno, setto portante asimmetrico in acciaio corten e vasca fioriera centrale a filo con pianta da interno integrata.",
      materials: ["BÉTON BRUT", "ACCIAIO CORTEN", "ROVERE BRUCIATO", "VERDE INTEGRATO"],
      modelPath: "/models/walddei-monolith.glb"
    },
    {
      id: "bench-cassero",
      code: "FURN // 02",
      name: "PANCA SCULTOREA 'CASSERO'",
      category: "SEDUTA ARCHITETTONICA",
      dimensions: "1400 x 450 x H 420 mm",
      description: "Blocco continuo in microcemento epossidico ad alta densità con venature lignee impresse a caldo e cuscino in cuoio conciato naturale.",
      materials: ["MICROCEMENTO", "DOGHE DI CASSERATURA", "CUOIO NATURALE"],
      modelPath: "/models/walddei-monolith.glb"
    },
    {
      id: "lamp-feritoia",
      code: "FURN // 03",
      name: "TOTEM LUMINOSO 'FERITOIA'",
      category: "SCULTURA LUMINOSA DA TERRA",
      dimensions: "320 x 320 x H 1250 mm",
      description: "Fusto verticale in acciaio brunito a taglio laser con lama radente a luce calda indiretta 2700K incastonata nel blocco basamentale.",
      materials: ["ACCIAIO BRUNITO", "DIFFUSORE OPALINO", "BASE IN CALCESTRUZZO"],
      modelPath: "/models/walddei-monolith.glb"
    }
  ];

  const currentPiece = furniturePieces[selectedItemIndex];

  // 1. Camera Initialization
  const startCamera = async () => {
    try {
      if (!navigator?.mediaDevices?.getUserMedia) return;
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
    } catch {
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // 2. Gyroscope listener for real spatial perspective
  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        const g = Math.max(-30, Math.min(30, e.gamma));
        const b = Math.max(-30, Math.min(30, e.beta - 45));
        setGyro({
          x: (g / 30) * 12,
          y: (b / 30) * 8
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

  // Handle tap to position the furniture piece in the room
  const handleViewportTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tapX = ((e.clientX - rect.left) / rect.width) * 100;
    const tapY = ((e.clientY - rect.top) / rect.height) * 100;

    // Constrain within floor zone
    setPlacedPosition({
      x: Math.max(25, Math.min(75, tapX)),
      y: Math.max(45, Math.min(78, tapY))
    });
  };

  return (
    <div className="w-full flex flex-col gap-2.5 select-none">
      
      {/* Architectural Viewport Header Bar */}
      <div className="flex items-center justify-between bg-[#111213] text-white p-2.5 border-2 border-[#111213] shadow-[2px_2px_0px_#FFFFFF]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#C85A17] border border-white" />
          <div>
            <h3 className="font-mono font-bold text-[11px] tracking-wider text-white uppercase">
              INTERIOR STAGING AR // I WAALDDEI
            </h3>
            <p className="font-mono text-[8px] text-gray-400 tracking-wider uppercase">
              PROIEZIONE IN SCALA 1:1 // SPAZIO SALOTTO
            </p>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowDimensions((prev) => !prev)}
            className={`px-2 py-0.5 border font-mono font-bold text-[9px] uppercase tracking-wider transition-all ${
              showDimensions 
                ? "bg-[#C85A17] text-white border-white shadow-[1px_1px_0px_#FFFFFF]" 
                : "bg-black/60 text-gray-300 border-white/40"
            }`}
          >
            <span className="flex items-center gap-1">
              <Ruler className="w-3 h-3" />
              <span>QUOTE: {showDimensions ? "ON" : "OFF"}</span>
            </span>
          </button>
        </div>
      </div>

      {/* Main Architectural Camera Viewport */}
      <div
        onClick={handleViewportTap}
        className="relative w-full aspect-[4/5] sm:aspect-square bg-[#1A1C1E] border-3 border-[#111213] shadow-brutal overflow-hidden cursor-crosshair group"
      >
        {/* Layer 0: Camera Feed or Real Interior Space Background */}
        {cameraActive ? (
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="absolute inset-0 w-full h-full object-cover filter contrast-110 brightness-95"
          />
        ) : (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center filter contrast-115 brightness-85"
            style={{ backgroundImage: `url('/images/walddei-space.jpg')` }}
          />
        )}

        {/* Layer 1: Architectural Laser Horizon & Floor Perspective Grid */}
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3 font-mono text-[9px]">
          
          {/* Top Architectural Banner */}
          <div className="flex items-center justify-between text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-1.5 bg-[#111213]/90 px-2 py-0.5 border border-white/60">
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse" />
              <span className="font-bold">PIANO PAVIMENTO CALIBRATO [0.0m]</span>
            </div>
            <div className="bg-[#111213]/90 px-2 py-0.5 border border-white/60 text-right">
              <span>PASSO GRIGLIA: 50x50 cm</span>
            </div>
          </div>

          {/* Perspective Floor Grid Simulation */}
          <div 
            className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none opacity-25"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)
              `,
              backgroundSize: "40px 24px",
              transform: "perspective(300px) rotateX(55deg)",
              transformOrigin: "bottom center"
            }}
          />

          {/* Laser Horizon Center Line */}
          <div className="absolute inset-x-0 top-[52%] border-b border-dashed border-[#C85A17]/60 pointer-events-none flex items-center justify-between px-3">
            <span className="text-[8px] text-[#C85A17] bg-black/80 px-1 font-bold">LIVELLA LASER 0.0°</span>
            <span className="text-[8px] text-[#C85A17] bg-black/80 px-1 font-bold">QUOTA PIANO: +380 mm</span>
          </div>

          {/* Bottom Tap Instruction */}
          <div className="flex items-end justify-between text-white drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
            <div className="bg-[#111213]/90 p-2 border-2 border-white max-w-[240px]">
              <span className="text-[#C85A17] font-bold block text-[8px] uppercase">
                &gt; POSIZIONAMENTO NELLO SPAZIO:
              </span>
              <span className="text-gray-200 text-[8.5px] uppercase font-bold leading-tight block">
                TOCCA IL PAVIMENTO PER COLLOCARE L'ARREDO IN STANZA
              </span>
            </div>

            <div className="bg-[#111213]/90 px-2 py-1 border border-white text-right">
              <span className="block text-[#00FF66] font-bold text-[8px]">
                SCALA: 1:1 REALE
              </span>
              <span className="block text-gray-300 text-[8px]">
                {currentPiece.dimensions}
              </span>
            </div>
          </div>
        </div>

        {/* Layer 2: Placed Brutalist Furniture Piece with Dimensions & Materials */}
        <div
          className="absolute pointer-events-none z-20 transition-all duration-100 ease-out flex flex-col items-center"
          style={{
            left: `${placedPosition.x}%`,
            top: `${placedPosition.y}%`,
            transform: `
              translate(-50%, -70%) 
              translate(${gyro.x}px, ${gyro.y}px)
            `,
          }}
        >
          {/* Dimension Dimensioning Arrows (Top Line) */}
          {showDimensions && (
            <div className="w-full flex items-center justify-between text-[8px] font-mono font-bold text-[#FFFFFF] bg-[#111213]/90 border border-white px-2 py-0.5 mb-1.5 shadow-sm">
              <span>|&lt;</span>
              <span className="tracking-widest uppercase text-[#C85A17]">{currentPiece.dimensions}</span>
              <span>&gt;|</span>
            </div>
          )}

          {/* Realistic Architectural Visualizer Representation of the Furniture */}
          <div className="relative group/piece animate-in zoom-in-95 duration-200">
            
            {/* Ground Contact Soft Occlusion Shadow */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-48 sm:w-60 h-8 bg-black/60 rounded-full blur-md" />

            {/* Brutalist Sculptural Coffee Table Render Structure */}
            {selectedItemIndex === 0 && (
              <div className="relative w-44 h-28 sm:w-56 sm:h-36 flex flex-col justify-between">
                
                {/* 1. Heavy Formwork Concrete Top Plate */}
                <div className="relative w-full h-11 bg-[#D2D2CC] border-2 border-[#111213] shadow-[4px_4px_0px_#111213] p-1.5 flex items-center justify-between z-20">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[7px] font-black bg-[#111213] text-white px-1">
                      BÉTON BRUT
                    </span>
                    <span className="font-mono text-[7px] font-bold text-[#111213]">CASSERATURA A LEGNO</span>
                  </div>

                  {/* Integrated Central Planter Cutout */}
                  <div className="relative w-12 h-8 bg-[#2A2B2C] border border-[#111213] flex items-center justify-center overflow-hidden">
                    <Leaf className="w-4 h-4 text-[#4ADE80]" />
                    <span className="absolute bottom-0 text-[5px] font-mono text-white/90 uppercase font-bold">PIANTA VIVA</span>
                  </div>
                </div>

                {/* 2. Asymmetric Support Bases (Left: Thick Concrete Pier / Right: Corten Plate) */}
                <div className="relative w-full h-14 flex items-end justify-between px-2 z-10 -mt-1">
                  
                  {/* Left Pier: Solid Concrete Monolithic Block */}
                  <div className="w-14 h-full bg-[#B8B8B2] border-2 border-[#111213] shadow-[2px_2px_0px_#111213] p-1 flex flex-col justify-end text-[6px] font-mono font-bold text-[#111213]">
                    <span>SETTO CEMENTO</span>
                    <span className="text-[5px] text-gray-600">SPESSORE 12cm</span>
                  </div>

                  {/* Center Horizontal Smoked Oak Tie Beam */}
                  <div className="w-14 h-3 bg-[#2D241E] border border-[#111213] my-auto flex items-center justify-center">
                    <span className="text-[5px] font-mono text-white/80">ROVERE BRUCIATO</span>
                  </div>

                  {/* Right Pier: Slim Oxidized Corten Blade */}
                  <div 
                    className="w-4 h-full border-2 border-[#111213] shadow-[2px_2px_0px_#111213] flex items-center justify-center"
                    style={{
                      backgroundColor: selectedFinish === "corten" ? "#C85A17" : selectedFinish === "nero" ? "#1A1A1A" : "#8A8A85"
                    }}
                  >
                    <span className="font-mono text-[5px] text-white -rotate-90 whitespace-nowrap font-bold">
                      {selectedFinish.toUpperCase()}
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* Bench "Cassero" Representation */}
            {selectedItemIndex === 1 && (
              <div className="relative w-48 h-24 sm:w-60 sm:h-30 flex flex-col justify-between">
                {/* Leather Cushion on Top */}
                <div className="w-full h-6 bg-[#6B4423] border-2 border-[#111213] p-1 flex items-center justify-between text-white text-[7px] font-mono font-bold">
                  <span>CUOIO GREZZO NATURALE</span>
                  <span className="bg-black/60 px-1">SELLERIA</span>
                </div>
                {/* Monolithic Concrete Beam Bench Base */}
                <div className="w-full h-14 bg-[#C5C5BF] border-2 border-[#111213] shadow-[4px_4px_0px_#111213] p-2 flex items-center justify-between">
                  <span className="font-mono text-[8px] font-black text-[#111213]">BÉTON BRUT CASSERATO 1400mm</span>
                  <span className="font-mono text-[7px] bg-[#111213] text-white px-1">MASSELLO</span>
                </div>
              </div>
            )}

            {/* Light Pillar "Feritoia" Representation */}
            {selectedItemIndex === 2 && (
              <div className="relative w-20 h-40 sm:w-24 sm:h-48 bg-[#1B1D1F] border-2 border-[#111213] shadow-[4px_4px_0px_#111213] p-1.5 flex flex-col justify-between">
                <div className="text-[7px] font-mono font-bold text-white bg-black px-1">FERITOIA TOTEM</div>
                {/* Radiant Light Slit */}
                <div className="w-1.5 h-28 bg-[#FFE5B4] shadow-[0_0_12px_#FFD27D] mx-auto border-x border-[#111213]" />
                <div className="w-full h-5 bg-[#A8A8A2] border border-[#111213] text-[6px] font-mono font-bold text-black flex items-center justify-center">
                  BASE CALCESTRUZZO
                </div>
              </div>
            )}

            {/* Architectural Spec Stamp Tag */}
            <div className="mt-2 flex items-center justify-between gap-1 text-[8px] font-mono font-bold bg-[#111213] text-white px-2 py-0.5 border border-white/80 shadow-[2px_2px_0px_#FFFFFF]">
              <span className="text-[#C85A17]">{currentPiece.code}</span>
              <span>{currentPiece.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Brutalist Interior Furniture Catalog Selector (3 Cards) */}
      <div className="grid grid-cols-3 gap-1.5">
        {furniturePieces.map((piece, idx) => (
          <button
            key={piece.id}
            type="button"
            onClick={() => setSelectedItemIndex(idx)}
            className={`p-2 border-2 text-left transition-all cursor-pointer ${
              selectedItemIndex === idx
                ? "bg-[#111213] text-white border-[#111213] shadow-[3px_3px_0px_#C85A17]"
                : "bg-white text-[#111213] border-[#111213] hover:bg-[#F4F4F0]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[8px] font-mono font-bold px-1 ${
                selectedItemIndex === idx ? "bg-[#C85A17] text-white" : "bg-[#E5E5E0] text-black"
              }`}>
                0{idx + 1}
              </span>
              {selectedItemIndex === idx && <Check className="w-3 h-3 text-[#C85A17]" />}
            </div>
            <span className="block font-mono font-bold text-[9.5px] uppercase tracking-tight leading-tight line-clamp-1">
              {piece.name.replace(/'.*?'/, '').trim()}
            </span>
            <span className="block font-mono text-[7.5px] text-gray-400 uppercase truncate mt-0.5">
              {piece.category}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Piece Architectural Spec Card */}
      <div className="bg-[#FFFFFF] border-2 border-[#111213] p-3 shadow-[2px_2px_0px_#111213]">
        <div className="flex items-start justify-between border-b border-[#111213]/20 pb-1.5 mb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[8px] font-bold px-1 bg-[#111213] text-white">
                {currentPiece.code}
              </span>
              <h4 className="font-mono font-bold text-xs uppercase tracking-tight text-[#111213]">
                {currentPiece.name}
              </h4>
            </div>
            <span className="font-mono text-[9px] text-[#C85A17] font-bold uppercase mt-0.5 block">
              INGOMBRO: {currentPiece.dimensions}
            </span>
          </div>

          {/* Finish selector for the selected piece */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-[8px] text-gray-500 uppercase mr-0.5">METALLO:</span>
            {["corten", "nero", "cemento"].map((fin) => (
              <button
                key={fin}
                type="button"
                onClick={() => setSelectedFinish(fin)}
                className={`w-5 h-5 border border-[#111213] text-[6px] font-mono font-bold uppercase flex items-center justify-center transition-all ${
                  selectedFinish === fin ? "ring-2 ring-[#C85A17] font-black" : "opacity-70"
                }`}
                style={{
                  backgroundColor: fin === "corten" ? "#C85A17" : fin === "nero" ? "#1A1A1A" : "#B8B8B2",
                  color: "#FFFFFF"
                }}
              >
                {fin[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <p className="font-mono text-[10px] text-gray-700 leading-relaxed uppercase mb-2">
          {currentPiece.description}
        </p>

        {/* Material badges */}
        <div className="flex flex-wrap gap-1 pt-1.5 border-t border-[#111213]/20">
          {currentPiece.materials.map((m, i) => (
            <span key={i} className="text-[7.5px] font-mono font-bold px-1.5 py-0.5 bg-[#EAEAEA] border border-[#111213] text-[#111213] uppercase">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {/* Toggle / Restart Camera */}
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

        {/* Switch to 3D Inspection Viewer */}
        <button
          type="button"
          onClick={onSwitchToViewer}
          style={{ backgroundColor: accentColor }}
          className="flex items-center justify-center gap-1.5 py-2 px-2 text-white border-2 border-[#111213] font-mono font-bold text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_#111213] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <Box className="w-3.5 h-3.5 text-white" />
          <span>ISPEZIONE 3D MATERICA</span>
        </button>
      </div>

    </div>
  );
}
