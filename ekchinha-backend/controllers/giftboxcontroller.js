const GiftBox = require("../models/giftbox");
const CartGiftBox = require("../models/cartgiftbox");
const Product = require("../models/product");

// 1. Create GiftBox from CartGiftBox
const createFromCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;

    // Step 1: Check again immediately for existing gift box
    let giftBox = await GiftBox.findOne({ cart_source_id: cartId });
    if (giftBox) {
      console.log("Returning existing gift box.");
      return res.status(200).json(giftBox);
    }

    const cart = await CartGiftBox.findById(cartId).populate("items");
    if (!cart) {
      return res.status(404).json({ message: "CartGiftBox not found" });
    }

    // Step 2: Validate item count
    if (!cart.items || cart.items.length < 3 || cart.items.length > 5) {
      return res.status(400).json({
        message: "Gift box must contain between 3 and 5 items before checkout.",
      });
    }

    // Step 3: Compute price and dates
    const itemsTotal = cart.items.reduce((sum, item) => sum + item.price, 0);
    const finalTotalPrice = itemsTotal + 300;

    const currentDate = new Date();
    const timeToAssemble = new Date(currentDate);
    timeToAssemble.setDate(currentDate.getDate() + 4);
    const estimatedDateOfDelivery = new Date(timeToAssemble);
    estimatedDateOfDelivery.setDate(timeToAssemble.getDate() + 2);

    const cardOption = (() => {
      const val = cart.card_option.toLowerCase().trim();
      if (val === "none" || val === "no card") return "no_card";
      if (["standard", "premium", "no_card"].includes(val)) return val;
      throw new Error(`Invalid card_option: ${cart.card_option}`);
    })();

    // Step 4: Create the gift box
    giftBox = await GiftBox.create({
      name: cart.name,
      total_items: cart.items.length,
      time_to_assemble: timeToAssemble,
      estimated_date_of_delivery: estimatedDateOfDelivery,
      card_option: cardOption,
      message: cart.message,
      total_price: finalTotalPrice,
      cart_source_id: cart._id,
    });

    // Step 5: Mark cart as checked out
    if (cart.created_by === "user_created") {
      cart.checked_out = true;
      await cart.save();
    }

    res.status(201).json(giftBox);
  } catch (error) {
    // Handle duplicate cart_source_id error (race condition safety)
    if (error.code === 11000 && error.keyPattern?.cart_source_id) {
      console.warn("Duplicate creation race — fetching existing one.");
      const existing = await GiftBox.findOne({
        cart_source_id: req.params.cartId,
      });
      return res.status(200).json(existing);
    }

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

    // 🔁 Dynamically update dates if they are outdated
    const now = new Date();
    const giftBoxDate = new Date(giftBox.time_to_assemble);

    const shouldUpdate =
      giftBoxDate < now ||
      !giftBox.time_to_assemble ||
      !giftBox.estimated_date_of_delivery;

    if (shouldUpdate) {
      const newAssembleDate = new Date(now);
      newAssembleDate.setDate(now.getDate() + 4);

      const newDeliveryDate = new Date(newAssembleDate);
      newDeliveryDate.setDate(newAssembleDate.getDate() + 2);

      giftBox.time_to_assemble = newAssembleDate;
      giftBox.estimated_date_of_delivery = newDeliveryDate;

      await giftBox.save();
    }

    // Get original cart to access items[]
    const cart = await CartGiftBox.findById(giftBox.cart_source_id).populate(
      "items"
    );

    const giftBoxWithItems = {
      ...giftBox.toObject(),
      items: cart?.items || [],
      formatted_time_to_assemble: formatDate(
        new Date(giftBox.time_to_assemble)
      ),
      formatted_estimated_date_of_delivery: (() => {
        const startDate = new Date(giftBox.estimated_date_of_delivery);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        const day = String(startDate.getDate()).padStart(2, "0");
        const month = startDate.toLocaleString("en-GB", { month: "long" });
        const year = startDate.getFullYear();

        const endDay = String(endDate.getDate()).padStart(2, "0");

        return `${day} - ${endDay} ${month} ${year}`;
      })(),
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
