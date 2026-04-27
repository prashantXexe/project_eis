import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function Home() {
  const nav = useNavigate();

  const [recentImages, setRecentImages] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const [logs, setLogs] = useState([]);

  // 🔥 DIRECT STREAM URL (NO ENV)
  const STREAM_URL =
    "";

  // 🔥 REALTIME DATA
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
        <div className="card" onClick={() => nav("/live")}>
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
            {/* 🔥 OVERLAY */}
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

            {/* 🔥 VIDEO */}
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
            <table>
              <thead>
                <tr>
                  <th>Track</th>
                  <th>Score</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {logs.slice(0, 5).map((log) => (
                  <tr key={log.id}>
                    <td>{log.trackId}</td>
                    <td
                      style={{
                        color: log.score >= 7 ? "#22c55e" : "#f59e0b",
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
          <h3>Analytics</h3>
        </div>
      </div>

      {/* 🔥 IMAGE MODAL */}
      {selectedImg && (
        <div className="modal" onClick={() => setSelectedImg(null)}>
          <div
            className="modalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="closeBtn"
              onClick={() => setSelectedImg(null)}
            >
              ✕
            </span>

            <img src={selectedImg} className="modalImg" />
          </div>
        </div>
      )}
    </>
  );
}