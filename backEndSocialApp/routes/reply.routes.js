const express = require("express");
const router = express.Router();
const auth = require("../middleware/userAuth");
const replyController = require("../controllers/replyController");

router.post("/:commentId", auth, replyController.addReply);

// get api for replies

router.get("/:commentId", replyController.getAllReply);

module.exports = router;
