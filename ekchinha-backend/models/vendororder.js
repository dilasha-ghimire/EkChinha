const mongoose = require("mongoose");

const VendorOrderSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "packed", "shipped", "delivered"],
      default: "pending",
      required: true,
    },
  },
  { collection: "vendor_order" }
);

module.exports = mongoose.model("VendorOrder", VendorOrderSchema);
