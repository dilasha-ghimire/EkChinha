import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./VendorProfile.css";

const BASE_URL = "http://localhost:5000";

function VendorProfile() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState({});
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

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const vendorId = user?.referenceId;

  useEffect(() => {
    if (!token || user?.role !== "vendor") {
      navigate("/login");
    } else {
      fetchVendor();
    }
  }, [navigate]);

  const fetchVendor = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/vendors/${vendorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendor(res.data);
      setFormData(res.data);
    } catch (err) {
      showPopup("Failed to load profile", true);
    }
  };

  const showPopup = (msg, isErr = false) => {
    setMessage(msg);
    setIsError(isErr);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleUpdateSave = async () => {
    try {
      await axios.put(`${BASE_URL}/api/vendors/${vendorId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showPopup("Details updated successfully");
      setShowUpdateModal(false);
      fetchVendor();
    } catch (err) {
      showPopup("Failed to update details", true);
    }
  };

  const handlePasswordSave = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/vendors/${vendorId}/password`,
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
    <div className="vendor-profile-container">
      <Sidebar />
      <div className="vendor-profile-content">
        <h2 className="vendor-profile-title">Profile</h2>
        <p className="vendor-profile-subtitle">
          <strong>Name:</strong> {vendor.name}
        </p>
        <p className="vendor-profile-subtitle">
          <strong>Email:</strong> {vendor.email}
        </p>
        <p className="vendor-profile-subtitle">
          <strong>Phone Number:</strong> +977 {vendor.phoneNumber}
        </p>
        <p className="vendor-profile-subtitle">
          <strong>Company Name:</strong> {vendor.companyName}
        </p>
        <p className="vendor-profile-subtitle">
          <strong>Address:</strong> {vendor.address}
        </p>

        <div className="vendor-profile-action-buttons">
          <button onClick={() => setShowUpdateModal(true)}>
            Update Details
          </button>
          <button onClick={() => setShowPasswordModal(true)}>
            Change Password
          </button>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="vendor-profile-modal-overlay">
          <div className="vendor-profile-modal wide">
            <img
              src="/close.png"
              alt="Close"
              className="vendor-profile-modal-close"
              onClick={() => setShowUpdateModal(false)}
            />
            <h2>Update Details</h2>

            <div className="vendor-profile-form-row">
              <label>Name</label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="vendor-profile-form-row">
              <label>Email</label>
              <input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="vendor-profile-form-row">
              <label>Phone Number</label>
              <div className="vendor-profile-phone-input-group">
                <span className="vendor-profile-country-code">+977</span>
                <div className="vendor-profile-divider" />
                <input
                  style={{ border: "none" }}
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="vendor-profile-form-row">
              <label>Company Name</label>
              <input
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
              />
            </div>

            <div className="vendor-profile-form-row">
              <label>Address</label>
              <input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <div className="vendor-profile-modal-actions">
              <button onClick={() => setShowUpdateModal(false)}>Cancel</button>
              <button onClick={handleUpdateSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="vendor-profile-modal-overlay">
          <div className="vendor-profile-modal wide">
            <img
              src="/close.png"
              alt="Close"
              className="vendor-profile-modal-close"
              onClick={() => setShowPasswordModal(false)}
            />
            <h2>Change Password</h2>

            <div className="vendor-profile-form-row">
              <label>Current Password</label>
              <div className="vendor-profile-password-field">
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
                  className="vendor-profile-toggle-eye"
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

            <div className="vendor-profile-form-row">
              <label>New Password</label>
              <div className="vendor-profile-password-field">
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
                  className="vendor-profile-toggle-eye"
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

            <ul className="vendor-profile-password-criteria">
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

            <div className="vendor-profile-form-row">
              <label>Confirm Password</label>
              <div className="vendor-profile-password-field">
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
                  className="vendor-profile-toggle-eye"
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
              style={{
                marginLeft: "200px",
                fontSize: "1.2rem",
                marginTop: "10px",
              }}
            >
              {doPasswordsMatch() ? "Passwords match" : "Passwords don’t match"}
            </p>

            <div className="vendor-profile-modal-actions">
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
    </div>
  );
}

export default VendorProfile;
