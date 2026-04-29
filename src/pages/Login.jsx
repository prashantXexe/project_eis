import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../index.css";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 IMPORTANT (missing tha)
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username.trim().toLowerCase())
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("User not found ❌");
        setLoading(false);
        return;
      }

      const userData = snapshot.docs[0].data();

      await signInWithEmailAndPassword(
        auth,
        userData.email,
        password
      );

      localStorage.setItem("role", userData.role);
      localStorage.setItem("username", userData.username);
      localStorage.setItem("name", userData.name);

      window.location.href = "/";
    } catch {
      setError("Login failed ❌");
    }

    setLoading(false);
  };

  return (
    <div className="loginOuter">

     
      {/* LEFT */}
      <div className="loginBrand">
        <h1>funch.</h1>
        <p>Login page</p>
      </div>

      {/* CARD */}
      <div className="loginCard" style={{ position: "relative", zIndex: 2 }}>
        <h2>Login</h2>
        <p className="subText">
          Secure access to surveillance system
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value.toLowerCase())
          }
        />

        <div className="passwordBox">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPass(!showPass)}>
            {showPass ? "🙈" : "👁"}
          </span>
        </div>

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        {error && <p className="error">{error}</p>}
      </div>

      {/* IMAGE */}
      <div className="loginImage"></div>

    </div>
  );
}