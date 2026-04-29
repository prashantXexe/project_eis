import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Label
} from "recharts";

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

      // 🔥 UPDATED (Total added)
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
        <StatBox title="Intrusion" value={stats.intrusion} color="#ef4444" />
        <StatBox title="Dwell" value={stats.dwell} color="#f59e0b" />
        <StatBox title="Loitering" value={stats.loitering} color="#10b981" />
      </div>

      {/* 🔥 GRAPH */}
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
        <ResponsiveContainer>
          <BarChart data={chartData} barSize={50}>
            
            <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />

            {/* 🔥 X AXIS */}
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
            >
              <Label value="Alert Type" offset={-5} position="insideBottom" fill="#9ca3af" />
            </XAxis>

            {/* 🔥 Y AXIS */}
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
            >
              <Label
                value="Count"
                angle={-90}
                position="insideLeft"
                fill="#9ca3af"
              />
            </YAxis>

            {/* 🔥 TOOLTIP */}
            <Tooltip
              formatter={(value) => [`${value}`, "Count"]}
              contentStyle={{
                background: "#111827",
                border: "none",
                borderRadius: "8px",
                color: "white"
              }}
            />

            {/* 🔥 BARS */}
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
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