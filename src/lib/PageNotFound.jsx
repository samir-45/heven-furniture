import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Home as HomeIcon } from "lucide-react";
import Nav from "@/components/heaven/Nav";
import Footer from "@/components/heaven/Footer";
import ConsultationDrawer from "@/components/heaven/ConsultationDrawer";
import FloatingWhatsApp from "@/components/heaven/FloatingWhatsApp";
import { useConsultation } from "@/components/heaven/ConsultationContext";
import { useLang } from "@/components/heaven/LanguageProvider";

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);
  const { openConsultation } = useConsultation();
  const { lang } = useLang();

  return (
    <div className="min-h-screen bg-bone text-ink font-body flex flex-col justify-between">
      <Nav />
      <ConsultationDrawer />
      <FloatingWhatsApp />

      <main className="flex-1 flex items-center justify-center px-6 py-32 md:py-40">
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-bronze font-medium">
              404 · {lang === "bn" ? "পৃষ্ঠাটি পাওয়া যায়নি" : "Page Not Found"}
            </span>
            <h1 className="font-heading font-light text-5xl sm:text-7xl lg:text-8xl text-ink tracking-tight">
              404
            </h1>
            <div className="h-0.5 w-16 bg-brass/40 mx-auto" />
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl text-ink font-light">
              {lang === "bn" ? "আসবাবের এই ঠিকানাটি খুঁজে পাওয়া যায়নি" : "The piece you're looking for doesn't live here."}
            </h2>
            <p className="text-ink/65 text-sm sm:text-base font-light max-w-md mx-auto leading-relaxed">
              {lang === "bn"
                ? `"${pageName}" লিঙ্কটি সরানো হয়েছে অথবা ভুল টাইপ করা হয়েছে। আমাদের প্রধান সংগ্রহ বা কনসাল্টেশন শুরু করুন।`
                : `The path "${pageName}" may have moved or been retired. Explore our collections or speak with our atelier directly.`}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-depth text-bone hover:bg-bronze transition-colors px-6 py-3 text-xs uppercase tracking-wider font-light shadow-md"
            >
              <HomeIcon className="h-4 w-4 text-brass" />
              <span>{lang === "bn" ? "হোম পেজে ফিরুন" : "Return Home"}</span>
            </Link>

            <button
              type="button"
              onClick={() => openConsultation()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-bronze/40 text-ink hover:bg-bronze hover:text-bone hover:border-bronze transition-colors px-6 py-3 text-xs uppercase tracking-wider font-medium cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-bronze" />
              <span>{lang === "bn" ? "কনসালটেশন বুক করুন" : "Book Consultation"}</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}