export function MeshBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Violet radial glow top-right */}
      <div
        className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(79,26,214,0.35) 0%, rgba(79,26,214,0) 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Secondary violet glow bottom-left */}
      <div
        className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(79,26,214,0.20) 0%, rgba(79,26,214,0) 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Subtle center glow */}
      <div
        className="absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(79,26,214,0.08) 0%, rgba(79,26,214,0) 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Vibrating dot grid */}
      <div className="dot-grid absolute inset-0" />
    </div>
  );
}
