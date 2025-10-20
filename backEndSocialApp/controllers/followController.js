const FollowRequest = require("../models/follow");
const User = require("../models/user");

//  Send Follow Request
exports.sendFollowRequest = async (req, res) => {
  try {
    const senderId = req.user.id; // from auth middleware
    const receiverId = req.params.userId;
    const io = req.app.get("io");

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    //  Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver user not found." });
    }

    // Check if request already exists
    const existingRequest = await FollowRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: `Follow request already ${existingRequest.status}.` });
    }

    // Create new follow request
    const newRequest = await FollowRequest.create({
      sender: senderId,
      receiver: receiverId,
    });

    //  Emit to receiver
    io.to(receiverId.toString()).emit("followRequestSent", {
      senderId,
      receiverId,
      message: "You have a new follow request!",
    });

    return res.status(201).json({
      message: "Follow request sent successfully.",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error sending follow request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  Accept Follow Request
exports.acceptFollowRequest = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const senderId = req.params.userId;
    const io = req.app.get("io");

    const request = await FollowRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (!request)
      return res.status(404).json({ message: "Follow request not found." });

    request.status = "accepted";
    await request.save();

    //  Notify sender
    io.to(senderId.toString()).emit("followRequestAccepted", {
      senderId: senderId,
      receiverId: receiverId,
    });

    // Notify receiver to update notifications in all tabs
    io.to(receiverId.toString()).emit("followRequestUpdated");

    return res.status(200).json({ message: "Follow request accepted." });
  } catch (error) {
    console.error("Error accepting follow request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  Reject Follow Request
exports.rejectFollowRequest = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const senderId = req.params.userId;
    const io = req.app.get("io");

    const request = await FollowRequest.findOneAndDelete({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    // const request = await FollowRequest.findOne({
    //   sender: senderId,
    //   receiver: receiverId,
    //   status: "pending",
    // });

    if (!request)
      return res.status(404).json({ message: "Follow request not found." });

    // request.status = "rejected";
    // await request.save();

    // Notify sender
    io.to(senderId.toString()).emit("followRequestRejected", {
      senderId: senderId,
      receiverId: receiverId,
    });

    // Notify receiver to update notifications in all tabs
    io.to(receiverId.toString()).emit("followRequestUpdated");

    return res.status(200).json({ message: "Follow request rejected." });
  } catch (error) {
    console.error("Error rejecting follow request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  Unfollow User
exports.unfollowUser = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    const follow = await FollowRequest.findOneAndDelete({
      sender: senderId,
      receiver: receiverId,
      status: "accepted",
    });

    if (!follow)
      return res
        .status(404)
        .json({ message: "You are not following this user." });

    return res.status(200).json({ message: "Unfollowed successfully." });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all follow relationships for the logged-in user
exports.getFollowStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all requests where this user is sender or receiver
    const sentRequests = await FollowRequest.find({
      sender: userId,
    }).select("receiver status");

    const receivedRequests = await FollowRequest.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "firstName lastName avatar")
      .select("sender status createdAt");

    return res.status(200).json({
      sentRequests,
      receivedRequests,
    });
  } catch (error) {
    console.error("Error fetching follow status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
