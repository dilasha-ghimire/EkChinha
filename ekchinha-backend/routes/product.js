const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");

const {
  createProduct,
  getAllProducts,
  getProductsByVendorId,
  updateProduct,
  toggleArchiveProduct,
  getProductById,
} = require("../controllers/productcontroller");

router.post("/", upload.single("image"), createProduct);
router.get("/vendor/:vendorId", protect, getProductsByVendorId);
router.get("/:id", getProductById);
router.get("/", getAllProducts);
router.put("/:id", upload.single("image"), updateProduct);
router.put("/:id/archive", protect, toggleArchiveProduct);

module.exports = router;
