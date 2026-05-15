export function MeshBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "#0a0a1a" }}
    >
      {/* Indigo radial glow top-right */}
      <div
        className="absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(79,70,229,0.45) 0%, rgba(79,70,229,0) 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Money green glow bottom-left */}
      <div
        className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(34,197,94,0.35) 0%, rgba(34,197,94,0) 70%)",
          filter: "blur(50px)",
        }}
      />
      {/* Subtle violet center */}
      <div
        className="absolute top-1/3 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.4) 0%, rgba(124,58,237,0) 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Grid lines */}
      <div className="absolute inset-0 grid-lines opacity-40" />
    </div>
  );
}
