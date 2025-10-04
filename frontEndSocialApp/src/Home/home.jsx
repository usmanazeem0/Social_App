import React, { useState, useEffect } from "react";
import Header from "../components/header";
import axios from "axios";
import { FaHeart, FaRegComment, FaUserCircle } from "react-icons/fa";
import "./Home.css"; // Import the CSS file

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/posts/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <div className="home-container">
      {/* Fixed Header */}
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
                    <button className="post-action-button">
                      <FaHeart style={{ fontSize: "18px" }} />
                      <span style={{ fontWeight: "500" }}>
                        {post.likes?.length || 0}
                      </span>
                    </button>
                    <button className="post-action-button comment">
                      <FaRegComment style={{ fontSize: "18px" }} />
                      <span style={{ fontWeight: "500" }}>
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
