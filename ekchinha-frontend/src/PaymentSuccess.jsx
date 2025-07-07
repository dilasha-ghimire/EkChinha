import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./Navbar";
import "./PaymentSuccess.css";

function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  return (
    <>
      <Navbar searchTerm={""} setSearchTerm={() => {}} />
      <div className="payment-success-container">
        <img src="/check.png" alt="Success" className="check-icon" />
        <h2>Payment Successful.</h2>
        <Link to="/" className="back-link">
          Back To Homepage.
        </Link>
      </div>
    </>
  );
}

export default PaymentSuccess;
