import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function AlertsListener() {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    console.log("🔥 Alerts listener running...");

    const q = query(
      collection(db, "alerts"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newAlert = {
            id: change.doc.id,
            ...change.doc.data()
          };

          console.log("🚨 NEW ALERT:", newAlert);

          setAlert(newAlert); // 🔥 popup trigger
        }
      });
    });

    return () => unsubscribe();
  }, []);

  // 🔥 IMPORTANT RETURN
  return alert ? <AlertPopup alert={alert} /> : null;
}
// 🔴 POPUP UI
function AlertPopup({ alert }) {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div style={{
  position: "fixed",
  top: "20px",
  right: "20px",   // 👉 SIDE (right corner)
  zIndex: 9999,    // 👉 sabke upar
  background: "#111827",
  color: "white",
  padding: "15px",
  borderRadius: "10px",
  width: "260px",
  boxShadow: "0 0 12px rgba(0,0,0,0.6)"
}}>
      <div style={{ fontWeight: "bold" }}>
        🚨 Alert Generated
      </div>

      <div style={{ fontSize: "12px", color: "#9ca3af" }}>
        Track ID: {alert.track_id}
      </div>

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button onClick={() => alertDetails(alert)}>
          Details
        </button>

        <button onClick={() => setShow(false)}>
          Close
        </button>
      </div>
    </div>
  );
}

// 🔥 DETAILS FUNCTION (abhi basic)
const alertDetails = (alert) => {
  alert("Details feature next step me banega 🚀");
};