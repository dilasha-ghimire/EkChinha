import React from "react";
import Navbar from "./Navbar";

function Saved({ searchTerm, setSearchTerm }) {
  return (
    <div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div style={{ padding: "20px" }}>
        <h1>Saved Items</h1>
        <p>This is where your saved items will appear.</p>
      </div>
    </div>
  );
}

export default Saved;
