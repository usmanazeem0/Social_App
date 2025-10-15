const mongoose = require("mongoose");

// define the schema for user

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 3 },
    lastName: { type: String, required: true, minLength: 3 },
    email: { type: String, required: true, unique: true },
    dob: {
      type: Date,
      required: true,
    },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
