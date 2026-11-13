"use client";

import { useState, useEffect } from "react";
import config from "@/data/config.json";
import ArViewer from "@/components/ArViewer";
import {
  MessageSquare,
  Phone,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Download,
  ArrowUpRight,
  Box,
  Sparkles,
  X,
  UserPlus,
  Layers,
} from "lucide-react";

// Robust dynamic icon resolver supporting multiple naming conventions
function renderActionIcon(iconName, customClass = "w-4 h-4") {
  const norm = (iconName || "").toLowerCase();
  if (norm.includes("what") || norm.includes("message")) return <MessageSquare className={customClass} />;
  if (norm.includes("phon") || norm.includes("tel") || norm.includes("call")) return <Phone className={customClass} />;
  if (norm.includes("insta")) return <Instagram className={customClass} />;
  if (norm.includes("glob") || norm.includes("web") || norm.includes("portf")) return <Globe className={customClass} />;
  if (norm.includes("mail")) return <Mail className={customClass} />;
  if (norm.includes("map") || norm.includes("pin") || norm.includes("loc")) return <MapPin className={customClass} />;
  return <ArrowUpRight className={customClass} />;
}

export default function DigitalBusinessCard() {
  const [isArModalOpen, setIsArModalOpen] = useState(false);
  const { brand, contacts, arExperience, footer } = config;

  const accentColor = brand?.accentColor || "#C85A17"; // Corten Rust Patina
  const contactActions = Array.isArray(contacts) 
    ? contacts 
    : (contacts?.actions || contacts?.buttons || []);
  
  const vcardPath = contacts?.vcardPath || "/walddei.vcf";
  const vcardLabel = contacts?.vcardLabel || "[ + SALVA CONTATTO IN RUBRICA ]";

  // Prevent background scroll when the 3D modal is open
  useEffect(() => {
    if (isArModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isArModalOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsArModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Separate actions: take top 4 for the 2x2 primary grid, remaining for secondary chips
  const primaryActions = contactActions.slice(0, 4);
  const extraActions = contactActions.slice(4);

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between items-center py-4 px-3 sm:py-8 sm:px-4 overflow-x-hidden">
      
      {/* ============================================================== */}
      {/* 0. ARCHITECTURAL SPACE BACKGROUND IMAGE & ATMOSPHERIC SCRIM    */}
      {/* ============================================================== */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('/images/walddei-space.jpg')` }}
      />
      {/* Subtle Dark Industrial Steel Tint to guarantee maximum legibility & contrast */}
      <div 
        className="fixed inset-0 z-0 bg-gradient-to-b from-[#111213]/60 via-[#111213]/50 to-[#111213]/80 backdrop-blur-[1.5px] pointer-events-none"
      />

      {/* ============================================================== */}
      {/* FOREGROUND CARD CONTAINER (MOBILE-FIRST, ALL ABOVE THE FOLD)   */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full max-w-md flex flex-col gap-2.5 sm:gap-3.5 my-auto">

        {/* ============================================================== */}
        {/* 1. CARD IDENTITÀ: ARCHITECTURAL SPECIFICATION BADGE           */}
        {/* ============================================================== */}
        <section className="bg-[#F4F5F4]/95 backdrop-blur-md border-3 border-[#111213] p-4 shadow-[4px_4px_0px_#111213] flex flex-col gap-2">
          {/* Top Status Header */}
          <div className="flex items-center justify-between border-b-2 border-[#111213] pb-2">
            <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] font-bold tracking-wider text-[#111213] uppercase">
              <span
                className="w-2.5 h-2.5 border border-[#111213] flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              />
              <span>{brand?.badge || "CERTIFIED INTERIOR PROJECT // NFC TAG"}</span>
            </div>
            <span className="font-mono text-[9px] sm:text-[10px] font-bold text-[#111213]/70 uppercase tracking-wider">
              {brand?.location || "MILANO // ZÜRICH"}
            </span>
          </div>

          {/* Monumental Identity */}
          <div className="pt-1">
            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl tracking-[-0.05em] uppercase text-[#111213] leading-none">
              {brand?.name || "WALDDEI"}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <div 
                className="h-1 w-8 flex-shrink-0" 
                style={{ backgroundColor: accentColor }} 
              />
              <p className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#111213]">
                {brand?.tagline || "INTERIOR ARCHITECTURE // BÉTON BRUT & RAW STEEL"}
              </p>
            </div>
          </div>

          {/* Short Studio Description (Max 2 lines) */}
          {brand?.manifesto && (
            <p className="font-mono text-[10px] sm:text-[11px] text-[#111213]/85 leading-snug border-t border-[#111213]/20 pt-2 mt-1 line-clamp-2">
              {brand.manifesto}
            </p>
          )}
        </section>

        {/* ============================================================== */}
        {/* 2. AZIONE PRIMARIA: SALVATAGGIO IMMEDIATO VCARD                */}
        {/* ============================================================== */}
        <section className="w-full">
          <a
            href={vcardPath}
            download="WALDDEI-Studio.vcf"
            aria-label="Salva scheda contatto WALDDEI in rubrica"
            className="w-full flex items-center justify-between bg-[#111213] hover:bg-[#1C1F21] text-white border-3 border-[#111213] p-3.5 sm:p-4 shadow-[4px_4px_0px_#111213] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div 
                className="w-9 h-9 border-2 border-white flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              >
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div className="text-left truncate">
                <div className="font-mono text-[9px] uppercase font-bold text-gray-300 tracking-wider">
                  AGGIUNGI CONTATTI RAPIDI
                </div>
                <div className="font-mono font-bold text-xs sm:text-sm tracking-tight uppercase text-white truncate">
                  {vcardLabel}
                </div>
              </div>
            </div>

            <div className="font-mono text-[11px] font-bold px-2 py-1 bg-white text-black border border-white group-hover:bg-[#EBECE9] transition-colors flex-shrink-0 ml-2">
              [.VCF]
            </div>
          </a>
        </section>

        {/* ============================================================== */}
        {/* 3. GRIGLIA CONTATTI RAPIDI (2 COLONNE X 2 RIGHE)               */}
        {/* ============================================================== */}
        <section className="w-full flex flex-col gap-1.5">
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {primaryActions.map((action, idx) => {
              return (
                <a
                  key={action.id || idx}
                  href={action.url}
                  target={action.url.startsWith("http") ? "_blank" : undefined}
                  rel={action.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex flex-col justify-between p-3 bg-[#F4F5F4]/95 hover:bg-[#FFFFFF] backdrop-blur-md border-2 border-[#111213] shadow-[3px_3px_0px_#111213] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group"
                >
                  {/* Top Bar: Icon + Action Arrow */}
                  <div className="flex items-center justify-between mb-2">
                    <div 
                      className="p-1.5 border border-[#111213] bg-[#EBECE9] group-hover:text-white transition-colors"
                      style={{ transition: 'all 0.15s ease' }}
                    >
                      {renderActionIcon(action.icon || action.id, "w-4 h-4 text-[#111213]")}
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#111213] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>

                  {/* Bottom: Label & Subtitle */}
                  <div>
                    <span className="block font-mono font-bold text-xs uppercase tracking-wide text-[#111213] truncate group-hover:text-[#C85A17] transition-colors">
                      {action.label}
                    </span>
                    {action.sublabel && (
                      <span className="block font-mono text-[9px] text-[#111213]/60 uppercase tracking-wider truncate mt-0.5">
                        {action.sublabel}
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>

          {/* Secondary channel chips (e.g. Atelier map) */}
          {extraActions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-0.5">
              {extraActions.map((action, idx) => (
                <a
                  key={action.id || idx}
                  href={action.url}
                  target={action.url.startsWith("http") ? "_blank" : undefined}
                  rel={action.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex-1 min-w-[140px] flex items-center justify-between px-2.5 py-1.5 bg-[#F4F5F4]/95 hover:bg-[#FFFFFF] backdrop-blur-md border border-[#111213] shadow-[2px_2px_0px_#111213] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {renderActionIcon(action.icon || action.id, "w-3 h-3 text-[#111213]")}
                    <span className="font-mono font-bold text-[10px] uppercase tracking-wider truncate text-[#111213]">
                      {action.label}
                    </span>
                  </div>
                  <ArrowUpRight className="w-3 h-3 text-[#111213] flex-shrink-0" />
                </a>
              ))}
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* 4. MODULO WEBAR COMPATTO (ON-DEMAND / SU RICHIESTA)             */}
        {/* ============================================================== */}
        {arExperience?.enabled && (
          <section className="w-full bg-[#F4F5F4]/95 backdrop-blur-md border-2 border-[#111213] p-3 shadow-[3px_3px_0px_#111213] flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-[#111213]/20 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-[#111213]" />
                <h3 className="font-mono font-bold text-[11px] uppercase tracking-wider text-[#111213]">
                  {arExperience?.sectionTitle || "01 // ARCHITETTURA MATERICA & AR"}
                </h3>
              </div>
              <span className="font-mono text-[9px] font-bold uppercase flex items-center gap-1 text-[#111213]">
                <span 
                  className="w-1.5 h-1.5 rounded-none animate-pulse" 
                  style={{ backgroundColor: accentColor }} 
                />
                3D READY
              </span>
            </div>

            <p className="font-mono text-[10px] text-[#111213]/70 leading-tight uppercase">
              {arExperience?.shortDescription || 
                "Esplora il monolite in calcestruzzo a cassaforma e acciaio corten, e proiettalo nella stanza in WebAR."}
            </p>

            {/* Brutalist Trigger Button */}
            <button
              type="button"
              onClick={() => setIsArModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#EBECE9] hover:bg-[#111213] text-[#111213] hover:text-white border-2 border-[#111213] font-mono font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#111213] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
              <span>{arExperience?.openButtonLabel || "[ APRI ESPERIENZA 3D / AR ]"}</span>
            </button>
          </section>
        )}

      </div>

      {/* ============================================================== */}
      {/* 5. FOOTER MINIMALE: CREDITO SOBRIO CARMINELLOLAB                */}
      {/* ============================================================== */}
      <footer className="relative z-10 w-full max-w-md pt-2 mt-3 flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-white/90 bg-[#111213]/75 backdrop-blur-sm border border-white/10 px-3 py-1.5 shadow-[2px_2px_0px_#111213]">
        <span className="font-bold uppercase tracking-wider">
          {brand?.name} © 2026 // MILANO
        </span>
        <a
          href={footer?.creditUrl || "https://instagram.com/carminellolab"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold underline hover:no-underline uppercase tracking-wider hover:text-[#C85A17] transition-colors"
        >
          <span>{footer?.creditText || "NFC ARTIFACT BY CARMINELLOLAB"}</span>
          <ArrowUpRight className="w-2.5 h-2.5" />
        </a>
      </footer>

      {/* ============================================================== */}
      {/* MODAL FULL-SCREEN BRUTALISTA PER WEBAR                         */}
      {/* ============================================================== */}
      {isArModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-[#111213]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsArModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-[#EBECE9] border-3 border-[#111213] shadow-[8px_8px_0px_#111213] p-4 flex flex-col gap-3 my-auto max-h-[96vh] overflow-y-auto">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between border-b-2 border-[#111213] pb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 border border-[#111213]" 
                  style={{ backgroundColor: accentColor }} 
                />
                <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-[#111213]">
                  {arExperience?.sectionTitle || "01 // ARCHITETTURA MATERICA & AR"}
                </h3>
              </div>

              {/* High Contrast Close Button */}
              <button
                type="button"
                onClick={() => setIsArModalOpen(false)}
                aria-label="Chiudi finestra 3D"
                className="flex items-center gap-1 px-3 py-1.5 bg-[#111213] hover:bg-[#C85A17] text-white border-2 border-[#111213] font-mono font-bold text-[11px] uppercase tracking-wider shadow-[2px_2px_0px_#FFFFFF] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{arExperience?.closeButtonLabel || "[ X CHIUDI ]"}</span>
              </button>
            </div>

            {/* Embedded WebAR Component */}
            <div className="w-full">
              <ArViewer 
                arConfig={arExperience} 
                brandConfig={brand} 
                onClose={() => setIsArModalOpen(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
