import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { useConsultation } from "./ConsultationContext";

// Persistent mobile-only CTA — opens the Concierge Consultation drawer
export default function FloatingWhatsApp() {
  const { t } = useLang();
  const { openConsultation } = useConsultation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const nearBottom = y + vh > docH - vh * 0.9;
      setShow(y > vh * 0.8 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={() => openConsultation({ format: "showroom" })}
          aria-label={t("cta.consultation")}
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="lg:hidden fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-bronze text-bone pl-4 pr-5 py-3.5 shadow-[0_18px_40px_-12px_rgba(140,115,85,0.75)] active:scale-95 transition-transform cursor-pointer"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
          <span className="text-[0.82rem] font-medium tracking-wide whitespace-nowrap">
            {t("nav.consultation")}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}