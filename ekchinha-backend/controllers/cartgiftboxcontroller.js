const CartGiftBox = require("../models/cartgiftbox");

// 1. Create a Cart Gift Box (Draft)
const createCartGiftBox = async (req, res) => {
  try {
    const { name, items, card_option, message } = req.body;

    if (!items || items.length < 3 || items.length > 5) {
      return res.status(400).json({
        message: "Gift box must contain between 3 and 5 items.",
      });
    }

    const newCart = await CartGiftBox.create({
      customer_id: req.user.id,
      name,
      items,
      card_option,
      message,
      created_by: "user_created",
      checked_out: false,
    });

    res.status(201).json({ message: "Cart gift box created", cart: newCart });
  } catch (error) {
    console.error("Create Cart Gift Box Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Add a Product to Cart Gift Box
const addProductToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id } = req.body;

    const updatedCart = await CartGiftBox.findById(id);
    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (updatedCart.items.length >= 5) {
      return res
        .status(400)
        .json({ message: "Cannot add more than 5 items to a gift box." });
    }

    updatedCart.items.addToSet(product_id);
    await updatedCart.save();

    res.status(200).json({ message: "Product added", cart: updatedCart });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. Remove a Product from Cart Gift Box
const removeProductFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id } = req.body;

    const updatedCart = await CartGiftBox.findByIdAndUpdate(
      id,
      { $pull: { items: product_id } },
      { new: true }
    );

    res.status(200).json({ message: "Product removed", cart: updatedCart });
  } catch (error) {
    console.error("Remove Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 4. Get All Cart Gift Boxes for User (not checked out)
const getUserCartGiftBoxes = async (req, res) => {
  try {
    const carts = await CartGiftBox.find({
      customer_id: req.user.id,
      checked_out: false,
    }).populate("items");

    res.status(200).json(carts);
  } catch (error) {
    console.error("Get Cart Gift Boxes Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCartGiftBox,
  addProductToCart,
  removeProductFromCart,
  getUserCartGiftBoxes,
};
