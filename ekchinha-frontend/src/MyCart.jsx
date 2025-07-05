import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./MyCart.css";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

function MyCart() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartGiftBoxes, setCartGiftBoxes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCartGiftBoxes = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/cart-gift-box`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (Array.isArray(res.data)) {
          setCartGiftBoxes(res.data);
        } else {
          console.error("Unexpected response format:", res.data);
          setCartGiftBoxes([]);
        }
      } catch (error) {
        console.error("Failed to fetch cart gift boxes", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchCartGiftBoxes();
  }, [navigate]);

  // 🔍 Filter boxes by search term
  const filteredCartGiftBoxes = cartGiftBoxes.filter((box) =>
    box.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="mycart-container">
        <h1 className="mycart-title">My Cart</h1>
        <div className="cart-grid">
          {filteredCartGiftBoxes.length > 0 ? (
            filteredCartGiftBoxes.map((box) => (
              <div className="cart-card" key={box._id}>
                <h2>{box.name}</h2>
                <p>Total Items: {box.items?.length || 0}</p>
                <ol>
                  {box.items?.map((item) => (
                    <li key={item._id}>{item.name}</li>
                  ))}
                </ol>
                <button
                  className="view-btn"
                  onClick={() => navigate(`/giftbox/${box._id}`)}
                >
                  View More
                </button>
              </div>
            ))
          ) : (
            <p className="no-results">No gift boxes match your search.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default MyCart;
