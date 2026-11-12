import config from "@/data/config.json";
import ArViewer from "@/components/ArViewer";
import {
  MessageSquare,
  Instagram,
  Globe,
  Mail,
  Phone,
  MapPin,
  Download,
  ArrowUpRight,
  ShieldCheck,
  Compass,
  Share2,
} from "lucide-react";

// Robust dynamic icon resolver supporting both PascalCase and lowercase names
function renderContactIcon(iconName) {
  const norm = (iconName || "").toLowerCase();
  const iconClass = "w-4 h-4 flex-shrink-0";
  if (norm.includes("what") || norm.includes("message")) return <MessageSquare className={iconClass} />;
  if (norm.includes("insta")) return <Instagram className={iconClass} />;
  if (norm.includes("glob") || norm.includes("web") || norm.includes("portf")) return <Globe className={iconClass} />;
  if (norm.includes("mail")) return <Mail className={iconClass} />;
  if (norm.includes("phon") || norm.includes("tel") || norm.includes("call")) return <Phone className={iconClass} />;
  if (norm.includes("map") || norm.includes("pin") || norm.includes("loc")) return <MapPin className={iconClass} />;
  return <ArrowUpRight className={iconClass} />;
}

export default function HomePage() {
  const { brand, contacts, arExperience, footer } = config;
  const accentColor = brand?.accentColor || "#FF3B00";
  const contactActions = contacts?.actions || [];

  return (
    <main className="min-h-screen py-6 px-4 sm:py-10 flex flex-col items-center justify-between">
      {/* Mobile-first Single Column Container (max-w-lg) */}
      <div className="w-full max-w-lg flex flex-col gap-6">

        {/* 1. TOP NFC BAR */}
        <header className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-3">
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest uppercase">
            <span 
              className="inline-block w-2.5 h-2.5 border border-[#0A0A0A]"
              style={{ backgroundColor: accentColor }}
            />
            <span>{brand?.badge || "NFC SECURE TAG // ED. 2026"}</span>
          </div>
          <div className="font-mono text-[10px] font-bold text-raw-muted uppercase tracking-wider">
            {brand?.location || "MILANO // ZÜRICH"}
          </div>
        </header>

        {/* 2. MONUMENTAL BRAND HEADER */}
        <section className="flex flex-col gap-2">
          <div className="relative">
            <h1 className="font-sans font-extrabold text-5xl sm:text-6xl tracking-[-0.05em] uppercase text-[#0A0A0A] leading-[0.9]">
              {brand?.name || "WALDDEI"}
            </h1>
            <div 
              className="h-1.5 w-16 mt-2" 
              style={{ backgroundColor: accentColor }} 
            />
          </div>

          <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#0A0A0A] mt-1">
            {brand?.tagline || "INTERIOR ARCHITECTURE // RAW DESIGN"}
          </p>

          {/* Architectural Manifesto Card */}
          {brand?.manifesto && (
            <div className="mt-3 bg-[#FFFFFF] border-3 border-[#0A0A0A] p-4 shadow-brutal">
              <div className="flex items-center justify-between border-b border-[#0A0A0A]/20 pb-1.5 mb-2.5">
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-raw-muted">
                  MANIFESTO PROGETTUALE
                </span>
                <span className="font-mono text-[9px] font-bold uppercase text-[#0A0A0A]">
                  DIR // 00
                </span>
              </div>
              <p className="font-mono text-xs text-[#0A0A0A] leading-relaxed">
                {brand.manifesto}
              </p>
            </div>
          )}
        </section>

        {/* 3. WEBAR 3D INTERACTIVE SECTION */}
        {arExperience?.enabled && (
          <section className="w-full">
            <ArViewer arConfig={arExperience} brandConfig={brand} />
          </section>
        )}

        {/* 4. VCARD DIRECT DOWNLOAD BUTTON (HIGH PRIORITY NFC ACTION) */}
        {contacts?.vcardPath && (
          <section className="w-full">
            <a
              href={contacts.vcardPath}
              download="WALDDEI-Studio.vcf"
              className="w-full flex items-center justify-between bg-[#FFFFFF] hover:bg-[#F4F4F0] border-3 border-[#0A0A0A] p-4 shadow-brutal active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all group"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 border-2 border-[#0A0A0A] flex items-center justify-center text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-mono text-[10px] uppercase font-bold text-raw-muted tracking-wider">
                    RUBRICA TELEFONICA SMARTPHONE
                  </div>
                  <div className="font-mono font-bold text-xs sm:text-sm text-[#0A0A0A] tracking-tight uppercase">
                    {contacts.vcardLabel || "SCARICA CONTATTO [.VCF]"}
                  </div>
                </div>
              </div>

              <div className="font-mono text-xs font-bold px-2 py-1 border border-[#0A0A0A] bg-[#E5E5E0] group-hover:bg-[#0A0A0A] group-hover:text-white transition-colors">
                [ +ADD ]
              </div>
            </a>
          </section>
        )}

        {/* 5. CONTACTS & NETWORKS BRUTALIST GRID */}
        <section className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-1.5">
            <h2 className="font-mono font-bold text-xs uppercase tracking-widest text-[#0A0A0A]">
              02 // CANALI DIRETTO STUDIO
            </h2>
            <span className="font-mono text-[10px] text-raw-muted uppercase">
              {contactActions.length} LINKS DISPONIBILI
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {contactActions.map((action, idx) => {
              const isPrimary = action.type === "primary";
              return (
                <a
                  key={action.id || idx}
                  href={action.url}
                  target={action.url.startsWith("http") ? "_blank" : undefined}
                  rel={action.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`flex items-center justify-between p-3.5 border-2 border-[#0A0A0A] shadow-brutal active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all ${
                    isPrimary
                      ? "bg-[#0A0A0A] text-white hover:bg-[#1A1A1A]"
                      : "bg-[#FFFFFF] text-[#0A0A0A] hover:bg-[#F4F4F0]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span 
                      className={`p-1.5 border border-[#0A0A0A] ${
                        isPrimary ? "bg-white text-black" : "bg-[#E5E5E0] text-black"
                      }`}
                    >
                      {renderContactIcon(action.icon || action.id)}
                    </span>
                    <span className="font-mono font-bold text-[11px] uppercase tracking-wide truncate">
                      {action.label}
                    </span>
                  </div>

                  <ArrowUpRight 
                    className={`w-4 h-4 flex-shrink-0 ml-1 ${
                      isPrimary ? "text-white" : "text-[#0A0A0A]"
                    }`} 
                  />
                </a>
              );
            })}
          </div>
        </section>

        {/* 6. TECHNICAL FOOTER & CREDITS */}
        <footer className="mt-8 pt-4 border-t-2 border-[#0A0A0A] flex flex-col gap-2 font-mono text-[10px] text-[#0A0A0A]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold tracking-wider uppercase">
              {footer?.license || "WALDDEI ATELIER © 2026"}
            </span>
            <a
              href={footer?.creditUrl || "https://instagram.com/carminellolab"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold underline hover:no-underline tracking-widest text-[#0A0A0A]"
            >
              <span>{footer?.creditText || "NFC ARTIFACT ENGINEERED BY CARMINELLOLAB"}</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          <div className="text-[9px] text-raw-muted flex items-center justify-between pt-1 border-t border-dashed border-[#0A0A0A]/30">
            <span>SYS // VER. 1.0.4-PROD</span>
            <span>NEXT.JS APP ROUTER // DATA-DRIVEN</span>
          </div>
        </footer>

      </div>
    </main>
  );
}
