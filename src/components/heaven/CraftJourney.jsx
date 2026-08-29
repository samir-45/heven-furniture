import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Image } from "@/components/ui/image";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { IMAGES } from "./constants";

const chapterKeys = ["c1", "c2", "c3", "c4"];
const chapterImgs = [IMAGES.showroom, IMAGES.bespokeDetail, IMAGES.bespoke, IMAGES.living];
const chapterAlts = [
  "The Heaven Furniture Mart showroom where consultations begin",
  "A close detail of a hand-finished bespoke furniture joint",
  "A craftsman chiselling a fine walnut joint in the atelier",
  "A finished bespoke living room installed in a client's home",
];

export default function CraftJourney() {
  const { t } = useLang();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section
      id="journey"
      className="scroll-mt-24 bg-depth text-bone relative"
      ref={ref}
      style={{ height: `${chapterKeys.length * 75}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-start pt-20 md:pt-24">
        <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10 mb-6 md:mb-8">
          <Reveal>
            <p className="text-brass text-[0.68rem] uppercase tracking-[0.34em] mb-4">
              {t("journey.eyebrow")}
            </p>
            <h2 className="font-heading font-light text-4xl md:text-6xl leading-[1.04] max-w-2xl">
              {t("journey.title")}
            </h2>
          </Reveal>
        </div>

        <motion.div style={{ x }} className="flex gap-6 md:gap-10 px-6 md:px-10 will-change-transform">
          {chapterKeys.map((ck, i) => (
            <article
              key={ck}
              className="relative shrink-0 w-[82vw] sm:w-[60vw] md:w-[44vw] lg:w-[34vw] h-[54vh] md:h-[58vh] overflow-hidden rounded-sm bg-cocoa"
            >
              <Image
                src={chapterImgs[i]}
                alt={chapterAlts[i]}
                className="h-full w-full"
                fittingType="fill"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-depth/90 via-depth/30 to-depth/10" />
              <div className="absolute top-6 left-6 md:top-8 md:left-8 font-heading text-bone/80 text-4xl md:text-5xl font-light">
                0{i + 1}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10">
                <p className="text-brass text-[0.62rem] uppercase tracking-[0.28em] mb-3">
                  {t(`journey.${ck}.eyebrow`)}
                </p>
                <h3 className="font-heading font-light text-bone text-2xl md:text-4xl leading-[1.1] mb-3">
                  {t(`journey.${ck}.title`)}
                </h3>
                <p className="text-bone/70 text-sm md:text-base leading-relaxed font-light max-w-md">
                  {t(`journey.${ck}.desc`)}
                </p>
              </div>
            </article>
          ))}
        </motion.div>

        {/* Progress indicator */}
        <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10 mt-8">
          <div className="h-px w-full bg-bone/15 relative overflow-hidden">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="absolute inset-y-0 left-0 w-full bg-brass origin-left"
            />
          </div>
        </div>
      </div>
    </section>
  );
}