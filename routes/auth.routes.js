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

var router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/logout-all", logoutAll);
router.post("/refresh", refreshToken);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/user/password", verifyToken, updatePassword);

router.get("/user", verifyToken, getUser);
router.put("/user", verifyToken, updateUser);
router.delete("/user", verifyToken, deleteUser);

module.exports = router;
