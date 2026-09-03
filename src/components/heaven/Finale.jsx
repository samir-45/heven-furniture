import Reveal from "./Reveal";
import WhatsAppButton from "./WhatsAppButton";
import { useLang } from "./LanguageProvider";

export default function Finale() {
  const { t } = useLang();

  return (
    <section id="contact" className="scroll-mt-24 bg-depth text-bone py-20 md:py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 38%, #C9A66B 0, transparent 62%)",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 text-center">
        <Reveal>
          <p className="text-brass text-xs sm:text-sm uppercase tracking-[0.22em] font-medium mb-6 md:mb-8">
            {t("cta.begin")}
          </p>
          <h2 className="font-heading font-light text-bone text-[3rem] leading-[0.98] sm:text-7xl md:text-8xl lg:text-[8.4rem] tracking-[-0.02em]">
            {t("finale.title1")}
            <br />
            {t("finale.title2")}
          </h2>
          <div className="mt-12 md:mt-14 flex justify-center">
            <WhatsAppButton>{t("cta.consultation")}</WhatsAppButton>
          </div>
          <p className="mt-6 text-bone/80 text-xs sm:text-sm tracking-wide font-medium">
            {t("cta.noObligation")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}