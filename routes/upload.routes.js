const express = require("express");
const multer = require("multer");
const uploads = require("../controllers/upload.controller.js");
// const verifyToken = require("../middleware/auth");

const router = express.Router();

const upload = multer({ dest: "/tmp/" });

// Upload PDF
router.post("/upload", upload.single("file"), uploads.upload);

module.exports = router;
