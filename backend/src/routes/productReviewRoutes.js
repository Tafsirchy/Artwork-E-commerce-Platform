const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams gives access to :id from parent
const {
  getProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
} = require("../controllers/productReviewController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/")
  .get(getProductReviews)
  .post(protect, createProductReview);

router.route("/:reviewId")
  .put(protect, updateProductReview)
  .delete(protect, deleteProductReview);

module.exports = router;
