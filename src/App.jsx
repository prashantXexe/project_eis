import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import AlertsListener from "./components/AlertsListener";

import Home from "./pages/Home";
import Storage from "./pages/Storage";
import Logs from "./pages/Logs";
import Insights from "./pages/Insights";
import LiveFeed from "./pages/LiveFeed";
import Users from "./pages/Users";
import Alerts from "./pages/Alerts";

function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* 🔥 ALWAYS SHOW NAVBAR (ADMIN MODE) */}
      <>
        <Navbar user={{ name: "Admin", role: "admin" }} />

        {/* Alerts popup */}
        {location.pathname !== "/alerts" && <AlertsListener />}
      </>

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
          <Route path="/" element={<Home />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/live" element={<LiveFeed />} />

          {/* 🔓 ADMIN ACCESS (NO LOGIN) */}
          <Route path="/users" element={<Users />} />

          <Route path="/alerts" element={<Alerts />} />
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