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

  const handleLogin = async () => {
    if (loading) return;

    if (!username || !password) {
      setError("Enter username & password ❌");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 🔥 FIXED QUERY
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

      // 🔥 disabled check
      if (userData.disabled) {
        setError("User disabled ❌");
        setLoading(false);
        return;
      }

      // 🔥 LOGIN WITH FIREBASE AUTH
      await signInWithEmailAndPassword(
        auth,
        userData.email,
        password
      );

      // 🔥 redirect
      window.location.href = "/";

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      setError("Invalid password or login failed ❌");
    }

    setLoading(false);
  };

  return (
    <div className="loginOuter">

      {/* LEFT SIDE */}
      <div className="loginBrand">
        <h1>funch.</h1>
        <p>Login page</p>
      </div>

      {/* LOGIN CARD */}
      <div className="loginCard">
        <h2>Login</h2>
        <p className="subText">
          Secure access to surveillance system
        </p>

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value.toLowerCase())
          }
        />

        {/* PASSWORD */}
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

        {/* BUTTON */}
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        {/* ERROR */}
        {error && <p className="error">{error}</p>}
      </div>

      {/* RIGHT IMAGE */}
      <div className="loginImage"></div>
    </div>
  );
}