import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async () => {
    const { email, password } = formData;
    if (!email || !password) {
      setMessage("Both fields are required.");
      setIsError(true);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (user.role === "vendor") {
        navigate("/vendor-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Login failed. Please try again.";
      setMessage(msg);
      setIsError(true);
    }
  };

  return (
    <div className="login-page">
      <header className="header">
        <div className="logo-title" onClick={() => navigate("/")}>
          <img src="/logo.webp" alt="Logo" className="logo" />
          <span className="brand-name">EkChinha</span>
        </div>
      </header>
      <img src="/namaste.png" alt="Welcome" className="welcome-image" />
      <div className="auth-tabs">
        <span className="auth-link active">Login</span>
        <span className="auth-link" onClick={() => navigate("/register")}>
          Register
        </span>
      </div>
      <div className="login-box">
        {message && (
          <div
            className={`popup-message ${
              isError ? "popup-error" : "popup-success"
            }`}
          >
            {message}
          </div>
        )}

        <div className="input-group">
          <img src="/email.png" alt="Email Icon" className="input-icon" />
          <div className="floating-label-input">
            <input
              type="email"
              id="email"
              required
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="email">Email</label>
          </div>
        </div>
        <div className="input-group">
          <img
            src="/lock.png"
            alt="Password Icon"
            className="input-icon-lock"
          />
          <div className="floating-label-input">
            <input
              type="password"
              id="password"
              required
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
          </div>
        </div>
        <button className="login-btn" onClick={handleLogin}>
          LOGIN
        </button>
      </div>
      <footer className="footer">
        <div className="footer-copy-wrapper">
          <p className="footer-copy">Copyright © 2025, EkChinha</p>
        </div>
      </footer>
    </div>
  );
}

export default Login;
