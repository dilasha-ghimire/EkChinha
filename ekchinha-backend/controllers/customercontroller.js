const Customer = require("../models/customer");
const Credential = require("../models/credential");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Fetch customer by ID
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Is valid ObjectId:", mongoose.Types.ObjectId.isValid(id));

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid customer ID format" });
    }

    const customer = await Customer.findById(id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const credential = await Credential.findOne({
      referenceId: id,
      role: "customer",
    });

    return res.status(200).json({
      ...customer.toObject(),
      email: credential?.email,
    });
  } catch (error) {
    console.error("Get Customer Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update customer and email
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phoneNumber, address, email } = req.body;

    if (!name || !phoneNumber || !address || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!phoneRegex.test(phoneNumber)) {
      return res
        .status(400)
        .json({ message: "Phone number must be exactly 10 digits" });
    }

    const customer = await Customer.findByIdAndUpdate(
      id,
      { name, phoneNumber, address },
      { new: true }
    );

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    await Credential.findOneAndUpdate(
      { referenceId: id, role: "customer" },
      { email }
    );

    return res
      .status(200)
      .json({ message: "Customer updated successfully", customer });
  } catch (error) {
    console.error("Update Customer Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Change password
const changeCustomerPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const credential = await Credential.findOne({
      referenceId: id,
      role: "customer",
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
  getCustomerById,
  updateCustomer,
  changeCustomerPassword,
};
