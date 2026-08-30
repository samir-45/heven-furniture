import { useState, useEffect } from "react";
import { Play, ArrowUpRight, X, MessageCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Image } from "@/components/ui/image";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { useConsultation } from "./ConsultationContext";
import { SHOWROOM_VIDEOS, SOCIAL, ytThumb, WHATSAPP_URL } from "./constants";

export default function Showroom() {
  const { t } = useLang();
  const { openConsultation } = useConsultation();
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  return (
    <section id="showroom" className="scroll-mt-24 bg-sand/60 py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <Reveal>
            <p className="text-bronze text-[0.68rem] uppercase tracking-[0.34em] mb-5">
              {t("showroom.eyebrow")}
            </p>
            <h2 className="font-heading font-light text-ink text-4xl md:text-5xl leading-[1.08] max-w-xl">
              {t("showroom.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href={SOCIAL.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ink/70 hover:text-bronze transition-colors text-sm"
            >
              {t("showroom.youtube")} <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {SHOWROOM_VIDEOS.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 0.08}>
              <button
                type="button"
                onClick={() => setActiveVideo(v)}
                data-cursor="view"
                className="group block text-left w-full cursor-pointer"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-sand">
                  <div className="absolute inset-0 transition-transform duration-1100 ease-out group-hover:scale-[1.05]">
                    <Image
                      src={ytThumb(v.id)}
                      alt={`${v.title} — Heaven Furniture Mart`}
                      className="h-full w-full"
                      fittingType="fill"
                    />
                  </div>
                  <div className="absolute inset-0 bg-depth/20 transition-colors duration-500 group-hover:bg-depth/35" />
                  <div className="pointer-events-none absolute inset-0 border border-brass/0 group-hover:border-brass/55 transition-colors duration-500 rounded-sm" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bone/90 text-depth shadow-lg transition-all duration-500 group-hover:bg-brass group-hover:text-depth group-hover:scale-105">
                      <Play className="h-6 w-6 ml-0.5 fill-current" />
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 text-[0.58rem] uppercase tracking-[0.22em] text-bone/90 bg-depth/55 px-2.5 py-1 rounded-sm">
                    {v.kind === "short" ? t("showroom.short") : t("showroom.tour")}
                  </span>
                </div>
                <h3 className="mt-4 font-heading font-light text-ink text-xl md:text-2xl group-hover:text-bronze transition-colors">
                  {v.title}
                </h3>
                <p className="mt-1 inline-flex items-center gap-1.5 text-bronze text-[0.72rem] uppercase tracking-[0.2em]">
                  {t("showroom.watch")} <Play className="h-3 w-3 fill-current" />
                </p>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* In-Page Cinema Lightbox Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Dark Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setActiveVideo(null)}
              className="fixed inset-0 bg-depth/90 backdrop-blur-md cursor-pointer"
            />

            {/* Cinema Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-4xl bg-depth text-bone rounded-sm overflow-hidden border border-brass/30 shadow-2xl"
            >
              {/* Header Bar */}
              <div className="px-6 py-4 border-b border-bone/10 flex items-center justify-between">
                <div>
                  <span className="text-[0.6rem] uppercase tracking-[0.26em] text-brass">
                    {t("showroom.eyebrow")}
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-light text-bone truncate max-w-md">
                    {activeVideo.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="p-2 -mr-2 rounded-full text-bone/60 hover:text-bone hover:bg-bone/10 transition-colors"
                  aria-label="Close cinema player"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Responsive Video Frame */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Action Bar */}
              <div className="p-5 sm:p-6 bg-depth border-t border-bone/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-bone/60 leading-relaxed max-w-md">
                  {t("showroom.cinemaDesc")}
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const title = activeVideo.title;
                      setActiveVideo(null);
                      openConsultation({ scope: "living" });
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brass text-depth font-medium text-xs uppercase tracking-wider px-5 py-3 hover:bg-bone transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{t("showroom.bookTour")}</span>
                  </button>
                  <a
                    href={`${WHATSAPP_URL}?text=${encodeURIComponent(
                      `Hello Heaven Furniture Mart, I just watched your "${activeVideo.title}" video and would like to inquire about this piece.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-bone/25 text-bone hover:border-brass hover:text-brass text-xs uppercase tracking-wider px-5 py-3 transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>{t("showroom.enquirePiece")}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}