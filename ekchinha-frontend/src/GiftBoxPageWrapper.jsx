import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GiftBoxPage from "./GiftBoxPage";
import axios from "axios";

const GiftBoxPageWrapper = () => {
  const { id } = useParams();
  const [giftBox, setGiftBox] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/cart-gift-box/${id}`)
      .then((res) => setGiftBox(res.data))
      .catch((err) => console.error("Fetch error", err));
  }, [id]);

  if (!giftBox) return <div>Loading...</div>;

  return <GiftBoxPage giftBox={giftBox} />;
};

export default GiftBoxPageWrapper;
