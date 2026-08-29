import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { useLang } from "./LanguageProvider";

const linkKeys = [
  { key: "nav.collections", href: "#collections" },
  { key: "nav.bespoke", href: "#bespoke" },
  { key: "nav.design", href: "#design" },
  { key: "nav.contact", href: "#contact" },
];

function LangToggle({ className = "" }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex items-center gap-1 text-[0.66rem] uppercase tracking-[0.14em] ${className}`}>
      <button
        onClick={() => setLang("en")}
        className={`transition-colors ${lang === "en" ? "text-bronze font-medium" : "text-ink/40 hover:text-ink/70"}`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <span className="text-ink/20">|</span>
      <button
        onClick={() => setLang("bn")}
        className={`transition-colors ${lang === "bn" ? "text-bronze font-medium" : "text-ink/40 hover:text-ink/70"}`}
        aria-pressed={lang === "bn"}
      >
        বাংলা
      </button>
    </div>
  );
}

export default function Nav() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > last && y > 240 && !open) setHidden(true);
      else setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-transform duration-500 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "bg-bone/80 backdrop-blur-md border-b border-ink/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto max-w-[1400px] px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <a href="#top" className="flex items-baseline gap-2.5">
            <span
              className={`font-heading text-xl md:text-2xl tracking-tight transition-colors ${
                scrolled ? "text-ink" : "text-bone"
              }`}
            >
              Heaven<span className="text-bronze">.</span>
            </span>
            <span
              className={`hidden sm:block text-[0.58rem] uppercase tracking-[0.3em] border-l pl-3 transition-colors ${
                scrolled ? "text-ink/50 border-ink/15" : "text-bone/60 border-bone/25"
              }`}
            >
              {t("nav.furnitureMart")}
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {linkKeys.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-[0.78rem] uppercase tracking-[0.18em] transition-colors ${
                  scrolled ? "text-ink/70 hover:text-bronze" : "text-bone/80 hover:text-brass"
                }`}
              >
                {t(l.key)}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-5">
            <LangToggle className={scrolled ? "" : "[&_*]:!text-bone/70 [&_button:hover]:!text-brass [&_.text-ink\\/20]:!text-bone/25"} />
            <WhatsAppButton className="!px-6 !py-3 !text-[0.8rem]">{t("nav.consultation")}</WhatsAppButton>
          </div>

          <button
            className={`lg:hidden p-2 -mr-2 transition-colors ${scrolled ? "text-ink" : "text-bone"}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-bone/97 backdrop-blur-md border-b border-ink/10"
          >
            <div className="px-6 py-7 flex flex-col gap-5">
              <LangToggle />
              {linkKeys.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    const el = document.querySelector(l.href);
                    if (el) {
                      const top = el.getBoundingClientRect().top + window.scrollY - 72;
                      setTimeout(() => window.scrollTo({ top, behavior: "smooth" }), 60);
                    }
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="text-sm uppercase tracking-[0.18em] text-ink/70"
                >
                  {t(l.key)}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + linkKeys.length * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <WhatsAppButton className="w-full !justify-center" onClick={() => setOpen(false)}>
                  {t("cta.consultation")}
                </WhatsAppButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}