import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ArrowUpRight, ExternalLink } from "lucide-react";
import { useLang } from "./LanguageProvider";
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
  const { t } = useLang();

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
            <Link to="/" className="font-heading text-2xl tracking-tight">
              Heaven<span className="text-brass">.</span> {t("nav.furnitureMart")}
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
            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-brass mb-4">
              Atelier Pages
            </p>
            <ul className="space-y-2.5 text-xs text-bone/70 font-light">
              <li>
                <Link to="/" className="hover:text-brass transition-colors">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link to="/#collections" className="hover:text-brass transition-colors">
                  {t("nav.collections")}
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
            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-brass mb-4">{t("footer.visit")}</p>
            <p className="text-bone/70 leading-relaxed flex gap-2.5 text-xs">
              <MapPin className="h-4 w-4 mt-0.5 text-bronze shrink-0" strokeWidth={1.5} />
              <span>{ADDRESS}</span>
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-brass mb-4">{t("footer.contact")}</p>
            <a
              href={`tel:${PHONE_TEL}`}
              className="text-bone/70 hover:text-brass transition-colors flex gap-2.5 text-xs"
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

        <div className="mt-14 pt-6 border-t border-bone/10 flex flex-col md:flex-row justify-between gap-3 text-[0.68rem] text-bone/40">
          <p>
            {t("footer.copyright", { year: new Date().getFullYear(), founded: FOUNDED, founder: FOUNDER })}
          </p>
          <p>{t("footer.location")}</p>
        </div>
      </div>
    </footer>
  );
}