const express = require("express");
const {
  login,
  logout,
  getUser,
  register,
  refreshToken,
} = require("../controllers/auth.controller");
const verifyToken = require("../middleware/auth");

var router = require("express").Router();

router.post("/login", login);

router.post("/logout", logout);

router.post("/register", register);

router.get("/user", verifyToken, getUser);

router.post("/refresh", refreshToken);

module.exports = router;
