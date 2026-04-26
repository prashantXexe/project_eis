import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function Live() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const url = "YOUR_M3U8_LINK"; // 🔥 यहाँ अपना stream डाल

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Live Feed</h2>

      <video
        ref={videoRef}
        controls
        autoPlay
        style={{
          width: "100%",
          borderRadius: "12px",
          background: "#000"
        }}
      />
    </div>
  );
}