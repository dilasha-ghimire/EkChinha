import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./UserRegister.css";

function UserRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

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

  const handleSubmit = async () => {
    const { name, email, phoneNumber, address, password, confirmPassword } =
      formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (
      !name ||
      !email ||
      !phoneNumber ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      setIsError(true);
      setMessage("All fields are required.");
      return;
    }

    if (!emailRegex.test(email)) {
      setIsError(true);
      setMessage("Invalid email format.");
      return;
    }

    if (!phoneRegex.test(phoneNumber)) {
      setIsError(true);
      setMessage("Phone number must be exactly 10 digits.");
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const payload = { name, email, phoneNumber, address, password };
      await axios.post(
        "http://localhost:5000/api/auth/register/customer",
        payload
      );
      setIsError(false);
      setMessage("User registered successfully.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const msg =
        error.response?.data?.message || "Registration failed. Try again.";
      setIsError(true);
      setMessage(msg);
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
        <span className="auth-link" onClick={() => navigate("/login")}>
          Login
        </span>
        <span className="auth-link active">Register</span>
      </div>

      <div className="register-flex">
        <div className="register-box">
          {message && (
            <div
              className={`popup-message ${
                isError ? "popup-error" : "popup-success"
              }`}
            >
              {message}
            </div>
          )}

          {[
            "name",
            "email",
            "phoneNumber",
            "address",
            "password",
            "confirmPassword",
          ].map((field) => (
            <div key={field} className="register-input-group">
              <img
                src={`/${
                  field.includes("password")
                    ? "lock.png"
                    : field === "email"
                    ? "mail.png"
                    : field === "phoneNumber"
                    ? "telephone.png"
                    : field === "address"
                    ? "pin.png"
                    : "email.png"
                }`}
                alt={`${field} icon`}
                className={
                  field.includes("password") ? "input-icon-lock" : "input-icon"
                }
              />
              <div className="floating-label-input">
                <input
                  type={
                    field === "password" || field === "confirmPassword"
                      ? "password"
                      : "text"
                  }
                  id={field}
                  required
                  placeholder=" "
                  value={formData[field]}
                  onChange={handleChange}
                />
                <label htmlFor={field}>
                  {field
                    .replace("Number", " Number")
                    .replace("confirmPassword", "Confirm Password")
                    .replace(/^./, (c) => c.toUpperCase())}
                </label>
              </div>
            </div>
          ))}

          <button className="login-btn" onClick={handleSubmit}>
            REGISTER
          </button>
        </div>

        <div
          className="vendor-card"
          onClick={() => navigate("/vendorregister")}
        >
          <img src="/vendor.png" alt="Vendor Icon" className="vendor-icon" />
          <div className="vendor-text-wrapper">
            <span className="vendor-text-small">
              Want to sell your product?
            </span>
            <span className="vendor-text-bold">REGISTER as Vendor</span>
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

export default UserRegister;
