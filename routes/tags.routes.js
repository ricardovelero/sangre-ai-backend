const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const tagController = require("../controllers/tags.controller");
// Create a new tag
// POST /api/tags
router.post("/", verifyToken, tagController.createTag);

// Get all tags (optionally filter by user)
// GET /api/tags
router.get("/", verifyToken, tagController.getTags);

// Get a specific tag and its associated analytics
// GET /api/tags/:tagId
router.get("/:tagId", verifyToken, tagController.getTag);

// Delete a tag
// DELETE /api/tags/:tagId
router.delete("/:tagId", verifyToken, tagController.deleteTag);

module.exports = router;
