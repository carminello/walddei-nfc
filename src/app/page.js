"use client";

import { useState, useEffect } from "react";
import config from "@/data/config.json";
import HoloPlaque from "@/components/HoloPlaque";
import ArViewer from "@/components/ArViewer";
import {
  MessageCircleMore,
  PhoneCall,
  LayoutGrid,
  Aperture,
  ArrowUpRight,
  Sparkles,
  X,
  Contact2,
  Gamepad2,
} from "lucide-react";

// Dynamic Icon & Container Style Resolver with Translucent Badges
function renderActionIcon(actionId, iconName, customClass = "w-4 h-4") {
  const norm = (iconName || actionId || "").toLowerCase();

  if (norm.includes("what") || norm.includes("message")) {
    return {
      icon: <MessageCircleMore className={customClass} />,
      badgeClass:
        "border-[#25D366]/40 bg-[#25D366]/15 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-black group-hover:border-[#25D366]",
    };
  }
  if (norm.includes("phon") || norm.includes("tel") || norm.includes("call")) {
    return {
      icon: <PhoneCall className={customClass} />,
      badgeClass:
        "border-white/30 bg-white/10 text-white group-hover:bg-white group-hover:text-black group-hover:border-white",
    };
  }
  if (norm.includes("portf") || norm.includes("grid") || norm.includes("glob")) {
    return {
      icon: <LayoutGrid className={customClass} />,
      badgeClass:
        "border-[#00F0FF]/40 bg-[#00F0FF]/15 text-[#00F0FF] group-hover:bg-[#00F0FF] group-hover:text-black group-hover:border-[#00F0FF]",
    };
  }
  if (norm.includes("insta") || norm.includes("aper") || norm.includes("cam")) {
    return {
      icon: <Aperture className={customClass} />,
      badgeClass:
        "border-[#FF007A]/40 bg-[#FF007A]/15 text-[#FF007A] group-hover:bg-[#FF007A] group-hover:text-white group-hover:border-[#FF007A]",
    };
  }

  return {
    icon: <ArrowUpRight className={customClass} />,
    badgeClass:
      "border-white/20 bg-white/10 text-white group-hover:bg-white group-hover:text-black",
  };
}

export default function DigitalBusinessCard() {
  const [isArModalOpen, setIsArModalOpen] = useState(false);
  const { brand, contacts, arExperience, footer } = config;

  const accentColor = brand?.accentColor || "#C85A17";
  const contactActions = Array.isArray(contacts)
    ? contacts
    : contacts?.actions || contacts?.buttons || [];

  const vcardPath = contacts?.vcardPath || "/walddei.vcf";
  const vcardLabel = contacts?.vcardLabel || "[ + SALVA IN RUBRICA ]";

  // Symmetrical 50/50 split (3 elements left, 3 elements right)
  const leftChannelIds = ["whatsapp", "phone"];
  const rightChannelIds = ["portfolio", "instagram"];

  const leftActions = contactActions.filter(
    (a) => leftChannelIds.includes(a.id?.toLowerCase()) || a.type === "primary"
  );
  const rightActions = contactActions.filter(
    (a) => rightChannelIds.includes(a.id?.toLowerCase()) || a.type === "secondary"
  );

  const finalLeftActions =
    leftActions.length > 0 ? leftActions : contactActions.slice(0, Math.ceil(contactActions.length / 2));
  const finalRightActions =
    rightActions.length > 0 ? rightActions : contactActions.slice(Math.ceil(contactActions.length / 2));

  // Prevent background scroll when AR modal is active
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
      {/* 0. ARCHITECTURAL SPACE BACKGROUND IMAGE & TRANSLUCENT SCRIM    */}
      {/* ============================================================== */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-105"
        style={{ backgroundImage: `url('/images/walddei-space.jpg')` }}
      />
      {/* Smoked Architectural Glass Tint Scrim */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0A0B0D]/75 via-[#0A0B0D]/55 to-[#0A0B0D]/85 backdrop-blur-[2px] pointer-events-none" />

      {/* ============================================================== */}
      {/* MAIN CONTAINER: TRANSLUCENT ARCHITECTURAL CONTROL PANEL        */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full max-w-xl flex flex-col gap-3 my-auto">
        {/* ============================================================== */}
        {/* FINESTRA SUPERIORE: PLACCA OLOGRAFICA IN VETRO OTTICO (GYRO)   */}
        {/* ============================================================== */}
        <section className="w-full">
          <HoloPlaque brand={brand} />
        </section>

        {/* ============================================================== */}
        {/* GRIGLIA A FINESTRE IN VETRO TRASLUCIDO: 50% SINISTRA / 50% DX  */}
        {/* ============================================================== */}
        <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-3.5 items-start">
          {/* ------------------------------------------------------------ */}
          {/* ALA LATERALE SINISTRA: RUBRICA VCF & CONTATTI DIRETTI        */}
          {/* ------------------------------------------------------------ */}
          <div className="flex flex-col gap-2.5 sm:gap-3">
            {/* Finestra 1: Salvataggio VCF in Vetro Fumé con Bordo Ambra */}
            <a
              href={vcardPath}
              download="I-WAALDDEI-Studio.vcf"
              aria-label="Salva scheda contatto I WAALDDEI in rubrica"
              className="group relative flex flex-col justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/[0.12] via-white/[0.06] to-transparent hover:from-white/[0.18] hover:via-white/[0.09] backdrop-blur-xl border border-white/25 hover:border-white/45 shadow-[0_8px_30px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.25)] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-8 h-8 rounded-lg border border-white/40 flex items-center justify-center text-white shadow-[0_0_14px_rgba(200,90,23,0.5)] group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: accentColor }}
                >
                  <Contact2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-mono text-[8.5px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/30 tracking-wider">
                  [.VCF]
                </span>
              </div>

              <div>
                <span className="block font-mono text-[8px] sm:text-[8.5px] uppercase font-bold text-white/60 tracking-wider">
                  RUBRICA TELEFONO
                </span>
                <span className="block font-mono font-bold text-xs sm:text-sm tracking-tight uppercase text-white truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] group-hover:text-[#FFD700] transition-colors">
                  {vcardLabel}
                </span>
              </div>
            </a>

            {/* Finestre Contatti Diretti (WhatsApp, Telefono) in Vetro Fumé */}
            {finalLeftActions.map((action, idx) => {
              const { icon, badgeClass } = renderActionIcon(action.id, action.icon);
              return (
                <a
                  key={action.id || idx}
                  href={action.url}
                  target={action.url.startsWith("http") ? "_blank" : undefined}
                  rel={action.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group relative flex flex-col justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.07] hover:bg-white/[0.13] active:bg-white/[0.18] backdrop-blur-xl border border-white/20 hover:border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg border backdrop-blur-md flex items-center justify-center transition-all ${badgeClass}`}
                    >
                      {icon}
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-[#C85A17] group-hover:border-[#C85A17] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <span className="block font-mono font-bold text-xs uppercase tracking-wide text-white group-hover:text-[#FFD700] transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate">
                      {action.label}
                    </span>
                    {action.sublabel && (
                      <span className="block font-mono text-[9px] text-white/60 group-hover:text-white/80 uppercase tracking-wider truncate mt-0.5">
                        {action.sublabel}
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>

          {/* ------------------------------------------------------------ */}
          {/* ALA LATERALE DESTRA: ARCHI-TETRIS AR & CANALI DIGITALI       */}
          {/* ------------------------------------------------------------ */}
          <div className="flex flex-col gap-2.5 sm:gap-3">
            {/* Finestra ARCHI-TETRIS AR con Glow Translucido */}
            {arExperience?.enabled && (
              <div className="group relative flex flex-col justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#C85A17]/25 via-white/[0.06] to-transparent hover:from-[#C85A17]/35 backdrop-blur-xl border border-[#C85A17]/50 hover:border-[#C85A17]/80 shadow-[0_8px_30px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.25)] transition-all overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/15 pb-1.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Gamepad2 className="w-3.5 h-3.5 text-[#FFD700]" />
                    <span className="font-mono font-bold text-[9px] sm:text-[10px] uppercase tracking-wider text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      {arExperience?.sectionTitle || "01 // ARCHI-TETRIS AR"}
                    </span>
                  </div>
                  <span
                    className="w-2 h-2 rounded-full animate-pulse flex-shrink-0 shadow-[0_0_8px_#C85A17]"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>

                <p className="font-mono text-[9px] text-white/70 leading-tight uppercase mb-2.5 line-clamp-2">
                  {arExperience?.shortDescription ||
                    "Inquadra lo spazio reale e componi l'ambiente con complementi brutalisti."}
                </p>

                {/* Trigger Button Translucido */}
                <button
                  type="button"
                  onClick={() => setIsArModalOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-[#C85A17] hover:bg-[#E0671C] text-white font-mono font-bold text-[10px] sm:text-[11px] uppercase tracking-wider shadow-[0_4px_14px_rgba(200,90,23,0.4)] border border-white/30 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span className="truncate">{arExperience?.openButtonLabel || "[ GIOCA ARCHI-TETRIS AR ]"}</span>
                </button>
              </div>
            )}

            {/* Finestre Canali Digitali (Portfolio, Instagram) in Vetro Fumé */}
            {finalRightActions.map((action, idx) => {
              const { icon, badgeClass } = renderActionIcon(action.id, action.icon);
              return (
                <a
                  key={action.id || idx}
                  href={action.url}
                  target={action.url.startsWith("http") ? "_blank" : undefined}
                  rel={action.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group relative flex flex-col justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.07] hover:bg-white/[0.13] active:bg-white/[0.18] backdrop-blur-xl border border-white/20 hover:border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg border backdrop-blur-md flex items-center justify-center transition-all ${badgeClass}`}
                    >
                      {icon}
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-[#C85A17] group-hover:border-[#C85A17] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <span className="block font-mono font-bold text-xs uppercase tracking-wide text-white group-hover:text-[#FFD700] transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate">
                      {action.label}
                    </span>
                    {action.sublabel && (
                      <span className="block font-mono text-[9px] text-white/60 group-hover:text-white/80 uppercase tracking-wider truncate mt-0.5">
                        {action.sublabel}
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* FOOTER IN VETRO TRASLUCIDO: CARMINELLOLAB                      */}
      {/* ============================================================== */}
      <footer className="relative z-10 w-full max-w-xl pt-2 mt-3 flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-white/80 bg-black/40 backdrop-blur-xl border border-white/15 rounded-xl px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
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
      {/* MODAL ARCHI-TETRIS WEBAR CON EFFETTO VETRO FUMÉ               */}
      {/* ============================================================== */}
      {isArModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0B0C0E]/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsArModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-md bg-[#111214]/90 backdrop-blur-2xl border-2 border-[#C85A17] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2.5 sm:p-3 flex flex-col gap-2 my-auto max-h-[98vh] overflow-y-auto">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between border-b border-white/20 pb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm border border-white shadow-[0_0_8px_#C85A17]"
                  style={{ backgroundColor: accentColor }}
                />
                <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-white">
                  {arExperience?.sectionTitle || "01 // ARCHI-TETRIS AR"}
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsArModalOpen(false)}
                aria-label="Chiudi finestra gioco"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/20 hover:bg-[#C85A17] text-white border border-white/30 font-mono font-bold text-[10px] uppercase tracking-wider backdrop-blur-md active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>{arExperience?.closeButtonLabel || "[ X CHIUDI ]"}</span>
              </button>
            </div>

            {/* Embedded WebAR Component */}
            <div className="w-full">
              <ArViewer
                arConfig={arExperience}
                brandConfig={brand}
                contactsConfig={contacts}
                onClose={() => setIsArModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
