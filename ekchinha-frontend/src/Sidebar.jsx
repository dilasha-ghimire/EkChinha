import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="vendor-sidebar">
      <div>
        <div className="vendor-sidebar-header">
          <img src="/logo.webp" alt="EkChinha" className="vendor-logo" />
          <h2 className="vendor-brand-name">EkChinha</h2>
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
            <img src="/vendor-user.png" alt="Profile" className="vendor-icon" />
            Profile
          </NavLink>
        </nav>
      </div>

      <div className="vendor-logout-container">
        <button className="vendor-logout-btn" onClick={handleLogout}>
          <img
            src="/vendor-logout.png"
            alt="Logout"
            className="vendor-icon vendor-logout-icon"
          />
          LOGOUT
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
