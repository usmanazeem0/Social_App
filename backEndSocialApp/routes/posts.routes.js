const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadAuth");
const verifyToken = require("../middleware/userAuth");
const { createPost } = require("../controllers/postControllers");

// create post
router.post("/create", verifyToken, upload.single("image"), createPost);

module.exports = router;
