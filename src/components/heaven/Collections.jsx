import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { IMAGES, WHATSAPP_URL } from "./constants";

const collectionKeys = ["c1", "c2", "c3", "c4", "c5"];
const collectionImgs = [IMAGES.living, IMAGES.bedroom, IMAGES.dining, IMAGES.office, IMAGES.custom];

export default function Collections() {
  const { t } = useLang();
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.8, 420);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section id="collections" className="scroll-mt-24 bg-bone py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
        <div className="flex items-end justify-between gap-6 mb-8 sm:mb-10 md:mb-14">
          <Reveal>
            <p className="text-bronze text-[0.66rem] sm:text-[0.68rem] uppercase tracking-[0.34em] mb-3 sm:mb-5">
              {t("collections.eyebrow")}
            </p>
            <h2 className="font-heading font-light text-ink text-3xl sm:text-4xl md:text-5xl leading-[1.08] max-w-xl">
              {t("collections.title")}
            </h2>
          </Reveal>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Scroll collections left"
              className="h-11 w-11 rounded-full border border-ink/20 text-ink/70 hover:bg-bronze hover:text-bone hover:border-bronze transition-colors flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Scroll collections right"
              className="h-11 w-11 rounded-full border border-ink/20 text-ink/70 hover:bg-bronze hover:text-bone hover:border-bronze transition-colors flex items-center justify-center cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 md:px-10 scroll-pl-4 sm:scroll-pl-6 md:scroll-pl-10 pb-2"
      >
        {collectionKeys.map((ck, i) => {
          const collectionName = t(`collections.${ck}.name`);
          const waLink = `${WHATSAPP_URL}?text=${encodeURIComponent(
            t("collections.inquiryMsg", { name: collectionName })
          )}`;
          return (
            <a
              key={ck}
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="view"
              className="group relative snap-start shrink-0 w-[82vw] sm:w-[340px] lg:w-[380px] block"
            >
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand">
              <div className="absolute inset-0 transition-transform duration-1100 ease-out group-hover:scale-[1.06]">
                <Image
                  src={collectionImgs[i]}
                  alt={`${t(`collections.${ck}.name`)} — bespoke furniture by Heaven Furniture Mart`}
                  className="h-full w-full object-cover object-left-top"
                  fittingType="fill"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-depth/80 via-depth/10 to-transparent" />
              <div className="pointer-events-none absolute inset-0 border border-brass/0 group-hover:border-brass/55 transition-colors duration-500 rounded-sm" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <h3 className="font-heading font-light text-bone text-2xl md:text-3xl">
                  {t(`collections.${ck}.name`)}
                </h3>
                <p className="mt-1 text-bone/75 text-xs sm:text-sm leading-relaxed max-w-[16rem]">
                  {t(`collections.${ck}.line`)}
                </p>
                <span className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 text-brass text-[0.68rem] sm:text-[0.72rem] uppercase tracking-[0.2em] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:-translate-y-1 sm:group-hover:translate-y-0 transition-all duration-500">
                  {t("collections.enquire")} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
            <span className="mt-2.5 sm:mt-3 block text-[0.6rem] sm:text-[0.62rem] uppercase tracking-[0.24em] text-ink/35">
              0{i + 1} — {t("collections.label")}
            </span>
          </a>
        );
      })}
      </div>
    </section>
  );
}