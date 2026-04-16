import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../api/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      /* ✅ Store token */
      localStorage.setItem("token", res.data.token);

      /* ✅ Store user */
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="college-header">
          {/* <img
            src="/college-logo.png"
            className="college-logo"
          /> */}
          <h1>STUDY WORLD COLLEGE OF ENGINEERING</h1>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
            />

            <label>Email Address</label>
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Password</label>

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
