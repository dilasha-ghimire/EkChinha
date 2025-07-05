const express = require("express");
const router = express.Router();
const {
  saveItem,
  getSavedItems,
} = require("../controllers/saveditemscontroller");
const { protect } = require("../middleware/auth");

// POST /saved-items → Save a product or gift box
router.post("/", protect, saveItem);

// GET /saved-items → List all saved items for user
router.get("/", protect, getSavedItems);

module.exports = router;
