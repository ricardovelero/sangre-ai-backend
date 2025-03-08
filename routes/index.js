const express = require("express");

const uploadRoutes = require("./upload.routes");

const router = express.Router();

router.use("/upload", uploadRoutes);

module.exports = router;
