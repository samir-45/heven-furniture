import { useState, useRef, useMemo, useEffect, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RotateCw,
  Trash2,
  Plus,
  Download,
  MessageCircle,
  Compass,
  RefreshCw,
  Layers,
  Ruler,
  Copy,
  Box,
  X,
} from "lucide-react";
import Nav from "@/components/heaven/Nav";
import Footer from "@/components/heaven/Footer";
import CursorView from "@/components/heaven/CursorView";
import FloatingWhatsApp from "@/components/heaven/FloatingWhatsApp";
import ConsultationDrawer from "@/components/heaven/ConsultationDrawer";
import Reveal from "@/components/heaven/Reveal";
import { useLang } from "@/components/heaven/LanguageProvider";
import { useConsultation } from "@/components/heaven/ConsultationContext";
import { WHATSAPP_URL, PHONE_DISPLAY, ADDRESS } from "@/components/heaven/constants";
import Room3DCanvas from "@/components/heaven/Room3DCanvas";
import {
  resolveSlidePosition,
  resolveRotateItem,
  findNonOverlappingPosition,
  getOverlappingItemIds,
} from "@/utils/plannerCollision";

// Room Templates
const ROOM_TEMPLATES = [
  {
    id: "living",
    nameKey: "planner.template.living",
    widthM: 6.0,
    lengthM: 4.5,
    initialItems: [
      { id: "item-1", catId: "sofa_3s", x: 1.4, y: 1.2, rot: 0 },
      { id: "item-2", catId: "coffee_table", x: 2.1, y: 2.4, rot: 0 },
      { id: "item-3", catId: "rug_large", x: 1.3, y: 1.8, rot: 0 },
      { id: "item-4", catId: "armchair", x: 4.3, y: 1.8, rot: 270 },
      { id: "item-5", catId: "credenza", x: 1.8, y: 3.8, rot: 0 },
    ],
  },
  {
    id: "bedroom",
    nameKey: "planner.template.bedroom",
    widthM: 5.0,
    lengthM: 4.0,
    initialItems: [
      { id: "item-1", catId: "bed_king", x: 1.5, y: 0.6, rot: 0 },
      { id: "item-2", catId: "nightstand", x: 0.7, y: 0.7, rot: 0 },
      { id: "item-3", catId: "nightstand", x: 3.7, y: 0.7, rot: 0 },
      { id: "item-4", catId: "wardrobe_3d", x: 0.6, y: 3.2, rot: 0 },
      { id: "item-5", catId: "armchair", x: 3.8, y: 2.8, rot: 315 },
    ],
  },
  {
    id: "dining",
    nameKey: "planner.template.dining",
    widthM: 5.5,
    lengthM: 4.0,
    initialItems: [
      { id: "item-1", catId: "dining_table_8s", x: 1.5, y: 1.3, rot: 0 },
      { id: "item-2", catId: "credenza", x: 1.5, y: 3.3, rot: 0 },
      { id: "item-3", catId: "rug_large", x: 1.25, y: 0.9, rot: 0 },
    ],
  },
  {
    id: "study",
    nameKey: "planner.template.study",
    widthM: 4.2,
    lengthM: 3.6,
    initialItems: [
      { id: "item-1", catId: "desk_exec", x: 1.2, y: 1.2, rot: 0 },
      { id: "item-2", catId: "credenza", x: 0.8, y: 2.8, rot: 0 },
      { id: "item-3", catId: "armchair", x: 2.8, y: 2.0, rot: 45 },
    ],
  },
  {
    id: "custom",
    nameKey: "planner.template.custom",
    widthM: 5.0,
    lengthM: 4.0,
    initialItems: [],
  },
];

// Furniture Catalog Items
const CATALOG = [
  // Living
  {
    id: "sofa_3s",
    nameEn: "Bespoke 3-Seater Living Sofa",
    nameBn: "৩-সিটার লাক্সারি সোফা",
    category: "living",
    wM: 2.4,
    dM: 1.0,
    price: 68000,
    timber: "Teak & Bouclé",
    color: "#5C3A21",
    fill: "#D9CFBE",
    type: "sofa",
  },
  {
    id: "sofa_2s",
    nameEn: "Curved 2-Seater Loveseat",
    nameBn: "২-সিটার লাভসিট সোফা",
    category: "living",
    wM: 1.8,
    dM: 0.9,
    price: 48000,
    timber: "Walnut & Velvet",
    color: "#5C3A21",
    fill: "#EAE7DF",
    type: "sofa",
  },
  {
    id: "armchair",
    nameEn: "Sculpted Lounge Armchair",
    nameBn: "লাউঞ্জ আর্মচেয়ার",
    category: "living",
    wM: 0.9,
    dM: 0.85,
    price: 26000,
    timber: "Teak & Leather",
    color: "#9C6B3C",
    fill: "#4A3528",
    type: "chair",
  },
  {
    id: "coffee_table",
    nameEn: "Live-Edge Teak Coffee Table",
    nameBn: "লাইভ-এজ সেগুন কফি টেবিল",
    category: "living",
    wM: 1.3,
    dM: 0.7,
    price: 28000,
    timber: "Solid Teak",
    color: "#9C6B3C",
    fill: "#9C6B3C",
    type: "table",
  },
  {
    id: "credenza",
    nameEn: "Fluted Hardwood Sideboard Credenza",
    nameBn: "ফ্লুটেড সাইডবোর্ড ক্রেডেনজা",
    category: "living",
    wM: 2.0,
    dM: 0.5,
    price: 54000,
    timber: "Solid Walnut",
    color: "#5C3A21",
    fill: "#5C3A21",
    type: "cabinet",
  },

  // Bedroom
  {
    id: "bed_king",
    nameEn: "Solid Teak King Platform Bed",
    nameBn: "কিং সাইজ সলিড সেগুন বেড",
    category: "bedroom",
    wM: 2.1,
    dM: 2.2,
    price: 85000,
    timber: "Solid Teak & Cane",
    color: "#9C6B3C",
    fill: "#F4F1EA",
    type: "bed",
  },
  {
    id: "bed_queen",
    nameEn: "Upholstered Queen Bed Suite",
    nameBn: "কুইন সাইজ বেড স্যুইট",
    category: "bedroom",
    wM: 1.8,
    dM: 2.1,
    price: 72000,
    timber: "Walnut & Linen",
    color: "#5C3A21",
    fill: "#F4F1EA",
    type: "bed",
  },
  {
    id: "nightstand",
    nameEn: "Floating Bedside Nightstand (Single)",
    nameBn: "বেডসাইড নাইটস্ট্যান্ড",
    category: "bedroom",
    wM: 0.55,
    dM: 0.45,
    price: 14000,
    timber: "Solid Teak",
    color: "#9C6B3C",
    fill: "#9C6B3C",
    type: "cabinet",
  },
  {
    id: "wardrobe_3d",
    nameEn: "3-Door Architectural Wardrobe",
    nameBn: "৩-পাল্লা আর্কিটেকচারাল আলমারি",
    category: "bedroom",
    wM: 1.9,
    dM: 0.65,
    price: 78000,
    timber: "Solid Seasoned Teak",
    color: "#9C6B3C",
    fill: "#9C6B3C",
    type: "cabinet",
  },

  // Dining
  {
    id: "dining_table_8s",
    nameEn: "8-Seater Solid Teak Dining Table",
    nameBn: "৮-সিটার সলিড সেগুন ডাইনিং টেবিল",
    category: "dining",
    wM: 2.4,
    dM: 1.1,
    price: 75000,
    timber: "Solid Teak",
    color: "#9C6B3C",
    fill: "#9C6B3C",
    type: "dining_set",
  },
  {
    id: "dining_table_6s",
    nameEn: "6-Seater Walnut Dining Table",
    nameBn: "৬-সিটার ওয়ালনাট ডাইনিং টেবিল",
    category: "dining",
    wM: 1.8,
    dM: 0.95,
    price: 58000,
    timber: "American Walnut",
    color: "#5C3A21",
    fill: "#5C3A21",
    type: "dining_set",
  },

  // Office
  {
    id: "desk_exec",
    nameEn: "Executive Hardwood Desk & Chair",
    nameBn: "এক্সিকিউটিভ ডেস্ক ও চেয়ার",
    category: "office",
    wM: 1.8,
    dM: 0.85,
    price: 52000,
    timber: "Mahogany & Brass",
    color: "#6D2E1F",
    fill: "#6D2E1F",
    type: "desk",
  },

  // Accents
  {
    id: "rug_large",
    nameEn: "Hand-Knotted Wool & Silk Rug",
    nameBn: "হাতে বোনা লাক্সারি কার্পেট",
    category: "accents",
    wM: 3.0,
    dM: 2.2,
    price: 36000,
    timber: "Artisanal Wool",
    color: "#C9A66B",
    fill: "#E8E2D5",
    type: "rug",
  },
  {
    id: "rug_medium",
    nameEn: "Organic Textured Accent Rug",
    nameBn: "মিডিয়াম একসেন্ট কার্পেট",
    category: "accents",
    wM: 2.2,
    dM: 1.5,
    price: 24000,
    timber: "Organic Linen Blend",
    color: "#C9A66B",
    fill: "#EFECE6",
    type: "rug",
  },
];

const CATEGORIES = [
  { id: "all", labelEn: "All Pieces", labelBn: "সব আসবাব" },
  { id: "living", labelEn: "Living", labelBn: "লিভিং" },
  { id: "bedroom", labelEn: "Bedroom", labelBn: "বেডরুম" },
  { id: "dining", labelEn: "Dining", labelBn: "ডাইনিং" },
  { id: "office", labelEn: "Office", labelBn: "অফিস" },
  { id: "accents", labelEn: "Accents & Rugs", labelBn: "কার্পেট" },
];

/**
 * Architectural CAD Furniture Piece Renderer
 * Renders authentic blueprint vector line-art (cushions, headboards, armrests, table profiles)
 */
function CADFurniturePiece({ cat, isSelected, isDark, lang }) {
  const isSofa = cat.type === "sofa";
  const isBed = cat.type === "bed";
  const isDining = cat.type === "dining_set" || cat.id.includes("dining");
  const isTable = cat.type === "table" && !isDining;
  const isChair = cat.type === "chair";
  const isDesk = cat.type === "desk";
  const isCabinet = cat.type === "cabinet";
  const isRug = cat.type === "rug";

  return (
    <div
      className="w-full h-full relative overflow-hidden rounded-xs border border-depth/45 shadow-inner flex flex-col items-center justify-center p-1"
      style={{ backgroundColor: cat.fill }}
    >
      {/* 1. SOFA: Armrests, backrest, and cushion split lines */}
      {isSofa && (
        <>
          <div className="absolute top-0 inset-x-0 h-[22%] bg-black/20 border-b border-white/20 pointer-events-none" />
          <div className="absolute top-0 left-0 bottom-0 w-[14%] bg-black/20 border-r border-white/20 rounded-l-xs pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-[14%] bg-black/20 border-l border-white/20 rounded-r-xs pointer-events-none" />
          <div className="absolute top-[22%] bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/30 pointer-events-none" />
          <div className="absolute bottom-[8%] left-[16%] right-[16%] h-[1px] bg-white/20 pointer-events-none" />
        </>
      )}

      {/* 2. BED: Wooden Headboard, pillows, duvet runner */}
      {isBed && (
        <>
          <div className="absolute top-0 inset-x-0 h-[16%] bg-black/35 border-b border-brass/50 flex items-center justify-center pointer-events-none">
            <div className="w-4/5 h-[2px] bg-brass/60 rounded-full" />
          </div>
          <div className="absolute top-[18%] left-[10%] w-[36%] h-[20%] rounded-xs bg-white/35 border border-white/40 shadow-2xs pointer-events-none flex items-center justify-center">
            <div className="w-1/2 h-[1px] bg-white/50" />
          </div>
          <div className="absolute top-[18%] right-[10%] w-[36%] h-[20%] rounded-xs bg-white/35 border border-white/40 shadow-2xs pointer-events-none flex items-center justify-center">
            <div className="w-1/2 h-[1px] bg-white/50" />
          </div>
          <div className="absolute bottom-0 inset-x-0 h-[36%] bg-white/10 border-t border-white/25 pointer-events-none" />
        </>
      )}

      {/* 3. DINING SET: Solid table with surrounding chairs */}
      {isDining && (
        <>
          <div className="absolute inset-[10%] border border-white/30 rounded-xs pointer-events-none" />
          <div className="absolute top-0 left-[22%] w-[24%] h-[6px] rounded-t-xs bg-black/25 border-b border-white/20 pointer-events-none" />
          <div className="absolute top-0 right-[22%] w-[24%] h-[6px] rounded-t-xs bg-black/25 border-b border-white/20 pointer-events-none" />
          <div className="absolute bottom-0 left-[22%] w-[24%] h-[6px] rounded-b-xs bg-black/25 border-t border-white/20 pointer-events-none" />
          <div className="absolute bottom-0 right-[22%] w-[24%] h-[6px] rounded-b-xs bg-black/25 border-t border-white/20 pointer-events-none" />
        </>
      )}

      {/* 4. COFFEE TABLE: Chamfered timber inset */}
      {isTable && (
        <div className="absolute inset-[12%] border border-white/35 rounded-xs pointer-events-none flex items-center justify-center">
          <div className="w-1/2 h-[1px] bg-white/20" />
        </div>
      )}

      {/* 5. ARMCHAIR: Curved bucket profile and deep seat */}
      {isChair && (
        <>
          <div className="absolute top-0 inset-x-0 h-[28%] bg-black/20 rounded-b-lg border-b border-white/25 pointer-events-none" />
          <div className="absolute top-0 left-0 bottom-0 w-[18%] bg-black/15 border-r border-white/20 pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-[18%] bg-black/15 border-l border-white/20 pointer-events-none" />
        </>
      )}

      {/* 6. DESK: Executive writing surface with leather blotter */}
      {isDesk && (
        <>
          <div className="absolute inset-[6%] border border-white/20 pointer-events-none" />
          <div className="absolute inset-x-[22%] inset-y-[18%] bg-black/25 rounded-xs border border-brass/30 pointer-events-none flex items-center justify-center" />
          <div className="absolute top-[12%] right-[12%] h-1.5 w-1.5 rounded-full border border-brass bg-brass/60 pointer-events-none" />
        </>
      )}

      {/* 7. CABINET / CREDENZA: Vertical panels and brass pulls */}
      {isCabinet && (
        <>
          <div className="absolute inset-y-0 left-1/3 w-[1px] bg-white/25 pointer-events-none" />
          <div className="absolute inset-y-0 right-1/3 w-[1px] bg-white/25 pointer-events-none" />
          <div className="absolute bottom-[10%] left-[30%] w-2 h-0.5 bg-brass rounded-full pointer-events-none" />
          <div className="absolute bottom-[10%] right-[30%] w-2 h-0.5 bg-brass rounded-full pointer-events-none" />
        </>
      )}

      {/* 8. RUG: Woven texture and fringe */}
      {isRug && (
        <>
          <div className="absolute inset-[6%] border border-ink/15 rounded-xs pointer-events-none" />
          <div className="absolute inset-[12%] border border-dashed border-ink/10 rounded-xs pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-[3px] border-b border-dotted border-ink/25 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-[3px] border-t border-dotted border-ink/25 pointer-events-none" />
        </>
      )}

      {/* Item Label & Dimensions (Crisp Architectural Typography) */}
      <span
        className={`text-[0.55rem] font-bold text-center leading-tight truncate px-1 z-10 ${
          isDark ? "text-bone drop-shadow-sm" : "text-depth"
        }`}
        style={{ maxWidth: "100%" }}
      >
        {lang === "bn" ? cat.nameBn : cat.nameEn}
      </span>

      <span
        className={`text-[0.48rem] font-mono mt-0.5 z-10 ${
          isDark ? "text-bone/80" : "text-depth/70"
        }`}
      >
        {cat.wM}m × {cat.dM}m
      </span>

      {/* Selected Active Indicator Dot */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-brass ring-2 ring-bone shadow-sm z-20" />
      )}
    </div>
  );
}

export default function RoomPlanner() {
  const { t, lang } = useLang();
  const { openConsultation } = useConsultation();

  // Active room preset
  const [selectedTemplate, setSelectedTemplate] = useState(ROOM_TEMPLATES[0]);
  const [roomWidth, setRoomWidth] = useState(ROOM_TEMPLATES[0].widthM);
  const [roomLength, setRoomLength] = useState(ROOM_TEMPLATES[0].lengthM);

  // Placed items on canvas
  const [placedItems, setPlacedItems] = useState(ROOM_TEMPLATES[0].initialItems);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeCatalogCategory, setActiveCatalogCategory] = useState("all");
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [viewMode, setViewMode] = useState("3d"); // "3d" | "2d"

  // Real-time overlap detection across all solid furniture
  const overlappingItemIds = useMemo(
    () => getOverlappingItemIds(placedItems, CATALOG),
    [placedItems]
  );

  // Dragging state
  const canvasRef = useRef(null);
  const [dragState, setDragState] = useState(null);

  // Canvas scale factor (pixels per meter)
  const [pixelsPerMeter, setPixelsPerMeter] = useState(75);

  useEffect(() => {
    const updateScale = () => {
      if (!canvasRef.current) return;
      const isMobile = window.innerWidth < 640;
      const pad = isMobile ? 24 : 48;
      const cw = Math.max(canvasRef.current.clientWidth - pad, 180);
      const ch = Math.max(canvasRef.current.clientHeight - pad, 160);
      const scaleX = cw / Math.max(roomWidth, 3);
      const scaleY = ch / Math.max(roomLength, 3);
      const chosen = Math.min(scaleX, scaleY, 95);
      setPixelsPerMeter(Math.max(24, chosen));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [roomWidth, roomLength]);

  // When room template changes
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setRoomWidth(template.widthM);
    setRoomLength(template.lengthM);
    setPlacedItems(
      template.initialItems.map((item, idx) => ({
        ...item,
        id: `item-${Date.now()}-${idx}`,
      }))
    );
    setSelectedItemId(null);
  };

  // Add item from catalog into the nearest clear, non-overlapping spot
  const handleAddItem = (catItem) => {
    const pos = findNonOverlappingPosition(
      catItem.id,
      0,
      (roomWidth - catItem.wM) / 2,
      (roomLength - catItem.dM) / 2,
      placedItems,
      CATALOG,
      roomWidth,
      roomLength
    );
    const newItem = {
      id: `item-${Date.now()}`,
      catId: catItem.id,
      x: pos.x,
      y: pos.y,
      rot: 0,
    };
    setPlacedItems((prev) => [...prev, newItem]);
    setSelectedItemId(newItem.id);
  };

  // Duplicate selected item into the nearest clear adjacent space
  const handleDuplicateSelected = () => {
    if (!selectedItemId) return;
    const original = placedItems.find((p) => p.id === selectedItemId);
    if (!original) return;
    const cat = CATALOG.find((c) => c.id === original.catId);
    const isRot = original.rot % 180 !== 0;
    const visualW = cat ? (isRot ? cat.dM : cat.wM) : 1;

    const preferredX = original.x + visualW + 0.25;
    const preferredY = original.y;

    const pos = findNonOverlappingPosition(
      original.catId,
      original.rot,
      preferredX,
      preferredY,
      placedItems,
      CATALOG,
      roomWidth,
      roomLength
    );

    const newItem = {
      id: `item-${Date.now()}`,
      catId: original.catId,
      x: pos.x,
      y: pos.y,
      rot: original.rot,
    };
    setPlacedItems((prev) => [...prev, newItem]);
    setSelectedItemId(newItem.id);
  };

  // Move placed item with non-overlap collision resolution (used by both 2D and 3D)
  const handleMoveItem = useCallback(
    (id, newX, newY) => {
      setPlacedItems((prev) => {
        const item = prev.find((p) => p.id === id);
        if (!item) return prev;
        const resolved = resolveSlidePosition({
          item,
          targetX: newX,
          targetY: newY,
          placedItems: prev,
          catalog: CATALOG,
          roomWidth,
          roomLength,
        });
        return prev.map((p) =>
          p.id === id
            ? {
                ...p,
                x: Math.round(resolved.x * 100) / 100,
                y: Math.round(resolved.y * 100) / 100,
              }
            : p
        );
      });
    },
    [roomWidth, roomLength]
  );

  // Rotate selected item with collision clearance check
  const handleRotateSelected = () => {
    if (!selectedItemId) return;
    setPlacedItems((prev) => {
      const item = prev.find((p) => p.id === selectedItemId);
      if (!item) return prev;
      const resolved = resolveRotateItem(item, prev, CATALOG, roomWidth, roomLength);
      if (!resolved) {
        // Blocked - cannot rotate without overlapping other furniture
        return prev;
      }
      return prev.map((p) => (p.id === selectedItemId ? resolved : p));
    });
  };

  // Delete selected item
  const handleDeleteSelected = () => {
    if (!selectedItemId) return;
    setPlacedItems((prev) => prev.filter((item) => item.id !== selectedItemId));
    setSelectedItemId(null);
  };

  // Clear all items
  const handleClearCanvas = () => {
    setPlacedItems([]);
    setSelectedItemId(null);
  };

  // Reset to current preset defaults
  const handleResetPreset = () => {
    setPlacedItems(
      selectedTemplate.initialItems.map((item, idx) => ({
        ...item,
        id: `item-${Date.now()}-${idx}`,
      }))
    );
    setSelectedItemId(null);
  };

  // Room dimension update handlers with accurate rotated boundary clamping
  const clampItemsWithinBounds = (newW, newL) => {
    setPlacedItems((prev) =>
      prev.map((item) => {
        const cat = CATALOG.find((c) => c.id === item.catId);
        const isRot = item.rot % 180 !== 0;
        const wM = cat ? (isRot ? cat.dM : cat.wM) : 1;
        const dM = cat ? (isRot ? cat.wM : cat.dM) : 1;
        const maxX = Math.max(0, newW - wM);
        const maxY = Math.max(0, newL - dM);
        const clampedX = Math.min(Math.max(0, item.x), maxX);
        const clampedY = Math.min(Math.max(0, item.y), maxY);
        return item.x !== clampedX || item.y !== clampedY
          ? { ...item, x: clampedX, y: clampedY }
          : item;
      })
    );
  };

  const handleWidthChange = (val) => {
    if (val === "") {
      setRoomWidth("");
      return;
    }
    const num = parseFloat(val);
    if (isNaN(num)) return;
    setRoomWidth(num);
    if (num >= 3 && num <= 12) {
      clampItemsWithinBounds(num, roomLength);
    }
  };

  const handleWidthBlur = () => {
    const num = parseFloat(roomWidth);
    const safe = isNaN(num) || num < 3 ? 3 : Math.min(12, num);
    const rounded = Math.round(safe * 10) / 10;
    setRoomWidth(rounded);
    clampItemsWithinBounds(rounded, roomLength);
  };

  const handleLengthChange = (val) => {
    if (val === "") {
      setRoomLength("");
      return;
    }
    const num = parseFloat(val);
    if (isNaN(num)) return;
    setRoomLength(num);
    if (num >= 3 && num <= 12) {
      clampItemsWithinBounds(roomWidth, num);
    }
  };

  const handleLengthBlur = () => {
    const num = parseFloat(roomLength);
    const safe = isNaN(num) || num < 3 ? 3 : Math.min(12, num);
    const rounded = Math.round(safe * 10) / 10;
    setRoomLength(rounded);
    clampItemsWithinBounds(roomWidth, rounded);
  };

  // Dragging logic
  const handlePointerDownItem = (e, item) => {
    e.stopPropagation();
    setSelectedItemId(item.id);

    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
    if (clientX === undefined || clientY === undefined) return;

    const cat = CATALOG.find((c) => c.id === item.catId);
    const isRot = item.rot % 180 !== 0;
    const wM = cat ? (isRot ? cat.dM : cat.wM) : 1;
    const dM = cat ? (isRot ? cat.wM : cat.dM) : 1;

    setDragState({
      itemId: item.id,
      startX: clientX,
      startY: clientY,
      origItemX: item.x,
      origItemY: item.y,
      wM,
      dM,
    });
  };

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragState) return;

      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (clientX === undefined || clientY === undefined) return;

      const deltaX = (clientX - dragState.startX) / pixelsPerMeter;
      const deltaY = (clientY - dragState.startY) / pixelsPerMeter;

      const targetX = dragState.origItemX + deltaX;
      const targetY = dragState.origItemY + deltaY;

      handleMoveItem(dragState.itemId, targetX, targetY);
    },
    [dragState, pixelsPerMeter, handleMoveItem]
  );

  // Global Keyboard Shortcuts for selected item (R = rotate, Delete = remove, Esc = deselect, Arrows = nudge)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (e.key === "Escape") {
        setSelectedItemId(null);
        return;
      }

      if (!selectedItemId) return;

      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleRotateSelected();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        handleDeleteSelected();
      } else if (e.key === "d" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleDuplicateSelected();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const curr = placedItems.find((it) => it.id === selectedItemId);
        if (curr) handleMoveItem(selectedItemId, curr.x - 0.1, curr.y);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const curr = placedItems.find((it) => it.id === selectedItemId);
        if (curr) handleMoveItem(selectedItemId, curr.x + 0.1, curr.y);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const curr = placedItems.find((it) => it.id === selectedItemId);
        if (curr) handleMoveItem(selectedItemId, curr.x, curr.y - 0.1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const curr = placedItems.find((it) => it.id === selectedItemId);
        if (curr) handleMoveItem(selectedItemId, curr.x, curr.y + 0.1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemId, placedItems, handleMoveItem]);

  const handlePointerUp = useCallback(() => {
    setDragState(null);
  }, []);

  useEffect(() => {
    if (!dragState) return;

    const handleWindowPointerMove = (e) => {
      handlePointerMove(e);
    };
    const endDrag = () => setDragState(null);

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [dragState, handlePointerMove]);

  // Spatial & Budget Analytics
  const { totalEstimate, occupiedAreaM2, totalAreaM2, occupancyPercent, flowStatus } = useMemo(() => {
    const totalArea = roomWidth * roomLength;
    let sumPrice = 0;
    let sumArea = 0;

    placedItems.forEach((item) => {
      const catItem = CATALOG.find((c) => c.id === item.catId);
      if (catItem) {
        sumPrice += catItem.price;
        if (catItem.category !== "accents") {
          sumArea += catItem.wM * catItem.dM;
        }
      }
    });

    const percent = Math.min(100, Math.round((sumArea / Math.max(1, totalArea)) * 100));

    let status = "flowOptimal";
    if (percent > 55) status = "flowDense";
    else if (percent > 35) status = "flowCozy";

    return {
      totalEstimate: sumPrice,
      occupiedAreaM2: sumArea.toFixed(1),
      totalAreaM2: totalArea.toFixed(1),
      occupancyPercent: percent,
      flowStatus: status,
    };
  }, [roomWidth, roomLength, placedItems]);

  // WhatsApp Message Generator
  const waUrl = useMemo(() => {
    const templateName = t(selectedTemplate.nameKey);
    const lines = lang === "bn" ? [
      "*হেভেন ফার্নিচার মার্ট — কাস্টম ফ্লোরপ্ল্যান ব্লুপ্রিন্ট*",
      `রুমের ধরন: ${templateName} (${roomWidth.toFixed(1)}মি × ${roomLength.toFixed(1)}মি · ${totalAreaM2} বর্গমিটার)`,
      "",
      `নির্বাচিত ফার্নিচার (${placedItems.length}টি):`,
    ] : [
      "*Heaven Furniture Mart — Bespoke Floorplan Blueprint*",
      `Room Type: ${templateName} (${roomWidth.toFixed(1)}m × ${roomLength.toFixed(1)}m · ${totalAreaM2} m²)`,
      "",
      `Selected Pieces (${placedItems.length}):`,
    ];

    placedItems.forEach((item, idx) => {
      const cat = CATALOG.find((c) => c.id === item.catId);
      if (cat) {
        const name = lang === "bn" ? cat.nameBn : cat.nameEn;
        const dims = lang === "bn" ? `${Math.round(cat.wM * 100)}×${Math.round(cat.dM * 100)} সেমি` : `${Math.round(cat.wM * 100)}×${Math.round(cat.dM * 100)} cm`;
        const price = lang === "bn" ? `৳${cat.price.toLocaleString("bn-BD")}` : `BDT ${cat.price.toLocaleString("en-BD")}`;
        lines.push(`${idx + 1}. ${name} (${dims}) — ${price}`);
      }
    });

    if (lang === "bn") {
      lines.push(
        "",
        `মোট আনুমানিক বাজেট: ৳${totalEstimate.toLocaleString("bn-BD")}`,
        `স্থান দখল: ${occupiedAreaM2} বর্গমিটার (${occupancyPercent}%)`,
        "",
        "এই ফ্লোরপ্ল্যানটি পর্যালোচনা করতে এবং একটি কনসালটেশনের জন্য আমার সাথে যোগাযোগ করুন।"
      );
    } else {
      lines.push(
        "",
        `Total Estimated Investment: BDT ${totalEstimate.toLocaleString("en-BD")}`,
        `Space Occupancy: ${occupiedAreaM2} m² (${occupancyPercent}%)`,
        "",
        "Please contact me to review this room layout and schedule a consultation."
      );
    }

    return `${WHATSAPP_URL}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [t, lang, selectedTemplate, roomWidth, roomLength, totalAreaM2, placedItems, totalEstimate, occupiedAreaM2, occupancyPercent]);

  // PDF Blueprint Generator
  const handleDownloadPdf = async () => {
    setPdfGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Background
      doc.setFillColor(249, 247, 242);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // Top Header
      doc.setFillColor(22, 41, 43);
      doc.rect(0, 0, pageWidth, 28, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(201, 166, 107);
      doc.text("HEAVEN FURNITURE MART", 16, 13);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(244, 241, 234);
      doc.text("Bespoke Architectural Floorplan & Room Specification Blueprint", 16, 20);

      const refNumber = `HFM-PLAN-${Date.now().toString().slice(-6)}`;
      doc.text(`Ref: ${refNumber}`, pageWidth - 16, 13, { align: "right" });
      doc.text(`Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}`, pageWidth - 16, 20, { align: "right" });

      // Left Column: Room Overview & Inventory
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(22, 41, 43);
      doc.text("Room Layout & Specifications", 16, 38);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);
      doc.text(`Template: ${selectedTemplate.id.toUpperCase()} SUITE`, 16, 45);
      doc.text(`Dimensions: ${roomWidth.toFixed(1)}m × ${roomLength.toFixed(1)}m (${(roomWidth * 3.28084).toFixed(1)}ft × ${(roomLength * 3.28084).toFixed(1)}ft)`, 16, 51);
      doc.text(`Total Floor Area: ${totalAreaM2} m² / ${(totalAreaM2 * 10.7639).toFixed(0)} sq.ft`, 16, 57);
      doc.text(`Furniture Footprint: ${occupiedAreaM2} m² (${occupancyPercent}% Room Coverage)`, 16, 63);

      // Inventory Table
      doc.setFillColor(236, 231, 222);
      doc.rect(16, 70, 130, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(22, 41, 43);
      doc.text("ITEM DESCRIPTION", 18, 75);
      doc.text("DIMENSIONS", 88, 75);
      doc.text("ESTIMATE (BDT)", 144, 75, { align: "right" });

      let rowY = 82;
      doc.setFont("helvetica", "normal");
      placedItems.forEach((item, i) => {
        if (rowY > 175) return;
        const cat = CATALOG.find((c) => c.id === item.catId);
        if (cat) {
          doc.text(`${i + 1}. ${cat.nameEn}`, 18, rowY);
          doc.text(`${Math.round(cat.wM * 100)} × ${Math.round(cat.dM * 100)} cm`, 88, rowY);
          doc.text(`BDT ${cat.price.toLocaleString("en-BD")}`, 144, rowY, { align: "right" });
          rowY += 6.5;
        }
      });

      // Total Budget Banner
      doc.setFillColor(22, 41, 43);
      doc.rect(16, rowY + 3, 130, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(201, 166, 107);
      doc.text("TOTAL ESTIMATED INVESTMENT", 20, rowY + 10);
      doc.text(`BDT ${totalEstimate.toLocaleString("en-BD")}`, 142, rowY + 10, { align: "right" });

      // Right Column: Architectural Floorplan Drawing
      const planX = 158;
      const planY = 38;
      const planW = 122;
      const planH = 135;

      doc.setFillColor(244, 241, 234);
      doc.setDrawColor(201, 166, 107);
      doc.rect(planX, planY, planW, planH, "FD");

      // Draw Grid on Plan
      doc.setDrawColor(220, 215, 205);
      for (let gx = planX; gx < planX + planW; gx += 12) {
        doc.line(gx, planY, gx, planY + planH);
      }
      for (let gy = planY; gy < planY + planH; gy += 12) {
        doc.line(planX, gy, planX + planW, gy);
      }

      // Draw Room Bounds
      const scaleDrawing = Math.min(planW / (roomWidth * 1.15), planH / (roomLength * 1.15));
      const drawnW = roomWidth * scaleDrawing;
      const drawnH = roomLength * scaleDrawing;
      const offsetDrawX = planX + (planW - drawnW) / 2;
      const offsetDrawY = planY + (planH - drawnH) / 2;

      doc.setDrawColor(22, 41, 43);
      doc.setLineWidth(1.2);
      doc.rect(offsetDrawX, offsetDrawY, drawnW, drawnH);

      // Draw Placed Items on Plan (accurately accounting for center-origin rotation)
      doc.setLineWidth(0.3);
      placedItems.forEach((item) => {
        const cat = CATALOG.find((c) => c.id === item.catId);
        if (cat) {
          const isRotated = item.rot % 180 !== 0;
          const visualW = isRotated ? cat.dM : cat.wM;
          const visualH = isRotated ? cat.wM : cat.dM;
          const cx = item.x + cat.wM / 2;
          const cy = item.y + cat.dM / 2;
          const ix = offsetDrawX + (cx - visualW / 2) * scaleDrawing;
          const iy = offsetDrawY + (cy - visualH / 2) * scaleDrawing;
          const itemDrawW = visualW * scaleDrawing;
          const itemDrawH = visualH * scaleDrawing;

          doc.setFillColor(156, 107, 60);
          doc.rect(ix, iy, itemDrawW, itemDrawH, "F");
          doc.setDrawColor(22, 41, 43);
          doc.rect(ix, iy, itemDrawW, itemDrawH, "D");
        }
      });

      // Bottom Footer Bar
      doc.setDrawColor(200, 195, 185);
      doc.line(16, pageHeight - 14, pageWidth - 16, pageHeight - 14);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(110, 110, 110);
      doc.text(`${ADDRESS} · Hotline: ${PHONE_DISPLAY}`, 16, pageHeight - 9);
      doc.text("Heaven Furniture Mart · Bespoke Craftsmanship since 2020", pageWidth - 16, pageHeight - 9, { align: "right" });

      doc.save(`Haven-Floorplan-${selectedTemplate.id}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setPdfGenerating(false);
    }
  };

  const selectedItemData = useMemo(() => {
    if (!selectedItemId) return null;
    const item = placedItems.find((p) => p.id === selectedItemId);
    if (!item) return null;
    const cat = CATALOG.find((c) => c.id === item.catId);
    return { ...item, cat };
  }, [selectedItemId, placedItems]);

  const filteredCatalog = useMemo(() => {
    if (activeCatalogCategory === "all") return CATALOG;
    return CATALOG.filter((c) => c.category === activeCatalogCategory);
  }, [activeCatalogCategory]);

  return (
    <div className="min-h-screen bg-bone text-ink font-body">
      <CursorView />
      <Nav />
      <FloatingWhatsApp />
      <ConsultationDrawer />

      <main className="pt-24 sm:pt-28 md:pt-36 pb-20 overflow-x-hidden w-full max-w-full">
        {/* Hero Header */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 mb-6 sm:mb-8 md:mb-12">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-depth/5 border border-brass/35 px-3.5 py-1.5 rounded-full text-bronze text-xs sm:text-sm uppercase tracking-[0.22em] font-medium mb-3 sm:mb-4 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-brass animate-pulse" />
              <span>{t("planner.eyebrow")} · WebGL Spatial Studio</span>
            </div>
            <h1 className="font-heading font-light text-ink text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.06] sm:leading-[1.04] max-w-3xl">
              {t("planner.title")}
            </h1>
            <p className="mt-3 sm:mt-5 text-ink/80 text-base sm:text-lg md:text-xl font-light max-w-2xl leading-relaxed">
              {t("planner.subtitle")}
            </p>
          </Reveal>
        </section>

        {/* Preset Selector & Dimensions Bar */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 mb-6">
          <div className="bg-sand/60 backdrop-blur-md border border-brass/30 rounded-sm p-3.5 sm:p-5 md:p-6 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
              <span className="text-xs sm:text-sm uppercase tracking-[0.16em] text-ink/75 font-semibold mr-1 flex items-center gap-1.5 shrink-0">
                <Layers className="h-3.5 w-3.5 text-brass" />
                <span>{t("planner.templates")}:</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {ROOM_TEMPLATES.map((tmpl) => {
                  const active = selectedTemplate.id === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl)}
                      className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer ${
                        active
                          ? "border-brass bg-depth text-bone shadow-md font-medium scale-[1.02]"
                          : "border-ink/15 bg-bone/80 text-ink/75 hover:border-brass/50 hover:bg-bone"
                      }`}
                    >
                      {t(tmpl.nameKey)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Dimensions & Reset Bar */}
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 w-full lg:w-auto pt-3 lg:pt-0 border-t border-ink/8 lg:border-t-0 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3.5 text-xs text-ink/80 whitespace-nowrap bg-bone/70 px-3 py-1.5 rounded-full border border-ink/10 shadow-2xs">
                <Ruler className="h-3.5 w-3.5 text-brass shrink-0" />

                <label className="inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                  <span>{lang === "bn" ? "প্রস্থ" : "Width"}:</span>
                  <input
                    type="number"
                    min={3}
                    max={12}
                    step={0.5}
                    value={roomWidth}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    onBlur={handleWidthBlur}
                    className="w-12 sm:w-14 bg-bone border border-brass/30 rounded-xs px-1.5 sm:px-2 py-0.5 text-ink text-center font-bold text-xs shadow-inner focus:outline-none focus:border-brass"
                  />
                  <span className="text-ink/60 font-mono">{lang === "bn" ? "মি" : "m"}</span>
                </label>

                <span className="text-ink/20">|</span>

                <label className="inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                  <span>{lang === "bn" ? "দৈর্ঘ্য" : "Length"}:</span>
                  <input
                    type="number"
                    min={3}
                    max={12}
                    step={0.5}
                    value={roomLength}
                    onChange={(e) => handleLengthChange(e.target.value)}
                    onBlur={handleLengthBlur}
                    className="w-12 sm:w-14 bg-bone border border-brass/30 rounded-xs px-1.5 sm:px-2 py-0.5 text-ink text-center font-bold text-xs shadow-inner focus:outline-none focus:border-brass"
                  />
                  <span className="text-ink/60 font-mono">{lang === "bn" ? "মি" : "m"}</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleResetPreset}
                className="inline-flex items-center gap-1.5 text-xs text-ink/60 hover:text-ink transition-colors cursor-pointer shrink-0 whitespace-nowrap ml-auto sm:ml-0 bg-bone/60 hover:bg-bone px-3 py-1.5 rounded-full border border-ink/10 shadow-2xs"
                title="Reset to Template Default"
              >
                <RefreshCw className="h-3.5 w-3.5 text-bronze" />
                <span className="hidden sm:inline font-medium">{t("planner.reset")}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Main Planner Grid: Left Canvas & Right Catalog */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 mb-10">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Interactive Floorplan / 3D Canvas (8 Cols) */}
            <div className="lg:col-span-8 space-y-3.5 w-full min-w-0">
              {/* Dual View Switcher: 3D Spatial Studio vs 2D CAD Blueprint */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-bone rounded-sm border border-brass/35 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[0.68rem] uppercase tracking-widest text-ink/60 font-semibold font-mono hidden sm:inline">
                    {lang === "bn" ? "ভিউ মোড:" : "VIEWPORT:"}
                  </span>
                  <div className="inline-flex items-center p-1 bg-sand/60 border border-ink/10 rounded-full shadow-inner">
                    <button
                      type="button"
                      onClick={() => setViewMode("3d")}
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                        viewMode === "3d"
                          ? "bg-depth text-bone shadow-md"
                          : "text-ink/65 hover:text-ink"
                      }`}
                    >
                      <Box className="h-3.5 w-3.5 text-brass" />
                      <span>{t("planner.view3d")}</span>
                      {viewMode === "3d" && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("2d")}
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                        viewMode === "2d"
                          ? "bg-depth text-bone shadow-md"
                          : "text-ink/65 hover:text-ink"
                      }`}
                    >
                      <Compass className="h-3.5 w-3.5 text-brass" />
                      <span>{t("planner.view2d")}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[0.7rem] text-ink/70 font-mono">
                  {viewMode === "3d" ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                      <Sparkles className="h-3 w-3 text-emerald-600" />
                      <span className="font-semibold">
                        {lang === "bn" ? "৩ডি লাইভ ওয়েবজিএল ইঞ্জিন সক্রিয়" : "3D Live WebGL Engine Active"}
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-bronze bg-sand/40 px-2.5 py-1 rounded-full border border-brass/30 shadow-2xs">
                      <Ruler className="h-3 w-3 text-bronze" />
                      <span className="font-semibold">
                        {lang === "bn" ? "আর্কিটেকচারাল সিএডি ব্লুপ্রিন্ট" : "Architectural CAD Blueprint"}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Viewport Canvas: 3D Engine or 2D Architectural Editor */}
              {viewMode === "3d" ? (
                <Room3DCanvas
                  roomWidth={roomWidth}
                  roomLength={roomLength}
                  placedItems={placedItems}
                  selectedItemId={selectedItemId}
                  catalog={CATALOG}
                  overlappingItemIds={overlappingItemIds}
                  onSelectItem={(id) => setSelectedItemId(id)}
                  onMoveItem={handleMoveItem}
                  onRotateItem={handleRotateSelected}
                  onDuplicateItem={handleDuplicateSelected}
                  onDeleteItem={handleDeleteSelected}
                />
              ) : (
                <div
                  ref={canvasRef}
                  onClick={(e) => {
                    if (e.target === canvasRef.current || e.target.id === "room-floor") {
                      setSelectedItemId(null);
                    }
                  }}
                  className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#F3EFE6] border-2 border-ink/15 rounded-sm overflow-hidden flex items-center justify-center p-4 sm:p-8 select-none shadow-xl cursor-default touch-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(22, 41, 43, 0.06) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(22, 41, 43, 0.06) 1px, transparent 1px)
                    `,
                    backgroundSize: `${pixelsPerMeter * 0.5}px ${pixelsPerMeter * 0.5}px`,
                  }}
                >
                  {/* Scaled Room Container Wall */}
                  <div
                    id="room-floor"
                    className="relative bg-[#FAF7F0] border-4 border-depth shadow-2xl transition-all duration-300"
                    style={{
                      width: `${roomWidth * pixelsPerMeter}px`,
                      height: `${roomLength * pixelsPerMeter}px`,
                    }}
                  >
                    {/* Architectural Outer Dimension Guides */}
                    <div className="absolute -top-6 left-0 right-0 flex items-center justify-between text-[0.62rem] font-mono text-ink/60 pointer-events-none px-1">
                      <span>├</span>
                      <span className="bg-bone px-1.5 py-0.2 border border-ink/10 rounded-2xs font-bold text-depth">
                        {roomWidth.toFixed(1)}m
                      </span>
                      <span>┤</span>
                    </div>

                    <div className="absolute -left-6 top-0 bottom-0 flex flex-col items-center justify-between text-[0.62rem] font-mono text-ink/60 pointer-events-none py-1">
                      <span>┬</span>
                      <span className="bg-bone px-1 py-0.2 border border-ink/10 rounded-2xs font-bold text-depth -rotate-90">
                        {roomLength.toFixed(1)}m
                      </span>
                      <span>┴</span>
                    </div>

                    {/* Subtle Wood Floorboard Lines */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-20"
                      style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(92, 58, 33, 0.15) 19px)`,
                      }}
                    />

                    {/* Architectural Entrance Swing Door Symbol */}
                    <div className="absolute top-0 left-0 w-10 h-10 border-r border-b border-depth/40 rounded-br-full pointer-events-none opacity-40">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-depth" />
                    </div>

                    {/* Room North / Orientation Tag */}
                    <div className="absolute top-2 left-12 flex items-center gap-1 text-[0.56rem] tracking-[0.24em] uppercase text-ink/40 font-bold pointer-events-none">
                      <Compass className="h-3 w-3 text-bronze" />
                      <span>{lang === "bn" ? "উত্তর প্রবেশদ্বার" : "North Entrance"}</span>
                    </div>

                    {/* Room Dimensions Stamp */}
                    <div className="absolute bottom-2 right-2 bg-bone/90 px-2 py-0.5 rounded-xs border border-ink/10 text-[0.58rem] tracking-wider text-ink/60 font-medium font-mono pointer-events-none shadow-2xs">
                      {roomWidth.toFixed(1)}{lang === "bn" ? "মি" : "m"} × {roomLength.toFixed(1)}{lang === "bn" ? "মি" : "m"} · {totalAreaM2} {lang === "bn" ? "বর্গমিটার" : "m²"}
                    </div>

                    {/* Placed Furniture Items */}
                    {placedItems.map((item) => {
                      const cat = CATALOG.find((c) => c.id === item.catId);
                      if (!cat) return null;

                      const isSelected = selectedItemId === item.id;
                      const isOverlapping = overlappingItemIds.has(item.id);
                      const isDark = cat.fill === "#5C3A21" || cat.fill === "#9C6B3C" || cat.fill === "#6D2E1F" || cat.fill === "#4A3528";
                      const itemWidthPx = cat.wM * pixelsPerMeter;
                      const itemDepthPx = cat.dM * pixelsPerMeter;

                      return (
                        <div
                          key={item.id}
                          onPointerDown={(e) => handlePointerDownItem(e, item)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItemId(item.id);
                          }}
                          style={{
                            left: `${item.x * pixelsPerMeter}px`,
                            top: `${item.y * pixelsPerMeter}px`,
                            width: `${itemWidthPx}px`,
                            height: `${itemDepthPx}px`,
                            transform: `rotate(${item.rot}deg)`,
                            transformOrigin: "center center",
                            zIndex: cat.category === "accents" ? 5 : isSelected ? 30 : 15,
                          }}
                          className={`absolute cursor-move transition-shadow touch-none select-none ${
                            isOverlapping
                              ? "ring-2 ring-rose-500 shadow-rose-500/50"
                              : isSelected
                              ? "ring-2 ring-brass shadow-2xl scale-[1.02]"
                              : "hover:ring-1 hover:ring-bronze/50 shadow-md"
                          }`}
                        >
                          {isOverlapping && (
                            <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[0.55rem] font-bold px-1 rounded-full shadow-md pointer-events-none z-50">
                              !
                            </span>
                          )}
                          <CADFurniturePiece
                            cat={cat}
                            isSelected={isSelected}
                            isDark={isDark}
                            lang={lang}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Canvas Floating Hints - hidden on mobile/tablet to avoid obscuring furniture */}
                  <div className="hidden lg:flex absolute top-3 right-3 bg-bone/90 backdrop-blur-md px-3 py-1 rounded-full border border-ink/10 text-[0.6rem] text-ink/60 font-medium pointer-events-none shadow-sm items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-bronze" />
                    <span>{t("planner.dragHint")}</span>
                  </div>
                </div>
              )}

              {/* Selected Item Floating Toolbar */}
              <AnimatePresence>
                {selectedItemData && (
                  <motion.div
                    key={selectedItemId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="p-3 sm:p-4 rounded-sm bg-bone border border-brass/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-7 sm:pr-0">
                      <div
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-sm border flex items-center justify-center font-bold text-xs shadow-inner shrink-0"
                        style={{ backgroundColor: selectedItemData.cat.fill, color: selectedItemData.cat.color }}
                      >
                        {selectedItemData.cat.wM}m
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-heading font-medium text-ink truncate">
                          {lang === "bn" ? selectedItemData.cat.nameBn : selectedItemData.cat.nameEn}
                        </h4>
                        <p className="text-[0.6rem] sm:text-[0.64rem] uppercase tracking-wider text-bronze font-medium truncate">
                          {selectedItemData.cat.timber} · ৳{selectedItemData.cat.price.toLocaleString(lang === "bn" ? "bn-BD" : "en-BD")}
                        </p>
                      </div>
                    </div>

                    {/* Quick Deselect / Dismiss Button on mobile */}
                    <button
                      type="button"
                      onClick={() => setSelectedItemId(null)}
                      className="absolute top-2.5 right-2.5 sm:hidden p-1 rounded-full text-ink/40 hover:text-ink hover:bg-sand/30 transition-colors cursor-pointer"
                      title={lang === "bn" ? "বন্ধ করুন" : "Deselect"}
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {/* Action buttons: 3-column equal grid on mobile, inline flex row on desktop */}
                    <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto shrink-0">
                      <button
                        type="button"
                        onClick={handleDuplicateSelected}
                        className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-ink/15 hover:border-brass bg-sand/40 text-[0.72rem] sm:text-xs text-ink transition-colors cursor-pointer whitespace-nowrap h-8 sm:h-9 font-medium"
                        title={lang === "bn" ? "কপি করুন" : "Duplicate Piece"}
                      >
                        <Copy className="h-3.5 w-3.5 text-bronze shrink-0" />
                        <span>{lang === "bn" ? "কপি" : "Duplicate"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRotateSelected}
                        className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-ink/15 hover:border-brass bg-sand/40 text-[0.72rem] sm:text-xs text-ink transition-colors cursor-pointer whitespace-nowrap h-8 sm:h-9 font-medium"
                        title="Rotate 90°"
                      >
                        <RotateCw className="h-3.5 w-3.5 text-bronze shrink-0" />
                        <span className="sm:hidden">{lang === "bn" ? "ঘোরান" : "Rotate"}</span>
                        <span className="hidden sm:inline">{t("planner.rotate")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDeleteSelected}
                        className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-red-200 hover:bg-red-50 text-[0.72rem] sm:text-xs text-red-600 transition-colors cursor-pointer whitespace-nowrap h-8 sm:h-9 font-medium"
                        title={t("planner.delete")}
                      >
                        <Trash2 className="h-3.5 w-3.5 shrink-0" />
                        <span className="sm:hidden">{lang === "bn" ? "মুছুন" : "Delete"}</span>
                        <span className="hidden sm:inline">{t("planner.delete")}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Catalog & Analytics Panel (4 Cols) */}
            <div className="lg:col-span-4 space-y-6 w-full min-w-0">
              {/* Spatial Analytics Card */}
              <div className="p-4 sm:p-6 rounded-sm bg-gradient-to-br from-[#122325] via-[#162A2D] to-[#0E1B1D] text-bone shadow-2xl space-y-4 sm:space-y-5 border border-brass/35 relative overflow-hidden">
                {/* Subtle Luxury Radial Highlight */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-brass/15 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-bone/15 pb-3 sm:pb-4 gap-2 relative z-10">
                  <div>
                    <span className="text-xs uppercase tracking-[0.18em] text-brass font-semibold flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-brass" />
                      <span>{t("planner.totalEstimate")}</span>
                    </span>
                    <h3 className="font-body text-2xl sm:text-4xl text-bone font-semibold mt-1 tracking-tight tabular-nums flex items-baseline gap-1">
                      <span className="text-brass font-bold text-[0.85em]">৳</span>
                      <span>{totalEstimate.toLocaleString(lang === "bn" ? "bn-BD" : "en-BD")}</span>
                    </h3>
                  </div>
                  <span className="text-xs uppercase tracking-wider text-brass bg-brass/15 px-3 py-1.5 rounded-full border border-brass/30 whitespace-nowrap shrink-0 font-medium font-body tabular-nums shadow-sm">
                    {lang === "bn" ? `${placedItems.length.toLocaleString("bn-BD")}টি আসবাব` : `${placedItems.length} Pieces`}
                  </span>
                </div>

                {/* Flow Bar */}
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between text-xs sm:text-sm text-bone/85 font-medium">
                    <span>{t("planner.spaceUtilized")}</span>
                    <span className="font-bold text-brass font-body tabular-nums">
                      {occupiedAreaM2} {lang === "bn" ? "বর্গমিটার" : "m²"} ({occupancyPercent}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-bone/10 rounded-full overflow-hidden p-0.5 border border-bone/10">
                    <div
                      className="h-full bg-gradient-to-r from-brass via-amber-400 to-brass transition-all duration-500 rounded-full shadow-sm"
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-bone/80 flex items-center justify-between pt-1">
                    <span>{t("planner.flowRating")}:</span>
                    <span className="text-bone font-medium bg-bone/10 px-2 py-0.5 rounded-xs border border-bone/10">
                      {t(`planner.${flowStatus}`)}
                    </span>
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="pt-2 space-y-2.5 relative z-10">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-brass via-[#DEB778] to-brass text-depth hover:from-bone hover:to-bone rounded-full py-3.5 px-4 text-xs sm:text-sm uppercase tracking-[0.14em] font-bold transition-all shadow-xl hover:shadow-2xl cursor-pointer text-center group"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{t("planner.sendWa")}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={pdfGenerating || placedItems.length === 0}
                    className="w-full inline-flex items-center justify-center gap-2 border border-bone/25 hover:border-brass text-bone hover:text-brass rounded-full py-2.5 sm:py-3 px-3 sm:px-5 text-xs sm:text-sm uppercase tracking-[0.12em] font-medium transition-colors disabled:opacity-50 cursor-pointer text-center bg-bone/5 hover:bg-bone/10"
                  >
                    <Download className="h-4 w-4 shrink-0" />
                    <span>{pdfGenerating ? (lang === "bn" ? "প্রস্তুত হচ্ছে..." : "Generating...") : t("planner.exportPdf")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openConsultation({
                        format: "home",
                        scope:
                          selectedTemplate.id === "study"
                            ? "office"
                            : selectedTemplate.id === "custom"
                            ? "living"
                            : selectedTemplate.id,
                      })
                    }
                    className="w-full text-center text-xs sm:text-sm uppercase tracking-[0.14em] text-bone/80 hover:text-brass font-medium transition-colors pt-2 cursor-pointer"
                  >
                    {t("planner.bookMeasure")} →
                  </button>
                </div>
              </div>

              {/* Furniture Catalog Drawer */}
              <div className="p-4 sm:p-6 rounded-sm bg-sand/50 border border-brass/25 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg sm:text-xl text-ink font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brass" />
                    <span>{t("planner.catalog")}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleClearCanvas}
                    className="text-[0.64rem] uppercase tracking-wider text-ink/45 hover:text-red-600 transition-colors cursor-pointer font-medium"
                  >
                    {t("planner.clear")}
                  </button>
                </div>

                {/* Catalog Category Pills */}
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {CATEGORIES.map((c) => {
                    const active = activeCatalogCategory === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveCatalogCategory(c.id)}
                        className={`px-3 py-1.5 rounded-full text-[0.65rem] sm:text-xs transition-all cursor-pointer ${
                          active
                            ? "bg-depth text-bone font-medium shadow-sm"
                            : "bg-bone border border-ink/10 text-ink/75 hover:border-brass/50 hover:bg-bone"
                        }`}
                      >
                        {lang === "bn" ? c.labelBn : c.labelEn}
                      </button>
                    );
                  })}
                </div>

                {/* Catalog List */}
                <div
                  data-lenis-prevent
                  onWheel={(e) => e.stopPropagation()}
                  className="max-h-[360px] sm:max-h-[420px] overflow-y-auto overscroll-contain space-y-2 pr-1"
                >
                  {filteredCatalog.map((catItem) => (
                    <button
                      key={catItem.id}
                      type="button"
                      onClick={() => handleAddItem(catItem)}
                      className="w-full p-3 rounded-sm bg-bone border border-ink/8 hover:border-brass hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-between text-left group cursor-pointer gap-2.5"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className="h-9 w-9 rounded-xs border flex items-center justify-center font-bold text-[0.65rem] shrink-0 shadow-inner group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: catItem.fill, color: catItem.color }}
                        >
                          {catItem.wM}m
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-ink group-hover:text-bronze transition-colors truncate">
                            {lang === "bn" ? catItem.nameBn : catItem.nameEn}
                          </p>
                          <p className="text-[0.6rem] sm:text-[0.64rem] text-ink/50 font-mono truncate">
                            {catItem.wM}m × {catItem.dM}m · {catItem.timber}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-ink whitespace-nowrap tabular-nums">
                          ৳{catItem.price.toLocaleString(lang === "bn" ? "bn-BD" : "en-BD")}
                        </span>
                        <div className="h-6 w-6 rounded-full bg-sand/80 text-ink/70 group-hover:bg-brass group-hover:text-depth flex items-center justify-center transition-all shrink-0 shadow-2xs group-hover:scale-110">
                          <Plus className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
