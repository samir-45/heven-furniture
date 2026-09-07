import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { useConsultation } from "./ConsultationContext";
import { IMAGES, FOUNDED, FOUNDER } from "./constants";

// Founder's Heritage — emotional anchor that humanizes the atelier.
export default function Founder() {
  const { t } = useLang();
  const { openConsultation } = useConsultation();

  return (
    <section
      id="founder"
      className="scroll-mt-24 bg-cocoa text-bone py-16 md:py-24 relative overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-depth/30 border border-brass/20 shadow-xl">
                <Image
                  src={IMAGES.director}
                  alt={`${FOUNDER}, Managing Director of Heaven Furniture Mart`}
                  className="h-full w-full object-cover object-top"
                  fittingType="fill"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/50 via-transparent to-transparent pointer-events-none" />
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={0.1}>
              <p className="text-brass text-xs sm:text-sm uppercase tracking-[0.22em] font-medium mb-6">
                {t("founder.eyebrow")}
              </p>
              <blockquote className="font-heading font-light text-bone text-2xl md:text-[2.1rem] leading-[1.32]">
                <span className="text-brass text-5xl font-light leading-none align-top mr-1">
                  &ldquo;
                </span>
                {t("founder.quote")}
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <span className="h-px w-12 bg-brass" />
                <div>
                  <p className="text-bone font-medium tracking-wide">
                    {t("founder.name")}
                  </p>
                  <p className="text-bone/80 text-sm font-medium">{t("founder.role")}</p>
                </div>
              </div>
              <p className="mt-8 text-bone/75 text-xs sm:text-sm uppercase tracking-[0.16em] font-medium">
                {t("founder.founded", { year: FOUNDED, founder: FOUNDER })}
              </p>
              <div className="mt-8 pt-1">
                <button
                  type="button"
                  onClick={() => openConsultation({ format: "showroom" })}
                  className="inline-flex items-center gap-2 rounded-full border border-brass/50 text-bone hover:bg-brass hover:text-depth transition-colors px-6 py-3 text-xs uppercase tracking-wider font-light cursor-pointer group"
                >
                  <span>{t("founder.scheduleCta")}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-brass group-hover:text-depth group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}