import { ArrowUpRight } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { useConsultation } from "./ConsultationContext";

// Universal Consultation CTA Button
// Opens the Concierge Consultation slide-over drawer globally
export default function WhatsAppButton({
  children,
  variant = "solid",
  glow = false,
  className = "",
  onClick,
  consultationData = { format: "showroom" },
  href,
}) {
  const { t } = useLang();
  const { openConsultation } = useConsultation();
  const label = children || t("cta.consultation");

  const base =
    "group inline-flex items-center justify-center gap-2.5 rounded-full whitespace-nowrap transition-all duration-500 ease-out min-h-[44px] " +
    "px-7 py-3.5 text-[0.92rem] font-medium tracking-wide cursor-pointer " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-bone";

  const styles =
    variant === "outline"
      ? "border border-bronze-dark/70 text-bronze-dark hover:bg-bronze hover:text-bone hover:border-bronze"
      : "bg-bronze text-bone hover:bg-bronze-dark shadow-[0_14px_34px_-14px_rgba(140,115,85,0.7)]";

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (!href) {
      e.preventDefault();
      openConsultation(consultationData);
    }
  };

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`${base} ${styles} ${glow ? "animate-pulse-bronze" : ""} ${className}`}
      >
        <span>{label}</span>
        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${base} ${styles} ${glow ? "animate-pulse-bronze" : ""} ${className}`}
    >
      <span>{label}</span>
      <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
    </button>
  );
}