import { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, Clock, Hammer, Layers, Maximize2, ArrowRight, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHighZoom, setIsHighZoom] = useState(false);

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
      if (e.key === "Escape") {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          onClose();
        }
      }
      if (e.key === "ArrowLeft" && hasPrev) handlePrev();
      if (e.key === "ArrowRight" && hasNext) handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose, hasPrev, hasNext, handlePrev, handleNext, isLightboxOpen]);

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
                <div 
                  onClick={() => {
                    setIsHighZoom(false);
                    setIsLightboxOpen(true);
                  }}
                  className="relative aspect-[4/3] rounded-sm overflow-hidden bg-sand shadow-inner border border-ink/10 group cursor-zoom-in select-none"
                  title={lang === "bn" ? "কাঠের ফিনিশ ও গ্রেইন বড় করে দেখুন" : "Click to inspect timber grain and joinery"}
                >
                  <img
                    src={product.img}
                    alt={title}
                    className="h-full w-full object-cover object-left-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-depth/35 via-transparent to-transparent pointer-events-none" />

                  {/* Inspect Grain Lightbox Trigger */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsHighZoom(false);
                      setIsLightboxOpen(true);
                    }}
                    className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 bg-bone/95 backdrop-blur-md text-ink text-xs font-medium px-2.5 py-1 rounded-sm shadow-md hover:bg-bone hover:text-bronze transition-all cursor-pointer border border-ink/10"
                    title={lang === "bn" ? "কাঠের ফিনিশ ও গ্রেইন বড় করে দেখুন" : "Inspect timber grain and joinery"}
                  >
                    <ZoomIn className="h-3.5 w-3.5 text-bronze" />
                    <span>{lang === "bn" ? "গ্রেইন দেখুন" : "Inspect Grain"}</span>
                  </button>

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
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-bone/90 hover:bg-bone text-ink shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer z-10"
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
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-bone/90 hover:bg-bone text-ink shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer z-10"
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

        {/* Fullscreen Wood Grain Lightbox */}
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[150] flex flex-col justify-between bg-depth/95 backdrop-blur-xl p-4 sm:p-6 md:p-8 select-none"
            >
              {/* Lightbox Header */}
              <div className="flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-brass/20 text-brass border border-brass/35 text-xs uppercase tracking-wider font-semibold">
                    {timber}
                  </span>
                  <h3 className="font-heading font-light text-bone text-lg sm:text-2xl truncate max-w-[50vw]">
                    {title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsHighZoom(!isHighZoom)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-bone/15 hover:bg-bone/25 text-bone border border-bone/25 text-xs font-medium tracking-wide transition-colors cursor-pointer"
                  >
                    {isHighZoom ? (
                      <>
                        <ZoomOut className="h-3.5 w-3.5 text-brass" />
                        <span>{lang === "bn" ? "১× ভিউ" : "Reset Zoom"}</span>
                      </>
                    ) : (
                      <>
                        <ZoomIn className="h-3.5 w-3.5 text-brass" />
                        <span>{lang === "bn" ? "২× বড় করুন" : "2× Close-up"}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(false)}
                    className="p-2 rounded-full text-bone/75 hover:text-bone hover:bg-bone/15 transition-colors cursor-pointer"
                    aria-label="Close lightbox"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Lightbox Image Stage with Zoom */}
              <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
                {/* Previous Piece Arrow */}
                {hasPrev && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous piece"
                    className="absolute left-2 sm:left-6 z-20 h-11 w-11 rounded-full bg-depth/80 hover:bg-brass hover:text-depth text-bone border border-brass/40 flex items-center justify-center shadow-2xl transition-all cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}

                <div 
                  onClick={() => setIsHighZoom(!isHighZoom)}
                  className={`relative max-w-full max-h-[72vh] flex items-center justify-center transition-transform duration-500 ease-out ${
                    isHighZoom ? "scale-[1.85] cursor-zoom-out" : "scale-100 cursor-zoom-in"
                  }`}
                >
                  <img
                    src={product.img}
                    alt={title}
                    className="max-h-[70vh] w-auto max-w-full object-contain rounded-sm shadow-2xl border border-bone/15"
                  />
                </div>

                {/* Next Piece Arrow */}
                {hasNext && (
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next piece"
                    className="absolute right-2 sm:right-6 z-20 h-11 w-11 rounded-full bg-depth/80 hover:bg-brass hover:text-depth text-bone border border-brass/40 flex items-center justify-center shadow-2xl transition-all cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Lightbox Footer Note */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-bone/70 z-20 border-t border-bone/15 pt-3">
                <p className="font-light">
                  {lang === "bn"
                    ? "শতভাগ অকৃত্রিম সেগুন ও আখরোট কাঠের প্রাকৃতিক গ্রেইন এবং মাস্টার হ্যান্ড-কার্ভিং জয়েন্ট ডিটেইল।"
                    : "100% Solid Kiln-Dried Natural Timber · Hand-chiselled mortise & tenon joinery detail."}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-brass font-medium">৳{product.price.toLocaleString(lang === "bn" ? "bn-BD" : "en-BD")}</span>
                  <span>·</span>
                  <span className="font-mono text-bone/60">{currentIndex + 1} of {products.length}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
