const express = require("express");
const router = express.Router();
const {
  customerRegister,
  vendorRegister,
  login,
} = require("../controllers/authcontroller");

router.post("/register/customer", customerRegister);
router.post("/register/vendor", vendorRegister);
router.post("/login", login);

module.exports = router;
