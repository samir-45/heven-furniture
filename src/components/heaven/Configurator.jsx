import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { WHATSAPP_URL } from "./constants";

// Pure-frontend bespoke configurator — live price estimate + WhatsApp pre-fill.
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
          ? "border-brass bg-brass/10 text-ink"
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
            ? "border-brass scale-110 ring-2 ring-brass/25"
            : "border-ink/15 group-hover:border-ink/35"
        }`}
        style={{ backgroundColor: swatch }}
      />
      <span
        className={`text-[0.66rem] uppercase tracking-[0.16em] transition-colors ${
          active ? "text-ink" : "text-ink/50"
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
        className="w-full accent-bronze h-1"
      />
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
            {/* Controls */}
            <div className="lg:col-span-8 bg-bone rounded-sm border border-ink/8 p-7 md:p-10 space-y-9">
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
              <div className="bg-depth text-bone rounded-sm p-7 md:p-8 relative overflow-hidden">
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

                <a
                  href={waMessage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 w-full inline-flex items-center justify-center gap-2.5 bg-brass text-depth font-medium text-sm tracking-wide rounded-full px-6 py-3.5 hover:bg-bone transition-colors duration-300"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                  {t("config.send")}
                </a>

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