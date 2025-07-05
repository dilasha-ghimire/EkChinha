import "./GiftBoxPage.css";
import Navbar from "./Navbar";
import { useState } from "react";

const GiftBoxPage = ({ giftBox }) => {
  const isAdmin = giftBox.created_by === "admin_created";

  const [selectedCardOption, setSelectedCardOption] = useState(
    giftBox.card_option
  );

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
        <div className="gift-box-cart-container">
          <button
            className="gift-box-back-button"
            onClick={() => window.history.back()}
          >
            <span className="gift-box-back-arrow">◄ </span>
            <span className="gift-box-back-text">Back</span>
          </button>
        </div>

        <div className="giftbox-content">
          <div className="giftbox-images">
            {(() => {
              const items = giftBox.items || [];
              const count = items.length;

              if (count === 1) {
                return (
                  <div className="giftbox-row center">
                    <img
                      src={
                        items[0].image_url?.startsWith("http")
                          ? items[0].image_url
                          : `http://localhost:5000/assets/${
                              items[0].image || ""
                            }`
                      }
                      alt={items[0].name}
                      className="giftbox-item-image"
                    />
                  </div>
                );
              }

              if (count === 2) {
                return (
                  <div className="giftbox-row center">
                    {items.map((item) => (
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
              }

              if (count === 3) {
                return (
                  <>
                    <div className="giftbox-row center">
                      {items.slice(0, 2).map((item) => (
                        <img
                          key={item._id}
                          src={
                            item.image_url?.startsWith("http")
                              ? item.image_url
                              : `http://localhost:5000/assets/${
                                  item.image || ""
                                }`
                          }
                          alt={item.name}
                          className="giftbox-item-image"
                        />
                      ))}
                    </div>
                    <div className="giftbox-row center single-item-row">
                      <img
                        src={
                          items[2].image_url?.startsWith("http")
                            ? items[2].image_url
                            : `http://localhost:5000/assets/${
                                items[2].image || ""
                              }`
                        }
                        alt={items[2].name}
                        className="giftbox-item-image"
                      />
                    </div>
                  </>
                );
              }

              const rows =
                count === 4
                  ? [items.slice(0, 2), items.slice(2)]
                  : [items.slice(0, 3), items.slice(3)];

              return rows.map((rowItems, i) => (
                <div key={i} className="giftbox-row center">
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
              ));
            })()}
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
