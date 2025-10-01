const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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

const userRoutes = require("./routes/user.routes");
app.use("/user", userRoutes);

//mongoDb connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongoDb connected"))
  .catch((error) => {
    console.log("mongoDb connection error", error);
    resizeBy
      .status(500)
      .json({ message: "server error", error: error.message });
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on the port ${PORT}`));
