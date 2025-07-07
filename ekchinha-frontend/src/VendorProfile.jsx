import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./VendorProfile.css";

function VendorProfile() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "vendor") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="vendor-profile-container">
      <Sidebar />
      <div className="vendor-profile-content">
        <h1>Vendor Profile</h1>
        <p>Put your Vendor Profile here.</p>
      </div>
    </div>
  );
}

export default VendorProfile;
