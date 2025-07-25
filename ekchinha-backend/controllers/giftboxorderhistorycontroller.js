const GiftBoxOrderHistory = require("../models/giftBoxOrderHistory");
const GiftBox = require("../models/giftBox");
const CartGiftBox = require("../models/cartgiftbox");
const Credential = require("../models/credential");
const Product = require("../models/product");
const VendorOrder = require("../models/vendorOrder");
const mongoose = require("mongoose");

// Get All Gift Box Orders for a Customer
const getUserGiftBoxOrders = async (req, res) => {
  try {
    const customerId = req.user.referenceId;

    const rawOrders = await GiftBoxOrderHistory.find({
      customer_id: new mongoose.Types.ObjectId(customerId),
    });

    const enrichedOrders = await Promise.all(
      rawOrders.map(async (order) => {
        const giftBox = await GiftBox.findById(order.gift_box_id);

        console.log("Gift box data:", giftBox); // ✅ Add this debug line

        return {
          _id: order._id,
          status: order.status,
          gift_box_id: {
            _id: giftBox?._id,
            name: giftBox?.name || "Unnamed Box",
            total_items: giftBox?.total_items || 0, // ✅ Make sure this is correct
          },
        };
      })
    );

    res.status(200).json(enrichedOrders);
  } catch (error) {
    console.error("Error in getUserGiftBoxOrders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Gift Box Orders (Admin/report)
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

// Checkout Gift Box
const checkoutGiftBox = async (req, res) => {
  try {
    const giftBox = await GiftBox.findById(req.params.giftBoxId);
    if (!giftBox) {
      return res.status(404).json({ message: "Gift box not found" });
    }

    if (giftBox.checked_out) {
      return res.status(400).json({ message: "Already checked out" });
    }

    // 1. Mark gift box as checked out
    giftBox.checked_out = true;
    await giftBox.save();

    // 2. Mark cart as checked out ONLY IF it's user-created
    const cart = await CartGiftBox.findById(giftBox.cart_source_id);
    if (cart && cart.created_by !== "admin_created") {
      cart.checked_out = true;
      await cart.save();
    }

    // 3. Fetch customer ID from credential
    const credential = await Credential.findById(req.user.id);
    if (!credential || credential.role !== "customer") {
      return res.status(401).json({ message: "Invalid customer" });
    }

    // 4. Use credential.referenceId as customer_id
    const order = await GiftBoxOrderHistory.create({
      customer_id: credential.referenceId,
      gift_box_id: giftBox._id,
    });

    for (const productId of cart.items) {
      const product = await Product.findById(productId);
      if (!product || !product.vendor_id) continue;

      await VendorOrder.create({
        product_id: product._id,
        customer_id: credential.referenceId,
        status: "pending",
      });
    }

    res.status(200).json({
      message: "Checkout successful",
      order,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserGiftBoxOrders,
  getAllGiftBoxOrders,
  checkoutGiftBox,
};
