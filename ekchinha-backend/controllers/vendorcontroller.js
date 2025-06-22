const Vendor = require("../models/vendor");
const Credential = require("../models/credential");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Fetch vendor by ID
const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Is valid ObjectId:", mongoose.Types.ObjectId.isValid(id));

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vendor ID format" });
    }

    const vendor = await Vendor.findById(id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const credential = await Credential.findOne({
      referenceId: id,
      role: "vendor",
    });

    return res.status(200).json({
      ...vendor.toObject(),
      email: credential?.email,
    });
  } catch (error) {
    console.error("Get Vendor Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update vendor and email
const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phoneNumber, address, companyName, email } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { name, phoneNumber, address, companyName },
      { new: true }
    );

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    await Credential.findOneAndUpdate(
      { referenceId: id, role: "vendor" },
      { email }
    );

    return res
      .status(200)
      .json({ message: "Vendor updated successfully", vendor });
  } catch (error) {
    console.error("Update Vendor Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Change password
const changeVendorPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const credential = await Credential.findOne({
      referenceId: id,
      role: "vendor",
    });
    if (!credential)
      return res.status(404).json({ message: "Credentials not found" });

    const isMatch = await bcrypt.compare(oldPassword, credential.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect old password" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    credential.password = hashedNewPassword;
    await credential.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getVendorById,
  updateVendor,
  changeVendorPassword,
};
