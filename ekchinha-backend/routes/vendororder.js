const express = require("express");
const router = express.Router();
const {
  getVendorOrders,
  confirmVendorOrder,
} = require("../controllers/vendorordercontroller");

// GET /vendor-orders → List vendor's product orders
router.get("/", getVendorOrders);

// PATCH /vendor-orders/:id/confirm → Confirm an order
router.patch("/:id/confirm", confirmVendorOrder);

module.exports = router;
