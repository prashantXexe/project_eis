export default function LivePage() {
  // 🔥 DIRECT URL (NO ENV)
  const url =
    "https://vinyl-routine-distant-june.trycloudflare.com/video";

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
        background: "#020617"   // 🔥 dark bg (pro look)
      }}
    >
      {/* 🔥 TITLE */}
      <h2
        style={{
          color: "#22c55e",
          fontWeight: "600",
          letterSpacing: "1px",
          textShadow: "0 0 10px rgba(34,197,94,0.6)"
        }}
      >
        🔴 Cam 1 Live Feed
      </h2>

      {/* 🔥 VIDEO */}
      <div
        style={{
          width: "700px",
          maxWidth: "90%",
          aspectRatio: "4 / 3",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#000",
          boxShadow: "0 0 25px rgba(0,0,0,0.7)"
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