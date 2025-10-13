const Post = require("../models/post");
const Like = require("../models/like");

// Create new post controller

exports.createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    //image is required
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // create post object

    const newPost = new Post({
      user: req.user.id || req.user._id,
      title,
      description,
      imageUrl: req.file.path,
    });

    // save the post in Db
    await newPost.save();

    return res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// get all posts

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: "user",
        select: "firstName", // post owner's name
      })

      .populate({
        path: "comments",
        populate: [
          {
            path: "user",
            model: "user",
            select: "firstName",
          },
          {
            path: "replies",
            populate: {
              path: "user",
              model: "user",
              select: "firstName",
            },
          },
        ],
      })
      .sort({ createdAt: -1 });

    //  For each post, count total likes
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likes = await Like.find({ post: post._id }).populate(
          "user",
          "firstName"
        );

        return {
          ...post.toObject(),
          likes,
          totalLikes: likes.length,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "All posts fetched successfully",
      posts: postsWithLikes,
    });
  } catch (error) {
    console.log("Error in getAllPosts:", error);
    return res.status(500).json({ message: "server error" });
  }
};

// get all the post of login user

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ user: userId })
      .populate("user", "firstName")
      .sort({ createdAt: -1 });

    if (!posts.length) {
      return res.status(200).json({
        success: true,
        message: "No posts found for this user",
        posts: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "User posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.log("error while getting posts of login user", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// update the post

exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, description } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Only owner can update
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (title) post.title = title;
    if (description) post.description = description;

    if (req.file) {
      post.imageUrl = req.file.path; // If user uploads new image
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.log("error while updating post", error);

    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//delete post

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Only owner can delete
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log("error while deleting the post", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
