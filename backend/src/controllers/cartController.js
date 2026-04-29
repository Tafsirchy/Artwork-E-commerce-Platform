const Cart = require("../models/Cart");

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Sync cart from frontend or add item
// @route   POST /api/cart
// @access  Private
const updateCart = async (req, res, next) => {
  try {
    const { items } = req.body; // Expects array of { product: productId, quantity }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    cart.items = items;
    await cart.save();
    
    // Return populated cart
    cart = await Cart.findById(cart._id).populate("items.product");
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, updateCart };
