const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const tagController = require("../controllers/tags.controller");

router.post("/", verifyToken, tagController.createOrAddTag);

router.get("/", verifyToken, tagController.getTags);

router.get("/:tagId", verifyToken, tagController.getTag);

router.delete("/:tagId/:analiticaId", verifyToken, tagController.removeTag);

router.delete("/:tagId/", verifyToken, tagController.deleteTag);

module.exports = router;
