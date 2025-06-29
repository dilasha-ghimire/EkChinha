const express = require("express");
const router = express.Router();
const {
  createGiftBox,
  getUserGiftBoxes,
} = require("../controllers/giftboxcontroller");

// POST /gift-box → Create after payment
router.post("/", createGiftBox);

// GET /gift-box → User's gift box order history
router.get("/", getUserGiftBoxes);

module.exports = router;
