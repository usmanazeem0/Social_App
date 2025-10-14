import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
// import axios from "axios";
import axiosInstance from "../api/axiosInstance";

import { IconButton, Menu, MenuItem } from "@mui/material";
import { Modal, Box, TextField, Button } from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FaUserCircle } from "react-icons/fa";
import Header from "../components/header";
import "../Home/home.css";

export default function Timeline() {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPostData, setEditPostData] = useState({
    title: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const decoded = jwtDecode(token);
    setUserId(decoded.id || decoded._id);
    fetchUserPosts(token, decoded.id || decoded._id);
  }, []);

  const fetchUserPosts = async (token, userId) => {
    try {
      // const res = await axios.get(
      //   `http://localhost:5000/posts/user/${userId}`,
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      const res = await axiosInstance.get(`/posts/user/${userId}`);
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const handleMenuOpen = (event, post) => {
    setMenuAnchor(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    if (document.activeElement) {
      document.activeElement.blur();
    }
    setMenuAnchor(null);
    setSelectedPost(null);
  };

  const handleEdit = (postId) => {
    const postToEdit = posts.find((p) => p._id === postId);
    if (!postToEdit) return;

    setEditPostData({
      id: postToEdit._id,
      title: postToEdit.title,
      description: postToEdit.description,
      image: null,
    });
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleDelete = async (postId) => {
    // const token = localStorage.getItem("token");
    // if (!token) return;
    try {
      // await axios.delete(`http://localhost:5000/posts/${postId}`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      await axiosInstance.delete(`/posts/${postId}`);

      setPosts((prev) => prev.filter((p) => p._id !== postId));
      handleMenuClose();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleUpdatePost = async () => {
    // const token = localStorage.getItem("token");
    // if (!token) return;

    try {
      const formData = new FormData();
      formData.append("title", editPostData.title);
      formData.append("description", editPostData.description);
      if (editPostData.image) {
        formData.append("image", editPostData.image);
      }

      // const res = await axios.put(
      //   `http://localhost:5000/posts/${editPostData.id}`,
      //   formData,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );

      const res = await axiosInstance.put(
        `/posts/${editPostData.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Update post in state
      setPosts((prev) =>
        prev.map((p) => (p._id === editPostData.id ? res.data.post : p))
      );

      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="home-container">
      <div className="header-fixed">
        <Header />
      </div>

      <div className="posts-container">
        <div className="posts-inner">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="post-card">
                {/* Profile Section */}
                <div className="post-profile">
                  <FaUserCircle className="post-avatar" />
                  <div className="post-user-info">
                    <p className="post-username">{post.user?.firstName}</p>
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
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, post)}
                    sx={{ marginLeft: "auto" }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </div>

                {/* Content Section */}
                <div className="post-content">
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-description">{post.description}</p>

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
              </div>
            ))
          ) : (
            <div className="no-posts">
              <p className="no-posts-title">You haven’t posted anything yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEdit(selectedPost?._id)}>Edit</MenuItem>
        <MenuItem onClick={() => handleDelete(selectedPost?._id)}>
          Delete
        </MenuItem>
      </Menu>

      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="edit-post-modal"
        aria-describedby="edit-post-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="edit-post-modal">Edit Post</h2>

          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            margin="normal"
            value={editPostData.title}
            onChange={(e) =>
              setEditPostData({ ...editPostData, title: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            value={editPostData.description}
            onChange={(e) =>
              setEditPostData({ ...editPostData, description: e.target.value })
            }
          />

          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2, mb: 2 }}
            fullWidth
          >
            Upload New Image
            <input
              type="file"
              hidden
              onChange={(e) =>
                setEditPostData({ ...editPostData, image: e.target.files[0] })
              }
            />
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleUpdatePost}
          >
            Update Post
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
