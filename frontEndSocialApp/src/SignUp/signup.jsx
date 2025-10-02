import axios from "axios";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // eye icons
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./signup.css";
export default function Signup() {
  const navigate = useNavigate();

  // states for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(3, "First Name must be at least 3 characters")
        .matches(
          /^[A-Za-z]{3,}( [A-Za-z]{3,})?$/,
          "Name should not contain number special character and spaces"
        )
        .required("first Name is required"),

      //last name

      lastName: Yup.string()
        .min(3, "last Name must be at least 3 characters")
        .matches(
          /^[A-Za-z]{3,}( [A-Za-z]{3,})?$/,
          "last Name should not contain number or special character or spaces"
        )
        .required("last Name is required"),

      //email

      email: Yup.string()
        .matches(
          /^(?!\s)([A-Za-z0-9._%+-]+)@(gmail\.com|yahoo\.com|hotmail\.com)(?!\s)$/,
          "email should be valid"
        )
        .email("Invalid email format")
        .required("Email is required"),

      //password

      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[0-9]/, "Password must contain a number")
        .matches(/[A-Z]/, "Password must contain an uppercase letter")
        .matches(/[!@#$%^&*]/, "Password must contain a special character")
        .required("Password is required"),

      //confirm Password

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post("http://localhost:5000/user/signup", {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        });

        const message = response?.data?.message || "Signup successful";

        toast.success(message, {
          position: "top-right",
          autoClose: 3000,
        });
        // Save the email to localStorage for OTP verification
        localStorage.setItem("signupEmail", values.email);
        resetForm();
        // Navigate to verify-otp
        navigate("/verify-otp", { state: { email: values.email } });
      } catch (error) {
        console.log(error.response.data);
        toast.error(error.response?.data?.message || "Signup failed", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  return (
    <div className="form-container">
      <form onSubmit={formik.handleSubmit}>
        <h2>Signup</h2>
        {/* first Name */}
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            {...formik.getFieldProps("firstName")}
          />

          {formik.touched.firstName && formik.errors.firstName ? (
            <p className="error">{formik.errors.firstName}</p>
          ) : null}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            {...formik.getFieldProps("lastName")}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <p className="error">{formik.errors.lastName}</p>
          ) : null}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...formik.getFieldProps("email")} />
          {formik.touched.email && formik.errors.email ? (
            <p className="error">{formik.errors.email}</p>
          ) : null}
        </div>
        {/* Password */}
        <div className="form-group password-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...formik.getFieldProps("password")}
            />

            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <p className="error">{formik.errors.password}</p>
          ) : null}
        </div>
        {/* Confirm Password */}
        <div className="form-group password-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              {...formik.getFieldProps("confirmPassword")}
            />

            <span
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <p className="error">{formik.errors.confirmPassword}</p>
          ) : null}
        </div>
        {/* Submit */}
        <button type="submit">Sign Up</button>
        {/* Already have account */}
        <p className="already-account">
          Already have an account?
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
