import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GiftBoxPage from "./GiftBoxPage";
import axios from "axios";

const GiftBoxPageWrapper = () => {
  const { id } = useParams(); // CartGiftBox ID
  const [giftBox, setGiftBox] = useState(null);

  useEffect(() => {
    const fetchGiftBox = async () => {
      try {
        // Try getting the finalized gift box first
        const res = await axios.get(
          `http://localhost:5000/api/gift-box/by-cart/${id}`
        );
        setGiftBox(res.data);
      } catch (error) {
        // If not found, create it first
        try {
          await axios.post(
            `http://localhost:5000/api/gift-box/from-cart/${id}`
          );

          // Immediately fetch it again
          const retry = await axios.get(
            `http://localhost:5000/api/gift-box/by-cart/${id}`
          );
          setGiftBox(retry.data);
        } catch (err) {
          console.error("❌ GiftBox creation or retry failed:", err);
        }
      }
    };

    fetchGiftBox();
  }, [id]);

  if (!giftBox) return <div>Loading...</div>;

  return <GiftBoxPage giftBox={giftBox} />;
};

export default GiftBoxPageWrapper;
