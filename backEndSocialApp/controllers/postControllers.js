const Post = require("../models/post");

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
      .populate({ path: "user", select: "firstName", options: { lean: true } })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      message: "All posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.log("Error in getAllPosts:", error);
    return res.status(500).json({ message: "server error" });
  }
};
