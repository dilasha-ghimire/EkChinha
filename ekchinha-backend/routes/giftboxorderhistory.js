const express = require("express");
const router = express.Router();
const {
  getUserGiftBoxOrders,
  getAllGiftBoxOrders,
} = require("../controllers/giftboxorderhistorycontroller");

// GET /gift-box-orders → Customer's own orders
router.get("/", getUserGiftBoxOrders);

// GET /gift-box-orders/all → Admin: all orders
router.get("/all", getAllGiftBoxOrders);

module.exports = router;
