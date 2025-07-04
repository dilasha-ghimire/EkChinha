const GiftBox = require("../models/giftbox");
const CartGiftBox = require("../models/cartgiftbox");
const Product = require("../models/product");

// 1. Create GiftBox from CartGiftBox
const createFromCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;

    // Check if it already exists
    const existing = await GiftBox.findOne({ cart_source_id: cartId });
    if (existing) {
      console.log("Returning existing gift box.");
      return res.status(200).json(existing);
    }

    const cart = await CartGiftBox.findById(cartId).populate("items");
    if (!cart) {
      return res.status(404).json({ message: "CartGiftBox not found" });
    }

    // Validate item count
    if (!cart.items || cart.items.length < 3 || cart.items.length > 5) {
      return res.status(400).json({
        message: "Gift box must contain between 3 and 5 items before checkout.",
      });
    }

    // Compute total price
    const productPrices = await Product.find(
      { _id: { $in: cart.items } },
      "price"
    );
    const itemsTotal = productPrices.reduce((sum, p) => sum + p.price, 0);
    const finalTotalPrice = itemsTotal + 300;

    // Auto-generate dates
    const currentDate = new Date();
    const timeToAssemble = new Date(currentDate);
    timeToAssemble.setDate(currentDate.getDate() + 2);

    const estimatedDateOfDelivery = new Date(timeToAssemble);
    estimatedDateOfDelivery.setDate(timeToAssemble.getDate() + 2);

    // Normalize card option
    const cardOption = (() => {
      const val = cart.card_option.toLowerCase().trim();
      if (val === "none" || val === "no card") return "no_card";
      if (["standard", "premium", "no_card"].includes(val)) return val;
      throw new Error(`Invalid card_option: ${cart.card_option}`);
    })();

    // Create final GiftBox
    const giftBox = await GiftBox.create({
      name: cart.name,
      total_items: cart.items.length,
      time_to_assemble: timeToAssemble,
      estimated_date_of_delivery: estimatedDateOfDelivery,
      card_option: cardOption,
      message: cart.message,
      total_price: finalTotalPrice,
      cart_source_id: cart._id,
    });

    // Mark original cart as checked out
    cart.checked_out = true;
    await cart.save();

    res.status(201).json(giftBox);
  } catch (error) {
    console.error("Error creating GiftBox from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Get GiftBox by CartGiftBox ID (with items[])
const getByCartId = async (req, res) => {
  try {
    const giftBox = await GiftBox.findOne({
      cart_source_id: req.params.cartId,
    });

    if (!giftBox) {
      return res.status(404).json({ message: "GiftBox not found" });
    }

    // Get original cart to access items[]
    const cart = await CartGiftBox.findById(giftBox.cart_source_id).populate(
      "items"
    );

    const giftBoxWithItems = {
      ...giftBox.toObject(),
      items: cart?.items || [],
    };

    res.status(200).json(giftBoxWithItems);
  } catch (error) {
    console.error("Error fetching GiftBox:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createFromCart,
  getByCartId,
};
