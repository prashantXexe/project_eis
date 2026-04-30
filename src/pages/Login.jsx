import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("All fields required ❌");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 🔍 username → email lookup
      const q = query(
        collection(db, "users"),
        where("username", "==", username.trim().toLowerCase()),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error("User not found ❌");
      }

      const userData = snapshot.docs[0].data();

      // 🔐 Firebase Auth login
      await signInWithEmailAndPassword(
        auth,
        userData.email,
        password
      );

      // 💾 Save session
      localStorage.setItem("role", userData.role);
      localStorage.setItem("username", userData.username);
      localStorage.setItem("name", userData.name);

      // 🚀 Redirect
      navigate("/");

    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setError("Wrong password ❌");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email ❌");
      } else {
        setError(err.message || "Login failed ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="loginContainer">

    {/* LEFT SIDE */}
   <div className="loginLeft">

  <h1 className="mainTitle">
    Edge-Based Surveillance System
  </h1>

  <p className="mainSub">
  Based on <span>Perimeter Threat Detection</span>
</p>

  <div className="featureList">

    <div className="featureItem">
      <span className="icon">●</span>
      <div>
        <h4>Real-time Intrusion Detection</h4>
        <p>Instant alerts for unauthorized access</p>
      </div>
    </div>

    <div className="featureItem">
      <span className="icon">●</span>
      <div>
        <h4>Edge AI Processing</h4>
        <p>No cloud latency, faster decisions</p>
      </div>
    </div>

    <div className="featureItem">
      <span className="icon">●</span>
      <div>
        <h4>Smart Monitoring</h4>
        <p>Continuous tracking & alert system</p>
      </div>
    </div>

    <div className="featureItem">
      <span className="icon">●</span>
      <div>
        <h4>Secure Architecture</h4>
        <p>Highly scalable & protected system</p>
      </div>
    </div>

  </div>

</div>

    {/* RIGHT SIDE */}
    <div className="loginRight">
      <div className="loginBox">

        <h2>Edge Based Surveillance System Login</h2>
        <p className="subText">Login to continue</p>

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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
          <span onClick={() => setShowPass(!showPass)}>
            {showPass ? "🙈" : "👁"}
          </span>
        </div>

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>


      </div>
    </div>

  </div>
);
}