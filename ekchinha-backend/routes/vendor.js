const express = require("express");
const router = express.Router();
const {
  getVendorById,
  updateVendor,
  changeVendorPassword,
} = require("../controllers/vendorcontroller");

// GET vendor by ID
router.get("/:id", getVendorById);

// PUT update vendor and email
router.put("/:id", updateVendor);

// PUT change password
router.put("/:id/password", changeVendorPassword);

module.exports = router;
