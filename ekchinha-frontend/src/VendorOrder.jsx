import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import "./VendorOrder.css";

const BASE_URL = "http://localhost:5000";

function VendorOrder() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // NEW

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "vendor") {
      navigate("/login");
    } else {
      fetchVendorOrders(token);
    }
  }, [navigate]);

  const fetchVendorOrders = async (token) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/vendor-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Exclude pending orders
      const nonPending = res.data.filter((order) => order.status !== "pending");
      setOrders(nonPending);
    } catch (error) {
      console.error("Failed to fetch vendor orders:", error);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "packed":
        return "Packed";
      case "shipped":
        return "Shipped to EkChinha Office";
      case "delivered":
        return "Delivered to Customer";
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const nameMatch = order.product_id?.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const statusMatch = filterStatus === "" || order.status === filterStatus;
    return nameMatch && statusMatch;
  });

  return (
    <div className="vendor-order-container">
      <Sidebar />
      <div className="vendor-order-content">
        <div className="vendor-order-header-bar">
          <div className="vendor-order-header-left">
            <h2 className="vendor-order-title">Orders</h2>
            <div className="vendor-order-search-box">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="vendor-order-search-input"
              />
              <img
                src="/black-search.png"
                alt="search"
                className="vendor-order-search-icon"
              />
            </div>
          </div>

          <div className="vendor-order-header-right">
            <button
              className="vendor-order-add-btn"
              onClick={() => console.log("Navigate to new order list")}
            >
              New Order List
            </button>

            {/* Custom Dropdown */}
            <div className="vendor-order-dropdown">
              <button
                className="vendor-order-dropdown-toggle"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                Filter
                <img
                  src="/down-arrow.png"
                  alt="dropdown"
                  className="vendor-order-dropdown-icon"
                />
              </button>
              {showDropdown && (
                <ul className="vendor-order-dropdown-menu">
                  {["confirmed", "packed", "shipped", "delivered"].map(
                    (status) => (
                      <li
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setShowDropdown(false);
                        }}
                        className={
                          filterStatus === status
                            ? "vendor-order-dropdown-item active"
                            : "vendor-order-dropdown-item"
                        }
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="vendor-order-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="vendor-order-item">
              <img
                src={`${BASE_URL}/assets/${order.product_id?.image}`}
                alt={order.product_id?.name}
                className="vendor-order-image"
              />
              <div className="vendor-order-details">
                <p className="vendor-order-name">
                  <strong>Name:</strong> {order.product_id?.name}
                </p>
                <p className="vendor-order-status">
                  <strong>Status:</strong> {getStatusLabel(order.status)}
                </p>
              </div>
              <div className="vendor-order-actions">
                <button
                  className="vendor-order-details-btn"
                  onClick={() => {
                    alert("Order details coming soon.");
                  }}
                >
                  Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <p className="vendor-order-empty-message">No orders to show.</p>
        )}
      </div>
    </div>
  );
}

export default VendorOrder;
