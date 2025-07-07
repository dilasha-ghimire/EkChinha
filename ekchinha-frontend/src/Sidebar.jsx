import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <div className="vendor-sidebar">
        <div>
          <div className="vendor-sidebar-header">
            <img src="/logo.webp" alt="EkChinha" className="vendor-logo" />
            <h2 className="vendor-sidebar-brand-name">EkChinha</h2>
          </div>

          <nav className="vendor-nav-links">
            <NavLink
              to="/vendor-dashboard"
              className={({ isActive }) =>
                isActive ? "vendor-nav-link active" : "vendor-nav-link"
              }
            >
              <img src="/products.png" alt="Products" className="vendor-icon" />
              Products
            </NavLink>
            <NavLink
              to="/vendor-orders"
              className={({ isActive }) =>
                isActive ? "vendor-nav-link active" : "vendor-nav-link"
              }
            >
              <img src="/checklist.png" alt="Orders" className="vendor-icon" />
              Orders
            </NavLink>
            <NavLink
              to="/vendor-profile"
              className={({ isActive }) =>
                isActive ? "vendor-nav-link active" : "vendor-nav-link"
              }
            >
              <img
                src="/vendor-user.png"
                alt="Profile"
                className="vendor-icon"
              />
              Profile
            </NavLink>
          </nav>
        </div>

        <div className="vendor-logout-container">
          <button
            className="vendor-logout-btn"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <img
              src="/vendor-logout.png"
              alt="Logout"
              className="vendor-icon vendor-logout-icon"
            />
            LOGOUT
          </button>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="logout-confirm-overlay">
          <div className="logout-confirm-box">
            <button
              className="close-btn"
              onClick={() => setShowLogoutConfirm(false)}
            >
              <img src="/close.png" alt="Close" className="close-icon" />
            </button>

            <img src="/alert.png" alt="Warning" className="logout-icon" />
            <h2>Are you sure?</h2>
            <p>Do you want to logout?</p>
            <div className="logout-buttons">
              <button
                className="no-btn"
                onClick={() => setShowLogoutConfirm(false)}
              >
                NO
              </button>
              <button
                className="yes-btn"
                onClick={() => {
                  handleLogout();
                  setShowLogoutConfirm(false);
                }}
              >
                YES
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
