import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AlertsListener() {
  const [alerts, setAlerts] = useState([]);
  const processedIds = useRef(new Set()); // 🔥 important

  useEffect(() => {
    const q = query(
      collection(db, "alerts"),
      orderBy("timestamp", "desc")
    );

    let initialized = false;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // ❌ ignore old alerts
      if (!initialized) {
        initialized = true;
        console.log("⏭️ Ignored old alerts");
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const id = change.doc.id;

          // ❌ duplicate block (GLOBAL)
          if (processedIds.current.has(id)) {
            return;
          }

          processedIds.current.add(id); // mark as processed

          const newAlert = {
            id,
            ...change.doc.data()
          };

          console.log("🚨 NEW ALERT:", newAlert);

          // 🔴 add alert
          setAlerts((prev) => {
            const updated = [newAlert, ...prev];
            return updated.slice(0, 5);
          });

          // ⏱ remove after 10 sec
          setTimeout(() => {
  setAlerts((prev) =>
    prev.filter((a) => a.id !== id)
  );
}, 10000);
        }
      });
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

// 🔴 ALERT CARD
function AlertCard({ alert }) {
  const nav = useNavigate(); // 👈 inside function

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

      {/* 🔥 DETAILS BUTTON ADD KAR */}
      <button
        onClick={() => nav("/alerts")}
        style={{
          marginTop: "10px",
          width: "100%",
          background: "#111827",
          border: "1px solid #1f2937",
          padding: "6px",
          borderRadius: "6px",
          color: "white",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        Details
      </button>
    </div>
  );
}