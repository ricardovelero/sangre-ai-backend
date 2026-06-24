const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createTagSchema } = require("../schemas/tags.schema");
const tagController = require("../controllers/tags.controller");

router.post("/", verifyToken, validate(createTagSchema), tagController.createOrAddTag);

router.get("/", verifyToken, tagController.getTags);

router.get("/:tagId", verifyToken, tagController.getTag);

router.delete("/:tagId/:analiticaId", verifyToken, tagController.removeTag);

router.delete("/:tagId/", verifyToken, tagController.deleteTag);

module.exports = router;
