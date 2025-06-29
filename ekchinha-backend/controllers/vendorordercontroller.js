const VendorOrder = require("../models/vendorOrder");

// 1. Get Vendor Orders (filtered by vendor's products)
const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user.id; // Assuming auth middleware attaches vendor ID

    const orders = await VendorOrder.find()
      .populate({
        path: "product_id",
        match: { vendor_id: vendorId },
      })
      .populate("customer_id");

    // Filter only orders where the product actually belongs to the vendor
    const filteredOrders = orders.filter((order) => order.product_id !== null);

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
