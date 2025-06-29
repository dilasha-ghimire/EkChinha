const mongoose = require("mongoose");

const GiftBoxOrderHistorySchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    gift_box_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GiftBox",
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "packed", "shipped", "delivered"],
      default: "confirmed",
      required: true,
    },
  },
  { collection: "gift_box_order_history" }
);

module.exports = mongoose.model(
  "GiftBoxOrderHistory",
  GiftBoxOrderHistorySchema
);
