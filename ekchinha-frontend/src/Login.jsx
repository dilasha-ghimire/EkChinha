import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

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
        <div className="input-group">
          <img src="/email.png" alt="Email Icon" className="input-icon" />
          <div className="floating-label-input">
            <input type="email" id="email" required placeholder=" " />
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
            <input type="password" id="password" required placeholder=" " />
            <label htmlFor="password">Password</label>
          </div>
        </div>
        <button className="login-btn">LOGIN</button>
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
