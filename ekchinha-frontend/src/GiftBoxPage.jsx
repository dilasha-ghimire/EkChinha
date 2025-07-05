import "./GiftBoxPage.css";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const GiftBoxPage = ({ giftBox }) => {
  const [selectedCardOption, setSelectedCardOption] = useState(
    giftBox.card_option
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ type: "", text: "" });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);

  const navigate = useNavigate();
  const isAdmin = giftBox.created_by === "admin_created";

  const showPopup = (type, text) => {
    setPopupMessage({ type, text });
    setTimeout(() => setPopupMessage({ type: "", text: "" }), 1500);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token && isAdmin && giftBox.cart_source_id) {
      axios
        .get(`${BASE_URL}/saved-items`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const saved = res.data.some(
            (item) =>
              item.item_type === "cart_gift_box" &&
              item.item_id?._id?.toString() ===
                giftBox.cart_source_id?.toString()
          );
          setIsSaved(saved);
        })
        .catch((err) => {
          console.error("Error checking saved status:", err);
        });
    }
  }, [giftBox._id, giftBox.cart_source_id, isAdmin]);

  const handleHeartClick = async () => {
    if (!isAdmin || !giftBox.cart_source_id) return;

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await axios.post(
        `${BASE_URL}/saved-items`,
        {
          item_type: "cart_gift_box",
          item_id: giftBox.cart_source_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const wasUnsave = res.data.message === "Item unsaved";
      setIsSaved(!wasUnsave);
      showPopup("success", res.data.message);
    } catch (err) {
      const message = err.response?.data?.message || "Error saving gift box.";
      showPopup("error", message);
      console.error("Save/unsave error:", message);
    }
  };

  const handleProceed = () => {
    if (!isLoggedIn) return navigate("/login");
    navigate("/payment");
  };

  const handleDeleteItem = async (productId) => {
    if (giftBox.created_by === "admin_created") return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      await axios.patch(
        `${BASE_URL}/cart-gift-box/${giftBox.cart_source_id}/remove`,
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reload page or update state
      window.location.reload();
      showPopup("success", "Item removed from gift box");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to remove item from gift box";
      showPopup("error", msg);
    }
  };

  const formatFullDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    const weekday = date.toLocaleString("en-GB", { weekday: "long" });
    return `${day} ${month} ${year}, ${weekday}`;
  };

  const formatDeliveryRange = (startDateStr) => {
    const start = new Date(startDateStr);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const day1 = String(start.getDate()).padStart(2, "0");
    const day2 = String(end.getDate()).padStart(2, "0");
    const month = start.toLocaleString("en-GB", { month: "long" });
    const year = start.getFullYear();

    return `${day1} - ${day2} ${month} ${year}`;
  };

  return (
    <div className="giftbox-container">
      <Navbar searchTerm={""} setSearchTerm={() => {}} />

      {/* POPUP MESSAGE */}
      {popupMessage.text && (
        <div
          className={`popup-message ${
            popupMessage.type === "success" ? "popup-success" : "popup-error"
          }`}
        >
          {popupMessage.text}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="logout-confirm-overlay">
          <div className="logout-confirm-box">
            <button
              className="close-btn"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <img src="/close.png" alt="Close" className="close-icon" />
            </button>
            <img src="/alert.png" alt="Warning" className="logout-icon" />
            <h2>Are you sure?</h2>
            <p>Do you want to delete this item?</p>
            <div className="logout-buttons">
              <button
                className="no-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                NO
              </button>
              <button
                className="yes-btn"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDeleteItem(deleteProductId);
                }}
              >
                YES
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="cart-gift-box-container">
        <div className="gift-box-cart-container">
          <button
            className="gift-box-back-button"
            onClick={() => window.history.back()}
          >
            <span className="gift-box-back-arrow">◄ </span>
            <span className="gift-box-back-text">Back</span>
          </button>
        </div>

        <div className="giftbox-main-box">
          {/* Left column */}
          <div className="giftbox-left-column">
            <div className="giftbox-images">
              {(() => {
                const items = giftBox.items || [];
                const count = items.length;

                const renderRow = (rowItems) => (
                  <div className="giftbox-row center">
                    {rowItems.map((item) => (
                      <img
                        key={item._id}
                        src={
                          item.image_url?.startsWith("http")
                            ? item.image_url
                            : `http://localhost:5000/assets/${item.image || ""}`
                        }
                        alt={item.name}
                        className="giftbox-item-image"
                      />
                    ))}
                  </div>
                );

                if (count === 1) return renderRow([items[0]]);
                if (count === 2) return renderRow(items);
                if (count === 3)
                  return (
                    <>
                      {renderRow(items.slice(0, 2))}
                      {renderRow([items[2]])}
                    </>
                  );
                if (count === 4)
                  return (
                    <>
                      {renderRow(items.slice(0, 2))}
                      {renderRow(items.slice(2))}
                    </>
                  );
                if (count === 5)
                  return (
                    <>
                      {renderRow(items.slice(0, 3))}
                      {renderRow(items.slice(3))}
                    </>
                  );

                return null;
              })()}
            </div>

            <div className="giftbox-title">
              <h2>Name of Gift Box</h2>
              <p>
                {giftBox.name}
                {isAdmin && (
                  <img
                    src={isSaved ? "/fill-heart.png" : "/heart.png"}
                    alt="Heart Icon"
                    onClick={handleHeartClick}
                    style={{
                      height: "1em",
                      verticalAlign: "middle",
                      marginLeft: "4rem",
                      cursor: "pointer",
                    }}
                  />
                )}
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="giftbox-right-column">
            <h3>Items</h3>
            <ul>
              {giftBox.items?.map((item, i) => (
                <li key={item._id}>
                  {i + 1}. {item.name}
                  {!isAdmin && (
                    <img
                      src="/bin.png"
                      alt="Delete"
                      onClick={() => {
                        setDeleteProductId(item._id);
                        setShowDeleteConfirm(true);
                      }}
                      style={{
                        height: "1em",
                        verticalAlign: "middle",
                        marginLeft: "3rem",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </li>
              ))}
            </ul>

            <p>
              <strong>Time to assemble:</strong>{" "}
              {formatFullDate(giftBox.time_to_assemble)}
            </p>
            <p>
              <strong>Estimated Date of Delivery:</strong>{" "}
              {formatDeliveryRange(giftBox.estimated_date_of_delivery)}
            </p>

            <div className="card-options">
              <strong>Card Option:</strong>
              <div className="card-options-group">
                <label>
                  <input
                    type="radio"
                    value="standard"
                    checked={selectedCardOption === "standard"}
                    onChange={() => setSelectedCardOption("standard")}
                  />
                  Standard
                </label>
                <label>
                  <input
                    type="radio"
                    value="premium"
                    checked={selectedCardOption === "premium"}
                    onChange={() => setSelectedCardOption("premium")}
                  />
                  Premium
                </label>
                <label>
                  <input
                    type="radio"
                    value="no_card"
                    checked={selectedCardOption === "no_card"}
                    onChange={() => setSelectedCardOption("no_card")}
                  />
                  No Card
                </label>
              </div>
            </div>

            <div className="message">
              <strong>Message:</strong>
              <input type="text" value={giftBox.message || ""} readOnly />
            </div>

            <button className="payment-btn" onClick={handleProceed}>
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftBoxPage;
