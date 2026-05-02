const express = require("express");
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  forgotPassword,
  resetPassword,
  deleteUserProfile
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { validate, registerValidation, loginValidation } = require("../middlewares/validationMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post("/register", registerValidation, validate, registerUser);
router.post("/login", loginValidation, validate, loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.route("/profile")
  .get(protect, getUserProfile)
  .put(protect, upload.single("avatar"), updateUserProfile)
  .delete(protect, deleteUserProfile);

module.exports = router;
