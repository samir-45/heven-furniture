import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import ScrollToTop from "./components/ScrollToTop";
import Home from "@/pages/Home";
import { LanguageProvider } from "@/components/heaven/LanguageProvider";
import { ConsultationProvider } from "@/components/heaven/ConsultationContext";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const Residences = lazy(() => import("@/pages/Residences"));
const Materials = lazy(() => import("@/pages/Materials"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-bone flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-bronze border-t-transparent animate-spin" />
        <span className="text-[0.68rem] uppercase tracking-[0.28em] text-ink/45">
          Heaven Atelier
        </span>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClientInstance}>
      <LanguageProvider>
        <ConsultationProvider>
          <Router>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/residences" element={<Residences />} />
                <Route path="/portfolio" element={<Residences />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/atelier" element={<Materials />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
          </Router>
          <Toaster />
        </ConsultationProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;