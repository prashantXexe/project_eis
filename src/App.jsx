import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Navbar from "./components/Navbar";
import AlertsListener from "./components/AlertsListener";

import Home from "./pages/Home";
import Storage from "./pages/Storage";
import Logs from "./pages/Logs";
import Insights from "./pages/Insights";
import LiveFeed from "./pages/LiveFeed";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Alerts from "./pages/Alerts";

function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 🔥 role state
  const [loading, setLoading] = useState(true);

  // 🔥 AUTH LISTENER
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        try {
          // 🔥 get role from Firestore
          const q = await getDoc(doc(db, "users", u.uid));
          if (q.exists()) {
            setRole(q.data().role);
          }
        } catch (err) {
          console.log("Role fetch error:", err);
        }
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <div style={{ color: "white" }}>Loading...</div>;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden"
      }}
    >
      {/* 🔥 NAVBAR + ALERT LISTENER */}
      {user && (
        <>
          <Navbar user={{ name: user.email, role }} />

          {/* ❌ Alerts page pe popup band */}
          {location.pathname !== "/alerts" && <AlertsListener />}
        </>
      )}

      {/* 🔲 MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          height: "100vh",
          overflowY: isHome ? "hidden" : "auto",
          background: "#0b1220"
        }}
      >
        <Routes>
          {!user ? (
            <>
              <Route path="*" element={<Login />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/storage" element={<Storage />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/live" element={<LiveFeed />} />

              {/* 🔐 ADMIN ONLY */}
              <Route
                path="/users"
                element={role === "admin" ? <Users /> : <Home />}
              />

              <Route path="/alerts" element={<Alerts />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}