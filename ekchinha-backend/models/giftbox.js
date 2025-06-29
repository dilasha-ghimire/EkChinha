const mongoose = require("mongoose");

const GiftBoxSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    total_items: { type: Number, required: true },
    time_to_assemble: { type: String, required: true },
    estimated_date_of_delivery: { type: Date, required: true },
    card_option: {
      type: String,
      enum: ["standard", "premium", "no_card"],
      required: true,
      default: "no_card",
    },
    message: { type: String },
    total_price: { type: Number, required: true },
    created_by: {
      type: String,
      enum: ["user_created", "admin_created"],
      required: true,
      default: "user_created",
    },
    cart_source_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartGiftBox",
      default: null,
    },
  },
  { collection: "gift_boxes" }
);

module.exports = mongoose.model("GiftBox", GiftBoxSchema);
