import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

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
          date: dateObj.toLocaleDateString(),
          time: dateObj.toLocaleTimeString(),
        };
      });

      setAlerts(data);
    });

    return () => unsub();
  }, []);

  // 🔢 STATS
  const dwellCount = alerts.filter(a => a.type === "dwell").length;
  const loiterCount = alerts.filter(a => a.type === "loiter").length;

  const today = new Date().toLocaleDateString();
  const todayCount = alerts.filter(a => a.date === today).length;

  return (
    <div style={{ padding: 20 }}>

      {/* 🔥 TOP STATS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "15px",
        marginBottom: "20px"
      }}>
        <StatBox title="Dwell Count" value={dwellCount} />
        <StatBox title="Alerts (24h)" value={todayCount} />
        <StatBox title="Loitering Count" value={loiterCount} />
      </div>

      {/* 🔥 TABLE */}
      <div className="logWrapper">
        <table className="logTable">
          <thead>
            <tr>
              <th>Track</th>
              <th>Type</th>
              <th>Zone</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {alerts.map((a) => (
              <tr key={a.id}>
                <td>{a.trackId}</td>
                <td style={{ color: "#ef4444" }}>{a.type}</td>
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

// 🔲 STAT BOX
function StatBox({ title, value }) {
  return (
    <div style={{
      background: "#0b1220",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #1f2937",
      textAlign: "center"
    }}>
      <div style={{ color: "#9ca3af", fontSize: "14px" }}>
        {title}
      </div>

      <div style={{
        color: "white",
        fontSize: "24px",
        fontWeight: "bold",
        marginTop: "8px"
      }}>
        {value}
      </div>
    </div>
  );
}