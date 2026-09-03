import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Home as HomeIcon, Video, MessageCircle, Calendar, Clock, Sparkles } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { useConsultation } from "./ConsultationContext";
import { WHATSAPP_URL, PHONE_DISPLAY, ADDRESS } from "./constants";

const FORMATS = [
  { id: "showroom", icon: MapPin, titleKey: "drawer.format.showroom", descKey: "drawer.format.showroomDesc" },
  { id: "home", icon: HomeIcon, titleKey: "drawer.format.home", descKey: "drawer.format.homeDesc" },
  { id: "video", icon: Video, titleKey: "drawer.format.video", descKey: "drawer.format.videoDesc" },
];

const SCOPES = [
  { id: "living", key: "drawer.scope.living" },
  { id: "bedroom", key: "drawer.scope.bedroom" },
  { id: "dining", key: "drawer.scope.dining" },
  { id: "office", key: "drawer.scope.office" },
  { id: "full", key: "drawer.scope.full" },
];

const DAYS = [
  { id: "tomorrow", key: "drawer.day.tomorrow" },
  { id: "weekend", key: "drawer.day.weekend" },
  { id: "nextweek", key: "drawer.day.nextweek" },
];

const TIMES = [
  { id: "morning", key: "drawer.time.morning" },
  { id: "afternoon", key: "drawer.time.afternoon" },
  { id: "evening", key: "drawer.time.evening" },
];

export default function ConsultationDrawer() {
  const { t, lang } = useLang();
  const { isOpen, initialData, closeConsultation } = useConsultation();

  const [format, setFormat] = useState("showroom");
  const [scope, setScope] = useState("living");
  const [day, setDay] = useState("tomorrow");
  const [time, setTime] = useState("afternoon");

  useEffect(() => {
    if (initialData?.scope) setScope(initialData.scope);
    if (initialData?.format) setFormat(initialData.format);
  }, [initialData]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const waUrl = useMemo(() => {
    const formatLabel = t(`drawer.format.${format}`);
    const scopeLabel = t(`drawer.scope.${scope}`);
    const dayLabel = t(`drawer.day.${day}`);
    const timeLabel = t(`drawer.time.${time}`);

    const lines = [
      t("drawer.msg.greeting"),
      "",
      t("drawer.msg.intent", { scope: scopeLabel, format: formatLabel }),
      t("drawer.msg.slot", { day: dayLabel, time: timeLabel }),
      "",
      t("drawer.msg.location", { addr: ADDRESS }),
      "",
      t("drawer.msg.closing"),
    ];

    return `${WHATSAPP_URL}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [t, format, scope, day, time]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeConsultation}
            className="fixed inset-0 bg-depth/75 backdrop-blur-sm cursor-pointer"
          />

          {/* Slide-over Sheet */}
          <motion.div
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-xl bg-bone h-full shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="shrink-0 bg-bone border-b border-ink/10 px-6 sm:px-8 py-5 flex items-center justify-between z-20">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-bronze font-medium">
                  {t("drawer.eyebrow")}
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl text-ink font-light">
                  {t("drawer.title")}
                </h2>
              </div>
              <button
                onClick={closeConsultation}
                aria-label="Close consultation drawer"
                className="p-2 -mr-2 rounded-full text-ink/60 hover:text-ink hover:bg-sand/60 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content Form */}
            <div
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-7 text-ink"
            >
              {/* Step 1: Format */}
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.16em] text-ink/75 font-medium mb-3.5 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-bronze text-bone text-xs flex items-center justify-center font-bold">1</span>
                  <span>{t("drawer.step1")}</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {FORMATS.map(({ id, icon: Icon, titleKey, descKey }) => {
                    const active = format === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setFormat(id)}
                        className={`p-3.5 sm:p-4 rounded-sm border text-left flex sm:flex-col justify-between items-start sm:items-start transition-all duration-300 cursor-pointer ${
                          active
                            ? "border-brass bg-brass/10 ring-1 ring-brass/30 text-ink shadow-sm"
                            : "border-ink/15 bg-sand/20 hover:border-ink/30 text-ink/85"
                        }`}
                      >
                        <Icon className={`h-5 w-5 mb-0 sm:mb-3 mr-3 sm:mr-0 shrink-0 ${active ? "text-bronze" : "text-ink/60"}`} />
                        <div>
                          <p className="font-heading text-base sm:text-lg font-light leading-tight">{t(titleKey)}</p>
                          <p className="text-xs text-ink/75 mt-1 leading-snug">{t(descKey)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Project Scope */}
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.16em] text-ink/75 font-medium mb-3 sm:mb-3.5 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-bronze text-bone text-xs flex items-center justify-center font-bold">2</span>
                  <span>{t("drawer.step2")}</span>
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
                  {SCOPES.map(({ id, key }) => {
                    const active = scope === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setScope(id)}
                        className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                          active
                            ? "border-brass bg-brass/10 text-ink font-semibold ring-1 ring-brass/30"
                            : "border-ink/15 text-ink/75 hover:border-ink/35 hover:text-ink bg-sand/20"
                        }`}
                      >
                        {t(key)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Preferred Timing */}
              <div className="space-y-4">
                <p className="text-xs sm:text-sm uppercase tracking-[0.16em] text-ink/75 font-medium flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-bronze text-bone text-xs flex items-center justify-center font-bold">3</span>
                  <span>{t("drawer.step3")}</span>
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-ink/80 font-medium">
                    <Calendar className="h-4 w-4 text-bronze" />
                    <span>{t("drawer.dayLabel")}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map(({ id, key }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setDay(id)}
                        className={`px-3.5 py-2 rounded-sm border text-xs sm:text-sm transition-all ${
                          day === id
                            ? "border-brass bg-depth text-bone font-medium"
                            : "border-ink/15 text-ink/75 hover:border-ink/35 bg-sand/15"
                        }`}
                      >
                        {t(key)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-ink/80 font-medium">
                    <Clock className="h-4 w-4 text-bronze" />
                    <span>{t("drawer.timeLabel")}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TIMES.map(({ id, key }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setTime(id)}
                        className={`px-3.5 py-2 rounded-sm border text-xs sm:text-sm transition-all ${
                          time === id
                            ? "border-brass bg-depth text-bone font-medium"
                            : "border-ink/15 text-ink/75 hover:border-ink/35 bg-sand/15"
                        }`}
                      >
                        {t(key)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trust Box */}
              <div className="p-4 rounded-sm bg-sand/50 border border-ink/10 text-xs sm:text-sm text-ink/80 space-y-2">
                <div className="flex items-center gap-2 font-medium text-ink">
                  <Sparkles className="h-4 w-4 text-bronze" />
                  <span>{t("drawer.promiseTitle")}</span>
                </div>
                <p className="text-ink/75 leading-relaxed text-xs sm:text-sm">
                  {t("drawer.promiseDesc")}
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="shrink-0 bg-bone/98 backdrop-blur-md border-t border-ink/10 p-5 sm:p-7 space-y-2.5 z-20">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeConsultation}
                className="w-full inline-flex items-center justify-center gap-2.5 bg-bronze text-bone hover:bg-bronze-dark rounded-full px-6 py-4 text-sm sm:text-base font-medium tracking-wide shadow-lg transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{t("drawer.confirmBtn")}</span>
              </a>
              <p className="text-center text-xs text-ink/65 font-medium">
                {t("cta.noObligation")} · <a href="tel:+8801960481983" className="hover:underline text-bronze font-semibold">{PHONE_DISPLAY}</a>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
