const mongoose = require("mongoose");

const SavedItemSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    item_type: {
      type: String,
      enum: ["product", "gift_box"],
      required: true,
    },
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "item_type",
      // dynamic ref to either 'Product' or 'GiftBox'
    },
  },
  { collection: "saved_items" }
);

module.exports = mongoose.model("SavedItem", SavedItemSchema);
