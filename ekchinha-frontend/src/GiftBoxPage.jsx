import "./GiftBoxPage.css";
import Navbar from "./Navbar";

const GiftBoxPage = ({ giftBox }) => {
  const isAdmin = giftBox.created_by === "admin_created";

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

      <div className="cart-gift-box-container">
        <button className="back-button" onClick={() => window.history.back()}>
          ◀ Back
        </button>

        <div className="giftbox-content">
          <div className="giftbox-images">
            {giftBox.items?.map((item) => (
              <img
                key={item._id}
                src={
                  item.image.startsWith("http")
                    ? item.image_url
                    : `http://localhost:5000/assets/${item.image}`
                }
                alt={item.name}
                className="giftbox-item-image"
              />
            ))}
          </div>

          <div className="giftbox-info">
            <h3>Items</h3>
            <ul>
              {giftBox.items?.map((item, i) => (
                <li key={item._id}>
                  {i + 1}. {item.name}
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
              <label>
                <input
                  type="radio"
                  checked={giftBox.card_option === "standard"}
                  readOnly
                />{" "}
                Standard
              </label>
              <label>
                <input
                  type="radio"
                  checked={giftBox.card_option === "premium"}
                  readOnly
                />{" "}
                Premium
              </label>
              <label>
                <input
                  type="radio"
                  checked={giftBox.card_option === "no_card"}
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
