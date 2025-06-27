const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  details: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  product_significance: { type: String },
  artisan_background: { type: String },
  cultural_significance: { type: String },
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  archived: {
    type: String,
    enum: ["true", "false"],
    default: "false",
  },
});

module.exports = mongoose.model("Product", ProductSchema);
