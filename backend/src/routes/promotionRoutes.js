const express = require('express');
const router = express.Router();
const { getPromotions, createPromotion, updatePromotion } = require('../controllers/promotionController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getPromotions)
  .post(protect, admin, createPromotion);

router.route('/:id')
  .put(protect, admin, updatePromotion);

module.exports = router;
