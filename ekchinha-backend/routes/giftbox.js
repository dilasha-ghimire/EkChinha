const express = require("express");
const router = express.Router();
const giftBoxController = require("../controllers/giftboxcontroller");

// Create GiftBox from CartGiftBox
router.post("/from-cart/:cartId", giftBoxController.createFromCart);

// Get GiftBox by CartGiftBox ID
router.get("/by-cart/:cartId", giftBoxController.getByCartId);

module.exports = router;
