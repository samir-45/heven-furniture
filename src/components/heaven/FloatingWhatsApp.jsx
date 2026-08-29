import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { WHATSAPP_URL } from "./constants";

// Persistent mobile-only CTA — the consultation action is reachable from any
// scroll position. Hidden on desktop (the nav CTA covers it) and in the hero
// (the hero has its own primary CTA), so it never competes with itself.
export default function FloatingWhatsApp() {
  const { t } = useLang();
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
        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("cta.consultation")}
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="lg:hidden fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-bronze text-bone pl-4 pr-5 py-3.5 shadow-[0_18px_40px_-12px_rgba(140,115,85,0.75)] active:scale-95 transition-transform"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
          <span className="text-[0.82rem] font-medium tracking-wide whitespace-nowrap">
            {t("nav.consultation")}
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}