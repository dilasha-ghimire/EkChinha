const mongoose = require("mongoose");

const GiftBoxSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    total_items: { type: Number, required: true },
    time_to_assemble: { type: String, required: true },
    estimated_date_of_delivery: { type: String, required: false },
    card_option: {
      type: String,
      enum: ["standard", "premium", "no_card"],
      required: true,
      default: "no_card",
    },
    message: { type: String },
    total_price: { type: Number, required: true },
    cart_source_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartGiftBox",
      required: true,
    },
    checked_out: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "gift_boxes" }
);

module.exports =
  mongoose.models.GiftBox || mongoose.model("GiftBox", GiftBoxSchema);
