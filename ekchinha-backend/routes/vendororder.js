const express = require("express");
const router = express.Router();
const {
  getVendorOrders,
  confirmVendorOrder,
} = require("../controllers/vendorordercontroller");
const { protect } = require("../middleware/auth");

// GET /vendor-orders → List vendor's product orders
router.get("/", protect, getVendorOrders);

// PATCH /vendor-orders/:id/confirm → Confirm an order
router.patch("/:id/confirm", protect, confirmVendorOrder);

module.exports = router;
