const GiftBox = require("../models/giftBox");
const CartGiftBox = require("../models/cartgiftbox");
const Product = require("../models/product");

// ✅ Format full date string
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "long" });
  const year = date.getFullYear();
  const weekday = date.toLocaleString("en-GB", { weekday: "long" });
  return `${day} ${month} ${year}, ${weekday}`;
}

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
    if (!cart.items || cart.items.length <= 3 || cart.items.length >= 5) {
      return res.status(400).json({
        message: "Gift box must contain between 3 and 5 items before checkout.",
      });
    }

    // Step 3: Compute price and dates
    const currentDate = new Date();
    const timeToAssemble = new Date(currentDate);
    timeToAssemble.setDate(currentDate.getDate() + 4);
    const estimatedDateOfDelivery = new Date(timeToAssemble);
    estimatedDateOfDelivery.setDate(timeToAssemble.getDate() + 2);

    const itemsTotal = cart.items.reduce((sum, item) => sum + item.price, 0);

    // Normalize and calculate card cost
    const cardOption = (() => {
      const val = cart.card_option.toLowerCase().trim();
      if (val === "none" || val === "no card") return "no_card";
      if (["standard", "premium", "no_card"].includes(val)) return val;
      throw new Error(`Invalid card_option: ${cart.card_option}`);
    })();

    let cardCost = 0;
    if (cardOption === "standard") cardCost = 250;
    else if (cardOption === "premium") cardCost = 500;

    const finalTotalPrice = itemsTotal + 300 + cardCost;

    // Step 4: Create the gift box
    giftBox = await GiftBox.create({
      name: cart.name,
      total_items: cart.items.length,
      time_to_assemble: timeToAssemble.toString(),
      estimated_date_of_delivery: estimatedDateOfDelivery.toString(),
      card_option: cardOption,
      message: cart.message,
      total_price: finalTotalPrice,
      cart_source_id: cart._id,
    });

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

    // 🛠 Only update if NOT checked out
    if (!giftBox.checked_out) {
      const now = new Date();
      const newAssembleDate = new Date(now);
      newAssembleDate.setDate(now.getDate() + 4);

      const newDeliveryDate = new Date(newAssembleDate);
      newDeliveryDate.setDate(newAssembleDate.getDate() + 2);

      const newAssembleStr = newAssembleDate.toString();
      const newDeliveryStr = newDeliveryDate.toString();

      const isDifferent =
        giftBox.time_to_assemble !== newAssembleStr ||
        giftBox.estimated_date_of_delivery !== newDeliveryStr;

      if (isDifferent) {
        giftBox.time_to_assemble = newAssembleStr;
        giftBox.estimated_date_of_delivery = newDeliveryStr;

        // Force update in Mongoose
        giftBox.markModified("time_to_assemble");
        giftBox.markModified("estimated_date_of_delivery");

        await giftBox.save();
        console.log("✅ Dates updated in gift box.");
      } else {
        console.log("ℹ️ Dates already up-to-date.");
      }
    }

    // 🎁 Get cart items to return with gift box
    const cart = await CartGiftBox.findById(giftBox.cart_source_id).populate(
      "items"
    );

    const giftBoxWithItems = {
      ...giftBox.toObject(),
      items: cart?.items || [],
      created_by: cart?.created_by,
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
    console.error("❌ Error fetching GiftBox:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/gift-box/:id/card-option
const updateCardOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { card_option } = req.body;

    const validOptions = ["no_card", "standard", "premium"];
    if (!validOptions.includes(card_option)) {
      return res.status(400).json({ message: "Invalid card option" });
    }

    const giftBox = await GiftBox.findById(id);
    if (!giftBox)
      return res.status(404).json({ message: "Gift box not found" });

    // 1. Update card_option
    giftBox.card_option = card_option;

    // 2. Get base total without card cost (items + delivery)
    const cart = await CartGiftBox.findById(giftBox.cart_source_id).populate(
      "items"
    );
    if (!cart || !cart.items) {
      return res.status(400).json({ message: "Cart or items not found" });
    }

    const itemsTotal = cart.items.reduce((sum, item) => sum + item.price, 0);
    const deliveryFee = 300;

    let cardCost = 0;
    if (card_option === "standard") cardCost = 250;
    else if (card_option === "premium") cardCost = 500;

    giftBox.total_price = itemsTotal + deliveryFee + cardCost;

    await giftBox.save();

    res.status(200).json({
      message: "Card option updated and total price recalculated",
      giftBox,
    });
  } catch (error) {
    console.error("Card option update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/gift-box/:id/update-details
const updateGiftBoxDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { card_option, message } = req.body;

    const validOptions = ["standard", "premium", "no_card"];
    if (!validOptions.includes(card_option)) {
      return res.status(400).json({ message: "Invalid card option" });
    }

    const giftBox = await GiftBox.findById(id);
    if (!giftBox)
      return res.status(404).json({ message: "Gift box not found" });

    // Update card and message
    giftBox.card_option = card_option;
    giftBox.message = card_option === "no_card" ? "" : message || "";

    // ⬇️ Recalculate price
    const cart = await CartGiftBox.findById(giftBox.cart_source_id).populate(
      "items"
    );
    if (!cart || !cart.items) {
      return res.status(400).json({ message: "Cart or items not found" });
    }

    const itemsTotal = cart.items.reduce((sum, item) => sum + item.price, 0);
    const deliveryFee = 300;

    let cardCost = 0;
    if (card_option === "standard") cardCost = 250;
    else if (card_option === "premium") cardCost = 500;

    giftBox.total_price = itemsTotal + deliveryFee + cardCost;

    await giftBox.save();

    res.status(200).json({ message: "Gift box updated", giftBox });
  } catch (error) {
    console.error("Update gift box details error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createFromCart,
  getByCartId,
  updateCardOption,
  updateGiftBoxDetails,
};
