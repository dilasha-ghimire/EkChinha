import { useState } from "react";
import Navbar from "./Navbar";

function MyCart() {
  const [searchTerm, setSearchTerm] = useState("");

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

export default MyCart;
