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

    let initialized = false;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // ❌ ignore old alerts on first load
      if (!initialized) {
        initialized = true;
        console.log("⏭️ Ignored old alerts");
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newAlert = {
            id: change.doc.id,
            ...change.doc.data()
          };

          console.log("🚨 NEW ALERT:", newAlert);

          setAlerts((prev) => {
            // ❌ duplicate block BEFORE adding
            if (prev.some((a) => a.id === newAlert.id)) {
              return prev;
            }

            // ⏱ timer only once (inside same block)
            setTimeout(() => {
              setAlerts((curr) =>
                curr.filter((a) => a.id !== newAlert.id)
              );
            }, 10000);

            const updated = [newAlert, ...prev];
            return updated.slice(0, 5); // max 5 alerts
          });
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