import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

export default function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "alerts"));

    const unsub = onSnapshot(q, (snapshot) => {
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

        if (time >= last24) {
          if (d.type === "intrusion") intrusion++;
          if (d.type === "dwell") dwell++;
          if (d.type === "loitering") loitering++;
        }
      });

      setData([
        { name: "Intrusion", value: intrusion, color: "#ef4444" },
        { name: "Dwell", value: dwell, color: "#f59e0b" },
        { name: "Loitering", value: loitering, color: "#10b981" },
      ]);
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: "white", marginBottom: "20px" }}>
        📊 Analytics (Last 24 Hours)
      </h2>

      <div
        style={{
          width: "100%",
          height: "360px",
          background: "#0b1220",
          padding: "20px",
          borderRadius: "14px",
          border: "1px solid #1f2937",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        }}
      >
        <ResponsiveContainer>
          <BarChart data={data} barSize={50}>
            
            <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
            />

            <YAxis
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
            />

            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "none",
                borderRadius: "8px",
                color: "white"
              }}
            />

            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}