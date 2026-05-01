const ProductReview = require("../models/ProductReview");
const Product = require("../models/Product");

// @desc    Get all reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await ProductReview.find({ product: req.params.id })
      .sort({ createdAt: -1 });

    const totalRatings = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = reviews.length ? (totalRatings / reviews.length).toFixed(1) : 0;

    res.json({ reviews, avgRating: Number(avgRating), totalReviews: reviews.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Artwork not found");
    }

    // Check if user already reviewed
    const existing = await ProductReview.findOne({
      product: req.params.id,
      user: req.user._id,
    });
    if (existing) {
      res.status(400);
      throw new Error("You have already reviewed this artwork");
    }

    const review = await ProductReview.create({
      product: req.params.id,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private (owner only)
const updateProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const review = await ProductReview.findById(req.params.reviewId);
    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    // Only the owner can edit
    if (review.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to edit this review");
    }

    review.rating = Number(rating) || review.rating;
    review.comment = comment || review.comment;

    const updated = await review.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private (owner or admin)
const deleteProductReview = async (req, res, next) => {
  try {
    const review = await ProductReview.findById(req.params.reviewId);
    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error("Not authorized to delete this review");
    }

    await ProductReview.deleteOne({ _id: review._id });
    res.json({ message: "Review removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
};
