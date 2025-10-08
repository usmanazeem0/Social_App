import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "../components/header";
import axios from "axios";
import { FaHeart, FaRegComment, FaUserCircle } from "react-icons/fa";
import { io } from "socket.io-client";

import "./Home.css"; // Import the CSS file

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [showCommentBox, setShowCommentBox] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [userId, setUserId] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [activeReplyBox, setActiveReplyBox] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const decoded = jwtDecode(token);
    setUserId(decoded.id || decoded._id);
    fetchPosts(token, decoded.id || decoded._id);

    const socket = io("http://localhost:5000", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("socket connected", socket.id);
    });

    socket.on("likeUpdated", ({ postId, totalLikes }) => {
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, totalLikes } : p))
      );
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    return () => {
      socket.off("likeUpdated");
      socket.disconnect();
    };
  }, []);

  const fetchPosts = async (token, userIdFromToken) => {
    try {
      const res = await axios.get("http://localhost:5000/posts/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const postsData = res.data.posts || [];

      //extract user info for like
      const likedIds = postsData
        .filter((p) =>
          p.likes?.some((like) => like.user?._id === userIdFromToken)
        )
        .map((p) => p._id);
      setPosts(postsData);
      setLikedPosts(likedIds);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // function for like and unlike post

  const handleLike = async (postId) => {
    if (!userId) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/likes/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { liked, post, totalLikes } = res.data;

      setLikedPosts((prev) =>
        liked ? [...prev, postId] : prev.filter((id) => id !== postId)
      );
      // setPosts((prevPosts) =>
      //   prevPosts.map((p) =>
      //     p._id === postId
      //       ? {
      //           ...p,
      //           likes: liked
      //             ? [...(p.likes || []), { user: { _id: userId } }]
      //             : (p.likes || []).filter((l) => l.user._id !== userId),
      //           totalLikes: liked
      //             ? (p.totalLikes || 0) + 1
      //             : (p.totalLikes || 0) - 1,
      //         }
      //       : p
      //   )
      // );
    } catch (error) {
      console.log("error while like post", error);
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/comments/${postId}`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComment = res.data.comment;

      // Attach current user info to the new comment
      // const newComment = {
      //   _id: res.data.comment._id, // from backend
      //   text: commentText,
      //   user: { _id: userId, firstName: "You" }, // or get firstName from your state
      //   createdAt: new Date().toISOString(),
      // };

      // updatedPost.comments = [...(updatedPost.comments || []), newComment];

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, comments: [...(p.comments || []), newComment] }
            : p
        )
      );

      toast.success("Comment posted successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setCommentText("");
      setShowCommentBox(null);
    } catch (error) {
      console.log("error while commenting", error);
      toast.error("Failed to post comment.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleReplySubmit = async (commentId, postId, text) => {
    if (!text.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const body = { text };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(
        `http://localhost:5000/replies/${commentId}`,
        body,
        config
      );

      // save new reply
      const newReply = res.data.reply;

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                comments: p.comments.map((c) =>
                  c._id === commentId
                    ? { ...c, replies: [...(c.replies || []), newReply] }
                    : c
                ),
              }
            : p
        )
      );

      setReplyTexts((prev) => ({ ...prev, [commentId]: "" }));
      setActiveReplyBox(null);
      toast.success("Reply posted successfully!", { autoClose: 2000 });
    } catch (error) {
      console.log("error while reply", error);
      toast.error("Failed to post reply.", { autoClose: 2000 });
    }
  };

  return (
    <div className="home-container">
      <div className="header-fixed">
        <Header />
      </div>

      {/* Posts Container */}
      <div className="posts-container">
        <div className="posts-inner">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="post-card">
                {/* Profile Section */}
                <div className="post-profile">
                  <FaUserCircle className="post-avatar" />
                  <div className="post-user-info">
                    <p className="post-username">
                      {post?.user?.firstName || "Unknown"}
                    </p>
                    <p className="post-time">
                      {new Date(post.createdAt).toLocaleString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="post-content">
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-description">{post.description}</p>

                  {/* Image Section */}
                  {post.imageUrl && (
                    <div className="post-image-container">
                      <img
                        src={`http://localhost:5000/${post.imageUrl}`}
                        alt="Post"
                        className="post-image"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Actions Section */}
                <div className="post-actions">
                  <div className="post-actions-inner">
                    <button
                      className="post-action-button"
                      onClick={() => handleLike(post._id)}
                      style={{
                        color: likedPosts.includes(post._id)
                          ? "#dc2626"
                          : "inherit",
                      }}
                    >
                      <FaHeart
                        style={{
                          fontSize: "18px",
                          color: likedPosts.includes(post._id)
                            ? "#dc2626"
                            : "#6b7280",
                          transition: "color 0.2s ease",
                        }}
                      />
                      <span style={{ fontWeight: "500", marginLeft: "5px" }}>
                        {post.totalLikes ?? 0}
                      </span>
                    </button>
                    <button
                      className="post-action-button comment"
                      onClick={() =>
                        setShowCommentBox(
                          showCommentBox === post._id ? null : post._id
                        )
                      }
                    >
                      <FaRegComment style={{ fontSize: "18px" }} />
                      <span style={{ fontWeight: "500", marginLeft: "5px" }}>
                        {post.comments?.length || 0}
                      </span>
                    </button>

                    {showCommentBox === post._id && (
                      <div className="comment-box">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button
                          className="comment-submit"
                          disabled={!commentText.trim()}
                          onClick={() => handleCommentSubmit(post._id)}
                        >
                          Post
                        </button>
                      </div>
                    )}

                    {post.comments?.length > 0 && (
                      <div className="comments-list">
                        {post.comments?.filter(Boolean).map((comment) => (
                          <div key={comment._id} className="comment-item">
                            <p className="font-semibold">
                              {comment?.user?.firstName || "Unknown"}
                            </p>
                            <p className="comment-text">
                              {comment?.text || "No comment text"}
                            </p>
                            <p className="comment-date">
                              {comment?.createdAt
                                ? new Date(comment.createdAt).toLocaleString(
                                    [],
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )
                                : ""}
                            </p>

                            {/* Reply Button */}
                            <button
                              className="reply-button"
                              onClick={() =>
                                setActiveReplyBox(
                                  activeReplyBox === comment._id
                                    ? null
                                    : comment._id
                                )
                              }
                            >
                              Reply
                            </button>

                            {/* Reply Input Box */}
                            {activeReplyBox === comment._id && (
                              <div className="reply-box">
                                <input
                                  type="text"
                                  placeholder="Write a reply..."
                                  value={replyTexts[comment._id] || ""}
                                  onChange={(e) =>
                                    setReplyTexts({
                                      ...replyTexts,
                                      [comment._id]: e.target.value,
                                    })
                                  }
                                />
                                <button
                                  className="reply-submit"
                                  disabled={!replyTexts[comment._id]?.trim()}
                                  onClick={() =>
                                    handleReplySubmit(
                                      comment._id,
                                      post._id,
                                      replyTexts[comment._id]
                                    )
                                  }
                                >
                                  Post
                                </button>
                              </div>
                            )}

                            {/*  Show Replies */}
                            {Array.isArray(comment.replies) &&
                              comment.replies?.length > 0 && (
                                <div className="replies-list">
                                  {comment.replies?.map((reply) => (
                                    <div
                                      key={
                                        reply._id ||
                                        `${comment._id}-${Math.random()}`
                                      }
                                      className="reply-item"
                                    >
                                      <p className="font-semibold">
                                        {reply?.user?.firstName || "Unknown"}
                                      </p>
                                      <p className="comment-text">
                                        {reply?.text}
                                      </p>
                                      <p className="comment-date">
                                        {reply?.createdAt
                                          ? new Date(
                                              reply.createdAt
                                            ).toLocaleString([], {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })
                                          : ""}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-posts">
              <p className="no-posts-title">No posts yet.</p>
              <p className="no-posts-subtitle">
                Be the first to create a post!
              </p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
