const VendorOrder = require("../models/vendorOrder");
const Credential = require("../models/credential");

// 1. Get Vendor Orders (filtered by vendor's products)
const getVendorOrders = async (req, res) => {
  try {
    const credential = await Credential.findById(req.user.id);
    if (!credential || credential.role !== "vendor") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const vendorId = credential.referenceId.toString();

    const orders = await VendorOrder.find()
      .populate("product_id")
      .populate("customer_id");

    const filteredOrders = orders.filter(
      (order) => order.product_id?.vendor_id?.toString() === vendorId
    );

    res.status(200).json(filteredOrders);
  } catch (error) {
    console.error("Get Vendor Orders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Confirm Vendor Order (status = confirmed)
const confirmVendorOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await VendorOrder.findByIdAndUpdate(
      id,
      { status: "confirmed" },
      { new: true }
    ).populate("product_id");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const product = await Product.findById(order.product_id._id);
    if (product && product.stock > 0) {
      product.stock -= 1;
      await product.save();
    }

    res.status(200).json({ message: "Order confirmed", order });
  } catch (error) {
    console.error("Confirm Vendor Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getVendorOrders,
  confirmVendorOrder,
};
