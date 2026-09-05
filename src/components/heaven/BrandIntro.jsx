import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { useConsultation } from "./ConsultationContext";
import { FOUNDED, FOUNDER, ADDRESS } from "./constants";

export default function BrandIntro() {
  const { t } = useLang();
  const { openConsultation } = useConsultation();

  return (
    <section id="about" className="scroll-mt-24 bg-bone py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <Reveal>
              <p className="text-bronze text-xs sm:text-sm uppercase tracking-[0.22em] font-medium mb-5">
                {t("brand.eyebrow")}
              </p>
              <h2 className="font-heading font-light text-ink text-4xl md:text-5xl leading-[1.08]">
                {t("brand.title", { year: FOUNDED })}
              </h2>
              <div className="mt-8 pt-6 border-t border-ink/10 flex items-center gap-4 sm:gap-6 text-xs uppercase tracking-[0.16em] text-ink/70 font-medium flex-wrap">
                <span>{t("brand.est")}</span>
                <span>•</span>
                <span>{t("brand.showroom")}</span>
                <span>•</span>
                <span>{t("brand.solidTimber")}</span>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={0.1}>
              <p className="text-ink/85 text-lg md:text-xl leading-[1.7] font-light">
                {t("brand.body", { founder: FOUNDER })}
              </p>
              <div className="mt-8 flex items-center gap-3 text-xs sm:text-sm tracking-wide text-ink/70 font-medium flex-wrap">
                <span className="h-px w-8 sm:w-10 bg-bronze/60 shrink-0" />
                <span className="leading-relaxed">{ADDRESS}</span>
              </div>
              <div className="mt-8 pt-2">
                <button
                  type="button"
                  onClick={() => openConsultation({ format: "showroom" })}
                  className="inline-flex items-center gap-2 rounded-full bg-depth text-bone hover:bg-bronze transition-colors px-6 py-3 text-xs uppercase tracking-wider font-light shadow-sm cursor-pointer group"
                >
                  <span>{t("brand.visitCta")}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-brass group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}