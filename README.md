# WALDDEI // Physical NFC Plaque WebAR Platform

> **Interior Architecture & Raw Design** — Next.js (App Router) Neo-Brutalist Web Application for Physical Studio NFC Plaques with WebAR 3D Material Exploration.

---

## 🏛️ Progetto & Architettura Data-Driven

L'applicazione è progettata secondo i principi del **Neo-Brutalismo Architettonico** ed è concepita per essere attivata tramite scansione NFC da smartphone. 

L'intera applicazione è **100% Data-Driven**: nessun testo, link, colore d'accento, hotspot 3D o contatto è hardcodato nei componenti. Tutto si controlla dal file [`src/data/config.json`](src/data/config.json).

```
src/
├── app/
│   ├── globals.css          # Design system brutalista, griglia architettonica, utility CSS
│   ├── layout.js            # Setup font Google (Space Grotesk + JetBrains Mono) & metadata
│   ├── page.js              # Layout mobile-first, header monumentale, griglia contatti, vCard
│   └── icon.svg             # Favicon brutalista geometrica
├── components/
│   └── ArViewer.jsx         # WebAR viewer SSR-safe con @google/model-viewer & Hotspot 3D
├── data/
│   └── config.json          # ⚡ Configurazione unica per tutto il sito (Data-Driven Hub)
public/
├── images/
│   └── monolith-poster.png  # Poster di caricamento per il viewer 3D
├── models/
│   └── walddei-monolith.glb # Modello 3D glTF/GLB del monolite architettonico
└── walddei.vcf              # File vCard 3.0 per il salvataggio immediato in rubrica
```

---

## 📐 Design System: Interior Neo-Brutalism

- **Zero border-radius (`rounded-none` / `0px`):** Geometrie monolitiche pure, squadrate, senza alcuna smussatura.
- **Bordi netti e spessi:** `border-2 border-[#0A0A0A]` e `border-3 border-[#0A0A0A]`.
- **Ombre dure (Hard Shadows):** `shadow-[4px_4px_0px_#0A0A0A]`. Al tocco (`:active`), i pulsanti traslano meccanicamente di `translate-x-[4px] translate-y-[4px]` con annullamento dell'ombra per restituire un feedback tattile analogico.
- **Palette Materica:**
  - `#E5E5E0`: Cemento grezzo chiaro di fondo.
  - `#D4D4CE`: Griglia architettonica millimetrica (`24px x 24px`).
  - `#F4F4F0` / `#FFFFFF`: Superfici card e monoliti.
  - `#0A0A0A`: Nero ossidato pieno per testi e cornici strutturali.
  - `brand.accentColor` (`#FF3B00`): Tonalità d'accento ad altissimo contrasto per i trigger primari e gli hotspot attivi.

---

## 🥽 WebAR & 3D Interactive Hotspots

Il componente [`src/components/ArViewer.jsx`](src/components/ArViewer.jsx) implementa:
1. **SSR-Safe Loading:** `@google/model-viewer` viene caricato client-side in modo asincrono per prevenire qualsiasi conflitto con il server-side rendering di Next.js.
2. **Supporto Cross-Platform AR:**
   - **Android:** WebXR e Google Scene Viewer nativo.
   - **iOS (iPhone/iPad):** Quick Look AR nativo.
3. **Hotspot 3D Dinamici:** Generati automaticamente dai record in `config.json` con coordinate 3D `position` e orientamento vettoriale `normal`.
4. **Scheda Tecnica a Comparsa:** Toccando un punto numerato sul monolite 3D si apre in sovraimpressione la scheda descrittiva della finitura con codice materiale, titolo e trattamento materico.
5. **Fallback Visivo:** Se il file `.glb` non è presente o è in fase di caricamento, l'interfaccia mostra un blueprint schematico con indicatori di stato.

---

## ⚙️ Personalizzazione Rapida (`src/data/config.json`)

Per cambiare qualsiasi elemento grafico o informativo, modifica semplicemente `src/data/config.json`:

```json
{
  "brand": {
    "name": "WALDDEI",
    "tagline": "INTERIOR ARCHITECTURE // RAW DESIGN",
    "manifesto": "Descrizione della visione progettuale...",
    "accentColor": "#FF3B00",
    "badge": "NFC SECURE TAG // ED. 2026",
    "location": "MILANO // ZÜRICH"
  },
  "contacts": {
    "vcardPath": "/walddei.vcf",
    "vcardLabel": "SCARICA CONTATTO [.VCF]",
    "actions": [
      {
        "id": "whatsapp",
        "label": "DIRETTO STUDIO [WHATSAPP]",
        "url": "https://wa.me/390289000000",
        "type": "primary",
        "icon": "MessageSquare"
      }
    ]
  },
  "arExperience": {
    "enabled": true,
    "sectionTitle": "01 // ESPLORAZIONE MATERICA AR",
    "modelPath": "/models/walddei-monolith.glb",
    "hotspots": [
      {
        "id": "hotspot-1",
        "slot": "hotspot-1",
        "position": "0.15m 0.45m 0.1m",
        "normal": "0m 0m 1m",
        "code": "MAT // 01",
        "title": "CEMENTO GREZZO",
        "description": "Finitura materica spatolata a mano..."
      }
    ]
  }
}
```

---

## 🚀 Sviluppo Locale & Build

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Compila la build di produzione
npm run build

# Avvia la build di produzione
npm start
```

Il sito sarà accessibile all'indirizzo: `http://localhost:3000`.

---

## 📦 Deploy su Vercel & GitHub

### 1. Push su GitHub
```bash
git init
git add .
git commit -m "feat: initial commit walddei nfc webar app"
git branch -M main
git remote add origin https://github.com/<TUO-USERNAME>/walddei-nfc.git
git push -u origin main
```

### 2. Deploy su Vercel (Zero-Config)
1. Vai su [vercel.com](https://vercel.com) e accedi con il tuo account GitHub.
2. Clicca su **"Add New..."** -> **"Project"**.
3. Importa il repository `walddei-nfc`.
4. Vercel rileverà automaticamente Next.js (App Router). Clicca su **Deploy**.
5. In circa 45 secondi l'applicazione sarà live con certificato SSL HTTPS attivo (fondamentale per consentire alle API WebXR / WebAR e alla fotocamera di attivarsi).

---

## 📲 Scrittura sulla Placca NFC Fisica

Per collegare la placca fisica allo studio:
1. Copia l'URL di produzione generato da Vercel (es. `https://walddei.vercel.app` o il dominio personalizzato `https://nfc.walddei.com`).
2. Installa l'app gratuita **NFC Tools** su iOS (App Store) o Android (Google Play).
3. Seleziona **Scrivi (Write)** -> **Aggiungi un record (Add a record)** -> **URL / URI Web**.
4. Incolla il link HTTPS del tuo sito e premi **Scrivi**.
5. Avvicina lo smartphone alla placca NFC metallica/acrilica per confermare la scrittura del chip (NTAG213, NTAG215 o NTAG216).
