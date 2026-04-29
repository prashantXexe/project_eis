import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";

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
  const nav = useNavigate();

  // 🔔 ALERT COUNT (LAST 24 HOURS)
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const now = new Date();
    const last24 = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const q = query(
      collection(db, "alerts"),
      where("timestamp", ">=", last24)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAlertCount(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  // 👤 USER DATA
  const username = localStorage.getItem("username") || "user";
  const name = localStorage.getItem("name") || username || "User";
  const role = localStorage.getItem("role");

  // 🔤 INITIALS
  const initials = name
    ? name
        .trim()
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "US";

  // 🔴 LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      nav("/");
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

        {/* 🔔 ALERTS */}
        <Link to="/alerts" className="navItem" style={{ position: "relative" }}>
          <Bell size={18} /> Alerts

          {alertCount > 0 && (
            <span
              style={{
                position: "absolute",
                right: "10px",
                top: "6px",
                background: "#ef4444",
                color: "white",
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "999px",
              }}
            >
              {alertCount > 99 ? "99+" : alertCount}
            </span>
          )}
        </Link>

        {/* 🔐 ADMIN */}
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

          {/* 🔵 AVATAR */}
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

            {/* 🟢 ONLINE DOT */}
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

          {/* 👤 USER INFO */}
          <div>
            <div style={{ fontSize: "14px", color: "white" }}>
              {name}
            </div>

            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              {username}
            </div>
          </div>
        </div>

        {/* 🔴 LOGOUT */}
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