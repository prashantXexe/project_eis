import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";


export default function Home() {
  const nav = useNavigate();

  const [recentImages, setRecentImages] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const [logs, setLogs] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");
  const [alerts, setAlerts] = useState([]);
const [selectedAlert, setSelectedAlert] = useState(null);

  // 🔥 DIRECT STREAM URL (NO ENV)
  const STREAM_URL =
    "http://10.51.16.148:8889/live/";

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
  useEffect(() => {
  const q = query(
    collection(db, "alerts"),
    orderBy("timestamp", "desc")
  );

  const unsub = onSnapshot(q, (snap) => {
    const data = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setAlerts(data.slice(0, 5));
  });

  return () => unsub();
}, []);
  return (
    <>
    <div style={{
  position: "fixed",
  bottom: "20px",
  right: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  zIndex: 9999
}}>
  {alerts.map((a) => (
    <div key={a.id} style={{
      background: "#111827",
      color: "white",
      padding: "12px",
      borderRadius: "8px",
      width: "250px",
      border: "1px solid #ef4444"
    }}>
      <div style={{ fontWeight: "bold", color: "#ef4444" }}>
        🚨 {a.type.toUpperCase()}
      </div>

      <div style={{ fontSize: "12px", marginTop: "5px" }}>
        Track ID: {a.track_id}
      </div>

      <div style={{ marginTop: "8px", display: "flex", gap: "6px" }}>
        
        <button
          onClick={() => setAlerts(alerts.filter(x => x.id !== a.id))}
          style={{
            flex: 1,
            background: "#374151",
            border: "none",
            color: "white",
            padding: "5px",
            borderRadius: "4px"
          }}
        >
          Ignore
        </button>

        <button
          onClick={() => setSelectedAlert(a)}
          style={{
            flex: 1,
            background: "#ef4444",
            border: "none",
            color: "white",
            padding: "5px",
            borderRadius: "4px"
          }}
        >
          Details
        </button>

      </div>
    </div>
  ))}
</div>
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
                src={img}
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
        {selectedAlert && (
  <div
    onClick={() => setSelectedAlert(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#111827",
        padding: "20px",
        borderRadius: "10px",
        width: "400px",
        color: "white"
      }}
    >
      <h3>🚨 Alert Details</h3>

      <p><b>Type:</b> {selectedAlert.type}</p>
      <p><b>Track ID:</b> {selectedAlert.track_id}</p>
      <p><b>Zone:</b> {selectedAlert.zone_id}</p>

      {selectedAlert.dwell_time && (
        <p><b>Dwell:</b> {selectedAlert.dwell_time}s</p>
      )}

      <img
        src={recentImages[0]}
        style={{ width: "100%", borderRadius: "8px" }}
      />

      <button
        onClick={() => setSelectedAlert(null)}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "8px",
          background: "#ef4444",
          border: "none",
          color: "white",
          borderRadius: "6px"
        }}
      >
        Close
      </button>
    </div>
  </div>
)}
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