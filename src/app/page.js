"use client";

import config from "@/data/config.json";
import HoloPlaque from "@/components/HoloPlaque";
import {
  MessageCircleMore,
  PhoneCall,
  Globe,
  Aperture,
  ArrowUpRight,
  Contact2,
} from "lucide-react";

// Dynamic Icon & Container Style Resolver with Translucent Badges
function renderActionIcon(actionId, iconName, customClass = "w-4 h-4 sm:w-5 sm:h-5") {
  const norm = (iconName || actionId || "").toLowerCase();

  if (norm.includes("what") || norm.includes("message")) {
    return {
      icon: <MessageCircleMore className={customClass} />,
      badgeClass:
        "border-[#25D366]/40 bg-[#25D366]/15 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-black group-hover:border-[#25D366] group-hover:shadow-[0_0_15px_rgba(37,211,102,0.4)]",
    };
  }
  if (norm.includes("phon") || norm.includes("tel") || norm.includes("call")) {
    return {
      icon: <PhoneCall className={customClass} />,
      badgeClass:
        "border-white/30 bg-white/10 text-white group-hover:bg-white group-hover:text-black group-hover:border-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]",
    };
  }
  if (norm.includes("web") || norm.includes("site") || norm.includes("glob")) {
    return {
      icon: <Globe className={customClass} />,
      badgeClass:
        "border-[#00F0FF]/40 bg-[#00F0FF]/15 text-[#00F0FF] group-hover:bg-[#00F0FF] group-hover:text-black group-hover:border-[#00F0FF] group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]",
    };
  }
  if (norm.includes("insta") || norm.includes("aper") || norm.includes("cam")) {
    return {
      icon: <Aperture className={customClass} />,
      badgeClass:
        "border-[#FF007A]/40 bg-[#FF007A]/15 text-[#FF007A] group-hover:bg-[#FF007A] group-hover:text-white group-hover:border-[#FF007A] group-hover:shadow-[0_0_15px_rgba(255,0,122,0.4)]",
    };
  }

  return {
    icon: <ArrowUpRight className={customClass} />,
    badgeClass:
      "border-white/20 bg-white/10 text-white group-hover:bg-white group-hover:text-black",
  };
}

export default function DigitalBusinessCard() {
  const { brand, contacts, footer } = config;

  const accentColor = brand?.accentColor || "#C85A17";
  const contactActions = Array.isArray(contacts)
    ? contacts
    : contacts?.actions || contacts?.buttons || [];

  const vcardPath = contacts?.vcardPath || "/walddei.vcf";
  const vcardLabel = contacts?.vcardLabel || "[ + SALVA IN RUBRICA ]";

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-center items-center py-4 px-3 sm:py-7 sm:px-4 overflow-x-hidden">
      {/* ============================================================== */}
      {/* 0. ARCHITECTURAL SPACE BACKGROUND IMAGE & TRANSLUCENT SCRIM    */}
      {/* ============================================================== */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/walddei-space.jpg"
          alt="I WAALDDEI Architectural Interior Space"
          className="w-full h-full object-cover object-center sm:object-top filter brightness-[0.88] contrast-[1.05]"
        />
      </div>
      {/* Lighter atmospheric gradient: transparent central focus so the architectural room is clearly visible */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0A0B0D]/50 via-transparent to-[#0A0B0D]/65 pointer-events-none" />

      {/* ============================================================== */}
      {/* MAIN CONTAINER: TRANSLUCENT ROUNDED CONTROL PANEL              */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full max-w-lg flex flex-col gap-3 my-auto">
        
        {/* ============================================================== */}
        {/* 1. FINESTRA SUPERIORE: PLACCA OLOGRAFICA IN VETRO OTTICO       */}
        {/* ============================================================== */}
        <section className="w-full">
          <HoloPlaque brand={brand} />
        </section>

        {/* ============================================================== */}
        {/* 2. FINESTRA HERO: SALVATAGGIO RUBRICA VCF (FULL-WIDTH ROUNDED) */}
        {/* ============================================================== */}
        <a
          href={vcardPath}
          download="I-WAALDDEI-Studio.vcf"
          aria-label="Salva scheda contatto I WAALDDEI in rubrica"
          className="group relative w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-white/[0.14] via-white/[0.08] to-white/[0.05] hover:from-white/[0.20] hover:via-white/[0.12] hover:to-white/[0.08] backdrop-blur-2xl border border-white/25 hover:border-white/50 shadow-[0_12px_36px_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.3)] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden"
        >
          {/* Left: Icon & Labels */}
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border border-white/40 flex items-center justify-center text-white shadow-[0_0_16px_rgba(200,90,23,0.55)] group-hover:scale-105 transition-transform flex-shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              <Contact2 className="w-5 h-5 text-white" />
            </div>

            <div>
              <span className="block font-mono text-[8px] sm:text-[9px] uppercase font-bold text-white/60 tracking-wider">
                RUBRICA TELEFONO
              </span>
              <span className="block font-mono font-bold text-xs sm:text-sm tracking-tight uppercase text-white truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] group-hover:text-[#FFD700] transition-colors">
                {vcardLabel}
              </span>
            </div>
          </div>

          {/* Right: Pill Badge & Arrow */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="font-mono text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/30 tracking-wider shadow-sm">
              [.VCF]
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 group-hover:text-white group-hover:bg-[#C85A17] group-hover:border-[#C85A17] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </a>

        {/* ============================================================== */}
        {/* 3. GRIGLIA SIMMETRICA 2X2 A FINESTRE ARROTONDATE               */}
        {/* ============================================================== */}
        <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-3.5 items-stretch">
          {contactActions.map((action, idx) => {
            const { icon, badgeClass } = renderActionIcon(action.id, action.icon);
            return (
              <a
                key={action.id || idx}
                href={action.url}
                target={action.url.startsWith("http") ? "_blank" : undefined}
                rel={action.url.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/[0.07] hover:bg-white/[0.14] active:bg-white/[0.20] backdrop-blur-2xl border border-white/20 hover:border-white/45 shadow-[0_12px_32px_rgba(0,0,0,0.38),inset_0_1px_1px_0_rgba(255,255,255,0.25)] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden min-h-[105px] sm:min-h-[115px]"
              >
                {/* Top Row: Icon Badge & Arrow Disc */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border backdrop-blur-md flex items-center justify-center transition-all ${badgeClass}`}
                  >
                    {icon}
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-[#C85A17] group-hover:border-[#C85A17] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>

                {/* Bottom Row: Text Labels */}
                <div>
                  <span className="block font-mono font-bold text-xs sm:text-sm uppercase tracking-wide text-white group-hover:text-[#FFD700] transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate">
                    {action.label}
                  </span>
                  {action.sublabel && (
                    <span className="block font-mono text-[9px] sm:text-[10px] text-white/60 group-hover:text-white/85 uppercase tracking-wider truncate mt-0.5">
                      {action.sublabel}
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* 4. BANNER CON LOGO CARMINELLOLAB (SUBITO SOTTO LE FINESTRE)    */}
        {/* ============================================================== */}
        <footer className="w-full flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-white/80 bg-black/45 backdrop-blur-2xl border border-white/15 rounded-2xl sm:rounded-3xl px-4 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
          <span className="font-bold uppercase tracking-wider">
            {brand?.name} © 2026
          </span>
          <a
            href={footer?.creditUrl || "https://instagram.com/carminellolab"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-white hover:text-[#C85A17] transition-all group"
          >
            <span>{footer?.creditPrefix || "NFC ARTIFACT BY"}</span>
            <img
              src={footer?.creditLogo || "/images/carminellolab-logo.jpg"}
              alt="Carminello Lab Logo"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/40 shadow-[0_0_8px_rgba(255,0,128,0.4)] object-cover group-hover:scale-110 group-hover:border-white transition-all"
            />
            <ArrowUpRight className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>
        </footer>

      </div>
    </main>
  );
}
