import { useLocation, useNavigate } from "react-router-dom";

export default function Analytics() {
  const location = useLocation();
  const nav = useNavigate();

  const alertData = location.state;

  return (
    <div
      style={{
        padding: "20px",
        color: "white",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>📊 Analytics</h2>

      {/* ❌ If no alert passed */}
      {!alertData && (
        <div
          style={{
            background: "#111827",
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid #1f2937",
          }}
        >
          <p>No alert selected.</p>

          <button
            onClick={() => nav("/")}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              background: "#2563eb",
              border: "none",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Go Back Home
          </button>
        </div>
      )}

      {/* ✅ If alert exists */}
      {alertData && (
        <div
          style={{
            background: "#0f172a",
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid #1f2937",
            maxWidth: "500px",
          }}
        >
          <h3 style={{ color: "#ef4444" }}>🚨 Alert Details</h3>

          <div style={{ marginTop: "10px", fontSize: "14px" }}>
            <p>
              <b>Type:</b> {alertData.type}
            </p>

            <p>
              <b>Zone:</b> {alertData.zone}
            </p>

            <p>
              <b>Dwell Time:</b>{" "}
              {alertData.dwell ? `${alertData.dwell.toFixed(2)} sec` : "N/A"}
            </p>

            <p>
              <b>Time:</b>{" "}
              {alertData.timestamp
                ? new Date(alertData.timestamp).toLocaleString()
                : "N/A"}
            </p>
          </div>

          {/* 🖼️ Image */}
          {alertData.image && (
            <img
              src={alertData.image}
              alt="Alert"
              style={{
                width: "100%",
                marginTop: "15px",
                borderRadius: "8px",
                border: "1px solid #1f2937",
              }}
            />
          )}

          {/* 🔙 Back Button */}
          <button
            onClick={() => nav("/")}
            style={{
              marginTop: "15px",
              padding: "8px 12px",
              background: "#2563eb",
              border: "none",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}