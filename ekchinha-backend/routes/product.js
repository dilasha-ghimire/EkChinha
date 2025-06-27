const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createProduct,
  getAllProducts,
  getProductsByVendorId,
  updateProduct,
  toggleArchiveProduct,
  getProductById,
} = require("../controllers/productcontroller");

router.post("/", upload.single("image"), createProduct);
router.get("/vendor/:vendorId", getProductsByVendorId);
router.get("/:id", getProductById);
router.get("/", getAllProducts);
router.put("/:id", upload.single("image"), updateProduct);
router.put("/:id/archive", toggleArchiveProduct);

module.exports = router;
