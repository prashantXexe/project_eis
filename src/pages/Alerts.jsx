import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [hiddenAlerts, setHiddenAlerts] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "alerts"),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();

        const dateObj = d.timestamp?.toDate
          ? d.timestamp.toDate()
          : new Date(d.timestamp);

        return {
          id: doc.id,
          trackId: d.track_id,
          type: d.type,
          zone: d.zone_id,
          timestamp: dateObj,
          date: dateObj.toLocaleDateString(),
          time: dateObj.toLocaleTimeString(),
        };
      });

      setAlerts(data);
    });

    return () => unsub();
  }, []);

  // ❌ REMOVE ALERT UI
  const handleRemove = (id) => {
    setHiddenAlerts(prev => [...prev, id]);
  };

  // 🔥 FILTER
  const now = new Date();
  const last24 = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const last24Alerts = alerts.filter(a => a.timestamp >= last24);
  const visibleAlerts = alerts.filter(a => !hiddenAlerts.includes(a.id));

  // 🔢 STATS
  const totalCount = last24Alerts.length;
  const intrusionCount = last24Alerts.filter(a => a.type === "intrusion").length;
  const dwellCount = last24Alerts.filter(a => a.type === "dwell").length;
  const loiterCount = last24Alerts.filter(a => a.type === "loitering").length;

  return (
    <div style={{
      padding: 20,
      background: "linear-gradient(135deg, #0b1220, #1e3a8a)",
      minHeight: "100vh"
    }}>

      {/* STATS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: "15px",
        marginBottom: "20px"
      }}>
        <StatBox title="Total Alerts (24h)" value={totalCount} />
        <StatBox title="Intrusion" value={intrusionCount} />
        <StatBox title="Dwell" value={dwellCount} />
        <StatBox title="Loitering" value={loiterCount} />
      </div>

      {/* TABLE */}
      <div className="logWrapper" style={{
        background: "rgba(15, 23, 42, 0.8)",
        border: "1px solid rgba(59,130,246,0.3)",
        backdropFilter: "blur(10px)"
      }}>
        <table className="logTable" style={{ color: "#e5e7eb" }}>

          {/* ✅ FIXED HEADER */}
          <thead style={{
            background: "rgba(30, 58, 138, 0.4)",
            color: "#93c5fd"
          }}>
            <tr>
              <th>Track</th>
              <th>Type</th>
              <th>Zone</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {visibleAlerts.map((a) => (
              <tr
                key={a.id}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(59,130,246,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >

                {/* TRACK + ❌ */}
                <td style={{ position: "relative" }}>
                  {a.trackId}

                  <span
                    onClick={() => handleRemove(a.id)}
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      cursor: "pointer",
                      color: "#ef4444",
                      fontSize: "14px",
                      fontWeight: "bold"
                    }}
                  >
                    ✖
                  </span>
                </td>

                {/* TYPE */}
                <td style={{
                  color:
                    a.type === "intrusion" ? "#f87171" :
                    a.type === "dwell" ? "#fbbf24" :
                    "#34d399"
                }}>
                  {a.type}
                </td>

                <td>{a.zone}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

// STAT BOX
function StatBox({ title, value }) {
  let bg = "#0b1220";
  let border = "#1f2937";

  if (title.includes("Total")) {
    bg = "linear-gradient(135deg, #1e3a8a, #0b1220)";
    border = "#2563eb";
  }

  if (title.includes("Intrusion")) {
    bg = "linear-gradient(135deg, #7f1d1d, #0b1220)";
    border = "#ef4444";
  }

  if (title.includes("Dwell")) {
    bg = "linear-gradient(135deg, #78350f, #0b1220)";
    border = "#f59e0b";
  }

  if (title.includes("Loitering")) {
    bg = "linear-gradient(135deg, #064e3b, #0b1220)";
    border = "#10b981";
  }

  return (
    <div
      style={{
        background: bg,
        padding: "20px",
        borderRadius: "12px",
        border: `1px solid ${border}`,
        textAlign: "center",
        boxShadow: "0 0 10px rgba(0,0,0,0.4)",
        transition: "0.3s",
      }}
    >
      <div style={{ color: "#cbd5f5", fontSize: "14px" }}>
        {title}
      </div>

      <div
        style={{
          color: "white",
          fontSize: "26px",
          fontWeight: "bold",
          marginTop: "8px",
        }}
      >
        {value}
      </div>
    </div>
  );
}