import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MessageCircle, Download, FileText, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { WHATSAPP_URL, ADDRESS, PHONE_DISPLAY, EMAIL } from "./constants";

// Pure-frontend bespoke configurator — live price estimate + dynamic SVG visualizer + PDF download + WhatsApp pre-fill.
// No backend; all state is local. Prices are illustrative starting points (BDT).

const CATEGORIES = [
  { id: "sofa", base: 45000, hasFabric: true },
  { id: "bed", base: 65000, hasFabric: true },
  { id: "dining", base: 38000, hasFabric: false },
  { id: "wardrobe", base: 52000, hasFabric: false },
  { id: "chair", base: 18000, hasFabric: true },
];

const WOODS = [
  { id: "oak", swatch: "#C8A47E", mult: 1.0 },
  { id: "walnut", swatch: "#5C3A21", mult: 1.25 },
  { id: "teak", swatch: "#9C6B3C", mult: 1.15 },
  { id: "mahogany", swatch: "#6D2E1F", mult: 1.3 },
];

const FABRICS = [
  { id: "linen", swatch: "#D9CFBE", mult: 1.0 },
  { id: "velvet", swatch: "#3B2A20", mult: 1.2 },
  { id: "boucle", swatch: "#EAE7DF", mult: 1.18 },
  { id: "leather", swatch: "#4A3528", mult: 1.45 },
];

const FINISHES = [
  { id: "natural", mult: 1.0 },
  { id: "stained", mult: 1.08 },
  { id: "handrubbed", mult: 1.18 },
];

const fmt = (n, lang = "en") =>
  "৳" + Math.round(n).toLocaleString(lang === "bn" ? "bn-BD" : "en-BD", { maximumFractionDigits: 0 });

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-4 py-2.5 rounded-full border text-sm transition-all duration-300 ${
        active
          ? "border-brass bg-brass/10 text-ink font-medium"
          : "border-ink/15 text-ink/65 hover:border-ink/35 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Swatch({ active, onClick, label, swatch }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className="group flex flex-col items-center gap-2 transition-all duration-300"
    >
      <span
        className={`h-12 w-12 rounded-full border-2 transition-all duration-300 ${
          active
            ? "border-brass scale-110 ring-2 ring-brass/25 shadow-sm"
            : "border-ink/15 group-hover:border-ink/35"
        }`}
        style={{ backgroundColor: swatch }}
      />
      <span
        className={`text-[0.66rem] uppercase tracking-[0.16em] transition-colors ${
          active ? "text-ink font-medium" : "text-ink/50"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function Slider({ label, value, set, min, max, unit }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-ink/60">{label}</span>
        <span className="text-ink font-medium tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full accent-bronze h-1 cursor-pointer"
      />
    </div>
  );
}

function FurnitureVisualizer({ category, wood, fabric, finish, width, depth, height }) {
  const woodColor = wood.swatch || "#9C6B3C";
  const fabricColor = fabric?.swatch || "#D9CFBE";

  const scaleW = Math.max(0.85, Math.min(1.2, width / 200));
  const scaleH = Math.max(0.88, Math.min(1.15, height / 80));

  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[2.2/1] rounded-sm bg-gradient-to-b from-bone via-sand/30 to-sand/60 border border-ink/8 overflow-hidden flex items-center justify-center p-6 select-none shadow-inner">
      {/* Floor reflection & ambient shadow */}
      <div className="absolute bottom-5 w-3/4 h-6 rounded-[100%] bg-ink/10 blur-md pointer-events-none" />

      {/* Dynamic SVG graphic */}
      <motion.svg
        key={category.id}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        viewBox="0 0 400 240"
        className="w-full h-full max-h-[200px] drop-shadow-md z-10"
        style={{
          transform: `scale(${scaleW}, ${scaleH})`,
          transition: "transform 0.25s ease-out",
        }}
      >
        <defs>
          <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={woodColor} stopOpacity="1" />
            <stop offset="100%" stopColor={woodColor} stopOpacity="0.82" />
          </linearGradient>
          <linearGradient id="fabricGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fabricColor} stopOpacity="1" />
            <stop offset="100%" stopColor={fabricColor} stopOpacity="0.85" />
          </linearGradient>
          <filter id="pieceShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.18" />
          </filter>
        </defs>

        {category.id === "sofa" && (
          <g>
            <rect x="75" y="180" width="10" height="24" rx="2" fill={woodColor} />
            <rect x="315" y="180" width="10" height="24" rx="2" fill={woodColor} />
            <rect x="195" y="182" width="10" height="22" rx="2" fill={woodColor} opacity="0.8" />
            <rect x="60" y="172" width="280" height="14" rx="3" fill="url(#woodGrad)" />
            <rect x="70" y="70" width="260" height="106" rx="14" fill="url(#fabricGrad)" filter="url(#pieceShadow)" />
            <rect x="76" y="128" width="120" height="46" rx="8" fill="url(#fabricGrad)" stroke={woodColor} strokeOpacity="0.2" />
            <rect x="204" y="128" width="120" height="46" rx="8" fill="url(#fabricGrad)" stroke={woodColor} strokeOpacity="0.2" />
            <rect x="54" y="105" width="30" height="70" rx="8" fill="url(#fabricGrad)" filter="url(#pieceShadow)" />
            <rect x="316" y="105" width="30" height="70" rx="8" fill="url(#fabricGrad)" filter="url(#pieceShadow)" />
            <path d="M 95 125 Q 110 115 125 125 Q 125 145 110 150 Q 95 145 95 125 Z" fill="#C9A66B" opacity="0.85" />
          </g>
        )}

        {category.id === "bed" && (
          <g>
            <rect x="70" y="40" width="260" height="120" rx="6" fill="url(#woodGrad)" />
            <rect x="84" y="52" width="232" height="96" rx="4" fill="url(#fabricGrad)" filter="url(#pieceShadow)" />
            <line x1="142" y1="52" x2="142" y2="148" stroke="#16292B" strokeOpacity="0.15" strokeWidth="2" />
            <line x1="200" y1="52" x2="200" y2="148" stroke="#16292B" strokeOpacity="0.15" strokeWidth="2" />
            <line x1="258" y1="52" x2="258" y2="148" stroke="#16292B" strokeOpacity="0.15" strokeWidth="2" />
            <rect x="60" y="146" width="280" height="40" rx="4" fill="url(#woodGrad)" />
            <rect x="68" y="142" width="264" height="28" rx="4" fill="#F9F7F2" filter="url(#pieceShadow)" />
            <rect x="90" y="125" width="80" height="24" rx="4" fill="#EAE7DF" stroke="#1A1A1A" strokeOpacity="0.1" />
            <rect x="230" y="125" width="80" height="24" rx="4" fill="#EAE7DF" stroke="#1A1A1A" strokeOpacity="0.1" />
            <rect x="75" y="186" width="14" height="20" rx="2" fill={woodColor} />
            <rect x="311" y="186" width="14" height="20" rx="2" fill={woodColor} />
          </g>
        )}

        {category.id === "dining" && (
          <g>
            <rect x="50" y="100" width="300" height="22" rx="4" fill="url(#woodGrad)" filter="url(#pieceShadow)" />
            <rect x="54" y="122" width="292" height="6" fill={woodColor} opacity="0.7" />
            <rect x="80" y="128" width="18" height="76" rx="3" fill="url(#woodGrad)" />
            <rect x="302" y="128" width="18" height="76" rx="3" fill="url(#woodGrad)" />
            <rect x="110" y="128" width="14" height="68" rx="2" fill={woodColor} opacity="0.6" />
            <rect x="276" y="128" width="14" height="68" rx="2" fill={woodColor} opacity="0.6" />
            <ellipse cx="200" cy="98" rx="12" ry="4" fill="#C9A66B" />
            <path d="M 194 98 Q 188 78 200 68 Q 212 78 206 98 Z" fill="#C9A66B" opacity="0.9" />
          </g>
        )}

        {category.id === "wardrobe" && (
          <g>
            <rect x="85" y="30" width="230" height="14" rx="2" fill="url(#woodGrad)" />
            <rect x="90" y="44" width="220" height="150" fill="url(#woodGrad)" filter="url(#pieceShadow)" />
            <rect x="96" y="48" width="66" height="140" rx="2" fill={woodColor} stroke="#16292B" strokeOpacity="0.25" />
            <rect x="167" y="48" width="66" height="140" rx="2" fill={woodColor} stroke="#16292B" strokeOpacity="0.25" />
            <rect x="238" y="48" width="66" height="140" rx="2" fill={woodColor} stroke="#16292B" strokeOpacity="0.25" />
            <circle cx="156" cy="118" r="3" fill="#C9A66B" />
            <circle cx="173" cy="118" r="3" fill="#C9A66B" />
            <circle cx="244" cy="118" r="3" fill="#C9A66B" />
            <rect x="86" y="194" width="228" height="12" rx="1" fill="url(#woodGrad)" />
          </g>
        )}

        {category.id === "chair" && (
          <g>
            <line x1="140" y1="160" x2="120" y2="204" stroke={woodColor} strokeWidth="8" strokeLinecap="round" />
            <line x1="260" y1="160" x2="280" y2="204" stroke={woodColor} strokeWidth="8" strokeLinecap="round" />
            <rect x="130" y="144" width="140" height="16" rx="4" fill="url(#woodGrad)" />
            <rect x="145" y="60" width="110" height="88" rx="12" fill="url(#fabricGrad)" filter="url(#pieceShadow)" />
            <rect x="125" y="130" width="150" height="28" rx="8" fill="url(#fabricGrad)" filter="url(#pieceShadow)" />
            <path d="M 125 105 Q 115 125 125 145" stroke={woodColor} strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 275 105 Q 285 125 275 145" stroke={woodColor} strokeWidth="6" fill="none" strokeLinecap="round" />
          </g>
        )}
      </motion.svg>

      {/* Floating Dimension Tag */}
      <div className="absolute top-3 left-3 bg-bone/95 backdrop-blur-sm border border-ink/10 px-2.5 py-1 rounded-sm text-[0.62rem] tracking-wider uppercase text-ink/70 font-medium z-20 flex items-center gap-1.5 shadow-sm">
        <Sparkles className="h-3 w-3 text-bronze" />
        <span>{width} × {depth} × {height} cm</span>
      </div>

      {/* Material Label Tag */}
      <div className="absolute bottom-3 right-3 bg-depth/90 backdrop-blur-sm border border-brass/35 px-2.5 py-1 rounded-sm text-[0.62rem] tracking-wider text-brass font-light z-20 shadow-sm">
        {wood.id.toUpperCase()} {category.hasFabric && `· ${fabric.id.toUpperCase()}`}
      </div>
    </div>
  );
}

export default function Configurator() {
  const { t, lang } = useLang();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [wood, setWood] = useState(WOODS[0]);
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [finish, setFinish] = useState(FINISHES[0]);
  const [width, setWidth] = useState(200);
  const [depth, setDepth] = useState(90);
  const [height, setHeight] = useState(80);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const estimate = useMemo(() => {
    const sizeFactor =
      1 + ((width * depth * height) / (200 * 90 * 80) - 1) * 0.25;
    const safe = Math.max(0.7, sizeFactor);
    const fabricMultiplier = category.hasFabric ? fabric.mult : 1.0;
    return category.base * wood.mult * fabricMultiplier * finish.mult * safe;
  }, [category, wood, fabric, finish, width, depth, height]);

  const waMessage = useMemo(() => {
    const pieceLabel = t(`config.cat.${category.id}`);
    const lines = [
      t("config.msg.greeting"),
      "",
      t("config.msg.enquire", { piece: pieceLabel }),
      "",
      t("config.msg.wood", { v: t(`config.wood.${wood.id}`) }),
    ];
    if (category.hasFabric) {
      lines.push(t("config.msg.upholstery", { v: t(`config.fabric.${fabric.id}`) }));
    }
    lines.push(
      t("config.msg.finish", { v: t(`config.finish.${finish.id}`) }),
      t("config.msg.dims", { w: width, d: depth, h: height }),
      "",
      t("config.msg.budget", { price: fmt(estimate, lang) }),
      "",
      t("config.msg.next")
    );
    return `${WHATSAPP_URL}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [t, lang, category, wood, fabric, finish, width, depth, height, estimate]);

  const handleDownloadPdf = async () => {
    setPdfGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      // Background
      doc.setFillColor(249, 247, 242);
      doc.rect(0, 0, pageWidth, 297, "F");

      // Top Dark Header Band
      doc.setFillColor(22, 41, 43);
      doc.rect(0, 0, pageWidth, 48, "F");

      // Gold Accent Line
      doc.setFillColor(201, 166, 107);
      doc.rect(0, 48, pageWidth, 2, "F");

      // Header Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(249, 247, 242);
      doc.text("HEAVEN FURNITURE MART", 18, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(201, 166, 107);
      doc.text("BESPOKE FURNITURE & INTERIOR STYLING · CHATTOGRAM", 18, 28);
      doc.setTextColor(190, 190, 190);
      doc.text("Designed. Crafted. Customized.", 18, 36);

      // Certificate / Spec Box Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(22, 41, 43);
      doc.text("BESPOKE SPECIFICATION SHEET", 18, 62);

      // Reference Code & Date
      const refCode = `HFM-SPEC-${Date.now().toString().slice(-6)}`;
      const dateStr = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(`Ref: ${refCode}   |   Date: ${dateStr}`, 18, 68);

      // Main Spec Table Box
      doc.setDrawColor(201, 166, 107);
      doc.setLineWidth(0.4);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(18, 74, pageWidth - 36, 92, 3, 3, "FD");

      const CAT_PDF_NAMES = {
        sofa: "Living Room Luxury Sofa",
        bed: "Bespoke Royal King Bed",
        dining: "Handcrafted Dining Table Suite",
        wardrobe: "Custom Fitted Architectural Wardrobe",
        chair: "Bespoke Lounge Accent Chair",
      };

      const WOOD_PDF_NAMES = {
        oak: "Solid White Oak (Kiln-Dried)",
        walnut: "American Black Walnut (Kiln-Dried)",
        teak: "Chittagong Teak (Solid Seasoned Segun)",
        mahogany: "Selected Solid Mahogany (Kiln-Dried)",
      };

      const FABRIC_PDF_NAMES = {
        linen: "Natural Belgian Linen",
        velvet: "Royal Plush Velvet",
        boucle: "Textured Cream Boucle",
        leather: "Full-Grain Italian Leather",
      };

      const FINISH_PDF_NAMES = {
        natural: "Natural Satin Wood Seal",
        stained: "Rich Dark Stain Polish",
        handrubbed: "Traditional Hand-Rubbed Oil Finish",
      };

      // Spec Rows with clean Latin text for 100% universal PDF rendering
      const rows = [
        ["Furniture Piece", CAT_PDF_NAMES[category.id] || "Bespoke Furniture Piece"],
        ["Selected Timber", WOOD_PDF_NAMES[wood.id] || "Solid Timber"],
        category.hasFabric ? ["Upholstery Fabric", FABRIC_PDF_NAMES[fabric.id] || "Custom Fabric"] : null,
        ["Artisanal Finish", FINISH_PDF_NAMES[finish.id] || "Hand-Rubbed Finish"],
        ["Custom Dimensions", `${width} cm (Width) x ${depth} cm (Depth) x ${height} cm (Height)`],
        ["Indicative Budget", `BDT ${Math.round(estimate).toLocaleString("en-US")}`],
      ].filter(Boolean);

      let currentY = 86;
      rows.forEach(([label, val], idx) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(22, 41, 43);
        doc.text(label, 26, currentY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        doc.text(String(val), 95, currentY);

        if (idx < rows.length - 1) {
          doc.setDrawColor(230, 230, 230);
          doc.line(26, currentY + 3, pageWidth - 26, currentY + 3);
        }
        currentY += 13;
      });

      // Trust Highlights Box
      doc.setFillColor(234, 231, 223);
      doc.roundedRect(18, 172, pageWidth - 36, 42, 3, 3, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(22, 41, 43);
      doc.text("THE HEAVEN PROMISE & BESPOKE PROCESS", 26, 182);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);
      doc.text("-  100% Solid kiln-dried timber & master in-house joinery (No shortcuts, no mass production)", 26, 190);
      doc.text("-  Free design consultation & custom 3D drawing alignment before workshop crafting", 26, 196);
      doc.text("-  White-glove delivery & professional installation included directly to your residence", 26, 202);
      doc.text("-  Large physical showroom located on Agrabad Access Road, Chattogram", 26, 208);

      // Showroom & Contact Footer Card
      doc.setFillColor(22, 41, 43);
      doc.roundedRect(18, 220, pageWidth - 36, 48, 3, 3, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(201, 166, 107);
      doc.text("SHOWROOM & CONSULTATION DESK", 26, 232);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(249, 247, 242);
      doc.text(`Address: ${ADDRESS}`, 26, 240);
      doc.text(`WhatsApp / Phone: ${PHONE_DISPLAY}   |   Email: ${EMAIL}`, 26, 250);
      doc.text("Managing Director: Abul Kalam Bhuiyan   |   Founded: 2020", 26, 258);

      // Bottom disclaimer
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(140, 140, 140);
      doc.text(
        "* Final pricing and delivery timeline are confirmed during your consultation based on exact detailing.",
        pageWidth / 2,
        278,
        { align: "center" }
      );

      doc.save(`Heaven-Furniture-Spec-${category.id}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setTimeout(() => setPdfGenerating(false), 500);
    }
  };

  return (
    <section
      id="design"
      className="scroll-mt-24 bg-sand py-16 md:py-24 relative overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="max-w-2xl mb-12 md:mb-16">
          <Reveal>
            <p className="text-bronze text-[0.68rem] uppercase tracking-[0.34em] mb-5">
              {t("config.eyebrow")}
            </p>
            <h2 className="font-heading font-light text-ink text-4xl md:text-6xl leading-[1.04]">
              {t("config.title")}
            </h2>
            <p className="mt-5 text-ink/60 text-lg leading-relaxed font-light max-w-lg">
              {t("config.subtitle")}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Controls & Live Visualizer */}
            <div className="lg:col-span-8 bg-bone rounded-sm border border-ink/8 p-7 md:p-10 space-y-9">
              {/* Dynamic 2D Visualizer */}
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-ink/45 mb-3 flex items-center justify-between">
                  <span>{t("config.visualPreview")}</span>
                  <span className="text-bronze font-medium">Interactive</span>
                </p>
                <FurnitureVisualizer
                  category={category}
                  wood={wood}
                  fabric={fabric}
                  finish={finish}
                  width={width}
                  depth={depth}
                  height={height}
                />
              </div>

              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-ink/45 mb-4">
                  {t("config.category")}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {CATEGORIES.map((c) => (
                    <Pill
                      key={c.id}
                      active={category.id === c.id}
                      onClick={() => setCategory(c)}
                    >
                      {t(`config.cat.${c.id}`)}
                    </Pill>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-ink/45 mb-4">
                  {t("config.wood")}
                </p>
                <div className="flex flex-wrap gap-6">
                  {WOODS.map((w) => (
                    <Swatch
                      key={w.id}
                      active={wood.id === w.id}
                      onClick={() => setWood(w)}
                      label={t(`config.wood.${w.id}`)}
                      swatch={w.swatch}
                    />
                  ))}
                </div>
              </div>

              {category.hasFabric && (
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.24em] text-ink/45 mb-4">
                    {t("config.upholstery")}
                  </p>
                  <div className="flex flex-wrap gap-6">
                    {FABRICS.map((f) => (
                      <Swatch
                        key={f.id}
                        active={fabric.id === f.id}
                        onClick={() => setFabric(f)}
                        label={t(`config.fabric.${f.id}`)}
                        swatch={f.swatch}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-ink/45 mb-4">
                  {t("config.finish")}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {FINISHES.map((f) => (
                    <Pill
                      key={f.id}
                      active={finish.id === f.id}
                      onClick={() => setFinish(f)}
                    >
                      {t(`config.finish.${f.id}`)}
                    </Pill>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 pt-2">
                <Slider label={t("config.width")} value={width} set={setWidth} min={80} max={320} unit=" cm" />
                <Slider label={t("config.depth")} value={depth} set={setDepth} min={40} max={160} unit=" cm" />
                <Slider label={t("config.height")} value={height} set={setHeight} min={40} max={220} unit=" cm" />
              </div>
            </div>

            {/* Live summary */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="bg-depth text-bone rounded-sm p-7 md:p-8 relative overflow-hidden shadow-xl">
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-brass mb-5">
                  {t("config.yourSpec")}
                </p>
                <div className="space-y-3 text-sm font-light">
                  <Row k={t("config.piece")} v={t(`config.cat.${category.id}`)} />
                  <Row k={t("config.wood")} v={t(`config.wood.${wood.id}`)} />
                  {category.hasFabric && (
                    <Row k={t("config.upholstery")} v={t(`config.fabric.${fabric.id}`)} />
                  )}
                  <Row k={t("config.finish")} v={t(`config.finish.${finish.id}`)} />
                  <Row k={t("config.dimensions")} v={`${width} × ${depth} × ${height} cm`} />
                </div>

                <div className="mt-7 pt-6 border-t border-bone/15">
                  <p className="text-[0.6rem] uppercase tracking-[0.22em] text-bone/45 mb-2">
                    {t("config.priceLabel")}
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={Math.round(estimate)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="font-heading text-4xl md:text-[2.7rem] font-light text-bone tabular-nums"
                    >
                      {fmt(estimate, lang)}
                    </motion.p>
                  </AnimatePresence>
                  <p className="mt-2 text-[0.66rem] text-bone/45 leading-relaxed">
                    {t("config.priceDisclaimer")}
                  </p>
                </div>

                <div className="mt-7 flex flex-col gap-3">
                  <a
                    href={waMessage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-brass text-depth font-medium text-sm tracking-wide rounded-full px-6 py-3.5 hover:bg-bone transition-colors duration-300 shadow-md"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                    {t("config.send")}
                  </a>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={pdfGenerating}
                    className="w-full inline-flex items-center justify-center gap-2.5 border border-bone/25 text-bone/85 hover:border-brass hover:text-brass text-xs uppercase tracking-wider rounded-full px-5 py-3 transition-colors duration-300 disabled:opacity-50 cursor-pointer"
                  >
                    {pdfGenerating ? (
                      <Download className="h-3.5 w-3.5 animate-bounce text-brass" />
                    ) : (
                      <FileText className="h-3.5 w-3.5 text-brass" />
                    )}
                    {pdfGenerating ? t("config.generatingPdf") : t("config.downloadSpec")}
                  </button>
                </div>

                <div className="mt-5 flex items-center gap-2 text-[0.66rem] text-bone/45">
                  <Check className="h-3.5 w-3.5 text-brass" strokeWidth={2} />
                  {t("config.noObligation")}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-bone/50">{k}</span>
      <span className="text-bone/90 text-right">{v}</span>
    </div>
  );
}