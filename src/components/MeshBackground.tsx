export function MeshBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ background: "#08080a" }}>
      {/* Gold top-left glow */}
      <div style={{ position:"absolute", top:0, left:0, width:"70vw", height:"55vh",
        background:"radial-gradient(ellipse 70% 60% at 20% 0%, rgba(201,166,100,0.22) 0%, transparent 65%)",
        filter:"blur(60px)" }} />
      {/* Gold top-right ambient */}
      <div style={{ position:"absolute", top:0, right:0, width:"60vw", height:"50vh",
        background:"radial-gradient(ellipse 60% 55% at 90% 20%, rgba(255,232,168,0.12) 0%, transparent 60%)",
        filter:"blur(50px)" }} />
      {/* Gold bottom ambient */}
      <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:"90vw", height:"40vh",
        background:"radial-gradient(ellipse 80% 55% at 50% 100%, rgba(135,107,44,0.20) 0%, transparent 65%)",
        filter:"blur(70px)" }} />

      {/* Gold grid lines with top mask */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:"linear-gradient(rgba(201,166,100,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(201,166,100,0.045) 1px, transparent 1px)",
        backgroundSize:"36px 36px",
        WebkitMaskImage:"radial-gradient(ellipse 100% 80% at 50% 0%, #000, transparent 70%)",
        maskImage:"radial-gradient(ellipse 100% 80% at 50% 0%, #000, transparent 70%)",
      }} />

      {/* Film grain noise */}
      <svg aria-hidden style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.10, pointerEvents:"none" }} xmlns="http://www.w3.org/2000/svg">
        <filter id="noise-bg">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-bg)" />
      </svg>
    </div>
  );
}
