import { useEffect, useState } from "react";

// Desktop-only bronze cursor that expands to "VIEW" over collection imagery.
// Hidden entirely on touch / coarse pointers.
export default function CursorView() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [view, setView] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e) =>
      setView(!!(e.target?.closest && e.target.closest("[data-cursor='view']")));
    const leave = () => setPos({ x: -100, y: -100 });
    const onTouch = () => setEnabled(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mouseleave", leave);
    window.addEventListener("touchstart", onTouch, { passive: true, once: true });

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", leave);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

  if (!enabled || pos.x < 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[100] hidden md:flex items-center justify-center rounded-full"
      style={{
        left: pos.x,
        top: pos.y,
        width: view ? 86 : 14,
        height: view ? 86 : 14,
        transform: "translate(-50%, -50%)",
        backgroundColor: view ? "#8C7355" : "transparent",
        border: view ? "none" : "1px solid rgba(140,115,85,0.55)",
        transition: "width 0.3s ease, height 0.3s ease, background-color 0.3s ease",
      }}
    >
      {view && (
        <span className="text-[0.62rem] font-medium tracking-[0.22em] text-bone uppercase select-none">
          View
        </span>
      )}
    </div>
  );
}