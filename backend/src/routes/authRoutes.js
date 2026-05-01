const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { validate, registerValidation, loginValidation } = require("../middlewares/validationMiddleware");

router.post("/register", registerValidation, validate, registerUser);
router.post("/login", loginValidation, validate, loginUser);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
