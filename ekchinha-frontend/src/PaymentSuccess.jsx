import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useState } from "react";
import "./PaymentSuccess.css";

function PaymentSuccess() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
