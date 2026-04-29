import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import InsightsChart from "../pages/InsightsChart";

export default function Home() {
  const nav = useNavigate();

  const [recentImages, setRecentImages] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const [logs, setLogs] = useState([]);
  const [chartData, setChartData] = useState([]); // 🔥 NEW

  // 🔥 DIRECT STREAM URL (NO ENV)
  const STREAM_URL =
    "https://integrating-dryer-lime-compilation.trycloudflare.com/video";

  // 🔥 REALTIME DATA (DETECTIONS)
  useEffect(() => {
    const q = query(
      collection(db, "detections"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();

        const dateObj = d.timestamp?.toDate
          ? d.timestamp.toDate()
          : new Date(d.timestamp);

        return {
          id: doc.id,
          trackId: d.track_id,
          score: d.score,
          dateStr: dateObj.toLocaleDateString(),
          timeStr: dateObj.toLocaleTimeString(),
          imageUrl: d.image_url,
        };
      });

      setRecentImages(data.slice(0, 6).map((d) => d.imageUrl));
      setLogs(data);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 REALTIME ANALYTICS (NEW)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "alerts"), (snapshot) => {
      let intrusion = 0;
      let dwell = 0;
      let loitering = 0;

      const now = new Date();
      const last24 = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      snapshot.forEach((doc) => {
        const d = doc.data();

        const time = d.timestamp?.toDate
          ? d.timestamp.toDate()
          : new Date(d.timestamp);

        const type = d.type?.toLowerCase();

        if (time >= last24) {
          if (type === "intrusion") intrusion++;
          if (type === "dwell") dwell++;
          if (type === "loiter" || type === "loitering") loitering++;
        }
      });

      const total = intrusion + dwell + loitering;

      setChartData([
        { name: "Total", value: total, color: "#3b82f6" },
        { name: "Intrusion", value: intrusion, color: "#ef4444" },
        { name: "Dwell", value: dwell, color: "#f59e0b" },
        { name: "Loitering", value: loitering, color: "#10b981" },
      ]);
    });

    return () => unsub();
  }, []);

  return (
    <>
      <div
        style={{
          height: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "10px",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        {/* 🎥 Live Feed */}
        <div
          className="card"
          onClick={(e) => {
            if (e.target.tagName !== "IMG") {
              nav("/live");
            }
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              aspectRatio: "4 / 3",
              background: "#000",
              borderRadius: "10px",
              overflow: "hidden",
              margin: "0 auto",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                color: "#22c55e",
                fontWeight: "600",
                fontSize: "13px",
                background: "rgba(0,0,0,0.5)",
                padding: "5px 10px",
                borderRadius: "6px",
                textShadow: "0 0 6px rgba(34,197,94,0.7)",
              }}
            >
              🔴 Cam 1
            </div>

            <img
              src={STREAM_URL}
              alt="Live"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* 🖼️ Recent Photos */}
        <div className="card" onClick={() => nav("/storage")}>
          <h3 className="cardTitle">Recent Photos</h3>

          <div className="recentGrid">
            {recentImages.map((img, i) => (
              <img
                key={i}
                src={`${img}?t=${Date.now()}`}
                alt=""
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImg(img);
                }}
              />
            ))}
          </div>
        </div>

        {/* 📜 Recent Logs */}
        <div className="card" onClick={() => nav("/logs")}>
          <h3 className="cardTitle">Recent Logs</h3>

          <div className="recentLogs">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1f2937" }}>
                  <th>Track</th>
                  <th>Score</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {logs.slice(0, 5).map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid #1f2937" }}>
                    <td>{log.trackId}</td>
                    <td
                      style={{
                        color: log.score >= 7 ? "#22c55e" : "#f59e0b",
                        fontWeight: "bold",
                      }}
                    >
                      {log.score}
                    </td>
                    <td>{log.dateStr}</td>
                    <td>{log.timeStr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 📊 Analytics */}
        <div className="card" onClick={() => nav("/analytics")}>
          <h3 className="cardTitle">Analytics</h3>

          <div style={{ height: "180px" }}>
            <InsightsChart data={chartData} small />
          </div>
        </div>
      </div>

      {/* 🔥 IMAGE MODAL */}
      {selectedImg && (
        <div className="modal" onClick={() => setSelectedImg(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <span className="closeBtn" onClick={() => setSelectedImg(null)}>
              ✕
            </span>

            <img src={selectedImg} className="modalImg" />
          </div>
        </div>
      )}
    </>
  );
}