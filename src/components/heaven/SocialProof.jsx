import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { IMAGES } from "./constants";

// Recognition & trust — credentials and the showroom itself.
export default function SocialProof() {
  const { t } = useLang();
  const creds = ["proof.cred1", "proof.cred2", "proof.cred3"];

  return (
    <section id="proof" className="scroll-mt-24 bg-bone py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-7 order-2 md:order-1">
            <Reveal>
              <p className="text-bronze text-xs sm:text-sm uppercase tracking-[0.22em] font-medium mb-5">
                {t("proof.eyebrow")}
              </p>
              <h2 className="font-heading font-light text-ink text-3xl md:text-[2.6rem] leading-[1.16] max-w-xl">
                {t("proof.title")}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <ul className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm uppercase tracking-[0.14em] text-ink/80 font-medium">
                {creds.map((c) => (
                  <li key={c} className="flex items-center gap-2.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-bronze" />
                    {t(c)}
                  </li>
                ))}
              </ul>
              <div className="mt-9 pt-1">
                <Link
                  to="/residences"
                  className="inline-flex items-center gap-2 rounded-full bg-bronze text-bone hover:bg-bronze-dark transition-colors px-6 py-3 text-xs uppercase tracking-wider font-medium shadow-md cursor-pointer group"
                >
                  <span>{t("proof.exploreCta")}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-5 order-1 md:order-2">
            <Reveal delay={0.05}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                <Image
                  src={IMAGES.showroom}
                  alt="The Heaven Furniture Mart showroom on Agrabad Access Road, Chattogram"
                  className="h-full w-full object-cover object-left-top"
                  fittingType="fill"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}