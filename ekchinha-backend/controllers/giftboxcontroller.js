// controllers/giftBoxController.js
const GiftBox = require("../models/giftBox");
const GiftBoxOrderHistory = require("../models/giftBoxOrderHistory");
const VendorOrder = require("../models/vendorOrder");
const CartGiftBox = require("../models/cartGiftBox");

// 1. Create Gift Box After Payment
const createGiftBox = async (req, res) => {
  try {
    const {
      name,
      total_items,
      card_option,
      message,
      total_price,
      cart_source_id,
      items,
    } = req.body;

    // Automatically set dates
    const currentDate = new Date();

    const time_to_assemble = new Date(currentDate);
    time_to_assemble.setDate(currentDate.getDate() + 4); // +4 days

    const estimated_date_of_delivery = new Date(time_to_assemble);
    estimated_date_of_delivery.setDate(time_to_assemble.getDate() + 2); // +2 more days

    // Create GiftBox
    const giftBox = await GiftBox.create({
      name,
      total_items,
      time_to_assemble,
      estimated_date_of_delivery,
      card_option,
      message,
      total_price,
      created_by: "user_created",
      cart_source_id: cart_source_id || null,
    });

    // Save to GiftBoxOrderHistory
    await GiftBoxOrderHistory.create({
      customer_id: req.user.id,
      gift_box_id: giftBox._id,
      status: "pending",
    });

    // Create vendor orders for each product
    const vendorOrders = items.map((productId) => ({
      product_id: productId,
      customer_id: req.user.id,
      status: "pending",
    }));
    await VendorOrder.insertMany(vendorOrders);

    // Mark cart as checked out
    if (cart_source_id) {
      await CartGiftBox.findByIdAndUpdate(cart_source_id, {
        checked_out: true,
      });
    }

    res.status(201).json({ message: "Gift box created", giftBox });
  } catch (error) {
    console.error("Create Gift Box Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Get Gift Boxes for User
const getUserGiftBoxes = async (req, res) => {
  try {
    const history = await GiftBoxOrderHistory.find({
      customer_id: req.user.id,
    }).populate("gift_box_id");
    res.status(200).json(history);
  } catch (error) {
    console.error("Get Gift Boxes Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createGiftBox,
  getUserGiftBoxes,
};
