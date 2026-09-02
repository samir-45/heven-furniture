import React from "react";

/**
 * Official "Heaven Furniture Mart" Brand Logo
 * Renders the user's official logo-white.png and logo-black.png transparent PNG files.
 * 
 * @param {string} theme - "dark" (white text for dark backgrounds) | "light" (black text for light backgrounds)
 * @param {string} size - "sm" | "md" | "lg" | "xl"
 * @param {string} className - extra classes
 */
export default function BrandLogo({
  theme = "dark",
  size = "md",
  className = "",
}) {
  const sizeClasses = {
    sm: "h-6 sm:h-7 w-auto max-w-[140px] sm:max-w-[160px] object-contain",
    md: "h-7 sm:h-9 w-auto max-w-[170px] sm:max-w-[210px] object-contain",
    lg: "h-9 sm:h-12 w-auto max-w-[220px] sm:max-w-[280px] object-contain",
    xl: "h-12 sm:h-16 w-auto max-w-[280px] sm:max-w-[360px] object-contain",
  }[size] || "h-7 sm:h-9 w-auto max-w-[170px] sm:max-w-[210px] object-contain";

  // Use logo-black.png on light surfaces and logo-white.png on dark surfaces
  const src = theme === "light" ? "/logo-black.png" : "/logo-white.png";

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={src}
        alt="Heaven Furniture Mart"
        className={`${sizeClasses} transition-all duration-300`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
