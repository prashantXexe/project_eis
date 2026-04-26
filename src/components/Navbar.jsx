import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import {
  Home,
  Database,
  FileText,
  BarChart3,
  Video,
  Users,
  Bell
} from "lucide-react";

export default function Navbar() {

  // ✅ SAFE DATA
  const username = localStorage.getItem("username") || "user";
  const name = localStorage.getItem("name") || username || "User";
  const role = localStorage.getItem("role");

  // ✅ SAFE INITIALS (PB type)
  const initials = name
    ? name
        .trim()
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "US";

  // 🔥 Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear(); // 🔥 better cleanup
      window.location.href = "/login";
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return (
    <div
      style={{
        width: "240px",
        height: "100vh",
        background: "#0b0f19",
        padding: "16px 12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid #1f2937",
      }}
    >
      {/* 🔝 NAV */}
      <div className="navSection">
        <Link to="/" className="navItem">
          <Home size={18} /> Home
        </Link>

        <Link to="/storage" className="navItem">
          <Database size={18} /> Storage
        </Link>

        <Link to="/logs" className="navItem">
          <FileText size={18} /> Logs
        </Link>

        <Link to="/analytics" className="navItem">
          <BarChart3 size={18} /> Analytics
        </Link>

        <Link to="/live" className="navItem">
          <Video size={18} /> Live Feed
        </Link>

        <Link to="/alerts" className="navItem">
          <Bell size={18} /> Alerts
        </Link>

        {/* 🔐 ROLE BASED (FIXED) */}
        {role === "admin" && (
          <Link to="/users" className="navItem">
            <Users size={18} /> Users
          </Link>
        )}
      </div>

      {/* 🔻 PROFILE */}
      <div
        style={{
          borderTop: "1px solid #1f2937",
          paddingTop: "12px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          {/* 🔵 Avatar */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#1e293b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              position: "relative"
            }}
          >
            {initials}

            {/* 🟢 Online */}
            <div
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: "8px",
                height: "8px",
                background: "#22c55e",
                borderRadius: "50%",
              }}
            />
          </div>

          {/* 🧑 Name + Username */}
          <div>
            <div style={{ fontSize: "14px", color: "white" }}>
              {name}
            </div>

            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              {username}
            </div>
          </div>
        </div>

        {/* 🔴 Logout */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "12px",
            background: "#111827",
            border: "1px solid #1f2937",
            padding: "8px",
            borderRadius: "6px",
            color: "#ef4444",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}