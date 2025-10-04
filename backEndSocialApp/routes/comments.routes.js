const express = require("express");
const router = express.Router();
const { addComment, getComments } = require("../controllers/commentController");
const commentMiddleware = require("../middleware/userAuth");

router.post("/:postId", commentMiddleware, addComment);
router.get("/:postId", commentMiddleware, getComments);

module.exports = router;
