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
        const token = localStorage.getItem("token");

        // 1. Try getting the gift box (user-specific if admin-created)
        const res = await axios.get(
          `http://localhost:5000/api/gift-box/by-cart/${id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        setGiftBox(res.data);
      } catch (error) {
        try {
          // 2. If not found, create it
          const token = localStorage.getItem("token");
          await axios.post(
            `http://localhost:5000/api/gift-box/from-cart/${id}`,
            {},
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );

          // 3. Then refetch it
          const retry = await axios.get(
            `http://localhost:5000/api/gift-box/by-cart/${id}`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
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
