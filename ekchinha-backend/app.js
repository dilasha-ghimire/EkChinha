const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
require("dotenv").config();

const app = express();

// Imports
const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customer");
const vendorRoutes = require("./routes/vendor");
const productRoutes = require("./routes/product");
const cartGiftBoxRoutes = require("./routes/cartgiftbox");
const giftBoxRoutes = require("./routes/giftbox");
const vendorOrderRoutes = require("./routes/vendororder");
const giftBoxOrderHistoryRoutes = require("./routes/giftboxorderhistory");
const savedItemRoutes = require("./routes/saveditems");

// Middleware
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart-gift-box", cartGiftBoxRoutes);
app.use("/api/gift-box", giftBoxRoutes);
app.use("/api/vendor-orders", vendorOrderRoutes);
app.use("/api/gift-box-orders", giftBoxOrderHistoryRoutes);
app.use("/api/saved-items", savedItemRoutes);

// === Serve Frontend ===
const frontendPath = path.join(__dirname, "..", "ekchinha-frontend", "dist");
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
