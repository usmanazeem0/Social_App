const express = require("express");
const router = express.Router();

const { toggleLike, getLikes } = require("../controllers/likeController");
const likeMiddleware = require("../middleware/userAuth");

router.post("/:postId", likeMiddleware, toggleLike);
router.get("/:postId", likeMiddleware, getLikes);

module.exports = router;
