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
import BrandLogo from "@/components/heaven/BrandLogo";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const Residences = lazy(() => import("@/pages/Residences"));
const Materials = lazy(() => import("@/pages/Materials"));
const RoomPlanner = lazy(() => import("@/pages/RoomPlanner"));
const Gallery = lazy(() => import("@/pages/Gallery"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-bone flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <BrandLogo theme="light" size="lg" showSubtitle={true} />
        <div className="h-5 w-5 rounded-full border-2 border-bronze border-t-transparent animate-spin mt-1" />
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
    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = null;
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
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/catalog" element={<Gallery />} />
                <Route path="/products" element={<Gallery />} />
                <Route path="/residences" element={<Residences />} />
                <Route path="/portfolio" element={<Residences />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/atelier" element={<Materials />} />
                <Route path="/planner" element={<RoomPlanner />} />
                <Route path="/room-planner" element={<RoomPlanner />} />
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