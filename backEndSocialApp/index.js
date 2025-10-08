const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Serve static uploads folder
app.use("/uploads", express.static("uploads"));

const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/posts.routes");
const likeRoutes = require("./routes/likes.routes");
const commentRoutes = require("./routes/comments.routes");
const replyRoutes = require("./routes/reply.routes");
app.use("/user", userRoutes);
app.use("/posts", postRoutes);
app.use("/likes", likeRoutes);
app.use("/comments", commentRoutes);
app.use("/replies", replyRoutes);

const cleanRoutes = require("./routes/temporary.routes");
app.use("/api", cleanRoutes);

//mongoDb connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongoDb connected"))
  .catch((error) => {
    console.log("mongoDb connection error", error);
  });

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`server is running on the port ${PORT}`)
);

//make the socket that listen to the same server

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ],

    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// make global socket connection
io.on("connection", (socket) => {
  console.log("user connected ", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

//make socket available in routes and controllers
app.set("io", io);
