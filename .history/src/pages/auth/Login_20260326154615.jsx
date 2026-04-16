import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../api/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    try{

      const res = await api.post("/auth/login",{
        email,
        password
      });
      console.log(res);

      localStorage.setItem("token",res.data.token);

      window.location="/Dashboard";

    }catch(err){

      alert("Invalid login credentials");

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
