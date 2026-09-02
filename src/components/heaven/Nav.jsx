import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { useConsultation } from "./ConsultationContext";

const navItems = [
  { key: "nav.home", path: "/" },
  { key: "nav.collections", path: "/#collections", hash: "collections" },
  { key: "nav.planner", path: "/planner" },
  { key: "nav.residences", path: "/residences" },
  { key: "nav.materials", path: "/materials" },
];

function LangToggle({ className = "" }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex items-center gap-1 text-[0.66rem] uppercase tracking-[0.14em] ${className}`}>
      <button
        onClick={() => setLang("en")}
        className={`transition-colors cursor-pointer ${lang === "en" ? "text-bronze font-medium" : "text-ink/40 hover:text-ink/70"}`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <span className="text-ink/20">|</span>
      <button
        onClick={() => setLang("bn")}
        className={`transition-colors cursor-pointer ${lang === "bn" ? "text-bronze font-medium" : "text-ink/40 hover:text-ink/70"}`}
        aria-pressed={lang === "bn"}
      >
        বাংলা
      </button>
    </div>
  );
}

export default function Nav() {
  const { t } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const { openConsultation } = useConsultation();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  const isHome = location.pathname === "/";

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

  const handleNavClick = (e, item) => {
    if (item.hash) {
      if (isHome) {
        e.preventDefault();
        setOpen(false);
        const el = document.getElementById(item.hash);
        if (el) {
          if (window.lenis) {
            window.lenis.scrollTo(el, { offset: -72, duration: 1.1 });
          } else {
            const top = el.getBoundingClientRect().top + window.scrollY - 72;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      } else {
        setOpen(false);
        navigate(`/#${item.hash}`);
      }
    } else {
      setOpen(false);
    }
  };

  const navThemeScrolled = scrolled || !isHome;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-transform duration-500 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className={`transition-all duration-500 ${
          navThemeScrolled
            ? "bg-bone/85 backdrop-blur-md border-b border-ink/10 shadow-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto max-w-[1400px] px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-baseline gap-2.5">
            <span
              className={`font-heading text-xl md:text-2xl tracking-tight transition-colors ${
                navThemeScrolled ? "text-ink" : "text-bone"
              }`}
            >
              Heaven<span className="text-bronze">.</span>
            </span>
            <span
              className={`hidden sm:block text-[0.58rem] uppercase tracking-[0.3em] border-l pl-3 transition-colors ${
                navThemeScrolled ? "text-ink/50 border-ink/15" : "text-bone/60 border-bone/25"
              }`}
            >
              {t("nav.furnitureMart")}
            </span>
          </Link>

          {/* Center Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`text-[0.76rem] uppercase tracking-[0.18em] transition-colors relative py-1 ${
                    navThemeScrolled
                      ? isActive
                        ? "text-bronze font-medium"
                        : "text-ink/75 hover:text-bronze"
                      : isActive
                      ? "text-brass font-medium"
                      : "text-bone/80 hover:text-brass"
                  }`}
                >
                  {t(item.key)}
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        navThemeScrolled ? "bg-bronze" : "bg-brass"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-5">
            <LangToggle
              className={
                navThemeScrolled
                  ? ""
                  : "[&_*]:!text-bone/70 [&_button:hover]:!text-brass [&_.text-ink\\/20]:!text-bone/25"
              }
            />
            <button
              type="button"
              onClick={() => openConsultation()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-bronze text-bone hover:bg-bronze-dark transition-all duration-300 px-6 py-2.5 text-[0.8rem] tracking-wide font-medium shadow-md cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("nav.consultation")}</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`lg:hidden p-2 -mr-2 transition-colors cursor-pointer ${
              navThemeScrolled ? "text-ink" : "text-bone"
            }`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-bone/98 backdrop-blur-md border-b border-ink/10"
          >
            <div className="px-6 py-7 flex flex-col gap-5">
              <LangToggle />
              {navItems.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.28 }}
                >
                  <Link
                    to={item.path}
                    onClick={(e) => handleNavClick(e, item)}
                    className="text-sm uppercase tracking-[0.18em] text-ink/75 hover:text-bronze block py-1"
                  >
                    {t(item.key)}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + navItems.length * 0.04, duration: 0.28 }}
                className="pt-2"
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openConsultation();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-bronze text-bone hover:bg-bronze-dark transition-colors py-3.5 text-sm font-medium tracking-wide shadow-md cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{t("cta.consultation")}</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}