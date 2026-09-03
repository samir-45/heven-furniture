import { motion, useScroll, useTransform } from "framer-motion";
import { Image } from "@/components/ui/image";
import WhatsAppButton from "./WhatsAppButton";
import { useLang } from "./LanguageProvider";
import { IMAGES, FOUNDED, FOUNDER } from "./constants";

export default function Hero() {
  const { t } = useLang();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 140]);
  const scale = useTransform(scrollY, [0, 700], [1, 1.12]);

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
      <div className="absolute inset-0 bg-gradient-to-t from-depth/90 via-depth/40 to-depth/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-depth/70 via-depth/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 h-full flex flex-col justify-end pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="text-brass text-xs sm:text-sm uppercase tracking-[0.24em] font-medium mb-5 md:mb-7">
            {t("hero.tagline")}
          </p>
          <h1 className="font-heading font-light text-bone text-[2.4rem] leading-[1.12] sm:text-5xl md:text-6xl lg:text-[4.6rem] tracking-[-0.01em]">
            {t("hero.title1")}
            <br />
            {t("hero.title2")}
          </h1>
          <p className="mt-6 md:mt-8 text-bone/90 text-base md:text-lg max-w-md leading-relaxed font-light">
            {t("hero.subtitle")}
          </p>
          <div className="mt-9 md:mt-11">
            <WhatsAppButton>{t("cta.consultation")}</WhatsAppButton>
          </div>
          <p className="mt-6 md:mt-8 text-bone/75 text-xs sm:text-sm uppercase tracking-[0.16em] font-medium">
            {t("hero.founded", { year: FOUNDED, founder: FOUNDER })}
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-bone/70">
        <span className="text-xs uppercase tracking-[0.2em] font-medium">{t("hero.scroll")}</span>
        <span className="block h-10 w-px bg-bone/40" />
      </div>
    </section>
  );
}