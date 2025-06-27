const Product = require("../models/product");

// 1. Create Product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      details,
      price,
      stock,
      product_significance,
      artisan_background,
      cultural_significance,
      vendor_id,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const newProduct = new Product({
      name,
      details,
      price,
      stock,
      product_significance,
      artisan_background,
      cultural_significance,
      vendor_id,
      image,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. View All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error("Get All Products Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 3. View Products by Vendor ID
const getProductsByVendorId = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const products = await Product.find({ vendor_id: vendorId });
    return res.status(200).json(products);
  } catch (error) {
    console.error("Get Vendor Products Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 4. Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    if (req.file) {
      const image = req.file.filename;
      updateData.image = image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res
      .status(200)
      .json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 5. Archive/Unarchive Product
const toggleArchiveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.archived = product.archived === "true" ? "false" : "true";
    await product.save();

    return res.status(200).json({
      message: `Product ${
        product.archived === "true" ? "archived" : "unarchived"
      }`,
    });
  } catch (error) {
    console.error("Toggle Archive Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 6. View Single Product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Looking for product:", id);
    const product = await Product.findById(id);

    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Found product:", product.name);
    res.status(200).json(product);
  } catch (error) {
    console.error("Get Product By ID Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductsByVendorId,
  updateProduct,
  toggleArchiveProduct,
  getProductById,
};
