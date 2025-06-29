const mongoose = require("mongoose");

const CartGiftBoxSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    card_option: {
      type: String,
      enum: ["Standard", "Premium", "None"],
      required: true,
      default: "None",
    },
    message: {
      type: String,
      default: "",
    },
    created_by: {
      type: String,
      enum: ["user_created", "admin_created"],
      required: true,
      default: "user_created",
    },
    checked_out: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "cart_gift_boxes" }
);

module.exports = mongoose.model("CartGiftBox", CartGiftBoxSchema);
