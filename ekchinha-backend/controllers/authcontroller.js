const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Credential = require("../models/credential");
const Customer = require("../models/customer");
const Vendor = require("../models/vendor");

const SECRET_KEY = process.env.SECRET_KEY;

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

    // Check if email exists in Credential collection
    const existingCredential = await Credential.findOne({ email });
    if (existingCredential) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Create Customer document
    const customer = new Customer({ name, phoneNumber, address });
    const savedCustomer = await customer.save();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Credential document linking to customer
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
      .json({ message: "Server error during registration" });
  }
};

// Vendor Registration
const vendorRegister = async (req, res) => {
  try {
    const { email, password, name, phoneNumber, address, companyName } =
      req.body;

    // Validate required fields
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

    // Check if email exists
    const existingCredential = await Credential.findOne({ email });
    if (existingCredential) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Create Vendor document
    const vendor = new Vendor({ name, phoneNumber, address, companyName });
    const savedVendor = await vendor.save();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Credential document linking to vendor
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
      .json({ message: "Server error during registration" });
  }
};

// Login - Generate JWT Token on success
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find credential by email
    const credential = await Credential.findOne({ email });
    if (!credential) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, credential.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(credential);

    // Respond with token and minimal user info
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
