const express = require("express");
const {
  login,
  logout,
  getUser,
  register,
  refreshToken,
  updateUser,
  updatePassword,
  deleteUser,
  logoutAll,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const verifyToken = require("../middleware/auth");

var router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/logout-all", logoutAll);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/user", verifyToken, getUser);
router.put("/user", verifyToken, updateUser);
router.put("/user/password", verifyToken, updatePassword);
router.delete("/user", verifyToken, deleteUser);

module.exports = router;
