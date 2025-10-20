const express = require("express");
const router = express.Router();
const followController = require("../controllers/followController");
const authMiddleware = require("../middleware/userAuth");

// Send a follow request
router.post(
  "/send/:userId",
  authMiddleware,
  followController.sendFollowRequest
);

// Accept a follow request
router.put(
  "/accept/:userId",
  authMiddleware,
  followController.acceptFollowRequest
);

// Reject a follow request
router.put(
  "/reject/:userId",
  authMiddleware,
  followController.rejectFollowRequest
);

// Unfollow user
router.delete(
  "/unfollow/:userId",
  authMiddleware,
  followController.unfollowUser
);

// Get follow status for logged-in user
router.get("/requests", authMiddleware, followController.getFollowStatus);

module.exports = router;
