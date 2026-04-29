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

export default function InsightsChart({ data, small = false }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barSize={small ? 25 : 40}>
        
        <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />

        <XAxis
          dataKey="name"
          stroke="#9ca3af"
          tick={{ fill: "#9ca3af", fontSize: small ? 10 : 12 }}
        >
          {!small && (
            <Label
              value="Alert Category"
              position="insideBottom"
              offset={-5}
              fill="#9ca3af"
            />
          )}
        </XAxis>

        <YAxis
          stroke="#9ca3af"
          tick={{ fill: "#9ca3af", fontSize: small ? 10 : 12 }}
        >
          {!small && (
            <Label
              value="Alerts (24h)"
              angle={-90}
              position="insideLeft"
              fill="#9ca3af"
            />
          )}
        </YAxis>

        <Tooltip
          cursor={{ fill: "transparent" }}
          formatter={(value) => [`${value}`, "Alerts"]}
          contentStyle={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "8px",
            color: "white"
          }}
        />

        <Bar dataKey="value" radius={[10, 10, 0, 0]} activeBar={false}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>

      </BarChart>
    </ResponsiveContainer>
  );
}