import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import config from "@/data/config.json";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  title: `${config.brand.name} // ${config.brand.tagline}`,
  description: config.brand.manifesto,
  keywords: [
    "WALDDEI",
    "Interior Architecture",
    "Neo-Brutalism",
    "Raw Design",
    "WebAR",
    "NFC Studio Plaque",
    "Milan Architecture",
  ],
  authors: [{ name: "WALDDEI" }, { name: "CarminelloLab" }],
  openGraph: {
    title: `${config.brand.name} — ${config.brand.tagline}`,
    description: config.brand.manifesto,
    type: "website",
    locale: "it_IT",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0A0A0A",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased selection:bg-[#0A0A0A] selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
