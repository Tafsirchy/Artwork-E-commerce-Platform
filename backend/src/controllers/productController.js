const Product = require("../models/Product");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

const axios = require("axios");

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, stock, creator, category } = req.body;
    
    if (!req.file) {
      res.status(400);
      throw new Error("Please upload an artwork image");
    }

    // Upload to ImgBB
    const imageBase64 = req.file.buffer.toString("base64");
    const formData = new URLSearchParams();
    formData.append("image", imageBase64);

    const imgbbRes = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      formData
    );

    if (!imgbbRes.data || !imgbbRes.data.data.url) {
      res.status(500);
      throw new Error("ImgBB Upload Failed");
    }

    const imageUrl = imgbbRes.data.data.url;

    const product = new Product({
      title,
      description,
      price,
      imageUrl,
      stock,
      creator,
      category,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct };
