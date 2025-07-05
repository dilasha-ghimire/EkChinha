import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./Saved.css";
import ProductModal from "./ProductModal";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000";

function Saved() {
  const [searchTerm, setSearchTerm] = useState(""); // Local search state
  const [savedProducts, setSavedProducts] = useState([]);
  const [savedGiftBoxes, setSavedGiftBoxes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${BASE_URL}/api/saved-items`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        const all = res.data;
        const products = all.filter((i) => i.item_type === "product");
        const giftboxes = all.filter((i) => i.item_type === "cart_gift_box");

        const populatedGiftBoxes = await Promise.all(
          giftboxes.map(async (giftbox) => {
            const itemIds = giftbox.item_id.items;

            const populatedItems = await Promise.all(
              itemIds.map(async (productId) => {
                try {
                  const res = await axios.get(
                    `${BASE_URL}/api/products/${productId}`
                  );
                  return res.data;
                } catch (err) {
                  console.error("Error fetching product in giftbox:", err);
                  return null;
                }
              })
            );

            giftbox.item_id.items = populatedItems.filter(Boolean);
            return giftbox;
          })
        );

        setSavedProducts(products);
        setSavedGiftBoxes(populatedGiftBoxes);
      })
      .catch((err) => console.error("Saved items fetch error:", err));
  }, []);

  const scrollAmount = 300;

  const scrollLeft = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.scrollLeft === 0) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
    if (atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleViewMore = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/${id}`);
      setSelectedProduct(res.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  // 🔍 Filter by search term
  const filteredSavedProducts = savedProducts.filter((product) =>
    product.item_id.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSavedGiftBoxes = savedGiftBoxes.filter((box) =>
    box.item_id.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Saved Products */}
      <div className="saved-section-content product-section-content">
        <h2>Saved Items</h2>
        <div className="carousel-wrapper">
          {filteredSavedProducts.length > 0 && (
            <button
              className="scroll-btn left"
              onClick={() => scrollLeft("saved-products-carousel")}
            >
              <img src="/left-arrow.png" alt="Left" />
            </button>
          )}
          <div className="carousel-container" id="saved-products-carousel">
            {filteredSavedProducts.length > 0 ? (
              filteredSavedProducts.map((item) => (
                <div key={item._id} className="card">
                  <img
                    src={`${BASE_URL}/assets/${item.item_id.image}`}
                    alt={item.item_id.name}
                    className="image-placeholder"
                  />
                  <p>{item.item_id.name}</p>
                  <button
                    className="view-btn product-view-btn"
                    onClick={() => handleViewMore(item.item_id._id)}
                  >
                    View More
                  </button>
                </div>
              ))
            ) : (
              <p className="no-results">No saved products found.</p>
            )}
          </div>
          {filteredSavedProducts.length > 0 && (
            <button
              className="scroll-btn right"
              onClick={() => scrollRight("saved-products-carousel")}
            >
              <img src="/right-arrow.png" alt="Right" />
            </button>
          )}
        </div>
      </div>

      {/* Saved Gift Boxes */}
      <div className="saved-section-content giftbox-section-content">
        <h2>Saved Gift Boxes</h2>
        <div className="carousel-wrapper">
          {filteredSavedGiftBoxes.length > 0 && (
            <button
              className="scroll-btn left"
              onClick={() => scrollLeft("saved-giftbox-carousel")}
            >
              <img src="/left-arrow.png" alt="Left" />
            </button>
          )}
          <div className="carousel-container" id="saved-giftbox-carousel">
            {filteredSavedGiftBoxes.length > 0 ? (
              filteredSavedGiftBoxes.map((item) => (
                <div key={item._id} className="giftbox">
                  <h3>{item.item_id.name}</h3>
                  <p>Total Items: {item.item_id.items.length}</p>
                  <div className="thumbs">
                    {item.item_id.items.map((subItem) => (
                      <img
                        key={subItem._id}
                        src={`${BASE_URL}/assets/${subItem.image}`}
                        alt={subItem.name}
                        className="thumb"
                      />
                    ))}
                  </div>
                  <button
                    className="view-btn giftbox-view-btn"
                    onClick={() => navigate(`/giftbox/${item.item_id._id}`)}
                  >
                    View More
                  </button>
                </div>
              ))
            ) : (
              <p className="no-results">No saved gift boxes found.</p>
            )}
          </div>
          {filteredSavedGiftBoxes.length > 0 && (
            <button
              className="scroll-btn right"
              onClick={() => scrollRight("saved-giftbox-carousel")}
            >
              <img src="/right-arrow.png" alt="Right" />
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ProductModal product={selectedProduct} onClose={closeModal} />
      )}
    </div>
  );
}

export default Saved;
