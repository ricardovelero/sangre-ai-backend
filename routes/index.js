const express = require("express");

const uploadRoutes = require("./upload.routes");
const authRoutes = require("./auth.routes");

const router = express.Router();

router.use("/upload", uploadRoutes);
router.use("/auth", authRoutes);

module.exports = router;
