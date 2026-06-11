const express = require("express");
const rateLimit = require("express-rate-limit");
const handleValidation = require("../middleware/handleValidation");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/authValidator");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/register",
  authLimiter,
  registerValidator,
  handleValidation,
  register,
);
router.post("/login", authLimiter, loginValidator, handleValidation, login);
router.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordValidator,
  handleValidation,
  forgotPassword,
);
router.post(
  "/reset-password/:token",
  authLimiter,
  resetPasswordValidator,
  handleValidation,
  resetPassword,
);

module.exports = router;
