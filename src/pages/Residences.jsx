import { ArrowUpRight, Sparkles, MapPin, Calendar, Layers, CheckCircle2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import Nav from "@/components/heaven/Nav";
import Footer from "@/components/heaven/Footer";
import CursorView from "@/components/heaven/CursorView";
import FloatingWhatsApp from "@/components/heaven/FloatingWhatsApp";
import ConsultationDrawer from "@/components/heaven/ConsultationDrawer";
import Reveal from "@/components/heaven/Reveal";
import { useLang } from "@/components/heaven/LanguageProvider";
import { useConsultation } from "@/components/heaven/ConsultationContext";
import { IMAGES, WHATSAPP_URL, PHONE_DISPLAY } from "@/components/heaven/constants";

const PROJECTS = [
  {
    id: "gec",
    titleKey: "residences.gec.title",
    locationKey: "residences.gec.location",
    typeKey: "residences.gec.type",
    timberKey: "residences.gec.timber",
    timelineKey: "residences.gec.timeline",
    descKey: "residences.gec.desc",
    scopeKeys: ["residences.gec.s1", "residences.gec.s2", "residences.gec.s3"],
    img: IMAGES.residenceGec,
    alt: "The GEC Hills Penthouse luxury bespoke dining suite by Heaven Furniture Mart",
  },
  {
    id: "agrabad",
    titleKey: "residences.agrabad.title",
    locationKey: "residences.agrabad.location",
    typeKey: "residences.agrabad.type",
    timberKey: "residences.agrabad.timber",
    timelineKey: "residences.agrabad.timeline",
    descKey: "residences.agrabad.desc",
    scopeKeys: ["residences.agrabad.s1", "residences.agrabad.s2", "residences.agrabad.s3"],
    img: IMAGES.residenceAgrabad,
    alt: "The Agrabad Heritage Villa solid teak master bedroom suite by Heaven Furniture Mart",
  },
  {
    id: "khulshi",
    titleKey: "residences.khulshi.title",
    locationKey: "residences.khulshi.location",
    typeKey: "residences.khulshi.type",
    timberKey: "residences.khulshi.timber",
    timelineKey: "residences.khulshi.timeline",
    descKey: "residences.khulshi.desc",
    scopeKeys: ["residences.khulshi.s1", "residences.khulshi.s2", "residences.khulshi.s3"],
    img: IMAGES.residenceKhulshi,
    alt: "The Khulshi Executive Residence private library and study suite by Heaven Furniture Mart",
  },
];

export default function Residences() {
  const { t } = useLang();
  const { openConsultation } = useConsultation();

  return (
    <div className="min-h-screen bg-bone text-ink font-body">
      <CursorView />
      <Nav />
      <FloatingWhatsApp />
      <ConsultationDrawer />

      <main className="pt-24 sm:pt-28 md:pt-36 pb-20 overflow-x-hidden w-full max-w-full">
        {/* Page Hero */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 mb-10 sm:mb-16 md:mb-24">
          <Reveal>
            <p className="text-bronze text-xs sm:text-sm uppercase tracking-[0.22em] font-medium mb-3 sm:mb-4 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("residences.eyebrow")}</span>
            </p>
            <h1 className="font-heading font-light text-ink text-3xl sm:text-5xl lg:text-7xl leading-[1.06] max-w-3xl">
              {t("residences.title")}
            </h1>
            <p className="mt-4 sm:mt-6 text-ink/80 text-base sm:text-lg md:text-xl font-light max-w-2xl leading-relaxed">
              {t("residences.subtitle")}
            </p>
          </Reveal>
        </section>

        {/* Project Case Studies */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 space-y-12 sm:space-y-20 md:space-y-36">
          {PROJECTS.map((p, i) => {
            const isFlipped = i % 2 === 1;
            return (
              <article key={p.id} className="grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-center">
                {/* Project Image */}
                <Reveal className={`lg:col-span-7 ${isFlipped ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-sand shadow-2xl group">
                    <Image
                      src={p.img}
                      alt={p.alt}
                      className="h-full w-full object-cover object-center transition-transform duration-1200 ease-out group-hover:scale-[1.04]"
                      fittingType="fill"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-depth/50 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-4 left-4 sm:top-5 sm:left-5 bg-depth/90 text-bone border border-brass/30 px-3 py-1.5 rounded-sm text-xs uppercase tracking-[0.16em] font-semibold">
                      0{i + 1} · {t(p.locationKey)}
                    </span>
                  </div>
                </Reveal>

                {/* Project Details */}
                <Reveal delay={0.1} className={`lg:col-span-5 ${isFlipped ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="space-y-5 sm:space-y-6">
                    <div>
                      <p className="text-bronze text-xs sm:text-sm uppercase tracking-[0.2em] font-medium mb-1.5 sm:mb-2">
                        {t(p.typeKey)}
                      </p>
                      <h2 className="font-heading font-light text-ink text-2xl sm:text-4xl leading-[1.12]">
                        {t(p.titleKey)}
                      </h2>
                    </div>

                    {/* Metadata Badges */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 py-3 sm:py-4 border-y border-ink/10 text-xs sm:text-sm text-ink/85 font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-bronze shrink-0" />
                        <span className="truncate">{t(p.locationKey)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-bronze shrink-0" />
                        <span className="truncate">{t(p.timelineKey)}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 text-ink/85 font-medium">
                        <Layers className="h-3.5 w-3.5 text-bronze shrink-0" />
                        <span>{t(p.timberKey)}</span>
                      </div>
                    </div>

                    <p className="text-ink/80 leading-relaxed font-light text-sm sm:text-base">
                      {t(p.descKey)}
                    </p>

                    {/* Scope Items */}
                    <ul className="space-y-1.5 sm:space-y-2 pt-1 text-xs sm:text-sm text-ink/85 font-medium">
                      {p.scopeKeys.map((sk) => (
                        <li key={sk} className="flex items-center gap-2.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-bronze shrink-0" />
                          <span>{t(sk)}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Project Action */}
                    <div className="pt-3 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => openConsultation({ scope: p.id === "khulshi" ? "office" : p.id === "agrabad" ? "bedroom" : "dining" })}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-bronze text-bone hover:bg-bronze-dark px-5 sm:px-6 py-2.5 sm:py-3 text-xs uppercase tracking-wider font-medium transition-colors shadow-md cursor-pointer text-center"
                      >
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        <span>{t("residences.inquireSimilar")}</span>
                      </button>
                      <a
                        href={`${WHATSAPP_URL}?text=${encodeURIComponent(
                          `Hello Heaven Furniture Mart, I was reviewing ${t(p.titleKey)} on your portfolio and would like to discuss a similar project.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-ink/75 hover:text-bronze text-xs sm:text-sm font-medium tracking-wide transition-colors py-1"
                      >
                        <span>WhatsApp</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </Reveal>
              </article>
            );
          })}
        </section>

        {/* Bottom Callout Banner */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 mt-20 sm:mt-28 md:mt-36">
          <div className="bg-depth text-bone rounded-sm p-6 sm:p-10 md:p-16 relative overflow-hidden text-center shadow-2xl">
            <Reveal>
              <p className="text-brass text-xs sm:text-sm uppercase tracking-[0.22em] font-medium mb-3 sm:mb-4">
                {t("cta.begin")}
              </p>
              <h2 className="font-heading font-light text-2xl sm:text-4xl lg:text-6xl text-bone max-w-3xl mx-auto leading-[1.1]">
                {t("residences.bottomTitle")}
              </h2>
              <p className="mt-4 sm:mt-6 text-bone/85 text-sm sm:text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed">
                {t("residences.bottomSubtitle")}
              </p>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
                <button
                  type="button"
                  onClick={() => openConsultation({ scope: "full" })}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brass text-depth hover:bg-bone px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-medium tracking-wide transition-colors shadow-lg cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{t("cta.consultation")}</span>
                </button>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-bone/25 text-bone hover:border-brass hover:text-brass px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-light tracking-wide transition-colors"
                >
                  <span>{t("cta.whatsappUs")} · {PHONE_DISPLAY}</span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
