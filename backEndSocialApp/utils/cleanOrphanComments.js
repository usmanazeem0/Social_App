const Comment = require("../models/comment");
const Post = require("../models/post");

async function cleanOrphanComments() {
  const comments = await Comment.find({}, "_id");
  const validIds = comments.map((c) => c._id.toString());

  const posts = await Post.find();
  for (const post of posts) {
    const filtered = post.comments.filter((id) =>
      validIds.includes(id.toString())
    );
    if (filtered.length !== post.comments.length) {
      post.comments = filtered;
      await post.save();
      console.log(`Cleaned post: ${post._id}`);
    }
  }

  console.log("✅ Orphaned comment references removed.");
}
module.exports = cleanOrphanComments;
