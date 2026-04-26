import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Storage from "./pages/Storage";
import Logs from "./pages/Logs";
import Analytics from "./pages/Analytics";
import LiveFeed from "./pages/LiveFeed";
import Users from "./pages/Users";
import Login from "./pages/Login";

function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 AUTH LISTENER
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return null;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden"
      }}
    >
      {/* 🔥 NAVBAR ONLY WHEN LOGGED IN */}
      {user && (
        <Navbar user={{ name: user.email, role: "admin" }} />
      )}

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
              {/* 🔐 NOT LOGGED IN */}
              <Route path="*" element={<Login />} />
            </>
          ) : (
            <>
              {/* 🔓 LOGGED IN */}
              <Route path="/" element={<Home />} />
              <Route path="/storage" element={<Storage />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/live" element={<LiveFeed />} />
              <Route path="/users" element={<Users />} />
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