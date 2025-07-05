const SavedItem = require("../models/saveditems");
const CartGiftBox = require("../models/cartgiftbox");
const Product = require("../models/product");

// Toggle Save or Unsave a Product or Admin-Created CartGiftBox
const saveItem = async (req, res) => {
  try {
    const { item_type, item_id } = req.body;
    const customer_id = req.user.id;

    if (!["product", "cart_gift_box"].includes(item_type)) {
      return res.status(400).json({ message: "Invalid item type" });
    }

    // Validate cart_gift_box: only admin-created ones can be saved
    if (item_type === "cart_gift_box") {
      const box = await CartGiftBox.findById(item_id);
      if (!box || box.created_by !== "admin_created") {
        return res
          .status(400)
          .json({ message: "Only admin-created cart gift boxes can be saved" });
      }
    }

    // Check if already saved
    const existing = await SavedItem.findOne({
      customer_id,
      item_type,
      item_id,
    });

    if (existing) {
      await SavedItem.deleteOne({ _id: existing._id });
      return res.status(200).json({ message: "Item unsaved" });
    } else {
      const newSaved = await SavedItem.create({
        customer_id,
        item_type,
        item_id,
      });
      return res.status(201).json({ message: "Item saved", saved: newSaved });
    }
  } catch (error) {
    console.error("Toggle Save Item Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all saved items with populated references
const getSavedItems = async (req, res) => {
  try {
    const customer_id = req.user.id;
    const savedItems = await SavedItem.find({ customer_id });

    const populated = await Promise.all(
      savedItems.map(async (item) => {
        let populatedItem = null;

        if (item.item_type === "product") {
          populatedItem = await Product.findById(item.item_id);
        } else if (item.item_type === "cart_gift_box") {
          populatedItem = await CartGiftBox.findById(item.item_id);
        }

        return {
          ...item.toObject(),
          item_id: populatedItem,
        };
      })
    );

    res.status(200).json(populated.filter((item) => item.item_id !== null));
  } catch (error) {
    console.error("Get Saved Items Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  saveItem,
  getSavedItems,
};
