import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function Home() {
  const nav = useNavigate();

  const [recentImages, setRecentImages] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const [logs, setLogs] = useState([]);

  // 🚨 ALERT STATES
  const [alerts, setAlerts] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [lastAlertId, setLastAlertId] = useState(null);

  const STREAM_URL =
    "https://integrating-dryer-lime-compilation.trycloudflare.com/video";

  // 🔥 DETECTIONS
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

  // 🚨 ALERTS (NEW)
  useEffect(() => {
    const q = query(
      collection(db, "alerts"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();

        return {
          id: doc.id,
          type: d.type,
          zone: d.zone_id,
          dwell: d.dwell_time,
          timestamp: d.timestamp?.toDate
            ? d.timestamp.toDate()
            : new Date(d.timestamp),
          image: d.image_url || null,
        };
      });

      setAlerts(data);

      if (data.length > 0) {
        const latest = data[0];

        if (
          (latest.type === "dwell" || latest.type === "loitering") &&
          latest.id !== lastAlertId
        ) {
          setActiveAlert(latest);
          setLastAlertId(latest.id);
        }
      }
    });

    return () => unsubscribe();
  }, [lastAlertId]);

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
        }}
      >
        {/* 🎥 Live Feed */}
        <div
          className="card"
          onClick={(e) => {
            if (e.target.tagName !== "IMG") nav("/live");
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
                fontSize: "13px",
                background: "rgba(0,0,0,0.5)",
                padding: "5px 10px",
                borderRadius: "6px",
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
          <h3>Recent Photos</h3>

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

        {/* 📜 Logs */}
        <div className="card" onClick={() => nav("/logs")}>
          <h3>Recent Logs</h3>

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
                  <td style={{ color: log.score >= 7 ? "green" : "orange" }}>
                    {log.score}
                  </td>
                  <td>{log.dateStr}</td>
                  <td>{log.timeStr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📊 Analytics */}
        <div className="card" onClick={() => nav("/analytics")}>
          <h3>Analytics</h3>
        </div>
      </div>

      {/* 🔥 IMAGE MODAL */}
      {selectedImg && (
        <div className="modal" onClick={() => setSelectedImg(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <span onClick={() => setSelectedImg(null)}>✕</span>
            <img src={selectedImg} />
          </div>
        </div>
      )}

      {/* 🚨 ALERT POPUP */}
      {activeAlert && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "300px",
            background: "#0f172a",
            border: "1px solid #1f2937",
            borderRadius: "10px",
            padding: "14px",
            zIndex: 999,
          }}
        >
          <div style={{ textAlign: "right" }}>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setActiveAlert(null)}
            >
              ✕
            </span>
          </div>

          <div style={{ color: "red", fontWeight: "bold" }}>
            🚨 Alert Detected
          </div>

          <div style={{ fontSize: "13px", marginTop: "6px" }}>
            Type: <b>{activeAlert.type}</b>
            <br />
            Zone: {activeAlert.zone}
            <br />
            Dwell: {activeAlert.dwell?.toFixed(2)} sec
          </div>

          {activeAlert.image && (
            <img
              src={activeAlert.image}
              style={{ width: "100%", marginTop: "10px" }}
            />
          )}

          <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
            <button onClick={() => setActiveAlert(null)}>Dismiss</button>

            <button
              onClick={() => {
                nav("/analytics", { state: activeAlert });
                setActiveAlert(null);
              }}
            >
              Details
            </button>
          </div>
        </div>
      )}
    </>
  );
}