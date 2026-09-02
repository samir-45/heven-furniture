import { useState, useRef, useCallback, useEffect } from "react";
import { Sparkles, ArrowLeftRight, CheckCircle2 } from "lucide-react";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { useConsultation } from "./ConsultationContext";
import { IMAGES } from "./constants";

export default function BeforeAfter() {
  const { t, lang } = useLang();
  const { openConsultation } = useConsultation();
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [updateWidth]);

  const handleMove = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const stylingPoints = [
    "styling.point1",
    "styling.point2",
    "styling.point3",
    "styling.point4",
  ];

  return (
    <section id="styling" className="scroll-mt-24 bg-bone py-12 sm:py-16 md:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 sm:gap-8 mb-8 sm:mb-12 md:mb-16">
          <Reveal>
            <p className="text-bronze text-[0.66rem] sm:text-[0.68rem] uppercase tracking-[0.34em] mb-3 sm:mb-4 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("styling.eyebrow")}</span>
            </p>
            <h2 className="font-heading font-light text-ink text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.06] max-w-2xl">
              {t("styling.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-ink/65 text-sm sm:text-base md:text-lg font-light max-w-md leading-relaxed">
              {t("styling.subtitle")}
            </p>
          </Reveal>
        </div>

        {/* Interactive Drag Comparison Canvas */}
        <Reveal delay={0.1}>
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            onClick={(e) => handleMove(e.clientX)}
            className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/10] rounded-sm overflow-hidden select-none cursor-ew-resize bg-sand shadow-2xl border border-ink/10"
          >
            {/* After Image (Full background) */}
            <div className="absolute inset-0">
              <img
                src={IMAGES.stylingAfter}
                alt="A fully styled luxury bespoke living room by Heaven Furniture Mart"
                className="h-full w-full object-cover object-center block"
                loading="eager"
              />
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 max-w-[44%] truncate bg-depth/85 backdrop-blur-md text-bone border border-brass/40 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-sm text-[0.56rem] sm:text-[0.66rem] uppercase tracking-[0.14em] sm:tracking-[0.22em] font-medium pointer-events-none shadow-md">
                <span className="font-bold">{lang === "bn" ? "পরে" : "AFTER"}</span>
                <span className="hidden sm:inline">{lang === "bn" ? " · সাজানো আভিজাত্য" : " · Bespoke Interior"}</span>
              </div>
            </div>

            {/* Before Image (Clipped overlay) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div
                className="absolute inset-0 h-full"
                style={{ width: containerWidth ? `${containerWidth}px` : "100%" }}
              >
                <img
                  src={IMAGES.stylingBefore}
                  alt="An empty, bare unfurnished living room before bespoke interior styling"
                  className="h-full w-full object-cover object-center block"
                  loading="eager"
                />
              </div>
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-10 max-w-[44%] truncate bg-bone/90 backdrop-blur-md text-ink border border-ink/15 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-sm text-[0.56rem] sm:text-[0.66rem] uppercase tracking-[0.14em] sm:tracking-[0.22em] font-medium pointer-events-none shadow-md">
                <span className="font-bold">{lang === "bn" ? "আগে" : "BEFORE"}</span>
                <span className="hidden sm:inline">{lang === "bn" ? " · খালি রুম" : " · Bare Space"}</span>
              </div>
            </div>

            {/* Drag Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-bone shadow-[0_0_12px_rgba(0,0,0,0.6)] z-20 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-bone text-depth shadow-2xl border-2 border-brass flex items-center justify-center pointer-events-auto cursor-ew-resize">
                <ArrowLeftRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-bronze" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Styling Features Strip & CTA */}
        <div className="mt-8 sm:mt-12 md:mt-16 grid lg:grid-cols-12 gap-6 sm:gap-8 items-center border-t border-ink/10 pt-6 sm:pt-10">
          <div className="lg:col-span-8">
            <ul className="grid sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-ink/75">
              {stylingPoints.map((k) => (
                <li key={k} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-bronze shrink-0" />
                  <span>{t(k)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <button
              type="button"
              onClick={() => openConsultation({ scope: "living" })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-depth text-bone hover:bg-bronze transition-colors px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm uppercase tracking-wider font-light shadow-md cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-brass" />
              <span>{t("styling.consultCta")}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
