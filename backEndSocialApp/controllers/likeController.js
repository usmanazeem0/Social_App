const Like = require("../models/like");
const Post = require("../models/post");
const User = require("../models/user");

// toggle like and unlike

exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID missing in token" });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    //check for already like
    const existingLike = await Like.findOne({ post: postId, user: userId });
    let liked;
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      liked = false;
    } else {
      await Like.create({ user: userId, post: postId });
      liked = true;
    }

    // Fetch updated post with likes populated
    // const updatedPost = await Post.findById(postId)
    //   .populate("user", "firstName")
    //   .lean();

    const allLikes = await Like.find({ post: postId });
    const io = req.app.get("io");
    io.emit("likeUpdated", { postId, totalLikes: allLikes.length });
    //   .populate(
    //     "user",
    //     "firstName"
    //   );

    //   (updatedPost.likes = allLikes)
    // );
    return res.status(200).json({
      message: liked ? "Post liked" : "Post unliked",
      liked,
      totalLikes: allLikes.length,
      // post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error while toggling like" });
  }
};

// get all the likes of the post

exports.getLikes = async (req, res) => {
  try {
    const { postId } = req.params;

    const likes = await Like.find({ post: postId }).populate(
      "user",
      "firstName"
    );

    return res.status(200).json({ totalLikes: likes.length, likes });
  } catch (error) {
    return res.status(500).json({ error: "Server error while fetching likes" });
  }
};
