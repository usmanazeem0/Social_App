const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadAuth");
const verifyToken = require("../middleware/userAuth");
const {
  createPost,
  getAllPosts,
  getUserPosts,
  updatePost,
  deletePost,
} = require("../controllers/postControllers");

// create post
router.post("/create", verifyToken, upload.single("image"), createPost);

// get alll the posts
router.get("/all", verifyToken, getAllPosts);

// Get all posts by user (for timeline)
router.get("/user/:userId", verifyToken, getUserPosts);

// Update post
router.put("/:postId", verifyToken, upload.single("image"), updatePost);

// Delete post
router.delete("/:postId", verifyToken, deletePost);
module.exports = router;
