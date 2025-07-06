import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DemoRedirect.css";

function EsewaDemoRedirect() {
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("checkoutBoxId");
    const token = localStorage.getItem("token");

    // Step 1: Show overlay after short delay
    setTimeout(() => setShowOverlay(true), 1500);

    // Step 2: Perform checkout after 3s
    const performCheckout = async () => {
      try {
        await axios.post(
          `http://localhost:5000/api/gift-box-orders/checkout/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTimeout(() => navigate("/"), 2000); // Redirect to homepage
      } catch (err) {
        console.error("Checkout failed:", err);
      }
    };

    setTimeout(performCheckout, 3000);
  }, [navigate]);

  return (
    <div className="demo-container">
      <>
        <img
          src="/esewa-1.png"
          alt="eSewa large"
          className="demo-img large-img"
        />
        <img
          src="/esewa-2.png"
          alt="eSewa small"
          className="demo-img small-img"
        />
      </>
      {showOverlay && (
        <div className="demo-overlay">
          <h2>Payment Successful</h2>
          <p>Redirecting to EkChinha...</p>
        </div>
      )}
    </div>
  );
}

export default EsewaDemoRedirect;
