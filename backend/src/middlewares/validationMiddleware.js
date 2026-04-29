const { body, validationResult } = require("express-validator");

// Middleware to check for validation errors and return a clean response
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

const registerValidation = [
  body("name").notEmpty().withMessage("Name is required").trim(),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const productValidation = [
  body("title").notEmpty().withMessage("Product title is required").trim(),
  body("description").notEmpty().withMessage("Description is required"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((val) => val > 0)
    .withMessage("Price must be greater than 0"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("creator").notEmpty().withMessage("Creator name is required").trim(),
];

module.exports = { validate, registerValidation, loginValidation, productValidation };
