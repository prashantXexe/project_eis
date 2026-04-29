import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import InsightsChart from "../components/InsightsChart";

export default function Insights() {
  const [stats, setStats] = useState({
    total: 0,
    intrusion: 0,
    dwell: 0,
    loitering: 0
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "alerts"), (snapshot) => {
      let intrusion = 0;
      let dwell = 0;
      let loitering = 0;

      const now = new Date();
      const last24 = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      snapshot.forEach((doc) => {
        const d = doc.data();

        const time = d.timestamp?.toDate
          ? d.timestamp.toDate()
          : new Date(d.timestamp);

        const type = d.type?.toLowerCase();

        if (time >= last24) {
          if (type === "intrusion") intrusion++;
          if (type === "dwell") dwell++;
          if (type === "loiter" || type === "loitering") loitering++;
        }
      });

      const total = intrusion + dwell + loitering;

      setStats({ total, intrusion, dwell, loitering });

      setChartData([
        { name: "Total", value: total, color: "#3b82f6" },
        { name: "Intrusion", value: intrusion, color: "#ef4444" },
        { name: "Dwell", value: dwell, color: "#f59e0b" },
        { name: "Loitering", value: loitering, color: "#10b981" },
      ]);
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      
      <h2 style={{ marginBottom: "20px" }}>
        📊 Insights Dashboard
      </h2>

      {/* 🔥 TOP BOXES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          marginBottom: "25px"
        }}
      >
        <StatBox title="Total Alerts" value={stats.total} color="#3b82f6" />
        <StatBox title="Intrusion Alerts" value={stats.intrusion} color="#ef4444" />
        <StatBox title="Dwell Events" value={stats.dwell} color="#f59e0b" />
        <StatBox title="Loitering Events" value={stats.loitering} color="#10b981" />
      </div>

      {/* 🔥 GRAPH (COMPONENT USE) */}
      <div
        style={{
          width: "100%",
          height: "400px",
          background: "#0b1220",
          padding: "20px",
          borderRadius: "14px",
          border: "1px solid #1f2937",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)"
        }}
      >
        <InsightsChart data={chartData} />
      </div>
    </div>
  );
}

// 🔲 STAT BOX
function StatBox({ title, value, color }) {
  return (
    <div
      style={{
        background: "#0b1220",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #1f2937",
        boxShadow: "0 0 10px rgba(0,0,0,0.4)",
        textAlign: "center"
      }}
    >
      <div style={{ color: "#9ca3af", fontSize: "13px" }}>
        {title}
      </div>

      <div
        style={{
          color: color,
          fontSize: "26px",
          fontWeight: "bold",
          marginTop: "8px"
        }}
      >
        {value}
      </div>
    </div>
  );
}