const express = require("express");
const router = express.Router();
const cleanOrphanComments = require("../utils/cleanOrphanComments");

router.get("/clean-comments", async (req, res) => {
  try {
    await cleanOrphanComments();
    res.send("✅ Orphaned comments cleaned successfully.");
  } catch (error) {
    console.error("Error cleaning comments:", error);
    res.status(500).send("Error cleaning comments");
  }
});

module.exports = router;
