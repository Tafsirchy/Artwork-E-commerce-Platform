const Promotion = require('../models/Promotion');

// @desc    Get all active promotions
// @route   GET /api/promotions
// @access  Public
const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({ isActive: true });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all promotions (Admin)
// @route   GET /api/promotions/all
// @access  Private/Admin
const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({}).sort({ createdAt: -1 });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a promotion
// @route   POST /api/promotions
// @access  Private/Admin
const createPromotion = async (req, res) => {
  const { title, code, discount, type, expiryDate } = req.body;
  try {
    const promotion = new Promotion({ title, code, discount, type, expiryDate });
    const createdPromotion = await promotion.save();
    res.status(201).json(createdPromotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a promotion
// @route   PUT /api/promotions/:id
// @access  Private/Admin
const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (promotion) {
      promotion.title = req.body.title || promotion.title;
      promotion.code = req.body.code || promotion.code;
      promotion.discount = req.body.discount || promotion.discount;
      promotion.type = req.body.type || promotion.type;
      promotion.expiryDate = req.body.expiryDate || promotion.expiryDate;
      promotion.isActive = req.body.isActive !== undefined ? req.body.isActive : promotion.isActive;
      
      const updatedPromotion = await promotion.save();
      res.json(updatedPromotion);
    } else {
      res.status(404).json({ message: 'Promotion not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (promotion) {
      await promotion.deleteOne();
      res.json({ message: 'Promotion removed' });
    } else {
      res.status(404).json({ message: 'Promotion not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getPromotions, getAllPromotions, createPromotion, updatePromotion, deletePromotion };
