const express = require("express");
const {
  login,
  logout,
  register,
  refreshToken,
  logoutAll,
} = require("../controllers/auth.controller");
const {
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const {
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/password.controller");
const verifyToken = require("../middleware/auth");
const { loginLimiter, forgotPasswordLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  updateUserSchema,
} = require("../schemas/auth.schema");

var router = require("express").Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/logout", validate(logoutSchema), logout);
router.post("/logout-all", verifyToken, logoutAll);
router.post("/refresh", validate(refreshTokenSchema), refreshToken);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validate(forgotPasswordSchema),
  forgotPassword
);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.put(
  "/user/password",
  verifyToken,
  validate(updatePasswordSchema),
  updatePassword
);

router.get("/user", verifyToken, getUser);
router.put("/user", verifyToken, validate(updateUserSchema), updateUser);
router.delete("/user", verifyToken, deleteUser);

module.exports = router;
