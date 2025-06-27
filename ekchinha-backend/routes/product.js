const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createProduct,
  getAllProducts,
  getProductsByVendorId,
  updateProduct,
  toggleArchiveProduct,
} = require("../controllers/productcontroller");

router.post("/", upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/vendor/:vendorId", getProductsByVendorId);
router.put("/:id", upload.single("image"), updateProduct);
router.put("/:id/archive", toggleArchiveProduct);

module.exports = router;
