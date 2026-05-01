const Product = require("../models/Product");
const axios = require("axios");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Database error, serving mock products:", error.message);
    const mockProducts = [
      {
        _id: "mock1",
        title: "Celestial Bloom",
        creator: "Elias Vance",
        price: 2400,
        imageUrl: "https://images.unsplash.com/photo-1705711714839-cf327143c4a0?q=80&w=687&auto=format&fit=crop",
        category: "Abstract"
      },
      {
        _id: "mock2",
        title: "The Silent Canvas",
        creator: "Sarah Thorne",
        price: 1850,
        imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1170&auto=format&fit=crop",
        category: "Minimalism"
      },
      {
        _id: "mock3",
        title: "Primal Echo",
        creator: "Marcus Reel",
        price: 3200,
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200",
        category: "Expressionism"
      }
    ];
    res.json(mockProducts);
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
    console.error("Database error in getProductById:", error.message);
    if (req.params.id.startsWith("mock")) {
       return res.json({
        _id: req.params.id,
        title: "Masterpiece (Mock)",
        description: "A beautiful artwork from our collection.",
        price: 2500,
        imageUrl: "https://images.unsplash.com/photo-1705711714839-cf327143c4a0?q=80&w=687&auto=format&fit=crop",
        creator: "Unknown Artist",
        category: "Abstract",
        stock: 1
      });
    }
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, stock, creator, category, colorConcept } = req.body;
    
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
      colorConcept: colorConcept ? colorConcept.split(",").map(c => c.trim()) : [],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { title, description, price, offerPrice, stock, creator, category, colorConcept } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price || product.price;
      product.offerPrice = offerPrice !== undefined ? offerPrice : product.offerPrice;
      product.stock = stock !== undefined ? stock : product.stock;
      product.creator = creator || product.creator;
      product.category = category || product.category;
      
      if (colorConcept) {
        product.colorConcept = Array.isArray(colorConcept) 
          ? colorConcept 
          : colorConcept.split(",").map(c => c.trim());
      }

      if (req.file) {
        const imageBase64 = req.file.buffer.toString("base64");
        const formData = new URLSearchParams();
        formData.append("image", imageBase64);

        const imgbbRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
          formData
        );
        product.imageUrl = imgbbRes.data.data.url;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: "Product removed" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
