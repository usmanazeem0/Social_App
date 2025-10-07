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

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = new Comment({
      post: postId,
      user: userId,
      text: text.trim(),
    });
    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    // Populate user info before sending back
    await comment.populate("user", "firstName");

    return res.status(201).json({
      message: "Comment added successfully",
      comment,
      // post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error while adding comment" });
  }
};

//Get all comments for a post
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId }).populate(
      "user",
      "firstName"
    );
    populate({
      path: "replies", // populate replies array
      populate: {
        path: "user", // and inside each reply, populate its user
        select: "firstName",
      },
    }).sort({ createdAt: -1 });

    return res.status(200).json({ comments });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error while fetching comments" });
  }
};
