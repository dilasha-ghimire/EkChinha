const express = require("express");
const router = express.Router();
const {
  createCartGiftBox,
  addProductToCart,
  removeProductFromCart,
  getUserCartGiftBoxes,
  getAdminCreatedCartGiftBoxes,
} = require("../controllers/cartgiftboxcontroller");
const { protect } = require("../middleware/auth");

// POST /cart-gift-box → Create a new cart gift box
router.post("/", protect, createCartGiftBox);

// GET /cart-gift-box → Get all cart gift boxes for user
router.get("/", getUserCartGiftBoxes);

// PATCH /cart-gift-box/:id/add → Add product to cart
router.patch("/:id/add", addProductToCart);

// PATCH /cart-gift-box/:id/remove → Remove product from cart
router.patch("/:id/remove", removeProductFromCart);

// GET /cart-gift-box/admin → Get all admin-created cart gift boxes
router.get("/admin", getAdminCreatedCartGiftBoxes);

module.exports = router;
