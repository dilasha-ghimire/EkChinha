const express = require("express");
const router = express.Router();
const {
  saveItem,
  getSavedItems,
} = require("../controllers/saveditemscontroller");

// POST /saved-items → Save a product or gift box
router.post("/", saveItem);

// GET /saved-items → List all saved items for user
router.get("/", getSavedItems);

module.exports = router;
