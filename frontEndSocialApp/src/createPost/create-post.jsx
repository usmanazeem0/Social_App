import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  LinearProgress,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Header from "../components/header";
export default function CreatePost() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!image) {
      toast.error("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    try {
      setUploadProgress(0);
      await axios.post("http://localhost:5000/posts/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          } else {
            setUploadProgress(100);
          }
        },
      });

      toast.success("Post created successfully!");
      navigate("/home"); // redirect to home after creating post
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post.");
      setUploadProgress(0);
    }
  };
  return (
    <>
      <Header />

      <Box sx={{ maxWidth: 500, mx: "auto", mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Create New Post
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            required
          />

          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
            sx={{ mt: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </Button>

          {image && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
                overflow: "hidden",
                borderRadius: "8px",
                border: "1px solid #ccc",
                maxWidth: "300px",
                maxHeight: "200px",
                mx: "auto",
              }}
            >
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          )}

          {/* ---------- PROGRESS BAR ---------- */}
          {uploadProgress > 0 && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" sx={{ mt: 0.5, textAlign: "center" }}>
                Uploading: {uploadProgress}%
              </Typography>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            fullWidth
          >
            Create Post
          </Button>
        </form>
      </Box>
    </>
  );
}
