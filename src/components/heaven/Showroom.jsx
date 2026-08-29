import { Play, ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { SHOWROOM_VIDEOS, SOCIAL, ytThumb, ytWatch } from "./constants";

export default function Showroom() {
  const { t } = useLang();

  return (
    <section id="showroom" className="scroll-mt-24 bg-sand/60 py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <Reveal>
            <p className="text-bronze text-[0.68rem] uppercase tracking-[0.34em] mb-5">
              {t("showroom.eyebrow")}
            </p>
            <h2 className="font-heading font-light text-ink text-4xl md:text-5xl leading-[1.08] max-w-xl">
              {t("showroom.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href={SOCIAL.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ink/70 hover:text-bronze transition-colors text-sm"
            >
              {t("showroom.youtube")} <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {SHOWROOM_VIDEOS.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 0.08}>
              <a
                href={ytWatch(v)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="view"
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-sand">
                  <div className="absolute inset-0 transition-transform duration-1100 ease-out group-hover:scale-[1.05]">
                    <Image
                      src={ytThumb(v.id)}
                      alt={`${v.title} — Heaven Furniture Mart`}
                      className="h-full w-full"
                      fittingType="fill"
                    />
                  </div>
                  <div className="absolute inset-0 bg-depth/20 transition-colors duration-500 group-hover:bg-depth/35" />
                  <div className="pointer-events-none absolute inset-0 border border-brass/0 group-hover:border-brass/55 transition-colors duration-500 rounded-sm" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bone/90 text-depth shadow-lg transition-all duration-500 group-hover:bg-brass group-hover:text-depth group-hover:scale-105">
                      <Play className="h-6 w-6 ml-0.5 fill-current" />
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 text-[0.58rem] uppercase tracking-[0.22em] text-bone/90 bg-depth/55 px-2.5 py-1 rounded-sm">
                    {v.kind === "short" ? t("showroom.short") : t("showroom.tour")}
                  </span>
                </div>
                <h3 className="mt-4 font-heading font-light text-ink text-xl md:text-2xl">
                  {v.title}
                </h3>
                <p className="mt-1 inline-flex items-center gap-1.5 text-bronze text-[0.72rem] uppercase tracking-[0.2em]">
                  {t("showroom.watch")} <ArrowUpRight className="h-3.5 w-3.5" />
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}