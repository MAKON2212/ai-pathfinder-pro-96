import { useEffect, useRef } from "react";

/**
 * Nubien-style custom cursor:
 * - Small solid dot that snaps to mouse position instantly
 * - Larger ring that follows with a smooth lag
 * - Ring scales up on interactive elements
 * - Default OS cursor hidden via CSS (styles.css)
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const hoveringRef = useRef(false);

  useEffect(() => {
    // Only run on desktop — mobile has no pointer
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onEnterInteractive = () => { hoveringRef.current = true; };
    const onLeaveInteractive = () => { hoveringRef.current = false; };

    const bindInteractive = () => {
      document
        .querySelectorAll("a, button, [role='button'], input, select, textarea, label")
        .forEach((el) => {
          el.addEventListener("mouseenter", onEnterInteractive);
          el.addEventListener("mouseleave", onLeaveInteractive);
        });
    };

    // Animate ring with spring-like lag
    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.14;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.14;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`;
      }
      if (ringRef.current) {
        const size = hoveringRef.current ? 44 : 28;
        ringRef.current.style.transform = `translate(${ring.current.x - size / 2}px, ${ring.current.y - size / 2}px)`;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.opacity = hoveringRef.current ? "0.6" : "0.35";
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    bindInteractive();

    // Re-bind when DOM changes (dynamic content)
    const observer = new MutationObserver(bindInteractive);
    observer.observe(document.body, { childList: true, subtree: true });

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Dot — snaps to cursor */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-[#E8CB85]"
        style={{ willChange: "transform" }}
      />
      {/* Ring — follows with lag */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-[rgba(232,203,133,0.5)]"
        style={{ willChange: "transform", width: 28, height: 28, transition: "width 0.2s, height 0.2s, opacity 0.2s" }}
      />
    </>
  );
}
