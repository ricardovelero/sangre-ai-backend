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

router.get("/user", verifyToken, getUser);

router.post("/refresh", verifyToken, refreshToken);

router.put("/user", verifyToken, updateUser);

router.put("/user/password", verifyToken, updatePassword);

router.post("/forgot-password", verifyToken, forgotPassword);

router.post("/reset-password", verifyToken, resetPassword);

router.delete("/user", verifyToken, deleteUser);

module.exports = router;
