import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function AlertsListener() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "alerts"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newAlerts = [];

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          newAlerts.push({
            id: change.doc.id,
            ...change.doc.data()
          });
        }
      });

      if (newAlerts.length > 0) {
        setAlerts((prev) => {
          const updated = [...newAlerts, ...prev];
          return updated.slice(0, 5); // 🔥 max 5 alerts
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
}

// 🔴 SINGLE ALERT CARD
function AlertCard({ alert }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000); // auto remove after 5 sec
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        background: "#0b1220",
        color: "white",
        padding: "12px",
        borderRadius: "10px",
        width: "260px",
        border: "1px solid #1f2937",
        boxShadow: "0 0 10px rgba(0,0,0,0.6)",
      }}
    >
      <div style={{ color: "#ef4444", fontWeight: "bold" }}>
        🚨 Alert
      </div>

      <div style={{ fontSize: "13px", marginTop: "5px" }}>
        Track: {alert.track_id}
      </div>

      <div style={{ fontSize: "12px", color: "#9ca3af" }}>
        Zone: {alert.zone_id}
      </div>

      <div style={{ marginTop: "8px" }}>
        <button
          style={{
            fontSize: "12px",
            padding: "4px 8px",
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Details
        </button>

        <button
          onClick={() => setShow(false)}
          style={{
            marginLeft: "6px",
            fontSize: "12px",
            padding: "4px 8px",
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "5px",
            color: "#ef4444",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}