import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./VerifyOtp.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // email passed from Signup.jsx
  const email = location.state?.email || localStorage.getItem("signupEmail");
  useEffect(() => {
    if (!email) {
      navigate("/signup"); // redirect if no email
    }
  }, [email, navigate]);
  if (!email) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/user/verify-otp", {
        email,
        otp,
      });
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
      localStorage.removeItem("signupEmail");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again.",
        { position: "top-right", autoClose: 3000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-box">
        <h2>Email Verification</h2>
        <p className="verify-subtext">
          Enter the OTP sent to <span>{email}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default VerifyOtp;
