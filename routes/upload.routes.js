const express = require("express");
const uploads = require("../controllers/upload.controller.js");
// const verifyToken = require("../middleware/auth");

const router = express.Router();

// Upload PDF
router.post("/upload", uploads.upload);

module.exports = router;
