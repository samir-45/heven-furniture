import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "./LanguageProvider";
import { useConsultation } from "./ConsultationContext";
import { WHATSAPP_URL } from "./constants";

export default function FloatingWhatsApp() {
  const { t, lang } = useLang();
  const { openConsultation } = useConsultation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShow(y > 220);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-4 sm:right-6 z-40 flex items-center gap-2"
        >
          {/* Quick Consultation Badge (Desktop/Tablet) */}
          <button
            type="button"
            onClick={() => openConsultation({ format: "showroom" })}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-bone/95 backdrop-blur-md text-ink hover:text-bronze border border-ink/15 shadow-lg px-4 py-2.5 text-xs font-semibold tracking-wide transition-all cursor-pointer hover:scale-103"
          >
            <Sparkles className="h-3.5 w-3.5 text-bronze" />
            <span>{t("nav.consultation")}</span>
          </button>

          {/* Primary Floating WhatsApp Action */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Heaven Furniture Mart on WhatsApp"
            className="group flex items-center gap-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-bone px-4 py-3.5 sm:py-3 shadow-[0_12px_32px_-6px_rgba(6,78,59,0.5)] active:scale-95 hover:scale-104 transition-all duration-300 cursor-pointer"
          >
            <div className="relative">
              <WhatsAppIcon className="h-5 w-5 fill-current" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold tracking-wide leading-tight">
                {lang === "bn" ? "হোয়াটসঅ্যাপে কথা বলুন" : "Chat on WhatsApp"}
              </span>
              <span className="hidden md:inline text-[9.5px] text-emerald-100/80 font-normal leading-tight">
                {lang === "bn" ? "তাত্ক্ষণিক উত্তর · অনলাইন" : "Instant Reply · Online"}
              </span>
            </div>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}