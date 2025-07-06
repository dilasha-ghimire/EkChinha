const express = require("express");
const router = express.Router();
const {
  getUserGiftBoxOrders,
  getAllGiftBoxOrders,
  checkoutGiftBox, // ✅ Add this
} = require("../controllers/giftboxorderhistorycontroller");

const { protect } = require("../middleware/auth");

router.get("/", protect, getUserGiftBoxOrders);
router.get("/all", protect, getAllGiftBoxOrders);
router.post("/checkout/:giftBoxId", protect, checkoutGiftBox);

module.exports = router;
