const express = require("express");
const router = express.Router();
const {
  createCartGiftBox,
  addProductToCart,
  removeProductFromCart,
  getUserCartGiftBoxes,
  getAdminCreatedCartGiftBoxes,
  getCartGiftBoxById,
} = require("../controllers/cartgiftboxcontroller");
const { protect } = require("../middleware/auth");

// POST /cart-gift-box → Create a new cart gift box
router.post("/", protect, createCartGiftBox);

// GET /cart-gift-box → Get all cart gift boxes for user
router.get("/", protect, getUserCartGiftBoxes);

// PATCH /cart-gift-box/:id/add → Add product to cart
router.patch("/:id/add", protect, addProductToCart);

// PATCH /cart-gift-box/:id/remove → Remove product from cart
router.patch("/:id/remove", protect, removeProductFromCart);

// GET /cart-gift-box/admin → Get all admin-created cart gift boxes
router.get("/admin", getAdminCreatedCartGiftBoxes);

// GET /cart-gift-box/:id → Get one cart gift box by ID
router.get("/:id", getCartGiftBoxById);

module.exports = router;
