import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function AlertsListener() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    let isInitialLoad = true;

    const q = query(
      collection(db, "alerts"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // ❌ old alerts ignore
      if (isInitialLoad) {
        isInitialLoad = false;
        console.log("⏭️ Initial alerts ignored");
        return;
      }

      const newAlerts = [];

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newAlert = {
            id: change.doc.id,
            ...change.doc.data()
          };

          console.log("🚨 NEW ALERT:", newAlert);

          newAlerts.push(newAlert);
        }
      });

      if (newAlerts.length > 0) {
        setAlerts((prev) => {
          const updated = [...newAlerts, ...prev];
          return updated.slice(0, 5); // 🔥 max 5
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // ⏱ auto remove every 10 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prev) => prev.slice(0, -1)); // remove oldest
    }, 10000);

    return () => clearInterval(interval);
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

// 🔴 ALERT CARD
function AlertCard({ alert }) {
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
        animation: "fadeIn 0.3s ease",
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
          onClick={() => console.log("Details:", alert)}
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
      </div>
    </div>
  );
}