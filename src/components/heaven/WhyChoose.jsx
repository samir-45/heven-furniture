import { Image } from "@/components/ui/image";
import Reveal from "./Reveal";
import WhatsAppButton from "./WhatsAppButton";
import { useLang } from "./LanguageProvider";
import { ArrowUpRight } from "lucide-react";
import { IMAGES, WHATSAPP_URL } from "./constants";

const momentKeys = ["why.m1", "why.m2", "why.m3"];
const momentImgs = [IMAGES.bespokeDetail, IMAGES.bespoke, IMAGES.showroom];
const momentAlts = [
  "A close detail of a hand-finished bespoke furniture joint by Heaven Furniture Mart",
  "A craftsman chiselling a fine walnut joint in the Heaven Furniture Mart atelier",
  "The Heaven Furniture Mart showroom on Agrabad Access Road, Chattogram",
];

export default function WhyChoose() {
  const { t } = useLang();
  const benefits = ["why.b1", "why.b2", "why.b3", "why.b4", "why.b5", "why.b6"];

  return (
    <section id="why" className="scroll-mt-24 bg-bone py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="max-w-2xl mb-16 md:mb-24">
          <Reveal>
            <p className="text-bronze text-[0.68rem] uppercase tracking-[0.34em] mb-5">
              {t("why.eyebrow")}
            </p>
            <h2 className="font-heading font-light text-ink text-4xl md:text-6xl leading-[1.04]">
              {t("why.title")}
            </h2>
          </Reveal>
        </div>

        {/* Scannable benefit strip — instant comprehension for a cold visitor */}
        <Reveal>
          <ul className="flex flex-wrap gap-x-3 gap-y-2 mb-16 md:mb-24 text-[0.72rem] md:text-[0.78rem] uppercase tracking-[0.18em] text-ink/55">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <span className="inline-block h-1 w-1 rounded-full bg-bronze" />
                {t(b)}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="flex flex-col gap-14 md:gap-20">
          {momentKeys.map((mk, i) => {
            const flip = i % 2 === 1;
            return (
              <div
                key={mk}
                className="grid md:grid-cols-12 gap-8 md:gap-14 items-center"
              >
                <Reveal className={`md:col-span-7 ${flip ? "md:order-2" : "md:order-1"}`}>
                  <div className="relative aspect-[5/4] md:aspect-[7/5] overflow-hidden rounded-sm bg-sand">
                    <div className="absolute inset-0 transition-transform duration-1200 ease-out hover:scale-[1.04]">
                      <Image
                        src={momentImgs[i]}
                        alt={momentAlts[i]}
                        className="h-full w-full object-cover object-top"
                        fittingType="fill"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-depth/25 via-transparent to-transparent" />
                    <span className="absolute top-5 left-5 md:top-7 md:left-7 font-heading text-bone/85 text-3xl md:text-5xl font-light">
                      0{i + 1}
                    </span>
                  </div>
                </Reveal>

                <Reveal delay={0.08} className={`md:col-span-5 ${flip ? "md:order-1" : "md:order-2"}`}>
                  <p className="text-bronze text-[0.66rem] uppercase tracking-[0.3em] mb-4">
                    {t(`${mk}.eyebrow`)}
                  </p>
                  <h3 className="font-heading font-light text-ink text-3xl md:text-[2.6rem] leading-[1.08]">
                    {t(`${mk}.title`)}
                  </h3>
                  <p className="mt-5 text-ink/60 text-base md:text-lg leading-relaxed font-light max-w-md">
                    {t(`${mk}.desc`)}
                  </p>
                </Reveal>
              </div>
            );
          })}
        </div>

        <div className="mt-20 md:mt-32 flex flex-col items-center text-center">
          <Reveal>
            <p className="text-bronze text-[0.66rem] uppercase tracking-[0.3em] mb-5">
              {t("cta.begin")}
            </p>
            <div className="flex flex-col items-center gap-6">
              <WhatsAppButton>{t("cta.consultation")}</WhatsAppButton>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-ink/50 hover:text-bronze transition-colors text-sm"
              >
                {t("cta.noObligation")} <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}