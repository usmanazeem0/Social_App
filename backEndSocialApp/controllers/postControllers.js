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
