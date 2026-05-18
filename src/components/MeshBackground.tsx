/**
 * Nubien-style background:
 * - Pure black base
 * - Dramatic bottom-center violet arc glow (the Nubien signature)
 * - Fine dot grid + film grain
 */
export function MeshBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Dot grid */}
      <div className="dot-grid absolute inset-0 opacity-50" />

      {/* Bottom arc — outer halo */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "-40vh",
          transform: "translateX(-50%)",
          width: "140vw",
          height: "100vh",
          background:
            "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(99,44,255,0.55) 0%, rgba(79,26,214,0.30) 38%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      {/* Bottom arc — bright core */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "-25vh",
          transform: "translateX(-50%)",
          width: "85vw",
          height: "60vh",
          background:
            "radial-gradient(ellipse 50% 55% at 50% 50%, rgba(140,90,255,0.55) 0%, rgba(99,44,255,0.25) 50%, transparent 72%)",
          filter: "blur(24px)",
        }}
      />
      {/* Subtle top ambient */}
      <div
        style={{
          position: "absolute",
          top: "-30vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: "55vh",
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(60,20,180,0.18) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* Film grain */}
      <svg
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }}
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
