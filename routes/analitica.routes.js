const express = require("express");
const verifyToken = require("../middleware/auth");
const analitica = require("../controllers/analitica.controller");

var router = require("express").Router();

router.get("/", verifyToken, analitica.getTodasAnaliticas);

router.get("/series", verifyToken, analitica.getSerie);

router.get("/:id", verifyToken, analitica.getAnalitica);

module.exports = router;
