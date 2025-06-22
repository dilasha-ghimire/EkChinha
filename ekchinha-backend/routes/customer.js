const express = require("express");
const router = express.Router();
const {
  getCustomerById,
  updateCustomer,
  changeCustomerPassword,
} = require("../controllers/customercontroller");

// GET customer by ID
router.get("/:id", getCustomerById);

// PUT update customer and email
router.put("/:id", updateCustomer);

// PUT change password
router.put("/:id/password", changeCustomerPassword);

module.exports = router;
