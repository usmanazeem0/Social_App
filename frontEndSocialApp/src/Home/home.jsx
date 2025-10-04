import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import Header from "../components/header";
import axios from "axios";
import { FaHeart, FaRegComment, FaUserCircle } from "react-icons/fa";
import "./Home.css"; // Import the CSS file

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      //decode user info (e.g., user id) from token

      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded._id;

      const res = await axios.get("http://localhost:5000/posts/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const postsData = res.data.posts || [];

      //extract user info for like
      const likedIds = postsData
        .filter((p) => p.likes?.some((like) => like.user?._id === userId))
        .map((p) => p._id);
      setPosts(postsData);
      setLikedPosts(likedIds);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // function for like and unlike post

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      // Decode userId inside this function
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded._id;
      const res = await axios.post(
        `http://localhost:5000/likes/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { liked, post, totalLikes } = res.data;

      setLikedPosts((prev) =>
        liked ? [...prev, postId] : prev.filter((id) => id !== postId)
      );
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: liked
                  ? [...p.likes, { user: { _id: userId } }] // add current user
                  : p.likes.filter((l) => l.user._id !== userId),
                totalLikes: liked ? p.totalLikes + 1 : p.totalLikes - 1,
              }
            : p
        )
      );
    } catch (error) {
      console.log("error while like post", error);
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
                    <p className="post-username">{post.user.firstName}</p>
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
                    <button className="post-action-button comment">
                      <FaRegComment style={{ fontSize: "18px" }} />
                      <span style={{ fontWeight: "500", marginLeft: "5px" }}>
                        {post.comments?.length || 0}
                      </span>
                    </button>
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
    </div>
  );
}
