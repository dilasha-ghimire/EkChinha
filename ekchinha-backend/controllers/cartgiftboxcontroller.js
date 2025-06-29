const CartGiftBox = require("../models/cartGiftBox");

// 1. Create a Cart Gift Box (Draft)
const createCartGiftBox = async (req, res) => {
  try {
    const { name, items, card_option, message } = req.body;

    const newCart = await CartGiftBox.create({
      customer_id: req.user.id,
      name,
      items,
      card_option,
      message,
      checked_out: false, // default false
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

    const updatedCart = await CartGiftBox.findByIdAndUpdate(
      id,
      { $addToSet: { items: product_id } },
      { new: true }
    );

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
