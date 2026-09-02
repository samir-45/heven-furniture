import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const getHashId = (hash) => {
  const rawId = hash.slice(1);
  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
};

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is an in-page anchor hash, scroll smoothly to that element
    if (hash) {
      const id = getHashId(hash);
      const timer = window.setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          if (window.lenis) {
            window.lenis.scrollTo(el, { offset: -72, duration: 1.1 });
          } else {
            const top = el.getBoundingClientRect().top + window.scrollY - 72;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      }, 80);
      return () => window.clearTimeout(timer);
    }

    // When navigating to a new page without a hash, ALWAYS reset to the very top (0, 0)
    const resetScroll = () => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();

    // Secondary tick to guarantee lazy-loaded components mount at top
    const rafId = requestAnimationFrame(() => {
      resetScroll();
    });

    return () => cancelAnimationFrame(rafId);
  }, [pathname, hash]);

  return null;
}
