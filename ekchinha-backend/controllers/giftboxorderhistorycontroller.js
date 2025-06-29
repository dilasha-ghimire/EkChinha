const GiftBoxOrderHistory = require("../models/giftBoxOrderHistory");

// 1. Get All Gift Box Orders for a Customer
const getUserGiftBoxOrders = async (req, res) => {
  try {
    const orders = await GiftBoxOrderHistory.find({
      customer_id: req.user.id,
    }).populate("gift_box_id");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get Gift Box Orders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Get All Gift Box Orders (admin or report view)
const getAllGiftBoxOrders = async (req, res) => {
  try {
    const orders = await GiftBoxOrderHistory.find()
      .populate("gift_box_id")
      .populate("customer_id");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserGiftBoxOrders,
  getAllGiftBoxOrders,
};
