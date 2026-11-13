"use client";

import { useState, useEffect } from "react";
import config from "@/data/config.json";
import HoloPlaque from "@/components/HoloPlaque";
import ArViewer from "@/components/ArViewer";
import {
  MessageSquare,
  Phone,
  Globe,
  Instagram,
  Mail,
  MapPin,
  ArrowUpRight,
  Box,
  Sparkles,
  X,
  UserPlus,
  Layers,
} from "lucide-react";

// Robust dynamic icon resolver
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

  const accentColor = brand?.accentColor || "#C85A17";
  const contactActions = Array.isArray(contacts) 
    ? contacts 
    : (contacts?.actions || contacts?.buttons || []);
  
  const vcardPath = contacts?.vcardPath || "/walddei.vcf";
  const vcardLabel = contacts?.vcardLabel || "[ + SALVA IN RUBRICA ]";

  // Distribute contacts between left wing (direct/operational) and right wing (digital/visual)
  const leftChannelIds = ["whatsapp", "phone", "location"];
  const rightChannelIds = ["portfolio", "instagram", "email"];

  const leftActions = contactActions.filter(a => leftChannelIds.includes(a.id?.toLowerCase()) || a.type === "primary");
  const rightActions = contactActions.filter(a => rightChannelIds.includes(a.id?.toLowerCase()) || a.type === "secondary");

  // Fallback distribution if custom actions are passed in config
  const finalLeftActions = leftActions.length > 0 ? leftActions : contactActions.slice(0, Math.ceil(contactActions.length / 2));
  const finalRightActions = rightActions.length > 0 ? rightActions : contactActions.slice(Math.ceil(contactActions.length / 2));

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

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between items-center py-4 px-3 sm:py-7 sm:px-4 overflow-x-hidden">
      
      {/* ============================================================== */}
      {/* 0. ARCHITECTURAL SPACE BACKGROUND IMAGE & ATMOSPHERIC SCRIM    */}
      {/* ============================================================== */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('/images/walddei-space.jpg')` }}
      />
      {/* Industrial Steel Tint Scrim */}
      <div 
        className="fixed inset-0 z-0 bg-gradient-to-b from-[#111213]/60 via-[#111213]/55 to-[#111213]/85 backdrop-blur-[1.5px] pointer-events-none"
      />

      {/* ============================================================== */}
      {/* MAIN CONTAINER: ARCHITECTURAL WINDOWED CONTROL PANEL           */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full max-w-xl flex flex-col gap-3 my-auto">

        {/* ============================================================== */}
        {/* FINESTRA SUPERIORE: PLACCA OLOGRAFICA (GYRO-ACTIVE 3D)         */}
        {/* ============================================================== */}
        <section className="w-full">
          <HoloPlaque brand={brand} />
        </section>

        {/* ============================================================== */}
        {/* STRUTTURA FINESTRE LATERALI: 50% A SINISTRA & 50% A DESTRA     */}
        {/* ============================================================== */}
        <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-3.5 items-start">

          {/* ------------------------------------------------------------ */}
          {/* ALA LATERALE SINISTRA: FINESTRE OPERATIVE & CONTATTI DIRETTI */}
          {/* ------------------------------------------------------------ */}
          <div className="flex flex-col gap-2.5 sm:gap-3">
            
            {/* Finestra 1: Salvataggio Immediato VCF */}
            <a
              href={vcardPath}
              download="I-WAALDDEI-Studio.vcf"
              aria-label="Salva scheda contatto I WAALDDEI in rubrica"
              className="w-full flex flex-col justify-between p-3 sm:p-3.5 bg-[#111213] hover:bg-[#1C1F21] text-white border-2 sm:border-3 border-[#111213] shadow-[3px_3px_0px_#111213] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="w-7 h-7 sm:w-8 sm:h-8 border border-white/80 flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: accentColor }}
                >
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 bg-white text-black border border-white">
                  [.VCF]
                </span>
              </div>

              <div>
                <span className="block font-mono text-[8px] sm:text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                  RUBRICA TELEFONO
                </span>
                <span className="block font-mono font-bold text-xs sm:text-sm tracking-tight uppercase text-white truncate">
                  {vcardLabel}
                </span>
              </div>
            </a>

            {/* Finestre Contatti Diretti (WhatsApp, Telefono, Atelier Map) */}
            {finalLeftActions.map((action, idx) => (
              <a
                key={action.id || idx}
                href={action.url}
                target={action.url.startsWith("http") ? "_blank" : undefined}
                rel={action.url.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex flex-col justify-between p-3 bg-[#F4F5F4]/95 hover:bg-[#FFFFFF] backdrop-blur-md border-2 border-[#111213] shadow-[3px_3px_0px_#111213] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 border border-[#111213] bg-[#EBECE9] group-hover:bg-[#111213] group-hover:text-white transition-colors">
                    {renderActionIcon(action.icon || action.id, "w-4 h-4 text-[#111213] group-hover:text-white")}
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#111213] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>

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
            ))}

          </div>

          {/* ------------------------------------------------------------ */}
          {/* ALA LATERALE DESTRA: MATERIOTECA 3D AR & CANALI DIGITALI     */}
          {/* ------------------------------------------------------------ */}
          <div className="flex flex-col gap-2.5 sm:gap-3">
            
            {/* Finestra 3D & WebAR (Richiesta & On-Demand) */}
            {arExperience?.enabled && (
              <div className="w-full flex flex-col justify-between p-3 sm:p-3.5 bg-[#F4F5F4]/95 backdrop-blur-md border-2 sm:border-3 border-[#111213] shadow-[3px_3px_0px_#111213] transition-all">
                <div className="flex items-center justify-between border-b border-[#111213]/20 pb-1.5 mb-2">
                  <div className="flex items-center gap-1">
                    <Box className="w-3.5 h-3.5 text-[#111213]" />
                    <span className="font-mono font-bold text-[9px] sm:text-[10px] uppercase tracking-wider text-[#111213] truncate">
                      {arExperience?.sectionTitle || "01 // MATERIOTECA 3D"}
                    </span>
                  </div>
                  <span 
                    className="w-1.5 h-1.5 rounded-none animate-pulse flex-shrink-0" 
                    style={{ backgroundColor: accentColor }} 
                  />
                </div>

                <p className="font-mono text-[9px] text-[#111213]/70 leading-tight uppercase mb-2.5 line-clamp-2">
                  {arExperience?.shortDescription || "Ispeziona il monolite materico e proiettalo nella stanza."}
                </p>

                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsArModalOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-2 bg-[#111213] hover:bg-[#C85A17] text-white border border-[#111213] font-mono font-bold text-[10px] sm:text-[11px] uppercase tracking-wider shadow-[2px_2px_0px_#111213] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span className="truncate">{arExperience?.openButtonLabel || "[ APRI 3D / AR ]"}</span>
                </button>
              </div>
            )}

            {/* Finestre Canali Digitali (Portfolio, Instagram, Email) */}
            {finalRightActions.map((action, idx) => (
              <a
                key={action.id || idx}
                href={action.url}
                target={action.url.startsWith("http") ? "_blank" : undefined}
                rel={action.url.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex flex-col justify-between p-3 bg-[#F4F5F4]/95 hover:bg-[#FFFFFF] backdrop-blur-md border-2 border-[#111213] shadow-[3px_3px_0px_#111213] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 border border-[#111213] bg-[#EBECE9] group-hover:bg-[#111213] group-hover:text-white transition-colors">
                    {renderActionIcon(action.icon || action.id, "w-4 h-4 text-[#111213] group-hover:text-white")}
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#111213] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>

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
            ))}

          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* FOOTER MINIMALE: CREDITO SOBRIO CARMINELLOLAB                  */}
      {/* ============================================================== */}
      <footer className="relative z-10 w-full max-w-xl pt-2 mt-3 flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-white/90 bg-[#111213]/75 backdrop-blur-sm border border-white/10 px-3 py-1.5 shadow-[2px_2px_0px_#111213]">
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
