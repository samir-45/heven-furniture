import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, Flame, Droplets, Hammer, ArrowRight } from "lucide-react";
import Nav from "@/components/heaven/Nav";
import Footer from "@/components/heaven/Footer";
import CursorView from "@/components/heaven/CursorView";
import FloatingWhatsApp from "@/components/heaven/FloatingWhatsApp";
import ConsultationDrawer from "@/components/heaven/ConsultationDrawer";
import Reveal from "@/components/heaven/Reveal";
import { useLang } from "@/components/heaven/LanguageProvider";
import { useConsultation } from "@/components/heaven/ConsultationContext";
import { WHATSAPP_URL, PHONE_DISPLAY } from "@/components/heaven/constants";

const MATERIALS = [
  {
    id: "teak",
    nameKey: "materials.teak.name",
    originKey: "materials.teak.origin",
    densityKey: "materials.teak.density",
    charKey: "materials.teak.char",
    bestKey: "materials.teak.best",
    textureImg: "/images/texture-teak.jpg",
    swatch: "#9C6B3C",
    accentColor: "border-[#9C6B3C]",
    bgTint: "bg-[#9C6B3C]/10",
  },
  {
    id: "walnut",
    nameKey: "materials.walnut.name",
    originKey: "materials.walnut.origin",
    densityKey: "materials.walnut.density",
    charKey: "materials.walnut.char",
    bestKey: "materials.walnut.best",
    textureImg: "/images/texture-walnut.jpg",
    swatch: "#5C3A21",
    accentColor: "border-[#5C3A21]",
    bgTint: "bg-[#5C3A21]/10",
  },
  {
    id: "oak",
    nameKey: "materials.oak.name",
    originKey: "materials.oak.origin",
    densityKey: "materials.oak.density",
    charKey: "materials.oak.char",
    bestKey: "materials.oak.best",
    textureImg: "/images/texture-oak.jpg",
    swatch: "#C8A47E",
    accentColor: "border-[#C8A47E]",
    bgTint: "bg-[#C8A47E]/10",
  },
  {
    id: "leather",
    nameKey: "materials.leather.name",
    originKey: "materials.leather.origin",
    densityKey: "materials.leather.density",
    charKey: "materials.leather.char",
    bestKey: "materials.leather.best",
    textureImg: "/images/texture-leather.jpg",
    swatch: "#4A3528",
    accentColor: "border-[#4A3528]",
    bgTint: "bg-[#4A3528]/10",
  },
];

const PILLARS = [
  {
    icon: Droplets,
    titleKey: "materials.p1.title",
    descKey: "materials.p1.desc",
  },
  {
    icon: ShieldCheck,
    titleKey: "materials.p2.title",
    descKey: "materials.p2.desc",
  },
  {
    icon: Hammer,
    titleKey: "materials.p3.title",
    descKey: "materials.p3.desc",
  },
  {
    icon: Flame,
    titleKey: "materials.p4.title",
    descKey: "materials.p4.desc",
  },
];

export default function Materials() {
  const { t } = useLang();
  const { openConsultation } = useConsultation();
  const [activeMaterial, setActiveMaterial] = useState(MATERIALS[0]);

  return (
    <div className="min-h-screen bg-bone text-ink font-body">
      <CursorView />
      <Nav />
      <FloatingWhatsApp />
      <ConsultationDrawer />

      <main className="pt-28 md:pt-36 pb-20">
        {/* Hero Section */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 mb-12 sm:mb-16 md:mb-24">
          <Reveal>
            <p className="text-bronze text-[0.66rem] sm:text-[0.7rem] uppercase tracking-[0.38em] mb-3 sm:mb-4 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("materials.eyebrow")}</span>
            </p>
            <h1 className="font-heading font-light text-ink text-3xl sm:text-5xl lg:text-7xl leading-[1.06] max-w-3xl">
              {t("materials.title")}
            </h1>
            <p className="mt-4 sm:mt-6 text-ink/70 text-base sm:text-lg md:text-xl font-light max-w-2xl leading-relaxed">
              {t("materials.subtitle")}
            </p>
          </Reveal>
        </section>

        {/* Interactive Material Inspector */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 mb-20 sm:mb-28 md:mb-36">
          <Reveal>
            <div className="bg-sand/40 border border-ink/8 rounded-sm p-4 sm:p-8 lg:p-12 shadow-xl">
              {/* Tab Selector */}
              <div className="flex flex-wrap gap-2 sm:gap-3 pb-6 sm:pb-8 border-b border-ink/10">
                {MATERIALS.map((m) => {
                  const active = activeMaterial.id === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setActiveMaterial(m)}
                      className={`flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-3 rounded-full border text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer ${
                        active
                          ? "border-brass bg-depth text-bone shadow-md"
                          : "border-ink/15 bg-bone text-ink/70 hover:border-ink/35"
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full border border-bone/30 shadow-inner overflow-hidden relative shrink-0"
                        style={{ backgroundColor: m.swatch }}
                      >
                        <img
                          src={m.textureImg}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="eager"
                        />
                      </span>
                      <span>{t(m.nameKey)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Material Detail Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMaterial.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8"
                >
                  {/* High-Resolution Tactile Wood Loupe */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-sm bg-bone border border-ink/10 text-center shadow-inner relative group">
                    <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full border-4 border-bone shadow-2xl overflow-hidden mb-6 bg-sand ring-1 ring-ink/10">
                      <img
                        src={activeMaterial.textureImg}
                        alt={`${t(activeMaterial.nameKey)} wood grain texture`}
                        className="w-full h-full object-cover object-center group-hover:scale-115 transition-transform duration-700 ease-out"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-depth/20 via-transparent to-white/10 pointer-events-none" />
                    </div>

                    <span className="text-[0.58rem] uppercase tracking-[0.24em] text-ink/45 bg-sand/60 px-3 py-1 rounded-full border border-ink/8 mb-3">
                      Authentic Timber Grain · 100% Solid
                    </span>

                    <h3 className="font-heading text-2xl sm:text-3xl font-light text-ink">
                      {t(activeMaterial.nameKey)}
                    </h3>
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-bronze mt-1">
                      {t(activeMaterial.originKey)}
                    </p>
                  </div>

                  {/* Material Specs */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-[0.24em] text-ink/45 mb-1.5">
                        {t("materials.densityLabel")}
                      </p>
                      <p className="text-base text-ink font-medium">
                        {t(activeMaterial.densityKey)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[0.62rem] uppercase tracking-[0.24em] text-ink/45 mb-1.5">
                        {t("materials.charLabel")}
                      </p>
                      <p className="text-base text-ink/75 leading-relaxed font-light">
                        {t(activeMaterial.charKey)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[0.62rem] uppercase tracking-[0.24em] text-ink/45 mb-1.5">
                        {t("materials.bestLabel")}
                      </p>
                      <p className="text-base text-ink/75 leading-relaxed font-light">
                        {t(activeMaterial.bestKey)}
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => openConsultation({ format: "showroom" })}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-bronze hover:text-bronze-dark font-medium transition-colors cursor-pointer"
                      >
                        <span>{t("materials.viewInShowroom")}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </section>

        {/* 4 In-House Craftsmanship Pillars */}
        <section className="mx-auto max-w-[1400px] px-6 md:px-10 mb-28 md:mb-36">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <p className="text-bronze text-[0.68rem] uppercase tracking-[0.34em] mb-3">
                {t("materials.standardsEyebrow")}
              </p>
              <h2 className="font-heading font-light text-ink text-3xl sm:text-5xl leading-[1.06]">
                {t("materials.standardsTitle")}
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map(({ icon: Icon, titleKey, descKey }, idx) => (
              <Reveal key={titleKey} delay={idx * 0.07}>
                <div className="p-7 rounded-sm bg-bone border border-ink/8 h-full flex flex-col justify-between space-y-4 hover:border-brass/40 transition-colors shadow-sm">
                  <div>
                    <div className="h-11 w-11 rounded-full bg-sand/60 text-bronze flex items-center justify-center mb-5 shadow-inner">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading text-2xl font-light text-ink mb-2">
                      {t(titleKey)}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink/65 leading-relaxed font-light">
                      {t(descKey)}
                    </p>
                  </div>
                  <span className="text-[0.6rem] uppercase tracking-[0.24em] text-ink/35">
                    0{idx + 1} · Standard
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Bottom CTA Card */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
          <div className="bg-depth text-bone rounded-sm p-6 sm:p-10 md:p-16 relative overflow-hidden text-center shadow-2xl">
            <Reveal>
              <p className="text-brass text-[0.66rem] sm:text-[0.68rem] uppercase tracking-[0.38em] mb-3 sm:mb-4">
                {t("materials.touchEyebrow")}
              </p>
              <h2 className="font-heading font-light text-2xl sm:text-4xl lg:text-6xl text-bone max-w-3xl mx-auto leading-[1.1]">
                {t("materials.touchTitle")}
              </h2>
              <p className="mt-4 sm:mt-6 text-bone/70 text-sm sm:text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed">
                {t("materials.touchSubtitle")}
              </p>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
                <button
                  type="button"
                  onClick={() => openConsultation({ format: "showroom" })}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brass text-depth hover:bg-bone px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-medium tracking-wide transition-colors shadow-lg cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{t("materials.bookShowroomTour")}</span>
                </button>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-bone/25 text-bone hover:border-brass hover:text-brass px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-light tracking-wide transition-colors"
                >
                  <span>{t("cta.whatsappUs")} · {PHONE_DISPLAY}</span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
