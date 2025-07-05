import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Payment() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>User Profile</h1>
        <p>Put your User Profile here.</p>
      </div>
    </>
  );
}

export default Payment;
