import { useNavigate } from "react-router-dom";
import "./UserRegister.css";

function VendorRegister() {
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
        <span className="auth-link" onClick={() => navigate("/login")}>
          Login
        </span>
        <span className="auth-link active">Register</span>
      </div>

      <div className="register-flex">
        {/* Register Form */}
        <div className="register-box">
          <div className="register-input-group">
            <img src="/email.png" alt="Name Icon" className="input-icon" />
            <div className="floating-label-input">
              <input type="text" id="name" required placeholder=" " />
              <label htmlFor="name">Name</label>
            </div>
          </div>

          <div className="register-input-group">
            <img src="/mail.png" alt="Email Icon" className="input-icon" />
            <div className="floating-label-input">
              <input type="email" id="email" required placeholder=" " />
              <label htmlFor="email">Email</label>
            </div>
          </div>

          <div className="register-input-group">
            <img src="/telephone.png" alt="Phone Icon" className="input-icon" />
            <div className="floating-label-input">
              <input type="text" id="phone" required placeholder=" " />
              <label htmlFor="phone">Phone Number</label>
            </div>
          </div>

          <div className="register-input-group">
            <img src="/pin.png" alt="Address Icon" className="input-icon" />
            <div className="floating-label-input">
              <input type="text" id="address" required placeholder=" " />
              <label htmlFor="address">Address</label>
            </div>
          </div>

          <div className="register-input-group">
            <img src="/team.png" alt="Company Icon" className="input-icon" />
            <div className="floating-label-input">
              <input type="text" id="company" required placeholder=" " />
              <label htmlFor="company">Company Name</label>
            </div>
          </div>

          <div className="register-input-group">
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

          <div className="register-input-group">
            <img
              src="/lock.png"
              alt="Confirm Password Icon"
              className="input-icon-lock"
            />
            <div className="floating-label-input">
              <input
                type="password"
                id="confirm-password"
                required
                placeholder=" "
              />
              <label htmlFor="confirm-password">Confirm Password</label>
            </div>
          </div>

          <button className="login-btn">REGISTER</button>
        </div>

        {/* User Card */}
        <div className="vendor-card" onClick={() => navigate("/register")}>
          <img src="/person.png" alt="User Icon" className="vendor-icon" />
          <div className="vendor-text-wrapper">
            <span className="vendor-text-small">Want to buy from us?</span>
            <span className="vendor-text-bold">REGISTER as User</span>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-copy-wrapper">
          <p className="footer-copy">Copyright © 2025, EkChinha</p>
        </div>
      </footer>
    </div>
  );
}

export default VendorRegister;
