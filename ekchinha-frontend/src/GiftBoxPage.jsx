import "./GiftBoxPage.css";
import Navbar from "./Navbar";

const GiftBoxPage = ({ giftBox }) => {
  const isAdmin = giftBox.created_by === "admin_created";

  return (
    <div className="giftbox-container">
      <Navbar searchTerm={""} setSearchTerm={() => {}} />

      <div className="cart-gift-box-container">
        <button className="back-button" onClick={() => window.history.back()}>
          ◀ Back
        </button>
        <div className="giftbox-content">
          <div className="giftbox-images">
            {giftBox.items.map((item) => (
              <img
                key={item._id}
                src={item.image_url}
                alt={item.name}
                className="giftbox-item-image"
              />
            ))}
          </div>

          <div className="giftbox-info">
            <h3>Items</h3>
            <ul>
              {giftBox.items.map((item, i) => (
                <li key={item._id}>
                  {i + 1}. {item.name}
                  {!isAdmin && <button className="delete-btn">Delete</button>}
                </li>
              ))}
            </ul>

            <p>
              <strong>Time to assemble:</strong> {giftBox.time_to_assemble}
            </p>
            <p>
              <strong>Estimated Date of Delivery:</strong>{" "}
              {giftBox.estimated_date_of_delivery}
            </p>

            <div className="card-options">
              <strong>Card Option:</strong>
              <label>
                <input
                  type="radio"
                  checked={giftBox.card_option === "Standard"}
                  readOnly
                />{" "}
                Standard
              </label>
              <label>
                <input
                  type="radio"
                  checked={giftBox.card_option === "Premium"}
                  readOnly
                />{" "}
                Premium
              </label>
              <label>
                <input
                  type="radio"
                  checked={giftBox.card_option === "None"}
                  readOnly
                />{" "}
                No Card
              </label>
            </div>

            <div className="message">
              <strong>Message:</strong>
              <input type="text" value={giftBox.message || ""} readOnly />
            </div>
          </div>
        </div>

        <div className="giftbox-title">
          <h2>
            Name of Gift Box{" "}
            {isAdmin && <span style={{ color: "red" }}>❤️</span>}
          </h2>
          <p>{giftBox.name}</p>
        </div>

        <button className="payment-btn">Proceed to Payment</button>
      </div>
    </div>
  );
};

export default GiftBoxPage;
