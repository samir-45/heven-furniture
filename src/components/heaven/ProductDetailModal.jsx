import { useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, Clock, Hammer, Layers, Maximize2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "./LanguageProvider";
import { WHATSAPP_URL } from "./constants";

export default function ProductDetailModal({ 
  product, 
  onClose, 
  onOpen3D,
  products = [],
  onSelectProduct
}) {
  const { lang, t } = useLang();

  const currentIndex = useMemo(() => {
    if (!product || !products?.length) return -1;
    return products.findIndex((p) => p.id === product.id);
  }, [product, products]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < products.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev && onSelectProduct) {
      onSelectProduct(products[currentIndex - 1]);
    }
  }, [hasPrev, onSelectProduct, products, currentIndex]);

  const handleNext = useCallback(() => {
    if (hasNext && onSelectProduct) {
      onSelectProduct(products[currentIndex + 1]);
    }
  }, [hasNext, onSelectProduct, products, currentIndex]);

  // Keyboard navigation: Escape to close, Left/Right arrows to flip
  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) handlePrev();
      if (e.key === "ArrowRight" && hasNext) handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose, hasPrev, hasNext, handlePrev, handleNext]);

  if (!product) return null;

  const title = lang === "bn" ? product.titleBn : product.titleEn;
  const desc = lang === "bn" ? product.descBn : product.descEn;
  const timber = lang === "bn" ? product.timberLabelBn : product.timberLabelEn;
  const leadTime = lang === "bn" ? product.leadTimeBn : product.leadTimeEn;
  const joinery = lang === "bn" ? product.joineryBn : product.joineryEn;
  const finish = lang === "bn" ? product.finishBn : product.finishEn;

  const waMsg = `${WHATSAPP_URL}?text=${encodeURIComponent(
    lang === "bn"
      ? `আসসালামু আলাইকুম হেভেন ফার্নিচার মার্ট, আমি আপনাদের "${title}" (দাম: ৳${product.price.toLocaleString("bn-BD")}) সম্পর্কে জানতে ও অর্ডার করতে চাই।`
      : `Hello Heaven Furniture Mart, I would like to enquire about the "${title}" (Starting at ৳${product.price.toLocaleString("en-BD")}). Could you share more details on bespoke ordering?`
  )}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3.5 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-depth/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-4xl bg-bone text-ink rounded-sm overflow-hidden border border-brass/35 shadow-2xl my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Bar with Navigation Controls */}
          <div className="shrink-0 px-5 sm:px-8 py-3.5 sm:py-4 border-b border-ink/10 flex items-center justify-between bg-sand/30">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-bronze" />
              <span className="text-xs uppercase tracking-[0.16em] text-bronze font-semibold">
                {lang === "bn" ? "আসবাব বিবরণী" : "Atelier Piece Specification"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {products.length > 1 && (
                <div className="flex items-center gap-1 bg-bone/80 border border-ink/10 rounded-full px-2 py-0.5 mr-1 sm:mr-2 shadow-xs">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={!hasPrev}
                    aria-label="Previous piece"
                    className="p-1 rounded-full text-ink/70 hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    title={lang === "bn" ? "পূর্ববর্তী আসবাব (Left Arrow)" : "Previous piece (Left Arrow)"}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="text-[11px] font-mono font-medium text-ink/70 px-1 tracking-wider select-none">
                    {currentIndex + 1} / {products.length}
                  </span>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!hasNext}
                    aria-label="Next piece"
                    className="p-1 rounded-full text-ink/70 hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    title={lang === "bn" ? "পরবর্তী আসবাব (Right Arrow)" : "Next piece (Right Arrow)"}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-ink/60 hover:text-ink hover:bg-sand/60 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 sm:space-y-8">
            <div className="grid md:grid-cols-12 gap-6 sm:gap-8 items-center">
              {/* Product Visual */}
              <div className="md:col-span-6">
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-sand shadow-inner border border-ink/10 group">
                  <img
                    src={product.img}
                    alt={title}
                    className="h-full w-full object-cover object-left-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-depth/35 via-transparent to-transparent pointer-events-none" />

                  {/* Floating In-Image Arrow Controls for Quick Touch/Click */}
                  {products.length > 1 && (
                    <>
                      {hasPrev && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrev();
                          }}
                          aria-label="Previous piece"
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-bone/90 hover:bg-bone text-ink shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                      )}
                      {hasNext && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                          }}
                          aria-label="Next piece"
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-bone/90 hover:bg-bone text-ink shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </>
                  )}

                  <span className="absolute bottom-3 left-3 bg-depth/90 text-bone text-xs font-semibold px-3 py-1 rounded-sm border border-brass/30">
                    ৳{product.price.toLocaleString(lang === "bn" ? "bn-BD" : "en-BD")}
                  </span>
                </div>
              </div>

              {/* Product Header & Pricing */}
              <div className="md:col-span-6 space-y-3 sm:space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-brass/15 border border-brass/30 text-xs font-medium text-bronze uppercase tracking-wider">
                  {timber}
                </span>

                <h2 className="font-heading font-light text-2xl sm:text-3xl lg:text-4xl text-ink leading-tight">
                  {title}
                </h2>

                <p className="text-sm sm:text-base text-ink/80 leading-relaxed font-light">
                  {desc}
                </p>

                <div className="pt-2">
                  <span className="text-xs uppercase tracking-wider text-ink/60 block font-medium">
                    {lang === "bn" ? "আনুমানিক প্রস্তুত মূল্য:" : "Bespoke Price Guidance:"}
                  </span>
                  <p className="text-2xl sm:text-3xl font-heading font-light text-bronze mt-0.5">
                    ৳{product.price.toLocaleString(lang === "bn" ? "bn-BD" : "en-BD")}
                    <span className="text-xs font-sans text-ink/55 ml-2 font-normal">
                      {lang === "bn" ? "(কাস্টম মাপ অনুযায়ী চূড়ান্ত হবে)" : "(Subject to custom sizing)"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Specifications Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-sm bg-sand/35 border border-ink/10 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-xs text-ink/65 font-medium uppercase tracking-wider">
                  <Maximize2 className="h-3.5 w-3.5 text-bronze" />
                  {lang === "bn" ? "মাপ (W×D×H)" : "Dimensions"}
                </span>
                <p className="font-semibold text-ink">{product.dims}</p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-xs text-ink/65 font-medium uppercase tracking-wider">
                  <Clock className="h-3.5 w-3.5 text-bronze" />
                  {lang === "bn" ? "ডেলিভারি সময়" : "Lead Time"}
                </span>
                <p className="font-semibold text-ink">{leadTime}</p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-xs text-ink/65 font-medium uppercase tracking-wider">
                  <Hammer className="h-3.5 w-3.5 text-bronze" />
                  {lang === "bn" ? "জোড়াই পদ্ধতি" : "Joinery"}
                </span>
                <p className="font-semibold text-ink truncate" title={joinery}>{joinery}</p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-xs text-ink/65 font-medium uppercase tracking-wider">
                  <Layers className="h-3.5 w-3.5 text-bronze" />
                  {lang === "bn" ? "পলিশ ও ফেব্রিক" : "Finish"}
                </span>
                <p className="font-semibold text-ink truncate" title={finish}>{finish}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="shrink-0 p-5 sm:p-7 bg-bone/98 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4">
            <p className="text-xs text-ink/65 text-center sm:text-left font-medium">
              {t("cta.noObligation")} · {lang === "bn" ? "সরাসরি শোরুম ব্যবস্থাপকের সাথে কথা বলুন" : "Direct Showroom Assistance"}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
              {onOpen3D && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpen3D(product.configCat);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 hover:border-brass text-ink hover:text-bronze px-5 sm:px-6 py-3 text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-bronze" />
                  <span>{lang === "bn" ? "৩ডি স্টুডিওতে দেখুন" : "Customize in 3D"}</span>
                </button>
              )}

              <a
                href={waMsg}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-bronze text-bone hover:bg-bronze-dark rounded-full px-6 sm:px-7 py-3.5 text-xs sm:text-sm font-medium tracking-wide shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current shrink-0" />
                <span>{lang === "bn" ? "হোয়াটসঅ্যাপে অর্ডার করুন" : "Inquire via WhatsApp"}</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
