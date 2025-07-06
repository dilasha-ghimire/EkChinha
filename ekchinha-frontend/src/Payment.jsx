import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const giftBox = location.state?.giftBox;
  const [selectedPayment, setSelectedPayment] = useState("esewa");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    if (!giftBox) navigate("/mycart");
  }, [giftBox, navigate]);

  if (!giftBox) return null;

  const getCardCost = (option) => {
    if (option === "standard") return 250;
    if (option === "premium") return 500;
    return 0;
  };

  const cardCost = getCardCost(giftBox.card_option);

  return (
    <>
      <Navbar searchTerm={""} setSearchTerm={() => {}} />
      <div className="payment-container">
        <button className="payment-back-button" onClick={() => navigate(-1)}>
          <span className="payment-back-arrow">◄ </span>
          <span className="payment-back-text">Back to Gift Box</span>
        </button>

        <div className="payment-main-box">
          <div className="payment-right-column">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Items</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {giftBox.items.map((item, i) => (
                  <tr key={item._id}>
                    <td>
                      <span className="item-name">
                        {i + 1}. {item.name}
                      </span>
                    </td>
                    <td>Rs. {item.price}</td>
                  </tr>
                ))}
                <tr>
                  <td className="card-option-label">
                    Card Option:{" "}
                    <span className="card-option-value">
                      {giftBox.card_option === "no_card"
                        ? "None"
                        : giftBox.card_option.charAt(0).toUpperCase() +
                          giftBox.card_option.slice(1)}
                    </span>
                  </td>
                  <td className="card-option-value">Rs. {cardCost}</td>
                </tr>
                <tr>
                  <td className="total-price-label">
                    <strong>Total Price (with Delivery):</strong>
                  </td>
                  <td className="total-price-value">
                    <strong>Rs. {giftBox.total_price}</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            <div>
              <strong className="payment-label">Payment Option:</strong>
              <div className="payment-options">
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="esewa"
                    checked={selectedPayment === "esewa"}
                    onChange={() => setSelectedPayment("esewa")}
                  />
                  <img src="/esewa.png" alt="eSewa" />
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="khalti"
                    checked={selectedPayment === "khalti"}
                    onChange={() => setSelectedPayment("khalti")}
                  />
                  <img src="/khalti.png" alt="Khalti" />
                </label>
              </div>
            </div>

            <button className="pay-button">Pay</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Payment;
