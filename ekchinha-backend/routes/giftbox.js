const express = require("express");
const router = express.Router();
const {
  createFromCart,
  getByCartId,
  updateCardOption,
  updateGiftBoxDetails,
  updateDeliveryDate,
} = require("../controllers/giftboxcontroller");
const { protect } = require("../middleware/auth");

// Create GiftBox from CartGiftBox
router.post("/from-cart/:cartId", createFromCart);

// Get finalized GiftBox by CartGiftBox ID (with items[])
router.get("/by-cart/:cartId", getByCartId);

router.patch("/:id/card-option", protect, updateCardOption);

router.patch("/:id/update-details", protect, updateGiftBoxDetails);

router.patch("/:id/delivery-date", protect, updateDeliveryDate);

module.exports = router;
