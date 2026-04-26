export default function LivePage() {
  const url =
    import.meta.env.VITE_STREAM_URL ||
    "https://leslie-newsletter-inter-epa.trycloudflare.com/video";

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",   // 🔥 important
        justifyContent: "center",
        alignItems: "center",
        gap: "15px"
      }}
    >
      {/* 🔥 TITLE */}
      <h2
        style={{
          color: "#fff",
          fontWeight: "600",
          letterSpacing: "1px"
        }}
      >
        Cam 1
      </h2>

      {/* 🔥 VIDEO */}
      <div
        style={{
          width: "800px",
          aspectRatio: "4 / 3",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#000",
          boxShadow: "0 0 20px rgba(0,0,0,0.6)"
        }}
      >
        <img
          src={url}
          alt="Live"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      </div>
    </div>
  );
}