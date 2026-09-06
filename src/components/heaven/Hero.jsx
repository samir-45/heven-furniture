import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Hammer, CheckCircle2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import WhatsAppButton from "./WhatsAppButton";
import { useLang } from "./LanguageProvider";
import { IMAGES } from "./constants";

export default function Hero() {
  const { t, lang } = useLang();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 140]);
  const scale = useTransform(scrollY, [0, 700], [1, 1.12]);

  const handleExploreClick = () => {
    const el = document.getElementById("collections");
    if (el) {
      if (window.lenis) {
        window.lenis.scrollTo(el, { offset: 0, duration: 1.0 });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <section id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-depth">
      <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
        <Image
          src={IMAGES.hero}
          alt="A bespoke luxury living room handcrafted by Heaven Furniture Mart, bathed in golden-hour light"
          className="h-full w-full"
          fittingType="fill"
        />
      </motion.div>

      {/* Legibility veils — keep WCAG-AA contrast for the bottom-anchored copy */}
      <div className="absolute inset-0 bg-gradient-to-t from-depth/95 via-depth/45 to-depth/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-depth/75 via-depth/25 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 h-full flex flex-col justify-end pb-16 sm:pb-20 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          {/* Clear Category/Atelier Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bone/10 backdrop-blur-md border border-brass/40 text-brass text-xs uppercase tracking-[0.18em] font-semibold mb-4 sm:mb-6">
            <Hammer className="h-3.5 w-3.5 text-brass shrink-0" />
            <span>{t("hero.tagline")}</span>
          </div>

          <h1 className="font-heading font-light text-bone text-[2.2rem] leading-[1.12] sm:text-5xl md:text-6xl lg:text-[4.4rem] tracking-[-0.01em]">
            {t("hero.title1")}
            <br />
            {t("hero.title2")}
          </h1>
          <p className="mt-4 sm:mt-6 text-bone/90 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-light">
            {t("hero.subtitle")}
          </p>

          {/* Primary & Secondary Action Center */}
          <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
            <WhatsAppButton>{t("cta.consultation")}</WhatsAppButton>
            <button
              type="button"
              onClick={handleExploreClick}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-bone/35 bg-bone/10 backdrop-blur-md text-bone hover:border-brass hover:text-brass hover:bg-depth/60 transition-all duration-300 px-6 py-3.5 text-xs uppercase tracking-wider font-medium cursor-pointer group shadow-sm"
            >
              <span>{lang === "bn" ? "সংগ্রহসমূহ দেখুন" : "Explore Collections"}</span>
              <ArrowDown className="h-3.5 w-3.5 text-brass group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Immediate Trust & Value Pillars */}
          <div className="mt-6 sm:mt-8 pt-5 border-t border-bone/15 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-bone/85 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-brass shrink-0" />
              <span>{t("hero.trust1")}</span>
            </span>
            <span className="hidden sm:inline text-bone/30">•</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-brass shrink-0" />
              <span>{t("hero.trust2")}</span>
            </span>
            <span className="hidden md:inline text-bone/30">•</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-brass shrink-0" />
              <span>{t("hero.trust3")}</span>
            </span>
          </div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={handleExploreClick}
        aria-label={t("hero.scroll")}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-bone/70 hover:text-brass transition-colors cursor-pointer group"
      >
        <span className="text-[10px] uppercase tracking-[0.22em] font-medium group-hover:text-brass transition-colors">
          {t("hero.scroll")}
        </span>
        <div className="relative h-10 w-[1.5px] bg-bone/25 rounded-full overflow-hidden">
          <motion.div
            animate={{
              y: ["-100%", "200%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-1/2 bg-brass rounded-full"
          />
        </div>
      </button>
    </section>
  );
}