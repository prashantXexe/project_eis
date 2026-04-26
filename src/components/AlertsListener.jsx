import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function AlertsListener() {
  const [alert, setAlert] = useState(null);
  const [lastId, setLastId] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "alerts"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const latest = snapshot.docs[0];
      if (!latest) return;

      if (latest.id === lastId) return;

      setLastId(latest.id);

      setAlert({
        id: latest.id,
        ...latest.data()
      });
    });

    return () => unsubscribe();
  }, [lastId]);

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
      right: "20px",
      background: "#111827",
      color: "white",
      padding: "15px",
      borderRadius: "10px",
      zIndex: 9999
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