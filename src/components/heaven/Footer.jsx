import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ArrowUpRight, ExternalLink, ArrowUp } from "lucide-react";
import { useLang } from "./LanguageProvider";
import BrandLogo from "./BrandLogo";
import {
  ADDRESS,
  PHONE_DISPLAY,
  PHONE_TEL,
  EMAIL,
  SOCIAL,
  WHATSAPP_URL,
  FOUNDED,
  FOUNDER,
} from "./constants";

const MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Agrabad+Access+Road+Chattogram+Bangladesh&output=embed";
const MAPS_LINK = "https://www.google.com/maps?q=Agrabad+Access+Road+Chattogram+Bangladesh";

const socials = [
  { href: SOCIAL.facebook, label: "Facebook", Icon: Facebook },
  { href: SOCIAL.instagram, label: "Instagram", Icon: Instagram },
  { href: SOCIAL.youtube, label: "YouTube", Icon: Youtube },
];

export default function Footer() {
  const { t, lang } = useLang();

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-depth text-bone border-t border-bone/10">
      {/* Google Maps embed — local SEO signal + directions for mobile users */}
      <div className="w-full h-[260px] md:h-[340px] relative overflow-hidden border-b border-bone/10">
        <iframe
          src={MAPS_EMBED_URL}
          title="Heaven Furniture Mart location on Google Maps"
          className="w-full h-full"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-bone/90 text-depth px-4 py-2.5 text-[0.72rem] font-medium tracking-wide hover:bg-brass transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {t("footer.directions")}
        </a>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-20">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <Link to="/" className="inline-block group mb-2" aria-label="Heaven Furniture Mart Home">
              <BrandLogo
                theme="dark"
                size="lg"
                showSubtitle={true}
                className="items-start transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>
            <p className="mt-4 text-bone/55 max-w-sm leading-relaxed font-light">
              {t("footer.tagline")}
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-10 w-10 rounded-full border border-bone/25 flex items-center justify-center text-bone/70 hover:bg-brass hover:text-depth hover:border-brass transition-colors"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.16em] text-brass mb-4 font-semibold">
              Atelier Pages
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-bone/85 font-normal">
              <li>
                <Link to="/" className="hover:text-brass transition-colors">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-brass transition-colors">
                  {t("nav.gallery")}
                </Link>
              </li>
              <li>
                <Link to="/residences" className="hover:text-brass transition-colors">
                  {t("nav.residences")}
                </Link>
              </li>
              <li>
                <Link to="/materials" className="hover:text-brass transition-colors">
                  {t("nav.materials")}
                </Link>
              </li>
              <li>
                <Link to="/planner" className="hover:text-brass transition-colors">
                  {t("nav.planner")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.16em] text-brass mb-4 font-semibold">{t("footer.visit")}</p>
            <p className="text-bone/85 leading-relaxed flex gap-2.5 text-xs sm:text-sm">
              <MapPin className="h-4 w-4 mt-0.5 text-bronze shrink-0" strokeWidth={1.5} />
              <span>{ADDRESS}</span>
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.16em] text-brass mb-4 font-semibold">{t("footer.contact")}</p>
            <a
              href={`tel:${PHONE_TEL}`}
              className="text-bone/85 hover:text-brass transition-colors flex gap-2.5 text-xs sm:text-sm font-medium"
            >
              <Phone className="h-4 w-4 mt-0.5 text-bronze shrink-0" strokeWidth={1.5} />
              <span>{PHONE_DISPLAY}</span>
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-2 text-bone/70 hover:text-brass transition-colors flex gap-2.5 break-all text-xs"
            >
              <Mail className="h-4 w-4 mt-0.5 text-bronze shrink-0" strokeWidth={1.5} />
              <span>{EMAIL}</span>
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-brass hover:text-bone transition-colors text-xs uppercase tracking-wider"
            >
              {t("cta.whatsappUs")} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-bone/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-bone/70">
          <p className="text-center sm:text-left">
            {t("footer.copyright", { year: new Date().getFullYear(), founded: FOUNDED, founder: FOUNDER })}
          </p>
          <div className="flex items-center gap-5 sm:gap-7">
            <p className="hidden md:block">{t("footer.location")}</p>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-bone/75 hover:text-brass text-xs font-medium uppercase tracking-[0.16em] transition-colors cursor-pointer group"
              aria-label="Back to top of page"
            >
              <span>{lang === "bn" ? "উপরে যান" : "Back to Top"}</span>
              <div className="h-6 w-6 rounded-full border border-bone/20 group-hover:border-brass flex items-center justify-center transition-colors">
                <ArrowUp className="h-3 w-3 text-bone/70 group-hover:text-brass transition-transform duration-300 group-hover:-translate-y-0.5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}