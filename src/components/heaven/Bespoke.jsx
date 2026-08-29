import { Image } from "@/components/ui/image";
import Reveal from "./Reveal";
import WhatsAppButton from "./WhatsAppButton";
import { useLang } from "./LanguageProvider";
import { IMAGES } from "./constants";

const stepKeys = ["s1", "s2", "s3", "s4"];

export default function Bespoke() {
  const { t } = useLang();

  return (
    <section
      id="bespoke"
      className="scroll-mt-24 bg-depth text-bone min-h-screen md:min-h-[100svh] flex flex-col justify-center py-12 md:py-16 relative overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10 my-auto">
        <div className="grid md:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left: header + image stacked */}
          <div className="md:col-span-5 flex flex-col justify-between h-full">
            <Reveal>
              <p className="text-brass text-[0.68rem] uppercase tracking-[0.34em] mb-4">
                {t("bespoke.eyebrow")}
              </p>
              <h2 className="font-heading font-light text-3xl sm:text-4xl lg:text-5xl leading-[1.06]">
                {t("bespoke.title")}
              </h2>
              <p className="mt-4 text-bone/70 max-w-md leading-relaxed font-light text-sm sm:text-base">
                {t("bespoke.subtitle")}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative mt-6 aspect-[4/3] sm:aspect-[5/4] max-h-[38vh] overflow-hidden rounded-sm bg-sand/10">
                <Image
                  src={IMAGES.bespoke}
                  alt="A bespoke hanging swing chair handcrafted by Heaven Furniture Mart"
                  className="h-full w-full object-cover object-center"
                  fittingType="fill"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-depth/55 to-transparent pointer-events-none" />
              </div>
            </Reveal>
          </div>

          {/* Right: the four steps + CTA button */}
          <div className="md:col-span-6 md:col-start-7 flex flex-col justify-center">
            <div className="flex flex-col divide-y divide-bone/15">
              {stepKeys.map((sk, i) => (
                <Reveal key={sk} delay={i * 0.05}>
                  <div className="flex gap-4 sm:gap-6 py-3.5 lg:py-4.5 first:pt-0 last:pb-4">
                    <span className="font-heading text-brass text-2xl lg:text-3xl font-light w-10 sm:w-12 shrink-0">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="font-heading text-xl lg:text-2xl font-light text-bone">
                        {t(`bespoke.${sk}.title`)}
                      </h3>
                      <p className="mt-1 text-bone/65 leading-relaxed font-light text-xs sm:text-sm">
                        {t(`bespoke.${sk}.desc`)}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-6 lg:mt-7">
              <WhatsAppButton>{t("cta.consultation")}</WhatsAppButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}