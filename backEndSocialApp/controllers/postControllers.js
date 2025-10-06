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
        populate: {
          path: "user",
          model: "user", // ensure it matches your lowercase model name!
          select: "firstName",
        },
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
