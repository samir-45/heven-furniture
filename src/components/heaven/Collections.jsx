import { useRef, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, Sparkles, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal";
import ProductDetailModal from "./ProductDetailModal";
import { useLang } from "./LanguageProvider";
import { PRODUCTS, CATEGORIES } from "./products";

export default function Collections() {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const trackRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const displayedProducts = useMemo(() => {
    if (activeCategory === "all") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.75, 420);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const handleOpen3D = (configCat) => {
    const el = document.getElementById("design");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#design`);
    }
  };

  return (
    <section id="collections" className="scroll-mt-24 bg-bone py-14 sm:py-20 md:py-28 relative">
      {/* Quick View Inspection Modal on Home */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpen3D={handleOpen3D}
      />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <Reveal>
            <p className="text-bronze text-xs sm:text-sm uppercase tracking-[0.22em] font-medium mb-3 sm:mb-4 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("collections.eyebrow")}</span>
            </p>
            <h2 className="font-heading font-light text-ink text-3xl sm:text-4xl md:text-5xl leading-[1.08] max-w-xl">
              {t("collections.title")}
            </h2>
          </Reveal>

          {/* Desktop Swiper Navigation Controls */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.16em] font-semibold text-bronze hover:text-bronze-dark transition-colors mr-3"
            >
              <span>{t("gallery.exploreFull")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              onClick={() => scrollBy(-1)}
              aria-label="Scroll collections left"
              className="h-11 w-11 rounded-full border border-ink/20 text-ink/70 hover:bg-bronze hover:text-bone hover:border-bronze transition-colors flex items-center justify-center cursor-pointer shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Scroll collections right"
              className="h-11 w-11 rounded-full border border-ink/20 text-ink/70 hover:bg-bronze hover:text-bone hover:border-bronze transition-colors flex items-center justify-center cursor-pointer shadow-xs"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Fluid Category Filter Tabs (Framer Motion Pill) */}
        <div className="mb-6 sm:mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map((c) => {
            const active = activeCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setActiveCategory(c.id);
                  if (trackRef.current) {
                    trackRef.current.scrollTo({ left: 0, behavior: "smooth" });
                  }
                }}
                className={`relative px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-colors shrink-0 cursor-pointer ${
                  active ? "text-bone" : "text-ink/75 hover:text-ink bg-sand/50 border border-ink/10"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="homeGalleryTab"
                    className="absolute inset-0 bg-depth rounded-full shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">
                  {lang === "bn" ? c.labelBn : c.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Swiper Touch/Drag Carousel Track */}
      <div
        ref={trackRef}
        className="no-scrollbar flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 md:px-10 scroll-pl-4 sm:scroll-pl-6 md:scroll-pl-10 pb-4"
      >
        <AnimatePresence mode="popLayout">
          {displayedProducts.map((p, i) => {
            const title = lang === "bn" ? p.titleBn : p.titleEn;
            const desc = lang === "bn" ? p.descBn : p.descEn;
            const timber = lang === "bn" ? p.timberLabelBn : p.timberLabelEn;
            return (
              <motion.div
                key={p.id}
                layout="position"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedProduct(p)}
                className="group relative snap-start shrink-0 w-[84vw] sm:w-[350px] lg:w-[390px] flex flex-col bg-bone rounded-sm border border-ink/10 overflow-hidden shadow-sm hover:shadow-xl hover:border-brass/35 transition-all duration-300 cursor-pointer"
              >
                {/* Visual */}
                <div className="relative aspect-[4/3] overflow-hidden bg-sand select-none">
                  <img
                    src={p.img}
                    alt={title}
                    className="h-full w-full object-cover object-left-top group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-depth/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Timber Species Floating Badge */}
                  <span className="absolute top-3 left-3 bg-depth/90 backdrop-blur-md text-bone border border-brass/35 text-xs font-semibold px-3 py-1 rounded-sm shadow-sm">
                    {timber}
                  </span>

                  {/* Quick View Hover Pill */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="inline-flex items-center gap-2 bg-bone/95 backdrop-blur-md text-ink px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
                      <Eye className="h-3.5 w-3.5 text-bronze" />
                      <span>{t("gallery.viewDetails")}</span>
                    </span>
                  </div>

                  {/* Price Tag */}
                  <span className="absolute bottom-3 right-3 bg-bone/95 backdrop-blur-md text-ink font-heading text-sm font-semibold px-3 py-1 rounded-sm shadow-sm">
                    ৳{p.price.toLocaleString(lang === "bn" ? "bn-BD" : "en-BD")}
                  </span>
                </div>

                {/* Content Box */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-heading font-light text-xl sm:text-2xl text-ink group-hover:text-bronze transition-colors">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-ink/75 line-clamp-2 leading-relaxed font-light">
                      {desc}
                    </p>
                  </div>

                  {/* Card Footer: Dimensions & Elegant View Details link */}
                  <div className="pt-3 border-t border-ink/10 flex items-center justify-between">
                    <span className="text-xs text-ink/60 font-light">
                      {p.dimensions ? `${p.dimensions.w} × ${p.dimensions.d} × ${p.dimensions.h} cm` : timber}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-bronze group-hover:text-ink font-medium transition-colors">
                      <span>{t("gallery.viewDetails")}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Connected Deep-Link Banner to /gallery */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 mt-8 sm:mt-12">
        <div className="p-6 sm:p-8 rounded-sm bg-sand/50 border border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
          <div>
            <span className="text-xs uppercase tracking-[0.16em] text-bronze font-semibold block mb-1">
              {lang === "bn" ? "সম্পূর্ণ ক্যাটালগ উন্মুক্ত" : "Full Catalog Available"}
            </span>
            <h4 className="font-heading text-xl sm:text-2xl font-light text-ink">
              {lang === "bn" ? "১২+ টি হস্তনির্মিত আসবাব ও কাস্টমাইজেশন সুবিধা" : "Explore All 12+ Signature Atelier Pieces & Custom Timbers"}
            </h4>
          </div>

          <Link
            to="/gallery"
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-depth text-bone hover:bg-brass hover:text-depth px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-medium tracking-wide transition-all shadow-md shrink-0 cursor-pointer"
          >
            <span>{t("gallery.exploreFull")}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}