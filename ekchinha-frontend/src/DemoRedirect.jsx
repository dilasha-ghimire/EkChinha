import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DemoRedirect.css";

function DemoRedirect({ type }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const id = localStorage.getItem("checkoutBoxId");
    const token = localStorage.getItem("token");

    let overlayTimeout;
    let checkoutTimeout;

    // Step 1: show overlay after 1.5s
    overlayTimeout = setTimeout(() => setShowOverlay(true), 1500);

    // Step 2: call checkout and redirect after 3.5s
    checkoutTimeout = setTimeout(async () => {
      try {
        await axios.post(
          `http://localhost:5000/api/gift-box-orders/checkout/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Checkout failed:", err);
      } finally {
        navigate("/");
      }
    }, 3500);

    // Cleanup on unmount
    return () => {
      clearTimeout(overlayTimeout);
      clearTimeout(checkoutTimeout);
    };
  }, [navigate]);

  return (
    <div className="demo-container">
      <img
        src={type === "esewa" ? "/esewa-1.png" : "/khalti-1.png"}
        alt={`${type} large`}
        className="demo-img large-img"
      />
      <img
        src={type === "esewa" ? "/esewa-2.png" : "/khalti-2.png"}
        alt={`${type} small`}
        className="demo-img small-img"
      />
      {showOverlay && (
        <div className="demo-overlay">
          <h2>✅ Payment Successful</h2>
          <p>Redirecting to EkChinha...</p>
        </div>
      )}
    </div>
  );
}

export default DemoRedirect;
