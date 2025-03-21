const express = require("express");
const verifyToken = require("../middleware/auth");
const analitica = require("../controllers/analitica.controller");

var router = require("express").Router();

router.get("/", verifyToken, analitica.getTodasAnaliticas);

router.get("/series", verifyToken, analitica.getSerie);

router.get("/lipidos", verifyToken, analitica.getLipidos);

router.get("/:id", verifyToken, analitica.getAnalitica);

router.put("/:id", verifyToken, analitica.updateAnalitica);

router.delete("/:id", verifyToken, analitica.deleteAnalitica);

module.exports = router;
