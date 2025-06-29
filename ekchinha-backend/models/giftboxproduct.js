const mongoose = require("mongoose");

const GiftBoxProductSchema = new mongoose.Schema(
  {
    gift_box_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GiftBox",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { collection: "gift_box_product" }
);

module.exports = mongoose.model("GiftBoxProduct", GiftBoxProductSchema);
