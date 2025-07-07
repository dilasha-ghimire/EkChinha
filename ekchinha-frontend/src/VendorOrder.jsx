import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./VendorOrder.css";

function VendorOrder() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "vendor") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="vendor-order-container">
      <Sidebar />
      <div className="vendor-order-content">
        <h1>Vendor Order</h1>
        <p>Put your Vendor Order here.</p>
      </div>
    </div>
  );
}

export default VendorOrder;
