const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// import generate otp and expiry otp
const generateOtp = require("../utils/generateOtp");
const otpExpiry = require("../utils/otpExpiry");
const sendEmail = require("../utils/sendEmail");

exports.userSignup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    // check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // hash the user Password

    const hashPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    const otpExpires = otpExpiry(3);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      otp,
      otpExpires,
      isVerified: false,
    });

    await newUser.save();

    await sendEmail(email, "Verify your email", `Your OTP is: ${otp}`);
    res.status(200).json({
      success: true,
      message: "Signup successful! OTP sent to your email",
      email: email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// userLogin

exports.userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    // check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// user verification otp

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "user already verfied" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid otp" });
    }
    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
