const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Credential = require("../models/credential");
const Customer = require("../models/customer");
const Vendor = require("../models/vendor");

const SECRET_KEY = process.env.SECRET_KEY;

// Helper: Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper: Validate phone number (10 digits)
const isValidPhoneNumber = (number) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(number);
};

// Helper: Generate JWT Token
const generateToken = (credential) => {
  return jwt.sign(
    {
      id: credential._id,
      role: credential.role,
      referenceId: credential.referenceId,
      email: credential.email,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

// Customer Registration
const customerRegister = async (req, res) => {
  try {
    const { email, password, name, phoneNumber, address } = req.body;

    // Validate required fields
    if (!email || !password || !name || !phoneNumber || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }

    // Check if email exists
    const existingCredential = await Credential.findOne({ email });
    if (existingCredential) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Create Customer
    const customer = new Customer({ name, phoneNumber, address });
    const savedCustomer = await customer.save();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Credential
    const credential = new Credential({
      email,
      password: hashedPassword,
      role: "customer",
      referenceId: savedCustomer._id,
    });

    await credential.save();

    return res
      .status(201)
      .json({ message: "Customer registered successfully" });
  } catch (error) {
    console.error("Customer Registration Error:", error);
    return res
      .status(500)
      .json({ message: "Server error during customer registration" });
  }
};

// Vendor Registration
const vendorRegister = async (req, res) => {
  try {
    const { email, password, name, phoneNumber, address, companyName } =
      req.body;

    if (
      !email ||
      !password ||
      !name ||
      !phoneNumber ||
      !address ||
      !companyName
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }

    const existingCredential = await Credential.findOne({ email });
    if (existingCredential) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const vendor = new Vendor({ name, phoneNumber, address, companyName });
    const savedVendor = await vendor.save();

    const hashedPassword = await bcrypt.hash(password, 10);

    const credential = new Credential({
      email,
      password: hashedPassword,
      role: "vendor",
      referenceId: savedVendor._id,
    });

    await credential.save();

    return res.status(201).json({ message: "Vendor registered successfully" });
  } catch (error) {
    console.error("Vendor Registration Error:", error);
    return res
      .status(500)
      .json({ message: "Server error during vendor registration" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const credential = await Credential.findOne({ email });
    if (!credential) {
      return res
        .status(401)
        .json({ message: "Invalid credentials, try again" });
    }

    const isMatch = await bcrypt.compare(password, credential.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials, try again" });
    }

    const token = generateToken(credential);

    return res.status(200).json({
      token,
      user: {
        id: credential._id,
        role: credential.role,
        email: credential.email,
        referenceId: credential.referenceId,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = {
  customerRegister,
  vendorRegister,
  login,
};
