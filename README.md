# 🛋️ Haven Furniture (Heaven Furniture Mart)

> **Luxury Handcrafted Teak Furniture & Architectural Digital Atelier**  
> An immersive, high-ticket bespoke furniture commerce web platform pairing traditional Chittagong artisanal woodworking with cutting-edge 3D WebGL parametric customization, 2D architectural room planning, and high-conversion client consultation workflows.

---

[![React 18](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite 6](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.171-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.16-black?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Lenis Smooth Scroll](https://img.shields.io/badge/Lenis-Smooth_Scroll-8C7355?style=for-the-badge)](https://lenis.darkroom.engineering/)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [1. Interactive 3D Furniture Configurator](#1-interactive-3d-furniture-configurator-threejs--webgl)
  - [2. Interactive 2D Architectural Room Planner](#2-interactive-2d-architectural-room-planner-planner)
  - [3. Curated Atelier Product Showcase & Gallery](#3-curated-atelier-product-showcase--gallery-gallery)
  - [4. Private Residences Portfolio](#4-private-residences-portfolio-residences)
  - [5. Timber & Materials Knowledge Base](#5-timber--materials-knowledge-base-materials)
  - [6. Omnichannel WhatsApp Lead Pipeline](#6-omnichannel-whatsapp-lead-pipeline)
  - [7. Bilingual Internationalization (EN / বাংলা)](#7-bilingual-internationalization-en--বাংলা)
  - [8. Premium Micro-Interactions & Smooth Scroll](#8-premium-micro-interactions--smooth-scroll)
- [Tech Stack & Dependencies](#-tech-stack--dependencies)
- [Project Architecture](#-project-architecture)
- [Application Routes](#-application-routes)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Production Build](#production-build)
- [Design System & Palette](#-design-system--palette)
- [Performance & Engineering Highlights](#-performance--engineering-highlights)
- [License](#-license)

---

## 🌟 Overview

**Haven Furniture** (Heaven Furniture Mart) is an e-commerce platform and digital atelier designed for luxury solid-wood furniture in Bangladesh. Engineered to cater to discerning homeowners, architects, and interior designers, the platform bridges the gap between digital discovery and master artisan commissioning.

Instead of basic static product pages, Haven provides an experiential shopping journey: clients can dynamically configure 3D furniture dimensions, test floor plans on a scaled 2D spatial canvas, generate architectural PDF blueprints, and initiate direct bespoke commissions over WhatsApp with pre-filled technical specifications.

---

## ✨ Key Features

### 1. Interactive 3D Furniture Configurator (Three.js / WebGL)
* **Real-time Parametric Scaling**: Live dimension controls (Width × Depth × Height) that adjust the 3D model geometry without texture distortion or mesh tearing.
* **Procedural Timber & Upholstery Switching**: Instant PBR material swapping between authentic wood varieties (**Chittagong Teak**, **American Walnut**, **Sil Koroi**) and premium fabrics/leather.
* **360° Orbital Camera**: Smooth mouse and touch rotation with dynamic lighting, shadows, and camera position presets.
* **Dynamic Quotation**: Automatic real-time price re-calculation based on customized material volumes and hardware choices.

### 2. Interactive 2D Architectural Room Planner (`/planner`)
* **Metric Grid Canvas (0.5m scale)**: Visual grid canvas with boundary physics, snap-to-grid alignment, and collision awareness.
* **Spatial Occupancy & Budget Analytics**: Live metric readouts calculating the percentage of occupied floor area, remaining clearance space, and total itemized project cost in Bangladeshi Taka (৳).
* **Piece Manipulation**: Drag-and-drop piece placement, 90° rotation controls, and custom dimension adjustments.
* **Client-side Architectural Blueprint Export**: One-click PDF generation using `jsPDF` and `html2canvas`, producing a print-ready vector floor plan with room dimensions, piece layout, and an itemized Bill of Materials (BOM).

### 3. Curated Atelier Product Showcase & Gallery (`/gallery`)
* **Dual-Axis Dynamic Filtering**: Filter collections simultaneously by Room Category (*Living, Dining, Bedroom, Executive Office*) and Timber Species (*Chittagong Teak, Sil Koroi, Mahogany, American Walnut*).
* **Framer Motion Layout Animations**: Fluid tab transitions using `layoutId` pill animations with zero layout shift (CLS).
* **Quick-View Modal**: Deep-dive product inspection modal featuring multi-angle gallery views, joinery specifications (Mortise & Tenon), dimensions, and direct quotation triggers.
* **Real-time Instant Search**: Debounced search indexing titles, timber species, room tags, and finish descriptions.

### 4. Private Residences Portfolio (`/residences`)
* **Architectural Showcase**: High-resolution project photography of bespoke residential installations across premier neighborhoods (Agrabad Penthouse, GEC Luxury Villa, Khulshi Study).
* **Interactive Before / After Transformation**: Draggable split-view slider demonstrating room transformation from raw space to fully furnished luxury sanctuary.

### 5. Timber & Materials Knowledge Base (`/materials`)
* **Solid Timber Guide**: In-depth educational resource detailing grain patterns, density, natural moisture resistance, and seasoning methods for sustainably harvested Chittagong Teak, Rosewood, and Walnut.
* **Artisanal Joinery**: Visual breakdown of heritage joinery techniques (Mortise & Tenon, Dovetail joints) that guarantee heirloom longevity.

### 6. Omnichannel WhatsApp Lead Pipeline
* **Context-Aware Direct Inquiry**: Generates pre-formatted WhatsApp consultation links carrying exact configuration details:
  ```text
  Hello Haven Furniture, I would like to inquire about:
  • Item: Royal Teak Executive Desk
  • Finish: Chittagong Seasoned Teak
  • Dimensions: 180cm (W) x 85cm (D) x 76cm (H)
  • Estimated Price: ৳1,45,000
  ```
* **Consultation Drawer**: Global slide-out booking drawer with date picking and room blueprint upload capability, integrated with Lenis scroll locking.

### 7. Bilingual Internationalization (EN / বাংলা)
* **Custom i18n Context**: Complete bilingual support across navigation, descriptions, configuration labels, specifications, and client testimonials.
* **Accessible Toggle**: Dedicated, high-contrast language switch designed specifically for elder and high-net-worth clients (40+ demographic).

### 8. Premium Micro-Interactions & Smooth Scroll
* **Lenis Smooth Scrolling**: Decoupled momentum scrolling across all desktop and tablet viewports.
* **Custom Interactive Cursor**: Subtle magnetic hover effects and context-aware cursor labels (`View`, `Drag`, `Explore`).

---

## 🛠️ Tech Stack & Dependencies

| Category | Technologies / Libraries |
| :--- | :--- |
| **Core Framework** | React 18 (`react`, `react-dom`), Vite 6 |
| **Routing** | React Router DOM v6 (`BrowserRouter`, `Routes`, `Route`) |
| **3D Graphics & WebGL** | Three.js (`three` v0.171), OrbitControls |
| **Styling & Design System** | Tailwind CSS v3.4, `tailwindcss-animate`, CSS Variables |
| **UI Primitives** | Radix UI (`@radix-ui/react-*`), Lucide Icons (`lucide-react`) |
| **Animations & Motion** | Framer Motion (`framer-motion` v11.16) |
| **Smooth Scrolling** | Lenis (`lenis` v1.3) |
| **PDF & Canvas Generation**| jsPDF (`jspdf` v4.2), HTML2Canvas (`html2canvas` v1.4) |
| **State & Data Fetching** | React Context API, TanStack React Query v5 |
| **Forms & Validation** | React Hook Form, Zod |

---

## 📂 Project Architecture

```text
Haven-Furniture/
├── public/                     # Static public assets, textures, and icons
├── src/
│   ├── assets/                 # Brand imagery, photography, and optimized textures
│   ├── components/
│   │   ├── heaven/             # Feature-specific Haven Furniture modules
│   │   │   ├── BeforeAfter.jsx         # Interactive split-screen before/after comparison
│   │   │   ├── BrandIntro.jsx          # Heritage & workshop narrative
│   │   │   ├── BrandLogo.jsx           # SVG crest and brand typography component
│   │   │   ├── Collections.jsx         # Home page featured collection preview
│   │   │   ├── Configurator.jsx        # 3D customizer controls, materials & dimension sliders
│   │   │   ├── ConsultationContext.jsx # Global consultation drawer state management
│   │   │   ├── ConsultationDrawer.jsx  # Slide-out booking modal with scroll lock
│   │   │   ├── CraftJourney.jsx        # Step-by-step woodworking narrative
│   │   │   ├── CursorView.jsx          # Custom magnetic cursor tracking
│   │   │   ├── FloatingWhatsApp.jsx    # Persistent quick-contact widget
│   │   │   ├── Footer.jsx              # Atelier links, showroom hours, and locations
│   │   │   ├── Furniture3DCanvas.jsx   # Three.js WebGL canvas, lighting & orbital controls
│   │   │   ├── Hero.jsx                # Cinematic luxury hero banner
│   │   │   ├── LanguageProvider.jsx    # i18n English/Bangla language context
│   │   │   ├── Nav.jsx                 # Glassmorphic header with navigation & language toggle
│   │   │   ├── ProductDetailModal.jsx  # Detailed quick-view modal
│   │   │   ├── Showroom.jsx            # Physical workshop & showroom locator
│   │   │   ├── products.js             # Master product catalog & specifications
│   │   │   └── translations.js         # Complete English & Bengali translation dictionaries
│   │   ├── ui/                 # Reusable Radix UI design system primitives
│   │   └── ScrollToTop.jsx     # Route transition scroll reset
│   ├── hooks/                  # Custom React hooks (useMobile, useToast, etc.)
│   ├── lib/                    # Utilities, query client, and error handlers
│   ├── pages/                  # Top-level code-split route views
│   │   ├── Home.jsx            # Main flagship landing page
│   │   ├── Gallery.jsx         # Comprehensive product catalog with dual-axis filters
│   │   ├── RoomPlanner.jsx     # Interactive 2D architectural room planner & PDF export
│   │   ├── Residences.jsx      # Architectural interior showcase & client case studies
│   │   └── Materials.jsx       # Timber & joinery masterclass
│   ├── App.jsx                 # App root with providers, Lenis initialization & routes
│   ├── index.css               # Global styles, font definitions & design tokens
│   └── main.jsx                # Application mount entry point
├── tailwind.config.js          # Tailwind design tokens, luxury colors & keyframes
├── vite.config.js              # Vite bundler configuration & path aliases
└── package.json                # Project dependencies and npm scripts
```

---

## 🗺️ Application Routes

| Path | Component | Description |
| :--- | :--- | :--- |
| `/` | `Home.jsx` | Flagship landing page: Hero, 3D customizer preview, craftsmanship story, collections, and showroom. |
| `/gallery` | `Gallery.jsx` | Full catalog with real-time search, dual-axis filtering (Room + Wood), and Quick View inspection. |
| `/planner` | `RoomPlanner.jsx` | Interactive 2D room floorplan designer, occupancy budget calculator, and architectural PDF export. |
| `/residences` | `Residences.jsx` | Curated client portfolio with interactive Before/After renovation comparisons. |
| `/materials` | `Materials.jsx` | Educational guide on solid timber species, grain selection, seasoning, and heirloom joinery. |
| `*` | `PageNotFound.jsx` | Elegant 404 fallback page with redirection to the home showroom. |

*(Alternative alias routes `/catalog`, `/products`, `/portfolio`, `/atelier`, and `/room-planner` are also mapped for seamless UX).*

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher recommended
- **npm** (v9+) or **pnpm** / **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/haven-furniture.git
   cd haven-furniture
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running Locally

Start the Vite local development server with hot-module replacement (HMR):

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

To build the production-optimized client bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### Additional Scripts

- **Linting**: `npm run lint` or `npm run lint:fix`
- **Type Checking**: `npm run typecheck`

---

## 🎨 Design System & Palette

Haven Furniture utilizes a bespoke, warm-toned luxury palette specifically selected to evoke aged teakwood, architectural plaster, and artisanal brass:

| Color Name | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| **Bone** | `#F9F7F2` | Primary backdrop; warm, museum-quality linen foundation. |
| **Ink** | `#1A1A1A` | High-contrast body typography and primary headers. |
| **Bronze** | `#8C7355` | Primary brand accent, CTA buttons, active state indicators. |
| **Sand** | `#EAE7DF` | Subtle secondary borders, active tab backgrounds, canvas grids. |
| **Depth** | `#16292B` | Deep forest-emerald for luxury callout cards and prestige badges. |
| **Cocoa** | `#3B2A20` | Rich dark timber tone for dark sections and footer elements. |
| **Brass / Oak** | `#C9A66B` / `#C8A47E` | Metallic hardware highlights and golden wood grain accents. |

---

## ⚡ Performance & Engineering Highlights

* **Code Splitting & Lazy Loading**: Heavy modules (Three.js 3D canvas, jsPDF export, sub-pages) are lazy-loaded with React `Suspense` and dynamic `import()` to ensure sub-second initial page loads.
* **Layout Stability (Zero CLS)**: Framer Motion layout animations and reserved aspect ratios prevent layout shifts during category filter toggling.
* **Client-Side PDF Generation**: Generates 300 DPI architectural blueprints entirely in the client browser, eliminating server compute overhead and protecting client floor plan privacy.
* **Responsive Touch & Pointer Physics**: Three.js orbital controls and 2D canvas drag-and-drop are normalized for unified touch and mouse operation.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  Crafted with passion for authentic woodworking and modern web engineering.  
  <b>Haven Furniture (Heaven Furniture Mart)</b> • Chittagong & Dhaka, Bangladesh
</div>
