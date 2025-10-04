const Comment = require("../models/comment");
const Post = require("../models/post");

// add new comment

exports.addComment = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { postId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const comment = new Comment({ post: postId, user: userId, text });
    await comment.save();

    return res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    console.log("Error adding comment:", error);
    return res.status(500).json({ error: "Server error while adding comment" });
  }
};

//Get all comments for a post
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate("user", "firstName")
      .sort({ createdAt: -1 });

    return res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res
      .status(500)
      .json({ error: "Server error while fetching comments" });
  }
};
