/**
 * Nubien-inspired background:
 * - Near-pure black base (#050507)
 * - Dramatic top-centre nebula glow — the Nubien signature beam
 * - Fine dot grid overlay
 * - Film-grain noise texture
 */
export function MeshBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background: "#050507" }}
    >
      {/* ── OUTER GLOW — wide diffuse halo at top ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "140vw",
          height: "55vh",
          background:
            "radial-gradient(ellipse 100% 80% at 50% 0%, rgba(72,32,220,0.58) 0%, rgba(50,18,180,0.32) 50%, transparent 72%)",
          filter: "blur(50px)",
        }}
      />
      {/* ── INNER CORE — tighter, brighter beam right at the top ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80vw",
          height: "38vh",
          background:
            "radial-gradient(ellipse 70% 65% at 50% 0%, rgba(105,55,255,0.60) 0%, rgba(79,26,214,0.28) 55%, transparent 75%)",
          filter: "blur(28px)",
        }}
      />
      {/* ── HIGHLIGHT — very bright concentrated strip at top edge ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "50vw",
          height: "22vh",
          background:
            "radial-gradient(ellipse 65% 55% at 50% 0%, rgba(130,80,255,0.45) 0%, transparent 65%)",
          filter: "blur(16px)",
        }}
      />
      {/* ── FAINT BOTTOM AMBIENT ── keeps page from feeling dead-black at the bottom ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "90vw",
          height: "35vh",
          background:
            "radial-gradient(ellipse 85% 60% at 50% 100%, rgba(55,18,170,0.20) 0%, transparent 68%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── DOT GRID ── */}
      <div className="dot-grid absolute inset-0" />

      {/* ── FILM GRAIN NOISE ── */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.12,
          pointerEvents: "none",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noise-bg">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-bg)" />
      </svg>
    </div>
  );
}
