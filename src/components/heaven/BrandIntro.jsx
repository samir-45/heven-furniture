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
              <p className="text-bronze text-[0.68rem] uppercase tracking-[0.34em] mb-5">
                {t("brand.eyebrow")}
              </p>
              <h2 className="font-heading font-light text-ink text-4xl md:text-5xl leading-[1.08]">
                {t("brand.title", { year: FOUNDED })}
              </h2>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[0.66rem] uppercase tracking-[0.2em] text-ink/55">
                {["brand.est", "brand.showroom", "brand.solidTimber", "brand.delivery"].map((k) => (
                  <li key={k} className="flex items-center gap-2.5">
                    <span className="inline-block h-1 w-1 rounded-full bg-bronze" />
                    {t(k)}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={0.1}>
              <p className="text-ink/75 text-lg md:text-xl leading-[1.7] font-light">
                {t("brand.body", { founder: FOUNDER })}
              </p>
              <div className="mt-8 flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.16em] md:tracking-[0.22em] text-ink/50 flex-wrap">
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