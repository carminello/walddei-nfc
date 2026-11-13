"use client";

import { useEffect, useState, useRef } from "react";
import BrutalistInteriorAr from "./BrutalistInteriorAr";
import { 
  Eye, 
  EyeOff, 
  Box, 
  Sparkles, 
  X, 
  RotateCcw, 
  Layers, 
  AlertCircle,
  Camera,
  Maximize2
} from "lucide-react";

export default function ArViewer({ arConfig, brandConfig, onClose }) {
  const [activeMode, setActiveMode] = useState("staging"); // "staging" | "3d"
  const [isViewerLoaded, setIsViewerLoaded] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [showHotspots, setShowHotspots] = useState(true);
  const [modelError, setModelError] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const viewerRef = useRef(null);

  const accentColor = brandConfig?.accentColor || "#C85A17";
  const hotspots = arConfig?.hotspots || [];

  // Client-side dynamic import of @google/model-viewer to prevent SSR conflicts
  useEffect(() => {
    let isMounted = true;
    import("@google/model-viewer")
      .then(() => {
        if (isMounted) setIsViewerLoaded(true);
      })
      .catch((err) => {
        console.error("Errore caricamento @google/model-viewer:", err);
        if (isMounted) setModelError(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen to model-viewer load and error events
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      setIsLoadingModel(false);
      setModelError(false);
    };

    const handleError = (e) => {
      console.warn("Model-viewer file loading warning:", e);
      setIsLoadingModel(false);
      setModelError(true);
    };

    const handleProgress = (event) => {
      if (event.detail?.totalProgress === 1) {
        setIsLoadingModel(false);
      }
    };

    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("error", handleError);
    viewer.addEventListener("progress", handleProgress);

    return () => {
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("error", handleError);
      viewer.removeEventListener("progress", handleProgress);
    };
  }, [isViewerLoaded, activeMode]);

  const resetCamera = () => {
    if (viewerRef.current) {
      viewerRef.current.cameraOrbit = "45deg 65deg 105%";
      viewerRef.current.cameraTarget = "auto auto auto";
      viewerRef.current.fieldOfView = "auto";
    }
  };

  return (
    <div className="w-full flex flex-col gap-2.5">
      
      {/* Top Mode Selector Tabs (Architectural Interior Navigation) */}
      <div className="flex items-center justify-between gap-1.5 border-b-2 border-[#111213] pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {/* Tab 1: Virtual Interior Staging AR */}
          <button
            type="button"
            onClick={() => setActiveMode("staging")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border-2 border-[#111213] transition-all cursor-pointer ${
              activeMode === "staging"
                ? "bg-[#111213] text-white shadow-[2px_2px_0px_#C85A17]"
                : "bg-[#FFFFFF] text-[#111213] hover:bg-[#EBECE9]"
            }`}
          >
            <Camera className="w-3 h-3 text-[#C85A17]" />
            <span>01 // INTERIOR STAGING AR</span>
          </button>

          {/* Tab 2: 3D Furniture Inspection */}
          <button
            type="button"
            onClick={() => setActiveMode("3d")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border-2 border-[#111213] transition-all cursor-pointer ${
              activeMode === "3d"
                ? "bg-[#111213] text-white shadow-[2px_2px_0px_#FFFFFF]"
                : "bg-[#FFFFFF] text-[#111213] hover:bg-[#EBECE9]"
            }`}
          >
            <Box className="w-3 h-3" style={{ color: accentColor }} />
            <span>02 // ARREDO D'AUTORE 3D</span>
          </button>
        </div>

        {/* Global Modal Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 bg-[#111213] hover:bg-[#C85A17] text-white px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border border-[#111213] transition-colors flex-shrink-0 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span className="hidden sm:inline">CHIUDI</span>
          </button>
        )}
      </div>

      {/* VIEWPORT BODY */}
      {activeMode === "staging" ? (
        /* ============================================================ */
        /* MODE 1: BRUTALIST INTERIOR STAGING AR (ROOM CAMERA)          */
        /* ============================================================ */
        <BrutalistInteriorAr
          arConfig={arConfig}
          brandConfig={brandConfig}
          onSwitchToViewer={() => setActiveMode("3d")}
        />
      ) : (
        /* ============================================================ */
        /* MODE 2: 3D MODEL VIEWER + NATIVE 1:1 WEBAR PROJECTION         */
        /* ============================================================ */
        <div className="w-full flex flex-col gap-2.5">
          {/* Main 3D Container with Brutalist 3px Border */}
          <div className="relative w-full aspect-[4/5] sm:aspect-square bg-[#F4F4F0] border-3 border-[#111213] shadow-brutal overflow-hidden group">
            
            {/* Top Control Overlay */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
              {/* Status Badge */}
              <div className="pointer-events-auto flex items-center gap-1.5 bg-[#111213] text-[#FFFFFF] px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider uppercase border border-[#111213] shadow-[2px_2px_0px_#FFFFFF]">
                <span className="relative flex h-2 w-2">
                  <span 
                    className="animate-ping absolute inline-flex h-full w-full opacity-75"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span 
                    className="relative inline-flex h-2 w-2"
                    style={{ backgroundColor: accentColor }}
                  />
                </span>
                <span>TAVOLO BASSO 'MONOLITH' // 3D</span>
              </div>

              {/* Quick Controls: Toggle Hotspots & Reset Camera */}
              <div className="pointer-events-auto flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowHotspots((prev) => !prev)}
                  aria-label="Mostra o nascondi punti materici"
                  className="flex items-center gap-1 bg-[#FFFFFF] hover:bg-[#F4F4F0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#111213] border-2 border-[#111213] px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#111213] transition-all cursor-pointer"
                >
                  {showHotspots ? (
                    <>
                      <Eye className="w-3 h-3 text-[#111213]" />
                      <span>PUNTI: ON</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3 text-raw-muted" />
                      <span>PUNTI: OFF</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetCamera}
                  aria-label="Reimposta prospettiva"
                  title="Reset prospettiva"
                  className="flex items-center justify-center bg-[#FFFFFF] hover:bg-[#F4F4F0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#111213] border-2 border-[#111213] p-1 text-[10px] shadow-[2px_2px_0px_#111213] transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 3D Model Viewer or Loading / Fallback State */}
            {!isViewerLoaded ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#EBEBE6]">
                <div className="w-10 h-10 border-2 border-[#111213] border-t-transparent animate-spin mb-4" />
                <p className="font-mono text-xs font-bold tracking-widest uppercase text-[#111213]">
                  INIZIALIZZAZIONE RUNTIME WEB-AR...
                </p>
                <p className="font-mono text-[10px] text-raw-muted mt-1 uppercase">
                  Caricamento modulo @google/model-viewer
                </p>
              </div>
            ) : modelError ? (
              /* Graceful Brutalist Fallback */
              <div className="w-full h-full flex flex-col justify-between p-5 bg-[#EBEBE6] text-[#111213] relative">
                <div className="pt-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 border-2 border-[#111213] bg-[#FFFFFF] shadow-brutal flex items-center justify-center mb-3">
                    <Box className="w-8 h-8 text-[#111213]" />
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#111213] text-white text-[10px] font-mono font-bold tracking-widest uppercase mb-2">
                    <AlertCircle className="w-3 h-3 text-[#C85A17]" />
                    <span>3D MODEL ASSET // STANDBY</span>
                  </div>
                  <h3 className="font-mono font-bold text-sm tracking-tight uppercase">
                    CARICAMENTO MODELLO D'ARREDO
                  </h3>
                </div>
              </div>
            ) : (
              /* Actual Model Viewer Element */
              <model-viewer
                ref={viewerRef}
                src={arConfig?.modelPath || "/models/walddei-monolith.glb"}
                poster={arConfig?.posterPath || "/images/monolith-poster.png"}
                alt="I WAALDDEI Tavolo Basso Brutalista Monolith"
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                rotation-per-second="14deg"
                shadow-intensity="1.5"
                shadow-softness="0.25"
                exposure="1.0"
                camera-orbit="45deg 65deg 105%"
                touch-action="pan-y"
                interaction-prompt="auto"
              >
                {/* Dynamic Hotspot Buttons in 3D Space */}
                {showHotspots &&
                  hotspots.map((hotspot, index) => {
                    const isSelected = selectedHotspot?.id === hotspot.id;
                    return (
                      <button
                        key={hotspot.id || index}
                        slot={hotspot.slot || `hotspot-${index + 1}`}
                        data-position={hotspot.position}
                        data-normal={hotspot.normal}
                        onClick={() => setSelectedHotspot(hotspot)}
                        aria-label={`Ispeziona finitura: ${hotspot.title}`}
                        className={`ar-hotspot-pin ${isSelected ? "accent-active" : ""}`}
                        style={
                          isSelected
                            ? { backgroundColor: accentColor, color: "#FFFFFF", borderColor: "#111213" }
                            : {}
                        }
                      >
                        <span>{hotspot.code?.replace("MAT // ", "") || index + 1}</span>
                      </button>
                    );
                  })}

                {/* Custom AR Trigger Button (Slot ar-button recognized by model-viewer) */}
                <button
                  slot="ar-button"
                  style={{ backgroundColor: accentColor }}
                  className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6 z-20 flex items-center justify-center gap-2 px-4 py-3.5 text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#111213] shadow-brutal active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>{arConfig?.arButtonLabel || "[ PROIETTA IN SALOTTO IN SCALA 1:1 // AR ]"}</span>
                </button>
              </model-viewer>
            )}

            {/* Selected Hotspot Material Spec Overlay Card */}
            {selectedHotspot && (
              <div className="absolute inset-x-3 bottom-16 sm:bottom-20 z-30 bg-[#FFFFFF] border-3 border-[#111213] p-4 shadow-brutal animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-start justify-between gap-3 border-b-2 border-[#111213] pb-2 mb-2">
                  <div>
                    <span 
                      className="inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold text-white uppercase tracking-widest mb-1"
                      style={{ backgroundColor: accentColor }}
                    >
                      {selectedHotspot.code}
                    </span>
                    <h4 className="font-mono font-bold text-sm text-[#111213] uppercase tracking-tight">
                      {selectedHotspot.title}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedHotspot(null)}
                    aria-label="Chiudi scheda finitura"
                    className="p-1 border-2 border-[#111213] bg-[#E5E5E0] hover:bg-[#D4D4CE] active:translate-x-[2px] active:translate-y-[2px] text-[#111213] transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <p className="font-mono text-xs text-[#111213] leading-relaxed">
                  {selectedHotspot.description}
                </p>

                <div className="mt-3 pt-2 border-t border-dashed border-[#111213]/40 flex items-center justify-between text-[10px] font-mono text-raw-muted">
                  <span>POS: {selectedHotspot.position}</span>
                  <span className="font-bold text-black uppercase">CAMPIONE MATERICO #0{selectedHotspot.id?.replace(/[^0-9]/g, '') || "1"}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Switch to Room Staging Button */}
          <div className="flex justify-between items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveMode("staging")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#111213] hover:bg-[#1C1F21] text-white border-2 border-[#111213] font-mono font-bold text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_#C85A17] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#C85A17]" />
              <span>TORNA A INTERIOR STAGING CAMERA AR</span>
            </button>
          </div>

          {/* Technical Specifications Guide */}
          <div className="bg-[#FFFFFF] border-2 border-[#111213] p-2.5 shadow-[2px_2px_0px_#111213]">
            <div className="flex items-start gap-2">
              <Layers className="w-3.5 h-3.5 text-[#111213] flex-shrink-0 mt-0.5" />
              <p className="font-mono text-[10px] uppercase tracking-wide text-raw-muted leading-snug">
                {arConfig?.instructions ||
                  "RUOTA L'ARREDO O TOCCA I PUNTI MATERICI PER ISPEZIONARE I MATERIALI. PREMI IL TASTO AR PER COLLOCARLO NELLA STANZA IN SCALA 1:1."}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
