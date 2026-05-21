/**
 * Gold tech background:
 * - Near-black canvas
 * - Warm champagne/gold ambient glow (top + bottom)
 * - Subtle film grain
 */
export function MeshBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "#08080A" }}
    >
      {/* Bottom warm gold halo */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "-40vh",
          transform: "translateX(-50%)",
          width: "140vw",
          height: "100vh",
          background:
            "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(212,176,98,0.32) 0%, rgba(180,140,70,0.18) 38%, transparent 65%)",
          filter: "blur(48px)",
        }}
      />
      {/* Bottom bright core — champagne */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "-25vh",
          transform: "translateX(-50%)",
          width: "85vw",
          height: "60vh",
          background:
            "radial-gradient(ellipse 50% 55% at 50% 50%, rgba(232,201,122,0.32) 0%, rgba(212,176,98,0.16) 50%, transparent 72%)",
          filter: "blur(28px)",
        }}
      />
      {/* Top warm ambient */}
      <div
        style={{
          position: "absolute",
          top: "-35vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: "55vh",
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(160,120,55,0.16) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* Film grain */}
      <svg
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.10 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noise-bg">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-bg)" />
      </svg>
    </div>
  );
}
