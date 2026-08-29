// Single source of truth for Heaven Furniture Mart brand facts.
// Every value here is taken verbatim from the company brief — do not paraphrase.

export const WHATSAPP_URL = "https://wa.me/8801960481983";
export const PHONE_DISPLAY = "+880 1960-481983";
export const PHONE_TEL = "+8801960481983";
export const EMAIL = "heavenfurnituremart@gmail.com";
export const ADDRESS = "House #4, Road #2, Lane #1, Block L, Halisahar Housing Estate, Agrabad Access Road, Chattogram, Bangladesh";

export const SOCIAL = {
  facebook: "https://www.facebook.com/HeavenFurnitureMart/",
  instagram: "https://www.instagram.com/heaven_furniture_ltd/",
  youtube: "https://www.youtube.com/@HeavenFurnitureMart",
};

export const FOUNDED = 2020;
export const FOUNDER = "MD Abul Kalam Bhuiyan";
export const TAGLINE = "Designed. Crafted. Customized.";

export const MD_QUOTE =
  "At Heaven Furniture Mart, we believe furniture is more than just function; it is a reflection of lifestyle, taste, and comfort. Every piece we create is designed to bring lasting elegance into the homes of our clients.";
export const MD_NAME = "Abul Kalam Bhuiyan";
export const MD_ROLE = "Managing Director";

export const IMAGES = {
  hero: "/images/hero.jpg",
  bespoke: "/images/bespoke-chair.jpg",
  showroom: "/images/showroom.jpg",
  living: "/images/living-room.jpg",
  bedroom: "/images/bedroom.jpg",
  dining: "/images/dining.jpg",
  office: "/images/office.jpg",
  bespokeDetail: "/images/craft-detail.jpg",
};

// Real product & showroom footage pulled from Heaven Furniture Mart's own
// YouTube channel (@HeavenFurnitureMart). Each card links to the source video.
export const SHOWROOM_VIDEOS = [
  { id: "qEwoJWbXSTs", title: "Virtual Showroom Tour", kind: "video" },
  { id: "lxhZF9s7fhY", title: "Handcrafted Luxury Sofa — The Making", kind: "short" },
  { id: "UiO60l9STIY", title: "Premium Dining Set", kind: "short" },
  { id: "0BTzm-t0nYI", title: "Customized Sofa, Made to Order", kind: "short" },
  { id: "95QrFvVcLXI", title: "Victorian-Style Coffee Table", kind: "short" },
  { id: "J55q8hUvZy0", title: "Luxury Customized Showcase", kind: "short" },
];

// maxresdefault (1280×720) keeps thumbnails crisp on desktop grids;
// the Image component falls back to the original if a maxres version is absent.
export const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
export const ytWatch = (v) =>
  v.kind === "short" ? `https://www.youtube.com/shorts/${v.id}` : `https://www.youtube.com/watch?v=${v.id}`;