const SavedItem = require("../models/saveditems");
const GiftBox = require("../models/giftBox");

// Toggle Save or Unsave a Product or Admin-Created Gift Box
const saveItem = async (req, res) => {
  try {
    const { item_type, item_id } = req.body;
    const customer_id = req.user.id;

    if (!["product", "gift_box"].includes(item_type)) {
      return res.status(400).json({ message: "Invalid item type" });
    }

    if (item_type === "gift_box") {
      const giftBox = await GiftBox.findById(item_id);
      if (!giftBox || giftBox.created_by !== "admin_created") {
        return res
          .status(400)
          .json({ message: "Only admin-created gift boxes can be saved" });
      }
    }

    // Check if item is already saved
    const existing = await SavedItem.findOne({
      customer_id,
      item_type,
      item_id,
    });

    if (existing) {
      // Unsave (remove) the item
      await SavedItem.deleteOne({ _id: existing._id });
      return res.status(200).json({ message: "Item unsaved" });
    } else {
      // Save the item
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

// Get Saved Items for User
const getSavedItems = async (req, res) => {
  try {
    const customer_id = req.user.id;
    const savedItems = await SavedItem.find({ customer_id }).populate(
      "item_id"
    );

    res.status(200).json(savedItems);
  } catch (error) {
    console.error("Get Saved Items Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  saveItem,
  getSavedItems,
};
