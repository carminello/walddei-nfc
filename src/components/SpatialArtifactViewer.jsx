"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { 
  Sun, 
  Moon, 
  Sunset, 
  Sunrise, 
  Sparkles, 
  Layers, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Eye, 
  Box, 
  Compass, 
  Sliders,
  Maximize2
} from "lucide-react";

export default function SpatialArtifactViewer({ arConfig, brandConfig, onClose }) {
  const viewerRef = useRef(null);
  const [isViewerLoaded, setIsViewerLoaded] = useState(false);
  const [sunPhase, setSunPhase] = useState("noon"); // "dawn" | "noon" | "dusk" | "night"
  const [selectedMaterial, setSelectedMaterial] = useState("concrete");
  const [isMuted, setIsMuted] = useState(true);
  const [cameraOrbit, setCameraOrbit] = useState("35deg 70deg 105%");
  const [gyro, setGyro] = useState({ x: 0, y: 0 });

  const accentColor = brandConfig?.accentColor || "#C85A17";

  // Light environments data
  const sunModes = {
    dawn: {
      label: "ALBA // 07:30",
      icon: Sunrise,
      exposure: "0.95",
      shadowIntensity: "1.8",
      shadowSoftness: "0.6",
      skyGradient: "from-[#2B1B17] via-[#1B1D1F] to-[#121315]",
      lightTone: "#FFB088",
      desc: "Luce radente calda del primo mattino. Le ombre lunghe esaltano la porosità del calcestruzzo."
    },
    noon: {
      label: "MEZZOGIORNO // 12:00",
      icon: Sun,
      exposure: "1.15",
      shadowIntensity: "1.4",
      shadowSoftness: "0.2",
      skyGradient: "from-[#EBECE9] via-[#E2E3DF] to-[#D5D6D0]",
      lightTone: "#FFFFFF",
      desc: "Luce zenitale pura ad alto contrasto. I volumi geometrici e gli spigoli vivi emergono con nitidezza."
    },
    dusk: {
      label: "TRAMONTO // 19:45",
      icon: Sunset,
      exposure: "1.0",
      shadowIntensity: "2.0",
      shadowSoftness: "0.5",
      skyGradient: "from-[#351E14] via-[#1F1714] to-[#111213]",
      lightTone: "#C85A17",
      desc: "Luce calda dorata che fa vibrare le sfumature ossidate delle lame in acciaio corten."
    },
    night: {
      label: "NOTTE D'INTERNI // 22:30",
      icon: Moon,
      exposure: "0.75",
      shadowIntensity: "2.2",
      shadowSoftness: "0.3",
      skyGradient: "from-[#0F1012] via-[#090A0B] to-[#040506]",
      lightTone: "#FFE2B3",
      desc: "Illuminazione architetturale a faretto puntuale. Profondità scultorea e giochi di penombra."
    }
  };

  const currentSun = sunModes[sunPhase];

  // Synthesize acoustic resonance of concrete and steel architecture
  const playResonanceTone = useCallback((freq = 110, duration = 0.2) => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, [isMuted]);

  // Client-side dynamic import of @google/model-viewer for 60fps WebGL
  useEffect(() => {
    let isMounted = true;
    import("@google/model-viewer")
      .then(() => {
        if (isMounted) setIsViewerLoaded(true);
      })
      .catch((err) => {
        console.error("3D WebGL runtime notice:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Gyroscope tilt interaction
  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        const g = Math.max(-25, Math.min(25, e.gamma));
        const b = Math.max(-25, Math.min(25, e.beta - 45));
        setGyro({
          x: parseFloat((g / 25).toFixed(2)),
          y: parseFloat((b / 25).toFixed(2))
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

  const changeSunPhase = (phaseKey) => {
    setSunPhase(phaseKey);
    playResonanceTone(phaseKey === "dawn" ? 140 : phaseKey === "noon" ? 220 : phaseKey === "dusk" ? 110 : 80, 0.25);
  };

  const resetCamera = () => {
    if (viewerRef.current) {
      viewerRef.current.cameraOrbit = "35deg 70deg 105%";
      viewerRef.current.cameraTarget = "auto auto auto";
      viewerRef.current.fieldOfView = "auto";
    }
  };

  return (
    <div className="w-full flex flex-col gap-2.5 select-none">
      
      {/* Viewport Header Bar */}
      <div className="flex items-center justify-between bg-[#111213] text-white p-2.5 border-2 border-[#111213] shadow-[2px_2px_0px_#FFFFFF]">
        <div className="flex items-center gap-2">
          <div 
            className="w-2.5 h-2.5 rounded-none" 
            style={{ backgroundColor: accentColor }} 
          />
          <div>
            <h3 className="font-mono font-bold text-[11px] tracking-wider text-white uppercase">
              PORTALE ARCHITETTONICO // SCULTURA MATERICA
            </h3>
            <p className="font-mono text-[8px] text-gray-400 tracking-wider uppercase">
              SIMULATORE DI LUCE NATURALE &amp; BÉTON BRUT
            </p>
          </div>
        </div>

        {/* Audio Mute & Reset */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsMuted((prev) => !prev)}
            aria-label="Toggle Audio Acustico"
            className="p-1 border border-white/40 bg-black/60 hover:bg-white hover:text-black transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#C85A17]" />}
          </button>
          
          <button
            type="button"
            onClick={resetCamera}
            title="Reimposta vista"
            className="p-1 border border-white/40 bg-black/60 hover:bg-white hover:text-black transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className={`relative w-full aspect-[4/5] sm:aspect-square border-3 border-[#111213] shadow-brutal overflow-hidden transition-colors duration-500 bg-gradient-to-b ${currentSun.skyGradient}`}>
        
        {/* Top Floating Badge: Sun Phase State */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-1.5 bg-[#111213]/90 text-white px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider border border-white/70 shadow-[2px_2px_0px_#000000]">
            <currentSun.icon className="w-3.5 h-3.5 text-[#C85A17]" />
            <span>{currentSun.label}</span>
          </div>

          <div className="pointer-events-auto bg-[#111213]/90 text-white px-2 py-1 text-[8px] font-mono border border-white/40">
            <span>60 FPS // GPU WEBGL</span>
          </div>
        </div>

        {/* 3D WebGL Canvas */}
        {!isViewerLoaded ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-10 h-10 border-2 border-white border-t-transparent animate-spin mb-4" />
            <p className="font-mono text-xs font-bold tracking-widest uppercase">
              CARICAMENTO GEOMETRIA SCULTOREA...
            </p>
          </div>
        ) : (
          <model-viewer
            ref={viewerRef}
            src="/models/walddei-monolith.glb"
            poster="/images/monolith-poster.png"
            alt="I WAALDDEI Scultura Spaziale Architettura Brutalista"
            camera-controls
            auto-rotate
            rotation-per-second="10deg"
            shadow-intensity={currentSun.shadowIntensity}
            shadow-softness={currentSun.shadowSoftness}
            exposure={currentSun.exposure}
            camera-orbit="35deg 70deg 105%"
            touch-action="pan-y"
            interaction-prompt="auto"
            style={{ width: "100%", height: "100%" }}
          >
            {/* Hotspots: Pure Material Nodes */}
            <button
              slot="hotspot-1"
              data-position="0.0m 0.15m 0.11m"
              data-normal="0m 0m 1m"
              onClick={() => setSelectedMaterial("corten")}
              className={`ar-hotspot-pin ${selectedMaterial === "corten" ? "accent-active" : ""}`}
              style={{ backgroundColor: accentColor }}
            >
              <span>01</span>
            </button>

            <button
              slot="hotspot-2"
              data-position="-0.24m 0.20m 0.10m"
              data-normal="0m 0m 1m"
              onClick={() => setSelectedMaterial("concrete")}
              className={`ar-hotspot-pin ${selectedMaterial === "concrete" ? "accent-active" : ""}`}
            >
              <span>02</span>
            </button>

            <button
              slot="hotspot-3"
              data-position="0.0m -0.34m 0.22m"
              data-normal="0m 1m 0m"
              onClick={() => setSelectedMaterial("base")}
              className={`ar-hotspot-pin ${selectedMaterial === "base" ? "accent-active" : ""}`}
            >
              <span>03</span>
            </button>
          </model-viewer>
        )}

        {/* Parallax Horizon Glow */}
        <div 
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none opacity-30 mix-blend-screen transition-transform duration-75"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${currentSun.lightTone} 0%, transparent 75%)`,
            transform: `translateX(${gyro.x * 20}px)`,
          }}
        />

        {/* Touch Hint Overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between text-[8px] font-mono text-white/80 pointer-events-none">
          <span className="bg-black/60 px-1.5 py-0.5 border border-white/20">
            TRASCINA PER RUOTARE A 360° // PINCH PER ZOOM
          </span>
          <span className="bg-black/60 px-1.5 py-0.5 border border-white/20">
            PARALLASSE GIROSCOPIO: ATTIVA
          </span>
        </div>
      </div>

      {/* Sun Phase Controller Bar (4 Lighting Scenarios) */}
      <div className="flex flex-col gap-1.5 bg-[#FFFFFF] border-2 border-[#111213] p-2.5 shadow-[2px_2px_0px_#111213]">
        <div className="flex items-center justify-between border-b border-[#111213]/20 pb-1.5">
          <span className="font-mono font-bold text-[9px] uppercase tracking-wider text-[#111213]">
            INCIDENZA DELLA LUCE NATURALE:
          </span>
          <span className="font-mono text-[8px] text-gray-500 uppercase">
            STUDIO DELLE OMBRE
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {Object.entries(sunModes).map(([key, data]) => {
            const Icon = data.icon;
            const isSelected = sunPhase === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => changeSunPhase(key)}
                className={`flex flex-col items-center justify-center p-1.5 border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#111213] text-white border-[#111213] shadow-[2px_2px_0px_#C85A17]"
                    : "bg-[#F4F5F4] text-[#111213] border-[#111213] hover:bg-white"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 mb-0.5 ${isSelected ? "text-[#C85A17]" : "text-[#111213]"}`} />
                <span className="font-mono font-bold text-[8px] uppercase tracking-tighter">
                  {key.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>

        <p className="font-mono text-[9px] text-gray-700 leading-tight uppercase mt-1">
          {currentSun.desc}
        </p>
      </div>

      {/* Material Exploration Specs Card */}
      <div className="bg-[#FFFFFF] border-2 border-[#111213] p-3 shadow-[2px_2px_0px_#111213]">
        <div className="flex items-center justify-between border-b border-[#111213]/20 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[8px] font-bold px-1.5 py-0.5 bg-[#111213] text-white">
              {selectedMaterial === "corten" ? "MAT // 01" : selectedMaterial === "concrete" ? "MAT // 02" : "MAT // 03"}
            </span>
            <h4 className="font-mono font-bold text-xs uppercase tracking-tight text-[#111213]">
              {selectedMaterial === "corten" 
                ? "ACCIAIO CORTEN OSSIDATO A CALDO" 
                : selectedMaterial === "concrete" 
                ? "BÉTON BRUT A CASSAFORMA DI LEGNO" 
                : "BASAMENTO ARCHITETTONICO A GRADONI"}
            </h4>
          </div>
        </div>

        <p className="font-mono text-[10px] text-gray-700 leading-relaxed uppercase mb-2">
          {selectedMaterial === "corten"
            ? "Lama centrale strutturale con ossidazione naturale controllata e sigillatura a cera microcristallina, che cattura e riflette i toni caldi della luce radente."
            : selectedMaterial === "concrete"
            ? "Calcestruzzo strutturale colato in casseforme di doghe di rovere naturale. La trama del legno rimane scolpita a rilievo perenne sulla pietra."
            : "Plinto a blocchi rettificati ad alta densità minerale che ancora l'installazione spaziale con quote d'ombra profonde e nette."}
        </p>

        {/* Quick Material Selectors */}
        <div className="flex items-center gap-1.5 pt-1.5 border-t border-[#111213]/20">
          <span className="font-mono text-[8px] text-gray-500 uppercase mr-1">ISPEZIONA:</span>
          <button
            type="button"
            onClick={() => setSelectedMaterial("concrete")}
            className={`px-2 py-0.5 border font-mono font-bold text-[8px] uppercase transition-all ${
              selectedMaterial === "concrete" ? "bg-[#111213] text-white border-black" : "bg-[#EAEAEA] text-black border-black"
            }`}
          >
            BÉTON BRUT
          </button>
          <button
            type="button"
            onClick={() => setSelectedMaterial("corten")}
            className={`px-2 py-0.5 border font-mono font-bold text-[8px] uppercase transition-all ${
              selectedMaterial === "corten" ? "bg-[#C85A17] text-white border-black" : "bg-[#EAEAEA] text-black border-black"
            }`}
          >
            ACCIAIO CORTEN
          </button>
          <button
            type="button"
            onClick={() => setSelectedMaterial("base")}
            className={`px-2 py-0.5 border font-mono font-bold text-[8px] uppercase transition-all ${
              selectedMaterial === "base" ? "bg-[#111213] text-white border-black" : "bg-[#EAEAEA] text-black border-black"
            }`}
          >
            BASAMENTO
          </button>
        </div>
      </div>

    </div>
  );
}
