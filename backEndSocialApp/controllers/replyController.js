const Reply = require("../models/reply");
const Comment = require("../models/comment");

// add reply to comment

exports.addReply = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Reply text is required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const reply = new Reply({
      comment: commentId,
      user: userId,
      text: text.trim(),
    });

    // await reply.save();

    // push reply id to comment.replies[]
    comment.replies.push(reply._id);
    await comment.save();

    // populate user before sending
    await reply.populate("user", "firstName");

    return res.status(201).json({
      message: "Reply added successfully",
      reply,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error while adding reply" });
  }
};

// get all the replies

exports.getAllReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const replies = await Reply.find({ comment: commentId })
      .populate("user", "firstName")
      .sort({ createdAt: 1 });

    return res.status(200).json({ replies });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Server error while fetching replies" });
  }
};
