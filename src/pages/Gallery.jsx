import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Phone, 
  Eye, 
  Maximize2, 
  Clock, 
  SlidersHorizontal, 
  RotateCcw,
  Search,
  X
} from "lucide-react";
import Nav from "@/components/heaven/Nav";
import Footer from "@/components/heaven/Footer";
import FloatingWhatsApp from "@/components/heaven/FloatingWhatsApp";
import ConsultationDrawer from "@/components/heaven/ConsultationDrawer";
import ProductDetailModal from "@/components/heaven/ProductDetailModal";
import WhatsAppIcon from "@/components/heaven/WhatsAppIcon";
import Reveal from "@/components/heaven/Reveal";
import { useLang } from "@/components/heaven/LanguageProvider";
import { useConsultation } from "@/components/heaven/ConsultationContext";
import { PRODUCTS, CATEGORIES, TIMBERS } from "@/components/heaven/products";
import { WHATSAPP_URL, PHONE_DISPLAY, PHONE_TEL } from "@/components/heaven/constants";

export default function Gallery() {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const { openConsultation } = useConsultation();

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTimber, setActiveTimber] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState("featured");

  // Category product counts
  const categoryCounts = useMemo(() => {
    const counts = { all: PRODUCTS.length };
    CATEGORIES.forEach((c) => {
      if (c.id !== "all") {
        counts[c.id] = PRODUCTS.filter((p) => p.category === c.id).length;
      }
    });
    return counts;
  }, []);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = PRODUCTS.filter((item) => {
      const matchCat = activeCategory === "all" || item.category === activeCategory;
      const matchTimber = activeTimber === "all" || item.timber === activeTimber;

      const categoryObj = CATEGORIES.find((c) => c.id === item.category);
      const catMatches = categoryObj && (
        categoryObj.labelEn.toLowerCase().includes(query) ||
        categoryObj.labelBn.includes(query)
      );

      const matchQuery =
        !query ||
        item.titleEn.toLowerCase().includes(query) ||
        item.titleBn.includes(query) ||
        item.descEn.toLowerCase().includes(query) ||
        item.descBn.includes(query) ||
        item.timberLabelEn.toLowerCase().includes(query) ||
        item.timberLabelBn.includes(query) ||
        catMatches;

      return matchCat && matchTimber && matchQuery;
    });

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [activeCategory, activeTimber, searchQuery, sortBy]);

  const hasActiveFilters = activeCategory !== "all" || activeTimber !== "all" || Boolean(searchQuery.trim()) || sortBy !== "featured";

  const handleResetFilters = () => {
    setActiveCategory("all");
    setActiveTimber("all");
    setSearchQuery("");
    setSortBy("featured");
  };

  const handleOpen3D = (configCat) => {
    navigate(`/#design`);
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === activeCategory);
  const activeTimberObj = TIMBERS.find((t) => t.id === activeTimber);

  const TIMBER_SWATCHES = {
    all: "bg-ink/30",
    teak: "bg-[#8A5A36]",
    karoi: "bg-[#4A3222]",
    walnut: "bg-[#3D2817]",
    mahogany: "bg-[#5E2B2B]",
  };

  return (
    <div className="min-h-screen bg-bone text-ink selection:bg-brass/30 selection:text-depth">
      <Nav />
      <FloatingWhatsApp />
      <ConsultationDrawer />

      {/* Quick View Inspection Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpen3D={handleOpen3D}
        products={filteredProducts}
        onSelectProduct={setSelectedProduct}
      />

      <main className="pt-24 sm:pt-28 md:pt-36 pb-20 overflow-x-hidden w-full max-w-full">
        {/* Page Hero */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 mb-8 sm:mb-12 md:mb-16">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 sm:pb-8 border-b border-ink/10">
              <div className="max-w-2xl">
                <p className="text-bronze text-xs sm:text-sm uppercase tracking-[0.22em] font-medium mb-3 sm:mb-4 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{t("gallery.eyebrow")}</span>
                </p>
                <h1 className="font-heading font-light text-ink text-3xl sm:text-5xl lg:text-6xl leading-[1.06]">
                  {t("gallery.title")}
                </h1>
                <p className="mt-3 sm:mt-5 text-ink/80 text-base sm:text-lg md:text-xl font-light leading-relaxed">
                  {t("gallery.subtitle")}
                </p>
              </div>

              <div className="shrink-0 flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/20 hover:border-brass text-ink hover:text-bronze px-5 py-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-xs"
                >
                  <Phone className="h-4 w-4 text-bronze" />
                  <span>{PHONE_DISPLAY}</span>
                </a>
                <button
                  type="button"
                  onClick={() => openConsultation({ format: "showroom" })}
                  className="inline-flex items-center gap-2 rounded-full bg-bronze text-bone hover:bg-bronze-dark px-5 py-3 text-xs sm:text-sm font-medium transition-colors shadow-md cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{t("gallery.bookConsultation")}</span>
                </button>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Interactive Filter & Search Control Center */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 mb-8 sm:mb-12">
          <div className="bg-sand/40 border border-ink/10 rounded-sm p-4 sm:p-6 shadow-sm space-y-5">
            {/* Top Toolbar: Search + Sort Controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Prominent Search Bar */}
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    lang === "bn"
                      ? "আসবাবের নাম, কাঠ বা ক্যাটাগরি খুঁজুন (যেমনঃ সেগুন, সোফা, ডাইনিং)..."
                      : "Search by piece name, wood species, or room (e.g. Teak, Sofa, Bed)..."
                  }
                  className="w-full bg-bone border border-ink/15 rounded-full pl-10 pr-10 py-2.5 text-xs sm:text-sm text-ink placeholder:text-ink/45 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 transition-all shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink cursor-pointer p-0.5 rounded-full hover:bg-ink/5"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort Segmented Control */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <span className="text-ink/60 text-[11px] uppercase tracking-wider font-semibold">
                  {lang === "bn" ? "সাজান:" : "Sort:"}
                </span>
                <div className="inline-flex items-center gap-1 bg-bone p-1 rounded-full border border-ink/10 text-xs shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setSortBy("featured")}
                    className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer font-medium ${
                      sortBy === "featured"
                        ? "bg-depth text-bone font-semibold shadow-xs"
                        : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    {lang === "bn" ? "জনপ্রিয়" : "Featured"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy("price-asc")}
                    className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer font-medium ${
                      sortBy === "price-asc"
                        ? "bg-depth text-bone font-semibold shadow-xs"
                        : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    {lang === "bn" ? "মূল্য: কম ↑" : "Price: Low ↑"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy("price-desc")}
                    className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer font-medium ${
                      sortBy === "price-desc"
                        ? "bg-depth text-bone font-semibold shadow-xs"
                        : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    {lang === "bn" ? "মূল্য: বেশি ↓" : "Price: High ↓"}
                  </button>
                </div>
              </div>
            </div>

            {/* Room Category Tabs with Item Count Badges */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-ink/75 font-semibold uppercase tracking-[0.14em]">
                <span className="flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-bronze" />
                  <span>{t("gallery.filterRoom")}</span>
                </span>
                <span className="text-ink/60 font-medium normal-case tracking-normal">
                  {t("gallery.showing", { count: filteredProducts.length })}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {CATEGORIES.map((c) => {
                  const active = activeCategory === c.id;
                  const count = categoryCounts[c.id] ?? 0;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveCategory(c.id)}
                      className={`relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all cursor-pointer ${
                        active
                          ? "text-bone shadow-sm"
                          : "text-ink/75 hover:text-ink bg-bone/80 hover:bg-bone border border-ink/10"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="galleryCat"
                          className="absolute inset-0 bg-depth rounded-full shadow-sm"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">
                        {lang === "bn" ? c.labelBn : c.labelEn}
                      </span>
                      <span
                        className={`relative z-10 text-[10.5px] px-1.5 py-0.2 rounded-full font-semibold tabular-nums ${
                          active
                            ? "bg-bone/20 text-bone"
                            : "bg-ink/8 text-ink/65"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timber Species Selector with Natural Wood Dots */}
            <div className="pt-3 border-t border-ink/10 flex flex-wrap items-center gap-2">
              <span className="text-xs text-ink/70 font-semibold mr-1">
                {t("gallery.filterTimber")}:
              </span>
              {TIMBERS.map((tb) => {
                const active = activeTimber === tb.id;
                const swatchClass = TIMBER_SWATCHES[tb.id] || "bg-ink/30";
                return (
                  <button
                    key={tb.id}
                    type="button"
                    onClick={() => setActiveTimber(tb.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-medium transition-all cursor-pointer ${
                      active
                        ? "bg-brass/20 text-ink border border-brass font-bold shadow-2xs"
                        : "bg-bone/80 text-ink/75 hover:text-ink hover:bg-bone border border-ink/10"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${swatchClass} shrink-0`} />
                    <span>{lang === "bn" ? tb.labelBn : tb.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Filter Tags Bar (1-Click Remove) */}
            {hasActiveFilters && (
              <div className="pt-3 border-t border-ink/10 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-ink/60 font-medium mr-1">
                  {lang === "bn" ? "সক্রিয় ফিল্টার:" : "Active filters:"}
                </span>

                {activeCategory !== "all" && activeCategoryObj && (
                  <button
                    type="button"
                    onClick={() => setActiveCategory("all")}
                    className="inline-flex items-center gap-1.5 bg-bone border border-ink/15 text-ink/85 px-2.5 py-1 rounded-full hover:border-bronze hover:text-bronze transition-colors cursor-pointer"
                  >
                    <span>{lang === "bn" ? activeCategoryObj.labelBn : activeCategoryObj.labelEn}</span>
                    <X className="h-3 w-3 text-ink/50" />
                  </button>
                )}

                {activeTimber !== "all" && activeTimberObj && (
                  <button
                    type="button"
                    onClick={() => setActiveTimber("all")}
                    className="inline-flex items-center gap-1.5 bg-bone border border-ink/15 text-ink/85 px-2.5 py-1 rounded-full hover:border-bronze hover:text-bronze transition-colors cursor-pointer"
                  >
                    <span>{lang === "bn" ? activeTimberObj.labelBn : activeTimberObj.labelEn}</span>
                    <X className="h-3 w-3 text-ink/50" />
                  </button>
                )}

                {Boolean(searchQuery.trim()) && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="inline-flex items-center gap-1.5 bg-bone border border-ink/15 text-ink/85 px-2.5 py-1 rounded-full hover:border-bronze hover:text-bronze transition-colors cursor-pointer"
                  >
                    <span>&ldquo;{searchQuery}&rdquo;</span>
                    <X className="h-3 w-3 text-ink/50" />
                  </button>
                )}

                {sortBy !== "featured" && (
                  <button
                    type="button"
                    onClick={() => setSortBy("featured")}
                    className="inline-flex items-center gap-1.5 bg-bone border border-ink/15 text-ink/85 px-2.5 py-1 rounded-full hover:border-bronze hover:text-bronze transition-colors cursor-pointer"
                  >
                    <span>{sortBy === "price-asc" ? (lang === "bn" ? "মূল্য: কম ↑" : "Price: Low ↑") : (lang === "bn" ? "মূল্য: বেশি ↓" : "Price: High ↓")}</span>
                    <X className="h-3 w-3 text-ink/50" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-bronze hover:underline font-semibold ml-2 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{t("gallery.clearFilters")}</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Product Grid */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-sand/30 rounded-sm border border-ink/10 p-8 space-y-4">
              <p className="text-xl text-ink font-heading font-light">
                {lang === "bn" ? "কোনো আসবাব পাওয়া যায়নি" : "No furniture found matching these filters."}
              </p>
              <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto leading-relaxed">
                {lang === "bn"
                  ? "অন্য কোনো কাঠের ধরন বা ক্যাটাগরি বেছে দেখুন, অথবা সমস্ত ফিল্টার মুছে পুরো ক্যাটালগ দেখুন।"
                  : "Try clearing your search query or selecting a different room category or timber species."}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 rounded-full bg-bronze text-bone hover:bg-bronze-dark px-6 py-3 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{lang === "bn" ? "সকল ১২টি আসবাব দেখুন" : "View All 12 Signature Pieces"}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p) => {
                  const title = lang === "bn" ? p.titleBn : p.titleEn;
                  const desc = lang === "bn" ? p.descBn : p.descEn;
                  const timber = lang === "bn" ? p.timberLabelBn : p.timberLabelEn;
                  const waUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(
                    lang === "bn"
                      ? `আসসালামু আলাইকুম হেভেন ফার্নিচার মার্ট, আমি আপনাদের গ্যালারি থেকে "${title}" (দাম: ৳${p.price.toLocaleString("bn-BD")}) সম্পর্কে জানতে ও কাস্টম অর্ডার করতে চাই।`
                      : `Hello Heaven Furniture Mart, I am enquiring about custom ordering the "${title}" (Starting at ৳${p.price.toLocaleString("en-BD")}) from your catalog.`
                  )}`;

                  return (
                    <motion.article
                      key={p.id}
                      layout="position"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                      whileHover={{ y: -4 }}
                      className="group flex flex-col bg-bone rounded-sm border border-ink/10 overflow-hidden shadow-sm hover:shadow-xl hover:border-brass/35 transition-all duration-300"
                    >
                      {/* Visual Container */}
                      <div 
                        onClick={() => setSelectedProduct(p)}
                        className="relative aspect-[4/3] overflow-hidden bg-sand cursor-pointer select-none"
                      >
                        <img
                          src={p.img}
                          alt={title}
                          className="h-full w-full object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-106"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-depth/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

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

                        {/* Price Badge */}
                        <span className="absolute bottom-3 right-3 bg-bone/95 backdrop-blur-md border border-bronze/30 text-ink font-body text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-sm shadow-[0_4px_16px_-2px_rgba(22,41,43,0.12)] tracking-tight tabular-nums flex items-center">
                          <span className="text-bronze font-bold text-xs mr-1">৳</span>
                          <span>{p.price.toLocaleString(lang === "bn" ? "bn-BD" : "en-BD")}</span>
                        </span>
                      </div>

                      {/* Content Container - Flex Justified for Strict Row Alignment */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 
                            onClick={() => setSelectedProduct(p)}
                            className="font-heading text-xl sm:text-2xl font-light text-ink group-hover:text-bronze transition-colors cursor-pointer leading-snug line-clamp-1"
                            title={title}
                          >
                            {title}
                          </h3>

                          <p className="text-ink/75 text-xs sm:text-sm line-clamp-2 leading-relaxed font-light min-h-[2.5rem]">
                            {desc}
                          </p>
                        </div>

                        {/* Standardized Meta Strip */}
                        <div className="pt-3.5 border-t border-ink/8 flex items-center justify-between text-xs text-ink/70 font-medium">
                          <span className="flex items-center gap-1.5 truncate">
                            <Maximize2 className="h-3.5 w-3.5 text-bronze shrink-0" />
                            <span>{p.dims}</span>
                          </span>
                          <span className="flex items-center gap-1.5 shrink-0 text-bronze font-medium">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{lang === "bn" ? p.leadTimeBn : p.leadTimeEn}</span>
                          </span>
                        </div>

                        {/* Dual Action Center */}
                        <div className="pt-2 flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setSelectedProduct(p)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/20 hover:border-brass hover:bg-sand/30 text-ink hover:text-bronze py-2.5 px-3 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-xs"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>{t("gallery.viewDetails")}</span>
                          </button>

                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-bronze hover:bg-bronze-dark text-bone py-2.5 px-3.5 text-xs font-semibold tracking-wide shadow-sm transition-all cursor-pointer shrink-0"
                            title="Inquire or order on WhatsApp"
                          >
                            <WhatsAppIcon className="h-4 w-4 fill-current shrink-0" />
                            <span>{lang === "bn" ? "অর্ডার / দাম" : "Custom Order"}</span>
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Custom Plan Callout Banner */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 mt-20 sm:mt-28 md:mt-36">
          <div className="bg-depth text-bone rounded-sm p-6 sm:p-10 md:p-16 relative overflow-hidden text-center shadow-2xl">
            <Reveal>
              <p className="text-brass text-xs sm:text-sm uppercase tracking-[0.22em] font-medium mb-3 sm:mb-4">
                {t("gallery.eyebrow")}
              </p>
              <h2 className="font-heading font-light text-2xl sm:text-4xl lg:text-6xl text-bone max-w-3xl mx-auto leading-[1.1]">
                {t("gallery.customBannerTitle")}
              </h2>
              <p className="mt-4 sm:mt-6 text-bone/85 text-sm sm:text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed">
                {t("gallery.customBannerSubtitle")}
              </p>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
                <button
                  type="button"
                  onClick={() => openConsultation({ scope: "full" })}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brass text-depth hover:bg-bone px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-medium tracking-wide transition-colors shadow-lg cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{t("gallery.bookConsultation")}</span>
                </button>
                <a
                  href={`${WHATSAPP_URL}?text=${encodeURIComponent(
                    lang === "bn"
                      ? "আসসালামু আলাইকুম হেভেন ফার্নিচার মার্ট, আমার কাছে একটি কাস্টম ফার্নিচারের নকশা রয়েছে যা আমি আপনাদের দিয়ে তৈরি করাতে চাই।"
                      : "Hello Heaven Furniture Mart, I have an architectural furniture blueprint/reference photo and would like to discuss bespoke crafting."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-bone/30 text-bone hover:border-brass hover:text-brass px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-medium tracking-wide transition-colors"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-current" />
                  <span>{lang === "bn" ? "ছবি পাঠিয়ে দাম জানুন" : "Send Design on WhatsApp"}</span>
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
