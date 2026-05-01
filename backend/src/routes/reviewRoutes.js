const express = require("express");
const router = express.Router();
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect, admin } = require("../middlewares/authMiddleware");

router.route("/").get(getReviews).post(protect, admin, createReview);
router
  .route("/:id")
  .put(protect, admin, updateReview)
  .delete(protect, admin, deleteReview);

module.exports = router;
