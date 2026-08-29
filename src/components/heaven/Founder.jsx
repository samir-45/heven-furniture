import { Image } from "@/components/ui/image";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { IMAGES, FOUNDED, FOUNDER } from "./constants";

// Founder's Heritage — emotional anchor that humanizes the atelier.
export default function Founder() {
  const { t } = useLang();

  return (
    <section
      id="founder"
      className="scroll-mt-24 bg-cocoa text-bone py-16 md:py-24 relative overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
<Image
  src={IMAGES.bespokeDetail}
  alt="A hand-finished detail of bespoke craftsmanship at Heaven Furniture Mart"
  className="h-full w-full object-cover object-left-top"
  fittingType="fill"
/>
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/60 to-transparent" />
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={0.1}>
              <p className="text-brass text-[0.68rem] uppercase tracking-[0.34em] mb-6">
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
                  <p className="text-bone/55 text-sm">{t("founder.role")}</p>
                </div>
              </div>
              <p className="mt-8 text-bone/50 text-[0.66rem] uppercase tracking-[0.24em]">
                {t("founder.founded", { year: FOUNDED, founder: FOUNDER })}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}