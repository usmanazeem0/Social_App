const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true, // associate post with a user
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String, // path to uploaded image
      required: true,
    },

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", // 🔹 reference Comment model
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
