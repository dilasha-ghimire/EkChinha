import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "./UserProfile.css";

const BASE_URL = "http://localhost:5000";

function UserProfile() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    showOld: false,
    showNew: false,
    showConfirm: false,
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const customerId = user?.referenceId;

  useEffect(() => {
    if (!token || !customerId) {
      navigate("/login");
    } else {
      fetchCustomer();
      fetchOrders();
    }
  }, [navigate]);

  const fetchCustomer = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomer(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error(err);
      showPopup("Failed to load profile", true);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/gift-box-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched orders:", res.data);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const showPopup = (msg, isErr = false) => {
    setMessage(msg);
    setIsError(isErr);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleUpdateSave = async () => {
    const { name, email, phoneNumber, address } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!name || !email || !phoneNumber || !address) {
      showPopup("All fields are required", true);
      return;
    }

    if (!emailRegex.test(email)) {
      showPopup("Invalid email format", true);
      return;
    }

    if (!phoneRegex.test(phoneNumber)) {
      showPopup("Phone number must be exactly 10 digits", true);
      return;
    }

    try {
      await axios.put(`${BASE_URL}/api/customers/${customerId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showPopup("Details updated successfully");
      setShowUpdateModal(false);
      fetchCustomer();
    } catch (err) {
      showPopup("Failed to update details", true);
    }
  };

  const handlePasswordSave = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/customers/${customerId}/password`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showPopup("Password changed successfully");
      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        showOld: false,
        showNew: false,
        showConfirm: false,
      });
    } catch (err) {
      showPopup(
        err.response?.data?.message || "Failed to change password",
        true
      );
    }
  };

  const isPasswordValid = () => {
    const { newPassword } = passwordData;
    return (
      newPassword.length >= 8 &&
      /[A-Z]/.test(newPassword) &&
      /[a-z]/.test(newPassword) &&
      /\d/.test(newPassword)
    );
  };

  const doPasswordsMatch = () =>
    passwordData.newPassword === passwordData.confirmPassword;

  return (
    <>
      <Navbar searchTerm={""} setSearchTerm={() => {}} />

      <div className="user-profile-container">
        <h2>Profile</h2>
        <p>
          <strong>Name:</strong> {customer.name}
        </p>
        <p>
          <strong>Email:</strong> {customer.email}
        </p>
        <p>
          <strong>Phone Number:</strong> +977 {customer.phoneNumber}
        </p>
        <p>
          <strong>Address:</strong> {customer.address}
        </p>

        <div className="user-action-buttons">
          <button onClick={() => setShowUpdateModal(true)}>
            Update Details
          </button>
          <button onClick={() => setShowPasswordModal(true)}>
            Change Password
          </button>
        </div>
      </div>

      <div className="user-order-history">
        <h2>Order History</h2>
        <div className="order-card-container">
          {orders.length === 0 ? (
            <p
              style={{ marginTop: "1rem", color: "#777", fontStyle: "italic" }}
            >
              You haven’t placed any gift box orders yet.
            </p>
          ) : (
            orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-card-body">
                  <h3>{order.gift_box_id?.name || "Unnamed Box"}</h3>
                  <p>Total Items: {order.gift_box_id?.total_items}</p>
                </div>
                <div className="order-card-footer">
                  <p>Status: </p>
                  <span className="order-status">{order.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="user-modal-overlay">
          <div className="user-modal wide">
            <img
              src="/purple-close.png"
              alt="Close"
              className="user-modal-close"
              onClick={() => setShowUpdateModal(false)}
            />
            <h2>Update Details</h2>

            <div className="user-form-row">
              <label>Name</label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="user-form-row">
              <label>Email</label>
              <input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="user-form-row">
              <label>Phone Number</label>
              <div className="user-phone-input-group">
                <span className="user-country-code">+977</span>
                <div className="user-divider" />
                <input
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="user-form-row">
              <label>Address</label>
              <input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <div className="user-modal-actions">
              <button onClick={() => setShowUpdateModal(false)}>Cancel</button>
              <button onClick={handleUpdateSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="user-modal-overlay">
          <div className="user-modal wide">
            <img
              src="/purple-close.png"
              alt="Close"
              className="user-modal-close"
              onClick={() => setShowPasswordModal(false)}
            />
            <h2>Change Password</h2>

            <div className="user-form-row">
              <label>Current Password</label>
              <div className="user-password-field">
                <input
                  type={passwordData.showOld ? "text" : "password"}
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                />
                <span
                  className="user-toggle-eye"
                  onClick={() =>
                    setPasswordData((prev) => ({
                      ...prev,
                      showOld: !prev.showOld,
                    }))
                  }
                >
                  👁️
                </span>
              </div>
            </div>

            <div className="user-form-row">
              <label>New Password</label>
              <div className="user-password-field">
                <input
                  type={passwordData.showNew ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />
                <span
                  className="user-toggle-eye"
                  onClick={() =>
                    setPasswordData((prev) => ({
                      ...prev,
                      showNew: !prev.showNew,
                    }))
                  }
                >
                  👁️
                </span>
              </div>
            </div>

            <ul className="user-password-criteria">
              <li
                className={
                  passwordData.newPassword.length >= 8 ? "pass" : "fail"
                }
              >
                at least 8 characters
              </li>
              <li
                className={
                  /[A-Z]/.test(passwordData.newPassword) ? "pass" : "fail"
                }
              >
                at least 1 uppercase letter
              </li>
              <li
                className={
                  /[a-z]/.test(passwordData.newPassword) ? "pass" : "fail"
                }
              >
                at least 1 lowercase letter
              </li>
              <li
                className={
                  /\d/.test(passwordData.newPassword) ? "pass" : "fail"
                }
              >
                at least 1 digit
              </li>
            </ul>

            <div className="user-form-row">
              <label>Confirm Password</label>
              <div className="user-password-field">
                <input
                  type={passwordData.showConfirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <span
                  className="user-toggle-eye"
                  onClick={() =>
                    setPasswordData((prev) => ({
                      ...prev,
                      showConfirm: !prev.showConfirm,
                    }))
                  }
                >
                  👁️
                </span>
              </div>
            </div>

            <p
              className={doPasswordsMatch() ? "pass" : "fail"}
              style={{ marginLeft: "160px" }}
            >
              {doPasswordsMatch() ? "Passwords match" : "Passwords don’t match"}
            </p>

            <div className="user-modal-actions">
              <button onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
              <button
                onClick={handlePasswordSave}
                disabled={!isPasswordValid() || !doPasswordsMatch()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`popup-message ${
            isError ? "popup-error" : "popup-success"
          }`}
        >
          {message}
        </div>
      )}
    </>
  );
}

export default UserProfile;
