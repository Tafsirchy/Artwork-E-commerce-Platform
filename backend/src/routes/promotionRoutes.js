const express = require('express');
const router = express.Router();
const { 
  getPromotions, 
  getAllPromotions, 
  createPromotion, 
  updatePromotion, 
  deletePromotion,
  validatePromotion
} = require('../controllers/promotionController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getPromotions)
  .post(protect, admin, createPromotion);

router.post('/validate', protect, validatePromotion);

router.get('/all', protect, admin, getAllPromotions);

router.route('/:id')
  .put(protect, admin, updatePromotion)
  .delete(protect, admin, deletePromotion);

module.exports = router;
