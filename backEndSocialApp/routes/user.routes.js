const express = require("express");
const router = express.Router();

const User = require("../models/user");
const userController = require("../controllers/userController");

// define the routes

router.post("/signup", userController.userSignup);
router.post("/login", userController.userlogin);
router.post("/verify-otp", userController.verifyOtp);

module.exports = router;
